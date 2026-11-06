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

## Portfolio assistant

The home screen is an assistant that introduces me to visitors, speaking about me in the third person ("태욱 님은 …").

- **Greeting by visitor type:** it asks "어떤 일로 오셨어요?" and gives recruiters a 30-second summary with contact links, developers the technical decisions with commit links, and casual visitors the project cards (`tourFor` in `src/agent/engine.ts`).
- **Prepared answers:** common questions (who, why hire, strengths, weaknesses, hardest problem, AI, security, roles, stack, contact) have answers written in the assistant's voice using only facts from the records (`curatedAnswer`).
- **Record search for everything else:** `src/agent/search.ts` searches the records built in `src/agent/knowledge.ts`. The steps shown in the UI are the real search results.
- **Hand-off instead of guessing:** when no record matches, the assistant says so and offers a form that opens a prepared email to me (`src/components/AgentHandoff.tsx`).
- Type `/` in the composer to jump to a screen.

Editing answers: change the text in `curatedAnswer`/`tourFor`; keep every claim traceable to `src/data/projects.ts` or `src/data/conversations.ts`.

Connecting a generative AI later: replace the body of `runAgent` with a call to a server function (e.g. `api/agent.ts` on Vercel) that returns the same `AgentRun` shape, and give the model the prepared answers plus `search()` results as its only context. The API key belongs in Vercel's Environment Variables, never in this repository.

## Editing content

- Name, role, GitHub and email: `src/data/profile.ts`
- Projects and case studies: `src/data/projects.ts`
- Conversation records: `src/data/conversations.ts`

## Structure

- Profile README: https://github.com/study734
- Portfolio: https://taewook-im.vercel.app
- Detailed technical evidence: linked project repositories and their README files
