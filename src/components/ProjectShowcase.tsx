import { ExternalLink, GitBranch, ShieldCheck, Sparkles, UsersRound } from 'lucide-react'
import type { Project } from '../data/projects'
import { TechList } from './TechList'

export function ProjectShowcase({ project, index }: { project: Project; index: number }) {
  const number = String(index + 1).padStart(2, '0')

  return (
    <article className="project-view">
      <header className="view-header">
        <div><p className="eyebrow">PROJECT / {number}</p><h1>{project.name}</h1><p>{project.subtitle}</p></div>
        <span className="view-index" aria-hidden="true">{number}</span>
      </header>

      <div className="project-signal-row" aria-label="Project role">
        {project.role.map((role, roleIndex) => {
          const Icon = roleIndex === 0 ? UsersRound : roleIndex === 1 ? ShieldCheck : Sparkles
          return <span key={role}><Icon aria-hidden="true" />{role}</span>
        })}
      </div>

      <div className="project-evidence">
        <section>
          <div className="section-label"><span>01</span><h2>Contribution</h2></div>
          <ul className="evidence-list">{project.contributions.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <section>
          <div className="section-label"><span>02</span><h2>Technology</h2></div>
          <TechList technologies={project.technologies} />
        </section>
      </div>

      {(project.repositoryUrl || project.demoUrl) && (
        <div className="project-links">
          {project.repositoryUrl && <a href={project.repositoryUrl} target="_blank" rel="noreferrer" aria-label={`${project.name} repository`}><GitBranch aria-hidden="true" /> Repository <ExternalLink aria-hidden="true" /></a>}
          {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer" aria-label={`${project.name} demo`}>Demo <ExternalLink aria-hidden="true" /></a>}
        </div>
      )}
    </article>
  )
}
