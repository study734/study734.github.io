import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, BriefcaseBusiness, Check, ChevronDown, Code2, Compass, CornerDownRight, ExternalLink, GitBranch, Mail, Play, Search } from 'lucide-react'
import { audienceOptions, starterQuestions, type AgentRun, type Audience } from '../agent/engine'
import { AgentHandoff } from './AgentHandoff'
import { CopyEmailButton } from './CopyEmailButton'
import { mailtoUrl, profile } from '../data/profile'
import { projects } from '../data/projects'
import { homeProof } from '../data/brief'
import type { WorkspaceView } from './Sidebar'

export interface AgentMessage { id: number; question: string; run: AgentRun; animate: boolean }

interface AgentChatProps {
  messages: AgentMessage[]
  onAsk: (question: string) => void
  onNavigate: (view: WorkspaceView) => void
  onSettled: (id: number) => void
  onChooseAudience: (audience: Audience) => void
  onOpenBrief: () => void
  busy: boolean
}

const audienceIcons = { recruiter: BriefcaseBusiness, developer: Code2, browse: Compass }

const STEP_MS = 420
const BLOCK_MS = 160
const prefersReducedMotion = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function AgentChat({ messages, onAsk, onNavigate, onSettled, onChooseAudience, onOpenBrief, busy }: AgentChatProps) {
  const latest = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (messages.length) latest.current?.scrollIntoView?.({ block: 'start', behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [messages.length])

  if (!messages.length) {
    return (
      <div className="agent-intro">
        <div className="agent-avatar is-large" aria-hidden="true">TW</div>
        <p className="eyebrow">BACKEND · AI-INTEGRATED WEB DEVELOPER</p>
        <h1>{profile.name}<br /><span className="agent-intro-tagline">보안을 아는 백엔드 개발자</span></h1>
        <p className="agent-intro-copy">
          Java · Spring Boot 서비스에 AI · RAG를 붙이고,<br />{' '}
          누가 어떤 데이터에 접근하는지를 코드와 테스트로 지킵니다.
        </p>
        <ul className="home-proof" aria-label="대표 근거">
          {homeProof.map((item) => <li key={item.label}><strong>{item.value}</strong><span>{item.label}</span></li>)}
        </ul>
        <div className="home-cta">
          <button type="button" className="home-cta-primary" onClick={onOpenBrief}><Play aria-hidden="true" />30초 요약 보기</button>
          <a href={mailtoUrl}><Mail aria-hidden="true" />이메일</a>
          <a href={profile.githubUrl} target="_blank" rel="noreferrer"><GitBranch aria-hidden="true" />GitHub</a>
        </div>

        <section className="agent-audience" aria-labelledby="agent-audience-title">
          <h2 id="agent-audience-title">어떤 일로 오셨어요?</h2>
          <p className="agent-audience-copy">비서가 목적에 맞게 안내해 드려요</p>
          <div>
            {audienceOptions.map(({ id, label, description }) => {
              const Icon = audienceIcons[id]
              return (
                <button type="button" key={id} disabled={busy} onClick={() => onChooseAudience(id)}>
                  <Icon aria-hidden="true" />
                  <span><strong>{label}</strong><small>{description}</small></span>
                </button>
              )
            })}
          </div>
        </section>

        <div className="agent-starters" aria-label="추천 질문">
          {starterQuestions.map((question) => (
            <button type="button" key={question} disabled={busy} onClick={() => onAsk(question)}>
              <CornerDownRight aria-hidden="true" /><span>{question}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const transcript = messages.map((message) => message.question)
  return (
    <div className="agent-thread" aria-label="agent 대화">
      {messages.map((message, index) => (
        <div className="agent-exchange" key={message.id} ref={index === messages.length - 1 ? latest : undefined}>
          <div className="thread-question"><p>{message.question}</p></div>
          <AgentReply message={message} transcript={transcript} isLatest={index === messages.length - 1} busy={busy} onAsk={onAsk} onNavigate={onNavigate} onSettled={onSettled} />
        </div>
      ))}
      <p className="agent-footnote">비서는 태욱 님이 정리해 둔 포트폴리오 기록으로만 답해요. 기록에 없는 내용은 태욱 님께 전달해 드려요.</p>
    </div>
  )
}

function AgentReply({ message, transcript, isLatest, busy, onAsk, onNavigate, onSettled }: { message: AgentMessage; transcript: string[]; isLatest: boolean; busy: boolean } & Pick<AgentChatProps, 'onAsk' | 'onNavigate' | 'onSettled'>) {
  const { run } = message
  const total = run.steps.length + run.blocks.length
  const [progress, setProgress] = useState(() => (message.animate && !prefersReducedMotion() ? 0 : total))
  const [stepsOpen, setStepsOpen] = useState(false)
  const settled = useRef(!message.animate)

  useEffect(() => {
    if (progress >= total) {
      if (!settled.current) { settled.current = true; onSettled(message.id) }
      return
    }
    const timer = window.setTimeout(() => setProgress((value) => value + 1), progress < run.steps.length ? STEP_MS : BLOCK_MS)
    return () => window.clearTimeout(timer)
  }, [progress, total, run.steps.length, message.id, onSettled])

  // 답을 보는 도중 다른 화면으로 가도 다음에 다시 재생되지 않게 합니다
  useEffect(() => () => { if (!settled.current) { settled.current = true; onSettled(message.id) } }, [message.id, onSettled])

  const visibleSteps = Math.min(progress, run.steps.length)
  const visibleBlocks = Math.max(0, progress - run.steps.length)
  const working = progress < total
  const thinking = progress < run.steps.length

  return (
    <div className="agent-reply">
      <div className="agent-reply-header">
        <span className="agent-avatar" aria-hidden="true">TW</span>
        <strong>태욱 님의 비서</strong>
      </div>

      <div className={`agent-steps ${stepsOpen || thinking ? 'is-open' : ''}`}>
        <button type="button" className="agent-steps-toggle" aria-expanded={stepsOpen || thinking} onClick={() => setStepsOpen((open) => !open)} disabled={thinking}>
          {thinking
            ? <><span className="thinking-orb" aria-hidden="true" /><span className="thinking-label" role="status">{run.steps[visibleSteps]?.label ?? '정리하는 중'}…</span></>
            : <><Search aria-hidden="true" /><span>{run.steps.length}단계 작업 · {run.steps.map((step) => step.label).join(' → ')}</span><ChevronDown aria-hidden="true" /></>}
        </button>
        {(stepsOpen || thinking) && (
          <ol aria-label="agent 작업 단계">
            {run.steps.slice(0, visibleSteps).map((step) => (
              <li key={step.label}>
                <Check aria-hidden="true" />
                <div>
                  <strong>{step.label}</strong>
                  <span>{step.detail}</span>
                  {step.items && step.items.length > 0 && <ul>{[...new Set(step.items)].map((item) => <li key={item}>{item}</li>)}</ul>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="agent-answer" aria-live="polite">
        {run.blocks.slice(0, visibleBlocks).map((block, index) => {
          if (block.type === 'text') return <p key={index} className="revealed-answer">{block.text}</p>
          if (block.type === 'list') return <ul key={index} className="agent-list revealed-answer">{block.items.map((item) => <li key={item}>{item}</li>)}</ul>
          if (block.type === 'handoff') return <div key={index} className="revealed-answer"><AgentHandoff question={block.question} transcript={transcript} /></div>
          if (block.type === 'point') return (
            <div key={index} className="agent-point revealed-answer">
              <strong>{block.title}</strong>
              <p>{block.text}</p>
              {block.url
                ? <a href={block.url} target="_blank" rel="noreferrer">{block.source}<ExternalLink aria-hidden="true" /></a>
                : <small>{block.source}</small>}
            </div>
          )
          if (block.type === 'projects') return (
            <div key={index} className="home-project-grid revealed-answer" aria-label="프로젝트 목록">
              {projects.map((project, projectIndex) => (
                <button type="button" key={project.name} className={project.featured ? 'is-featured' : ''} onClick={() => onNavigate(`project-${projectIndex}` as WorkspaceView)}>
                  <span className="home-project-meta">
                    <span>{String(projectIndex + 1).padStart(2, '0')}</span>
                    {project.featured && <span className="home-project-badge">대표</span>}
                    {project.context?.team && <span>{project.context.team}</span>}
                  </span>
                  <strong>{project.name}<ArrowUpRight aria-hidden="true" /></strong>
                  <span className="home-project-subtitle">{project.subtitle}</span>
                  <span className="home-project-tech">{project.technologies.slice(0, 4).map((tech) => <span key={tech}>{tech}</span>)}</span>
                </button>
              ))}
            </div>
          )
          return (
            <div key={index} className="agent-contact-block revealed-answer">
              <div className="contact-actions agent-contact">
                <a href={mailtoUrl}><Mail aria-hidden="true" /><span><small>EMAIL</small>{profile.email}</span><ArrowUpRight aria-hidden="true" /></a>
              <a href={profile.githubUrl} target="_blank" rel="noreferrer"><GitBranch aria-hidden="true" /><span><small>GITHUB</small>github.com/{profile.githubHandle}</span><ArrowUpRight aria-hidden="true" /></a>
            </div>
            <CopyEmailButton className="agent-copy-email" />
            </div>
          )
        })}
      </div>

      {!working && run.sources.length > 0 && (
        <div className="agent-sources revealed-answer" aria-label="답변 근거">
          <span>근거</span>
          {run.sources.map((source) => source.url
            ? <a key={source.label} href={source.url} target="_blank" rel="noreferrer">{source.label}<ExternalLink aria-hidden="true" /></a>
            : <button type="button" key={source.label} onClick={() => source.view && onNavigate(source.view)}>{source.label}<ArrowUpRight aria-hidden="true" /></button>)}
        </div>
      )}

      {!working && isLatest && run.suggestions.length > 0 && (
        <div className="agent-suggestions revealed-answer" aria-label="이어서 물어보기">
          {run.suggestions.map((question) => (
            <button type="button" key={question} disabled={busy} onClick={() => onAsk(question)}><CornerDownRight aria-hidden="true" />{question}</button>
          ))}
        </div>
      )}
    </div>
  )
}
