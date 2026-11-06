# study734.github.io

Personal portfolio for **임태욱 | Backend & AI-integrated Web Developer**.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run test
npm run build
```

## Deployment

Pushes to `main` are tested, built with Vite, and deployed to GitHub Pages by `.github/workflows/deploy.yml`.

One-time setup: in the repository **Settings → Pages**, set **Source** to **GitHub Actions**.

Live URL: https://study734.github.io

Each view has its own shareable link, e.g. `https://study734.github.io/#/project-0` (GearVia), `#/stack`, `#/contact`.

## Editing content

- Name, role, GitHub and email: `src/data/profile.ts`
- Projects and case studies: `src/data/projects.ts`
- Conversation records: `src/data/conversations.ts`

## Structure

- Profile README: https://github.com/study734
- Portfolio: https://study734.github.io
- Detailed technical evidence: linked project repositories and their README files
