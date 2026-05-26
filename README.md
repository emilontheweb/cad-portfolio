# CAD Portfolio

An interactive 3D portfolio for showcasing mechanical design work — built with **React**, **Three.js**, and **Vite**, auto-deployed to GitHub Pages.

🔗 **Live site:** `https://<your-username>.github.io/cad-portfolio/`

---

## Features

- **Interactive 3D viewer** — drag to rotate, scroll to zoom, right-click to pan
- **Auto-rotating card thumbnails** — each card previews the model live
- **Filter bar** — filter by software tool (Fusion 360, SolidWorks, etc.)
- **Search** — find projects by title, description, or tool
- **Click-to-expand modal** — full-size 3D explorer with project details
- **Dark technical theme** — designed to look great in an engineering context
- **Auto-deploys** — push to `main` → site updates in ~60 seconds

---

## Tech Stack

| Layer      | Tool                              |
|------------|-----------------------------------|
| Framework  | React 19 + Vite                   |
| 3D Engine  | Three.js via `@react-three/fiber` |
| 3D Helpers | `@react-three/drei`               |
| Styling    | Tailwind CSS v4                   |
| Icons      | Lucide React                      |
| CI/CD      | GitHub Actions → GitHub Pages     |

---

## Adding a New Project

See **[ADDING_PROJECTS.md](ADDING_PROJECTS.md)** for the full guide.

**Quick version:**
1. Export from Fusion 360 as **GLB** (`File → Export → Format: GLB`)
2. Drop the `.glb` into `public/models/`
3. Add one entry to `src/data/projects.json`
4. `git add . && git commit -m "feat: add <project-name>" && git push`

---

## Local Development

```bash
npm install
npm run dev     # http://localhost:5173/cad-portfolio/
```

## Personalising the Header

Edit the constants at the top of `src/components/Header.jsx`:

```js
const NAME        = 'Your Name'
const TITLE       = 'Mechanical Design Engineer'
const BIO         = 'Your bio here...'
const EMAIL       = 'you@example.com'
const LINKEDIN    = 'https://linkedin.com/in/yourhandle'
const GITHUB      = 'https://github.com/yourusername'
const PROFILE_IMG = null   // set to `${BASE}profile.jpg` after adding your photo to public/
```
