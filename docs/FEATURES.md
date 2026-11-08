# Feature scope

## Implemented in the MVP
- Metadata editor, counters and required-field/length validation.
- Tag counting and optional topic guidance.
- Chapter parser for MM:SS and HH:MM:SS with ordering, zero-start, minimum-count and spacing checks.
- Local thumbnail preview, dimensions, aspect ratio and file-size display.
- Eight-item editable launch checklist with progress.
- Browser-local draft persistence.
- Markdown and JSON exports, JSON import and print-to-PDF.
- Responsive layout and dependency-free Node test suite.

## Deliberate boundaries
The application does not connect to YouTube, upload media, schedule publishing, generate AI copy, inspect image legibility automatically, or certify compliance with changing platform policies. The thumbnail checks are practical guidance only.

## Possible future work (not implemented)
- Reusable channel and format presets.
- SRT/VTT caption file checks.
- Multi-video batch planning.
- Optional YouTube Data API integration with explicit user consent and documented permissions.
