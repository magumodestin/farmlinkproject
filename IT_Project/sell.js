// sell.js
// Powers sell-Product.html: confirms the signed-in user is an approved
// seller, wires the product + livestock forms to api/marketplace.php, and
// renders the seller's own listings.

function escapeHtml(s){
  return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function money(n){ return `R ${Number(n||0).toFixed(2)}`; }

let CURRENT_USER = null;

function renderStatusBanner(user){
  const banner = document.getElementById('statusBanner');
  const lockedPanel = document.getElementById('lockedPanel');
  const sellerArea = document.getElementById('sellerArea');

  if (user.role !== 'seller') {
    banner.innerHTML = '';
    sellerArea.style.display = 'none';
    lockedPanel.style.display = 'block';
    lockedPanel.innerHTML = `
      <div class="big-icon">🌾</div>
      <h2>Only seller accounts can list on FarmLink</h2>
      <p class="muted" style="margin:10px 0 16px">You're signed in as a ${escapeHtml(user.role)}. Register a seller account (or ask an admin to add seller access) to start listing products or livestock.</p>
      <a href="login_register.html">Create a seller account →</a>`;
    return;
  }

  lockedPanel.style.display = 'none';

  const status = user.verification_status || 'pending';
  if (status === 'approved') {
    banner.innerHTML = `<div class="status-banner approved"><strong>✅ You're a verified seller</strong>Your listings go live immediately once submitted.</div>`;
    sellerArea.style.display = 'block';
    setFormsEnabled(true);
  } else if (status === 'rejected') {
    banner.innerHTML = `<div class="status-banner rejected"><strong>⚠️ Seller verification was rejected</strong>Contact FarmLink support to resolve this before you can list anything.</div>`;
    sellerArea.style.display = 'block';
    setFormsEnabled(false, 'Verification rejected — contact support');
  } else {
    banner.innerHTML = `<div class="status-banner pending"><strong>⏳ Seller verification pending</strong>You can prepare your listings below, but submitting is disabled until an admin approves your account.</div>`;
    sellerArea.style.display = 'block';
    setFormsEnabled(false, 'Awaiting verification approval');
  }
}

function setFormsEnabled(enabled, disabledLabel){
  const pBtn = document.getElementById('pSubmitBtn');
  const lBtn = document.getElementById('lSubmitBtn');
  [pBtn, lBtn].forEach(btn => {
    if (!btn) return;
    btn.disabled = !enabled;
    btn.style.opacity = enabled ? '1' : '.6';
    btn.style.cursor = enabled ? 'pointer' : 'not-allowed';
    btn.title = enabled ? '' : (disabledLabel || 'Unavailable');
  });
}

function setupTabs(){
  const tabs = document.querySelectorAll('.sell-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // The WhatsApp tab has no matching panel by design (it opens WhatsApp
      // instead of switching views) — leave the currently-open panel as is.
      if (!document.querySelector(`.sell-panel[data-panel="${tab.dataset.tab}"]`)) return;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.sell-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === tab.dataset.tab));
      if (tab.dataset.tab === 'mine') loadMyListings();
    });
  });
}

function showMsg(el, text, ok){
  el.textContent = text;
  el.className = 'form-msg ' + (ok ? 'ok' : 'err');
}

function setupProductForm(){
  const form = document.getElementById('productForm');
  const msg = document.getElementById('pMsg');
  const btn = document.getElementById('pSubmitBtn');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    msg.className = 'form-msg';
    const name = document.getElementById('pName').value.trim();
    const price = parseFloat(document.getElementById('pPrice').value);
    const stock = parseInt(document.getElementById('pStock').value, 10);
    const unit = document.getElementById('pUnit').value.trim();
    const location = document.getElementById('pLocation').value.trim();
    if (!name || !unit || !location || isNaN(price) || price < 0 || isNaN(stock) || stock < 0) {
      showMsg(msg, 'Please fill in name, unit, location, price and stock correctly.', false);
      return;
    }
    const payload = {
      name, price, stock, unit, location,
      category: document.getElementById('pCategory').value,
      description: document.getElementById('pDescription').value.trim(),
      image_url: document.getElementById('pImage').value.trim() || null,
      is_service: document.getElementById('pIsService').checked
    };
    btn.disabled = true; btn.textContent = 'Listing…';
    try {
      await FarmLinkAPI.createProduct(payload);
      showMsg(msg, 'Product listed! It\'s now visible on Browse Products.', true);
      window.showToast?.('Product listed successfully', 'success');
      form.reset();
      loadMyListings();
    } catch (err) {
      showMsg(msg, err.message || 'Could not list this product.', false);
    } finally {
      btn.disabled = false; btn.textContent = 'List product';
    }
  });
}

function setupLivestockForm(){
  const form = document.getElementById('livestockForm');
  const msg = document.getElementById('lMsg');
  const btn = document.getElementById('lSubmitBtn');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    msg.className = 'form-msg';
    const listing_title = document.getElementById('lTitle').value.trim();
    const price = parseFloat(document.getElementById('lPrice').value);
    const quantity = parseInt(document.getElementById('lQuantity').value, 10);
    const location = document.getElementById('lLocation').value.trim();
    if (!listing_title || !location || isNaN(price) || price < 0 || isNaN(quantity) || quantity < 1) {
      showMsg(msg, 'Please fill in title, location, price and quantity correctly.', false);
      return;
    }
    const ageVal = document.getElementById('lAge').value;
    const weightVal = document.getElementById('lWeight').value;
    const payload = {
      listing_title, price, quantity, location,
      species: document.getElementById('lSpecies').value,
      breed: document.getElementById('lBreed').value.trim() || null,
      sex: document.getElementById('lSex').value,
      age_months: ageVal ? parseInt(ageVal, 10) : null,
      weight_kg: weightVal ? parseFloat(weightVal) : null,
      price_type: document.getElementById('lPriceType').value,
      description: document.getElementById('lDescription').value.trim(),
      health_status: document.getElementById('lHealth').value.trim() || null,
      vaccination_status: document.getElementById('lVaccination').value.trim() || null,
      identification_reference: document.getElementById('lIdRef').value.trim() || null,
      transport_available: document.getElementById('lTransport').checked,
      image_url: document.getElementById('lImage').value.trim() || null
    };
    btn.disabled = true; btn.textContent = 'Listing…';
    try {
      await FarmLinkAPI.createLivestock(payload);
      showMsg(msg, 'Livestock listed! It\'s now visible in the Livestock section.', true);
      window.showToast?.('Livestock listed successfully', 'success');
      form.reset();
      loadMyListings();
    } catch (err) {
      showMsg(msg, err.message || 'Could not list this animal.', false);
    } finally {
      btn.disabled = false; btn.textContent = 'List livestock';
    }
  });
}

function listingCard(kind, item){
  if (kind === 'product') {
    return `<div class="listing-card">
      <span class="kind-pill">${item.is_service ? 'Service' : 'Product'}</span>
      <h3>${escapeHtml(item.name)}</h3>
      <div class="price">${money(item.price)} / ${escapeHtml(item.unit)}</div>
      <div class="meta">📍 ${escapeHtml(item.location || '—')}<br>${escapeHtml(item.category)} · ${item.stock} in stock<br>Status: ${escapeHtml(item.status)}</div>
    </div>`;
  }
  return `<div class="listing-card livestock">
    <span class="kind-pill">Livestock</span>
    <h3>${escapeHtml(item.listing_title)}</h3>
    <div class="price">${money(item.price)} (${item.price_type.replace('_',' ')})</div>
    <div class="meta">📍 ${escapeHtml(item.location)}<br>${escapeHtml(item.species)} · qty ${item.quantity}<br>Status: ${escapeHtml(item.status)}</div>
  </div>`;
}

function skeletonListingCards(n){
  return Array.from({ length: n }, () => `<div class="listing-card">
    <div class="skeleton skeleton-line" style="width:60px;height:16px;margin-bottom:10px"></div>
    <div class="skeleton skeleton-line" style="width:80%;height:15px;margin-bottom:8px"></div>
    <div class="skeleton skeleton-line" style="width:50%;margin-bottom:10px"></div>
    <div class="skeleton skeleton-line" style="width:90%"></div>
  </div>`).join('');
}

async function loadMyListings(){
  const grid = document.getElementById('listingsGrid');
  const empty = document.getElementById('listingsEmpty');
  const loading = document.getElementById('listingsLoading');
  if (!grid || !CURRENT_USER) return;
  if (loading) loading.style.display = 'none'; // replaced by skeleton cards below
  empty.style.display = 'none';
  grid.innerHTML = skeletonListingCards(4);
  try {
    const [prodRes, liveRes] = await Promise.all([
      FarmLinkAPI.products(),
      FarmLinkAPI.livestock()
    ]);
    const myProducts = (prodRes.products || []).filter(p => Number(p.seller_id) === Number(CURRENT_USER.id));
    const myLivestock = (liveRes.livestock || []).filter(l => Number(l.seller_id) === Number(CURRENT_USER.id));
    window.mySellerListings = { products: myProducts, livestock: myLivestock };
    const cards = [
      ...myProducts.map(p => listingCard('product', p)),
      ...myLivestock.map(l => listingCard('livestock', l))
    ];
    grid.innerHTML = cards.join('');
    empty.style.display = cards.length ? 'none' : 'block';
  } catch (err) {
    grid.innerHTML = '';
    empty.textContent = 'Could not load your listings right now.';
    empty.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const cached = JSON.parse(localStorage.getItem('farmlinkUser') || 'null');
  if (!cached) { window.location.replace('login_register.html'); return; }
  // Migrate the old 'verified' status value (see comment history in
  // local-store.js) to 'approved', which is what this page actually checks.
  if (cached.verification_status === 'verified') {
    cached.verification_status = 'approved';
    localStorage.setItem('farmlinkUser', JSON.stringify(cached));
  }

  setupTabs();
  setupProductForm();
  setupLivestockForm();
  document.getElementById('refreshListingsBtn')?.addEventListener('click', loadMyListings);

  // Use the live session (api/auth.php?action=me) as the source of truth for
  // role + verification_status where possible — it reflects the account as
  // it stood at last login/verification, which is more trustworthy than the
  // cached copy in localStorage. Fall back to the cached copy if the API
  // can't be reached (e.g. backend not running in this environment).
  try {
    const { user } = await FarmLinkAPI.me();
    if (!user) { window.location.replace('login_register.html'); return; }
    CURRENT_USER = user;
  } catch (err) {
    CURRENT_USER = cached;
  }

  renderStatusBanner(CURRENT_USER);
  window.CURRENT_USER = CURRENT_USER;
  if (CURRENT_USER.role === 'seller') loadMyListings();
});
