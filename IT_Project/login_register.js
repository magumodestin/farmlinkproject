function applyStoredTheme() {
  const isDark = localStorage.getItem("theme") === "dark";
  document.body.classList.toggle("dark", isDark);
  const btn = document.getElementById("darkToggleBtn");
  if (btn) btn.textContent = isDark ? "🌞" : "🌙";
}
function toggleDark() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  const btn = document.getElementById("darkToggleBtn");
  if (btn) btn.textContent = isDark ? "🌞" : "🌙";
}
applyStoredTheme();

// Registration profile photo (optional) — resized/compressed client-side,
// then uploaded to Supabase Storage right after the email is verified.
let regPhotoDataUrl = null;
function resizeImageToDataUrl(file, maxDimension) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Couldn't read that file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That file is not a valid image."));
      img.onload = () => {
        const scale = Math.min(
          1,
          maxDimension / Math.max(img.width, img.height),
        );
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
(() => {
  const input = document.getElementById("regPhotoInput");
  const btn = document.getElementById("regPhotoBtn");
  const avatar = document.getElementById("regPhotoAvatar");
  if (!input || !btn || !avatar) return;
  btn.addEventListener("click", () => input.click());
  input.addEventListener("change", async () => {
    const file = input.files && input.files[0];
    if (!file) return;
    try {
      regPhotoDataUrl = await resizeImageToDataUrl(file, 480);
      avatar.innerHTML = `<img src="${regPhotoDataUrl}" alt="Profile photo preview">`;
    } catch (err) {
      setFeedback(
        "registerFeedback",
        err.message || "Couldn't read that image, please try another file.",
        true,
      );
    }
  });
})();

const registerPanel = document.getElementById("registerPanel");
const loginPanel = document.getElementById("loginPanel");
const verifyPanel = document.getElementById("verifyPanel");
const verificationEmail = document.getElementById("verificationEmail");
const verificationCode = document.getElementById("verificationCode");

function showPanel(panel) {
  [registerPanel, loginPanel, verifyPanel].forEach((p) =>
    p?.classList.add("hidden-panel"),
  );
  panel?.classList.remove("hidden-panel");
}

document
  .getElementById("switchToLoginBtn")
  .addEventListener("click", () => showPanel(loginPanel));
document
  .getElementById("switchToRegisterBtn")
  .addEventListener("click", () => showPanel(registerPanel));
document
  .getElementById("backToLoginBtn")
  ?.addEventListener("click", () => showPanel(loginPanel));

document.querySelectorAll(".toggle-password").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    if (!input) return;
    const hidden = input.type === "password";
    input.type = hidden ? "text" : "password";
    btn.textContent = hidden ? "🙈" : "👁️";
  });
});

const regPassword = document.getElementById("regPassword");
const confirmPassword = document.getElementById("confirmPassword");
const passwordMatchMsg = document.getElementById("passwordMatchMsg");
function checkPasswordMatch() {
  if (!confirmPassword.value) {
    passwordMatchMsg.textContent = "";
    return true;
  }
  const ok = regPassword.value === confirmPassword.value;
  passwordMatchMsg.textContent = ok
    ? "Passwords match ✓"
    : "Passwords do not match";
  passwordMatchMsg.classList.toggle("match-success", ok);
  return ok;
}
regPassword.addEventListener("input", checkPasswordMatch);
confirmPassword.addEventListener("input", checkPasswordMatch);

const phoneInput = document.getElementById("phone");
const phoneErrorMsg = document.getElementById("phoneErrorMsg");
function checkPhone() {
  const digits = phoneInput.value.replace(/[^0-9]/g, "");
  if (!phoneInput.value) {
    phoneErrorMsg.textContent = "";
    return true;
  }
  const valid =
    /^[0-9+\s-]+$/.test(phoneInput.value) &&
    digits.length >= 7 &&
    digits.length <= 15;
  phoneErrorMsg.textContent = valid ? "" : "Enter a valid phone number";
  return valid;
}
phoneInput.addEventListener("input", checkPhone);

const roleSelect = document.getElementById("accountRole");
const sellerVerification = document.getElementById("sellerVerification");
const driverVerification = document.getElementById("driverVerification");
const roleHint = document.getElementById("roleHint");
const roleHints = {
  buyer: "Buy products, pay securely and request deliveries.",
  seller: "List farm products after seller verification.",
  driver: "Accept local delivery jobs after driver + vehicle verification.",
};
function updateRoleFields() {
  const role = roleSelect?.value || "buyer";
  sellerVerification?.classList.toggle("hidden-panel", role !== "seller");
  driverVerification?.classList.toggle("hidden-panel", role !== "driver");
  if (roleHint) roleHint.textContent = roleHints[role];
}
roleSelect?.addEventListener("change", updateRoleFields);
updateRoleFields();

function setFeedback(id, text, error = false) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = "block";
  el.textContent = text;
  el.classList.toggle("error-feedback", error);
}

// ---------------------------------------------------------------------
// Authentication — Supabase only (no PHP).
//  • Accounts + email codes: Supabase Auth
//  • Role + profile data:    `profiles` table (created by a DB trigger)
//  • Photo + driver docs:    Supabase Storage
// Run supabase-setup.sql once in the Supabase SQL Editor first.
// ---------------------------------------------------------------------

// ONE place that decides which page each role lands on.
// File names must match your real files exactly (capitals matter online).
const ROLE_PAGES = {
  buyer: "dashboard.html",
  seller: "sell-products.html",
  driver: "driver-dashboard.html",
};
function redirectForRole(role) {
  return ROLE_PAGES[role] || ROLE_PAGES.buyer;
}

async function getRole(user) {
  const { data } = await supabaseClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  return data?.role || "buyer";
}

let redirecting = false;
async function goToApp(user) {
  if (redirecting) return;
  redirecting = true;
  const role = await getRole(user);
  document.body.classList.add("page-fade-out");
  setTimeout(() => window.location.replace(redirectForRole(role)), 400);
}

// Already signed in? Skip the form and go straight to the right page.
supabaseClient.auth.getSession().then(({ data: { session } }) => {
  if (session) goToApp(session.user);
});

// Disables a submit button while a request is running.
async function withLoading(form, busyText, fn) {
  const btn = form.querySelector('button[type="submit"]');
  const original = btn ? btn.textContent : "";
  if (btn) {
    btn.disabled = true;
    btn.textContent = busyText;
  }
  try {
    return await fn();
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = original;
    }
  }
}

function openVerification(email) {
  verificationEmail.value = email;
  document.getElementById("verifyEmailLabel").textContent = email;
  showPanel(verifyPanel);
  verificationCode.focus();
  setFeedback(
    "verifyFeedback",
    "Check your email for the FarmLink verification code.",
  );
}

// Extra signup data is held here until the email is verified,
// because there is no login session (so no upload permission) before that.
let pendingSignup = null;

async function uploadDoc(uid, key, file) {
  if (!file) return null;
  const safe = file.name.replace(/[^\w.\-]/g, "_");
  const path = `${uid}/${key}-${Date.now()}-${safe}`;
  const { error } = await supabaseClient.storage
    .from("driver-docs")
    .upload(path, file);
  return error ? null : path;
}

// Runs right after the code is verified (now we have a session).
async function saveSignupExtras(user) {
  const p = pendingSignup;
  if (!p) return;
  try {
    const update = {};

    if (p.photo) {
      const blob = await (await fetch(p.photo)).blob();
      const path = `${user.id}/avatar.jpg`;
      const { error } = await supabaseClient.storage
        .from("avatars")
        .upload(path, blob, { upsert: true, contentType: "image/jpeg" });
      if (!error) {
        update.avatar_url = supabaseClient.storage
          .from("avatars")
          .getPublicUrl(path).data.publicUrl;
      }
    }
    if (p.role === "seller") {
      update.seller_ref = p.sellerId;
      update.farm_location = p.farmLocation;
    }
    if (Object.keys(update).length) {
      await supabaseClient.from("profiles").update(update).eq("id", user.id);
    }

    if (p.role === "driver") {
      const d = p.driver;
      await supabaseClient.from("driver_details").upsert({
        user_id: user.id,
        vehicle_make_model: d.make,
        vehicle_year: d.year ? Number(d.year) : null,
        vehicle_plate: d.plate,
        driver_area: d.area,
        licence_doc: await uploadDoc(user.id, "licence", d.files.licence),
        prdp_doc: await uploadDoc(user.id, "prdp", d.files.prdp),
        proof_of_address_doc: await uploadDoc(
          user.id,
          "address",
          d.files.address,
        ),
        insurance_doc: await uploadDoc(user.id, "insurance", d.files.insurance),
        driving_experience: d.experience,
        bank_account_details: d.bank,
        tax_number: d.tax,
      });
    }
  } catch (err) {
    console.warn("Could not save some profile details:", err); // user still gets in
  } finally {
    pendingSignup = null;
  }
}

// ---------- REGISTER ----------
document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const fb = "registerFeedback";
    const $ = (id) => document.getElementById(id);
    const fullname = $("fullname").value.trim();
    const email = $("email").value.trim();
    const passwordsOk = checkPasswordMatch(),
      phoneOk = checkPhone();

    if (
      !fullname ||
      !email ||
      !phoneInput.value ||
      !regPassword.value ||
      !confirmPassword.value
    )
      return setFeedback(fb, "Please fill in all fields.", true);
    if (!phoneOk)
      return setFeedback(fb, "Please enter a valid phone number.", true);
    if (!passwordsOk) return setFeedback(fb, "Passwords do not match.", true);
    if (regPassword.value.length < 8)
      return setFeedback(
        fb,
        "Your password must be at least 8 characters.",
        true,
      );

    const role = roleSelect.value;
    if (
      role === "seller" &&
      (!$("sellerId").value.trim() ||
        !$("farmLocation").value.trim() ||
        !$("sellerDeclaration").checked)
    )
      return setFeedback(
        fb,
        "Seller verification details and declaration are required.",
        true,
      );

    if (
      role === "driver" &&
      (!$("vehicleMake").value.trim() ||
        !$("vehicleYear").value ||
        !$("vehiclePlate").value.trim() ||
        !$("driverArea").value.trim() ||
        !$("driverLicenceDoc").files.length ||
        !$("proofOfAddressDoc").files.length ||
        !$("bankAccountDetails").value.trim() ||
        !$("driverDeclaration").checked)
    )
      return setFeedback(
        fb,
        "Vehicle details, your driver's licence, proof of address, bank details and the declaration are required.",
        true,
      );

    try {
      const { data, error } = await withLoading(
        e.target,
        "Creating account…",
        () =>
          supabaseClient.auth.signUp({
            email,
            password: regPassword.value,
            // keep metadata small: the DB trigger copies it into the profiles table
            options: {
              data: {
                full_name: fullname,
                phone: phoneInput.value.trim(),
                role,
              },
            },
          }),
      );
      if (error) throw error;

      // Supabase returns no error but empty identities when the email already exists
      if (data.user?.identities?.length === 0)
        return setFeedback(
          fb,
          "That email is already registered. Please log in.",
          true,
        );

      pendingSignup = {
        role,
        photo: regPhotoDataUrl,
        sellerId: $("sellerId").value.trim(),
        farmLocation: $("farmLocation").value.trim(),
        driver: {
          make: $("vehicleMake").value.trim(),
          year: $("vehicleYear").value,
          plate: $("vehiclePlate").value.trim(),
          area: $("driverArea").value.trim(),
          experience: $("drivingExperience").value.trim(),
          bank: $("bankAccountDetails").value.trim(),
          tax: $("taxNumber").value.trim(),
          files: {
            licence: $("driverLicenceDoc").files[0],
            prdp: $("prdpDoc").files[0],
            address: $("proofOfAddressDoc").files[0],
            insurance: $("insuranceDoc").files[0],
          },
        },
      };

      setFeedback(
        fb,
        "Account created! We sent a verification code to your email.",
      );
      openVerification(email);
    } catch (err) {
      setFeedback(fb, err.message, true);
    }
  });

// ---------- VERIFY CODE ----------
document.getElementById("verifyForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = verificationEmail.value.trim();
  const code = verificationCode.value.trim();
  if (!/^\d{6,10}$/.test(code))
    return setFeedback(
      "verifyFeedback",
      "Enter the code from your email.",
      true,
    );

  try {
    const { data, error } = await withLoading(e.target, "Verifying…", () =>
      supabaseClient.auth.verifyOtp({ email, token: code, type: "signup" }),
    );
    if (error) throw error;
    setFeedback(
      "verifyFeedback",
      "Email verified! Taking you into FarmLink...",
    );
    await saveSignupExtras(data.user);
    goToApp(data.user);
  } catch (err) {
    setFeedback("verifyFeedback", err.message, true);
  }
});

// ---------- RESEND CODE ----------
document.getElementById("resendCodeBtn").addEventListener("click", async () => {
  const email = verificationEmail.value.trim();
  if (!email) return;
  const { error } = await supabaseClient.auth.resend({ type: "signup", email });
  setFeedback(
    "verifyFeedback",
    error ? error.message : "A new code has been sent to your email.",
    !!error,
  );
});

// ---------- LOGIN ----------
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;
  if (!email || !password)
    return setFeedback(
      "loginFeedback",
      "Please enter your email and password.",
      true,
    );

  try {
    const { data, error } = await withLoading(e.target, "Logging in…", () =>
      supabaseClient.auth.signInWithPassword({ email, password }),
    );
    if (error) throw error;
    setFeedback("loginFeedback", "Login successful. Opening FarmLink...");
    goToApp(data.user); // buyer → dashboard, seller → sell-products, driver → driver-dashboard
  } catch (err) {
    if (/not confirmed/i.test(err.message)) {
      // Account exists but email not verified yet: send a fresh code and show the code screen
      await supabaseClient.auth.resend({ type: "signup", email });
      openVerification(email);
      return;
    }
    setFeedback("loginFeedback", err.message, true);
  }
});
