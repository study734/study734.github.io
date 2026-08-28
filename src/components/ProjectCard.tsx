import type { Project } from '../data/projects'
import { TechTags } from './TechTags'

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="project-card">
      <div className="project-visual" aria-hidden={!project.image}>
        {project.image ? (
          <img src={project.image} alt={`${project.name} 대표 화면`} />
        ) : (
          <div className="project-placeholder">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{project.name}</strong>
          </div>
        )}
      </div>

      <div className="project-content">
        <div className="project-title-row">
          <div>
            <p className="eyebrow">Featured Project</p>
            <h3>{project.name}</h3>
          </div>
          <span className="project-index">0{index + 1}</span>
        </div>

        <p className="project-subtitle">{project.subtitle}</p>
        <p className="project-description">{project.description}</p>

        <div className="project-detail-grid">
          <div>
            <h4>Key Features</h4>
            <ul>
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>My Contribution</h4>
            <ul>
              {project.contributions.map((contribution) => (
                <li key={contribution}>{contribution}</li>
              ))}
            </ul>
          </div>
        </div>

        <TechTags technologies={project.technologies} />

        {project.repositoryUrl ? (
          <a className="text-link" href={project.repositoryUrl} target="_blank" rel="noreferrer">
            View Repository <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <p className="private-note">Source repository is private.</p>
        )}
      </div>
    </article>
  )
}
