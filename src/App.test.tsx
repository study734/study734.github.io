import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, test } from 'vitest'
import App from './App'

afterEach(() => cleanup())

describe('workspace portfolio app', () => {
  test('renders the overview and opens project evidence', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: /임태욱은 무엇을/ })).toBeInTheDocument()
    expect(screen.getByText(/Backend, Security, AI/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Overview' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/study734')

    fireEvent.click(screen.getByRole('button', { name: /GearVia 부팀장/ }))
    expect(screen.getByRole('heading', { level: 1, name: 'GearVia' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Contribution' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /GearVia repository/i })).toHaveAttribute('href', 'https://github.com/HO-0219/WorkTaskFlow')
  })

  test('uses the command composer to navigate', () => {
    render(<App />)
    const query = screen.getByRole('textbox', { name: '포트폴리오 탐색' })
    fireEvent.change(query, { target: { value: '기술 스택' } })
    fireEvent.click(screen.getByRole('button', { name: '탐색하기' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Core Stack' })).toBeInTheDocument()
  })
})
