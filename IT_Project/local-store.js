
const LOCAL_USERS_KEY = 'farmlinkDB_users';
const LOCAL_SESSION_KEY = 'farmlinkUser';

function migrateLegacyVerificationStatus(users) {
  let changed = false;
  users.forEach(u => {
    if (u.verification_status === 'verified') { u.verification_status = 'approved'; changed = true; }
  });
  if (changed) saveLocalUsers(users);
  return users;
}

function loadLocalUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY)) || [];
    return migrateLegacyVerificationStatus(users);
  }
  catch { return []; }
}
function saveLocalUsers(users) { localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users)); }

function loadLocalSession() {
  try {
    const user = JSON.parse(localStorage.getItem(LOCAL_SESSION_KEY));
    if (user && user.verification_status === 'verified') {
      user.verification_status = 'approved';
      saveLocalSession(user);
    }
    return user;
  }
  catch { return null; }
}
function saveLocalSession(user) { localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user)); }


function updateLocalUserProfile(userId, patch) {
  const users = loadLocalUsers();
  const idx = users.findIndex(u => String(u.id) === String(userId));
  if (idx === -1) throw new Error('Account not found in this browser.');
  const merged = { ...users[idx], ...patch };
  users[idx] = merged;
  saveLocalUsers(users);

  const session = loadLocalSession();
  if (session && String(session.id) === String(userId)) {
    const { password_hash, ...safeUser } = merged;
    saveLocalSession(safeUser);
    return safeUser;
  }
  const { password_hash, ...safeUser } = merged;
  return safeUser;
}

window.FarmLinkLocalStore = { loadLocalUsers, saveLocalUsers, loadLocalSession, saveLocalSession, updateLocalUserProfile };
