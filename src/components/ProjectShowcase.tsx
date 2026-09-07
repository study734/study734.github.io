import { useState } from 'react'
import { CheckCircle2, ChevronDown, ChevronRight, Code2, ExternalLink, FileText, GitBranch, GitCompareArrows, ShieldCheck, Sparkles, UsersRound } from 'lucide-react'
import type { Project, ProjectThread } from '../data/projects'
import { TechList } from './TechList'

interface ProjectShowcaseProps {
  project: Project
  index: number
  question?: string
  thread?: ProjectThread | null
  onOpenReview?: () => void
}

export function ProjectShowcase({ project, index, question, thread, onOpenReview }: ProjectShowcaseProps) {
  const number = String(index + 1).padStart(2, '0')
  const [isWorkOpen, setIsWorkOpen] = useState(true)
  const defaultQuestion = `${project.name}에서 어떤 문제를 해결했고, 무엇을 구현했나요?`
  const visibleQuestion = thread?.title || question || defaultQuestion
  const visibleContributions = thread?.contributions ?? project.contributions

  return (
    <article className="project-thread">
      <div className="thread-question"><p>{visibleQuestion}</p></div>

      <div className="thread-progress" aria-label="프로젝트 응답 정보">
        <button type="button" onClick={() => setIsWorkOpen((open) => !open)} aria-expanded={isWorkOpen}>
          <span>프로젝트 {number} · 핵심 작업 {visibleContributions.length}개</span>
          <ChevronRight aria-hidden="true" />
        </button>
      </div>

      <div className="thread-answer">
        <p className="thread-lead"><strong>{project.name}</strong> {thread?.answer ?? '프로젝트의 역할과 구현 근거를 정리했습니다.'}</p>
        {!thread && <p>{project.subtitle}</p>}

        {project.context && (
          <p className="thread-context" aria-label="프로젝트 개요">
            <span>{project.context.period}</span>
            <span>{project.context.team}</span>
            <span>{project.context.position}</span>
          </p>
        )}

        {project.problem && (
          <section className="thread-section">
            <h2>해결하려던 문제</h2>
            <p className="thread-problem">{project.problem}</p>
          </section>
        )}

        <section className="thread-section">
          <h2>맡은 역할</h2>
          <div className="thread-role-list" aria-label="프로젝트 역할">
            {project.role.map((role, roleIndex) => {
              const Icon = roleIndex === 0 ? UsersRound : roleIndex === 1 ? ShieldCheck : Sparkles
              return <span key={role}><Icon aria-hidden="true" />{role}</span>
            })}
          </div>
        </section>

        <section className="thread-section">
          <h2>{thread ? '이 대화의 답변 근거' : '핵심 기여'}</h2>
          <ul className="thread-bullets">{visibleContributions.map((item) => <li key={item}>{item}</li>)}</ul>
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

      <section className="work-summary-card" aria-label="핵심 작업 요약">
        <header>
          <FileText aria-hidden="true" />
          <span><strong>핵심 작업 {visibleContributions.length}개를 정리했습니다</strong><small>기여 {visibleContributions.length} · 기술 {project.technologies.length}</small></span>
          <button type="button" onClick={() => setIsWorkOpen((open) => !open)} aria-label={isWorkOpen ? '핵심 작업 접기' : '핵심 작업 펼치기'}><ChevronDown className={isWorkOpen ? '' : 'is-collapsed'} aria-hidden="true" /></button>
        </header>
        {isWorkOpen && <div className="work-summary-list">{visibleContributions.map((item, itemIndex) => <div key={item}><span><Code2 aria-hidden="true" />work/{number}/{String(itemIndex + 1).padStart(2, '0')}</span><strong>{item}</strong><small>완료</small></div>)}</div>}
        <footer>
          {project.repositoryUrl && <a href={project.repositoryUrl} target="_blank" rel="noreferrer"><GitBranch aria-hidden="true" />저장소 보기<ExternalLink aria-hidden="true" /></a>}
          {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer">데모 보기<ExternalLink aria-hidden="true" /></a>}
          {onOpenReview && <button type="button" onClick={onOpenReview}>Review 열기</button>}
        </footer>
      </section>
    </article>
  )
}
