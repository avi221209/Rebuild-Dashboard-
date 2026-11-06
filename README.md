# CampusCode — Dimensional Student Dashboard
## ReBuild '26 | Round 1 Submission

A high-fidelity recreation and dimensional light UI for the **CampusCode Student Workspace** built for **ReBuild '26 Round 1**.

Live Demo: Deployable via [Netlify Drop](https://app.netlify.com/drop)  
Portal Reference: [campuscode.co.in](https://campuscode.co.in)

---

### Project Architecture & Features

- **No Framework / Zero Build Step**: 100% Vanilla HTML5, CSS3, and modern JavaScript.
- **Brand Identity**: Authentic CampusCode colors (`#f7f7f4`, `#ffffff`, `#deded8`, `#7665ff`, `#a8e62e`, `#111111`) and typography (**Inter** & **DM Mono**).
- **Subtle 3D Interactions**: CSS perspective and cursor-responsive 3D tilt with layered surfaces, ambient lighting, and floating badges.
- **4 Complete Pages**:
  1. `landing.html`: ReBuild '26 Arena landing page with bold editorial typography (`BUILD COMPETE SHIP.`), ticker, and rule pillars.
  2. `login.html`: Arena portal login with split-screen hero (`ENTER THE ARENA.`) and one-click demo access.
  3. `register.html`: Student registration flow (`JOIN THE ARENA.`) with role selection and rules confirmation.
  4. `index.html`: Complete Student Dashboard featuring:
     - 260px fixed sidebar with authentic lime active highlight
     - Dimensional ReBuild '26 hero event card
     - 4 CSS grid statistic cards (`REGISTERED`, `ONGOING`, `COMPLETED`, `CERTIFICATES`)
     - **My Events** journey cards with status tags
     - **Events** discovery directory with category filters
     - Interactive **Digital Student ID Card** with hardware chip and barcode
     - **RuleBot AI** assistant answering questions from the official rulebook
     - Cryptographically verifiable certificates with verification stamp

---

### File Structure

```
├── index.html           # Student Dashboard (Overview, My Events, Events, Digital ID, RuleBot)
├── landing.html         # Landing Page (BUILD COMPETE SHIP)
├── login.html           # Login Page (ENTER THE ARENA)
├── register.html        # Register Page (JOIN THE ARENA)
├── style.css            # Cohesive design system & 3D CSS perspective styles
├── app.js               # Tab routing, 3D tilt physics, countdown timer, RuleBot AI logic
├── campuscode-logo.png  # Official three-slash brand asset
└── README.md            # Project documentation & overview
```

---

### How to Run Locally

Open any `.html` file in any modern browser directly, or serve with:
```bash
npx serve .
# or
python -m http.server 3000
```

---
*Built for ReBuild '26 Round 1 Hackathon.*

