import { describe, expect, test } from 'vitest'
import { audienceOptions, runAgent, search, starterQuestions, tourFor } from './engine'

const pointTitles = (question: string) => runAgent(question).blocks.flatMap((block) => (block.type === 'point' ? [block.title] : []))
const allText = (question: string) => runAgent(question).blocks.map((block) => ('text' in block ? block.text : 'items' in block ? block.items.join(' ') : '')).join(' ')

describe('portfolio assistant', () => {
  test('answers each starter question with a prepared, sourced answer', () => {
    expect(starterQuestions.map((question) => runAgent(question).intent)).toEqual(['intro', 'why-hire', 'challenge', 'ai'])
    for (const question of starterQuestions) {
      const run = runAgent(question)
      expect(run.steps.map((step) => step.label)).toEqual(['질문 이해', '기록 확인', '답변 정리'])
      expect(run.sources.length).toBeGreaterThan(0)
    }
  })

  test('introduces 태욱 님 in the third person, like an assistant', () => {
    expect(allText('임태욱은 어떤 개발자인가요?')).toMatch(/임태욱 님은/)
    expect(allText('강점이 뭔가요?')).toMatch(/태욱 님의 강점/)
  })

  test('tailors the first briefing to who is visiting', () => {
    const recruiter = tourFor('recruiter')
    expect(recruiter.blocks.some((block) => block.type === 'contact')).toBe(true)
    expect(recruiter.blocks.some((block) => block.type === 'list')).toBe(true)
    const developer = tourFor('developer')
    expect(developer.blocks.filter((block) => block.type === 'point').length).toBeGreaterThanOrEqual(3)
    expect(developer.sources.some((source) => source.url?.includes('/commit/'))).toBe(true)
    expect(tourFor('browse').blocks.some((block) => block.type === 'projects')).toBe(true)
    expect(audienceOptions).toHaveLength(3)
  })

  test('tells the install incident as a problem-solving story', () => {
    expect(pointTitles('가장 어려웠던 문제는?').map((title) => title.split(' — ')[0])).toEqual(['상황', '원인', '판단', '결과'])
    expect(runAgent('On-Premise 설치 중 생긴 문제는?').intent).toBe('challenge')
  })

  test('falls back to searching the records for specific questions', () => {
    expect(pointTitles('벡터 DB 없이 시작한 이유는?')[0]).toMatch(/벡터 DB 없이/)
    const { results } = search('MOIDA에서 인증은 어떻게 구현했나요?')
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((chunk) => chunk.projectIndex === 3)).toBe(true)
    const searchStep = runAgent('그룹 격리를 왜 SQL로 했나요?').steps.find((step) => step.label === '기록 검색')
    expect(searchStep?.detail).toMatch(/기록 \d+개 중 \d건 일치/)
  })

  test('offers to pass unknown questions to 태욱 님 instead of inventing answers', () => {
    for (const question of ['오늘 날씨 어때?', '좋아하는 음식은?']) {
      const run = runAgent(question)
      expect(run.intent).toBe('unknown')
      expect(run.sources).toHaveLength(0)
      expect(run.blocks).toContainEqual({ type: 'handoff', question })
    }
  })

  test('routes common recruiter questions to the right answer', () => {
    expect(runAgent('연락은 어떻게 하나요?').intent).toBe('contact')
    expect(runAgent('부족한 점은 없나요?').intent).toBe('weakness')
    expect(runAgent('보안 관련 경험이 있나요?').intent).toBe('security')
    expect(runAgent('학력이 어떻게 되나요?').intent).toBe('experience')
    expect(runAgent('팀에서 어떤 역할을 했나요?').intent).toBe('roles')
    expect(runAgent('AI 주간 보고서는 어떻게 검증했나요?').intent).toBe('search')
  })
})
