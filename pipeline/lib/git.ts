import { execSync } from 'child_process'

function git(repoRoot: string, args: string): string {
  return execSync(`git -C "${repoRoot}" ${args}`, { encoding: 'utf-8' }).trim()
}

export function stageRuns(repoRoot: string): void {
  git(repoRoot, 'add runs/')
}

export function commit(repoRoot: string, message: string): void {
  git(repoRoot, `commit -m ${JSON.stringify(message)}`)
}

export function push(repoRoot: string): void {
  git(repoRoot, 'push')
}

export function hasChanges(repoRoot: string): boolean {
  const status = git(repoRoot, 'status --porcelain runs/')
  return status.length > 0
}
