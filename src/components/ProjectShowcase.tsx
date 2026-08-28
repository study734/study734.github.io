import type { Project } from '../data/projects'
import { TechList } from './TechList'

export function ProjectShowcase({ project, index }: { project: Project; index: number }) {
  const number = String(index + 1).padStart(2, '0')

  return (
    <article className="project-showcase">
      <header className="project-heading-row">
        <span className="project-number" aria-hidden="true">{number}</span>
        <h3>{project.name}</h3>
      </header>

      <div className="project-media">
        {project.image ? (
          <img
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
          />
        ) : (
          <div className="project-media-placeholder" aria-hidden="true">
            <span>{number}</span>
            <strong>{project.name}</strong>
          </div>
        )}
      </div>

      <p className="project-subtitle">{project.subtitle}</p>

      <div className="project-meta-grid">
        <section>
          <h4>ROLE</h4>
          <ul>
            {project.role.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h4>CONTRIBUTION</h4>
          <ul>
            {project.contributions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h4>STACK</h4>
          <TechList technologies={project.technologies} />
        </section>
      </div>

      {(project.repositoryUrl || project.demoUrl) && (
        <div className="project-links">
          {project.repositoryUrl && (
            <a href={project.repositoryUrl} target="_blank" rel="noreferrer" aria-label={`${project.name} repository`}>
              Repository ↗
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noreferrer" aria-label={`${project.name} demo`}>
              Demo ↗
            </a>
          )}
        </div>
      )}
    </article>
  )
}
