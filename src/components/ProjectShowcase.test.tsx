import { cleanup, fireEvent, render, screen } from '@testing-library/react'
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
  test('renders project evidence as a conversation', () => {
    render(<ProjectShowcase project={sample} index={0} />)

    expect(screen.getByText(/Sample Project에서 어떤 문제를 해결했고/)).toBeInTheDocument()
    expect(screen.getByText('Sample Project').closest('p')).toHaveTextContent('Sample Project 프로젝트의 역할과 구현 근거를 정리했습니다.')
    expect(screen.getByText('Sample product description')).toBeInTheDocument()
    expect(screen.getByText('Backend')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '핵심 기여' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '기술 구성' })).toBeInTheDocument()
    expect(screen.getAllByText('Implemented report workflow')).toHaveLength(2)
    expect(screen.getByText('Java')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /저장소 보기/i })).toHaveAttribute(
      'href',
      sample.repositoryUrl,
    )
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  test('collapses and expands the work summary', () => {
    render(<ProjectShowcase project={sample} index={0} question="검증 내용을 알려줘" />)
    expect(screen.getByText('검증 내용을 알려줘')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '핵심 작업 접기' }))
    expect(screen.getAllByText('Implemented report workflow')).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: '핵심 작업 펼치기' }))
    expect(screen.getAllByText('Implemented report workflow')).toHaveLength(2)
  })

  test('shows optional links only when a public destination exists', () => {
    render(
      <ProjectShowcase
        project={{ ...sample, repositoryUrl: undefined, demoUrl: 'https://example.com' }}
        index={1}
      />,
    )

    expect(screen.queryByRole('link', { name: /저장소 보기/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /데모 보기/i })).toHaveAttribute(
      'href',
      'https://example.com',
    )
  })
})
