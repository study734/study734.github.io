import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronDown, ChevronUp, GitBranch, Mail, X } from 'lucide-react'
import { briefSlides, type BriefSlide } from '../data/brief'
import { mailtoUrl, profile } from '../data/profile'
import type { WorkspaceView } from './Sidebar'
import { CopyEmailButton } from './CopyEmailButton'
import { trackEvent } from '../lib/analytics'

interface BriefDeckProps {
  onClose: () => void
  onNavigate: (view: WorkspaceView) => void
}

const reducedMotion = () => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** 세로로 넘기는 30초 요약. 스크롤 스냅을 쓰므로 터치·휠·키보드가 모두 그대로 동작합니다. */
export function BriefDeck({ onClose, onNavigate }: BriefDeckProps) {
  const [index, setIndex] = useState(0)
  const track = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDivElement>(null)
  const reached = useRef(0)
  const last = briefSlides.length - 1

  useEffect(() => { reached.current = Math.max(reached.current, index) }, [index])

  const report = useCallback((exit: string) => trackEvent('brief', { reached: reached.current + 1, total: briefSlides.length, exit }), [])
  const close = useCallback(() => { report('close'); onClose() }, [onClose, report])

  const goTo = useCallback((next: number) => {
    const target = Math.max(0, Math.min(last, next))
    setIndex(target)
    const el = track.current
    el?.scrollTo?.({ top: target * el.clientHeight, behavior: reducedMotion() ? 'auto' : 'smooth' })
  }, [last])

  useEffect(() => {
    dialog.current?.focus({ preventScroll: true })
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof Element && event.target.closest('input, textarea')) return
      if (event.key === 'Escape') { event.preventDefault(); close() }
      else if (['ArrowDown', 'PageDown', 'j', ' '].includes(event.key)) { event.preventDefault(); goTo(index + 1) }
      else if (['ArrowUp', 'PageUp', 'k'].includes(event.key)) { event.preventDefault(); goTo(index - 1) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [close, goTo, index])

  const onScroll = () => {
    const el = track.current
    if (!el || !el.clientHeight) return
    const current = Math.round(el.scrollTop / el.clientHeight)
    if (current !== index) setIndex(current)
  }

  const leaveTo = (view: WorkspaceView) => { report(view); onNavigate(view) }

  return (
    <div className="brief-backdrop" onClick={(event) => { if (event.target === event.currentTarget) close() }}>
      <div className="brief-frame" role="dialog" aria-modal="true" aria-label={`${profile.name} 30초 요약`} tabIndex={-1} ref={dialog}>
        <div className="brief-top">
          <div className="brief-progress" aria-hidden="true">
            {briefSlides.map((slide, i) => <span key={slide.id} className={i < index ? 'done' : i === index ? 'active' : ''} />)}
          </div>
          <div className="brief-top-row">
            <span className="brief-file" aria-hidden="true">brief/{String(index + 1).padStart(2, '0')}-{briefSlides[index].id}.md</span>
            <span className="brief-count" aria-live="polite">{index + 1} / {briefSlides.length}</span>
            <button type="button" className="brief-skip" onClick={() => leaveTo('home')}>전체 보기 <ArrowRight aria-hidden="true" /></button>
            <button type="button" className="brief-close" aria-label="요약 닫기" onClick={close}><X aria-hidden="true" /></button>
          </div>
        </div>

        <div className="brief-track" ref={track} onScroll={onScroll}>
          {briefSlides.map((slide, i) => (
            <section key={slide.id} className={`brief-slide brief-slide--${slide.id}`} aria-label={`${i + 1}번째 카드`} aria-hidden={i !== index}>
              <SlideBody slide={slide} isActive={i === index} onNavigate={leaveTo} />
            </section>
          ))}
        </div>

        {index === 0 && <p className="brief-hint" aria-hidden="true">위로 넘기기 · ↓</p>}
      </div>
      <div className="brief-nav">
        <button type="button" aria-label="이전 카드" disabled={index === 0} onClick={() => goTo(index - 1)}><ChevronUp aria-hidden="true" /></button>
        <button type="button" aria-label="다음 카드" disabled={index === last} onClick={() => goTo(index + 1)}><ChevronDown aria-hidden="true" /></button>
      </div>
    </div>
  )
}

function SlideBody({ slide, isActive, onNavigate }: { slide: BriefSlide; isActive: boolean; onNavigate: (view: WorkspaceView) => void }) {
  const tab = isActive ? 0 : -1
  return (
    <div className={`brief-content ${isActive ? 'is-active' : ''}`}>
      <Visual slide={slide} />
      <p className="brief-eyebrow">{slide.eyebrow}</p>
      <h2>{slide.title.split('\n').map((line, i) => <span key={i}>{line}</span>)}</h2>
      <p className="brief-body">{slide.body}</p>

      {slide.tags && <ul className="brief-tags">{slide.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>}

      {slide.id === 'contact' && (
        <div className="brief-contact">
          <a href={mailtoUrl} tabIndex={tab}><Mail aria-hidden="true" /><span><small>EMAIL</small>{profile.email}</span></a>
          <a href={profile.githubUrl} target="_blank" rel="noreferrer" tabIndex={tab}><GitBranch aria-hidden="true" /><span><small>GITHUB</small>{profile.githubHandle}</span></a>
          <CopyEmailButton className="brief-copy" />
          <button type="button" className="brief-primary" tabIndex={tab} onClick={() => onNavigate('project-0')}>대표 프로젝트 자세히 보기 <ArrowRight aria-hidden="true" /></button>
        </div>
      )}

      {slide.source && (slide.source.url
        ? <a className="brief-source" href={slide.source.url} target="_blank" rel="noreferrer" tabIndex={tab}>근거 · {slide.source.label} <ArrowUpRight aria-hidden="true" /></a>
        : slide.source.view && <button type="button" className="brief-source" tabIndex={tab} onClick={() => onNavigate(slide.source!.view as WorkspaceView)}>근거 · {slide.source.label} <ArrowRight aria-hidden="true" /></button>)}
    </div>
  )
}

/** 카드 위쪽 절반: 흐름도 · 큰 숫자 · 모노그램 중 하나 */
function Visual({ slide }: { slide: BriefSlide }) {
  if (slide.flow) return (
    <div className="brief-visual">
      <ol className="brief-flow" aria-label="흐름">
        {slide.flow.map((step, i) => <li key={step.label} className={step.tone ? `is-${step.tone}` : ''}>{i > 0 && <ArrowDown aria-hidden="true" />}<span>{step.label}</span></li>)}
      </ol>
    </div>
  )
  if (slide.stat) return (
    <div className="brief-visual">
      <dl className="brief-stats">
        {slide.stat.map((item) => <div key={item.label}><dd>{item.value}</dd><dt>{item.label}</dt></div>)}
      </dl>
    </div>
  )
  if (slide.id === 'who') return <div className="brief-visual" aria-hidden="true"><span className="brief-monogram">TW</span></div>
  return null
}
