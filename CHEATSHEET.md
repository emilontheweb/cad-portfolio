# Portfolio Cheatsheet

Quick reference for the two things you'll do most often.
Full details are in ADDING_PROJECTS.md if you need them.

---

## Adding a new project

**Step 1 — Export from Fusion 360**
File → Export → Format: **GLB** → save it somewhere handy

**Step 2 — Drop the file in**
Copy the `.glb` into:
```
public/models/your-model-name.glb
```
Use lowercase with hyphens, no spaces (e.g. `gear-assembly.glb`).

**Step 3 — Register it in projects.json**
Open `src/data/projects.json` and add a new entry:
```json
{
  "id":          "gear-assembly",
  "title":       "Gear Assembly",
  "description": "What it is, what it does, how you designed it.",
  "software":    ["Fusion 360"],
  "modelFile":   "gear-assembly.glb",
  "order":       1
}
```
`order` controls card position — 0 is first, increment by 1 for each new project.

**Step 4 — Push to GitHub**
```bash
git add .
git commit -m "feat: add gear assembly"
git push
```
Site updates automatically in ~60 seconds.

---

## Reordering cards

Change the `"order"` numbers in `projects.json` (lower = further left/up), then push.

---

## Updating your header (name, bio, links, photo)

Open `src/components/Header.jsx` — the editable fields are the constants at the very top of the file:
```
NAME, TITLE, BIO, EMAIL, LINKEDIN, GITHUB, PROFILE_IMG
```
Edit them, then push.

**To add a profile photo:**
1. Drop your image (JPG/PNG, square crop) into `public/` — e.g. `public/profile.jpg`
2. Change `PROFILE_IMG = null` to `PROFILE_IMG = \`${BASE}profile.jpg\``
3. Push.

---

## Preview changes locally before pushing

```bash
npm run dev
```
Opens at http://localhost:5173/ — live-reloads as you save files.

---

## Pushing any other change to the live site

Same three commands every time:
```bash
git add .
git commit -m "describe what you changed"
git push
```

---

## First-time GitHub setup (run once)

```bash
git remote add origin https://github.com/emilontheweb/cad-portfolio.git
git push -u origin main
```
Then on GitHub: Settings → Pages → Source: **GitHub Actions**
