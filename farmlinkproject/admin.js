/* FarmLink admin dashboard.
   Requires the existing Supabase client in supabaseClient.js.
   The client must be available as `supabase` or `window.supabaseClient`.
   The database must have the admin-only SELECT policy and the
   admin_set_seller_status(seller_user_id, new_status) RPC function. */
(() => {
  const client = window.supabaseClient || (typeof supabase !== 'undefined' ? supabase : null);
  const $ = (id) => document.getElementById(id);
  const rows = $('sellerRows');
  const message = $('message');
  let sellers = [];

  function showMessage(text, type = 'error') {
    message.textContent = text;
    message.className = `message show ${type}`;
  }
  function clearMessage() {
    message.textContent = '';
    message.className = 'message';
  }
  function statusOf(value) {
    const status = String(value || 'pending').toLowerCase();
    return status === 'verified' ? 'approved' : status;
  }
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  async function requireAdmin() {
    if (!client) throw new Error('Supabase client not found. Check supabaseClient.js and ensure it loads before admin.js.');
    const { data: { session }, error } = await client.auth.getSession();
    if (error) throw error;
    if (!session) {
      window.location.replace('login_register.html');
      return false;
    }
    const role = session.user?.app_metadata?.role;
    if (role !== 'admin') {
      document.body.innerHTML = '<main style="font-family:Arial;padding:40px"><h1>Access denied</h1><p>This account is not authorised to use the FarmLink admin dashboard.</p><a href="login_register.html">Return to login</a></main>';
      return false;
    }
    $('adminEmail').textContent = session.user.email || 'Admin account';
    return true;
  }

  function updateStats() {
    const counts = { pending: 0, approved: 0, rejected: 0 };
    sellers.forEach(s => {
      const status = statusOf(s.verification_status);
      if (Object.prototype.hasOwnProperty.call(counts, status)) counts[status]++;
    });
    $('pendingCount').textContent = counts.pending;
    $('approvedCount').textContent = counts.approved;
    $('rejectedCount').textContent = counts.rejected;
    $('totalCount').textContent = sellers.length;
  }

  function renderRows() {
    const term = $('searchInput').value.trim().toLowerCase();
    const filtered = sellers.filter(s => [
      s.full_name, s.seller_id, s.farm_location, s.phone
    ].some(v => String(v || '').toLowerCase().includes(term)));

    $('resultCount').textContent = `${filtered.length} seller${filtered.length === 1 ? '' : 's'} shown`;
    if (!filtered.length) {
      rows.innerHTML = '<tr><td colspan="6" class="empty-cell">No seller registrations found.</td></tr>';
      return;
    }
    rows.innerHTML = filtered.map(s => {
      const status = statusOf(s.verification_status);
      const id = escapeHtml(s.id);
      const actions = status === 'pending'
        ? `<button class="action-btn approve-btn" data-id="${id}" data-status="approved">Approve</button><button class="action-btn reject-btn" data-id="${id}" data-status="rejected">Reject</button>`
        : `<button class="action-btn approve-btn" data-id="${id}" data-status="approved">Approve</button><button class="action-btn reject-btn" data-id="${id}" data-status="rejected">Reject</button>`;
      return `<tr>
        <td><span class="seller-name">${escapeHtml(s.full_name || 'Name not provided')}</span><span class="seller-email">User ID: ${id}</span></td>
        <td>${escapeHtml(s.seller_id || '—')}</td>
        <td>${escapeHtml(s.farm_location || '—')}</td>
        <td>${escapeHtml(s.phone || '—')}</td>
        <td><span class="status ${escapeHtml(status)}">${escapeHtml(status)}</span></td>
        <td><div class="actions">${actions}</div></td>
      </tr>`;
    }).join('');
  }

  async function loadSellers() {
    clearMessage();
    rows.innerHTML = '<tr><td colspan="6" class="empty-cell">Loading seller registrations…</td></tr>';
    const { data, error } = await client.from('profiles')
      .select('id, full_name, phone, seller_id, farm_location, verification_status, role')
      .eq('role', 'seller')
      .order('created_at', { ascending: false });
    if (error) {
      rows.innerHTML = '<tr><td colspan="6" class="empty-cell">Could not load seller registrations.</td></tr>';
      showMessage(error.message);
      return;
    }
    sellers = data || [];
    updateStats();
    renderRows();
  }

  async function changeStatus(userId, newStatus, button) {
    if (!['approved', 'rejected', 'pending'].includes(newStatus)) return;
    const seller = sellers.find(s => String(s.id) === String(userId));
    const label = seller?.full_name || 'this seller';
    const verb = { approved: 'approve', rejected: 'reject', pending: 'reset to pending' }[newStatus];
    if (!window.confirm(`Are you sure you want to ${verb} ${label}?`)) return;

    button.disabled = true;
    clearMessage();
    const { error } = await client.rpc('admin_set_seller_status', {
      seller_user_id: userId,
      new_status: newStatus
    });
    button.disabled = false;
    if (error) {
      showMessage(`Could not update seller status: ${error.message}`);
      return;
    }
    showMessage(`${label} has been ${newStatus}.`, 'success');
    await loadSellers();
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-id][data-status]');
    if (button) changeStatus(button.dataset.id, button.dataset.status, button);
  });
  $('refreshBtn').addEventListener('click', loadSellers);
  $('searchInput').addEventListener('input', renderRows);
  $('logoutBtn').addEventListener('click', async () => {
    if (client) await client.auth.signOut();
    window.location.replace('login_register.html');
  });

  (async () => {
    try {
      if (await requireAdmin()) await loadSellers();
    } catch (error) {
      showMessage(error.message || 'Could not initialise admin dashboard.');
    }
  })();
})();
