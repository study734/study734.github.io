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
})
