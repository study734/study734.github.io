import { describe, expect, test } from 'vitest'
import { projects } from './projects'

describe('portfolio v2 project data', () => {
  test('keeps the four projects in evidence-first order', () => {
    expect(projects.map((project) => project.name)).toEqual([
      'GearVia',
      'GearVia On-Premise',
      'GearVia ME',
      'MOIDA',
    ])
  })

  test('keeps role, contribution and technology evidence populated', () => {
    for (const project of projects) {
      expect(project.role.length).toBeGreaterThan(0)
      expect(project.contributions.length).toBeGreaterThan(0)
      expect(project.technologies.length).toBeGreaterThan(0)

      if (project.repositoryUrl) {
        expect(project.repositoryUrl.startsWith('https://github.com/')).toBe(true)
      }

      expect('highlights' in project).toBe(false)
    }
  })

  test('does not expose the private MOIDA repository', () => {
    const moida = projects.find((project) => project.name === 'MOIDA')
    expect(moida?.repositoryUrl).toBeUndefined()
  })

  test('featured projects carry case-study depth', () => {
    const featured = projects.filter((project) => project.featured)
    expect(featured.map((project) => project.name)).toEqual(['GearVia', 'GearVia On-Premise'])

    for (const project of featured) {
      expect(project.context?.period).toBeTruthy()
      expect(project.problem).toBeTruthy()
      expect(project.decisions?.length).toBeGreaterThan(0)
      expect(project.evidence?.length).toBeGreaterThan(0)

      for (const decision of project.decisions ?? []) {
        expect(decision.options.length).toBeGreaterThan(1)
        expect(decision.reason.length).toBeGreaterThan(20)
      }
    }
  })

  test('roles read as engineering roles, not team titles', () => {
    for (const project of projects) {
      expect(project.role).not.toContain('부팀장')
    }
  })
})
