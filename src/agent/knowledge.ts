import { conversationFor } from '../data/conversations'
import { experience, profile, stack } from '../data/profile'
import { projects, projectThreads } from '../data/projects'
import type { WorkspaceView } from '../components/Sidebar'

/** agent가 검색하는 기록 한 조각 */
export interface KnowledgeChunk {
  id: string
  /** 답변에 표시하는 짧은 제목 */
  title: string
  /** 출처 표시 (예: "GearVia · 기술적 판단") */
  source: string
  text: string
  /** 화면에는 보이지 않고 검색에만 쓰는 말 */
  tags?: string
  /** 같은 프로젝트 기록끼리 묶기 위한 인덱스 */
  projectIndex?: number
  view?: WorkspaceView
  url?: string
}

const compact = (value: string) => value.replace(/\s+/g, ' ').trim()

function buildKnowledge(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = []
  const add = (chunk: Omit<KnowledgeChunk, 'id'>) => chunks.push({ ...chunk, text: compact(chunk.text), id: `k${chunks.length}` })

  projects.forEach((project, index) => {
    const view = `project-${index}` as WorkspaceView
    const base = { projectIndex: index, view }
    add({ ...base, title: `${project.name} 개요`, source: `${project.name} · 개요`, text: `${project.subtitle}. 역할: ${project.role.join(', ')}. ${project.context ? `${project.context.team}, ${project.context.position}.` : ''} 사용 기술: ${project.technologies.join(', ')}.` })
    if (project.problem) add({ ...base, title: `${project.name}에서 해결하려던 문제`, source: `${project.name} · 문제 정의`, text: project.problem })
    project.contributions.forEach((item) => add({ ...base, title: `${project.name} 핵심 기여`, source: `${project.name} · 핵심 기여`, text: item, tags: project.role.join(' ') }))
    project.decisions?.forEach((decision) => add({
      ...base,
      title: decision.title,
      source: `${project.name} · 기술적 판단`,
      text: `${decision.situation} 검토한 선택지: ${decision.options.join(' / ')}. 선택: ${decision.choice}. 이유: ${decision.reason}`,
    }))
    project.evidence?.filter((item) => item.url).forEach((item) => add({ ...base, view: undefined, url: item.url, title: `${project.name} ${item.label}`, source: `${project.name} · 근거`, text: item.description }))

    projectThreads[index]?.forEach((thread, threadIndex) => {
      const record = conversationFor(thread)
      const threadView = `project-${index}-thread-${threadIndex}` as WorkspaceView
      const threadBase = { projectIndex: index, view: threadView, source: `${project.name} · ${thread.title}` }
      add({ ...threadBase, title: thread.title, text: `${record.problem} ${record.outcome}` })
      record.exchanges.forEach((exchange) => add({ ...threadBase, title: exchange.question, text: exchange.answer, tags: exchange.stage }))
      add({ ...threadBase, title: `${thread.title}: 선택 이유`, text: record.decision })
      add({ ...threadBase, title: `${thread.title}: 한계`, text: record.limitation })
    })
  })

  experience.forEach(([label, value, description]) => add({ view: 'experience', title: value, source: `경험 · ${label}`, text: `${value}. ${description}.` }))
  stack.forEach(([label, technologies, description]) => add({ view: 'stack', title: `${label}: ${technologies}`, source: `기술 스택 · ${label}`, text: `${technologies}. ${description}` }))
  add({ view: 'contact', title: '연락처', source: '연락처', text: `이메일 ${profile.email}, GitHub ${profile.githubUrl}` })
  return chunks
}

export const knowledge = buildKnowledge()
