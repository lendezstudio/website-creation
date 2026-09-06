# Lendez Studio, Website

A static, dependency-free website (plain HTML, CSS and JS, no build step) for **Lendez Studio**, Lyneth Lendez's independent studio for website design and social media management. Runs on GitHub Pages, Netlify or Vercel with zero configuration.

## File structure

```
website-creation/
├── index.html          Home
├── work.html           Work (all projects)
├── services.html       Services and process
├── about.html          About and founder story
├── contact.html        Contact and inquiry form
├── css/
│   └── site.css        The whole design system. Edit the :root tokens to restyle everything.
├── js/
│   └── main.js         Sticky header, mobile menu, scroll reveal, contact-form handling
└── images/             Project photos and the founder portrait
```

The business briefing PDF that drives the positioning and copy is kept out of the repo on purpose (git-ignored), since this project deploys to a public host.

Every page is standalone. The header, mobile menu, footer and WhatsApp button are copied into each `.html` file (no template engine). If you change one, change it in all five.

## Writing style rule

**No em dashes anywhere on the site, no exceptions.** This applies to every page and any copy added later. Use periods, commas or colons to break up sentences instead.

## Updating content

**Portfolio projects** live directly in `work.html` (all nine) and `index.html` (the three featured on the home page). Each project is one `.work-item` (Work page) or `.project-row` (Home) block. To change a project, edit its block: the image path, the URL, the description and the three feature lines. Public copy describes what each site does, and never uses the words "demo", "concept" or "client".

**Text content** (services, about, process, FAQ) is plain text inside the relevant `.html` file.

**Contact info and social handles** appear in the header area, footer and contact page. Search each `.html` file for `lendezstudio@gmail.com`, `639050961412` or `lynethlendez` to update everywhere.

**Colours and type** all flow from the CSS custom properties in the `:root` block at the top of `css/site.css`.

## Images

Project images and the portrait are real files in `images/`, referenced with relative paths like `images/black-blocks.jpg`. Filenames are lowercase and hyphenated because GitHub Pages is case-sensitive. When replacing one, keep the same filename or update the `<img src>` in the page that uses it, and keep the `width`/`height` attributes roughly matching the file so layout does not shift.

Current set:

| File | Used for |
| --- | --- |
| `black-blocks.jpg` | Black Blocks Development Corporation |
| `w-divers-coron.jpg` | W Divers Coron |
| `molly.jpg` | Molly Resort Bohol |
| `kalinao.jpg` | Kalinao Beach Hotel, Resort and Farm |
| `jd-beach-front-hotel.jpg` | JD's Beach Front Hotel |
| `dakdak.jpg` | Dakdak Beach Resort |
| `southern-leyte-divers.jpg` | Southern Leyte Divers |
| `the-view.jpg` | The View |
| `bohol-island-homestay.jpg` | Bohol Island Homestay |
| `lyneth-profile.jpg` | Founder portrait on the About page |

## Contact form

Submitting the form on `contact.html` opens the visitor's email app with all fields filled in, addressed to `lendezstudio@gmail.com`. Nothing is sent to a server. To use a form service instead, replace the submit handler in `js/main.js` with a `fetch()` to your endpoint, for example:

```js
function submitToBackend(formData) {
  return fetch("https://formspree.io/f/your-form-id", {
    method: "POST",
    body: formData,
    headers: { Accept: "application/json" },
  }).then((res) => { if (!res.ok) throw new Error("Request failed"); });
}
```

Never put API keys or secrets in these files. Use a form service's public endpoint or a backend that keeps secrets server-side.

## Running locally

No build step. Serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening the files directly with `file://` mostly works, but a local server is more reliable.

## Deploying

**GitHub Pages:** push to `main`, then in Settings, Pages, set the source to `main` and root. Publishes at `https://<username>.github.io/<repo-name>/`.

**Netlify or Vercel:** connect the repo, no build command, publish directory is the project root.

**Custom domain:** once `lendezstudio.com` is registered, add it under the host's domain settings and point DNS as instructed. Then update the `<link rel="canonical">` and `og:url` tags in each page's `<head>` if they are not already correct.

## Notes

- `prefers-reduced-motion` is respected: scroll reveal, background drift and floating hero cards all disable automatically.
- The site is intentionally framework-free for fast loads and simple hosting.
