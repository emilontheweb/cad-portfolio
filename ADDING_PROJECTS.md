# Adding Projects to Your Portfolio

A step-by-step guide for adding new CAD models. Should take about 2 minutes per project.

---

## Step 1 — Export from Fusion 360

1. Open your design in Fusion 360
2. Go to **File → Export**
3. Set **Format** to `GLB` (not GLTF — GLB is a single file, easier to manage)
4. Click **Export** and save it somewhere you can find it

> **Tip:** If your model has materials/appearances set up in Fusion 360, they'll carry over into the GLB. If it looks grey in the browser, go back and assign a physical material in Fusion 360 before exporting.

---

## Step 2 — Add the file

Drop the `.glb` file into:

```
public/models/your-model-name.glb
```

Use lowercase, hyphenated names — no spaces (e.g. `gear-assembly.glb`, `bracket-v2.glb`).

---

## Step 3 — Add the entry to projects.json

Open `src/data/projects.json` and add a new object to the array:

```json
{
  "id": "gear-assembly",
  "title": "Planetary Gear Assembly",
  "description": "A 3:1 reduction planetary gear set designed for a custom servo motor mount. Optimised for FDM 3D printing with 0.2 mm layer height.",
  "software": ["Fusion 360"],
  "modelFile": "gear-assembly.glb",
  "order": 1
}
```

### Field reference

| Field        | Required | Notes |
|--------------|----------|-------|
| `id`         | ✅       | Unique slug, lowercase + hyphens only |
| `title`      | ✅       | Shown on the card and in the modal |
| `description`| ✅       | Short paragraph — describe the design intent, constraints, process |
| `software`   | ✅       | Array of strings — used for filtering. E.g. `["Fusion 360"]` |
| `modelFile`  | ✅       | Filename only — must match what you put in `public/models/` |
| `order`      | ✅       | Integer — controls card position (0 = first). Just increment for each new project |

### Multiple software tools

If a project used more than one tool:

```json
"software": ["Fusion 360", "SolidWorks"]
```

---

## Step 4 — Preview locally (optional)

```bash
npm run dev
```

Open `http://localhost:5173/cad-portfolio/` and check that the card and modal look correct.

---

## Step 5 — Publish

```bash
git add public/models/your-model.glb src/data/projects.json
git commit -m "feat: add planetary gear assembly"
git push
```

GitHub Actions will build and deploy automatically. Your live site updates in about 60 seconds.
Check progress at: `https://github.com/<your-username>/cad-portfolio/actions`

---

## Reordering Cards

Change the `"order"` number in `projects.json`. Lower numbers appear first.
After editing, commit and push — no other changes needed.

## Removing a Project

Delete its entry from `projects.json`, then optionally delete the `.glb` from `public/models/`.
Commit and push.

## Adding a Profile Picture

1. Drop your photo (JPG or PNG, square crop recommended) into `public/` — e.g. `public/profile.jpg`
2. In `src/components/Header.jsx`, change:
   ```js
   const PROFILE_IMG = null
   ```
   to:
   ```js
   const PROFILE_IMG = `${BASE}profile.jpg`
   ```
3. Commit and push.
