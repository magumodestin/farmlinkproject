const DB_USERS_KEY = 'farmlinkDB_users'; 

function money(n){ return `R ${Number(n||0).toFixed(2)}`; }
function toggleMenu(){ document.getElementById('mobileMenu')?.classList.toggle('show'); }

function loadSessionUser(){
  try {
    const user = JSON.parse(localStorage.getItem('farmlinkUser') || 'null');
    if (user && user.verification_status === 'verified') {
      user.verification_status = 'approved';
      saveSessionUser(user);
    }
    return user;
  }
  catch { return null; }
}
function saveSessionUser(u){ localStorage.setItem('farmlinkUser', JSON.stringify(u)); }

function loadAllUsers(){
  let users;
  try { users = JSON.parse(localStorage.getItem(DB_USERS_KEY) || '[]'); }
  catch { return []; }
  let changed = false;
  users.forEach(u => { if (u.verification_status === 'verified') { u.verification_status = 'approved'; changed = true; } });
  if (changed) saveAllUsers(users);
  return users;
}
function saveAllUsers(users){ localStorage.setItem(DB_USERS_KEY, JSON.stringify(users)); }

function updateDriverRecord(email, patch){
  const users = loadAllUsers();
  const idx = users.findIndex(u => u.email === email);
  if (idx !== -1) {
    users[idx].driver = { ...(users[idx].driver||{}), ...patch };
    saveAllUsers(users);
  }
  const session = loadSessionUser();
  if (session && session.email === email) {
    session.driver = { ...(session.driver||{}), ...patch };
    saveSessionUser(session);
  }
  return session;
}

function opsKey(email){ return `farmlinkDriverOps:${email}`; }
function loadOps(email){
  try { return JSON.parse(localStorage.getItem(opsKey(email))) || { online:false, activeJob:null, completedTrips:[], declinedJobIds:[] }; }
  catch { return { online:false, activeJob:null, completedTrips:[], declinedJobIds:[] }; }
}
function saveOps(email, ops){ localStorage.setItem(opsKey(email), JSON.stringify(ops)); }

function refreshCurrentUserFromDB(){
  const users = loadAllUsers();
  const fresh = users.find(u => u.email === CURRENT_USER.email);
  if (!fresh) return;
  const { password_hash, ...safeFresh } = fresh;
  CURRENT_USER = safeFresh;
  saveSessionUser(CURRENT_USER);
}

const AVAILABLE_JOBS = [
  { id:'j1', buyer_name:'Nomvula T.', pickup:'John\'s Farm, Cullinan', dropoff:'Menlyn, Pretoria', area:'Pretoria', distance_km:34, payout:120, items:'Vegetables & eggs order' },
  { id:'j2', buyer_name:'Sipho R.', pickup:'Lerato Market, Centurion', dropoff:'Centurion CBD', area:'Centurion', distance_km:9, payout:65, items:'Fruit basket' },
  { id:'j3', buyer_name:'Karabo M.', pickup:'Pretoria Fresh, Soshanguve', dropoff:'Soshanguve Block H', area:'Soshanguve', distance_km:12, payout:75, items:'Maize meal & dairy' },
  { id:'j4', buyer_name:'Anele K.', pickup:'Midrand Farm Stall', dropoff:'Vorna Valley, Midrand', area:'Midrand', distance_km:15, payout:85, items:'Mixed produce order' },
  { id:'j5', buyer_name:'Werner B.', pickup:'Farmer\'s Co-op, Pretoria', dropoff:'Hatfield, Pretoria', area:'Pretoria', distance_km:20, payout:95, items:'Honey & nuts order' },
  { id:'j6', buyer_name:'Palesa D.', pickup:'Cold Storage Hub, Centurion', dropoff:'Rooihuiskraal, Centurion', area:'Centurion', distance_km:11, payout:70, items:'Meat & poultry order' }
];

const AREA_COORDS = {
  'Pretoria': [-25.7479, 28.2293], 'Centurion': [-25.8603, 28.1894],
  'Soshanguve': [-25.5192, 28.1122], 'Midrand': [-25.9992, 28.1264]
};

const DELIVERY_STEPS = ['Accepted', 'Picked up', 'En route', 'Delivered'];

let CURRENT_USER = null;
let OPS = null;
let map, pickupMarker, dropoffMarker;

function showSection(page){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(page)?.classList.add('active');
  document.querySelectorAll('.nav-link').forEach(a => a.classList.toggle('active', a.dataset.page === page));
  document.getElementById('mobileMenu')?.classList.remove('show');
  window.scrollTo({ top:0, behavior:'smooth' });
  renderAll();
}
function setupNavigation(){
  document.querySelectorAll('.nav-link[data-page]').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); showSection(a.dataset.page); });
  });
}

function initials(name){
  if (!name) return '?';
  return name.trim().split(/\s+/).slice(0,2).map(p => p[0].toUpperCase()).join('');
}
function renderHeader(){
  const avatarEl = document.getElementById('profileAvatar');
  if (avatarEl) {
    avatarEl.innerHTML = CURRENT_USER.avatar_url
      ? `<img src="${CURRENT_USER.avatar_url}" alt="Profile photo" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`
      : initials(CURRENT_USER.full_name);
  }
  document.getElementById('profileName').textContent = CURRENT_USER.full_name || CURRENT_USER.email;
  document.getElementById('profileRole').textContent = 'driver';
}
function renderAvailability(){
  const btn = document.getElementById('availToggle');
  const label = document.getElementById('availToggleLabel');
  btn.classList.toggle('online', OPS.online);
  label.textContent = OPS.online ? 'Online' : 'Offline';
  const stat = document.getElementById('statAvailability');
  if (stat) stat.textContent = OPS.online ? 'Online' : 'Offline';
}
function setupHeaderActions(){
  document.getElementById('availToggle').addEventListener('click', () => {
    OPS.online = !OPS.online;
    saveOps(CURRENT_USER.email, OPS);
    renderAll();
  });
  const logout = () => farmlinkLogout();
  document.getElementById('logoutBtn')?.addEventListener('click', logout);
}

function renderStatusCard(){
  const card = document.getElementById('statusCard');
  const title = document.getElementById('statusTitle');
  const text = document.getElementById('statusText');
  const badge = document.getElementById('statusBadge');
  const status = CURRENT_USER.verification_status || 'pending';
  card.className = 'status-card ' + (status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'pending');
  if (status === 'approved') {
    title.textContent = 'Account verified ✓';
    text.textContent = 'Your documents have been approved. You can accept delivery jobs.';
    badge.textContent = 'Verified'; badge.className = 'doc-status ok';
  } else if (status === 'rejected') {
    title.textContent = 'Verification rejected';
    text.textContent = CURRENT_USER.rejection_reason
      ? `Reason: ${CURRENT_USER.rejection_reason} — please re-upload the relevant document(s) under Profile & Documents.`
      : 'One or more documents were rejected. Please re-upload them under Profile & Documents.';
    badge.textContent = 'Rejected'; badge.className = 'doc-status missing';
  } else {
    title.textContent = 'Verification pending';
    text.textContent = 'Your documents are being reviewed by the FarmLink team. This usually takes 1-2 business days.';
    badge.textContent = 'Pending'; badge.className = 'doc-status optional';
  }
}

function totalEarnings(){ return OPS.completedTrips.reduce((s,t) => s + t.payout, 0); }
function ratingText(){
  const n = OPS.completedTrips.length;
  if (!n) return { value:'—', text:'Complete your first delivery to get rated.' };
  const rating = Math.min(5, 4.5 + n * 0.02).toFixed(1);
  return { value:rating, text:`Based on ${n} completed ${n===1?'delivery':'deliveries'}.` };
}
function renderStats(){
  document.getElementById('statEarnings').textContent = money(totalEarnings());
  document.getElementById('statTrips').textContent = OPS.completedTrips.length;
  document.getElementById('statTripsSub').textContent = OPS.completedTrips.length ? 'All-time' : 'No trips yet';
  document.getElementById('statRating').textContent = ratingText().value;
}

function visibleJobs(){
  return AVAILABLE_JOBS.filter(j => !OPS.declinedJobIds.includes(j.id) && OPS.activeJob?.id !== j.id
    && !OPS.completedTrips.some(t => t.id === j.id));
}
function jobCard(job){
  const locked = !OPS.online || !!OPS.activeJob || CURRENT_USER.verification_status !== 'approved';
  return `<div class="job-card">
    <div>
      <div class="job-route">${job.pickup} → ${job.dropoff}</div>
      <div class="job-meta">👤 ${job.buyer_name} · 📍 ${job.area} · ${job.distance_km} km · ${job.items}</div>
    </div>
    <div style="display:flex;align-items:center;gap:16px">
      <div class="job-payout">${money(job.payout)}</div>
      <div class="job-actions">
        <button class="btn-primary" ${locked?'disabled':''} onclick="acceptJob('${job.id}')">Accept</button>
        <button class="btn-outline" onclick="declineJob('${job.id}')">Decline</button>
      </div>
    </div>
  </div>`;
}
function renderJobs(){
  const list = document.getElementById('jobsList');
  const empty = document.getElementById('jobsEmpty');
  const hint = document.getElementById('jobsHint');
  if (CURRENT_USER.verification_status !== 'approved') hint.textContent = 'Your account must be verified by FarmLink before you can accept delivery jobs. Check your status on the Overview tab.';
  else if (!OPS.online) hint.textContent = 'You are offline — go online (top right) to accept delivery jobs.';
  else if (OPS.activeJob) hint.textContent = 'Finish your active delivery before accepting a new job.';
  else hint.textContent = `Showing jobs near ${CURRENT_USER.driver?.driver_area || 'your area'}.`;
  const jobs = visibleJobs();
  list.innerHTML = jobs.map(jobCard).join('');
  empty.style.display = jobs.length ? 'none' : 'block';
}
function acceptJob(id){
  if (CURRENT_USER.verification_status !== 'approved') { alert('Your account must be verified before you can accept jobs.'); return; }
  if (OPS.activeJob) { alert('Finish your active delivery before accepting a new one.'); return; }
  if (!OPS.online) { alert('Go online first to accept jobs.'); return; }
  const job = AVAILABLE_JOBS.find(j => j.id === id);
  if (!job) return;
  OPS.activeJob = { ...job, status:'Accepted', acceptedAt: Date.now() };
  saveOps(CURRENT_USER.email, OPS);
  renderAll();
  showSection('deliveries');
}
function declineJob(id){
  OPS.declinedJobIds.push(id);
  saveOps(CURRENT_USER.email, OPS);
  renderJobs();
}

function stepperHTML(job){
  const currentIdx = DELIVERY_STEPS.indexOf(job.status);
  return `<div class="stepper">${DELIVERY_STEPS.map((s,i) => {
    const cls = i < currentIdx ? 'done' : i === currentIdx ? 'current' : '';
    const line = i < DELIVERY_STEPS.length-1 ? '<div class="step-line"></div>' : '';
    return `<div class="step ${cls}"><div class="circle">${i < currentIdx ? '✓' : i+1}</div><span>${s}</span></div>${line}`;
  }).join('')}</div>`;
}
function activeJobHTML(job, detailed){
  const nextIdx = DELIVERY_STEPS.indexOf(job.status) + 1;
  const nextLabel = DELIVERY_STEPS[nextIdx];
  return `<div class="job-card" style="flex-direction:column;align-items:stretch;gap:10px">
    <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px">
      <div>
        <div class="job-route">${job.pickup} → ${job.dropoff}</div>
        <div class="job-meta">👤 ${job.buyer_name} · 📍 ${job.area} · ${job.distance_km} km · ${job.items}</div>
      </div>
      <div class="job-payout">${money(job.payout)}</div>
    </div>
    ${stepperHTML(job)}
    ${nextLabel ? `<button class="btn-primary" onclick="advanceDelivery()">Mark as "${nextLabel}"</button>` : ''}
    ${detailed ? '<div id="driverMap"></div>' : ''}
  </div>`;
}
function renderActiveDelivery(){
  const overviewCard = document.getElementById('overviewActiveCard');
  const overviewBox = document.getElementById('overviewActiveJob');
  const detailBox = document.getElementById('activeDeliveryDetail');
  if (!OPS.activeJob) {
    overviewCard.style.display = 'none';
    detailBox.innerHTML = '<p class="card-sub">You don\'t have an active delivery. Accept a job from Available Jobs to get started.</p>';
    return;
  }
  overviewCard.style.display = 'block';
  overviewBox.innerHTML = activeJobHTML(OPS.activeJob, false);
  detailBox.innerHTML = activeJobHTML(OPS.activeJob, true);
  initDriverMap(OPS.activeJob);
}
function initDriverMap(job){
  const el = document.getElementById('driverMap');
  if (!el || !window.L) return;
  const center = AREA_COORDS[job.area] || AREA_COORDS['Pretoria'];
  map = L.map(el).setView(center, 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'&copy; OpenStreetMap contributors' }).addTo(map);
  const pickupPt = center, dropoffPt = [center[0]+0.03, center[1]+0.03];
  L.marker(pickupPt).addTo(map).bindPopup('📦 Pickup: ' + job.pickup);
  L.marker(dropoffPt).addTo(map).bindPopup('🏠 Drop-off: ' + job.dropoff);
  L.polyline([pickupPt, dropoffPt], { weight:4, dashArray:'6 8' }).addTo(map);
  setTimeout(() => map.invalidateSize(), 150);
}
function advanceDelivery(){
  if (!OPS.activeJob) return;
  const idx = DELIVERY_STEPS.indexOf(OPS.activeJob.status);
  if (idx >= DELIVERY_STEPS.length - 1) return;
  OPS.activeJob.status = DELIVERY_STEPS[idx + 1];
  if (OPS.activeJob.status === 'Delivered') {
    OPS.completedTrips.unshift({ ...OPS.activeJob, deliveredAt: Date.now() });
    OPS.activeJob = null;
    alert('Delivery marked as complete! Payout added to your earnings.');
  }
  saveOps(CURRENT_USER.email, OPS);
  renderAll();
}

function tripRow(t){
  const date = new Date(t.deliveredAt).toLocaleDateString();
  return `<div class="trip-row"><span>${t.pickup} → ${t.dropoff} <span style="color:var(--muted)">(${date})</span></span><span class="trip-payout">${money(t.payout)}</span></div>`;
}
function renderDeliveryHistory(){
  const box = document.getElementById('deliveryHistory');
  const empty = document.getElementById('historyEmpty');
  box.innerHTML = OPS.completedTrips.map(tripRow).join('');
  empty.style.display = OPS.completedTrips.length ? 'none' : 'block';
}
function maskBank(details){
  if (!details) return 'No bank details on file — add them under Profile & Documents.';
  if (details.length <= 4) return details;
  return details.slice(0,4) + '••••••••' + details.slice(-2);
}
function renderEarnings(){
  const now = Date.now();
  const weekAgo = now - 7*24*60*60*1000;
  const monthAgo = now - 30*24*60*60*1000;
  const total = totalEarnings();
  const week = OPS.completedTrips.filter(t => t.deliveredAt >= weekAgo).reduce((s,t) => s+t.payout, 0);
  const month = OPS.completedTrips.filter(t => t.deliveredAt >= monthAgo).reduce((s,t) => s+t.payout, 0);
  document.getElementById('earnTotal').textContent = money(total);
  document.getElementById('earnWeek').textContent = money(week);
  document.getElementById('earnMonth').textContent = money(month);
  document.getElementById('earnBankDetails').textContent = maskBank(CURRENT_USER.driver?.bank_account_details);
  const list = document.getElementById('earningsList');
  const empty = document.getElementById('earningsEmpty');
  list.innerHTML = OPS.completedTrips.map(tripRow).join('');
  empty.style.display = OPS.completedTrips.length ? 'none' : 'block';
}

function renderProfileTab(){
  const n = OPS.completedTrips.length;
  const { value, text } = ratingText();
  document.getElementById('profileStars').textContent = n ? '★★★★★'.slice(0, Math.round(value)) + '☆☆☆☆☆'.slice(0, 5-Math.round(value)) : '☆☆☆☆☆';
  document.getElementById('profileRatingText').textContent = n ? `${value} / 5 — ${text}` : text;
  const memberSince = CURRENT_USER.id ? new Date(CURRENT_USER.id).toLocaleDateString() : '';
  document.getElementById('profileMemberSince').textContent = memberSince ? `FarmLink driver since ${memberSince}` : '';

  const d = CURRENT_USER.driver || {};
  document.getElementById('pfVehicleMake').value = d.vehicle_make_model || '';
  document.getElementById('pfVehicleYear').value = d.vehicle_year || '';
  document.getElementById('pfVehiclePlate').value = d.vehicle_plate || '';
  document.getElementById('pfDriverArea').value = d.driver_area || '';
  document.getElementById('pfExperience').value = d.driving_experience || '';
  document.getElementById('pfBankDetails').value = d.bank_account_details || '';
  document.getElementById('pfTaxNumber').value = d.tax_number || '';

  renderDocList();
}
const DOC_FIELDS = [
  { key:'driver_licence_doc', label:'Copy of Driver\'s Licence', required:true },
  { key:'prdp_doc', label:'Professional Driving Permit (PrDP)', required:false },
  { key:'proof_of_address_doc', label:'Proof of Address', required:true },
  { key:'insurance_doc', label:'Insurance Certificate', required:false }
];
function renderDocList(){
  const d = CURRENT_USER.driver || {};
  const box = document.getElementById('docList');
  box.innerHTML = DOC_FIELDS.map(f => {
    const file = d[f.key];
    let statusHtml;
    if (file) statusHtml = '<span class="doc-status ok">Submitted</span>';
    else if (f.required) statusHtml = '<span class="doc-status missing">Missing</span>';
    else statusHtml = '<span class="doc-status optional">Not provided</span>';
    return `<div class="doc-row">
      <div>
        <div class="doc-name">${f.label}${f.required ? '' : ' <span style="font-weight:400;color:var(--muted)">(optional)</span>'}</div>
        <div class="doc-file">${file ? file : 'No file uploaded'}</div>
      </div>
      <div style="display:flex;align-items:center;gap:10px">
        ${statusHtml}
        <div class="doc-actions"><input type="file" accept="image/*,.pdf" data-doc="${f.key}"></div>
      </div>
    </div>`;
  }).join('');
  box.querySelectorAll('input[type=file]').forEach(input => {
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      CURRENT_USER = updateDriverRecord(CURRENT_USER.email, { [input.dataset.doc]: file.name }) || CURRENT_USER;
      renderDocList();
    });
  });
}
function setupProfileForms(){
  document.getElementById('vehicleForm').addEventListener('submit', e => {
    e.preventDefault();
    CURRENT_USER = updateDriverRecord(CURRENT_USER.email, {
      vehicle_make_model: document.getElementById('pfVehicleMake').value.trim(),
      vehicle_year: document.getElementById('pfVehicleYear').value,
      vehicle_plate: document.getElementById('pfVehiclePlate').value.trim(),
      driver_area: document.getElementById('pfDriverArea').value.trim()
    }) || CURRENT_USER;
    document.getElementById('vehicleSaveMsg').textContent = 'Saved ✓';
    setTimeout(() => document.getElementById('vehicleSaveMsg').textContent = '', 2000);
    renderJobs();
  });
  document.getElementById('paymentForm').addEventListener('submit', e => {
    e.preventDefault();
    CURRENT_USER = updateDriverRecord(CURRENT_USER.email, {
      driving_experience: document.getElementById('pfExperience').value.trim(),
      bank_account_details: document.getElementById('pfBankDetails').value.trim(),
      tax_number: document.getElementById('pfTaxNumber').value.trim()
    }) || CURRENT_USER;
    document.getElementById('paymentSaveMsg').textContent = 'Saved ✓';
    setTimeout(() => document.getElementById('paymentSaveMsg').textContent = '', 2000);
    renderEarnings();
  });
}

function renderAll(){
  renderHeader();
  renderAvailability();
  renderStatusCard();
  renderStats();
  renderActiveDelivery();
  if (document.getElementById('jobs').classList.contains('active')) renderJobs();
  if (document.getElementById('deliveries').classList.contains('active')) renderDeliveryHistory();
  if (document.getElementById('earnings').classList.contains('active')) renderEarnings();
  if (document.getElementById('profile').classList.contains('active')) renderProfileTab();
}

document.addEventListener('DOMContentLoaded', () => {
  CURRENT_USER = loadSessionUser();
  if (!CURRENT_USER || CURRENT_USER.role !== 'driver') return; 
  refreshCurrentUserFromDB();
  OPS = loadOps(CURRENT_USER.email);

  setupNavigation();
  setupHeaderActions();
  setupProfileForms();
  renderAll();

  window.addEventListener('focus', () => { refreshCurrentUserFromDB(); renderAll(); });
});