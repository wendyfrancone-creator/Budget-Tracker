# Budget Tracker

A Next.js finance dashboard for tracking income, expenses, and categories with live charts and export-ready static hosting.

## Features

- Dashboard summary with balance, income, expenses, and category count
- Interactive charts showing monthly income vs expense and category breakdown
- Transaction management with add/edit/delete flows
- Category management
- Static deployment configured for GitHub Pages

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to preview the app.

## Build

```bash
npm run build
```

## Deploy to GitHub Pages

```bash
npm run deploy
```

The app is published at:

https://wendyfrancone-creator.github.io/Budget-Tracker/

## Notes

- The project uses `next export` behavior through `output: "export"` in `next.config.mjs`
- Deployment uses `gh-pages` to publish the `out/` directory
