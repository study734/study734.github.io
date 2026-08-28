# Portfolio v2 Design

Date: 2026-08-28
Repository: `study734/study734.github.io`
Branch: `feat/portfolio-v2`
Target URL: `https://study734.github.io`

## 1. Objective

Redesign the current portfolio from an explanation-heavy developer template into a project-first, evidence-oriented portfolio.

The v2 site should prioritize what was built, what the user personally contributed, what technologies were used, and where the work can be verified.

The design should feel closer to an editorial case-study portfolio than a generic AI-generated developer landing page.

## 2. Core Principle

The page hierarchy is:

```text
Project evidence
    ↓
Personal contribution
    ↓
Technology
    ↓
Repository / demo
```

Abstract self-description, engineering philosophy, and long skill lists must not compete with project evidence.

## 3. Technical Direction

Keep the existing technical stack:

- React
- TypeScript
- Vite
- CSS
- Vitest / Testing Library
- GitHub Actions
- GitHub Pages

Do not migrate to Astro in v2.

Instead, adopt the useful principles identified from external documentation:

- content-first information architecture;
- static, lightweight presentation;
- semantic HTML and heading order;
- responsive images with explicit dimensions when real screenshots are added;
- no essential interaction dependent on hover;
- visible keyboard focus;
- reduced decorative motion;
- mobile-first responsive behavior.

## 4. Information Architecture

Replace the current section sequence:

```text
Hero
About
Projects
Skills
Achievements
Contact
```

with:

```text
01 Intro
02 Selected Projects
03 Experience
04 Core Stack
05 Contact
```

Projects should occupy most of the vertical page length and visual attention.

## 5. Intro

The intro should be compact.

Primary heading:

```text
임태욱
```

Developer positioning:

```text
Java / Spring Boot Backend Developer
```

Supporting copy should be limited to 2–3 short lines and communicate:

- Information Security background;
- Java / Spring Boot web development;
- practical interest in AI-integrated web services.

Avoid phrases that sound like generic manifesto copy, including large sections about engineering philosophy or abstract values.

Primary links:

- GitHub
- Projects anchor

Resume/contact links may be added only when a real public destination exists.

## 6. Selected Projects

Initial order:

1. GearVia
2. GearVia On-Premise
3. GearVia ME
4. MOIDA

Each project becomes a large case-study block rather than a compact card.

### 6.1 Project block structure

```text
01 / PROJECT NAME

[ large project screenshot or visual placeholder ]

One-line product description

ROLE
Concise role label

CONTRIBUTION
2–4 verified personal contributions

STACK
Only the most relevant technologies

[ Repository ] [ Demo if available ]
```

The project image area should be visually dominant.

### 6.2 Screenshot behavior

Until real screenshots are supplied:

- use a restrained placeholder designed for later replacement;
- do not invent fake UI screenshots;
- do not use decorative AI-generated product mockups as evidence;
- preserve the layout dimensions expected for a future 16:9 or similar project screenshot.

When real screenshots are added later:

- meaningful screenshots require descriptive `alt` text;
- `width` and `height` should be provided;
- CSS should keep images responsive;
- image loading should not cause layout shift.

## 7. Project Content Rules

### GearVia

Product positioning:

AI-based collaborative task-management platform.

Keep only high-signal feature context needed to understand personal work.

Personal contribution should be based on verified work and may include:

- AI report design / implementation;
- account and user settings functionality;
- notification-related work;
- authentication / authorization integration review;
- development environment and collaboration support.

Do not claim team-wide ownership.

### GearVia On-Premise

Product positioning:

On-premise collaboration platform for operation inside an organization.

Distinguish clearly between implemented work and planned / in-progress capabilities.

Do not present planned features as completed evidence.

### GearVia ME

Product positioning:

Personal schedule and task-management service.

Only publish detailed contribution bullets after they are verified against repository evidence. Until then, keep contribution wording conservative.

### MOIDA

Product positioning:

Team-based used-goods auction service.

Personal contribution may include:

- authentication / security;
- AWS architecture;
- deployment verification;
- presentation / delivery.

Do not expose a private repository URL.

## 8. Experience

Replace the current large About + Achievements split with one compact section.

Suggested content:

- Daejeon University — Information Security
- Academic Excellence Scholarship ×2
- University competition Grand Prize
- Team-project vice-lead experience
- Web development / security training

Use simple rows or a timeline-like editorial layout.

Do not inflate this section with long biography copy.

## 9. Core Stack

The stack section is supporting evidence, not the main content.

Use only technologies that materially appear in showcased projects.

Suggested groups:

- Backend: Java, Spring Boot, Spring Security, JPA / QueryDSL
- Frontend: React, TypeScript, Vite
- Database: MySQL
- AI: OpenAI API, RAG
- Infra: Docker, Nginx, GitHub Actions, AWS

Avoid a large badge wall.

Prefer plain text, small tags, or a compact two-column list.

## 10. Contact

Keep contact minimal.

Required:

- GitHub profile

Optional only when real public destinations exist:

- Email
- LinkedIn
- Resume

No contact form is required.

## 11. Visual Direction

### Overall

- white or near-white background;
- almost-black primary text;
- restrained muted gray;
- purple used only as a small accent;
- editorial spacing;
- strong project numbering;
- large screenshots / visual areas;
- minimal borders and card chrome.

### Avoid

- glassmorphism;
- gradient-heavy hero backgrounds;
- excessive rounded cards;
- floating badges;
- GitHub stats widgets;
- skill icon walls;
- animated particle backgrounds;
- excessive typewriter effects;
- decorative dashboard mockups presented as real evidence.

## 12. Project Layout

Desktop project section:

```text
01
GEARVIA
────────────────────────────────────
[              screenshot             ]
[              screenshot             ]
────────────────────────────────────
Description

ROLE              CONTRIBUTION
Vice-lead         AI report
Backend           Account / settings
AI                Notifications

STACK
Java · Spring Boot · React · RAG

Repository ↗
```

Project blocks should generally span the content width rather than appearing as two-column cards.

On mobile, all metadata becomes a single readable column.

## 13. Navigation

Header navigation should be reduced to:

- Projects
- Experience
- Stack
- GitHub

The current About / Skills / Achievements / Contact-heavy navigation should be removed.

Anchor navigation remains sufficient; no router is required.

## 14. Component Direction

The existing `ProjectCard` abstraction no longer matches the design.

Replace it with a larger `ProjectShowcase` component.

Suggested structure:

```text
src/
├─ components/
│  ├─ Header.tsx
│  ├─ ProjectShowcase.tsx
│  └─ TechList.tsx
├─ sections/
│  ├─ Intro.tsx
│  ├─ Projects.tsx
│  ├─ Experience.tsx
│  ├─ Stack.tsx
│  └─ Contact.tsx
├─ data/
│  └─ projects.ts
├─ styles/
│  └─ global.css
├─ App.tsx
└─ main.tsx
```

Remove components and sections that only exist to support the v1 structure when they are no longer used.

## 15. Project Data Model

Update project data to support evidence-oriented presentation.

Conceptual shape:

```ts
interface Project {
  name: string
  subtitle: string
  role: string[]
  contributions: string[]
  technologies: string[]
  repositoryUrl?: string
  demoUrl?: string
  image?: {
    src: string
    alt: string
    width: number
    height: number
  }
}
```

Do not keep duplicated `highlights` if they add little value to the new layout.

## 16. Accessibility

Requirements:

- exactly one primary `h1`;
- project names use semantic headings;
- sections have meaningful heading hierarchy;
- visible keyboard focus;
- project links have descriptive labels;
- decorative placeholders should not be exposed as meaningful images;
- real screenshots require useful alt text;
- color is not the only information signal;
- no essential content requires hover.

## 17. Responsive Behavior

Desktop:

- content width around the current 1180px scale is acceptable;
- project images span most or all of the content width;
- role / contribution metadata can use two or three columns.

Tablet:

- metadata columns may reduce;
- project image remains dominant.

Mobile:

- single column;
- no horizontal overflow;
- project number, title, image, contribution, stack, links appear in a natural reading order;
- tap targets remain comfortable.

## 18. Motion

Motion is optional and must remain subtle.

Allowed:

- small opacity / translate transitions;
- hover color transitions;
- only non-essential decorative motion.

Do not introduce large scroll animation systems in v2.

Respect `prefers-reduced-motion` if transitions are added.

## 19. Testing

Update tests to verify the new information architecture rather than preserve v1 markup.

At minimum test:

- intro primary heading and developer positioning;
- navigation anchors for Projects / Experience / Stack;
- all four project names render;
- project contribution labels / content are present;
- private MOIDA source is not exposed as a repository link;
- project ordering is stable;
- no removed v1 section headings such as `About` or `Skills` are expected by tests;
- production build succeeds.

## 20. Deployment

Keep the existing GitHub Pages deployment workflow unless a change is required by the implementation.

Required verification:

```text
npm install
npm run test
npm run build
```

PR CI must pass before merge.

After merge to `main`, the Pages deployment job must complete successfully.

## 21. Non-Goals for v2

Do not add:

- Astro migration;
- Next.js migration;
- backend;
- CMS;
- blog;
- dark mode;
- multilingual support;
- project detail routes;
- analytics;
- contact form;
- complex animation library;
- generated fake project screenshots.

## 22. Success Criteria

v2 is successful when:

1. Projects visually dominate the page.
2. The first screen is shorter and less manifesto-like than v1.
3. Project description and personal contribution are immediately distinguishable.
4. The site no longer resembles a generic AI-generated developer template.
5. Real screenshots can be added later without restructuring components.
6. Only verified evidence is presented as completed work.
7. Mobile and desktop layouts remain readable and accessible.
8. Tests and production build pass in GitHub Actions.
9. GitHub Pages deployment succeeds after merge.
