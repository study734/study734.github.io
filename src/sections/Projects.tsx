import { ProjectShowcase } from '../components/ProjectShowcase'
import { projects } from '../data/projects'

export function Projects() {
  return (
    <section className="projects-section" id="projects" aria-labelledby="projects-title">
      <div className="section-title-row">
        <span>02</span>
        <h2 id="projects-title">Selected Projects</h2>
      </div>
      <div className="project-list">
        {projects.map((project, index) => (
          <ProjectShowcase key={project.name} project={project} index={index} />
        ))}
      </div>
    </section>
  )
}
