import { SectionHeading } from '../components/SectionHeading'

const skillGroups = [
  ['Backend', ['Java', 'Spring Boot', 'Spring Security', 'Spring Data JPA', 'QueryDSL']],
  ['Frontend', ['React', 'TypeScript', 'Vite']],
  ['Database', ['MySQL']],
  ['AI', ['OpenAI API', 'RAG', 'Tool Calling', 'FastAPI']],
  ['Infra / DevOps', ['Docker', 'Docker Compose', 'Nginx', 'GitHub Actions', 'GHCR', 'AWS']],
  ['Web / Security', ['OAuth2', 'JWT', 'WebSocket', 'Web Push', 'PWA', 'TLS / PKI']],
] as const

export function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <SectionHeading eyebrow="Toolkit" title="Skills" description="기술을 역할별로 묶어 실제 사용 맥락이 보이도록 정리했습니다." />
      <div className="skills-grid">
        {skillGroups.map(([group, skills]) => (
          <article className="skill-group" key={group}>
            <h3>{group}</h3>
            <p>{skills.join(' · ')}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
