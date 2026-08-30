import { Badge } from '@/components/ui/badge'

export function TechList({ technologies }: { technologies: string[] }) {
  return (
    <ul className="tech-list" aria-label="Technologies">
      {technologies.map((technology) => (
        <li key={technology}>
          <Badge variant="outline">{technology}</Badge>
        </li>
      ))}
    </ul>
  )
}
