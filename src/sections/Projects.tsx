import { ProjectCard } from '../components/ProjectCard'
import { SectionHeading } from '../components/SectionHeading'
import { projects } from '../data/projects'

export function Projects() {
  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <SectionHeading
        eyebrow="Selected Work"
        title="Featured Projects"
        description="프로젝트 자체의 기능과 제가 맡은 기여를 분리해 정리했습니다."
      />
      <div className="project-grid">
        {projects.map((project, index) => (
          <ProjectCard key={project.name} project={project} index={index} />
        ))}
      </div>
    </section>
  )
}
