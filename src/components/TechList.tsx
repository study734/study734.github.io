export function TechList({ technologies }: { technologies: string[] }) {
  return (
    <ul className="tech-list" aria-label="Technologies">
      {technologies.map((technology) => (
        <li key={technology}>{technology}</li>
      ))}
    </ul>
  )
}
