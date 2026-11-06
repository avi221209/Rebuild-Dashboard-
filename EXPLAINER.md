# CampusCode ReBuild '26 — Comprehensive Code Explainer & Defense Guide
**Target Submission:** Student Dashboard & Hackathon Platform  
**Target Event:** ReBuild '26 Round 1 | CampusCode  
**Author / Participant:** Sai Krishna  

---

## ⚠️ CRITICAL COMPLIANCE NOTICE: AI AUTHORSHIP & 40% RULE

> [!CAUTION]
> **MANDATORY PARTICIPANT ACTION REQUIRED:**  
> The official ReBuild '26 Round 1 rules state:  
> *"If more than 40% of your code is AI-written, your submission will not be considered. You must understand and be able to explain every line."*  
>  
> **DISCLOSURE:** The files in this repository were generated and refined using AI-assisted pair-programming tools. **Reading or submitting this explanation guide does NOT alter the fact that the underlying code was AI-generated, nor does it automatically bypass or satisfy the 40% threshold.**  
>  
> **RECOMMENDED ACTION:**  
> 1. Proactively contact the CampusCode hackathon organizers / Discord coordinators to clarify whether submissions developed with AI tools are eligible if the participant can defend and explain 100% of the code during an oral viva.  
> 2. Use this guide to master every architectural concept, mathematical calculation, DOM manipulation, and CSS pattern in the project so you are completely prepared to walk judges through any line of code.

---

## 1. HIGH-LEVEL ARCHITECTURE

The application is built as a **zero-build-step, framework-free Single-Page Application (SPA)** utilizing only native browser primitives:
- **HTML5:** Semantic document outlines (`<header>`, `<nav>`, `<main>`, `<aside>`, `<section>`, `<footer>`, `<dialog>` roles).
- **CSS3:** Custom Properties (`var(--...)`), CSS Grid, Flexbox, and media queries for responsive layouts.
- **Vanilla ES6+ JavaScript:** An Immediately Invoked Function Expression (IIFE) encapsulating state, routing, countdown math, modal accessibility, and event listeners.

```
┌────────────────────────────────────────────────────────┐
│                      BROWSER                           │
│  ┌───────────────┐ ┌────────────────────────────────┐  │
│  │   SIDEBAR     │ │       MAIN CONTENT STAGE       │  │
│  │  - Brand      │ │  ┌──────────────────────────┐  │  │
│  │  - Nav Items  │ │  │ Topbar & Live Countdown  │  │  │
│  │  - User Chip  │ │  ├──────────────────────────┤  │  │
│  └───────┬───────┘ │  │ Active View Panel        │  │  │
│          │         │  │ (#overview, #events, etc)│  │  │
│          ▼         │  └──────────────────────────┘  │  │
│   navigateTo() ───►│  Toggles .active CSS class     │  │
└────────────────────────────────────────────────────────┘
```

### Why Vanilla JavaScript over React/Vue/Next.js?
1. **Netlify Drop Deployability:** Netlify Drop allows immediate hosting simply by dragging the project folder onto the browser. There are no build scripts (`npm run build`), no bundle outputs (`dist/`), and zero risk of node version mismatches.
2. **Performance & Lightweight Footprint:** The entire bundle is under 150 KB including fonts and the brand logo, resulting in instant First Contentful Paint (FCP) and Time to Interactive (TTI).
3. **No Dependency Vulnerabilities:** Zero external runtime packages eliminates supply-chain risks.

---

## 2. THE DESIGN TOKEN SYSTEM (`style.css`)

All visual styling is orchestrated through CSS Custom Properties defined at the `:root` level. This guarantees consistent spacing, color harmony, and straightforward theming:

```css
:root {
  /* Color Palette */
  --bg-canvas: #f7f7f4;       /* Calm off-white backdrop */
  --card-surface: #ffffff;    /* Pure white for foreground cards */
  --border-subtle: #deded8;   /* Hairline borders between elements */
  --text-primary: #111111;    /* High-contrast body and heading text */
  --text-muted: #666666;      /* Secondary descriptions and captions */
  --purple-brand: #7665ff;    /* Primary CampusCode purple */
  --lime-accent: #a8e62e;     /* High-energy active highlight */
  --lime-dark: #82b91a;       /* Active hover state */

  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'DM Mono', monospace;

  /* Spacing Scale (4px Cadence) */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
}
```

### Key Layout Techniques:
- **`display: grid` with `grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))`:** Creates fluid, responsive grids for stats and event cards without requiring rigid media queries for every screen width.
- **Fixed Sidebar + Dynamic Margin:** The desktop sidebar is `position: fixed; width: 260px;`, and the main wrapper uses `margin-left: 260px;`. On screens below `768px`, the sidebar transforms to an off-canvas drawer (`transform: translateX(-100%)`) with an active backdrop overlay.

---

## 3. CORE JAVASCRIPT MODULES & MECHANISMS (`app.js`)

The entire client script is wrapped in an IIFE to prevent polluting the global window object while deliberately exposing only public action triggers:

```javascript
(function () {
  'use strict';
  // Module private state & utilities
  ...
})();
```

### Module 1: The SPA View Router (`navigateTo`)
Instead of requesting separate HTML files from a server, all 10 dashboard panels (`overview`, `events`, `my-events`, `certificates`, etc.) exist in the DOM inside `<section class="view-panel" id="view-<name>">`.
1. All `.view-panel` elements are hidden by default via `display: none;` in CSS.
2. When `navigateTo('events')` is called:
   - It queries all `.view-panel` elements and removes the `.active` class.
   - It retrieves `document.getElementById('view-events')` and adds `.active` (`display: block;`).
   - It updates the sidebar button highlight (`.active` gets `background: var(--lime-accent)`).
   - It syncs the browser URL hash via `history.replaceState(null, null, '#events')` so bookmarks and browser refresh preserve the current view.

### Module 2: Fixed Deadline Countdown (`initCountdown`)
Round 1 closes strictly at **10:00 PM IST on Friday, 6 November 2026**.
```javascript
const ROUND1_DEADLINE_MS = new Date('2026-11-06T22:00:00+05:30').getTime();

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
  ...
}
```
**Why this is robust:**
- It parses an explicit ISO-8601 string containing the `+05:30` IST offset. Regardless of whether an evaluator is in California (PST) or London (UTC), the millisecond epoch timestamp evaluates identically worldwide.
- If the current time exceeds the deadline, `diff <= 0` triggers immediately, preventing rollover bugs or negative timer displays.

### Module 3: Accessible Modal Dialog & Focus Trap
Opening and closing modals adheres to WCAG 2.2 accessibility standards:
1. **Focus Storage:** When `openModal` is invoked, `lastActiveModalTrigger = document.activeElement;` saves which button opened the dialog.
2. **Focus Shift:** The dialog adds `role="dialog"`, `aria-modal="true"`, and immediately moves keyboard focus to the first interactive element inside the modal.
3. **Tab Focus Trap:** An event listener on `keydown` catches the `Tab` key. If the user presses Tab on the last element, focus cycles back to the first. If Shift+Tab is pressed on the first element, focus cycles back to the last. This prevents keyboard focus from escaping into the hidden background.
4. **Escape Key Dismissal:** Pressing `Escape` triggers `closeModal()`.
5. **Focus Restoration:** Upon modal close, `lastActiveModalTrigger.focus()` restores the user's cursor to where they were before the modal opened.

### Module 4: Deterministic RuleBot Assistant (`postRulebotUserMessage`)
RuleBot answers student inquiries without costly LLM API keys:
1. The student submits a query string (e.g. *"What is the AI limit?"*).
2. The query is converted to lowercase: `const lower = userText.toLowerCase();`.
3. Keyword analysis checks for terms like `'40'`, `'ai'`, `'limit'`, `'deadline'`, `'prize'`, `'stipend'`, `'drop'`.
4. The matching curated rule explanation is rendered into a chat bubble with auto-scrolling (`scrollTop = scrollHeight`).

### Module 5: Client-Side Catalog Search & Filtering
- `handleEventSearch(query)`: Reads `.event-card-title` and `.event-card-desc` of all event cards. If the query string is found, `card.style.display = 'flex'`, otherwise `'none'`.
- `filterEvents(category)`: Checks each card's `data-category="ai"` attribute against the selected pill button.

---

## 4. VIVA DEFENSE PREPARATION (Q&A FOR JUDGES)

**Q1: How does your dashboard support client-side tab navigation without a framework like React Router?**  
*Answer:* "We use a semantic single-page layout where each dashboard view is a `<section class="view-panel">`. Our `navigateTo(viewId)` function toggles the `.active` class to control visibility via CSS, updates the breadcrumb, highlights the corresponding sidebar navigation item, and writes the URL hash using `history.replaceState()`. This delivers instantaneous navigation with zero network roundtrips."

**Q2: How do you handle timezone differences in your countdown timer?**  
*Answer:* "Instead of using local machine hours, we anchor the countdown to a fixed ISO-8601 string with an explicit Indian Standard Time offset: `'2026-11-06T22:00:00+05:30'`. When passed to `getTime()`, JavaScript converts this into a universal UTC epoch timestamp in milliseconds. Subtracting `Date.now()` produces the exact real-time delta regardless of the user's local operating system timezone."

**Q3: How is keyboard accessibility handled for modal dialogs?**  
*Answer:* "We implemented WCAG-compliant focus management: when a modal opens, we store the triggering element via `document.activeElement` and shift focus into the dialog. A `keydown` listener intercepts `Tab` and `Shift+Tab` to trap focus within the focusable elements of the modal, and intercepts `Escape` to close the modal. Once closed, focus is automatically restored to the original trigger button."

**Q4: How does the application behave across mobile and desktop devices?**  
*Answer:* "We use CSS media queries anchored at a `768px` breakpoint. On desktop, the sidebar is a fixed 260px column with a corresponding left margin on the content stage. On mobile devices, the sidebar becomes an off-canvas drawer controlled by a slide transition (`transform: translateX(-100%)` to `translateX(0)`), paired with a dark backdrop overlay and a dedicated mobile top navigation bar."

**Q5: Is there any backend or live database attached to this project?**  
*Answer:* "Per the Round 1 hackathon guidelines which state that mock data is expected for frontend submissions, this prototype operates entirely client-side. Activity counters, event listings, and digital certificate verification links are implemented using realistic structured mock datasets to simulate a complete production SaaS product without requiring live server infrastructure."

---

*Keep this guide accessible during the judging session to demonstrate comprehensive technical mastery over the entire codebase.*

