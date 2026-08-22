# Lendez Studio — Website

A static, dependency-free website (plain HTML/CSS/JS — no build step) for **Lendez Studio**, Lyneth's independent website design studio. Built to work on GitHub Pages, Netlify, or Vercel with zero configuration.

## File structure

```
lendez-studio/
├── index.html          Home
├── work.html            Work (all projects + filter)
├── services.html        Services
├── about.html            About
├── contact.html          Contact + inquiry form
├── css/
│   ├── tokens.css        Colors, type scale, spacing — edit here to restyle the whole site
│   ├── base.css           Reset, typography, buttons, layout helpers
│   ├── nav-footer.css     Navigation + footer
│   ├── mockup-hero.css   The "browser frame" component + hero
│   └── components.css     Everything else: portfolio, services, FAQ, forms, etc.
├── js/
│   ├── portfolio-data.js Single source of truth for all portfolio projects
│   └── main.js            Nav, scroll reveal, FAQ accordion, portfolio rendering, form handling
└── images/                 Screenshots go here (see below)
```

## Updating content

**Portfolio projects** — edit `js/portfolio-data.js` only. The homepage (3 featured projects) and the Work page (all projects) both render from this one file. To add a 6th project, copy one of the existing objects, fill in the fields, and add it to the `PORTFOLIO` array — no HTML editing required.

**Text content** (services, about, FAQ, etc.) — edit directly inside the relevant `.html` file; all copy is plain text in the markup, no template engine.

**Contact info / Instagram handle** — appears in the nav, footer, About page, and Contact page. Search each `.html` file for `lynethlendez` to update everywhere at once.

**Colors and type** — everything flows from the CSS variables at the top of `css/tokens.css`. Change `--color-accent` there to re-theme every button, link, and badge on the site in one place.

## Adding real screenshots

Every project frame currently shows a labeled placeholder naming the exact file it expects, e.g.:

```
/images/quantum-chrysalis-desktop.webp
/images/kalinao-mobile.webp
```

To swap in a real screenshot:
1. Export/screenshot the live site (desktop: ~1600×1000, mobile: ~750×1600), save as `.webp` for performance.
2. Drop the file into `/images/` using the exact filename shown in the placeholder.
3. In `js/portfolio-data.js`, the `desktopImage` / `mobileImage` paths already point to these files — the placeholder will automatically be replaced by a real `<img>` once you wire it in `frameMarkup()` in `js/main.js` (swap the placeholder `<div>` for `<img src="${path}" alt="${label}">`), or ask Claude to do this pass once screenshots are ready.

The founder photo placeholder is in `index.html` and `about.html` (`.founder__photo`) — replace with `/images/lyneth-portrait.webp` the same way.

## Connecting the contact form to a real backend

Right now, submissions are handled by a placeholder function (`submitToBackend` in `js/main.js`) that simulates a network delay and always succeeds — nothing is actually sent anywhere yet.

To make it live, replace the body of `submitToBackend(formData)` with a real request, for example:

```js
function submitToBackend(formData) {
  return fetch("https://formspree.io/f/your-form-id", {
    method: "POST",
    body: formData,
    headers: { Accept: "application/json" },
  }).then((res) => {
    if (!res.ok) throw new Error("Request failed");
  });
}
```

Services like Formspree, Netlify Forms, or a small serverless function all work well here. Never put API keys or secrets directly in this file — use a form service's public endpoint, or a backend that keeps secrets server-side.

## Running locally

No build step or dependencies — just serve the folder:

```bash
cd lendez-studio
python3 -m http.server 8000
# then open http://localhost:8000
```

Or open `index.html` directly in a browser (some browsers restrict local `fetch`/module behavior when opened via `file://`, so the local server above is the more reliable option).

## Deploying

### GitHub Pages
1. Create a new GitHub repository (e.g. `lendez-studio-website`).
2. Push this folder's contents to the `main` branch.
3. In the repo settings → **Pages**, set the source to `main` / root.
4. The site will publish at `https://<username>.github.io/<repo-name>/`.

### Netlify
1. Drag and drop this folder into Netlify's dashboard, or connect the GitHub repo.
2. No build command needed — set the publish directory to the project root.

### Vercel
1. Import the GitHub repo in Vercel.
2. Framework preset: **Other** (static site) — no build command required.

### Connecting a custom domain
Once `lendezstudio.com` (or similar) is registered, all three platforms above support adding a custom domain under their project settings, with instructions for pointing your domain's DNS records at them.

## Notes for future development

- The site is intentionally framework-free for simplicity and fast load times. If it later needs a CMS, client portal, or booking integrations, the clean separation of `portfolio-data.js` and static HTML makes it straightforward to migrate to a framework (e.g. React/Vite) without redesigning anything — the design system in `css/tokens.css` can be ported directly.
- `prefers-reduced-motion` is respected throughout (scroll reveal and floating hero mockups disable automatically).
- Update the `<link rel="canonical">` and Open Graph `og:url` tags in each page's `<head>` once the real domain is live.
