import { cleanup, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, test } from 'vitest'
import { ProjectShowcase } from './ProjectShowcase'
import type { Project } from '../data/projects'

afterEach(() => cleanup())

const sample: Project = {
  name: 'Sample Project',
  subtitle: 'Sample product description',
  role: ['Backend'],
  contributions: ['Implemented report workflow'],
  technologies: ['Java', 'Spring Boot'],
  repositoryUrl: 'https://github.com/study734/sample',
}

describe('ProjectShowcase', () => {
  test('renders evidence in project-first order', () => {
    render(<ProjectShowcase project={sample} index={0} />)

    expect(screen.getAllByText('01').length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: 'Sample Project' })).toBeInTheDocument()
    expect(screen.getByText('Sample product description')).toBeInTheDocument()
    expect(screen.getByText('ROLE')).toBeInTheDocument()
    expect(screen.getByText('CONTRIBUTION')).toBeInTheDocument()
    expect(screen.getByText('STACK')).toBeInTheDocument()
    expect(screen.getByText('Implemented report workflow')).toBeInTheDocument()
    expect(screen.getByText('Java')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Sample Project repository/i })).toHaveAttribute(
      'href',
      sample.repositoryUrl,
    )
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  test('shows optional links only when a public destination exists', () => {
    render(
      <ProjectShowcase
        project={{ ...sample, repositoryUrl: undefined, demoUrl: 'https://example.com' }}
        index={1}
      />,
    )

    expect(screen.queryByRole('link', { name: /repository/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Sample Project demo/i })).toHaveAttribute(
      'href',
      'https://example.com',
    )
  })
})
