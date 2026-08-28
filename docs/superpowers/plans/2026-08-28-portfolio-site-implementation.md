# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a recruiter-oriented React + TypeScript + Vite portfolio at `https://study734.github.io`.

**Architecture:** A static single-page React application renders structured portfolio data into focused sections and reusable project cards. Vite builds the site to `dist/`, and GitHub Actions deploys that artifact to the GitHub Pages user site root.

**Tech Stack:** React, TypeScript, Vite, CSS, Vitest, Testing Library, GitHub Actions, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-08-28-portfolio-site-design.md`

## Global Constraints

- User-site deployment base must be `/`.
- Initial site is a single-page portfolio with anchor navigation.
- White background with minimal purple accent and strong typography.
- Featured projects: GearVia, GearVia ME, GearVia On-Premise, MOIDA.
- Project description and personal contribution must be visibly separated.
- No backend, database, login, CMS, analytics, blog, dark mode, multi-language system, project-detail routing, GitHub API runtime integration, or generated GitHub stats in v1.
- No essential interaction may depend on hover.
- Mobile layout must avoid horizontal overflow.
- CI must fail on TypeScript, test, or production-build errors.

---

## File Structure

```text
.github/
└─ workflows/
   └─ deploy.yml              # test/build/deploy GitHub Pages

src/
├─ components/
│  ├─ Header.tsx              # anchor navigation
│  ├─ ProjectCard.tsx         # project presentation
│  ├─ ProjectCard.test.tsx    # contribution/content contract
│  ├─ SectionHeading.tsx      # consistent headings
│  └─ TechTags.tsx            # restrained technology tags
├─ data/
│  ├─ projects.ts             # four featured project records
│  └─ projects.test.ts        # data integrity/link checks
├─ sections/
│  ├─ Hero.tsx
│  ├─ About.tsx
│  ├─ Projects.tsx
│  ├─ Skills.tsx
│  ├─ Achievements.tsx
│  └─ Contact.tsx
├─ styles/
│  └─ global.css              # layout, typography, responsive rules
├─ App.test.tsx               # landmark/anchor smoke test
├─ App.tsx                    # page composition
├─ main.tsx                   # React entrypoint
└─ vite-env.d.ts

index.html                    # document shell/metadata
package.json                  # scripts and dependencies
tsconfig.json                 # TS config
tsconfig.app.json             # app TS config
tsconfig.node.json            # Vite config TS config
vite.config.ts                # base '/', Vitest config
README.md                     # local development/deploy notes
```

---

### Task 1: Bootstrap the React/Vite project and verification harness

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `src/vite-env.d.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/App.test.tsx`

**Interfaces:**
- Produces: `npm run test`, `npm run build`, React root application, Vitest/jsdom environment.

- [ ] **Step 1: Create package manifest with exact scripts**

```json
{
  "name": "study734-portfolio",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "test": "vitest run",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "react": "latest",
    "react-dom": "latest",
    "vite": "latest"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "jsdom": "latest",
    "typescript": "latest",
    "vitest": "latest"
  }
}
```

- [ ] **Step 2: Write a failing smoke test before page implementation**

```tsx
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import App from './App'

test('renders portfolio navigation and main heading', () => {
  render(<App />)

  expect(screen.getByRole('heading', { level: 1, name: /임태욱/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#projects')
  expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/study734')
})
```

- [ ] **Step 3: Run the test and confirm it fails**

Run: `npm install && npm run test`
Expected: FAIL because `App` does not yet render the required heading and links.

- [ ] **Step 4: Create the minimal app shell**

`src/App.tsx` must temporarily render an `<h1>임태욱 | Backend & AI-integrated Web Developer</h1>` plus links named `Projects` and `GitHub` with the exact hrefs from the test.

- [ ] **Step 5: Configure Vite base and Vitest**

`vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
})
```

- [ ] **Step 6: Run tests and production build**

Run: `npm run test && npm run build`
Expected: both commands PASS and `dist/index.html` exists.

- [ ] **Step 7: Commit**

```bash
git add package.json index.html tsconfig*.json vite.config.ts src

git commit -m "feat: bootstrap portfolio app"
```

---

### Task 2: Define project data and enforce content integrity

**Files:**
- Create: `src/data/projects.ts`
- Create: `src/data/projects.test.ts`

**Interfaces:**
- Produces:

```ts
export interface Project {
  name: string
  subtitle: string
  description: string
  highlights: string[]
  contributions: string[]
  technologies: string[]
  repositoryUrl: string
  image?: string
}

export const projects: Project[]
```

- [ ] **Step 1: Write failing data integrity tests**

Tests must assert:
- exactly four records exist;
- names are `GearVia`, `GearVia ME`, `GearVia On-Premise`, `MOIDA`;
- every project has at least one technology and at least one contribution;
- every repository URL begins with `https://github.com/`.

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm run test -- src/data/projects.test.ts`
Expected: FAIL because `projects.ts` does not exist.

- [ ] **Step 3: Implement the four project records**

Use these canonical repository links:
- GearVia → `https://github.com/HO-0219/WorkTaskFlow`
- GearVia ME → `https://github.com/HO-0219/todoProject`
- GearVia On-Premise → `https://github.com/HO-0219/GearViaB2B_Version`
- MOIDA → repository link must be a verified public showcase/source link before final deployment; if none is available, omit the repository action from the MOIDA card rather than exposing a private URL.

Project descriptions must remain concise. Contributions must be written separately from product features.

- [ ] **Step 4: Run data tests**

Run: `npm run test -- src/data/projects.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data

git commit -m "feat: add portfolio project data"
```

---

### Task 3: Build reusable presentation components

**Files:**
- Create: `src/components/SectionHeading.tsx`
- Create: `src/components/TechTags.tsx`
- Create: `src/components/ProjectCard.tsx`
- Create: `src/components/ProjectCard.test.tsx`

**Interfaces:**
- Consumes: `Project` from `src/data/projects.ts`.
- Produces:

```ts
export function SectionHeading(props: { eyebrow?: string; title: string; description?: string }): JSX.Element
export function TechTags(props: { technologies: string[] }): JSX.Element
export function ProjectCard(props: { project: Project; index: number }): JSX.Element
```

- [ ] **Step 1: Write failing ProjectCard tests**

Tests must verify a sample card renders:
- project name;
- product description;
- a visible `My Contribution` label;
- contribution text;
- technology tags;
- repository action only when `repositoryUrl` is non-empty.

- [ ] **Step 2: Run the component test and confirm failure**

Run: `npm run test -- src/components/ProjectCard.test.tsx`
Expected: FAIL because component files do not exist.

- [ ] **Step 3: Implement the three focused components**

`ProjectCard` must keep project overview and contribution in separate semantic blocks. If `image` is absent, render a restrained visual placeholder containing the project name rather than a broken `<img>`.

- [ ] **Step 4: Run component tests**

Run: `npm run test -- src/components/ProjectCard.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components

git commit -m "feat: add portfolio presentation components"
```

---

### Task 4: Compose the portfolio sections

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/sections/Hero.tsx`
- Create: `src/sections/About.tsx`
- Create: `src/sections/Projects.tsx`
- Create: `src/sections/Skills.tsx`
- Create: `src/sections/Achievements.tsx`
- Create: `src/sections/Contact.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes: `projects` and reusable components.
- Produces section ids: `about`, `projects`, `skills`, `achievements`, `contact`.

- [ ] **Step 1: Extend App smoke test and confirm red state**

Add assertions that `main` contains sections with accessible headings `About`, `Featured Projects`, `Skills`, `Achievements`, `Contact`, and that navigation links point to the exact section ids.

Run: `npm run test -- src/App.test.tsx`
Expected: FAIL until the sections are implemented.

- [ ] **Step 2: Implement Header and Hero**

Hero copy must communicate:
- information-security background;
- Java / Spring Boot web-development focus;
- interest in AI Agent / RAG integration with real web-service workflows.

Primary actions: `View Projects` → `#projects`, `GitHub` → `https://github.com/study734`.

- [ ] **Step 3: Implement About**

Use concise engineering-focused copy around authentication, authorization, validation, failure handling, operations, and recovery.

- [ ] **Step 4: Implement Projects**

Map all `projects` to `ProjectCard` components. Do not duplicate project data inside the section component.

- [ ] **Step 5: Implement Skills**

Render six groups: Backend, Frontend, Database, AI, Infra / DevOps, Web / Security.

- [ ] **Step 6: Implement Achievements and Contact**

Achievements must contain:
- Daejeon University Information Security;
- Academic Excellence Scholarship ×2;
- University competition Grand Prize;
- team-project vice-lead experience.

Contact exposes GitHub only in v1.

- [ ] **Step 7: Compose all sections in App**

Exact order: Header → Hero → About → Projects → Skills → Achievements → Contact → Footer.

- [ ] **Step 8: Run all tests**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src

git commit -m "feat: compose portfolio sections"
```

---

### Task 5: Add the visual system and responsive behavior

**Files:**
- Create: `src/styles/global.css`
- Modify: `src/main.tsx`
- Modify: `index.html`

**Interfaces:**
- Produces global CSS custom properties, page container classes, card layouts, responsive breakpoints, visible focus states.

- [ ] **Step 1: Add a static CSS contract test to App smoke test**

Assert key structural classes exist on rendered elements, including a main container and project grid. This is intentionally a shallow contract test; browser layout is verified manually in Step 5.

- [ ] **Step 2: Run test and confirm failure**

Run: `npm run test -- src/App.test.tsx`
Expected: FAIL until classes are applied.

- [ ] **Step 3: Implement global visual tokens**

Required characteristics:
- white or near-white background;
- dark neutral text;
- one restrained purple accent family;
- maximum readable content width;
- large hero typography;
- consistent vertical spacing;
- restrained borders/shadows;
- visible `:focus-visible` state.

- [ ] **Step 4: Implement responsive rules**

Desktop: project grid may use two columns.
Mobile: one column; navigation must wrap or simplify without horizontal overflow; tap targets remain comfortable; no essential content appears only on hover.

- [ ] **Step 5: Verify responsive layout manually**

Run: `npm run dev -- --host 0.0.0.0`
Check at minimum around 390px and 1440px widths.
Expected: no horizontal scrollbar, readable hierarchy, project cards stack cleanly on mobile.

- [ ] **Step 6: Update metadata in index.html**

Include Korean-language document metadata, a meaningful title, description, viewport, and theme-color matching the restrained visual system.

- [ ] **Step 7: Run tests and production build**

Run: `npm run test && npm run build`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/styles src/main.tsx src/App.tsx index.html

git commit -m "style: add responsive portfolio visual system"
```

---

### Task 6: Add GitHub Pages deployment and repository documentation

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`

**Interfaces:**
- Consumes: `npm run test`, `npm run build`, output directory `dist/`.
- Produces: Pages deployment from `main` using the `github-pages` environment.

- [ ] **Step 1: Create deployment workflow**

Workflow requirements:
- triggers on pushes to `main` and `workflow_dispatch`;
- permissions: `contents: read`, `pages: write`, `id-token: write`;
- concurrency group `pages` with cancel-in-progress enabled;
- checkout;
- setup Node with npm cache;
- `npm ci`;
- `npm run test`;
- `npm run build`;
- `actions/configure-pages`;
- `actions/upload-pages-artifact` with `./dist`;
- `actions/deploy-pages` in a `deploy` job using `github-pages` environment.

- [ ] **Step 2: Add README**

README must document:

```text
npm install
npm run dev
npm run test
npm run build
```

and explain that the deployed user site is `https://study734.github.io`.

- [ ] **Step 3: Validate YAML and build assumptions**

Check workflow paths and script names exactly match `package.json`. Confirm Vite base remains `/`.

- [ ] **Step 4: Run tests/build locally or in an equivalent checkout**

Run: `npm ci && npm run test && npm run build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/deploy.yml README.md

git commit -m "ci: deploy portfolio to GitHub Pages"
```

---

### Task 7: Link the live portfolio from the GitHub Profile README

**Files:**
- Modify in separate repository: `study734/study734/README.md`

**Interfaces:**
- Consumes: confirmed successful deployment URL `https://study734.github.io`.
- Produces: prominent portfolio link from profile README.

- [ ] **Step 1: Verify live deployment before changing profile**

Open `https://study734.github.io` and confirm the built portfolio loads successfully.
Expected: page title, hero, projects, and styles render from GitHub Pages.

- [ ] **Step 2: Fetch current Profile README SHA**

Read `study734/study734/README.md` and preserve all existing content.

- [ ] **Step 3: Add a prominent portfolio link near the introduction**

Use concise wording such as:

```markdown
[Portfolio](https://study734.github.io) · [GitHub](https://github.com/study734)
```

Do not duplicate a long project catalog in the profile README.

- [ ] **Step 4: Verify saved Profile README**

Fetch the file again and confirm the URL is correct.

- [ ] **Step 5: Commit**

Commit message: `docs: link portfolio website`.

---

## Final Verification

- [ ] `npm ci` succeeds from a clean checkout.
- [ ] `npm run test` passes.
- [ ] `npm run build` passes.
- [ ] `dist/index.html` is produced.
- [ ] All five anchor navigation destinations exist.
- [ ] All public project links resolve to intended repositories.
- [ ] No private repository URL is exposed.
- [ ] Project cards distinguish features from personal contributions.
- [ ] Desktop and mobile layouts have no horizontal overflow.
- [ ] GitHub Pages Actions workflow completes successfully.
- [ ] `https://study734.github.io` loads the deployed site.
- [ ] `study734/study734` Profile README links to the live portfolio.
