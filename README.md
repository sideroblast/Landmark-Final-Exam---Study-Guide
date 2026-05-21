# Landmark Final Exam Study Guide

An interactive study guide for the forensic psychiatry landmark-cases final exam:
oral-exam simulator, case library, constitutional law, the insanity defense,
basic-law concepts, legal terms, flashcards, an MCQ quiz, a progress tracker,
and a live exam countdown.

---

## Put this on GitHub and share it (no coding experience required)

The study guide is a small website. To share it with others you (1) put the
files in a GitHub repository and (2) turn on **GitHub Pages**, which gives you a
public link like `https://yourname.github.io/landmark-study-guide/` that anyone
can open in a browser.

You can do the whole thing in your web browser — you do **not** need to install
anything.

### Step 1 — Make a GitHub account
Go to <https://github.com> and sign up (free). Verify your email.

### Step 2 — Create a new repository
1. Click the **+** in the top-right corner → **New repository**.
2. **Repository name:** `landmark-study-guide` (any name is fine).
3. Set it to **Public** (required for free GitHub Pages).
4. Check **Add a README file**.
5. Click **Create repository**.

### Step 3 — Upload these files
1. On your new repository page, click **Add file** → **Upload files**.
2. Drag in **all** the files from this folder:
   - `index.html`
   - `App.jsx`
   - `package.json`
   - `vite.config.js`
   - `.github/` (the whole folder — it contains the auto-publish workflow)
   - `README.md` (this file)
   - `.gitignore`
3. Scroll down and click **Commit changes**.

> Tip: the easiest way is to keep the folder structure intact. If GitHub's web
> uploader won't let you drag a folder, see "Uploading the `.github` folder"
> at the bottom.

### Step 4 — Turn on GitHub Pages (one-time)
1. In the repository, click **Settings** (top menu).
2. In the left sidebar click **Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.

That's it. The included workflow (`.github/workflows/deploy.yml`) automatically
builds the site every time you change a file and publishes it.

### Step 5 — Get your link
1. Click the **Actions** tab. Wait for the run named *Deploy* to finish (green check, ~1–2 min).
2. Go back to **Settings → Pages**. Your public URL appears at the top:
   `https://<your-username>.github.io/landmark-study-guide/`
3. Share that link with anyone. It works on phones and laptops.

### Updating it later
Edit `App.jsx` (or any file) right in GitHub's web editor (pencil icon),
commit the change, and the site rebuilds and republishes itself in a couple of
minutes. No other steps.

---

## Running it on your own computer (optional)

If you'd rather preview locally first, install [Node.js](https://nodejs.org)
(the "LTS" version), then in this folder run:

```bash
npm install
npm run dev
```

Open the link it prints (usually <http://localhost:5173>). To make the final
shareable files yourself: `npm run build` (output lands in a `dist/` folder).

---

## What each file does
- **App.jsx** — the entire study guide (all the content and tabs).
- **index.html** — the page that loads the app.
- **package.json** — lists the tools needed to build the site.
- **vite.config.js** — build settings.
- **.github/workflows/deploy.yml** — the robot that builds + publishes on every change.
- **.gitignore** — tells Git to skip temporary build files.

## Note on the source PDFs
Dr. Resnick's case summaries and the Abell study guide are **not** included in
this repo (they're personal/copyrighted study materials). The study guide works
fully on its own. If you want them available to people you share with, host them
separately and add your own links.

---

## Uploading the `.github` folder
GitHub's drag-and-drop sometimes ignores folders that start with a dot. If
`.github/workflows/deploy.yml` didn't upload:
1. In your repo click **Add file → Create new file**.
2. In the filename box type exactly: `.github/workflows/deploy.yml`
   (typing the slashes creates the folders automatically).
3. Paste the contents of `deploy.yml` from this folder, then **Commit changes**.
