import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, test, vi } from 'vitest'
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
  test('renders the project as a case-study page, not a chat', () => {
    render(<ProjectShowcase project={sample} index={0} />)

    expect(screen.getByRole('heading', { level: 1, name: 'Sample Project' })).toBeInTheDocument()
    expect(screen.getByText('Sample product description')).toBeInTheDocument()
    expect(screen.getByText('Backend')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '핵심 기여' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '기술 구성' })).toBeInTheDocument()
    expect(screen.getByText('Implemented report workflow')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /저장소 보기/ })).toHaveAttribute('href', sample.repositoryUrl)
    expect(screen.queryByText(/어떤 문제를 해결했고/)).not.toBeInTheDocument()
  })

  test('hands follow-up questions to the assistant and links work records', () => {
    const onAsk = vi.fn()
    const onNavigate = vi.fn()
    render(<ProjectShowcase project={sample} index={2} threads={[{ title: 'Record A', answer: 'Summary A', contributions: [] }]} onAsk={onAsk} onNavigate={onNavigate} />)

    fireEvent.click(screen.getByRole('button', { name: /Sample Project에서 직접 맡은 부분은/ }))
    expect(onAsk).toHaveBeenCalledWith('Sample Project에서 직접 맡은 부분은?')
    fireEvent.click(screen.getByRole('button', { name: /Record A/ }))
    expect(onNavigate).toHaveBeenCalledWith('project-2-thread-0')
  })

  test('shows optional links only when a public destination exists', () => {
    render(<ProjectShowcase project={{ ...sample, repositoryUrl: undefined, demoUrl: 'https://example.com' }} index={1} />)

    expect(screen.queryByRole('link', { name: /저장소 보기/ })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /데모 보기/ })).toHaveAttribute('href', 'https://example.com')
  })
})
