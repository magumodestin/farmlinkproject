const forgotForm = document.getElementById("forgotForm");
const forgotFeedback = document.getElementById("forgotFeedback");
const emailInput = document.getElementById("email");

function showForgotFeedback(msg, type) {
  forgotFeedback.textContent = msg;
  forgotFeedback.className = "reset-feedback " + type;
  forgotFeedback.style.display = "block";
}

function shakeInput() {
  emailInput.classList.remove("shake");
  void emailInput.offsetWidth; // restart the animation
  emailInput.classList.add("shake");
}

forgotForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim().toLowerCase();
  if (!email) return showForgotFeedback("Please enter your email.", "error");

  const btn = forgotForm.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Checking...";

  try {
    // 1. Does this email have an account?
    const { data: exists, error: checkError } = await supabaseClient.rpc(
      "email_exists",
      { check_email: email },
    );
    if (checkError) {
      return showForgotFeedback(
        "Something went wrong. Please try again.",
        "error",
      );
    }
    if (!exists) {
      shakeInput();
      return showForgotFeedback(
        "We couldn't find an account with that email address.",
        "error",
      );
    }

    // 2. It exists, so send the code
    btn.textContent = "Sending...";
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
    if (error) {
      const msg = /rate limit|seconds/i.test(error.message)
        ? "Too many requests. Please wait a minute and try again."
        : error.message;
      return showForgotFeedback(msg, "error");
    }

    sessionStorage.setItem("resetEmail", email);
    window.location.href = "verification.html";
  } catch (err) {
    showForgotFeedback("Network error. Please try again.", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = original;
  }
});

emailInput.addEventListener("input", () => {
  emailInput.classList.remove("shake");
  forgotFeedback.style.display = "none";
});
