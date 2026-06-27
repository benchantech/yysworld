import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { describe, expect, it } from 'vitest'

const repoRoot = process.cwd()

type ArtifactFile = {
  artifact_id: string
  content: {
    title: string
    narrative: string
    summary: string
  }
}

function loadArtifacts(rootId: string): ArtifactFile[] {
  const dir = join(repoRoot, 'runs', rootId, 'artifacts')
  return readdirSync(dir)
    .filter(file => file.endsWith('_summary.json'))
    .map(file => JSON.parse(readFileSync(join(dir, file), 'utf8')) as ArtifactFile)
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim()
}

describe('artifact prose health', () => {
  const artifacts = loadArtifacts('root_2026_05_01')

  it('does not contain known scaffold drift phrases', () => {
    const banned = [
      'the the thing',
      'no one had asked him to name it',
      'before the day was finished',
      'that was apparently who he was now',
      'yy did not say the numbers out loud',
      'one clear place in the wood changed enough to remember',
    ]

    const offenders = artifacts.flatMap(artifact => {
      const narrative = normalize(artifact.content.narrative)
      return banned
        .filter(phrase => narrative.includes(phrase))
        .map(phrase => `${artifact.artifact_id}: ${phrase}`)
    })

    expect(offenders).toEqual([])
  })

  it('does not use title-slot closing sentences', () => {
    const offenders = artifacts.filter(artifact => {
      const title = normalize(artifact.content.title)
      const narrative = normalize(artifact.content.narrative)
      return narrative.includes(`with the ${title} behind him`)
        || narrative.includes(`with the ${title} in the day behind him`)
    })

    expect(offenders.map(a => a.artifact_id)).toEqual([])
  })
})
