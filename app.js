/**
 * CAMPUSCODE — DIMENSIONAL STUDENT DASHBOARD
 * Application Logic, 3D Tilt Physics & Interactive Features
 * Hackathon Arena — ReBuild '26 Round 1
 */

(function () {
  'use strict';

  // --- STATE ---
  let activeView = 'overview';

  // --- DOM CACHE ---
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const bcCurrent = document.getElementById('bc-current-section');
  const liveCountdownEl = document.getElementById('live-countdown');
  const toastContainer = document.getElementById('toast-container');
  const rulebotChatWindow = document.getElementById('rulebot-chat-window');
  const rulebotInput = document.getElementById('rulebot-input');

  // --- 1. NAVIGATION & ROUTING ---
  window.navigateTo = function (viewId) {
    if (!viewId) return;

    // Remove active from all nav items
    document.querySelectorAll('.sidebar-nav .nav-item').forEach((item) => {
      item.classList.toggle('active', item.dataset.view === viewId);
    });

    // Remove active from all view panels
    document.querySelectorAll('.view-panel').forEach((panel) => {
      panel.classList.remove('active');
    });

    // Activate the requested panel
    const targetPanel = document.getElementById(`view-${viewId}`);
    if (targetPanel) {
      targetPanel.classList.add('active');
      activeView = viewId;

      // Update breadcrumb
      if (bcCurrent) {
        bcCurrent.textContent = viewId.replace('-', ' ').toUpperCase();
      }

      // Update hash in URL
      history.replaceState(null, null, `#${viewId}`);

      // Scroll viewport back to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Close mobile drawer if open
    closeMobileSidebar();
  };

  function closeMobileSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
  }

  function openMobileSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      if (sidebar && sidebar.classList.contains('open')) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeMobileSidebar);
  }

  // --- 2. 3D DIMENSIONAL TILT PHYSICS ---
  function init3DTilt() {
    // Respect user motion preferences & touch devices
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReducedMotion || isTouch) return;

    const tiltElements = document.querySelectorAll('.tilt-card, .tilt-stat-card');

    tiltElements.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within element
        const y = e.clientY - rect.top;  // y position within element

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = (x - centerX) / centerX; // Normalized -1 to +1
        const deltaY = (y - centerY) / centerY;

        // Degree limits: subtle, elegant 3D tilt
        const maxTilt = el.classList.contains('student-hero-card') ? 7 : 9;
        const rotateX = (-deltaY * maxTilt).toFixed(2);
        const rotateY = (deltaX * maxTilt).toFixed(2);

        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      });
    });
  }

  // --- 3. COUNTDOWN TIMER (ROUND 1 DEADLINE: 10:00 PM IST) ---
  function initCountdown() {
    if (!liveCountdownEl) return;

    function updateTimer() {
      const now = new Date();
      // Target: 10:00 PM IST today (22:00:00)
      const target = new Date();
      target.setHours(22, 0, 0, 0);

      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        liveCountdownEl.textContent = 'ROUND 1 CONCLUDED';
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const hStr = hours < 10 ? '0' + hours : hours;
      const mStr = minutes < 10 ? '0' + minutes : minutes;
      const sStr = seconds < 10 ? '0' + seconds : seconds;

      liveCountdownEl.textContent = `${hStr}h ${mStr}m ${sStr}s LEFT`;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // --- 4. TOAST NOTIFICATION SYSTEM ---
  window.showToast = function (message) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `
      <span class="toast-accent-dot"></span>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  };

  // --- 5. MODAL MANAGEMENT ---
  window.openModal = function (modalId) {
    const el = document.getElementById(modalId.startsWith('modal-') ? modalId : `modal-${modalId}`);
    if (el) el.classList.add('open');
  };

  window.closeModal = function (modalId) {
    const el = document.getElementById(modalId.startsWith('modal-') ? modalId : `modal-${modalId}`);
    if (el) el.classList.remove('open');
  };

  window.closeModalOnBackdrop = function (event, modalId) {
    if (event.target.id === modalId) {
      window.closeModal(modalId);
    }
  };

  // --- 6. RULEBOT AI CHAT ENGINE (VERIFIED AGAINST REBUILD '26 PDF) ---
  const rulebotKnowledge = {
    '40%': `<strong>40% AI Code Rule:</strong> The organizers strictly review submitted repositories. If more than 40% of the code is AI-written, your submission will not be considered. You must be prepared to explain every line of your implementation during Round 3 interviews.`,
    'deadline': `<strong>Round 1 Schedule:</strong> Friday, 6 November from 8:00 AM to 10:00 PM IST. What is live on your deployment link at 10:00 PM is what gets evaluated. Round 2 shortlist is released after 10:00 PM in the WhatsApp group.`,
    'netlify': `<strong>Netlify Drop Instructions:</strong> If your project uses vanilla HTML/CSS/JS with zero build steps, you can directly upload your project folder to <em>app.netlify.com/drop</em> without using GitHub. It generates a live URL in seconds.`,
    'prize': `<strong>Prizes & Recognition:</strong> The Winner receives a Winner Certificate and a CampusCode Internship with a <strong>₹15,000 stipend</strong>. Runner-up receives a Runner-up Certificate. All participants receive verifiable participation certificates.`,
    'scope': `<strong>Scope for Round 1:</strong> Faithfully recreate 4 pages: Landing page, Login page, Register page, and the Student Dashboard (showing My Events and Events). Subtle animations and colors that blend in are welcomed.`,
    'round2': `<strong>Round 2:</strong> Saturday 7 Nov (10 AM - 8 PM IST). Only for shortlisted top performers. In Round 2, you redesign the UI with a complete new look while preserving CampusCode's aesthetic.`
  };

  window.askRulebot = function (questionText) {
    if (rulebotInput) rulebotInput.value = questionText;
    postRulebotUserMessage(questionText);
  };

  window.handleRulebotSubmit = function (e) {
    e.preventDefault();
    if (!rulebotInput) return;
    const text = rulebotInput.value.trim();
    if (!text) return;
    postRulebotUserMessage(text);
    rulebotInput.value = '';
  };

  function postRulebotUserMessage(userText) {
    if (!rulebotChatWindow) return;

    // Append User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'user-msg';
    userMsg.innerHTML = `
      <div class="user-avatar-tag">YOU</div>
      <div class="user-bubble">${escapeHtml(userText)}</div>
    `;
    rulebotChatWindow.appendChild(userMsg);

    // Auto-scroll
    rulebotChatWindow.scrollTop = rulebotChatWindow.scrollHeight;

    // Compute Answer
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let answer = '';

      if (lower.includes('40') || lower.includes('ai') || lower.includes('limit')) {
        answer = rulebotKnowledge['40%'];
      } else if (lower.includes('deadline') || lower.includes('schedule') || lower.includes('time') || lower.includes('round 1')) {
        answer = rulebotKnowledge['deadline'];
      } else if (lower.includes('netlify') || lower.includes('drop') || lower.includes('deploy') || lower.includes('host')) {
        answer = rulebotKnowledge['netlify'];
      } else if (lower.includes('prize') || lower.includes('internship') || lower.includes('stipend')) {
        answer = rulebotKnowledge['prize'];
      } else if (lower.includes('scope') || lower.includes('pages')) {
        answer = rulebotKnowledge['scope'];
      } else if (lower.includes('round 2') || lower.includes('saturday')) {
        answer = rulebotKnowledge['round2'];
      } else {
        answer = `I am trained on the ReBuild '26 official rulebook. For Round 1, ensure you faithfully recreate the 4 pages (Landing, Login, Register, Dashboard) before 10:00 PM IST today, maintain under 40% AI code generation, and test your live link on desktop.`;
      }

      const botMsg = document.createElement('div');
      botMsg.className = 'bot-msg';
      botMsg.innerHTML = `
        <div class="bot-avatar">AI</div>
        <div class="bot-bubble">${answer}</div>
      `;
      rulebotChatWindow.appendChild(botMsg);
      rulebotChatWindow.scrollTop = rulebotChatWindow.scrollHeight;
    }, 450);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // --- 7. EVENT SEARCH & CATEGORY FILTER ---
  window.handleEventSearch = function (query) {
    const q = query.toLowerCase().trim();
    const cards = document.querySelectorAll('#events-browse-grid .event-browse-card');

    cards.forEach((card) => {
      const title = card.querySelector('.event-card-title').textContent.toLowerCase();
      const desc = card.querySelector('.event-card-desc').textContent.toLowerCase();
      const match = title.includes(q) || desc.includes(q);
      card.style.display = match ? 'flex' : 'none';
    });
  };

  window.filterEvents = function (category, btnElement) {
    document.querySelectorAll('.cat-pill').forEach((btn) => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    const cards = document.querySelectorAll('#events-browse-grid .event-browse-card');
    cards.forEach((card) => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  window.showRegisterModal = function (eventName) {
    window.showToast(`Registration request received for "${eventName}". Confirmation code sent!`);
  };

  // --- 8. IDEACHECK SIMULATION ---
  window.runIdeaCheck = function () {
    const title = document.getElementById('idea-title').value.trim();
    const desc = document.getElementById('idea-desc').value.trim();

    if (!title || !desc) {
      window.showToast('Please enter both project title and description to run IdeaCheck AI.');
      return;
    }

    window.showToast('IdeaCheck AI: Analyzing feasibility, market fit & ReBuild guidelines...');

    setTimeout(() => {
      const res = document.getElementById('ideacheck-results');
      if (res) {
        res.classList.remove('hidden');
        res.scrollIntoView({ behavior: 'smooth' });
      }
    }, 600);
  };

  // --- 9. CERTIFICATES & ID CARD UTILS ---
  window.copyCertLink = function () {
    const url = 'https://campuscode.co.in/verify/CC-CERT-2026-9812';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        window.showToast('Verification link copied to clipboard!');
      });
    } else {
      window.showToast('Verified at: ' + url);
    }
  };

  window.markAllNotificationsRead = function () {
    document.querySelectorAll('.notif-item.unread').forEach((el) => {
      el.classList.remove('unread');
    });
    const badge = document.querySelector('.icon-dot-badge');
    if (badge) badge.style.display = 'none';
    window.showToast('All notifications marked as read.');
  };

  window.handleLogout = function () {
    window.showToast('Session logged out. Redirecting to login page...');
  };

  // --- INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    // Check URL hash for direct deep-linking
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(`view-${hash}`)) {
      window.navigateTo(hash);
    } else {
      window.navigateTo('overview');
    }

    init3DTilt();
    initCountdown();
  });

})();

