// ============================================================
// CipherAudit — password strength checker
// This is a JavaScript port of a rule-based Python function:
// it checks length, digit, uppercase, lowercase, and special
// character requirements IN ORDER, and stops at the first one
// that fails — exactly like the original Python version.
// Nothing here ever leaves the browser: no fetch, no storage.
// ============================================================

const pwInput = document.getElementById('pwInput');
const toggleBtn = document.getElementById('toggleVisibility');
const eyeIcon = document.getElementById('eyeIcon');
const copyBtn = document.getElementById('copyBtn');
const generateBtn = document.getElementById('generateBtn');
const resultEl = document.getElementById('resultMessage');
const verdictEl = document.getElementById('verdictText');
const pins = Array.from(document.querySelectorAll('.pin'));
const bruteSim = document.getElementById('bruteSim');
const bruteSimText = document.getElementById('bruteSimText');
const toastEl = document.getElementById('copyToast');
const toastBody = document.getElementById('toastBody');

/**
 * Direct JS translation of:
 *
 * def check_password_strength(password):
 *     if len(password) < 8:
 *         return "Weak Password: Password must be at least 8 characters long."
 *     if not re.search(r"\d", password):
 *         return "Weak Password: Password must include a number."
 *     if not re.search(r"[A-Z]", password):
 *         return "Weak Password: Password must include an uppercase character."
 *     if not re.search(r"[a-z]", password):
 *         return "Weak Password: Password must include a lowercase character."
 *     if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
 *         return "Weak Password: Password must include a special character."
 *     return "Strong Password: Your password is secure!"
 *
 * Python's re.search(pattern, string) looks for pattern anywhere in string.
 * JavaScript's regex.test(string) does the same thing.
 */
function checkPasswordStrength(password) {
  if (password.length < 8) {
    return "Weak Password: Password must be at least 8 characters long.";
  }
  if (!/\d/.test(password)) { // \d = any digit (0-9)
    return "Weak Password: Password must include a number.";
  }
  if (!/[A-Z]/.test(password)) { // checking for uppercase character
    return "Weak Password: Password must include an uppercase character.";
  }
  if (!/[a-z]/.test(password)) { // checking for lowercase character
    return "Weak Password: Password must include a lowercase character.";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) { // checking for special character
    return "Weak Password: Password must include a special character.";
  }
  return "Strong Password: Your password is secure!";
}

/**
 * The checklist and lock meter are a visual layer on top of the same
 * five checks above — they show ALL requirements at once, rather than
 * stopping at the first failure like the Python function does.
 */
function getIndividualChecks(password) {
  return {
    length: password.length >= 8,
    number: /\d/.test(password),
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
}

/**
 * A visual-only brute-force simulation: while the password fails a check,
 * rapidly cycle through random guesses of the same length so the abstract
 * idea of "brute forcing" becomes something you can actually watch happen.
 * This has no bearing on the real verdict — it's purely illustrative.
 */
let bruteInterval = null;
const GUESS_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';

function randomGuess(length) {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += GUESS_CHARS[Math.floor(Math.random() * GUESS_CHARS.length)];
  }
  return out;
}

function startBruteSim(length) {
  bruteSim.classList.add('active');
  clearInterval(bruteInterval);
  bruteInterval = setInterval(() => {
    bruteSimText.textContent = `ATTEMPTING: ${randomGuess(length)}`;
  }, 70);
}

function stopBruteSim(message) {
  clearInterval(bruteInterval);
  bruteInterval = null;
  if (message) {
    bruteSim.classList.add('active');
    bruteSimText.textContent = message;
  } else {
    bruteSim.classList.remove('active');
    bruteSimText.textContent = '';
  }
}

function showToast(message) {
  toastBody.textContent = message;
  const toast = new bootstrap.Toast(toastEl, { delay: 2200 });
  toast.show();
}

function updateUI(pw) {
  const message = pw ? checkPasswordStrength(pw) : '—';
  const isStrong = message.startsWith('Strong');

  // Result readout mirrors exactly what the Python version would print
  resultEl.textContent = message;
  resultEl.classList.remove('weak', 'strong', 'vstrong');
  if (pw) resultEl.classList.add(isStrong ? 'vstrong' : 'weak');

  // Checklist + lock meter: show every requirement, not just the first failure
  const checks = getIndividualChecks(pw);
  const passedCount = pw ? Object.values(checks).filter(Boolean).length : 0;

  Object.entries(checks).forEach(([key, passed]) => {
    const li = document.querySelector(`.checklist li[data-check="${key}"]`);
    if (!li) return;
    const show = pw.length > 0 && passed;
    li.classList.toggle('pass', show);
    li.querySelector('.stamp').textContent = show ? '✓' : '✕';
  });

  pins.forEach((pin, i) => pin.classList.toggle('lit', i < passedCount));

  verdictEl.textContent = !pw
    ? 'AWAITING INPUT'
    : isStrong
      ? 'STRONG PASSWORD'
      : 'WEAK — SEE RESULT ABOVE';

  // Drive the brute-force simulation panel off the same verdict
  if (!pw) {
    stopBruteSim(null);
  } else if (isStrong) {
    stopBruteSim('Too complex to brute-force in a reasonable time. ✓');
  } else {
    startBruteSim(pw.length);
  }
}

// ---- Event listeners ----

pwInput.addEventListener('input', (e) => updateUI(e.target.value));

toggleBtn.addEventListener('click', () => {
  const isPassword = pwInput.type === 'password';
  pwInput.type = isPassword ? 'text' : 'password';
  toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
  eyeIcon.innerHTML = isPassword
    ? '<path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a21.86 21.86 0 0 1 5.06-6.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.86 21.86 0 0 1-3.22 4.53M1 1l22 22"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>'
    : '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/>';
});

/**
 * Direct JS port of your Python password generator:
 *
 * password = []
 * password.append(random.choice(uppercase_chars))
 * password.append(random.choice(lowercase_chars))
 * password.append(random.choice(numbers))
 * password.append(random.choice(spl_chars))
 * for i in range(length - 4):
 *     password.append(random.choice(chars))
 * random.shuffle(password)
 * password = ''.join(password)
 *
 * Same logic, same order — the only change is swapping random.choice()
 * for a crypto.getRandomValues()-backed picker, since Python's random
 * module (and JS's Math.random()) aren't cryptographically secure.
 */
function generateStrongPassword(length = 12) {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const splChars = '!@#$%&(){}|'; // removed [ and ] — checker's regex (from the original Python) doesn't recognize them as special characters
  const chars = lowercaseChars + uppercaseChars + numbers + splChars;

  const pick = (charset) => charset[secureRandomInt(charset.length)];

  // Step 1: guarantee one of each required character type
  let password = [
    pick(uppercaseChars),
    pick(lowercaseChars),
    pick(numbers),
    pick(splChars)
  ];

  // Step 2: fill the remaining length - 4 slots from the full mixed pool
  for (let i = 0; i < length - 4; i++) {
    password.push(pick(chars));
  }

  // Step 3: shuffle so the guaranteed characters aren't always at the front
  // (JS has no built-in random.shuffle(), so this is a Fisher-Yates shuffle —
  // it does the same job: swap each position with a random earlier-or-equal one)
  for (let i = password.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join('');
}

function secureRandomInt(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

copyBtn.addEventListener('click', async () => {
  if (!pwInput.value) {
    showToast('Nothing to copy yet.');
    return;
  }
  try {
    await navigator.clipboard.writeText(pwInput.value);
    showToast('Password copied to clipboard.');
  } catch (err) {
    showToast('Copy failed — try selecting the text manually.');
  }
});

generateBtn.addEventListener('click', () => {
  const newPassword = generateStrongPassword(12);
  pwInput.type = 'text';
  eyeIcon.innerHTML = '<path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a21.86 21.86 0 0 1 5.06-6.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.86 21.86 0 0 1-3.22 4.53M1 1l22 22"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>';
  pwInput.value = newPassword;
  updateUI(newPassword);
  showToast('Strong password generated.');
  pwInput.focus();
});

// Initialize UI in empty state
updateUI('');