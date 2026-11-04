// Step 3: the user is signed in (recovery session) after verifying the code.
// Set the new password in Supabase, then sign out and go to login.
const form = document.getElementById("newPasswordForm");
const pw = document.getElementById("newPassword");
const confirmPw = document.getElementById("confirmNewPassword");
const hint = document.getElementById("pwHint");
const feedback = document.getElementById("newPwFeedback");
const saveBtn = document.getElementById("savePwBtn");

// No verified session? Send them back to start.
supabaseClient.auth.getSession().then(({ data: { session } }) => {
  if (!session) window.location.replace("forgotpass.html");
});

function showFeedback(msg, type) {
  feedback.textContent = msg;
  feedback.className = "reset-feedback " + type;
  feedback.style.display = "block";
}

document.querySelectorAll(".toggle-password").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    input.type = input.type === "password" ? "text" : "password";
  });
});

function checkMatch() {
  if (!confirmPw.value) {
    hint.textContent = "";
    hint.className = "pw-hint";
    return false;
  }
  const ok = pw.value === confirmPw.value;
  hint.textContent = ok ? "Passwords match ✓" : "Passwords do not match";
  hint.className = "pw-hint " + (ok ? "good" : "bad");
  return ok;
}
pw.addEventListener("input", checkMatch);
confirmPw.addEventListener("input", checkMatch);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (pw.value.length < 8)
    return showFeedback("Your password must be at least 8 characters.", "error");
  if (!checkMatch()) return showFeedback("Passwords do not match.", "error");

  saveBtn.disabled = true;
  saveBtn.textContent = "Saving...";
  try {
    const { error } = await supabaseClient.auth.updateUser({ password: pw.value });
    if (error) {
      const msg = /different from the old/i.test(error.message)
        ? "Your new password must be different from your old password."
        : error.message;
      return showFeedback(msg, "error");
    }
    showFeedback("Password updated! Redirecting to login...", "success");
    sessionStorage.removeItem("resetEmail");
    await supabaseClient.auth.signOut();
    setTimeout(() => window.location.replace("login_register.html"), 1500);
  } catch (err) {
    showFeedback("Network error. Please try again.", "error");
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Update Password";
  }
});
