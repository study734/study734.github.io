import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, test, vi } from 'vitest'
import App from './App'

afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); window.history.replaceState(null, '', '/') })

/** agent는 단계마다 타이머를 새로 걸어서, 매 단계 React 반영을 기다리며 진행시킵니다 */
const finishAgent = () => { for (let i = 0; i < 30; i++) act(() => { vi.advanceTimersByTime(500) }) }

describe('workspace portfolio app', () => {

  test('renders the assistant home and opens a project case page from the sidebar', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /비서예요/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ask Agent' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/study734')
    expect(screen.queryByRole('button', { name: /GearVia ME/ })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'AI 주간 보고서는 어떻게 검증했나요?' }))
    expect(screen.getByRole('heading', { level: 1, name: 'AI 주간 보고서는 어떻게 검증했나요?' })).toBeInTheDocument()
    const brief = screen.getByRole('region', { name: '프로젝트 핵심 요약' })
    expect(within(brief).getByRole('link', { name: '변경 내용 · PR' })).toHaveAttribute('href', 'https://github.com/HO-0219/WorkTaskFlow/pull/2')
    expect(screen.getByRole('heading', { name: '작업 과정' })).toBeInTheDocument()
    expect(screen.getByText(/구조화 출력 계약을 정의/)).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  test('questions asked on a project page go to the assistant with that project in focus', () => {
    vi.useFakeTimers()
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Java RAG 브랜치에서 맡은 역할' }))
    fireEvent.change(screen.getByRole('textbox', { name: '포트폴리오 탐색' }), { target: { value: '다른 팀 자료는 어떻게 막았나요?' } })
    fireEvent.click(screen.getByRole('button', { name: '탐색하기' }))
    finishAgent()
    expect(screen.getByText('다른 팀 자료는 어떻게 막았나요?')).toBeInTheDocument()
    expect(screen.getByText(/GearVia 기록에서 찾아봤어요/)).toBeInTheDocument()
    expect(window.location.hash).toBe('#/')
  })

  test('lists every project when asked and opens one from its card', () => {
    vi.useFakeTimers()
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /그냥 둘러보러 왔어요/ }))
    finishAgent()
    const list = screen.getByLabelText('프로젝트 목록')
    expect(within(list).getAllByRole('button')).toHaveLength(3)
    fireEvent.click(within(list).getByRole('button', { name: /GearVia On-Premise/ }))
    expect(screen.getByRole('heading', { level: 1, name: 'GearVia On-Premise' })).toBeInTheDocument()
    expect(window.location.hash).toBe('#/project-1')
  })

  test('copies the email address for visitors without a mail app', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } })
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '연락처' }))
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: '이메일 주소 복사' })) })
    expect(writeText).toHaveBeenCalledWith('zes1357@kakao.com')
    expect(screen.getByRole('button', { name: '복사했어요' })).toBeInTheDocument()
  })

  test('uses slash commands in the composer to navigate', () => {
    render(<App />)
    const query = screen.getByRole('textbox', { name: '포트폴리오 탐색' })
    fireEvent.change(query, { target: { value: '/기술 스택' } })
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

  test('turns a project query into the visible conversation question', () => {
    render(<App />)
    const query = screen.getByRole('textbox', { name: '포트폴리오 탐색' })
    fireEvent.change(query, { target: { value: 'GearVia에서 AI를 어떻게 활용했나요?' } })
    fireEvent.click(screen.getByRole('button', { name: '탐색하기' }))
    expect(screen.getByText('GearVia에서 AI를 어떻게 활용했나요?')).toBeInTheDocument()
  })

  test('uses project folders only to open and close their conversation records', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'GearVia' }))
    expect(screen.queryByRole('button', { name: 'AI 주간 보고서는 어떻게 검증했나요?' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /비서예요/ })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'GearVia' }))
    expect(screen.getByRole('button', { name: 'AI 주간 보고서는 어떻게 검증했나요?' })).toBeInTheDocument()
  })

  test('toggles the desktop project sidebar from the top bar', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '왼쪽 패널 전환' }))
    expect(document.querySelector('.workspace-layout')).toHaveClass('sidebar-collapsed')
    expect(screen.getByRole('button', { name: '왼쪽 패널 전환' })).toHaveAttribute('title', '왼쪽 패널 열기')
  })

  test('opens the view named in the URL so sections can be shared as links', () => {
    window.history.replaceState(null, '', '/#/stack')
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'Core Stack' })).toBeInTheDocument()
  })

  test('follows browser back navigation between views', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Experience' }))
    expect(window.location.hash).toBe('#/experience')
    act(() => {
      window.history.replaceState(null, '', '/#/')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(screen.getByRole('heading', { level: 1, name: /비서예요/ })).toBeInTheDocument()
  })

  test('opens the contact view from the top bar', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '연락처' }))
    expect(screen.getByRole('link', { name: /EMAIL/ })).toHaveAttribute('href', expect.stringMatching(/^mailto:/))
  })

  test('agent shows its work, then a grounded answer with sources and followups', () => {
    vi.useFakeTimers()
    render(<App />)
    const query = screen.getByRole('textbox', { name: '포트폴리오 탐색' })
    fireEvent.change(query, { target: { value: '벡터 DB 없이 시작한 이유는?' } })
    fireEvent.click(screen.getByRole('button', { name: '탐색하기' }))

    expect(screen.getByText('벡터 DB 없이 시작한 이유는?')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('질문 이해')
    expect(screen.getByRole('button', { name: '탐색하기' })).toBeDisabled()
    finishAgent()

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByText('벡터 DB 없이 MySQL BLOB + 메모리 코사인 탐색으로 시작')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /3단계 작업/ }))
    expect(screen.getByLabelText('agent 작업 단계')).toHaveTextContent(/기록 \d+개 중 \d건 일치/)
    const sources = screen.getByLabelText('답변 근거')
    fireEvent.click(within(sources).getAllByRole('button')[0])
    expect(window.location.hash).toMatch(/^#\/project-0/)
  })

  test('assistant offers to pass along questions it has no record for', () => {
    vi.useFakeTimers()
    render(<App />)
    fireEvent.change(screen.getByRole('textbox', { name: '포트폴리오 탐색' }), { target: { value: '좋아하는 음식은?' } })
    fireEvent.click(screen.getByRole('button', { name: '탐색하기' }))
    finishAgent()
    expect(screen.getByText(/제가 가진 기록에 없어서/)).toBeInTheDocument()
    expect(screen.queryByLabelText('답변 근거')).not.toBeInTheDocument()
    const handoff = screen.getByRole('form', { name: '태욱 님께 전달하기' })
    expect(within(handoff).getByLabelText('전달할 내용')).toHaveValue('좋아하는 음식은?')
  })

  test('agent conversation survives visiting another view', () => {
    vi.useFakeTimers()
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /왜 뽑아야 하나요/ }))
    finishAgent()
    fireEvent.click(screen.getByRole('button', { name: 'Experience' }))
    fireEvent.click(screen.getByRole('button', { name: 'Ask Agent' }))
    expect(screen.getByText('왜 뽑아야 하나요?')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  test('assistant greets visitors and tailors the briefing to a recruiter', () => {
    vi.useFakeTimers()
    render(<App />)
    expect(screen.getByRole('heading', { name: '어떤 일로 오셨어요?' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /채용 담당자예요/ }))
    expect(screen.getByText('채용 검토 중이에요. 핵심만 알려주세요.')).toBeInTheDocument()
    finishAgent()
    expect(screen.getByText(/30초 분량으로 정리해 드릴게요/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /EMAIL/ })).toHaveAttribute('href', expect.stringMatching(/^mailto:/))
    expect(within(screen.getByLabelText('이어서 물어보기')).getByRole('button', { name: /왜 뽑아야 하나요/ })).toBeInTheDocument()
  })

  test('hand-off opens a prepared email with the visitor question', () => {
    vi.useFakeTimers()
    const location = { href: '' }
    vi.stubGlobal('location', { ...window.location, set href(value: string) { location.href = value }, get href() { return location.href } })
    render(<App />)
    fireEvent.change(screen.getByRole('textbox', { name: '포트폴리오 탐색' }), { target: { value: '연봉 기대치가 어떻게 되나요?' } })
    fireEvent.click(screen.getByRole('button', { name: '탐색하기' }))
    finishAgent()
    const handoff = screen.getByRole('form', { name: '태욱 님께 전달하기' })
    fireEvent.change(within(handoff).getByLabelText('회신 받을 연락처 (선택)'), { target: { value: 'hr@example.com' } })
    fireEvent.click(within(handoff).getByRole('button', { name: '메일로 보내기' }))
    expect(location.href).toMatch(/^mailto:/)
    const body = decodeURIComponent(location.href.split('body=')[1])
    expect(body).toContain('연봉 기대치가 어떻게 되나요?')
    expect(body).toContain('회신 연락처: hr@example.com')
  })

})
