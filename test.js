/**
 * CampusCode ReBuild '26 — Zero-Dependency Verification Test Suite
 * Validates DOM selectors, navigation destinations, modal accessibility,
 * IST countdown logic, documentation claims, and JavaScript syntax.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('\n============================================================');
console.log('🧪 RUNNING CAMPUSCODE REBUILD \'26 VERIFICATION SUITE');
console.log('============================================================\n');

// 1. SCRIPT SYNTAX CHECK
console.log('--- 1. Script Syntax Verification ---');
try {
  execSync('node --check app.js', { stdio: 'pipe' });
  assert(true, 'app.js syntax is valid (node --check passed)');
} catch (err) {
  assert(false, `app.js syntax error: ${err.message}`);
}

const appJs = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const landingHtml = fs.readFileSync(path.join(__dirname, 'landing.html'), 'utf8');
const loginHtml = fs.readFileSync(path.join(__dirname, 'login.html'), 'utf8');
const registerHtml = fs.readFileSync(path.join(__dirname, 'register.html'), 'utf8');
const readmeMd = fs.readFileSync(path.join(__dirname, 'README.md'), 'utf8');

// 2. COUNTDOWN DEADLINE LOGIC
console.log('\n--- 2. Countdown Deadline Logic ---');
assert(
  appJs.includes('2026-11-06T22:00:00+05:30'),
  'app.js uses explicit fixed IST deadline timestamp (2026-11-06T22:00:00+05:30)'
);
assert(
  !appJs.includes('target.setHours(22, 0, 0, 0)'),
  'app.js does not use faulty client-local target.setHours(22, 0, 0, 0)'
);
assert(
  appJs.includes('Round 1 Concluded'),
  'app.js handles post-deadline state with "Round 1 Concluded"'
);

// 3. NOTIFICATION BADGE SYNCHRONIZATION
console.log('\n--- 3. Notification Badge Synchronization ---');
const markAllFnMatch = appJs.match(/window\.markAllNotificationsRead\s*=\s*function[\s\S]*?\{([\s\S]*?)\};/);
if (markAllFnMatch) {
  const fnBody = markAllFnMatch[1];
  assert(
    fnBody.includes('dot-badge') && fnBody.includes('icon-dot-badge'),
    'markAllNotificationsRead clears both sidebar (.dot-badge) and header (.icon-dot-badge)'
  );
} else {
  assert(false, 'window.markAllNotificationsRead function found in app.js');
}

// 4. CLIPBOARD PROMISE ERROR HANDLING
console.log('\n--- 4. Clipboard API Robustness ---');
const copyCertMatch = appJs.match(/window\.copyCertLink\s*=\s*function[\s\S]*?\{([\s\S]*?)\};/);
if (copyCertMatch) {
  const fnBody = copyCertMatch[1];
  assert(
    fnBody.includes('.catch(') || fnBody.includes('catch'),
    'copyCertLink handles clipboard writeText promise rejections'
  );
} else {
  assert(false, 'window.copyCertLink function found in app.js');
}

// 5. MODAL ACCESSIBILITY & FOCUS MANAGEMENT
console.log('\n--- 5. Modal Accessibility & Focus Trapping ---');
assert(
  indexHtml.includes('role="dialog"') && indexHtml.includes('aria-modal="true"'),
  'index.html modal overlay has role="dialog" and aria-modal="true"'
);
assert(
  indexHtml.includes('aria-labelledby="modal-rebuild-title"'),
  'index.html modal has aria-labelledby pointing to modal title'
);
assert(
  appJs.includes("'Escape'") || appJs.includes('"Escape"'),
  'app.js listens for Escape key to close open modals'
);
assert(
  appJs.includes('.focus()'),
  'app.js implements focus management/restoration for modal interactions'
);

// 6. LANDING PAGE NAVIGATION DESTINATIONS
console.log('\n--- 6. Landing Page Navigation Anchors ---');
const landingNavMatches = landingHtml.match(/<nav class="landing-nav-links"[\s\S]*?<\/nav>/);
if (landingNavMatches) {
  const navHtml = landingNavMatches[0];
  const aboutOccurrences = (navHtml.match(/href="#about"/g) || []).length;
  assert(
    aboutOccurrences <= 1,
    `landing.html main navigation avoids repeated dummy href="#about" (found ${aboutOccurrences})`
  );
} else {
  assert(false, 'landing.html navigation found');
}

// 7. BACKEND DATA CLAIMS & HONEST LABELS
console.log('\n--- 7. Backend & Mock Data Claims ---');
assert(
  !indexHtml.includes('Your CampusCode activity is loaded directly from the backend.'),
  'index.html does not claim activity is loaded directly from backend'
);
assert(
  !indexHtml.includes('My Activity / Backend Data'),
  'index.html does not mislabel mock activity section as "Backend Data"'
);
assert(
  !loginHtml.includes('cryptographically verifiable certificates'),
  'login.html does not fabricate cryptographic certificate signing claims'
);

// 8. DOCUMENTATION INTEGRITY (README.md)
console.log('\n--- 8. Documentation Accuracy (README.md) ---');
assert(
  !readmeMd.toLowerCase().includes('3d tilt physics'),
  'README.md does not claim obsolete 3D tilt physics'
);
assert(
  readmeMd.toLowerCase().includes('mock') || readmeMd.toLowerCase().includes('prototype'),
  'README.md explicitly documents mock/prototype scope'
);
assert(
  readmeMd.toLowerCase().includes('deterministic') || readmeMd.toLowerCase().includes('rule-based'),
  'README.md accurately describes RuleBot as rule-based/deterministic'
);

// 9. DOM SELECTORS CROSS-CHECK
console.log('\n--- 9. DOM Selectors Sanity Check ---');
const expectedPanels = [
  'view-overview', 'view-events', 'view-my-events', 'view-hackmate',
  'view-ideacheck', 'view-certificates', 'view-digital-card',
  'view-rulebot', 'view-notifications', 'view-profile'
];
let allPanelsFound = true;
for (const pid of expectedPanels) {
  if (!indexHtml.includes(`id="${pid}"`)) {
    allPanelsFound = false;
    break;
  }
}
assert(allPanelsFound, 'All 10 required view panels exist in index.html');

console.log('\n============================================================');
console.log(`📊 TEST RESULTS: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
console.log('============================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

