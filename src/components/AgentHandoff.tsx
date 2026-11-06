import { useId, useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'
import { profile } from '../data/profile'

/**
 * 비서가 답하지 못한 질문이나 남기고 싶은 말을 태욱 님께 전달합니다.
 * 서버 없이 동작하도록, 내용을 정리한 메일 작성 창을 엽니다.
 */
export function AgentHandoff({ question, transcript }: { question: string; transcript: string[] }) {
  const id = useId()
  const [message, setMessage] = useState(question)
  const [sender, setSender] = useState('')
  const [replyTo, setReplyTo] = useState('')
  const [opened, setOpened] = useState(false)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!message.trim()) return
    const recent = transcript.filter((item) => item && item !== message.trim()).slice(-5)
    const body = [
      message.trim(),
      '',
      '---',
      sender.trim() && `보낸 분: ${sender.trim()}`,
      replyTo.trim() && `회신 연락처: ${replyTo.trim()}`,
      recent.length > 0 && `포트폴리오 비서와 나눈 질문: ${recent.join(' / ')}`,
      '(포트폴리오 비서를 통해 작성된 메일입니다)',
    ].filter(Boolean).join('\n')
    const subject = `[포트폴리오 문의] ${message.trim().slice(0, 40)}`
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setOpened(true)
  }

  return (
    <form className="agent-handoff" onSubmit={submit} aria-label="태욱 님께 전달하기">
      <strong>태욱 님께 전달하기</strong>
      <label htmlFor={`${id}-message`}>전달할 내용</label>
      <textarea id={`${id}-message`} value={message} onChange={(event) => setMessage(event.target.value)} rows={3} placeholder="궁금한 점이나 남기실 말씀을 적어 주세요" maxLength={1000} />
      <div className="agent-handoff-row">
        <span>
          <label htmlFor={`${id}-sender`}>성함 · 소속 (선택)</label>
          <input id={`${id}-sender`} value={sender} onChange={(event) => setSender(event.target.value)} placeholder="예: 홍길동 · OO회사 채용팀" maxLength={80} />
        </span>
        <span>
          <label htmlFor={`${id}-reply`}>회신 받을 연락처 (선택)</label>
          <input id={`${id}-reply`} value={replyTo} onChange={(event) => setReplyTo(event.target.value)} placeholder="이메일 또는 전화번호" maxLength={80} />
        </span>
      </div>
      <footer>
        <small>{opened ? '메일 앱을 열었어요. 내용을 확인하고 보내 주세요.' : `보내기를 누르면 ${profile.email} 앞으로 정리된 메일 창이 열려요.`}</small>
        <button type="submit" disabled={!message.trim()}><Send aria-hidden="true" />메일로 보내기</button>
      </footer>
    </form>
  )
}
