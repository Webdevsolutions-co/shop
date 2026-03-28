/* ============================================================
   THE CROWN CUT — AUTH LOGIC
   Uses EmailJS for sending verification codes.
   Replace EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID
   with your actual EmailJS credentials.
   ============================================================ */

// ---- EmailJS Config ----
// Sign up at emailjs.com (free), create a service + template
// Template variables: {{to_email}}, {{to_name}}, {{code}}
const EMAILJS_PUBLIC_KEY   = 'YOUR_PUBLIC_KEY';    // <-- replace
const EMAILJS_SERVICE_ID   = 'YOUR_SERVICE_ID';    // <-- replace
const EMAILJS_TEMPLATE_ID  = 'YOUR_TEMPLATE_ID';   // <-- replace

emailjs.init(EMAILJS_PUBLIC_KEY);

// ---- State ----
let pendingEmail = '';
let pendingName  = '';
let generatedCode = '';
let resendCountdown = null;

// ---- Simple in-memory "users DB" (localStorage backed) ----
function getUsers() {
  return JSON.parse(localStorage.getItem('crowncut_users') || '{}');
}
function saveUsers(users) {
  localStorage.setItem('crowncut_users', JSON.stringify(users));
}

// ---- Tab Switch ----
function switchTab(tab) {
  const login  = document.getElementById('loginPanel');
  const signup = document.getElementById('signupPanel');
  const verify = document.getElementById('verifyPanel');
  const tLogin = document.getElementById('tabLogin');
  const tSign  = document.getElementById('tabSignup');

  login.classList.add('hidden');
  signup.classList.add('hidden');
  verify.classList.add('hidden');
  tLogin.classList.remove('active');
  tSign.classList.remove('active');

  if (tab === 'login') {
    login.classList.remove('hidden');
    tLogin.classList.add('active');
  } else {
    signup.classList.remove('hidden');
    tSign.classList.add('active');
  }
}

// ---- Toast ----
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = 'toast'; }, 3500);
}

// ---- Toggle Password Visibility ----
function togglePw(id, el) {
  const input = document.getElementById(id);
  if (input.type === 'password') {
    input.type = 'text';
    el.textContent = 'Hide';
  } else {
    input.type = 'password';
    el.textContent = 'Show';
  }
}

// ---- Validation ----
function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isStrongPw(v) { return v.length >= 8; }

// ---- Generate Code ----
function makeCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ---- LOGIN ----
async function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pw    = document.getElementById('loginPassword').value;

  if (!isEmail(email)) return showToast('Please enter a valid email.', 'error');
  if (!pw)             return showToast('Please enter your password.', 'error');

  const users = getUsers();
  if (!users[email]) return showToast('No account found. Please sign up.', 'error');
  if (users[email].password !== btoa(pw)) return showToast('Incorrect password.', 'error');

  // Send verification code for 2-step login
  pendingEmail = email;
  pendingName  = users[email].name;
  await sendVerificationCode('login');
}

// ---- SIGNUP ----
async function handleSignup() {
  const first   = document.getElementById('signupFirst').value.trim();
  const last    = document.getElementById('signupLast').value.trim();
  const email   = document.getElementById('signupEmail').value.trim();
  const pw      = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;

  if (!first || !last) return showToast('Please enter your full name.', 'error');
  if (!isEmail(email)) return showToast('Please enter a valid email.', 'error');
  if (!isStrongPw(pw)) return showToast('Password must be at least 8 characters.', 'error');
  if (pw !== confirm)  return showToast('Passwords do not match.', 'error');

  const users = getUsers();
  if (users[email]) return showToast('An account with this email already exists.', 'error');

  pendingEmail = email;
  pendingName  = first + ' ' + last;

  // Store temp user
  users[email] = { name: pendingName, password: btoa(pw), verified: false };
  saveUsers(users);

  await sendVerificationCode('signup');
}

// ---- SEND CODE ----
async function sendVerificationCode(context) {
  generatedCode = makeCode();

  // Show verify panel
  document.querySelectorAll('.form-panel').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('verifyPanel').classList.remove('hidden');
  document.getElementById('verifySubtext').textContent =
    `We sent a 6-digit code to ${pendingEmail}`;

  // Clear digit inputs
  document.querySelectorAll('.code-digit').forEach(d => {
    d.value = '';
    d.classList.remove('filled');
  });
  setTimeout(() => document.querySelectorAll('.code-digit')[0]?.focus(), 100);

  // Try EmailJS
  if (EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: pendingEmail,
        to_name:  pendingName,
        code:     generatedCode,
      });
      showToast('Verification code sent! Check your email.', 'success');
    } catch (err) {
      console.error('EmailJS error:', err);
      showToast('Email sending failed. Code: ' + generatedCode, 'error');
    }
  } else {
    // Dev mode — show code in toast
    showToast('DEV MODE — Your code: ' + generatedCode, '');
    console.log('%c📧 VERIFICATION CODE: ' + generatedCode, 'color: gold; font-size: 18px; font-weight: bold;');
  }

  startResendTimer();
}

// ---- CODE INPUT NAVIGATION ----
function codeInput(el, idx) {
  el.value = el.value.replace(/\D/g, '').slice(-1);
  if (el.value) {
    el.classList.add('filled');
    const next = document.querySelectorAll('.code-digit')[idx + 1];
    if (next) next.focus();
  } else {
    el.classList.remove('filled');
  }
  // Auto-submit when all filled
  const digits = [...document.querySelectorAll('.code-digit')];
  if (digits.every(d => d.value.length === 1)) verifyCode();
}

function codeBack(el, idx) {
  if (event.key === 'Backspace' && !el.value) {
    const prev = document.querySelectorAll('.code-digit')[idx - 1];
    if (prev) { prev.value = ''; prev.classList.remove('filled'); prev.focus(); }
  }
}

// ---- VERIFY CODE ----
function verifyCode() {
  const entered = [...document.querySelectorAll('.code-digit')].map(d => d.value).join('');
  if (entered.length < 6) return showToast('Please enter the full 6-digit code.', 'error');

  if (entered === generatedCode) {
    // Mark verified
    const users = getUsers();
    if (users[pendingEmail]) {
      users[pendingEmail].verified = true;
      saveUsers(users);
    }
    // Store session
    sessionStorage.setItem('crowncut_user', JSON.stringify({
      email: pendingEmail,
      name: pendingName
    }));
    showToast('Welcome to The Crown Cut! ✂', 'success');
    setTimeout(() => { window.location.href = 'pages/home.html'; }, 1200);
  } else {
    showToast('Incorrect code. Please try again.', 'error');
    document.querySelectorAll('.code-digit').forEach(d => {
      d.value = '';
      d.classList.remove('filled');
      d.style.borderColor = 'rgba(224,82,82,0.5)';
      setTimeout(() => d.style.borderColor = '', 1000);
    });
    document.querySelectorAll('.code-digit')[0]?.focus();
  }
}

// ---- RESEND TIMER ----
function startResendTimer() {
  let secs = 60;
  clearInterval(resendCountdown);
  const timerEl = document.getElementById('resendTimer');
  const hintEl  = document.querySelector('.resend-hint a');
  if (hintEl) hintEl.style.pointerEvents = 'none';

  resendCountdown = setInterval(() => {
    secs--;
    if (timerEl) timerEl.textContent = `Resend available in ${secs}s`;
    if (secs <= 0) {
      clearInterval(resendCountdown);
      if (timerEl) timerEl.textContent = '';
      if (hintEl) hintEl.style.pointerEvents = '';
    }
  }, 1000);
}

function resendCode() {
  if (!pendingEmail) return;
  sendVerificationCode('resend');
}

// ---- GOOGLE AUTH (stub) ----
function googleAuth() {
  showToast('Google sign-in coming soon. Use email signup.', '');
}

// ---- PARTICLES ----
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 1.2 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.a  = Math.random() * 0.4 + 0.05;
  };

  function init() {
    resize();
    particles = Array.from({length: 80}, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) p.reset();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${p.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  draw();
})();

// ---- Auto-redirect if already logged in ----
if (sessionStorage.getItem('crowncut_user')) {
  window.location.href = 'pages/home.html';
}
