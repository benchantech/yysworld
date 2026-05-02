// ─── Inbox / Queue ────────────────────────────────────────────────────────────

export interface InboxEntry {
  schema_version: '0.1'
  date: string                                        // "2026-04-15"
  event_hint?: string                                 // "tax day" — one sentence
  notes?: string                                      // day-level tone/intent
  author_intent?: string                              // multi-day arc direction
  branch_context?: Record<string, string>             // branchId → guidance
  branch_decision?: 'approve' | 'deny' | 'suggest' | null
  is_default?: boolean                                // placeholder, overridable
}

// ─── Context passed to generators ────────────────────────────────────────────

export interface Baseline {
  character_id: string
  voice_version?: string                // ADR-034 / ADR-039 — names docs/voice/{voice_version}.md
  core_traits: Record<string, number>
  values: string[]
  failure_boundaries: string[]
  default_reactions: Record<string, string>
  identity_rules: Record<string, string>
}

// Inventory entry — minimum is { id, label }; richer fields optional. (See ADR-038.)
export interface BranchInventoryEntry {
  id: string
  label: string
  acquired_day?: number
  tradeable?: boolean
  notes?: string
}

export interface BranchState {
  story_day: number
  condition: { health: number; food: number; attention: number }
  inventory: BranchInventoryEntry[]
  active_burdens: string[]
  goals: { primary: string; secondary: string }
  reaction_overrides: Record<string, string>
  trait_deviations: Record<string, number>
  identity_notes: string[]
}

// ─── World seed (ADR-038, world v2.0+) ───────────────────────────────────────

export interface WorldSeedNeighbor {
  id: string
  name: string
  species: string
  role: string
  disposition: string
  territory_relationship: string
  notes: string
}

export interface WorldSeedScheduleEntry {
  days: string                          // "1-3", "4-8", inclusive range
  season: string
  weather: string
  food_pressure: number
  daylight: string
}

export interface WorldSeedItem {
  id: string
  label: string
  description: string
  rarity: string
  found_at: string
  interaction_unlocks: string[]
}

export interface WorldSeed {
  schema_version: string
  world_version: string
  seed_id: string
  root_id: string
  period: string
  authored_at: string
  world_kind: {
    register: string
    tone_anchor: string
    violence_rule: string
    speech_rule: string
  }
  geography: {
    region_anchor: string
    home_base: { id: string; label: string; description: string; source?: string }
    named_places: Array<{
      id: string; label: string; type: string; description: string; status: string; notes?: string
    }>
    territory_notes: string
  }
  society: {
    capability: string
    customs: string[]
    neighbors: WorldSeedNeighbor[]
  }
  economy: {
    currencies: Array<{ type: string; examples: string[]; use: string }>
    exchange_norms: string
    advancement: string
  }
  mobility: {
    method: string
    constraints: string
  }
  seasonal_arc: {
    compression: string
    weather_register: string
    schedule: WorldSeedScheduleEntry[]
  }
  inventory_catalog: {
    items: WorldSeedItem[]
  }
  starting_conditions: {
    food: number
    health: number
    attention: number
    active_burdens: string[]
    starting_inventory: Record<string, string[]>   // branchUrlId → catalog item ids
    identity_notes: string[]
  }
  atmosphere: {
    one_line: string
    recurring_elements: string[]
    what_this_month_costs: string
    what_this_month_offers: string
  }
  authorial_intent: {
    arc_direction: string
    questions_to_track: string[]
    branch_hypothesis: string
  }
}

export interface BranchMeta {
  branchId: string          // "branch_root_2026_04_14_main"
  urlId: string             // "main", "alt1-on-time"
  parentBranchId: string | null
  publishedDays: number
  currentState: BranchState
}

export interface DayRecord {
  date: string
  storyDay: number
  // Snapshot state_after per branch (for continuity context)
  stateAfter: Record<string, BranchState>
  // Artifact summaries per branch (for style/tone context)
  summaries: Record<string, string>
  narrativeSnippets: Record<string, string>  // first ~200 chars of narrative
}

export interface RunContext {
  rootId: string
  runDate: string
  runsDir: string
  rootDir: string
  baseline: Baseline
  worldSeed: WorldSeed | null   // null when no v2.0+ seed is present
  voiceText: string | null      // raw markdown of docs/voice/{voice_version}.md
  branches: BranchMeta[]
  recentDays: DayRecord[]       // last 7 published days, oldest first
  recentAuthorIntent: string | null
}

// ─── Generated output types ───────────────────────────────────────────────────

export interface GeneratedEvent {
  event_type: string
  canonical_truth: {
    summary: string
    entities: string[]
    location: string
    concrete_outcome: string
  }
  perception_prompt: {
    noticeable_surface: string
    ambiguity_level: number
  }
  tags: string[]
  authorial_note: {
    real_world_inspiration: string
    translation_logic: string
    restraint_reason: string
  }
}

export interface GeneratedStateAfter {
  condition: { health: number; food: number; attention: number }
  inventory: BranchInventoryEntry[]
  active_burdens: string[]
  goals: { primary: string; secondary: string }
  reaction_overrides: Record<string, string>
  trait_deviations: Record<string, number>
  identity_notes: string[]
}

export interface GeneratedSnapshot {
  state_before: BranchState
  state_after: GeneratedStateAfter
  change_summary: {
    notable_shift: string
    branch_created: boolean
  }
}

export interface GeneratedArtifact {
  title: string
  tone: string
  narrative: string
  state_note: string
  summary: string
  state_delta: Record<string, string>
}

export interface BranchEvaluation {
  should_branch: boolean
  confidence: number            // 0–1
  suggested_name: string        // "alt{N}-{descriptor}" — empty if no branch
  reason: string
  branching_focus: string
}

export interface GeneratedComparison {
  divergence_summary: string   // one paragraph: what the fork point was and why it matters
  branch_a_path: string        // one sentence: what branch A's day looked like
  branch_b_path: string        // one sentence: what branch B's day looked like
  key_differences: string[]    // 2–3 concrete differences
  shared_elements: string[]    // what both branches still have in common
}

export interface InitSuggestions {
  event_hint: string
  notes: string
  branch_suggestions: Record<string, string>
  branch_decision_suggestion: 'approve' | 'deny' | 'suggest' | null
  branch_decision_reason: string
}
