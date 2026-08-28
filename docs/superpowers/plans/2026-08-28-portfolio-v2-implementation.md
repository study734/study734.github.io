# Portfolio v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the existing portfolio into a project-first, evidence-oriented v2 while keeping React + TypeScript + Vite and the existing GitHub Pages deployment.

**Architecture:** Replace the v1 section hierarchy and compact project-card model with a smaller editorial page structure and a full-width `ProjectShowcase` component driven by structured project data. Preserve the existing static deployment model, tests, and CI, but rewrite tests around the v2 information architecture.

**Tech Stack:** React, TypeScript, Vite, CSS, Vitest, Testing Library, GitHub Actions, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-08-28-portfolio-v2-design.md`

## Global Constraints

- Keep React + TypeScript + Vite; no Astro or Next.js migration.
- Page order: Intro → Selected Projects → Experience → Core Stack → Contact.
- Project evidence and contribution must visually dominate the page.
- Projects order: GearVia → GearVia On-Premise → GearVia ME → MOIDA.
- Do not invent project screenshots or present decorative AI mockups as evidence.
- Do not expose a private MOIDA repository URL.
- Keep On-Premise wording conservative so planned/in-progress capabilities are not presented as completed work.
- Maintain semantic heading hierarchy, visible keyboard focus, mobile readability, and no hover-only essential content.
- Purple is a restrained accent only; avoid gradient-heavy hero sections, badge walls, GitHub stats widgets, glassmorphism, and complex animation.
- Existing Pages deployment remains unless implementation requires a minimal adjustment.

---

## File Structure

```text
src/
├─ components/
│  ├─ Header.tsx                 # v2 anchor navigation
│  ├─ ProjectShowcase.tsx        # large evidence-oriented project block
│  ├─ ProjectShowcase.test.tsx   # contribution/link/image behavior
│  └─ TechList.tsx               # compact technologies
├─ data/
│  ├─ projects.ts                # v2 project model + ordered records
│  └─ projects.test.ts           # order/content/link integrity
├─ sections/
│  ├─ Intro.tsx                  # short identity/positioning
│  ├─ Projects.tsx               # ordered showcase list
│  ├─ Experience.tsx             # education/role/achievements
│  ├─ Stack.tsx                  # compact core stack
│  └─ Contact.tsx                # GitHub only
├─ styles/
│  └─ global.css                 # editorial visual system
├─ App.tsx                       # v2 page composition
├─ App.test.tsx                  # v2 IA/navigation smoke test
└─ main.tsx
```

Remove when no longer referenced:

```text
src/components/ProjectCard.tsx
src/components/ProjectCard.test.tsx
src/components/SectionHeading.tsx
src/components/TechTags.tsx
src/sections/Hero.tsx
src/sections/About.tsx
src/sections/Skills.tsx
src/sections/Achievements.tsx
```

---

### Task 1: Rewrite the project model around evidence

**Files:**
- Modify: `src/data/projects.ts`
- Modify: `src/data/projects.test.ts`

**Interfaces:**

```ts
export interface ProjectImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface Project {
  name: string
  subtitle: string
  role: string[]
  contributions: string[]
  technologies: string[]
  repositoryUrl?: string
  demoUrl?: string
  image?: ProjectImage
}

export const projects: Project[]
```

- [ ] **Step 1: Rewrite tests first**

Tests must assert:
- exactly four projects;
- exact order: `GearVia`, `GearVia On-Premise`, `GearVia ME`, `MOIDA`;
- every project has at least one role, contribution, and technology;
- public repository URLs start with `https://github.com/`;
- MOIDA has no public repository URL;
- no project includes the removed `highlights` property.

- [ ] **Step 2: Run the focused data test**

Run: `npm run test -- src/data/projects.test.ts`
Expected: FAIL because the current v1 model still includes `description` / `highlights` and old order.

- [ ] **Step 3: Implement the v2 project model and records**

Use concise content. GearVia gets the strongest verified contribution detail. On-Premise wording must use design/analysis-oriented language for capabilities not verified as completed. GearVia ME contribution wording remains conservative. MOIDA source stays private.

- [ ] **Step 4: Re-run data tests**

Run: `npm run test -- src/data/projects.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data

git commit -m "refactor: reshape portfolio project data"
```

---

### Task 2: Replace compact ProjectCard with ProjectShowcase

**Files:**
- Create: `src/components/ProjectShowcase.tsx`
- Create: `src/components/ProjectShowcase.test.tsx`
- Create: `src/components/TechList.tsx`
- Delete after replacement: `src/components/ProjectCard.tsx`
- Delete after replacement: `src/components/ProjectCard.test.tsx`
- Delete after replacement: `src/components/TechTags.tsx`

**Interfaces:**

```ts
export function TechList(props: { technologies: string[] }): JSX.Element
export function ProjectShowcase(props: { project: Project; index: number }): JSX.Element
```

- [ ] **Step 1: Write failing ProjectShowcase tests**

Use a sample project and verify:
- visible number `01`;
- project heading;
- subtitle;
- labels `ROLE`, `CONTRIBUTION`, `STACK`;
- contribution text;
- technology text;
- repository action appears only when `repositoryUrl` exists;
- demo action appears only when `demoUrl` exists;
- without `image`, no `<img>` is rendered and a decorative placeholder remains.

- [ ] **Step 2: Run the focused test**

Run: `npm run test -- src/components/ProjectShowcase.test.tsx`
Expected: FAIL because `ProjectShowcase` does not exist.

- [ ] **Step 3: Implement `TechList`**

Render technologies as a compact semantic list without pill-heavy visual styling requirements.

- [ ] **Step 4: Implement `ProjectShowcase`**

Required DOM order:

```text
project number / heading
visual area
subtitle
ROLE
CONTRIBUTION
STACK
links
```

If `image` exists, render:

```tsx
<img
  src={project.image.src}
  alt={project.image.alt}
  width={project.image.width}
  height={project.image.height}
/>
```

If absent, render a decorative placeholder with `aria-hidden="true"`.

- [ ] **Step 5: Run component tests**

Run: `npm run test -- src/components/ProjectShowcase.test.tsx`
Expected: PASS.

- [ ] **Step 6: Remove old card files once no longer imported**

Delete `ProjectCard.tsx`, `ProjectCard.test.tsx`, and `TechTags.tsx` only after `Projects.tsx` is migrated in Task 3.

- [ ] **Step 7: Commit**

```bash
git add src/components

git commit -m "feat: add project showcase presentation"
```

---

### Task 3: Replace the v1 information architecture

**Files:**
- Modify: `src/components/Header.tsx`
- Create: `src/sections/Intro.tsx`
- Modify: `src/sections/Projects.tsx`
- Create: `src/sections/Experience.tsx`
- Create: `src/sections/Stack.tsx`
- Modify: `src/sections/Contact.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Delete: `src/sections/Hero.tsx`
- Delete: `src/sections/About.tsx`
- Delete: `src/sections/Skills.tsx`
- Delete: `src/sections/Achievements.tsx`
- Delete: `src/components/SectionHeading.tsx`

**Interfaces:**
- Section ids: `projects`, `experience`, `stack`, `contact`.
- Header nav labels: `Projects`, `Experience`, `Stack`, `GitHub`.

- [ ] **Step 1: Rewrite App smoke test first**

Assert:
- one `h1` containing `임태욱`;
- visible positioning text `Java / Spring Boot Backend Developer`;
- navigation anchors for `#projects`, `#experience`, `#stack`;
- `GitHub` links to `https://github.com/study734`;
- level-2 headings: `Selected Projects`, `Experience`, `Core Stack`, `Contact`;
- project names render in the v2 order;
- old level-2 headings `About`, `Skills`, `Achievements` do not exist.

- [ ] **Step 2: Run App test and confirm failure**

Run: `npm run test -- src/App.test.tsx`
Expected: FAIL because v1 sections are still rendered.

- [ ] **Step 3: Implement compact Intro**

Intro copy must stay within 2–3 short lines and avoid manifesto-style language. Include `Projects` and `GitHub` actions only.

- [ ] **Step 4: Migrate Projects section**

Render `projects.map((project, index) => <ProjectShowcase ... />)` with no duplicated project text.

- [ ] **Step 5: Implement Experience**

Use compact rows for:
- 대전대학교 정보보안학과;
- 성적우수장학금 2회;
- 교내 공모전 최우수상;
- 팀 프로젝트 부팀장 경험;
- 웹 개발 / 정보보안 교육.

- [ ] **Step 6: Implement Core Stack**

Render only:
- Backend: Java, Spring Boot, Spring Security, JPA / QueryDSL
- Frontend: React, TypeScript, Vite
- Database: MySQL
- AI: OpenAI API, RAG
- Infra: Docker, Nginx, GitHub Actions, AWS

- [ ] **Step 7: Simplify Contact and Header**

Contact exposes GitHub only. Header uses only the v2 navigation labels.

- [ ] **Step 8: Compose v2 in App**

Exact order:

```text
Header
Intro
Projects
Experience
Stack
Contact
Footer
```

- [ ] **Step 9: Remove v1-only files and imports**

Delete Hero, About, Skills, Achievements, SectionHeading, ProjectCard, ProjectCard test, and TechTags once references are gone.

- [ ] **Step 10: Run all tests**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 11: Commit**

```bash
git add -A src

git commit -m "refactor: introduce project-first portfolio layout"
```

---

### Task 4: Replace the v1 card visual system with editorial styling

**Files:**
- Modify: `src/styles/global.css`
- Modify if needed: `index.html`

**Interfaces:**
- Produces the CSS classes used by Intro, ProjectShowcase, Experience, Stack, and Contact.

- [ ] **Step 1: Establish v2 visual tokens**

Use:
- near-white background;
- almost-black text;
- muted gray secondary text;
- one restrained purple accent;
- content max width around current 1180px scale;
- strong vertical spacing;
- minimal radius and borders.

- [ ] **Step 2: Style the Intro as compact, not full-screen**

Remove the v1 `min-height: calc(100vh - 80px)` hero behavior. Heading should be large but the section should not consume a full viewport.

- [ ] **Step 3: Style ProjectShowcase as full-width case studies**

Each project block must use a large visual area with an aspect ratio suitable for future real screenshots, followed by metadata rather than a two-column rounded card.

- [ ] **Step 4: Style Experience and Stack as supporting sections**

Prefer rows / restrained grids over cards and pill walls.

- [ ] **Step 5: Add responsive behavior**

At mobile widths:
- single-column metadata;
- no horizontal overflow;
- image area remains full width;
- navigation wraps cleanly;
- links remain easy to tap.

- [ ] **Step 6: Respect reduced motion**

If transitions exist, include a `prefers-reduced-motion: reduce` rule that disables non-essential motion and smooth scrolling.

- [ ] **Step 7: Run test and build verification**

Run: `npm run test && npm run build`
Expected: PASS and `dist/index.html` exists.

- [ ] **Step 8: Commit**

```bash
git add src/styles/global.css index.html

git commit -m "style: redesign portfolio as editorial case studies"
```

---

### Task 5: PR verification and Pages deployment

**Files:**
- No required production file changes unless CI reveals a real issue.

**Interfaces:**
- Consumes: existing PR verification workflow and Pages deployment workflow.

- [ ] **Step 1: Run final repository verification**

Run:

```text
npm install
npm run test
npm run build
```

Expected: all pass.

- [ ] **Step 2: Create PR `feat/portfolio-v2` → `main`**

PR summary must state:
- v1 explanation-heavy layout replaced;
- projects now dominate the page;
- project features and personal contribution are separated;
- no fake screenshots introduced;
- React/Vite and Pages deployment retained.

- [ ] **Step 3: Verify GitHub Actions**

PR workflow must complete with dependency install, tests, and production build successful.

- [ ] **Step 4: Merge only after green CI**

Use squash merge into `main` after user selects merge/integration option.

- [ ] **Step 5: Verify Pages deployment**

Confirm the `main` deployment workflow completes build, artifact upload, and deploy successfully.

- [ ] **Step 6: Verify live URL**

Confirm `https://study734.github.io` serves v2 after deployment.

---

## Final Verification Checklist

- [ ] Intro is compact and contains one `h1`.
- [ ] `Java / Spring Boot Backend Developer` is visible near the top.
- [ ] Projects are ordered GearVia → On-Premise → GearVia ME → MOIDA.
- [ ] Every project separates role, contribution, and stack.
- [ ] Project visual areas are dominant and ready for real screenshots.
- [ ] No fake project screenshot is presented as evidence.
- [ ] MOIDA does not expose a private repository URL.
- [ ] `About`, `Skills`, and `Achievements` v1 sections are removed.
- [ ] Core Stack is compact and not a badge wall.
- [ ] Desktop and mobile layouts have no horizontal overflow.
- [ ] Keyboard focus remains visible.
- [ ] Reduced-motion users are respected if motion exists.
- [ ] `npm run test` passes.
- [ ] `npm run build` passes.
- [ ] PR CI passes.
- [ ] GitHub Pages deployment succeeds after merge.
