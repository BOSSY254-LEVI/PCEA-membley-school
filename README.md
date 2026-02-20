# PCEA Membley School Website

Static multi-page school website built with HTML, CSS, and vanilla JavaScript.

## Project Structure

```text
PCEA-membley-school2/
|-- frontend/
|   |-- index.html
|   |-- about.html
|   |-- academics.html
|   |-- admissions.html
|   |-- student-life.html
|   |-- contact.html
|   |-- assets/
|   |   |-- css/main.css
|   |   `-- js/
|   |-- media/
|   |-- downloads/
|   `-- PCEASCH-IMAGES/
|-- scripts/
|   |-- build.js
|   `-- generate-pdfs.js
|-- optimize-images.js
|-- package.json
|-- vercel.json
`-- dist/  (generated build output)
```

## Local Development

```bash
npm install
npm run build
```

Build output is written to `dist/`.

## Utility Scripts

- `npm run optimize:images` - optimize referenced source images.
- `npm run optimize:images:all` - optimize all source images.
- `npm run optimize:images:prune` - optimize and remove unused source images.
- `npm run generate:pdfs` - regenerate PDF documents in `frontend/downloads/`.
- `npm run build` - minify frontend pages/assets and copy static files to `dist/`.
- `npm run build:all` - run image optimization, PDF generation, then full build.

## Deployment (Vercel)

This repository is configured for Vercel using `vercel.json`:

- Build command: `npm run build`
- Output directory: `dist`

No manual `public` directory is required.
