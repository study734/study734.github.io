export function TechTags({ technologies }: { technologies: string[] }) {
  return (
    <ul className="tech-tags" aria-label="Technologies">
      {technologies.map((technology) => (
        <li key={technology}>{technology}</li>
      ))}
    </ul>
  )
}
