# CampusCode — Student Workspace & Dashboard
## ReBuild '26 | Round 1 Submission

A high-fidelity recreation and refined editorial interface for the **CampusCode Student Workspace** built for **ReBuild '26 Round 1**.

- **Deployment Ready:** Deployable directly via [Netlify Drop](https://app.netlify.com/drop) (Zero build steps, 100% relative paths).
- **Portal Reference:** [campuscode.co.in](https://campuscode.co.in) & Official ReBuild '26 Schedule and Rules Guide.

---

### Project Architecture & Technical Implementation

- **Zero Build Step Architecture:** 100% Vanilla HTML5, modern CSS3 (Custom Properties, Grid, Flexbox), and vanilla ES6 JavaScript. No framework runtime, no bundlers, and zero external runtime dependencies.
- **Brand System:** Authentic CampusCode palette (`#f7f7f4` canvas, `#ffffff` card surfaces, `#deded8` hairline borders, `#7665ff` primary brand, `#a8e62e` active highlight, `#111111` typography) with Google Fonts pairing (**Inter** for headings/body and **DM Mono** for metadata tags).
- **Refined Editorial UI:** Clean visual hierarchy, consistent 4px/8px spacing cadence, accessible focus states, high-contrast borders, and calm status indicators.
- **Accessible Modal & Keyboard Navigation:** Full ARIA dialog roles (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`), keyboard `Escape` dismissal, focus trapping, and focus restoration to trigger elements.
- **Fixed Deadline Countdown:** Real-time client countdown synchronized to the official Round 1 conclusion timestamp (`2026-11-06T22:00:00+05:30`), with graceful post-deadline status display.
- **RuleBot Assistant:** Deterministic rule-based assistant delivering instant answers extracted directly from the official ReBuild '26 rulebook via client-side keyword analysis.
- **Four Complete Pages:**
  1. `landing.html`: ReBuild '26 Arena landing page with bold editorial typography (`BUILD COMPETE SHIP`), ticker, and rule pillars.
  2. `login.html`: Arena portal login with split-screen hero layout and one-click demo login.
  3. `register.html`: Student registration flow with role toggling (Student / Organiser) and rules confirmation.
  4. `index.html`: Complete Student Dashboard featuring:
     - 260px fixed sidebar with active view indicators and mobile drawer support
     - Featured ReBuild '26 event status card with live IST countdown
     - 4-card statistics grid (`REGISTERED`, `ONGOING`, `COMPLETED`, `CERTIFICATES`)
     - **My Events** journey cards with status tags
     - **Events** discovery directory with category filters and search
     - **Digital Student ID Card** with simulated hardware chip and barcode
     - **RuleBot AI** assistant for competition guidelines
     - **IdeaCheck** project screening simulation
     - Verified digital challenge completion certificates

---

### Prototype & Mock-Data Scope

As specified in the official ReBuild '26 Round 1 guidelines (*"Frontend only. No backend needed. Mock data is fine"*):
- **Client-Side Simulation:** User authentication, event registration, and notification updates operate client-side without a remote database.
- **Mock Data:** Student profiles, events catalog, activity statistics, and digital certificates use realistic mock fixtures designed to showcase the complete end-user experience.
- **Deterministic Assistants:** RuleBot and IdeaCheck evaluate queries using client-side heuristic pattern matching without external API keys or third-party AI services.

---

### Repository File Structure

```
├── index.html           # Student Dashboard (Overview, My Events, Events, Digital ID, RuleBot)
├── landing.html         # Landing Page (BUILD COMPETE SHIP & Rule Pillars)
├── login.html           # Portal Login Page (Split-stage layout)
├── register.html        # Registration Flow (Student / Organiser selection)
├── style.css            # Unslapped editorial design system, typography, & layout
├── app.js               # Tab routing, IST countdown, modal focus trap & RuleBot logic
├── test.js              # Zero-dependency Node.js automated verification test suite
├── EXPLAINER.md         # Educational architectural walkthrough & judge defense guide
├── campuscode-logo.png  # Official three-slash brand asset extracted from PDF
└── README.md            # Project documentation & overview
```

---

### Automated Verification Test Suite

To run the automated verification suite:
```bash
node test.js
```
The suite verifies script syntax, IST deadline mathematics, DOM ID & selector synchronization, modal accessibility attributes, navigation links, and documentation consistency.

---

### How to Run Locally

Open any `.html` file directly in any modern browser, or serve locally with:
```bash
# Using Python
python -m http.server 3000

# Or using npx
npx serve .
```

---
*Built for CampusCode ReBuild '26 Round 1 Hackathon.*
