import { useEffect, useRef } from 'react'
import { ExternalLink, GitPullRequest } from 'lucide-react'
import { conversationFor, type Exchange } from '../data/conversations'
import type { ProjectThread } from '../data/projects'

export function WorkConversation({ thread, replies, pending, onAsk, onOpenReview }: {
  thread: ProjectThread
  replies: Exchange[]
  pending: Exchange | null
  onAsk: (exchange: Exchange) => void
  onOpenReview: () => void
}) {
  const record = conversationFor(thread)
  const latest = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (pending || replies.length) latest.current?.scrollIntoView?.({ block: 'start', behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [replies.length, pending])

  return <article className="project-thread work-conversation" aria-label="작업 대화 기록">
    <section className="conversation-summary" aria-label="프로젝트 핵심 요약">
      <p className="eyebrow">PROJECT BRIEF</p>
      <h1>{thread.title}</h1>
      <dl>
        <div><dt>해결한 문제</dt><dd>{record.problem}</dd></div>
        <div><dt>내 역할</dt><dd><ul>{thread.contributions.map(item => <li key={item}>{item}</li>)}</ul></dd></div>
        <div><dt>결과와 검증</dt><dd>{record.outcome}</dd></div>
      </dl>
      <footer>
        {record.source && <a href={record.source} target="_blank" rel="noreferrer"><GitPullRequest aria-hidden="true" />변경 내용 · PR<ExternalLink aria-hidden="true" /></a>}
        <button type="button" onClick={onOpenReview}>프로젝트 자료 보기</button>
      </footer>
    </section>
    <h2 className="conversation-story-title">질문으로 읽는 문제 해결 과정</h2>
    <p className="conversation-note">궁금한 질문을 선택하면 준비된 작업 기록을 보여드립니다. 실제 AI 작업 로그나 실시간 AI 응답이 아닙니다.</p>
    <div aria-live="polite" aria-relevant="additions" aria-label="추가 질문과 답변">
      {replies.map((reply, index) => <div className="conversation-exchange" key={index} ref={!pending && index === replies.length - 1 ? latest : undefined}>
        <div className="thread-question"><p>{reply.question}</p></div>
        <div className="thread-answer revealed-answer"><p>{reply.answer}</p></div>
      </div>)}
    </div>
    {pending && <div className="conversation-exchange" ref={latest}>
      <div className="thread-question"><p>{pending.question}</p></div>
      <div className="conversation-thinking" role="status"><span className="thinking-orb" aria-hidden="true" /><span className="thinking-label">기록을 정리하는 중</span></div>
    </div>}
    <section className="conversation-questions" aria-label="작업 과정 질문">
      <h3>{replies.length ? '다음으로 궁금한 내용' : '어떤 과정이 궁금한가요?'}</h3>
      {record.exchanges.map(exchange => {
        const answered = replies.some(reply => reply.question === exchange.question)
        return <button type="button" key={exchange.question} disabled={!!pending || answered} onClick={() => onAsk(exchange)}>
          <span>{exchange.stage}</span><strong>{exchange.question}</strong><small>{answered ? '확인함' : '↗'}</small>
        </button>
      })}
    </section>
  </article>
}
