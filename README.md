# ZAVYX Infotech — Website

A static, responsive 4-section website (Home, About, Services with 9 service landing pages, Contact) built with plain HTML, CSS, and JavaScript — no framework, no build step.

## What's inside
```
zavyx-website/
├── index.html              → Home
├── about.html               → About Us
├── services.html            → Services overview
├── contact.html              → Contact (form, map, chatbot, FAQ)
├── services/                 → 9 individual service landing pages
│   ├── websites-web-apps.html
│   ├── ecommerce-stores.html
│   ├── crm-erp-systems.html
│   ├── whatsapp-api-bots.html
│   ├── ai-automation.html
│   ├── mobile-apps.html
│   ├── digital-marketing-seo.html
│   ├── branding-creative.html
│   └── cloud-infrastructure.html
└── assets/
    ├── css/style.css         → all styling (design system + components)
    ├── js/main.js             → nav menu, floating buttons, chatbot, FAQ accordion, scroll reveal
    └── img/logo.png            → placeholder logo (replace with your real logo — same filename)
```

## How to run it in VS Code

1. **Unzip** this folder and open it in VS Code: `File → Open Folder…` → select `zavyx-website`.
2. **Install the "Live Server" extension** (by Ritwick Dey) from the Extensions panel (`Ctrl+Shift+X` / `Cmd+Shift+X`) if you don't already have it — search "Live Server".
3. **Right-click `index.html`** in the file explorer → **"Open with Live Server"**.
   - Your browser opens automatically at something like `http://127.0.0.1:5500/index.html`.
   - Any file you edit reloads the browser automatically.
4. To view other pages, just click through the site navigation, or open `about.html`, `services.html`, `contact.html`, or any file in `services/` the same way.

**No Node.js, npm, or build step is required** — it's plain HTML/CSS/JS, so it also works if you just double-click `index.html` to open it directly in a browser (Live Server is only recommended for the best experience and auto-reload while editing).

## Replacing the placeholder logo
Drop your real logo file into `assets/img/` and name it `logo.png` (or update the `<img src="...logo.png">` references across the HTML files to your new filename). It's used in the navbar, footer, and browser favicon.

## Wiring up the contact form
The contact form (`contact.html`) is currently front-end only — it shows a "Message sent" confirmation but doesn't send anywhere. To make it functional, either:
- Use a form backend like **Formspree** or **EmailJS** (add their script + change the form `action`), or
- Point it at your own backend endpoint.

## Editing content
- **Colors, fonts, spacing:** `assets/css/style.css` (CSS variables at the top under `:root`).
- **Chatbot auto-replies:** `assets/js/main.js` → the `KB` array near the top — add more `{ match: [...], reply: "..." }` entries for more questions.
- **Service page content** (features, process, tech, FAQ per service): edit directly in each file under `services/`, or regenerate from `generate.py` if you received it (adjust the `SERVICES` list and rerun `python3 generate.py`).

## Notes
- Fonts (Space Grotesk, Inter, JetBrains Mono) load from Google Fonts via CDN — an internet connection is needed for them to display correctly; otherwise the browser falls back to system fonts.
- The Google Map embed on the Contact page uses the address you provided — no API key required for the basic embed.
- Floating WhatsApp / Email / Chatbot buttons and the chatbot itself appear identically on all pages via shared markup.
