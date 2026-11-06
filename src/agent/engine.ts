import { experience, profile, stack } from '../data/profile'
import { projects } from '../data/projects'
import type { WorkspaceView } from '../components/Sidebar'
import { knowledge, type KnowledgeChunk } from './knowledge'

/**
 * 포트폴리오 agent의 응답 엔진.
 *
 * 지금은 브라우저 안에서 기록을 검색하고, 찾은 기록을 그대로 엮어 답합니다.
 * 생성형 AI를 붙일 때는 `runAgent`와 같은 모양(AgentRun)을 돌려주는 원격 호출로 바꾸면
 * 화면 코드는 그대로 쓸 수 있습니다. 검색 결과(steps·sources)는 그때도 근거로 넘기면 됩니다.
 */

export interface AgentStep { label: string; detail: string; items?: string[] }
export interface AgentSource { label: string; view?: WorkspaceView; url?: string }
export type AgentBlock =
  | { type: 'text'; text: string }
  | { type: 'point'; title: string; text: string; source: string }
  | { type: 'projects' }
  | { type: 'contact' }
export interface AgentRun {
  intent: Intent
  steps: AgentStep[]
  blocks: AgentBlock[]
  sources: AgentSource[]
  suggestions: string[]
}

type Intent = 'intro' | 'roles' | 'projects' | 'strengths' | 'stack' | 'experience' | 'contact' | 'search' | 'unknown'

const intentLabels: Record<Intent, string> = {
  intro: '자기소개',
  roles: '맡은 역할',
  projects: '프로젝트 목록',
  strengths: '강점·차별점',
  stack: '기술 스택',
  experience: '경험·이력',
  contact: '연락처',
  search: '프로젝트 기록 질문',
  unknown: '기록 밖 질문',
}

/* ---------- 검색 ---------- */

/** 질문에 이 말이 있으면 같은 묶음의 다른 말도 함께 찾습니다 */
const synonyms: string[][] = [
  ['rag', '검색', '인용', '임베딩', '색인', '청킹', '문서'],
  ['보안', 'security', '인증', '권한', '접근', 'mfa', 'tls', '격리', '허용목록'],
  ['배포', 'deploy', 'aws', 'docker', '설치', '운영', 'nginx', 'infra'],
  ['ai', 'llm', 'openai', '비서', '리포트', '보고서', '모델'],
  ['역할', '담당', '기여', '맡은', '직접'],
  ['테스트', '검증', '확인', 'pr'],
  ['한계', '실패', '문제', '남은', '아쉬운'],
  ['선택', '이유', '판단', '결정', '왜'],
  ['데이터베이스', 'db', 'mysql', '벡터'],
  ['온프레미스', 'on-premise', '온프렘', 'b2b', '관리자'],
  ['경매', 'moida', '중고'],
]

const stopwords = new Set(['에서', '어디', '관련', '가장', '있나요', '어때', '무슨', '했던', '어떤가요', '어떻게', '무엇', '뭐야', '뭔가요', '했나요', '했어', '있나요', '알려줘', '알려주세요', '대해', '그리고', '어떤', '하는', '하나요', '인가요', '해줘', '임태욱', '태욱', '님은', '님의', '당신'])
const particles = /(으로서|로서|은|는|이|가|을|를|에|에서|의|로|으로|와|과|도|만|요|까지|부터)$/
const endings = /(했나요|했어요|했는지|했던|했나|했어|했다|하나요|하는지|인가요|이에요|나요|어요|해요|했|된|한|던)$/

function tokenize(value: string): string[] {
  const tokens: string[] = []
  for (const raw of value.toLowerCase().match(/[a-z0-9][a-z0-9.+#-]*|[가-힣]+/g) ?? []) {
    if (stopwords.has(raw)) continue
    if (/^[a-z0-9]/.test(raw)) {
      if (raw.length > 1) tokens.push(raw)
      continue
    }
    let word = raw.length > 2 ? raw.replace(particles, '') : raw
    if (word.length > 2) word = word.replace(endings, '')
    if (word.length === 1) { tokens.push(word); continue }
    for (let i = 0; i < word.length - 1; i++) tokens.push(word.slice(i, i + 2))
  }
  return tokens
}

function expandedTerms(question: string): string[] {
  const lower = question.toLowerCase()
  return synonyms.filter((group) => group.some((term) => lower.includes(term))).flat()
}

/** 기술 주제어(보안, AI, 배포 등)가 들어 있으면 이력 질문이 아니라 기록 검색으로 봅니다 */
const topicalGroups = synonyms.filter((group) => !['역할', '테스트', '한계', '선택'].includes(group[0]))
const hasTopic = (question: string) => topicalGroups.some((group) => group.some((term) => question.toLowerCase().includes(term)))

const indexed = knowledge.map((chunk) => ({ chunk, tokens: new Set(tokenize(`${chunk.title} ${chunk.title} ${chunk.source} ${chunk.text} ${chunk.tags ?? ''}`)) }))
const documentFrequency = new Map<string, number>()
for (const { tokens } of indexed) for (const token of tokens) documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1)
const idf = (token: string) => Math.log(1 + indexed.length / (documentFrequency.get(token) ?? indexed.length))

function mentionedProjects(question: string): number[] {
  const lower = question.toLowerCase().replace(/\s+/g, '')
  const found: number[] = []
  // 이름이 긴 프로젝트부터 확인해 "GearVia On-Premise"가 "GearVia"로 잡히지 않게 합니다
  const ordered = projects.map((project, index) => ({ index, key: project.name.toLowerCase().replace(/\s+/g, '') })).sort((a, b) => b.key.length - a.key.length)
  let rest = lower
  for (const { index, key } of ordered) {
    if (rest.includes(key)) { found.push(index); rest = rest.split(key).join(' ') }
  }
  if (/온프레미스|온프렘|b2b/.test(lower) && !found.includes(1)) found.push(1)
  if (/경매|중고/.test(lower) && !found.includes(3)) found.push(3)
  return found
}

export function search(question: string, limit = 3) {
  // 질문에 직접 쓴 말은 동의어로 넓힌 말보다 두 배로 칩니다
  const direct = new Set(tokenize(question))
  const queryTokens = [...new Set([...direct, ...tokenize(expandedTerms(question).join(' '))])]
  const focus = mentionedProjects(question)
  const scored = indexed.map(({ chunk, tokens }) => {
    let score = 0
    for (const token of queryTokens) if (tokens.has(token)) score += idf(token) * (direct.has(token) ? 2 : 1)
    if (focus.length && chunk.projectIndex !== undefined) score *= focus.includes(chunk.projectIndex) ? 1.8 : 0.4
    if (focus.length && chunk.projectIndex === undefined) score *= 0.5
    return { chunk, score }
  }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score)

  const top = scored[0]?.score ?? 0
  // 너무 약한 일치는 근거로 쓰지 않습니다
  const threshold = Math.max(7, top * 0.45)
  const picked: KnowledgeChunk[] = []
  for (const { chunk, score } of scored) {
    if (score < threshold || picked.length >= limit) break
    if (picked.some((item) => item.text === chunk.text)) continue
    picked.push(chunk)
  }
  return { results: picked, keywords: [...direct], focus, total: knowledge.length }
}

/* ---------- 응답 ---------- */

const projectNames = projects.map((project) => project.name)

function detectIntent(question: string): Intent {
  const q = question.toLowerCase().replace(/\s+/g, '')
  if (/연락|이메일|메일|email|contact|채용|커피챗|인터뷰|면접제안/.test(q)) return 'contact'
  if (/누구|자기소개|소개해|소개좀|어떤사람|어떤개발자|안녕|hello|hi$/.test(q)) return 'intro'
  if (/강점|장점|차별|왜뽑|뽑아야|잘하는|특별|어필/.test(q)) return 'strengths'
  if (/기술스택|스택|stack|어떤기술|쓸줄|사용할줄|언어|프레임워크/.test(q) && mentionedProjects(question).length === 0) return 'stack'
  const noProject = mentionedProjects(question).length === 0
  if (/학력|학교|전공|수상|장학|이력|교육|경력/.test(q) && noProject) return 'experience'
  if (/경험/.test(q) && noProject && !hasTopic(question)) return 'experience'
  if (/역할|담당|맡은|맡았|포지션|팀에서/.test(q) && noProject && !hasTopic(question)) return 'roles'
  if (/프로젝트(목록|전체|뭐|무엇|보여|소개|알려|를했|했|들)|(어떤|무슨)프로젝트|무엇을만들|뭘만들|뭐만들|만든것|작업물|포트폴리오/.test(q) && noProject) return 'projects'
  return 'search'
}

function trimSentences(text: string, max = 230) {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('다. '), cut.lastIndexOf('니다.'))
  return (end > 80 ? cut.slice(0, end + (cut.slice(end).startsWith('니다.') ? 3 : 1)) : cut.trimEnd() + '…').trim()
}

const sourceOf = (chunk: KnowledgeChunk): AgentSource => ({ label: chunk.source, view: chunk.view, url: chunk.url })
const uniqueSources = (sources: AgentSource[]) => sources.filter((source, index) => sources.findIndex((other) => other.label === source.label) === index)

function understandStep(intent: Intent, focus: number[], keywords: string[]): AgentStep {
  const parts = [`의도: ${intentLabels[intent]}`]
  if (focus.length) parts.push(`대상: ${focus.map((index) => projectNames[index]).join(', ')}`)
  const shown = keywords.filter((keyword) => keyword.length > 1).slice(0, 5)
  if (intent === 'search' && shown.length) parts.push(`키워드: ${shown.join(', ')}`)
  return { label: '질문 이해', detail: parts.join(' · ') }
}

const defaultSuggestions = ['RAG 검색은 어떻게 설계했나요?', '가장 어려웠던 기술적 판단은?', '보안 관련 경험이 있나요?', '연락은 어떻게 하나요?']

function followupsFor(intent: Intent, focus: number[], asked: string): string[] {
  const byProject: Record<number, string[]> = {
    0: ['GearVia에서 그룹 자료 격리는 어떻게 했나요?', 'AI 주간 보고서는 어떻게 검증했나요?', '벡터 DB 없이 시작한 이유는?'],
    1: ['On-Premise 설치 중 생긴 문제는?', 'AI 설정을 관리자 화면으로 옮긴 이유는?', 'IP 허용목록은 어떻게 고쳤나요?'],
    2: ['GearVia ME에서 맡은 역할은?', 'GearVia On-Premise는 어떤 프로젝트인가요?'],
    3: ['MOIDA에서 인증은 어떻게 구현했나요?', 'AWS 배포는 어떻게 구성했나요?'],
  }
  const byIntent: Partial<Record<Intent, string[]>> = {
    roles: ['부팀장으로서 무엇을 했나요?', 'GearVia에서 가장 중요한 판단은?', '테스트는 어떻게 했나요?'],
    intro: ['어떤 프로젝트를 했나요?', '강점이 뭔가요?', '기술 스택을 알려주세요'],
    projects: ['GearVia에서 가장 중요한 판단은?', 'On-Premise 설치 중 생긴 문제는?', '직접 맡은 역할은 무엇인가요?'],
    strengths: ['RAG 검색은 어떻게 설계했나요?', 'On-Premise 설치 중 생긴 문제는?', '연락은 어떻게 하나요?'],
    stack: ['Spring Security는 어디에 썼나요?', 'AI는 어떻게 활용했나요?', '어떤 프로젝트를 했나요?'],
    experience: ['팀에서 어떤 역할을 했나요?', '어떤 프로젝트를 했나요?', '연락은 어떻게 하나요?'],
    contact: ['어떤 프로젝트를 했나요?', '강점이 뭔가요?'],
  }
  const pool = focus.length ? focus.flatMap((index) => byProject[index] ?? []) : byIntent[intent] ?? defaultSuggestions
  return [...pool, ...defaultSuggestions].filter((question, index, list) => question !== asked && list.indexOf(question) === index).slice(0, 3)
}

export function runAgent(rawQuestion: string): AgentRun {
  const question = rawQuestion.trim().slice(0, 300)
  const intent = detectIntent(question)
  const { results, keywords, focus, total } = search(question)
  const steps: AgentStep[] = [understandStep(intent, focus, keywords)]
  const suggestions = followupsFor(intent, focus, question)

  if (intent === 'intro') {
    steps.push({ label: '프로필 확인', detail: '프로필 · 경험 · 대표 프로젝트 기록', items: ['프로필', experience[0][1], projectNames[0], projectNames[1]] })
    return {
      intent, steps, suggestions,
      blocks: [
        { type: 'text', text: `${profile.name}은 정보보안을 전공한 ${profile.role}입니다. Java · Spring Boot로 서비스의 핵심 흐름과 권한 구조를 만들고, 그 위에 AI · RAG 기능을 실제 업무 흐름에 맞게 붙이는 일을 해왔어요.` },
        { type: 'text', text: `대표 작업은 팀 협업 서비스 ${projectNames[0]}의 AI 비서 · RAG 검색 · 주간 리포트, 그리고 같은 서비스를 기업 내부 서버에 설치해 운영할 수 있게 만든 ${projectNames[1]}입니다. 기능을 붙이는 데서 끝내지 않고 "누가 어떤 데이터에 접근할 수 있는가"를 코드와 테스트로 지키는 걸 중요하게 봅니다.` },
      ],
      sources: [{ label: '경험', view: 'experience' }, { label: projectNames[0], view: 'project-0' }, { label: projectNames[1], view: 'project-1' }],
    }
  }

  if (intent === 'roles') {
    steps.push({ label: '역할 기록 조회', detail: `프로젝트 ${projects.length}개`, items: projectNames })
    return {
      intent, steps, suggestions,
      blocks: [
        { type: 'text', text: '프로젝트마다 맡은 범위가 달랐어요. 팀 전체 기능과 구분해서 직접 담당한 부분만 정리했습니다.' },
        ...projects.map((project) => ({ type: 'point' as const, title: `${project.name} — ${project.role.join(' · ')}`, text: project.context ? `${project.context.team}. ${project.context.position}` : project.contributions.join(' · '), source: project.name })),
      ],
      sources: projects.map((project, index) => ({ label: project.name, view: `project-${index}` as WorkspaceView })),
    }
  }

  if (intent === 'projects') {
    steps.push({ label: '프로젝트 조회', detail: `프로젝트 ${projects.length}개`, items: projectNames })
    return {
      intent, steps, suggestions,
      blocks: [{ type: 'text', text: `지금까지 정리된 프로젝트는 ${projects.length}개예요. 대표 프로젝트는 ${projects.filter((project) => project.featured).map((project) => project.name).join('와 ')}이고, 카드를 누르면 자세한 기록이 열려요.` }, { type: 'projects' }],
      sources: [],
    }
  }

  if (intent === 'strengths') {
    const decisions = projects.flatMap((project, index) => (project.decisions ?? []).map((decision) => ({ project, index, decision })))
    steps.push({ label: '기술적 판단 조회', detail: `판단 기록 ${decisions.length}건`, items: decisions.map(({ decision }) => decision.title) })
    return {
      intent, steps, suggestions,
      blocks: [
        { type: 'text', text: '기록으로 보면 강점은 "기능이 돌아가는 것"보다 "경계가 지켜지는 것"을 먼저 확인한다는 점이에요. 실제로 내린 판단 몇 가지를 보면 알 수 있어요.' },
        ...decisions.slice(0, 3).map(({ project, decision }) => ({ type: 'point' as const, title: decision.title, text: trimSentences(decision.reason, 200), source: `${project.name} · 기술적 판단` })),
      ],
      sources: uniqueSources(decisions.slice(0, 3).map(({ project, index }) => ({ label: `${project.name} · 기술적 판단`, view: `project-${index}` as WorkspaceView }))),
    }
  }

  if (intent === 'stack') {
    steps.push({ label: '기술 스택 조회', detail: `분야 ${stack.length}개`, items: stack.map(([label]) => label) })
    return {
      intent, steps, suggestions,
      blocks: [
        { type: 'text', text: '주력은 Java · Spring Boot 백엔드예요. 분야별로 정리하면 이렇습니다.' },
        ...stack.map(([label, technologies, description]) => ({ type: 'point' as const, title: `${label} — ${technologies}`, text: description, source: '기술 스택' })),
      ],
      sources: [{ label: 'Core Stack', view: 'stack' }],
    }
  }

  if (intent === 'experience') {
    steps.push({ label: '경험 조회', detail: `기록 ${experience.length}건`, items: experience.map(([, value]) => value) })
    return {
      intent, steps, suggestions,
      blocks: [
        { type: 'text', text: '학력과 활동 기록은 다음과 같아요.' },
        ...experience.map(([label, value, description]) => ({ type: 'point' as const, title: value, text: description, source: label })),
      ],
      sources: [{ label: 'Experience', view: 'experience' }],
    }
  }

  if (intent === 'contact') {
    steps.push({ label: '연락처 조회', detail: '이메일 · GitHub' })
    return {
      intent, steps, suggestions,
      blocks: [{ type: 'text', text: '이메일로 연락하시면 가장 빨라요. 코드와 작업 이력은 GitHub에서 볼 수 있어요.' }, { type: 'contact' }],
      sources: [{ label: 'Contact', view: 'contact' }],
    }
  }

  steps.push({ label: '기록 검색', detail: `기록 ${total}개 중 ${results.length}건 일치`, items: results.map((chunk) => chunk.source) })

  if (!results.length) {
    return {
      intent: 'unknown', steps, suggestions: defaultSuggestions.slice(0, 3),
      blocks: [{ type: 'text', text: '포트폴리오 기록에서는 이 질문에 답할 근거를 찾지 못했어요. 기록에 없는 내용을 지어내지 않도록 여기서 멈출게요. 프로젝트, 기술적 판단, 기술 스택, 경험에 대해 물어봐 주세요.' }],
      sources: [],
    }
  }

  steps.push({ label: '답변 작성', detail: `근거 ${results.length}건으로 정리` })
  const projectSet = [...new Set(results.map((chunk) => chunk.projectIndex).filter((index): index is number => index !== undefined))]
  const lead = projectSet.length === 1
    ? `${projectNames[projectSet[0]]} 기록에서 관련 내용 ${results.length}건을 찾았어요.`
    : `관련 기록 ${results.length}건을 찾았어요.`
  return {
    intent, steps, suggestions,
    blocks: [
      { type: 'text', text: lead },
      ...results.map((chunk) => ({ type: 'point' as const, title: chunk.title, text: trimSentences(chunk.text), source: chunk.source })),
    ],
    sources: uniqueSources(results.map(sourceOf)),
  }
}

export const starterQuestions = ['임태욱은 어떤 개발자인가요?', 'RAG 검색은 어떻게 설계했나요?', '어떤 프로젝트를 했나요?', '강점이 뭔가요?', 'On-Premise 설치 중 생긴 문제는?', '기술 스택을 알려주세요']
