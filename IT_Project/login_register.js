function applyStoredTheme() {
  const isDark = localStorage.getItem('theme') === 'dark';
  document.body.classList.toggle('dark', isDark);
  const btn = document.getElementById('darkToggleBtn');
  if (btn) btn.textContent = isDark ? '🌞' : '🌙';
}
function toggleDark() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  const btn = document.getElementById('darkToggleBtn');
  if (btn) btn.textContent = isDark ? '🌞' : '🌙';
}
applyStoredTheme();

// Registration profile photo (optional) — resized/compressed client-side,
// the same way the account panel's "edit profile" photo upload works, so
// a person can set their photo at signup instead of only afterwards.
let regPhotoDataUrl = null;
function resizeImageToDataUrl(file, maxDimension) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) { reject(new Error('Please choose an image file.')); return; }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Couldn't read that file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('That file is not a valid image.'));
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
(() => {
  const input = document.getElementById('regPhotoInput');
  const btn = document.getElementById('regPhotoBtn');
  const avatar = document.getElementById('regPhotoAvatar');
  if (!input || !btn || !avatar) return;
  btn.addEventListener('click', () => input.click());
  input.addEventListener('change', async () => {
    const file = input.files && input.files[0];
    if (!file) return;
    try {
      regPhotoDataUrl = await resizeImageToDataUrl(file, 480);
      avatar.innerHTML = `<img src="${regPhotoDataUrl}" alt="Profile photo preview">`;
    } catch (err) {
      setFeedback('registerFeedback', err.message || "Couldn't read that image, please try another file.", true);
    }
  });
})();

const registerPanel = document.getElementById('registerPanel');
const loginPanel = document.getElementById('loginPanel');
const verifyPanel = document.getElementById('verifyPanel');

function showPanel(panel) {
  [registerPanel, loginPanel, verifyPanel].forEach(p => p?.classList.add('hidden-panel'));
  panel?.classList.remove('hidden-panel');
}

document.getElementById('switchToLoginBtn').addEventListener('click', () => showPanel(loginPanel));
document.getElementById('switchToRegisterBtn').addEventListener('click', () => showPanel(registerPanel));
document.getElementById('backToLoginBtn')?.addEventListener('click', () => showPanel(loginPanel));

document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    if (!input) return;
    const hidden = input.type === 'password';
    input.type = hidden ? 'text' : 'password';
    btn.textContent = hidden ? '🙈' : '👁️';
  });
});

const regPassword = document.getElementById('regPassword');
const confirmPassword = document.getElementById('confirmPassword');
const passwordMatchMsg = document.getElementById('passwordMatchMsg');
function checkPasswordMatch() {
  if (!confirmPassword.value) { passwordMatchMsg.textContent=''; return true; }
  const ok = regPassword.value === confirmPassword.value;
  passwordMatchMsg.textContent = ok ? 'Passwords match ✓' : 'Passwords do not match';
  passwordMatchMsg.classList.toggle('match-success', ok);
  return ok;
}
regPassword.addEventListener('input', checkPasswordMatch);
confirmPassword.addEventListener('input', checkPasswordMatch);

const phoneInput = document.getElementById('phone');
const phoneErrorMsg = document.getElementById('phoneErrorMsg');
function checkPhone() {
  const digits = phoneInput.value.replace(/[^0-9]/g, '');
  if (!phoneInput.value) { phoneErrorMsg.textContent=''; return true; }
  const valid = /^[0-9+\s-]+$/.test(phoneInput.value) && digits.length >= 7 && digits.length <= 15;
  phoneErrorMsg.textContent = valid ? '' : 'Enter a valid phone number';
  return valid;
}
phoneInput.addEventListener('input', checkPhone);

const roleSelect = document.getElementById('accountRole');
const sellerVerification = document.getElementById('sellerVerification');
const driverVerification = document.getElementById('driverVerification');
const roleHint = document.getElementById('roleHint');
const roleHints = {
  buyer:'Buy products, pay securely and request deliveries.',
  seller:'List farm products after seller verification.',
  driver:'Accept local delivery jobs after driver + vehicle verification.'
};
function updateRoleFields(){
  const role=roleSelect?.value||'buyer';
  sellerVerification?.classList.toggle('hidden-panel',role!=='seller');
  driverVerification?.classList.toggle('hidden-panel',role!=='driver');
  if(roleHint) roleHint.textContent=roleHints[role];
}
roleSelect?.addEventListener('change',updateRoleFields); updateRoleFields();

function setFeedback(id, text, error=false) {
  const el=document.getElementById(id); if(!el) return;
  el.style.display='block'; el.textContent=text; el.classList.toggle('error-feedback',error);
}

// ---------------------------------------------------------------------
// Supabase-backed auth — LINK-based email confirmation.
//
// Registration and login go through Supabase Auth (supabaseClient.auth.*)
// instead of localStorage. Free Supabase projects can't customize the
// confirmation email to send a 6-digit code (that needs custom SMTP), so
// this uses Supabase's default confirmation LINK instead: after
// registering, the person is told to check their email and click the
// link; clicking it signs them in automatically (in whatever tab/browser
// they open it in), and the onAuthStateChange listener below finishes
// creating their profile and redirects them into the app.
//
// Requirements:
//   1. supabaseClient.js loaded BEFORE this file (defines the global
//      `supabaseClient` client — named that way, not `supabase`, to
//      avoid colliding with the CDN library's own global `supabase`
//      object).
//   2. A `profiles` table in Supabase for role/seller/driver/avatar data.
//   3. Supabase Authentication > URL Configuration: Site URL AND
//      Redirect URLs must include wherever this page is actually hosted
//      (e.g. your Vercel URL), or Supabase will refuse the redirect.
//
// NOTE: other pages (dashboard.html, etc.) that currently read
// localStorage.getItem('farmlinkUser') to check who's logged in will
// need to switch to supabaseClient.auth.getSession()/getUser() instead —
// Supabase manages its own session storage automatically now.
// ---------------------------------------------------------------------

class ApiError extends Error {
  constructor(message, data) { super(message); this.data = data || {}; }
}

function redirectForRole(role) {
  return role === 'driver' ? 'driver-dashboard.html' : 'dashboard.html';
}

// Where a link opens in a NEW tab (the usual case for email links),
// sessionStorage from the original tab wouldn't be visible there —
// localStorage is shared across tabs on the same browser/origin, so the
// pending registration details survive regardless of which tab the link
// opens in.
const PENDING_PROFILE_KEY = 'farmlinkPendingProfile';

// Fires whenever auth state changes, including the moment a confirmation
// link finishes signing someone in. If there's a pending registration
// waiting to be saved, finish it and move the person into the app.
supabaseClient.auth.onAuthStateChange(async (event, session) => {
  if (event !== 'SIGNED_IN' || !session) return;
  const pendingRaw = localStorage.getItem(PENDING_PROFILE_KEY);
  if (!pendingRaw) return; // a normal password login already handles its own redirect
  let pending = {};
  try { pending = JSON.parse(pendingRaw); } catch { /* ignore */ }
  try {
    await saveProfile(session.user.id, pending);
  } catch (err) {
    console.error(err);
  }
  localStorage.removeItem(PENDING_PROFILE_KEY);
  setFeedback('verifyFeedback', 'Email verified! Taking you into FarmLink...');
  document.body.classList.add('page-fade-out');
  setTimeout(() => { window.location.href = redirectForRole(pending.role || 'buyer'); }, 500);
});

// Saves the role/seller/driver/avatar details Supabase's own auth.users
// table has no room for. Called once we have an authenticated session
// (right after email verification succeeds).
async function saveProfile(userId, payload) {
  const profile = {
    id: userId,
    full_name: payload.full_name,
    phone: payload.phone,
    role: payload.role,
    avatar_url: payload.avatar_data || null
  };
  if (payload.role === 'seller') {
    profile.seller_id = payload.seller_id;
    profile.farm_location = payload.farm_location;
  }
  if (payload.role === 'driver') {
    profile.vehicle_make_model = payload.vehicle_make_model;
    profile.vehicle_year = payload.vehicle_year;
    profile.vehicle_plate = payload.vehicle_plate;
    profile.driver_area = payload.driver_area;
    profile.driving_experience = payload.driving_experience;
    profile.bank_account_details = payload.bank_account_details;
    profile.tax_number = payload.tax_number;
  }
  const { error } = await supabaseClient.from('profiles').upsert(profile);
  if (error) throw new ApiError('Account created, but saving your profile failed: ' + error.message);
}

async function supabaseRegister(payload) {
  const email = (payload.email || '').toLowerCase().trim();
  if (!payload.full_name || !email || !payload.password) {
    throw new ApiError('Invalid registration data');
  }
  const { error } = await supabaseClient.auth.signUp({
    email,
    password: payload.password,
    options: { data: { full_name: payload.full_name, role: payload.role || 'buyer' } }
  });
  if (error) throw new ApiError(error.message);
  // Stash the full form (role/seller/driver fields, avatar) so it can be
  // written to `profiles` once the confirmation link signs them in —
  // localStorage, not sessionStorage, so it's visible even if the link
  // opens in a brand new tab.
  localStorage.setItem(PENDING_PROFILE_KEY, JSON.stringify(payload));
  return { email };
}

async function supabaseResend({ email }) {
  const { error } = await supabaseClient.auth.resend({ type: 'signup', email });
  if (error) throw new ApiError(error.message);
  return { message: 'A new confirmation email has been sent.' };
}

async function supabaseLogin({ email, password }) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.message.toLowerCase().includes('confirm')) {
      await supabaseClient.auth.resend({ type: 'signup', email });
      throw new ApiError('Please verify your email before logging in. We sent another confirmation link.', {
        requires_email_verification: true, email
      });
    }
    throw new ApiError('Invalid credentials');
  }
  const { data: profile } = await supabaseClient.from('profiles').select('role').eq('id', data.user.id).single();
  return { user: data.user, redirect: redirectForRole(profile?.role || 'buyer') };
}

async function api(action, payload) {
  switch (action) {
    case 'register': return supabaseRegister(payload);
    case 'resend': return supabaseResend(payload);
    case 'login': return supabaseLogin(payload);
    default: throw new ApiError('Unknown auth action');
  }
}

// No more hidden #verificationEmail input to hold this between the
// register and resend steps, so a simple variable does the job.
let pendingVerificationEmail = '';

function openVerification(email) {
  pendingVerificationEmail = email;
  document.getElementById('verifyEmailLabel').textContent=email;
  showPanel(verifyPanel);
  setFeedback('verifyFeedback','Click the link in that email to finish creating your account.');
}

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const feedbackId='registerFeedback';
  const fullname=document.getElementById('fullname').value.trim();
  const email=document.getElementById('email').value.trim();
  const passwordsOk=checkPasswordMatch(), phoneOk=checkPhone();
  if(!fullname||!email||!phoneInput.value||!regPassword.value||!confirmPassword.value){ setFeedback(feedbackId,'Please fill in all fields.',true); return; }
  if(!phoneOk){ setFeedback(feedbackId,'Please enter a valid phone number.',true); return; }
  if(!passwordsOk){ setFeedback(feedbackId,'Passwords do not match.',true); return; }
  const role=roleSelect.value;
  if(role==='seller' && (!document.getElementById('sellerId').value.trim() || !document.getElementById('farmLocation').value.trim() || !document.getElementById('sellerDeclaration').checked)){
    setFeedback(feedbackId,'Seller verification details and declaration are required.',true); return;
  }
  const driverLicenceDoc=document.getElementById('driverLicenceDoc');
  const proofOfAddressDoc=document.getElementById('proofOfAddressDoc');
  const prdpDoc=document.getElementById('prdpDoc');
  const insuranceDoc=document.getElementById('insuranceDoc');
  const bankAccountDetails=document.getElementById('bankAccountDetails');
  if(role==='driver' && (!document.getElementById('vehicleMake').value.trim() || !document.getElementById('vehicleYear').value || !document.getElementById('vehiclePlate').value.trim() || !document.getElementById('driverArea').value.trim()
      || !driverLicenceDoc.files.length || !proofOfAddressDoc.files.length || !bankAccountDetails.value.trim() || !document.getElementById('driverDeclaration').checked)){
    setFeedback(feedbackId,'Vehicle details, your driver\'s licence, proof of address, bank details and the declaration are required.',true); return;
  }
  const payload={
    full_name:fullname,email,phone:phoneInput.value.trim(),password:regPassword.value,role,
    avatar_data:regPhotoDataUrl,
    seller_id:document.getElementById('sellerId')?.value.trim(),farm_location:document.getElementById('farmLocation')?.value.trim(),seller_declaration:document.getElementById('sellerDeclaration')?.checked,
    vehicle_make_model:document.getElementById('vehicleMake')?.value.trim(),vehicle_year:document.getElementById('vehicleYear')?.value,vehicle_plate:document.getElementById('vehiclePlate')?.value.trim(),driver_area:document.getElementById('driverArea')?.value.trim(),driver_declaration:document.getElementById('driverDeclaration')?.checked,
    driver_licence_doc:driverLicenceDoc?.files[0]?.name||'',prdp_doc:prdpDoc?.files[0]?.name||'',proof_of_address_doc:proofOfAddressDoc?.files[0]?.name||'',insurance_doc:insuranceDoc?.files[0]?.name||'',
    driving_experience:document.getElementById('drivingExperience')?.value.trim(),bank_account_details:bankAccountDetails?.value.trim(),tax_number:document.getElementById('taxNumber')?.value.trim()
  };
  try{
    const data=await api('register',payload);
    setFeedback(feedbackId,'Account created! Check your email to confirm it.');
    openVerification(data.email);
  }catch(err){ setFeedback(feedbackId,err.message,true); }
});

document.getElementById('resendCodeBtn').addEventListener('click',async()=>{
  if(!pendingVerificationEmail)return;
  try{const data=await api('resend',{email:pendingVerificationEmail});setFeedback('verifyFeedback',data.message);}
  catch(err){setFeedback('verifyFeedback',err.message,true);}
});

document.getElementById('loginForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const email=document.getElementById('loginUsername').value.trim(), password=document.getElementById('loginPassword').value;
  if(!email||!password){setFeedback('loginFeedback','Please enter your email and password.',true);return;}
  try{
    const data=await api('login',{email,password});
    setFeedback('loginFeedback','Login successful. Opening FarmLink...');
    document.body.classList.add('page-fade-out');
    setTimeout(()=>window.location.href=data.redirect||'dashboard.html',400);
  }catch(err){
    if(err.data?.requires_email_verification){ openVerification(err.data.email); return; }
    setFeedback('loginFeedback',err.message,true);
  }
});
