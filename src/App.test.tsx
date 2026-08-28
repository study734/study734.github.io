import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { describe, expect, test } from 'vitest'
import App from './App'

describe('portfolio app', () => {
  test('renders primary identity, navigation and sections', () => {
    const { container } = render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: /임태욱/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#projects')
    expect(screen.getAllByRole('link', { name: 'GitHub' })[0]).toHaveAttribute(
      'href',
      'https://github.com/study734',
    )

    for (const heading of ['About', 'Featured Projects', 'Skills', 'Achievements', 'Contact']) {
      expect(screen.getByRole('heading', { level: 2, name: heading })).toBeInTheDocument()
    }

    expect(container.querySelector('.page-shell')).toBeInTheDocument()
    expect(container.querySelector('.project-grid')).toBeInTheDocument()
  })
})
