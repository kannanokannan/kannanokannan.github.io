# Changelog

## 2026-08-31

- Added the five standards constraint statements to `consulting.html`, matching `index.html` and `ai-governance.html`.
- Pointed the consulting page at `ContextBoundary/consulting/README.md` as the canonical source for those statements.
- Fixed literal backticks around `contextboundary-gw` in the claim-limits panel.
- Added Content Signals to `robots.txt`: `ai-train=yes, search=yes, ai-input=yes`. All three granted, nothing reserved.
- Kept `robots.txt` in the repository rather than enabling Cloudflare-managed robots.txt, so the file stays under version control.

## 2026-08-30

- Published `consulting.html` as the public ContextBoundary consulting enablement entry point.
- Linked consulting from homepage resources, primary navigation, footer, `llms.txt`, and `sitemap.xml`.
- Published the ContextBoundary consulting package to `ContextBoundary/main` before linking to it from the website.
