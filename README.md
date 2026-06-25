# Apartment for sale — Ruda (near Wyrzysk)

A single-page real-estate listing for a 50 m² apartment in Ruda, modeled on a
listing from okolica.pl. Static site (HTML + Tailwind via CDN + vanilla JS),
ready to publish on GitHub Pages.

## Structure

```
ogloszenie_ruda/
├─ index.html               # the listing page
├─ assets/
│  ├─ styles.css            # custom styles on top of Tailwind
│  └─ app.js                # gallery, lightbox, theme toggle, contact
├─ images/                  # listing photos (photo-1.jpg, photo-2.jpg, …)
└─ .github/workflows/
   └─ deploy.yml            # GitHub Pages deployment
```

## Customize

Open `assets/app.js` and edit the config block at the top:

- `PHONE` — contact phone number (revealed when the visitor clicks the button).
- `PHOTOS` — the list of photo files shown in the gallery.

Listing text and details live directly in `index.html`.

## Local preview

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Publish on GitHub Pages

1. Create a new GitHub repository (e.g. `ogloszenie-ruda`).
2. Push this folder to the `main` branch.
3. In the repo: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Every push to `main` deploys automatically via `.github/workflows/deploy.yml`.

The published URL will be `https://<username>.github.io/<repo>/`.
