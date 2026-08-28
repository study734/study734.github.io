import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { describe, expect, test } from 'vitest'
import App from './App'

describe('portfolio v2 app', () => {
  test('renders project-first information architecture', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: '임태욱' })).toBeInTheDocument()
    expect(screen.getByText('Java / Spring Boot Backend Developer')).toBeInTheDocument()

    expect(screen.getAllByRole('link', { name: 'Projects' })[0]).toHaveAttribute('href', '#projects')
    expect(screen.getByRole('link', { name: 'Experience' })).toHaveAttribute('href', '#experience')
    expect(screen.getByRole('link', { name: 'Stack' })).toHaveAttribute('href', '#stack')
    expect(screen.getAllByRole('link', { name: /GitHub/i })[0]).toHaveAttribute(
      'href',
      'https://github.com/study734',
    )

    for (const heading of ['Selected Projects', 'Experience', 'Core Stack', 'Contact']) {
      expect(screen.getByRole('heading', { level: 2, name: heading })).toBeInTheDocument()
    }

    const projectHeadings = screen
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent)
      .filter((text) => ['GearVia', 'GearVia On-Premise', 'GearVia ME', 'MOIDA'].includes(text ?? ''))

    expect(projectHeadings).toEqual(['GearVia', 'GearVia On-Premise', 'GearVia ME', 'MOIDA'])
    expect(screen.queryByRole('heading', { level: 2, name: 'About' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: 'Skills' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: 'Achievements' })).not.toBeInTheDocument()
  })
})
