/**
 * CAMPUSCODE — STUDENT DASHBOARD (UNSLOPPED)
 * Focused routing, calm feedback, tabular countdown & official rulebot logic.
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

    // Toggle active on sidebar navigation
    document.querySelectorAll('.sidebar-nav .nav-item').forEach((item) => {
      item.classList.toggle('active', item.dataset.view === viewId);
    });

    // Toggle active view panel
    document.querySelectorAll('.view-panel').forEach((panel) => {
      panel.classList.remove('active');
    });

    const targetPanel = document.getElementById(`view-${viewId}`);
    if (targetPanel) {
      targetPanel.classList.add('active');
      activeView = viewId;

      if (bcCurrent) {
        bcCurrent.textContent = viewId.replace('-', ' ').toUpperCase();
      }

      history.replaceState(null, null, `#${viewId}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

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

  // --- 2. LIVE COUNTDOWN (ROUND 1 DEADLINE: 10:00 PM IST) ---
  const ROUND1_DEADLINE_MS = new Date('2026-11-06T22:00:00+05:30').getTime();

  function initCountdown() {
    if (!liveCountdownEl) return;

    function updateTimer() {
      const now = Date.now();
      const diff = ROUND1_DEADLINE_MS - now;

      if (diff <= 0) {
        liveCountdownEl.textContent = 'Round 1 Concluded';
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const hStr = hours < 10 ? '0' + hours : hours;
      const mStr = minutes < 10 ? '0' + minutes : minutes;
      const sStr = seconds < 10 ? '0' + seconds : seconds;

      liveCountdownEl.textContent = `${hStr}h ${mStr}m ${sStr}s Left`;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // --- 3. TOAST NOTIFICATIONS ---
  window.showToast = function (message) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `
      <span class="toast-accent-dot"></span>
      <span>${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.2s ease';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  };

  // --- 4. MODALS & ACCESSIBILITY ---
  let lastActiveModalTrigger = null;

  window.openModal = function (modalId) {
    lastActiveModalTrigger = document.activeElement;
    const targetId = modalId.startsWith('modal-') ? modalId : `modal-${modalId}`;
    const el = document.getElementById(targetId);
    if (!el) return;

    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');

    // Focus the first focusable interactive element inside the modal or the card itself
    const focusable = el.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (focusable.length > 0) {
      focusable[0].focus();
    } else {
      el.focus();
    }
  };

  window.closeModal = function (modalId) {
    const targetId = modalId.startsWith('modal-') ? modalId : `modal-${modalId}`;
    const el = document.getElementById(targetId);
    if (!el) return;

    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');

    // Restore focus to triggering element
    if (lastActiveModalTrigger && typeof lastActiveModalTrigger.focus === 'function') {
      lastActiveModalTrigger.focus();
      lastActiveModalTrigger = null;
    }
  };

  window.closeModalOnBackdrop = function (event, modalId) {
    if (event.target.id === modalId) {
      window.closeModal(modalId);
    }
  };

  // Keyboard accessibility: Escape to close open modals & Tab focus trapping
  document.addEventListener('keydown', (e) => {
    const openModalEl = document.querySelector('.modal-overlay.open');
    if (!openModalEl) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      window.closeModal(openModalEl.id);
      return;
    }

    if (e.key === 'Tab') {
      const focusable = Array.from(
        openModalEl.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
      );
      if (focusable.length === 0) return;

      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl || !openModalEl.contains(document.activeElement)) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl || !openModalEl.contains(document.activeElement)) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  });

  // --- 5. RULEBOT AI ENGINE ---
  const rulebotKnowledge = {
    '40%': `<strong>40% AI Code Rule:</strong> If more than 40% of the code is AI-written, the submission will not be considered. You must understand and be able to explain every line of your implementation during judging.`,
    'deadline': `<strong>Round 1 Schedule:</strong> Friday, 6 November from 8:00 AM to 10:00 PM IST. What is live on your deployment link at 10:00 PM is what gets evaluated.`,
    'netlify': `<strong>Netlify Drop:</strong> For vanilla HTML/CSS/JS with zero build steps, you can directly drag your project folder to <em>app.netlify.com/drop</em> to deploy instantly without GitHub.`,
    'prize': `<strong>Prizes:</strong> Winner receives a Winner Certificate and a CampusCode Internship with a <strong>₹15,000 stipend</strong>. All participants receive verifiable participation certificates.`,
    'scope': `<strong>Round 1 Scope:</strong> Faithfully recreate 4 pages: Landing page, Login page, Register page, and the Student Dashboard with My Events and Events.`,
    'round2': `<strong>Round 2:</strong> Saturday 7 Nov (10 AM to 8 PM IST) for shortlisted participants only. Redesign with an original UI preserving CampusCode's identity.`
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

    const userMsg = document.createElement('div');
    userMsg.className = 'user-msg';
    userMsg.innerHTML = `
      <div class="user-avatar-tag">YOU</div>
      <div class="user-bubble">${escapeHtml(userText)}</div>
    `;
    rulebotChatWindow.appendChild(userMsg);
    rulebotChatWindow.scrollTop = rulebotChatWindow.scrollHeight;

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let answer = '';

      if (lower.includes('40') || lower.includes('ai') || lower.includes('limit')) {
        answer = rulebotKnowledge['40%'];
      } else if (lower.includes('deadline') || lower.includes('schedule') || lower.includes('time') || lower.includes('round 1')) {
        answer = rulebotKnowledge['deadline'];
      } else if (lower.includes('netlify') || lower.includes('drop') || lower.includes('deploy')) {
        answer = rulebotKnowledge['netlify'];
      } else if (lower.includes('prize') || lower.includes('internship') || lower.includes('stipend')) {
        answer = rulebotKnowledge['prize'];
      } else if (lower.includes('scope') || lower.includes('pages')) {
        answer = rulebotKnowledge['scope'];
      } else if (lower.includes('round 2') || lower.includes('saturday')) {
        answer = rulebotKnowledge['round2'];
      } else {
        answer = `For Round 1, recreate the 4 pages (Landing, Login, Register, Dashboard) before 10:00 PM IST today, maintain under 40% AI code generation, and test your live link on desktop.`;
      }

      const botMsg = document.createElement('div');
      botMsg.className = 'bot-msg';
      botMsg.innerHTML = `
        <div class="bot-avatar">AI</div>
        <div class="bot-bubble">${answer}</div>
      `;
      rulebotChatWindow.appendChild(botMsg);
      rulebotChatWindow.scrollTop = rulebotChatWindow.scrollHeight;
    }, 300);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // --- 6. EVENT SEARCH & CATEGORY FILTER ---
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
    window.showToast(`Registration request received for ${eventName}`);
  };

  // --- 7. IDEACHECK SIMULATION ---
  window.runIdeaCheck = function () {
    const title = document.getElementById('idea-title').value.trim();
    const desc = document.getElementById('idea-desc').value.trim();

    if (!title || !desc) {
      window.showToast('Please enter project title and description');
      return;
    }

    window.showToast('Analyzing idea against ReBuild guidelines');

    setTimeout(() => {
      const res = document.getElementById('ideacheck-results');
      if (res) {
        res.classList.remove('hidden');
        res.scrollIntoView({ behavior: 'smooth' });
      }
    }, 450);
  };

  // --- 8. UTILITIES ---
  window.copyCertLink = function () {
    const url = 'https://campuscode.co.in/verify/CC-CERT-2026-9812';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => {
          window.showToast('Verification link copied');
        })
        .catch(() => {
          fallbackCopyText(url);
        });
    } else {
      fallbackCopyText(url);
    }
  };

  function fallbackCopyText(text) {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        window.showToast('Verification link copied');
      } else {
        window.showToast('Verified at: ' + text);
      }
    } catch (err) {
      window.showToast('Verified at: ' + text);
    }
  }

  window.markAllNotificationsRead = function () {
    document.querySelectorAll('.notif-item.unread').forEach((el) => {
      el.classList.remove('unread');
    });
    // Hide both topbar header badge (.icon-dot-badge) and sidebar nav badge (.dot-badge)
    document.querySelectorAll('.icon-dot-badge, .sidebar-nav .dot-badge').forEach((badge) => {
      badge.style.display = 'none';
    });
    window.showToast('All notifications marked as read');
  };

  window.handleLogout = function () {
    window.showToast('Session logged out');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 600);
  };

  // --- INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(`view-${hash}`)) {
      window.navigateTo(hash);
    } else {
      window.navigateTo('overview');
    }

    initCountdown();
  });

})();
