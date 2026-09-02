import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, test } from 'vitest'
import { Header } from './Header'

afterEach(() => cleanup())

describe('Header', () => {
  test('exposes the workspace controls', () => {
    let opened = false
    render(<Header onOpenSidebar={() => { opened = true }} />)

    fireEvent.click(screen.getByRole('button', { name: '메뉴 열기' }))
    expect(opened).toBe(true)
    expect(screen.getByRole('link', { name: '포트폴리오 검색' })).toHaveAttribute('href', '#portfolio-query')
  })
})
