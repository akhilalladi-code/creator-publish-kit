# Creator Publish Kit

A local-first YouTube publishing workspace for metadata, chapters, thumbnail preflight and launch checklists.

## Privacy and local data
Drafts are stored in this browser's localStorage. Thumbnail images are decoded locally and are not uploaded. The development server binds to 127.0.0.1 by default. The interface uses system fonts and makes no Google Fonts network request. Export JSON regularly if you need a backup; clearing browser data may remove drafts.

## Run locally
Requires Node.js 18+.
```bash
git clone https://github.com/akhilalladi-code/creator-publish-kit.git
cd creator-publish-kit
npm ci
npm run dev
``
Open http://127.0.0.1:4179.

## Quality checks
```bash
npm run validate
npm audit --omit=dev --audit-level=high
``

## Scope
The tool prepares content but does not upload, schedule, publish or fetch YouTube data. Thumbnail checks are guidance, not a guarantee of platform acceptance.

## Security
See [SECURITY.md](SECURITY.md) for reporting and local data handling. See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidance.

## License
MIT — see [LICENSE](LICENSE).
