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

Deployed on Vercel. Pushes to `main` go to production; other branches get preview deployments. Pull requests are verified by `.github/workflows/ci.yml` (test + build).

Live URL: https://taewook-im.vercel.app

Each view has its own shareable link, e.g. `https://taewook-im.vercel.app/#/project-0` (GearVia), `#/stack`, `#/contact`.

## Editing content

- Name, role, GitHub and email: `src/data/profile.ts`
- Projects and case studies: `src/data/projects.ts`
- Conversation records: `src/data/conversations.ts`

## Structure

- Profile README: https://github.com/study734
- Portfolio: https://taewook-im.vercel.app
- Detailed technical evidence: linked project repositories and their README files
