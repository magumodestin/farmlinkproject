// sell.js - sell-products.html (Supabase version)
// Confirms the signed-in user is a seller, saves product + livestock listings to
// Supabase tables `products` and `livestock`, and shows the seller's own listings.
// Photos chosen with the Upload button (sell-image.js) go to the Storage bucket
// `listing-images`; if that bucket is not set up the photo is saved inline instead.

function escapeHtml(s){
  return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function money(n){ return `R ${Number(n||0).toFixed(2)}`; }

let CURRENT_USER = null;   // { id, email, role, verification_status, ... }

async function loadCurrentUser(){
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) return null;
  const { data: profile, error } = await supabaseClient
    .from('profiles').select('*').eq('id', session.user.id).single();
  if (error) console.warn('profiles lookup failed:', error.message);
  const meta = session.user.user_metadata || {};
  return {
    ...(profile || {}),
    id: session.user.id,
    email: session.user.email,
    role: (profile && profile.role) || meta.role || 'buyer'
  };
}

function normaliseStatus(user){
  // If the profiles table has no verification_status column at all, there is no
  // verification system yet, so sellers are treated as approved.
  if (!('verification_status' in user)) return 'approved';
  const v = user.verification_status || 'pending';
  return v === 'verified' ? 'approved' : v;
}

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
      <p class="muted" style="margin:10px 0 16px">You're signed in as a ${escapeHtml(user.role)}. Register a seller account to start listing products or livestock.</p>
      <a href="login_register.html">Create a seller account →</a>`;
    return;
  }

  lockedPanel.style.display = 'none';
  const status = normaliseStatus(user);
  if (status === 'approved') {
    banner.innerHTML = `<div class="status-banner approved"><strong>✅ You're a verified seller</strong>Your listings go live immediately once submitted.</div>`;
    sellerArea.style.display = 'block';
    setFormsEnabled(true);
  } else if (status === 'rejected') {
    banner.innerHTML = `<div class="status-banner rejected"><strong>⚠️ Seller verification was rejected</strong>Contact FarmLink support to resolve this before you can list anything.</div>`;
    sellerArea.style.display = 'block';
    setFormsEnabled(false, 'Verification rejected - contact support');
  } else {
    banner.innerHTML = `<div class="status-banner pending"><strong>⏳ Seller verification pending</strong>You can prepare your listings below, but submitting is disabled until an admin approves your account.</div>`;
    sellerArea.style.display = 'block';
    setFormsEnabled(false, 'Awaiting verification approval');
  }
}

function setFormsEnabled(enabled, disabledLabel){
  ['pSubmitBtn','lSubmitBtn'].forEach(id => {
    const btn = document.getElementById(id);
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
      // The WhatsApp button has no matching panel - leave the open panel as is.
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

// Uploaded photos arrive as data: URLs (from sell-image.js). Move them to Storage when
// possible so the database only holds a short link. Falls back to the inline data.
async function resolveImage(value){
  if (!value) return null;
  if (!value.startsWith('data:')) return value;
  try {
    const blob = await (await fetch(value)).blob();
    const path = `${CURRENT_USER.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
    const { error } = await supabaseClient.storage.from('listing-images')
      .upload(path, blob, { contentType: 'image/jpeg' });
    if (error) throw error;
    return supabaseClient.storage.from('listing-images').getPublicUrl(path).data.publicUrl;
  } catch (err) {
    console.warn('Photo upload to Storage failed, saving inline instead:', err.message || err);
    return value;
  }
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
    btn.disabled = true; btn.textContent = 'Listing…';
    try {
      const image_url = await resolveImage(document.getElementById('pImage').value.trim());
      const { error } = await supabaseClient.from('products').insert({
        seller_id: CURRENT_USER.id,
        name, price, stock, unit, location,
        category: document.getElementById('pCategory').value,
        description: document.getElementById('pDescription').value.trim(),
        image_url,
        is_service: document.getElementById('pIsService').checked
      });
      if (error) throw error;
      showMsg(msg, "Product listed! It's now visible on Browse Products.", true);
      window.showToast?.('Product listed successfully', 'success');
      form.reset();
      loadMyListings();
    } catch (err) {
      console.error('Create product failed:', err);
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
    btn.disabled = true; btn.textContent = 'Listing…';
    try {
      const image_url = await resolveImage(document.getElementById('lImage').value.trim());
      const { error } = await supabaseClient.from('livestock').insert({
        seller_id: CURRENT_USER.id,
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
        image_url
      });
      if (error) throw error;
      showMsg(msg, "Livestock listed! It's now visible in the Livestock section.", true);
      window.showToast?.('Livestock listed successfully', 'success');
      form.reset();
      loadMyListings();
    } catch (err) {
      console.error('Create livestock failed:', err);
      showMsg(msg, err.message || 'Could not list this animal.', false);
    } finally {
      btn.disabled = false; btn.textContent = 'List livestock';
    }
  });
}

function listingCard(kind, item){
  const thumb = item.image_url
    ? `<img src="${escapeHtml(item.image_url)}" alt="" style="width:100%;height:120px;object-fit:cover;border-radius:10px;margin-bottom:10px">` : '';
  if (kind === 'product') {
    return `<div class="listing-card">${thumb}
      <span class="kind-pill">${item.is_service ? 'Service' : 'Product'}</span>
      <h3>${escapeHtml(item.name)}</h3>
      <div class="price">${money(item.price)} / ${escapeHtml(item.unit)}</div>
      <div class="meta">📍 ${escapeHtml(item.location || '-')}<br>${escapeHtml(item.category)} · ${item.stock} in stock<br>Status: ${escapeHtml(item.status || 'live')}</div>
    </div>`;
  }
  return `<div class="listing-card livestock">${thumb}
    <span class="kind-pill">Livestock</span>
    <h3>${escapeHtml(item.listing_title)}</h3>
    <div class="price">${money(item.price)} (${escapeHtml(String(item.price_type || '').replace('_',' '))})</div>
    <div class="meta">📍 ${escapeHtml(item.location)}<br>${escapeHtml(item.species)} · qty ${item.quantity}<br>Status: ${escapeHtml(item.status || 'live')}</div>
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
  if (loading) loading.style.display = 'none';
  empty.style.display = 'none';
  grid.innerHTML = skeletonListingCards(4);
  try {
    const [prodRes, liveRes] = await Promise.all([
      supabaseClient.from('products').select('*').eq('seller_id', CURRENT_USER.id).order('created_at', { ascending: false }),
      supabaseClient.from('livestock').select('*').eq('seller_id', CURRENT_USER.id).order('created_at', { ascending: false })
    ]);
    if (prodRes.error) throw prodRes.error;
    if (liveRes.error) throw liveRes.error;
    const myProducts = prodRes.data || [];
    const myLivestock = liveRes.data || [];
    window.mySellerListings = { products: myProducts, livestock: myLivestock };
    const cards = [
      ...myProducts.map(p => listingCard('product', p)),
      ...myLivestock.map(l => listingCard('livestock', l))
    ];
    grid.innerHTML = cards.join('');
    empty.textContent = "You haven't listed anything yet - use the tabs above to add a product or a livestock listing.";
    empty.style.display = cards.length ? 'none' : 'block';
  } catch (err) {
    console.error('Load listings failed:', err);
    grid.innerHTML = '';
    empty.textContent = 'Could not load your listings: ' + (err.message || 'unknown error');
    empty.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = await loadCurrentUser();
  if (!user) { window.location.replace('login_register.html'); return; }
  CURRENT_USER = user;
  window.CURRENT_USER = user;

  setupTabs();
  setupProductForm();
  setupLivestockForm();
  document.getElementById('refreshListingsBtn')?.addEventListener('click', loadMyListings);

  renderStatusBanner(CURRENT_USER);
  if (CURRENT_USER.role === 'seller') loadMyListings();
});
