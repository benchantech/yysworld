import * as readline from 'readline'
import { loadContext } from '../lib/context'
import { readInbox, writeInbox, listQueuedDates } from '../lib/inbox'
import { suggestInitFields } from '../lib/generate'
import type { InboxEntry } from '../lib/types'

const REPO_ROOT = new URL('../../', import.meta.url).pathname.replace(/\/$/, '')

function tomorrow(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

async function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise(resolve => rl.question(question, resolve))
}

async function ask(
  rl: readline.Interface,
  label: string,
  suggestion: string,
  hint?: string,
): Promise<string | null> {
  const suggestionDisplay = suggestion ? `\x1b[2m[${suggestion}]\x1b[0m` : '\x1b[2m[leave blank — LLM decides]\x1b[0m'
  const hintDisplay = hint ? ` \x1b[2m(${hint})\x1b[0m` : ''
  process.stdout.write(`\n  \x1b[36m${label}\x1b[0m${hintDisplay}\n  ${suggestionDisplay}\n  › `)
  const answer = await prompt(rl, '')
  if (answer.trim() === '') return null       // blank = accept suggestion (LLM decides)
  if (answer.trim() === 'clear') return ''    // 'clear' = explicit empty (remove field)
  return answer.trim()
}

async function askAuthorIntent(
  rl: readline.Interface,
  carrying: string | null,
): Promise<string | undefined> {
  const hint = carrying
    ? `type to change, 'clear' to drop, enter to keep`
    : `type to set, enter to skip`
  const display = carrying
    ? `\x1b[2mcarrying → "${carrying}"\x1b[0m`
    : `\x1b[2m[none — enter to skip]\x1b[0m`
  process.stdout.write(`\n  \x1b[36mauthor intent\x1b[0m \x1b[2m(multi-day arc)\x1b[0m \x1b[2m(${hint})\x1b[0m\n  ${display}\n  › `)
  const answer = await prompt(rl, '')
  if (answer.trim() === '') return undefined        // keep carrying (don't write to file)
  if (answer.trim() === 'clear') return ''          // explicit clear
  return answer.trim()
}

export async function initCommand(args: string[]): Promise<void> {
  const targetDate = args[0] ?? tomorrow()

  const ctx = loadContext(REPO_ROOT, targetDate)
  if (!ctx) {
    console.error('No active run found.')
    process.exit(1)
  }

  const existing = readInbox(ctx.rootDir, targetDate)
  if (existing) {
    console.log(`\n  Already queued for ${targetDate}. Edit ${ctx.rootDir}/inbox/${targetDate}.json directly, or continue to overwrite.\n`)
  }

  // Show queued dates
  const queued = listQueuedDates(ctx.rootDir)
  if (queued.length > 0) {
    console.log(`\n  \x1b[2mCurrently queued: ${queued.join(', ')}\x1b[0m`)
  }

  process.stdout.write(`\n  Thinking about ${targetDate}...\n`)

  // Pre-fetch all suggestions before asking anything
  const suggestions = await suggestInitFields(targetDate, ctx)

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

  console.log('\n' + '─'.repeat(50))

  const eventHint = await ask(rl, 'event hint', suggestions.event_hint)
  const notes = await ask(rl, 'notes', suggestions.notes, 'day-level tone/intent')
  const authorIntentInput = await askAuthorIntent(rl, ctx.recentAuthorIntent)

  // Branch context — one question per active branch
  const branchContext: Record<string, string> = {}
  for (const branch of ctx.branches) {
    const suggestion = suggestions.branch_suggestions[branch.urlId] ?? ''
    const input = await ask(rl, `${branch.urlId}`, suggestion, 'branch narrative seed')
    if (input !== null) branchContext[branch.urlId] = input || suggestion
    else if (suggestion) branchContext[branch.urlId] = suggestion
  }

  // Branch decision
  const decisionSuggestion = suggestions.branch_decision_suggestion
  const decisionDisplay = decisionSuggestion
    ? `${decisionSuggestion} — ${suggestions.branch_decision_reason}`
    : `none — ${suggestions.branch_decision_reason}`
  const decisionInput = await ask(
    rl,
    'branch signal',
    decisionDisplay,
    'approve / deny / suggest / enter for none',
  )

  rl.close()

  // Build the entry
  const entry: InboxEntry = { schema_version: '0.1', date: targetDate }
  if (eventHint !== null) entry.event_hint = eventHint || suggestions.event_hint
  if (notes !== null) entry.notes = notes || suggestions.notes
  if (authorIntentInput !== undefined) {
    if (authorIntentInput === '') {
      // explicit clear — write empty string to signal "no intent from here"
      entry.author_intent = ''
    } else {
      entry.author_intent = authorIntentInput
    }
  }
  if (Object.keys(branchContext).length > 0) entry.branch_context = branchContext

  if (decisionInput !== null) {
    const v = (decisionInput || '').toLowerCase()
    if (['approve', 'deny', 'suggest'].includes(v)) {
      entry.branch_decision = v as 'approve' | 'deny' | 'suggest'
    }
  } else if (decisionSuggestion) {
    entry.branch_decision = decisionSuggestion
  }

  writeInbox(ctx.rootDir, entry)

  console.log(`\n  \x1b[32m✓\x1b[0m Saved → ${ctx.rootDir}/inbox/${targetDate}.json\n`)
}
