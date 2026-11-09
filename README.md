![CREATOR PUBLISH KIT — Diwali 2026](./assets/diwali-banner.svg)

<p align="center"><a href="https://akhilalladi-code.github.io/diwali-universe/"><strong>🪔 Explore Diwali Universe 2026 · Interactive celebration ↗</strong></a></p>

# Creator Publish Kit

A local-first YouTube publishing workspace for the final mile before upload. Prepare metadata, validate chapters, inspect thumbnail dimensions, complete a launch checklist and export a portable publishing pack.

## Features
- Metadata editor with title/description counters and tag parsing.
- Chapter validation for MM:SS and HH:MM:SS timestamps, ordering, zero start and minimum chapter count.
- Local thumbnail inspection (dimensions, aspect ratio and file size); images are not uploaded.
- Eight-step launch checklist with progress tracking.
- Markdown and JSON exports, JSON import, browser print-to-PDF.
- Browser-local autosave. No account, backend, API key or runtime dependencies.

## Run locally
Requires Node.js 18+.
```bash
git clone https://github.com/akhilalladi-code/creator-publish-kit.git
cd creator-publish-kit
npm run dev
```
Open http://localhost:4179.

## Use
1. Complete the title, description, tags and optional audience context.
2. Add chapters one per line, e.g. `00:00 Introduction`.
3. Select a thumbnail to inspect it locally.
4. Complete the launch checklist.
5. Export Markdown/JSON or print the preview to PDF.

## Validation rules
The title is limited to 100 characters and description to 5,000. Chapters must start at 00:00, contain at least three entries, be ordered, and have at least ten seconds between adjacent timestamps. Thumbnail guidance targets 16:9 and 1280×720; this is a planning check, not a guarantee of current YouTube acceptance.

## Privacy
Draft text is stored in this browser's localStorage. Thumbnail files are decoded locally for preview and dimensions; image bytes are not uploaded or persisted. Export JSON for a portable backup. Clearing browser data may remove the local draft.

## Quality checks
`npm test` runs Node's built-in test runner. `npm run check` performs JavaScript syntax checks.

## Scope
This tool does not upload, schedule, publish, or fetch YouTube data. It is not a video editor, analytics dashboard or AI generator. See [FEATURES.md](docs/FEATURES.md) for implemented scope and proposals.

## License
MIT — see [LICENSE](LICENSE).
