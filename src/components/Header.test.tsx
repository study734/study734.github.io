import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, test } from 'vitest'
import { Header } from './Header'

afterEach(() => cleanup())

describe('Header', () => {
  test('exposes the workspace controls', () => {
    let opened = false
    render(<Header onToggleSidebar={() => { opened = true }} isSidebarCollapsed={false} theme="dark" onToggleTheme={() => {}} isReviewOpen={false} onToggleReview={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: '왼쪽 패널 전환' }))
    expect(opened).toBe(true)
    expect(screen.getByRole('link', { name: '포트폴리오 검색' })).toHaveAttribute('href', '#portfolio-query')
    expect(screen.getByRole('button', { name: '화이트 테마로 전환' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '리뷰 패널 열기' })).toBeInTheDocument()
  })
})
