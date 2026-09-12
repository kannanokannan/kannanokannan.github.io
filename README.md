# kannanokannan.github.io

Static source for **[context-stack.org](https://context-stack.org/)**, the public front door for the Context Stack projects.

Published with GitHub Pages from `main`. No build step: the files in this repository are the files served.

## What is here

| Path | Serves |
|---|---|
| `index.html` | Landing page and guided assessment |
| `ai-governance.html` | AI governance concepts reference |
| `ai-governance-framework.html` | Framework guide, including AARM standards alignment |
| `repositories.html` | Repository map |
| `consulting.html` | ContextBoundary consulting enablement entry point |
| `use-case-ams-ticket-agent.html` | Public AMS ticket agent use case |
| `maintainer.html` | Who maintains the project, and the delivery background behind it |
| `mcp/` | MCP access page |
| `llms.txt` | Machine-readable discovery file |
| `sitemap.xml`, `robots.txt` | Crawler directives |
| `assets/` | Stylesheet and assessment script |

## Constraints

These statements are load-bearing and appear identically in `llms.txt`, in the page prose, and in the pages' structured data:

- AARM is a Cloud Security Alliance standard, not a Context Stack standard.
- Context Stack is AARM-aligned. No conformance claim is made.
- Not listed on the CSA Builder Registry.
- No independent conformance review has been undertaken.
- Griha is a reference implementation, not a product.

Changes to any of the three surfaces must keep all five wordings byte-identical.

## The projects this site describes

[ContextOps](https://github.com/kannanokannan/ContextOps) · [ContextBoundary](https://github.com/kannanokannan/ContextBoundary) · [contextboundary-gw](https://github.com/kannanokannan/contextboundary-gw) · [Sthala](https://github.com/kannanokannan/Sthala) · [Griha](https://github.com/kannanokannan/Griha) · [context-stack](https://github.com/kannanokannan/context-stack) · [context-stack-mcp](https://github.com/kannanokannan/context-stack-mcp)

## Changelog

- 2026-08-30 — published `consulting.html` as the public ContextBoundary consulting enablement entry point; linked it from homepage resources, primary navigation, footer, `llms.txt`, and `sitemap.xml`.

## Licence

Apache-2.0. See `LICENSE`.
