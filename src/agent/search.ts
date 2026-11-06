import { projects } from '../data/projects'
import { knowledge, type KnowledgeChunk } from './knowledge'

/** 포트폴리오 기록 검색: 한국어 2글자 단위 + 영문 단어, 동의어 확장, IDF 가중치 */


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
export const hasTopic = (question: string) => topicalGroups.some((group) => group.some((term) => question.toLowerCase().includes(term)))

const indexed = knowledge.map((chunk) => ({ chunk, tokens: new Set(tokenize(`${chunk.title} ${chunk.title} ${chunk.source} ${chunk.text} ${chunk.tags ?? ''}`)) }))
const documentFrequency = new Map<string, number>()
for (const { tokens } of indexed) for (const token of tokens) documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1)
const idf = (token: string) => Math.log(1 + indexed.length / (documentFrequency.get(token) ?? indexed.length))

export function mentionedProjects(question: string): number[] {
  const lower = question.toLowerCase().replace(/\s+/g, '')
  const found: number[] = []
  // 이름이 긴 프로젝트부터 확인해 "GearVia On-Premise"가 "GearVia"로 잡히지 않게 합니다
  const ordered = projects.map((project, index) => ({ index, key: project.name.toLowerCase().replace(/\s+/g, '') })).sort((a, b) => b.key.length - a.key.length)
  let rest = lower
  for (const { index, key } of ordered) {
    if (rest.includes(key)) { found.push(index); rest = rest.split(key).join(' ') }
  }
  const onPremise = projects.findIndex((project) => project.name === 'GearVia On-Premise')
  if (onPremise >= 0 && /온프레미스|온프렘|b2b/.test(lower) && !found.includes(onPremise)) found.push(onPremise)
  const moida = projects.findIndex((project) => project.name === 'MOIDA')
  if (moida >= 0 && /경매|중고/.test(lower) && !found.includes(moida)) found.push(moida)
  return found
}

export function search(question: string, limit = 3): { results: KnowledgeChunk[]; keywords: string[]; focus: number[]; total: number } {
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

