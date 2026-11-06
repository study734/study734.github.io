import { CheckCircle2, ChevronRight, CornerDownRight, ExternalLink, FileText, GitBranch, GitCompareArrows, ShieldCheck, Sparkles, UsersRound } from 'lucide-react'
import type { Project, ProjectThread } from '../data/projects'
import type { WorkspaceView } from './Sidebar'
import { TechList } from './TechList'

interface ProjectShowcaseProps {
  project: Project
  index: number
  threads?: ProjectThread[]
  onNavigate?: (view: WorkspaceView) => void
  onAsk?: (question: string) => void
}

/** 프로젝트 사례 페이지. 대화는 비서 하나로 모으고, 여기서는 기록을 읽기 좋게 보여줍니다. */
export function ProjectShowcase({ project, index, threads = [], onNavigate, onAsk }: ProjectShowcaseProps) {
  const number = String(index + 1).padStart(2, '0')
  const askable = [
    `${project.name}에서 직접 맡은 부분은?`,
    project.decisions?.length ? `${project.name}에서 가장 중요한 판단은?` : `${project.name}에서 어떤 기술을 썼나요?`,
    `${project.name}의 한계는 무엇인가요?`,
  ]

  return (
    <article className="case-page" aria-labelledby="case-title">
      <header className="case-header">
        <p className="eyebrow">PROJECT {number}{project.featured ? ' · 대표 프로젝트' : ''}</p>
        <h1 id="case-title">{project.name}</h1>
        <p className="case-subtitle">{project.subtitle}</p>
        {project.context && (
          <p className="thread-context" aria-label="프로젝트 개요">
            {project.context.period && <span>{project.context.period}</span>}
            <span>{project.context.team}</span>
            <span>{project.context.position}</span>
          </p>
        )}
        <div className="thread-role-list" aria-label="프로젝트 역할">
          {project.role.map((role, roleIndex) => {
            const Icon = roleIndex === 0 ? UsersRound : roleIndex === 1 ? ShieldCheck : Sparkles
            return <span key={role}><Icon aria-hidden="true" />{role}</span>
          })}
        </div>
        {(project.repositoryUrl || project.demoUrl) && (
          <div className="case-links">
            {project.repositoryUrl && <a href={project.repositoryUrl} target="_blank" rel="noreferrer"><GitBranch aria-hidden="true" />저장소 보기<ExternalLink aria-hidden="true" /></a>}
            {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer">데모 보기<ExternalLink aria-hidden="true" /></a>}
          </div>
        )}
      </header>

      <div className="thread-answer">
        {project.problem && (
          <section className="thread-section">
            <h2>해결하려던 문제</h2>
            <p className="thread-problem">{project.problem}</p>
          </section>
        )}

        <section className="thread-section">
          <h2>핵심 기여</h2>
          <ul className="thread-bullets">{project.contributions.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>

        {project.decisions && project.decisions.length > 0 && (
          <section className="thread-section thread-decisions">
            <h2>기술적 판단</h2>
            {project.decisions.map((decision) => (
              <article key={decision.title} className="decision-card">
                <header><GitCompareArrows aria-hidden="true" /><strong>{decision.title}</strong></header>
                <p className="decision-situation">{decision.situation}</p>
                <dl>
                  <dt>검토</dt>
                  <dd><ul>{decision.options.map((option) => <li key={option}>{option}</li>)}</ul></dd>
                  <dt>선택</dt>
                  <dd>{decision.choice}</dd>
                  <dt>이유</dt>
                  <dd>{decision.reason}</dd>
                </dl>
              </article>
            ))}
          </section>
        )}

        {threads.length > 0 && onNavigate && (
          <section className="thread-section">
            <h2>작업 기록</h2>
            <div className="case-records">
              {threads.map((thread, threadIndex) => (
                <button type="button" key={thread.title} onClick={() => onNavigate(`project-${index}-thread-${threadIndex}` as WorkspaceView)}>
                  <FileText aria-hidden="true" />
                  <span><strong>{thread.title}</strong><small>{thread.answer}</small></span>
                  <ChevronRight aria-hidden="true" />
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="thread-section">
          <h2>기술 구성</h2>
          <TechList technologies={project.technologies} />
        </section>

        {project.evidence && project.evidence.length > 0 && (
          <section className="thread-section thread-evidence">
            <h2>확인할 수 있는 근거</h2>
            <ul>
              {project.evidence.map((item) => {
                const body = (
                  <>
                    <CheckCircle2 aria-hidden="true" />
                    <span><strong>{item.label}</strong><small>{item.description}</small></span>
                    {item.url && <ExternalLink aria-hidden="true" />}
                  </>
                )
                return (
                  <li key={item.label}>
                    {item.url
                      ? <a href={item.url} target="_blank" rel="noreferrer">{body}</a>
                      : <span className="evidence-static">{body}</span>}
                  </li>
                )
              })}
            </ul>
          </section>
        )}
      </div>

      {onAsk && <AskAssistant questions={askable} onAsk={onAsk} />}
    </article>
  )
}

export function AskAssistant({ questions, onAsk }: { questions: string[]; onAsk: (question: string) => void }) {
  return (
    <section className="case-ask" aria-label="비서에게 물어보기">
      <div className="agent-reply-header"><span className="agent-avatar" aria-hidden="true">TW</span><strong>비서에게 더 물어보기</strong></div>
      <div className="agent-suggestions">
        {questions.map((question) => <button type="button" key={question} onClick={() => onAsk(question)}><CornerDownRight aria-hidden="true" />{question}</button>)}
      </div>
    </section>
  )
}
