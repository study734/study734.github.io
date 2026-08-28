import { cleanup, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, test } from 'vitest'
import { ProjectCard } from './ProjectCard'
import type { Project } from '../data/projects'

afterEach(() => {
  cleanup()
})

const sample: Project = {
  name: 'Sample Project',
  subtitle: 'Sample subtitle',
  description: 'Product description',
  highlights: ['Feature A'],
  contributions: ['Contribution A'],
  technologies: ['Java'],
  repositoryUrl: 'https://github.com/study734/sample',
}

describe('ProjectCard', () => {
  test('separates product information from personal contribution', () => {
    render(<ProjectCard project={sample} index={0} />)

    expect(screen.getByRole('heading', { name: 'Sample Project' })).toBeInTheDocument()
    expect(screen.getByText('Product description')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'My Contribution' })).toBeInTheDocument()
    expect(screen.getByText('Contribution A')).toBeInTheDocument()
    expect(screen.getByText('Java')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /View Repository/i })).toHaveAttribute(
      'href',
      sample.repositoryUrl,
    )
  })

  test('does not expose a repository link when a project has no public URL', () => {
    render(<ProjectCard project={{ ...sample, repositoryUrl: undefined }} index={0} />)
    expect(screen.queryByRole('link', { name: /View Repository/i })).not.toBeInTheDocument()
    expect(screen.getByText('Source repository is private.')).toBeInTheDocument()
  })
})
