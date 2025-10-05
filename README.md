# Crunchyroll – Hide Dub (Chrome/Chromium Extension) 

> **Note: This extension is still a work in progress.**  
> Some features may not be fully stable, and improvements are ongoing.

Filter out dubbed videos on Crunchyroll so you only see the subbed versions.  
Lightweight, no sign-in, and works directly on crunchyroll.com result and series pages.

> Repo structure (as of now): `manifest.json`, `hidedub.js`, `popup.html`, `popup.js`, and an icon `crunchyroll_logo.png`.

---

## Features

- 🧹 **Hide dubbed episodes** on Crunchyroll pages
- ⚡ **Fast and lightweight** content script
- 🧭 **Popup toggle** to quickly enable/disable the filter
- 🧑‍💻 **No tracking, no analytics**

---

## How it works (high level)

A content script scans Crunchyroll lists (episodes/search/season listings) and hides entries that are recognized as **dubbed** (e.g., items labeled “Dub” or whose titles include dub markers). The popup provides a simple on/off switch that sets the current filtering behavior for the active tab.

---

## Install (Developer Mode)

1. **Download** or **clone** this repository.
2. Open **Chrome/Chromium** → go to `chrome://extensions/`.
3. Toggle **Developer mode** (top-right).
4. Click **Load unpacked** and select this folder.
5. Navigate to **crunchyroll.com** and try it out.

> You should see the extension’s icon (Crunchyroll logo) appear in your toolbar after loading.

---

## Usage

- Click the extension icon to open the popup.
- Use the toggle/button to **enable or disable** hiding dubbed items.
- Refresh the page if you don’t see changes immediately, or switch tabs back to a Crunchyroll page.

---

## File overview

- `manifest.json` – Chrome extension metadata and script wiring (manifest v3).
- `hidedub.js` – **Content script** that finds and hides dubbed entries in the DOM.
- `popup.html` / `popup.js` – Minimal **UI** to toggle filtering state per tab.
- `crunchyroll_logo.png` – Toolbar icon.

---

## Permissions

This extension requests only what it needs to run on **crunchyroll.com** pages (via host permissions) and to inject the content script. No external network calls, storage of personal data, or analytics are used.

---

## Development

### Prereqs
- Chrome/Chromium (or any Chromium-based browser that supports Manifest V3)

### Run locally
1. Make changes to the scripts or popup.
2. Visit `chrome://extensions/` → **Reload** the extension.
3. Hard-refresh the Crunchyroll tab to re-inject content scripts.

### Debugging tips
- Open **DevTools** on the Crunchyroll page (F12) and check **Console** for any messages from `hidedub.js`.
- Open **chrome://extensions** → click **Service Worker** link on the extension card to view background logs (if used).

---

## Roadmap / Ideas

- Optional **allow-list** (specific shows where you still want to see dubs)
- Per-site **on/off** memory using `chrome.storage`
- Smarter detection across more page types (e.g., carousels, recommendation rails)
- Small badge in the popup with **hidden count**

---

## Known limitations

- Crunchyroll may change its HTML/CSS, which can break selectors used by the content script. If something stops working, please open an issue with a page link and a short description.
- On very dynamic pages, you might need to **toggle the filter** or **refresh** after navigation for changes to apply.

---

## Contributing

PRs are welcome!  
Please keep contributions small and focused:

1. Fork → create a feature branch.
2. Make your changes (keep the script small and dependency-free).
3. Add a brief description to the PR of **what changed** and **how to test**.

---

## License

MIT — do what you want, but no warranty.

---

## Disclaimer

This project is not affiliated with or endorsed by Crunchyroll, LLC. All trademarks and copyrights are the property of their respective owners.
