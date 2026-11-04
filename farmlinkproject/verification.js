// Step 2: verify the emailed code, then send the user to newpassword.html.
const email = sessionStorage.getItem("resetEmail");
if (!email) window.location.replace("forgotpass.html");

document.getElementById("verifyEmail").textContent = email || "";

const inputs = document.querySelectorAll(".verifybox .code-row input");
const verifyBtn = document.getElementById("verifyBtn");
const resendBtn = document.getElementById("resendBtn");
const feedback = document.getElementById("verifyFeedback");
let verifying = false;

function showFeedback(msg, type) {
  feedback.textContent = msg;
  feedback.className = "reset-feedback " + type;
  feedback.style.display = "block";
}

function getCode() {
  return Array.from(inputs).map((i) => i.value).join("");
}

function clearCode() {
  inputs.forEach((i) => (i.value = ""));
  inputs[0].focus();
}

async function verifyCode() {
  const code = getCode();
  if (code.length !== inputs.length)
    return showFeedback("Please enter the full code.", "error");
  if (verifying) return;
  verifying = true;
  verifyBtn.disabled = true;
  verifyBtn.textContent = "Verifying...";

  try {
    const { error } = await supabaseClient.auth.verifyOtp({
      email,
      token: code,
      type: "recovery",
    });
    if (error) {
      showFeedback("That code is invalid or has expired. Try again or resend.", "error");
      clearCode();
      return;
    }
    showFeedback("Code verified ✓", "success");
    window.location.href = "newpassword.html";
  } catch (err) {
    showFeedback("Network error. Please try again.", "error");
  } finally {
    verifying = false;
    verifyBtn.disabled = false;
    verifyBtn.textContent = "Verify Code";
  }
}

inputs.forEach((input, index) => {
  input.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    if (e.target.value && index < inputs.length - 1) inputs[index + 1].focus();
    if (getCode().length === inputs.length) verifyCode();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !input.value && index > 0) inputs[index - 1].focus();
    if (e.key === "Enter") verifyCode();
  });

  input.addEventListener("paste", (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").trim().slice(0, inputs.length);
    if (!/^\d+$/.test(data)) return;
    data.split("").forEach((d, i) => inputs[i] && (inputs[i].value = d));
    inputs[Math.min(data.length, inputs.length - 1)].focus();
    if (data.length === inputs.length) verifyCode();
  });
});

verifyBtn.addEventListener("click", verifyCode);

// Resend with a 60 second cooldown
let cooldown = 0;
function startCooldown() {
  cooldown = 60;
  resendBtn.disabled = true;
  const t = setInterval(() => {
    cooldown--;
    resendBtn.textContent = cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code";
    if (cooldown <= 0) {
      clearInterval(t);
      resendBtn.disabled = false;
    }
  }, 1000);
}

resendBtn.addEventListener("click", async () => {
  resendBtn.disabled = true;
  const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
  if (error) {
    showFeedback(error.message, "error");
    resendBtn.disabled = false;
    return;
  }
  showFeedback("A new code has been sent to your email.", "info");
  clearCode();
  startCooldown();
});

inputs[0].focus();
