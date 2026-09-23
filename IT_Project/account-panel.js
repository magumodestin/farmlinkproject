(function () {
  const MODAL_ID = 'farmlinkAccountModal';
  let currentUser = null; // cached merged {id, email, full_name, phone, role, avatar_url, created_at}

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function injectStyles() {
    if (document.getElementById('farmlinkAccountStyles')) return;
    const style = document.createElement('style');
    style.id = 'farmlinkAccountStyles';
    style.textContent = `
      #${MODAL_ID} .modal{max-width:420px}
      .acct-card{text-align:center;padding:6px 4px 4px}
      .acct-avatar{width:74px;height:74px;border-radius:50%;background:#e7f8ed;color:#178a44;font-size:26px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;overflow:hidden}
      .acct-avatar img{width:100%;height:100%;object-fit:cover;border-radius:50%}
      .acct-name{font-size:19px;font-weight:700;margin-bottom:2px}
      .acct-email{color:var(--muted);font-size:13.5px;margin-bottom:14px}
      .acct-badges{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:18px}
      .acct-role-badge{display:inline-block;background:#eef3fb;color:#2c5aa0;padding:4px 11px;border-radius:999px;font-size:12px;font-weight:700}
      .rejected-badge{display:inline-block;background:#fdecec;color:#8a1f1f;padding:3px 9px;border-radius:999px;font-size:11px;font-weight:700}
      .acct-rows{text-align:left;border-top:1px solid var(--border);padding-top:6px;margin-top:4px}
      .acct-row{display:flex;justify-content:space-between;gap:12px;padding:9px 0;font-size:13.5px;border-bottom:1px solid var(--border)}
      .acct-row:last-child{border-bottom:0}
      .acct-row span:first-child{color:var(--muted)}
      .acct-row span:last-child{font-weight:600;text-align:right}
      .acct-note{background:#f6fbf7;border:1px solid #dfeee2;border-radius:10px;padding:10px 12px;font-size:12.5px;color:#3a5443;margin-top:16px;text-align:left}
      body.dark .acct-note{background:#132a1c;border-color:#1f3d29;color:#cfe9d6}
      .acct-actions{display:flex;gap:10px;margin-top:20px;flex-wrap:wrap}
      .acct-actions button,.acct-actions a{flex:1;min-width:110px;text-align:center}
      .acct-loading{text-align:center;color:var(--muted);padding:30px 0}

      .acct-settings{border-top:1px solid var(--border);margin-top:18px;padding-top:14px;text-align:left}
      .acct-settings-title{font-size:12.5px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;margin-bottom:10px}
      .acct-setting-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:6px 0}
      .acct-setting-label{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:600}
      .acct-setting-sub{font-size:12px;color:var(--muted);font-weight:400;margin-top:1px}
      .theme-switch{position:relative;display:inline-block;width:46px;height:26px;flex-shrink:0}
      .theme-switch input{opacity:0;width:0;height:0}
      .theme-switch-track{position:absolute;cursor:pointer;inset:0;background:#d5dbe0;border-radius:999px;transition:background .18s ease}
      .theme-switch-track::before{content:"";position:absolute;height:20px;width:20px;left:3px;top:3px;background:#fff;border-radius:50%;transition:transform .18s ease;box-shadow:0 1px 3px rgba(0,0,0,.3)}
      .theme-switch input:checked + .theme-switch-track{background:var(--green)}
      .theme-switch input:checked + .theme-switch-track::before{transform:translateX(20px)}

      .acct-edit-header{display:flex;align-items:center;gap:10px;margin-bottom:16px}
      .acct-edit-back{background:none;border:0;font-size:20px;cursor:pointer;padding:2px 4px;color:var(--text)}
      .acct-edit-title{font-size:16px;font-weight:700}
      .acct-photo-wrap{position:relative;width:88px;height:88px;margin:0 auto 18px}
      .acct-photo-wrap .acct-avatar{width:88px;height:88px;font-size:30px;margin:0}
      .acct-photo-edit{position:absolute;right:-2px;bottom:-2px;width:30px;height:30px;border-radius:50%;background:var(--green);color:#fff;border:2px solid var(--card);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px}
      .acct-field{margin-bottom:14px;text-align:left}
      .acct-field label{display:block;font-size:12.5px;font-weight:700;color:var(--muted);margin-bottom:5px}
      .acct-field input{width:100%;padding:11px 12px;border:1px solid var(--border);background:var(--bg);color:var(--text);border-radius:10px;font-size:14px;box-sizing:border-box}
      .acct-field input:disabled{opacity:.65}
      .acct-edit-error{background:#fdecec;color:#8a1f1f;border-radius:9px;padding:9px 11px;font-size:12.5px;margin-bottom:12px}
      body.dark .acct-edit-error{background:#3a1414;color:#f5b8b8}
    `;
    document.head.appendChild(style);
  }

  function injectModal() {
    if (document.getElementById(MODAL_ID)) return;
    const wrap = document.createElement('div');
    wrap.id = MODAL_ID;
    wrap.className = 'modal-backdrop';
    wrap.innerHTML = `
      <div class="modal">
        <button class="modal-close" type="button" data-acct-close aria-label="Close">×</button>
        <h2 style="margin-bottom:16px">👤 My FarmLink Account</h2>
        <div id="acctBody"><div class="acct-loading">Loading your account…</div></div>
      </div>`;
    document.body.appendChild(wrap);
    wrap.addEventListener('click', e => { if (e.target === wrap) closeAccountPanel(); });
    wrap.querySelector('[data-acct-close]').addEventListener('click', closeAccountPanel);
  }

  function openAccountPanel() {
    injectStyles();
    injectModal();
    document.getElementById(MODAL_ID).classList.add('show');
    loadAndRender();
  }
  function closeAccountPanel() {
    document.getElementById(MODAL_ID)?.classList.remove('show');
  }

  function initials(name) {
    if (!name) return '?';
    return name.trim().split(/\s+/).slice(0, 2).map(p => p[0].toUpperCase()).join('');
  }
  function roleLabel(role) {
    return { seller: '🌾 Seller / Farmer', buyer: '🛒 Buyer', driver: '🚚 Driver', admin: '🛠️ Admin' }[role] || (role || 'Member');
  }
  function formatDate(d) {
    if (!d) return null;
    const dt = new Date(String(d).replace(' ', 'T'));
    if (isNaN(dt.getTime())) return null;
    return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function statusMeta(user) {
    if (user.role !== 'seller' && user.role !== 'driver') {
      return { label: '✅ No verification needed', cls: 'verified-badge', note: null };
    }
    const s = user.verification_status;
    if (s === 'approved' || s === 'verified') {
      return { label: '✅ Approved', cls: 'verified-badge', note: user.role === 'seller' ? 'You can list products and livestock.' : 'You can accept delivery jobs.' };
    }
    if (s === 'rejected') {
      return { label: '⚠️ Rejected', cls: 'rejected-badge', note: 'Contact FarmLink support to resolve this.' };
    }
    return { label: '⏳ Pending review', cls: 'pending-badge', note: user.role === 'seller' ? 'Listing is disabled until an admin approves your account.' : 'Accepting jobs is disabled until an admin approves your account.' };
  }

  function avatarInner(user, name) {
    return user.avatar_url ? `<img src="${escapeHtml(user.avatar_url)}" alt="Profile photo">` : escapeHtml(initials(name));
  }

  function render(user) {
    const body = document.getElementById('acctBody');
    if (!body) return;
    if (!user) {
      body.innerHTML = `<p class="muted" style="text-align:center">You're browsing as a guest.</p><div class="acct-actions"><a class="btn-primary" href="login_register.html">Create account</a></div>`;
      return;
    }
    const name = user.full_name || user.name || user.email || 'FarmLink user';
    const status = statusMeta(user);
    const memberSince = formatDate(user.created_at);
    const isDark = document.body.classList.contains('dark');

    body.innerHTML = `
      <div class="acct-card">
        <div class="acct-avatar">${avatarInner(user, name)}</div>
        <div class="acct-name">${escapeHtml(name)}</div>
        <div class="acct-email">${escapeHtml(user.email || '')}</div>
        <div class="acct-badges">
          <span class="acct-role-badge">${roleLabel(user.role)}</span>
          <span class="${status.cls}">${status.label}</span>
        </div>
        <div class="acct-rows">
          ${user.phone ? `<div class="acct-row"><span>Phone</span><span>${escapeHtml(user.phone)}</span></div>` : ''}
          <div class="acct-row"><span>Role</span><span>${escapeHtml(roleLabel(user.role))}</span></div>
          ${memberSince ? `<div class="acct-row"><span>Member since</span><span>${memberSince}</span></div>` : ''}
        </div>
        ${status.note ? `<div class="acct-note">${escapeHtml(status.note)}</div>` : ''}
        <div class="acct-actions">
          <button type="button" class="btn-primary js-acct-edit">✏️ Edit profile</button>
          ${user.role === 'seller' ? '<a class="btn-secondary" href="sell-Product.html">Manage listings</a>' : ''}
          ${user.role === 'driver' ? '<a class="btn-secondary" href="driver-dashboard.html">Driver dashboard</a>' : ''}
          <button type="button" class="btn-outline js-acct-logout">Log Out</button>
        </div>
        <div class="acct-settings">
          <div class="acct-settings-title">Settings</div>
          <div class="acct-setting-row">
            <span class="acct-setting-label">
              🌓 Appearance
              <span class="acct-setting-sub" style="display:block">${isDark ? 'Dark mode' : 'Light mode'}</span>
            </span>
            <label class="theme-switch">
              <input type="checkbox" class="js-theme-switch" ${isDark ? 'checked' : ''}>
              <span class="theme-switch-track"></span>
            </label>
          </div>
        </div>
      </div>`;

    body.querySelector('.js-acct-logout')?.addEventListener('click', async () => {
      if (typeof supabaseClient !== 'undefined') await supabaseClient.auth.signOut();
      window.location.href = 'home.html';
    });
    body.querySelector('.js-acct-edit')?.addEventListener('click', () => renderEditProfile(user));

    window.FarmLinkTheme?.wire();
    body.querySelector('.js-theme-switch')?.addEventListener('change', e => {
      const sub = body.querySelector('.acct-setting-sub');
      if (sub) sub.textContent = e.target.checked ? 'Dark mode' : 'Light mode';
    });
  }

  function renderEditProfile(user) {
    const body = document.getElementById('acctBody');
    if (!body) return;
    const name = user.full_name || user.name || '';
    let pendingPhotoDataUrl = null;

    body.innerHTML = `
      <div class="acct-edit-header">
        <button type="button" class="acct-edit-back js-acct-back" aria-label="Back">←</button>
        <div class="acct-edit-title">Edit profile</div>
      </div>
      <div id="acctEditError"></div>
      <div class="acct-photo-wrap">
        <div class="acct-avatar" id="acctEditAvatar">${avatarInner(user, name)}</div>
        <button type="button" class="acct-photo-edit js-acct-photo-btn" aria-label="Change photo">📷</button>
        <input type="file" accept="image/png,image/jpeg,image/webp" id="acctPhotoInput" style="display:none">
      </div>
      <form id="acctEditForm">
        <div class="acct-field">
          <label for="acctEditName">Full name</label>
          <input type="text" id="acctEditName" value="${escapeHtml(name)}" required maxlength="150">
        </div>
        <div class="acct-field">
          <label for="acctEditPhone">Phone</label>
          <input type="tel" id="acctEditPhone" value="${escapeHtml(user.phone || '')}" maxlength="40" placeholder="Optional">
        </div>
        <div class="acct-field">
          <label for="acctEditEmail">Email</label>
          <input type="email" id="acctEditEmail" value="${escapeHtml(user.email || '')}" disabled>
        </div>
        <div class="acct-actions">
          <button type="button" class="btn-outline js-acct-back">Cancel</button>
          <button type="submit" class="btn-primary" id="acctSaveBtn">Save changes</button>
        </div>
      </form>`;

    body.querySelectorAll('.js-acct-back').forEach(btn => btn.addEventListener('click', () => render(currentUser)));

    const fileInput = body.querySelector('#acctPhotoInput');
    body.querySelector('.js-acct-photo-btn')?.addEventListener('click', () => fileInput.click());
    fileInput?.addEventListener('change', async () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      const errBox = body.querySelector('#acctEditError');
      errBox.innerHTML = '';
      try {
        pendingPhotoDataUrl = await resizeImageToDataUrl(file, 480);
        const avatarEl = body.querySelector('#acctEditAvatar');
        avatarEl.innerHTML = `<img src="${pendingPhotoDataUrl}" alt="New profile photo preview">`;
      } catch (err) {
        errBox.innerHTML = `<div class="acct-edit-error">${escapeHtml(err.message || "Couldn't read that image, please try another file.")}</div>`;
      }
    });

    body.querySelector('#acctEditForm')?.addEventListener('submit', async e => {
      e.preventDefault();
      const errBox = body.querySelector('#acctEditError');
      errBox.innerHTML = '';
      const saveBtn = body.querySelector('#acctSaveBtn');
      const full_name = body.querySelector('#acctEditName').value.trim();
      const phone = body.querySelector('#acctEditPhone').value.trim();
      if (!full_name) {
        errBox.innerHTML = `<div class="acct-edit-error">Please enter your name.</div>`;
        return;
      }
      const payload = { full_name, phone };
      if (pendingPhotoDataUrl) payload.avatar_url = pendingPhotoDataUrl;

      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving…';
      try {
        if (typeof supabaseClient === 'undefined' || !currentUser?.id) throw new Error('Could not find your account.');
        const { error } = await supabaseClient
          .from('profiles')
          .upsert({ id: currentUser.id, ...payload });
        if (error) throw new Error(error.message);

        const merged = { ...currentUser, ...payload };
        currentUser = merged;

        document.querySelectorAll('.profile-name, #profileName').forEach(el => el.textContent = merged.full_name);
        document.querySelectorAll('.profile-avatar, #profileAvatar').forEach(el => {
          el.innerHTML = merged.avatar_url
            ? `<img src="${escapeHtml(merged.avatar_url)}" alt="Profile photo" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`
            : escapeHtml(initials(merged.full_name));
        });
        render(merged);
      } catch (err) {
        errBox.innerHTML = `<div class="acct-edit-error">${escapeHtml(err.message || 'Could not save your changes. Please try again.')}</div>`;
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save changes';
      }
    });
  }

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

  // Fetches the signed-in user's Supabase session + profiles row and
  // merges them into the shape render()/renderEditProfile() expect.
  async function fetchCurrentUser() {
    if (typeof supabaseClient === 'undefined') return null;
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return null;

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    return {
      id: session.user.id,
      email: session.user.email,
      created_at: profile?.created_at || session.user.created_at,
      ...profile
    };
  }

  async function loadAndRender() {
    currentUser = await fetchCurrentUser();
    render(currentUser);
  }

  function wireTriggers() {
    document.querySelectorAll('.profile-chip, #accountBtn').forEach(el => {
      if (el.dataset.acctWired) return;
      el.dataset.acctWired = '1';
      el.style.cursor = 'pointer';
      el.addEventListener('click', openAccountPanel);
    });
  }

  window.openAccountPanel = openAccountPanel;
  window.closeAccountPanel = closeAccountPanel;

  document.addEventListener('DOMContentLoaded', wireTriggers);
})();
