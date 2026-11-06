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

## Portfolio agent

The home screen is an agent that answers visitors' questions about me.

- `src/agent/knowledge.ts` splits the portfolio data (projects, technical decisions, conversation records, experience, stack, contact) into small searchable records.
- `src/agent/engine.ts` understands the question, searches those records, and builds the answer from what it found. The steps shown in the UI (질문 이해 → 기록 검색 → 답변 작성) are the real search results, not an animation script.
- It only answers from the records. Off-topic questions get a "no record" reply instead of an invented answer.
- Type `/` in the composer to jump to a screen (`/review`, `/기술 스택`, ...).

Connecting a generative AI later: replace the body of `runAgent` with a call to a server function (e.g. `api/agent.ts` on Vercel) that returns the same `AgentRun` shape, and pass the `search()` results to the model as its only context. The API key belongs in Vercel's Environment Variables, never in this repository.

## Editing content

- Name, role, GitHub and email: `src/data/profile.ts`
- Projects and case studies: `src/data/projects.ts`
- Conversation records: `src/data/conversations.ts`

## Structure

- Profile README: https://github.com/study734
- Portfolio: https://taewook-im.vercel.app
- Detailed technical evidence: linked project repositories and their README files
