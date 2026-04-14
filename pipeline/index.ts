#!/usr/bin/env tsx
/**
 * YY nightly pipeline
 *
 * Commands:
 *   pipeline init [date]   — interactive inbox builder for a target date (default: tomorrow)
 *   pipeline run  [date]   — run the pipeline for a target date (default: yesterday)
 *
 * Examples:
 *   npm run pipeline:init              # queue up tomorrow
 *   npm run pipeline:init 2026-04-16   # queue a specific date
 *   npm run pipeline:run               # process yesterday (used by wakeup.sh)
 *   npm run pipeline:run 2026-04-14    # reprocess a specific date
 */

import { initCommand } from './commands/init'
import { runCommand } from './commands/run'

const [, , command, ...args] = process.argv

switch (command) {
  case 'init':
    await initCommand(args)
    break
  case 'run':
    await runCommand(args)
    break
  default:
    console.error(`Usage: pipeline <init|run> [date]`)
    process.exit(1)
}
