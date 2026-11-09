function initials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).slice(0, 2).map(p => p[0].toUpperCase()).join('');
}

async function logout() {
  await supabaseClient.auth.signOut();
  try { localStorage.removeItem('farmlinkUser'); } catch (_) {}
  window.location.href = 'login_register.html';
}

document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

  if (sessionError) console.error(sessionError);

  if (!session) {
    window.location.replace('login_register.html');
    return;
  }

  const { data: profile, error: profileError } = await supabaseClient
    .from('profiles')
    .select('full_name, role, avatar_url')
    .eq('id', session.user.id)
    .single();

  if (profileError) console.error(profileError);

  if (profile?.role === 'driver') {
    window.location.replace('driver-dashboard.html');
    return;
  }

  const displayName = profile?.full_name || session.user.email || 'Account';

  // Header profile chip (id's as used in dashboard.html)
  const profileNameEl = document.getElementById('profileName');
  if (profileNameEl) profileNameEl.textContent = displayName;

  const profileRoleEl = document.getElementById('profileRole');
  if (profileRoleEl) profileRoleEl.textContent = profile?.role
    ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
    : '';

  const profileAvatarEl = document.getElementById('profileAvatar');
  if (profileAvatarEl) {
    if (profile?.avatar_url) {
      profileAvatarEl.innerHTML = `<img src="${profile.avatar_url}" alt="Profile photo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    } else {
      profileAvatarEl.textContent = initials(displayName);
    }
  }

  document.getElementById('logoutBtn')?.addEventListener('click', logout);
});


// Collapsible floating dock (hamburger)
document.addEventListener('DOMContentLoaded', () => {
  const dock = document.getElementById('featureDock');
  const toggle = document.getElementById('dockToggle');
  if (!dock || !toggle) return;

  const setOpen = (open) => {
    dock.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close quick actions' : 'Open quick actions');
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!dock.classList.contains('open'));
  });

  // Close after choosing an action, on outside click, or on Escape
  dock.querySelectorAll('.dock-menu button').forEach((btn) =>
    btn.addEventListener('click', () => setOpen(false))
  );
  document.addEventListener('click', (e) => {
    if (!dock.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  // Mirror the cart count onto the hamburger so it stays visible when collapsed
  const cartCount = document.getElementById('dockCartCount');
  const toggleBadge = document.getElementById('dockToggleBadge');
  if (cartCount && toggleBadge) {
    const sync = () => {
      const n = cartCount.textContent.trim();
      toggleBadge.textContent = n;
      toggleBadge.hidden = !n || n === '0';
    };
    sync();
    new MutationObserver(sync).observe(cartCount, { childList: true, characterData: true, subtree: true });
  }
});
