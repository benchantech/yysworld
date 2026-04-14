import { runCommand } from './run'
import { initCommand } from './init'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function yesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export async function goCommand(_args: string[]): Promise<void> {
  // 1. Run yesterday's pipeline (generates, commits, pushes)
  await runCommand([yesterday()])

  // 2. Immediately launch init for today so tomorrow is queued
  console.log('\n' + '─'.repeat(50))
  console.log(`\n  Now queuing tomorrow's content for ${today()}...\n`)
  await initCommand([today()])
}
