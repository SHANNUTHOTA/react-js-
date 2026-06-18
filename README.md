# PopX Onboarding React Application

A mobile-first, responsive, and feature-rich onboarding application built using **React JS** and **Vanilla CSS**. This project replicates the design specification from the provided Adobe XD prototype, enhancing it with rich animations, dark/light theme switching, dynamic validations, and session persistence.

## 🚀 Live Demo & Repository
- **Live Interactive Demo:** [https://shannuthota.github.io/react-js-/](https://shannuthota.github.io/react-js-/)
- **GitHub Repository:** [https://github.com/SHANNUTHOTA/react-js-](https://github.com/SHANNUTHOTA/react-js-)

---

## ✨ Key Features

1. **State Machine Screen Transitions**: Features smooth sliding animations and scale transitions as the user navigates between the Welcome, Login, Signup, and Profile dashboards.
2. **Interactive Light & Dark Modes**: Accessible via a sleek SVG theme toggle in the top-right corner of the mobile frame, adjusting colors from a clean violet/slate palette to a deep midnight space theme.
3. **Dynamic Floating Labels**: Implements elegant border-crossing label animations that slide upwards and scale down when input fields gain focus or contain text.
4. **Interactive Profile Editing**: Extends mockup requirements with inline edits, allowing users to modify details (name, phone, company, agency, and bio) and save updates directly to the active session.
5. **Profile Avatar Image Uploader**: Fully functional photo selector that converts image files to Base64 strings using a `FileReader` and persists them across page reloads.
6. **Session & Database Persistence**: Uses `localStorage` to validate sign-ins against a mock user registry, seeding the dashboard automatically with `Marry@Gmail.Com` / `password123` on startup.

---

## 🛠️ Technology Stack
- **Core Framework**: React 19 (Hooks, Context, Refs)
- **Scaffolding/Build Tool**: Vite 8
- **Styling**: Pure CSS (Vanilla CSS variables, responsive layout frame scaling to full-screen on mobile devices under `500px`)
- **State Management**: React state synced with `localStorage`

---

## 📂 Project Structure
```text
popx-react/
├── public/                 # Static assets (SVGs, icons)
├── src/
│   ├── assets/             # Brand logos & graphics
│   ├── App.css             # Component-level layout & floating label styles
│   ├── App.jsx             # Main router state machine & form layouts
│   ├── index.css           # Global design tokens, resets & device frame
│   └── main.jsx            # Application entrypoint
├── index.html              # HTML shell
├── package.json            # Scripts & dependencies
└── vite.config.js          # Vite config & base path mapping
```

---

## ⚙️ Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SHANNUTHOTA/react-js-.git
   cd react-js-
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Production Build & Deploy

To generate a static build:
```bash
npm run build
```

To deploy the production build to GitHub Pages:
```bash
cd dist
git init
git checkout -b gh-pages
git add -A
git commit -m "Deploy to GitHub Pages"
git remote add origin https://github.com/SHANNUTHOTA/react-js-.git
git push -f origin gh-pages
```
