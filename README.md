# Nikhil NEXUS V5 Portfolio

A completely redesigned, photo-free React + Vite portfolio with advanced animations and a built-in Project Studio.

## Run locally

```powershell
cd nikhil-nexus-v5-portfolio
npm install
npm run dev
```

## Permanent project addition

1. Add the screenshot to:

```text
public/projects/
```

2. Open:

```text
src/data/projects.js
```

3. Add a project object to `defaultProjects`.

## Project Studio

Click **Add project** or press `Ctrl + K`.

- Add a project instantly to the current browser.
- Data persists through browser `localStorage`.
- Copy the generated JSON object for a permanent source-code addition.
- Browser-local projects do not automatically sync across devices or Vercel visitors.

## Production build

```powershell
npm run build
```

## Vercel settings

- Framework: Vite
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: `dist`


## Part 1 upgrade

This edition adds:

- Recruiter-focused professional summary
- Dedicated Software Developer, Full Stack Developer and AI/ML Developer profiles
- Highly visible technology matrix
- No artificial skill percentages
- Animated developer journey timeline
- Responsive mobile layouts for all new sections


## Part 2 sections

- Animated hero
- About profile
- Separate summaries for Software Developer, Full Stack Developer and AI/ML Developer
- Visible technology matrix without percentage ratings
- Developer journey timeline
- Recruiter highlights
- Dynamic portfolio statistics


## Part 3 final polish
- Premium initialization loader
- Enhanced contact CTA and copy-email action
- Availability banner
- Premium multi-column footer
- SEO and Open Graph metadata
- robots.txt, sitemap.xml and web manifest
- Keyboard focus and skip-navigation support
- Reduced-motion compatibility
