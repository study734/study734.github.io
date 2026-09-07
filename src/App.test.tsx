import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, test, vi } from 'vitest'
import App from './App'

afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals() })

const finishAnswer = () => act(() => { vi.advanceTimersByTime(1000) })

describe('workspace portfolio app', () => {
  test('renders the overview and opens project evidence', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: /임태욱은 무엇을/ })).toBeInTheDocument()
    expect(screen.getByText(/Backend, Security, AI/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Overview' })).toBeInTheDocument()
    expect(screen.queryByLabelText('현재 대화')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/study734')

    fireEvent.click(screen.getByRole('button', { name: 'AI 주간 보고서는 어떻게 검증했나요?' }))
    expect(screen.getByLabelText('현재 대화')).toHaveTextContent('AI 주간 보고서는 어떻게 검증했나요?')
    expect(screen.getByRole('region', { name: '프로젝트 핵심 요약' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '변경 내용 · PR' })).toHaveAttribute('href', 'https://github.com/HO-0219/WorkTaskFlow/pull/2')
    expect(screen.queryByLabelText('현재 포트폴리오 정보')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '프로젝트 질문' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: '포트폴리오 탐색' })).toHaveAttribute('placeholder', '선택 이유·한계·담당 역할을 물어보세요')
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
    vi.useFakeTimers()
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'AI 주간 보고서는 어떻게 검증했나요?' }))

    expect(screen.getByText('AI가 만든 결과를 그대로 보여줘도 괜찮을까?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'AI 주간 보고서는 어떻게 검증했나요?' })).toHaveClass('is-active')
    expect(screen.queryByText(/구조화 출력 계약을 정의/)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /AI가 만든 결과를 그대로/ }))
    expect(screen.getByRole('status')).toHaveTextContent('기록을 정리하는 중')
    expect(screen.queryByText(/구조화 출력 계약을 정의/)).not.toBeInTheDocument()
    finishAnswer()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByText(/구조화 출력 계약을 정의/)).toBeInTheDocument()
    expect(screen.getByLabelText('현재 대화')).toHaveTextContent('AI 주간 보고서는 어떻게 검증했나요?')
  })

  test('shows a distinct answer for each project conversation record', () => {
    vi.useFakeTimers()
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Java RAG 브랜치에서 맡은 역할' }))

    fireEvent.click(screen.getByRole('button', { name: /다른 팀 자료가 검색되면/ }))
    finishAnswer()
    expect(screen.getByText(/서버의 인증된 현재 그룹으로 제한/)).toBeInTheDocument()
    expect(screen.queryByText(/구조화 출력 계약을 정의/)).not.toBeInTheDocument()
  })

  test('presents evidence and personal scope before the reconstructed conversation', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Java RAG 브랜치에서 맡은 역할' }))
    const brief = screen.getByRole('region', { name: '프로젝트 핵심 요약' })
    expect(within(brief).getByText('해결한 문제')).toBeInTheDocument()
    expect(within(brief).getByText('내 역할')).toBeInTheDocument()
    expect(within(brief).getByText('결과와 검증')).toBeInTheDocument()
    expect(within(brief).getByRole('link', { name: '변경 내용 · PR' })).toHaveAttribute('href', 'https://github.com/HO-0219/WorkTaskFlow/pull/5')
    const story = screen.getByRole('heading', { name: '질문으로 읽는 문제 해결 과정' })
    expect(brief.compareDocumentPosition(story) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.getByText(/실제 AI 작업 로그나 실시간 AI 응답이 아닙니다/)).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', '선택 이유·한계·담당 역할을 물어보세요')
  })

  test('appends followups in the current session and preserves them across navigation', () => {
    vi.useFakeTimers()
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Java RAG 브랜치에서 맡은 역할' }))
    fireEvent.click(screen.getByRole('button', { name: '직접 맡은 부분은요?' }))
    expect(screen.getByRole('button', { name: '직접 맡은 부분은요?' })).toBeDisabled()
    finishAnswer()
    const replies = () => within(screen.getByLabelText('추가 질문과 답변'))
    expect(replies().getByText('직접 맡은 부분은요?')).toBeInTheDocument()
    expect(screen.getByLabelText('현재 대화')).toHaveTextContent('Java RAG 브랜치에서 맡은 역할')
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '관련 없는 질문입니다' } })
    fireEvent.click(screen.getByRole('button', { name: '탐색하기' }))
    finishAnswer()
    expect(replies().getByText(/아직 작업 기록에 정리되어 있지/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'AI 주간 보고서는 어떻게 검증했나요?' }))
    expect(replies().queryByText('직접 맡은 부분은요?')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Java RAG 브랜치에서 맡은 역할' }))
    expect(replies().getByText('직접 맡은 부분은요?')).toBeInTheDocument()
    expect(replies().getByText('관련 없는 질문입니다')).toBeInTheDocument()
  })

  test('uses project folders only to open and close their conversation records', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'GearVia' }))
    expect(screen.queryByRole('button', { name: 'AI 주간 보고서는 어떻게 검증했나요?' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /임태욱은 무엇을/ })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'GearVia' }))
    expect(screen.getByRole('button', { name: 'AI 주간 보고서는 어떻게 검증했나요?' })).toBeInTheDocument()
  })

  test('cancels preparation when leaving a session without leaking or duplicating replies', () => {
    vi.useFakeTimers()
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Java RAG 브랜치에서 맡은 역할' }))
    const question = screen.getByRole('button', { name: /다른 팀 자료가 검색되면/ })
    fireEvent.click(question)
    fireEvent.click(question)
    expect(screen.getAllByRole('status')).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: 'AI 주간 보고서는 어떻게 검증했나요?' }))
    finishAnswer()
    expect(screen.getByLabelText('추가 질문과 답변')).toBeEmptyDOMElement()
    fireEvent.click(screen.getByRole('button', { name: 'Java RAG 브랜치에서 맡은 역할' }))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByLabelText('추가 질문과 답변')).toBeEmptyDOMElement()
    fireEvent.click(screen.getByRole('button', { name: /다른 팀 자료가 검색되면/ }))
    finishAnswer()
    expect(within(screen.getByLabelText('추가 질문과 답변')).getAllByText(/서버의 인증된 현재 그룹으로 제한/)).toHaveLength(1)
  })

  test('skips the preparation delay for reduced motion', () => {
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', vi.fn((query: string) => ({ matches: query === '(prefers-reduced-motion: reduce)' })))
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Java RAG 브랜치에서 맡은 역할' }))
    fireEvent.click(screen.getByRole('button', { name: /다른 팀 자료가 검색되면/ }))
    act(() => { vi.advanceTimersByTime(0) })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByText(/서버의 인증된 현재 그룹으로 제한/)).toBeInTheDocument()
  })

  test('toggles the desktop project sidebar from the top bar', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '왼쪽 패널 전환' }))
    expect(document.querySelector('.workspace-layout')).toHaveClass('sidebar-collapsed')
    expect(screen.getByRole('button', { name: '왼쪽 패널 전환' })).toHaveAttribute('title', '왼쪽 패널 열기')
  })
})
