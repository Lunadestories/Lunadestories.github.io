# LunaVerse

**Learn Languages · Read Stories · Explore Life**

LunaVerse is a static, dependency-free education platform for learning English, Chinese, and German — built with plain HTML5, CSS3, and vanilla JavaScript so it runs directly on GitHub Pages with no build step, no bundler, and no framework.

Live site: **https://lunadestories.github.io**

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Tech Stack](#tech-stack)
3. [Running Locally](#running-locally)
4. [Deployment (GitHub Pages)](#deployment-github-pages)
5. [Adding Lessons](#adding-lessons)
6. [Adding Stories](#adding-stories)
7. [Adding Blog Posts](#adding-blog-posts)
8. [How the Mini Games Work](#how-the-mini-games-work)
9. [Theming & Customization](#theming--customization)
10. [Accessibility & Performance Notes](#accessibility--performance-notes)
11. [Browser Support](#browser-support)

---

## Project Structure

```
/
├── index.html              Homepage — hero, feature cards, quote of the day, latest lessons/stories
├── about.html               About page
├── contact.html              Contact page (client-side demo form)
├── 404.html                  Custom not-found page
├── README.md                 This file
├── robots.txt                 Search engine crawl rules
├── sitemap.xml                 XML sitemap for search engines
├── manifest.json               Web app manifest (installable/PWA metadata)
├── favicon.svg / favicon.ico    Site icon (SVG primary, ICO fallback)
│
├── assets/
│   ├── css/
│   │   ├── variables.css      Design tokens: color, type, spacing, radius, motion (light + dark theme)
│   │   ├── style.css           Base reset, typography, buttons, cards, forms, badges
│   │   ├── layout.css           Header, footer, hero, grids, page-specific layout patterns
│   │   ├── animations.css        Keyframes, scroll-reveal, theme-toggle transitions
│   │   └── responsive.css         Breakpoints for tablet, mobile, and small phones
│   ├── js/
│   │   ├── app.js               Shared utilities: data fetching/caching, quote of the day, latest lists, toasts
│   │   ├── theme.js               Light/dark mode toggle with localStorage persistence
│   │   ├── navigation.js           Mobile nav, sticky header state, active-link highlighting
│   │   ├── search.js               Global ⌘K / Ctrl+K search across lessons, stories, and blog posts
│   │   ├── lessons.js               Renders level tabs, lesson lists, and lesson detail views
│   │   ├── stories.js               Story grid, filters, bookmarks, and the reader view
│   │   ├── blog.js                  Blog grid, category filters, and the single-post view
│   │   └── games.js                  All five mini games
│   └── images/
│       ├── logo/                     (reserved for future brand assets)
│       ├── backgrounds/                Includes the Open Graph / Twitter share image
│       └── icons/                      (reserved for future iconography)
│
├── data/
│   ├── english.json     Lessons: Grammar, Vocabulary, Listening, Reading, Idioms
│   ├── chinese.json      Lessons: HSK 1–6, with hanzi + pinyin + meaning
│   ├── german.json        Lessons: A1, A2, B1
│   ├── stories.json        All short stories (any language/level)
│   ├── blog.json            All blog posts ("Luna's Journey")
│   └── quotes.json           Quote-of-the-day pool
│
└── pages/
    ├── english.html    Language track pages — render lessons from /data via lessons.js
    ├── chinese.html
    ├── german.html
    ├── stories.html      Story grid + reader, powered by stories.js
    ├── blog.html           Blog grid + post view, powered by blog.js
    └── games.html            Five mini games, powered by games.js
```

> **Note on `/home/claude`-style build scripts:** the site itself is 100% static output. During development, two small Python helper scripts (`build.py` and `build_*.py`, not included in this deployment) were used to assemble the header/footer/search-overlay markup consistently across every page. They are a one-time authoring convenience, not a runtime dependency — every `.html` file in this repository is plain, self-contained markup that renders with zero build step.

---

## Tech Stack

- **HTML5** — semantic elements, Open Graph + Twitter Card meta tags, JSON-LD structured data on the homepage
- **CSS3** — custom properties (design tokens), CSS Grid/Flexbox, `color-mix()`, no preprocessor
- **Vanilla JavaScript (ES5-leaning, no build step)** — `fetch()` for JSON data, `IntersectionObserver` for scroll reveals, `localStorage` for theme/bookmarks
- **No frameworks**: no React, Vue, Bootstrap, jQuery, or Tailwind CDN
- **Fonts**: Fraunces (display), Inter (body), JetBrains Mono (data/code), loaded from Google Fonts with `preconnect`

---

## Running Locally

No build step is required. From the project root:

```bash
# Option 1 — Python
python3 -m http.server 8000

# Option 2 — Node
npx serve .
```

Then open `http://localhost:8000`. A local server is required (rather than opening `index.html` directly) because the site loads JSON data via `fetch()`, which most browsers block on the `file://` protocol.

---

## Deployment (GitHub Pages)

1. Push this repository to GitHub, e.g. `lunadestories/lunadestories.github.io` (a **user/organization site** repo, which GitHub Pages serves from the root of the `main` branch automatically).
2. In the repository settings, under **Pages**, set the source to the `main` branch, root folder (`/`).
3. Wait for the deployment to finish — GitHub will publish to `https://lunadestories.github.io`.
4. No further configuration is needed: there is no build step, no environment variables, and no server-side code.

If you deploy this as a **project site** instead (e.g. `username.github.io/lunaverse`), update every absolute URL in `robots.txt`, `sitemap.xml`, `manifest.json`, and the `<meta property="og:*">` / `<link rel="canonical">` tags in each page's `<head>` to include the `/lunaverse/` path prefix.

---

## Adding Lessons

Lessons live in `/data/english.json`, `/data/chinese.json`, and `/data/german.json`. Each file follows the same shape:

```json
{
  "language": "English",
  "slug": "english",
  "description": "...",
  "levels": [
    {
      "code": "Grammar",
      "title": "Grammar",
      "description": "...",
      "lessons": [
        {
          "id": "g4",
          "title": "Your Lesson Title",
          "type": "grammar",
          "summary": "One-sentence summary shown in the lesson list.",
          "content": ["Paragraph one.", "Paragraph two."],
          "vocabulary": [
            { "term": "example", "translation": "meaning", "notes": "optional usage note" }
          ]
        }
      ]
    }
  ]
}
```

- `id` must be unique **within its language file** — it's used in shareable URLs like `english.html?level=Grammar&lesson=g4`.
- For Chinese vocabulary, add a `"pinyin"` field to each vocabulary entry — the lesson table and games automatically pick it up.
- To add a brand-new level (e.g. a German "B2" tier), append a new object to the `levels` array with a unique `code`. The level tab bar and games' vocabulary pool both update automatically — no HTML or JS changes required.
- Every lesson's `vocabulary` array automatically feeds into all five mini games on `/pages/games.html`, so richer vocabulary lists make the games richer too.

---

## Adding Stories

Stories live in `/data/stories.json` as a flat array:

```json
{
  "slug": "your-story-slug",
  "title": "Your Story Title",
  "language": "English",
  "level": "B1",
  "category": "Folktale",
  "author": "Luna",
  "excerpt": "One or two sentences shown on the story card.",
  "wordCount": 500,
  "body": ["Paragraph one.", "Paragraph two.", "..."]
}
```

- `slug` must be unique — it powers the reader URL `stories.html?story=your-story-slug`.
- `wordCount` drives the "X min read" estimate (200 words/minute); keep it roughly accurate.
- `category` should match one of the filter chips in `pages/stories.html` (`Folktale`, `Reflection`, `Daily Life`, `Short Story`, `Fable`) — or add a new `<button class="chip" data-story-filter="YourCategory">` to that file if you introduce a new category.

---

## Adding Blog Posts

Blog posts live in `/data/blog.json`, following the same pattern as stories:

```json
{
  "slug": "your-post-slug",
  "title": "Your Post Title",
  "category": "Journey",
  "date": "2026-05-01",
  "tags": ["tag-one", "tag-two"],
  "excerpt": "Shown on the blog card.",
  "wordCount": 450,
  "body": ["Paragraph one.", "Paragraph two."]
}
```

As with stories, keep `category` aligned with the filter chips in `pages/blog.html`, or add a new chip there.

---

## How the Mini Games Work

All five games in `assets/js/games.js` (Flashcards, Memory Cards, Typing Game, Word Match, Random Quiz) pull their vocabulary **live** from the same `english.json` / `chinese.json` / `german.json` files used by the lesson pages — there is no separate game-content file to maintain. Switching the language dropdown on any game re-fetches (from cache) and re-samples that language's full vocabulary pool.

---

## Theming & Customization

- **Colors, type, spacing, radii, motion** are all defined once in `assets/css/variables.css` as CSS custom properties, split into a theme-independent brand palette and separate `:root` / `[data-theme="dark"]` blocks. Change a token there and it propagates everywhere.
- **Dark mode** is controlled by `assets/js/theme.js`, which sets `data-theme="light"|"dark"` on `<html>`, persists the choice in `localStorage` under `luna-theme`, and falls back to the OS-level `prefers-color-scheme` on first visit.
- **Typography** uses Fraunces for headings/display text and Inter for body copy — swap the `@import`/`<link>` in each page's `<head>` and the `--font-display` / `--font-body` variables to change fonts sitewide.

---

## Accessibility & Performance Notes

- Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`), a skip-to-content link, and visible `:focus-visible` outlines are present on every page.
- All interactive widgets (theme toggle, search overlay, mobile nav, games) are keyboard-operable and expose `aria-*` state.
- `prefers-reduced-motion` disables scroll-reveal and decorative animation.
- Images and non-critical CSS/JS are kept minimal by design — the entire site (excluding fonts) is a few hundred KB, and JSON data is fetched once and cached in memory per page load.
- Fonts are loaded with `rel="preconnect"` to reduce connection latency.

---

## Browser Support

Built on evergreen web standards (`fetch`, CSS custom properties, `IntersectionObserver`, `color-mix()`). Fully supported in current versions of Chrome, Edge, Firefox, and Safari. `color-mix()` gracefully degrades to a solid fallback color in the rare older browser that lacks support, since it's only used for a translucent header background.

---

Built with curiosity, one lesson at a time. 🌙
