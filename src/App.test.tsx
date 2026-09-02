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

    fireEvent.click(screen.getByRole('button', { name: 'AI 주간 보고서는 어떻게 검증했나요?' }))
    expect(screen.getAllByText('AI 주간 보고서는 어떻게 검증했나요?')).toHaveLength(3)
    expect(screen.getByRole('heading', { level: 2, name: '이 대화의 답변 근거' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /저장소 보기/i })).toHaveAttribute('href', 'https://github.com/HO-0219/WorkTaskFlow')
    expect(screen.queryByLabelText('현재 포트폴리오 정보')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '프로젝트 질문' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: '포트폴리오 탐색' })).toHaveAttribute('placeholder', 'GearVia에 대해 더 질문해보세요')
  })

  test('uses the command composer to navigate', () => {
    render(<App />)
    const query = screen.getByRole('textbox', { name: '포트폴리오 탐색' })
    fireEvent.change(query, { target: { value: '기술 스택' } })
    fireEvent.click(screen.getByRole('button', { name: '탐색하기' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Core Stack' })).toBeInTheDocument()
  })

  test('opens the account menu and switches theme', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /임태욱 Available to build/ }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('menuitem', { name: /화이트 테마/ }))
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
  })

  test('opens the project review from the command composer', () => {
    render(<App />)
    const query = screen.getByRole('textbox', { name: '포트폴리오 탐색' })
    fireEvent.change(query, { target: { value: '/review' } })
    fireEvent.click(screen.getByRole('button', { name: '탐색하기' }))
    expect(screen.getByRole('complementary', { name: '프로젝트 리뷰', hidden: true })).toHaveClass('is-open')
    expect(screen.getByRole('tab', { name: 'Evidence' })).toBeInTheDocument()
  })

  test('turns a project query into the visible conversation question', () => {
    render(<App />)
    const query = screen.getByRole('textbox', { name: '포트폴리오 탐색' })
    fireEvent.change(query, { target: { value: 'GearVia에서 AI를 어떻게 활용했나요?' } })
    fireEvent.click(screen.getByRole('button', { name: '탐색하기' }))
    expect(screen.getByText('GearVia에서 AI를 어떻게 활용했나요?')).toBeInTheDocument()
  })

  test('opens a project conversation from the sidebar history', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'AI 주간 보고서는 어떻게 검증했나요?' }))

    expect(screen.getAllByText('AI 주간 보고서는 어떻게 검증했나요?')).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'AI 주간 보고서는 어떻게 검증했나요?' })).toHaveClass('is-active')
    expect(screen.getByText(/AI 주간 리포트의 입력 검증/)).toBeInTheDocument()
    expect(screen.getByLabelText('현재 대화')).toHaveTextContent('AI 주간 보고서는 어떻게 검증했나요?')
  })

  test('shows a distinct answer for each project conversation record', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Java RAG 브랜치에서 맡은 역할' }))

    expect(screen.getByText(/문서 수집부터 검색 응답까지의 흐름/)).toBeInTheDocument()
    expect(screen.queryByText(/AI 주간 리포트의 입력 검증/)).not.toBeInTheDocument()
  })

  test('uses project folders only to open and close their conversation records', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'GearVia' }))
    expect(screen.queryByRole('button', { name: 'AI 주간 보고서는 어떻게 검증했나요?' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /임태욱은 무엇을/ })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'GearVia' }))
    expect(screen.getByRole('button', { name: 'AI 주간 보고서는 어떻게 검증했나요?' })).toBeInTheDocument()
  })

  test('toggles the desktop project sidebar from the top bar', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '왼쪽 패널 전환' }))
    expect(document.querySelector('.workspace-layout')).toHaveClass('sidebar-collapsed')
    expect(screen.getByRole('button', { name: '왼쪽 패널 전환' })).toHaveAttribute('title', '왼쪽 패널 열기')
  })
})
