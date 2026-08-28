# Portfolio Site Design

Date: 2026-08-28
Repository: `study734/study734.github.io`
Target URL: `https://study734.github.io`

## 1. Goal

Build a concise, recruiter-oriented personal portfolio that acts as the visual layer above the GitHub profile and project repositories.

The site should answer three questions quickly:

1. What kind of developer is this person?
2. What representative projects have they built?
3. What did they personally contribute and what technical areas do they care about?

The site is not intended to replace detailed project READMEs. It should summarize, provide visual context, and route visitors to the underlying repositories.

## 2. Audience

Primary audience:
- Recruiters and hiring managers
- Technical interviewers
- Developers reviewing project history

The first screen should be understandable within a few seconds, while project cards should provide enough context to decide whether to open a repository.

## 3. Technical Architecture

### Stack

- React
- TypeScript
- Vite
- CSS without a heavy UI framework
- GitHub Actions
- GitHub Pages

### Deployment flow

```text
Push to main
    ↓
GitHub Actions
    ↓
Install dependencies
    ↓
Type-check / build
    ↓
Vite outputs dist/
    ↓
Upload Pages artifact
    ↓
Deploy to GitHub Pages
```

The application is static. No backend, database, authentication, analytics service, or server-side runtime is required for the initial version.

## 4. Information Architecture

The initial site is a single-page portfolio with anchor navigation.

```text
Header
  ├─ About
  ├─ Projects
  ├─ Skills
  ├─ Achievements
  └─ Contact

Hero
  ↓
About
  ↓
Featured Projects
  ↓
Skills
  ↓
Achievements
  ↓
Contact
  ↓
Footer
```

A single-page structure is preferred initially because it reduces navigation friction and keeps the portfolio easy to scan. Individual project detail pages can be added later if the project repositories alone are no longer sufficient.

## 5. Visual Direction

### Principles

- White background
- Minimal purple accent
- Strong typography
- Large whitespace
- Project imagery as the main visual evidence
- Limited decorative graphics
- Responsive layout for desktop and mobile

### Visual hierarchy

1. Name and developer positioning
2. Representative projects
3. Personal contribution and technical focus
4. Skills and achievements
5. Contact / repository links

GitHub stats cards, excessive badges, animated backgrounds, and decorative skill icon walls are intentionally excluded from the first version.

## 6. Sections

### 6.1 Header

A compact sticky or static header containing:
- Name or short personal mark
- About
- Projects
- Skills
- Contact

Navigation uses in-page anchors.

### 6.2 Hero

Primary message:

`임태욱 | Backend & AI-integrated Web Developer`

Supporting copy should explain:
- Information-security background
- Java / Spring Boot web development focus
- Interest in safely integrating AI Agent / RAG into real web-service workflows

Primary actions:
- View Projects
- GitHub

### 6.3 About

Short introduction focused on engineering perspective rather than biography.

Key ideas:
- Security-oriented development background
- Attention to authentication, authorization, validation, failure handling, operations, and recovery
- Interest in AI systems that interact with real application state

### 6.4 Featured Projects

Initial projects:

1. GearVia
2. GearVia ME
3. GearVia On-Premise
4. MOIDA

Each project card contains:
- Project name
- One-line positioning
- Representative image placeholder or image
- 2-4 concise highlights
- Main technologies
- Personal contribution summary
- GitHub repository link

Project cards must distinguish product description from personal contribution. The portfolio should not imply ownership of team work that was not personally implemented.

#### GearVia

Positioning: AI-based collaborative task-management platform.

Key themes:
- Group task management
- AI Assistant / RAG
- AI reports
- Real-time collaboration
- Web Push / PWA

#### GearVia ME

Positioning: Personal schedule and task-management service.

Key themes:
- Personal task management
- Calendar / schedule
- User settings
- Notifications
- PWA

#### GearVia On-Premise

Positioning: On-premise collaboration platform designed for operation inside an organization.

Key themes:
- Administration
- AI model / API-key configuration
- RAG and internal file systems
- NAS / internal storage integration structure
- Audit / download tracking
- Resource monitoring

#### MOIDA

Positioning: Team-based used-goods auction service.

Key themes:
- Authentication / security
- AWS architecture
- Deployment verification
- Presentation / project delivery

### 6.5 Skills

Skills are grouped by engineering area rather than displayed as an unstructured badge wall.

Groups:
- Backend
- Frontend
- Database
- AI
- Infra / DevOps
- Web / Security

The initial version uses concise text or restrained tags.

### 6.6 Achievements

Include only high-signal items:
- Daejeon University, Information Security
- Academic Excellence Scholarship ×2
- University competition Grand Prize
- Team-project vice-lead experience

### 6.7 Contact

Initial contact surface:
- GitHub profile

Additional channels such as email or LinkedIn should only be added when the user explicitly wants them public.

## 7. Content Model

Project data should be stored separately from presentation components so the page can be updated without editing large JSX blocks.

Example conceptual shape:

```ts
interface Project {
  name: string
  subtitle: string
  description: string
  highlights: string[]
  contributions: string[]
  technologies: string[]
  repositoryUrl: string
  image?: string
}
```

The initial implementation may keep this data in a local TypeScript module.

## 8. Component Boundaries

Suggested component structure:

```text
src/
├─ components/
│  ├─ Header.tsx
│  ├─ SectionHeading.tsx
│  ├─ ProjectCard.tsx
│  └─ TechTags.tsx
├─ sections/
│  ├─ Hero.tsx
│  ├─ About.tsx
│  ├─ Projects.tsx
│  ├─ Skills.tsx
│  ├─ Achievements.tsx
│  └─ Contact.tsx
├─ data/
│  └─ projects.ts
├─ styles/
│  └─ global.css
├─ App.tsx
└─ main.tsx
```

Components should remain small and focused. Content data should not be duplicated across components.

## 9. Responsive Behavior

### Desktop
- Wide centered content container
- Project cards may use a two-column layout where appropriate
- Images and descriptions maintain clear hierarchy

### Mobile
- Single-column project layout
- Navigation remains readable without horizontal overflow
- Buttons and links remain touch-friendly
- Typography scales down without collapsing hierarchy

No essential content should depend on hover.

## 10. Accessibility

Initial accessibility requirements:
- Semantic section structure
- Meaningful heading order
- Sufficient text contrast
- Visible keyboard focus
- Accessible link labels
- Alternative text for meaningful project images
- Reduced reliance on color alone

## 11. Error and Failure Handling

Because the portfolio is static, runtime failure modes are limited.

Primary failure cases:
- Missing project image
- Broken repository link
- Failed build
- Failed GitHub Pages deployment

Handling:
- Project cards remain readable without an image
- External links are explicit and easy to verify
- CI must fail on TypeScript/build errors
- Deployment workflow should only deploy a successful build artifact

No client-side API calls are required in the initial version, avoiding unnecessary network failure paths.

## 12. Testing and Verification

Minimum verification before deployment:

- TypeScript compilation succeeds
- Vite production build succeeds
- All navigation anchors work
- Repository links resolve to the intended repositories
- Layout is usable at common desktop and mobile widths
- No horizontal overflow on mobile
- Semantic headings are ordered correctly
- GitHub Pages deployment completes successfully

Automated unit tests are optional for the initial static portfolio because most initial behavior is presentational. Build verification and targeted component tests should be added when interactive behavior grows.

## 13. GitHub Pages Configuration

The user site repository is `study734/study734.github.io`.

The Vite app should use `/` as its deployment base because this is a GitHub Pages user site rather than a project site under a subpath.

Deployment will use a GitHub Actions workflow with Pages permissions and the `github-pages` environment.

## 14. Relationship to GitHub Profile

The portfolio site and Profile README have different responsibilities.

```text
GitHub Profile README
→ fastest summary
→ points to portfolio and repositories

Portfolio Website
→ visual presentation
→ project comparison
→ personal contribution summary

Project README
→ technical detail
→ setup / architecture / demo / implementation evidence

Repository history
→ code and contribution evidence
```

After the site is deployed, the Profile README should include a prominent link to `https://study734.github.io`.

## 15. Initial Scope Exclusions

Not included in the first version:
- Backend
- Database
- Login
- CMS
- Contact form
- Visitor analytics
- Blog
- Dark mode
- Multi-language support
- Complex animation system
- Project-detail routing
- GitHub API runtime integration
- Automatically generated GitHub statistics

These can be added only if they provide clear portfolio value.

## 16. Success Criteria

The initial version is complete when:

1. `https://study734.github.io` loads successfully.
2. The visitor can identify the developer focus from the first screen.
3. GearVia, GearVia ME, GearVia On-Premise, and MOIDA are visible and understandable.
4. Each project distinguishes project scope from personal contribution.
5. Representative repository links are accessible.
6. The site works on desktop and mobile.
7. The project builds and deploys automatically from `main` through GitHub Actions.
8. The GitHub Profile README links to the deployed portfolio.
