import { describe, expect, test } from 'vitest'
import { projects } from './projects'

describe('portfolio project data', () => {
  test('contains the four featured projects', () => {
    expect(projects.map((project) => project.name)).toEqual([
      'GearVia',
      'GearVia ME',
      'GearVia On-Premise',
      'MOIDA',
    ])
  })

  test('keeps project contribution and technology evidence populated', () => {
    for (const project of projects) {
      expect(project.contributions.length).toBeGreaterThan(0)
      expect(project.technologies.length).toBeGreaterThan(0)
      if (project.repositoryUrl) {
        expect(project.repositoryUrl.startsWith('https://github.com/')).toBe(true)
      }
    }
  })
})
