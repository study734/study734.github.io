import { describe, expect, test } from 'vitest'
import { runAgent, search, starterQuestions } from './engine'

const pointTitles = (question: string) => runAgent(question).blocks.flatMap((block) => (block.type === 'point' ? [block.title] : []))

describe('portfolio agent', () => {
  test('routes each starter question to a grounded answer', () => {
    const intents = starterQuestions.map((question) => runAgent(question).intent)
    expect(intents).toEqual(['intro', 'search', 'projects', 'strengths', 'search', 'stack'])
    for (const question of starterQuestions) {
      const run = runAgent(question)
      expect(run.steps[0].label).toBe('질문 이해')
      expect(run.blocks.length).toBeGreaterThan(0)
    }
  })

  test('finds the matching technical decision for a specific question', () => {
    expect(pointTitles('벡터 DB 없이 시작한 이유는?')[0]).toMatch(/벡터 DB 없이/)
    expect(pointTitles('VM 설치 후 로그인 403 문제')).toContain('VM 설치는 끝났는데 로그인하면 403이 나와.')
  })

  test('keeps answers inside the named project', () => {
    const { results } = search('MOIDA에서 인증은 어떻게 구현했나요?')
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((chunk) => chunk.projectIndex === 3)).toBe(true)
  })

  test('reports the steps it actually took, including what it found', () => {
    const run = runAgent('RAG 검색은 어떻게 설계했나요?')
    const searchStep = run.steps.find((step) => step.label === '기록 검색')
    expect(searchStep?.detail).toMatch(/기록 \d+개 중 3건 일치/)
    expect(searchStep?.items).toHaveLength(3)
    expect(run.sources.length).toBeGreaterThan(0)
  })

  test('declines instead of inventing an answer for off-topic questions', () => {
    for (const question of ['오늘 날씨 어때?', '좋아하는 음식은?']) {
      const run = runAgent(question)
      expect(run.intent).toBe('unknown')
      expect(run.sources).toHaveLength(0)
      expect(run.blocks[0]).toMatchObject({ type: 'text', text: expect.stringMatching(/근거를 찾지 못했어요/) })
    }
  })

  test('answers contact and topical experience questions with the right intent', () => {
    expect(runAgent('연락은 어떻게 하나요?').intent).toBe('contact')
    expect(runAgent('보안 관련 경험이 있나요?').intent).toBe('search')
    expect(runAgent('학력이 어떻게 되나요?').intent).toBe('experience')
    expect(runAgent('팀에서 어떤 역할을 했나요?').intent).toBe('roles')
  })
})
