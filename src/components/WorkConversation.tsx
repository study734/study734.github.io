import { ExternalLink, GitPullRequest } from 'lucide-react'
import { conversationFor } from '../data/conversations'
import type { ProjectThread } from '../data/projects'
import { AskAssistant } from './ProjectShowcase'

/** 작업 기록 페이지: 문제 → 과정 → 판단 → 한계를 읽는 사례 기록. 질문은 비서에게 넘깁니다. */
export function WorkConversation({ thread, projectName, onAsk }: { thread: ProjectThread; projectName: string; onAsk: (question: string) => void }) {
  const record = conversationFor(thread)

  return (
    <article className="case-page work-record" aria-labelledby="record-title">
      <header className="case-header">
        <p className="eyebrow">{projectName} · 작업 기록</p>
        <h1 id="record-title">{thread.title}</h1>
      </header>

      <section className="conversation-summary" aria-label="프로젝트 핵심 요약">
        <dl>
          <div><dt>해결한 문제</dt><dd>{record.problem}</dd></div>
          <div><dt>내 역할</dt><dd><ul>{thread.contributions.map((item) => <li key={item}>{item}</li>)}</ul></dd></div>
          <div><dt>결과와 검증</dt><dd>{record.outcome}</dd></div>
        </dl>
        {record.source && (
          <footer>
            <a href={record.source} target="_blank" rel="noreferrer"><GitPullRequest aria-hidden="true" />변경 내용 · PR<ExternalLink aria-hidden="true" /></a>
          </footer>
        )}
      </section>

      <section className="record-timeline" aria-labelledby="record-timeline-title">
        <h2 id="record-timeline-title">작업 과정</h2>
        <ol>
          {record.exchanges.map((exchange) => (
            <li key={exchange.question}>
              <span>{exchange.stage}</span>
              <h3>{exchange.question}</h3>
              <p>{exchange.answer}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="record-notes">
        <div><h2>선택 이유</h2><p>{record.decision}</p></div>
        <div><h2>한계와 남은 과제</h2><p>{record.limitation}</p></div>
      </section>

      <AskAssistant questions={[`${projectName}에서 가장 중요한 판단은?`, `${projectName}에서 직접 맡은 부분은?`, '가장 어려웠던 문제는?']} onAsk={onAsk} />
    </article>
  )
}
