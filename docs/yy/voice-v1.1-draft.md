# YY Voice Register — v1.1 Draft

**Status:** Design draft. Not yet in effect. Introduces with the first root after April 2026.
**Evidence base:** Days 1–2 of root_2026_04_14. The patterns documented here emerged from the first actual artifacts, not from a priori design.
**Purpose:** Codifies what the v1.0 run revealed about how YY's voice actually works, so future pipelines generate from documented pattern rather than inference.

See ADR-029 for the transition plan.

---

## The fundamental shape

YY's voice has a three-beat rhythm that recurs across states:

1. **Short declarative setup** — what is simply true, stated flat
2. **Expansion that earns its length** — one sentence that goes further, earns its complexity
3. **Compression landing** — as short as possible; shorter than you expect

The compression at the end only works because of the expansion before it. You cannot open with compression. You have to build the tension and then cut it.

**Example (Day 1 alt):**
> The sounds were correct. The light was doing what it was supposed to do. There was that specific morning quiet — the kind you only get when you haven't overslept — and somewhere in the back of YY's head, a very small flag went up. Hey. This is fine.

*Short. Short. Long/expanded. Two-word compression kicker.*

**Example (Day 2 main rewrite):**
> The territorial accounting runs fast. How much cached. How much needed. Whether the math of confrontation is worse than the math of losing the site. The math is usually quick, but yesterday was still in the system — and what usually takes a second took three or four.

*Short declaration. Three-part list accelerating. Long sentence that earns its length by showing the drag.*

---

## Sensory priority order

YY reads the environment in this sequence:

1. **Light quality** — before anything else, YY notices what the light is doing. "The light was doing something it shouldn't have been doing yet." The light is always either right or wrong.
2. **Sound texture** — simultaneous with light but secondary. Sounds that are shifted, too quiet, too present.
3. **Physical sensation** — hunger, fatigue, attention level.
4. **Abstract recognition** — only after the physical: "The why was acorns."

Narratives that open on the abstract before the sensory feel wrong for YY. Open in the body first.

---

## Recurring internal figures

These are the stable abstractions YY thinks in. Use them consistently across all artifacts and branches.

| Figure | Meaning | Notes |
|--------|---------|-------|
| **the general situation** | YY's unnamed audience for announcements | Usually receives announcements loudly. Never responds. |
| **the universe** | What YY expects an explanation from | The universe never provides one. This is consistent. |
| **the math** | Any resource or territorial calculation | "The territorial accounting runs fast." "The math is usually quick." |
| **the morning cache window** | The highest-value foraging period | Specific and recurring. Missing it has consequences. |
| **filed somewhere vague / filed for later** | YY's internal storage for unprocessed ideas | "Filed somewhere vague for later." Ideas go here before they become questions. |
| **the question kept running** | An unresolved idea that follows YY into the next day | Day 2 alt: "the question kept running." Different from filing — this one has legs. |

New figures can be introduced but should recur once introduced. A figure that appears once and never again was a metaphor, not a stable part of YY's vocabulary.

---

## State-dependent register

YY's voice changes materially with food and attention levels. The structure is the same (short → expansion → compression), but the execution differs.

### Depleted (food ≤ 0.55 or attention ≤ 0.45)

- Expansions don't fully land — they cut short or acknowledge the cutoff
- The math is visible in the prose: YY is doing calculation you can see
- Eloquence is interrupted, not absent — the randomly_eloquent 0.65 still fires, but gets short-circuited
- Declaratives are flatter, more resigned
- Compression landings are often uncertainty: "Probably." "Or close enough."

**Example:** "The options were still the options. YY held the distance." — two flat declaratives, no expansion, no landing flourish.

### Adequate (food 0.55–0.80, attention 0.50–0.80)

- Full three-beat structure available
- Expansion sentences earn their length
- Compression landings can be wry, not just flat
- YY is willing to follow a thought further before landing it

### Engaged (food > 0.75 and attention > 0.75, or something genuinely interesting)

- Associative thinking gets longer — follows a thread across multiple sentences
- The expansion phase goes one beat further than expected
- Compression is earned and precise, not just short
- The voice can carry an idea forward into the next day: "the question kept running"

**Example (Day 2 alt):** "Yesterday had been about time and observation — whether looking at something changes it. Today's question was different: whether what you make lasts." — this only works from an adequate position. Depleted-YY doesn't follow a philosophical thread; depleted-YY does the math and moves on.

---

## Dialogue rules

YY speaks rarely. When YY speaks, it is:
- Brief (never more than a sentence)
- Announced to something that won't respond (the general situation, the universe)
- Capitalized as its own paragraph
- Never followed by a dialogue tag — just the announcement

**Pass:** `"Oh MAN." / This was announced to the general situation. Loudly.`
**Fail:** `"Oh man," YY said. "That was really annoying."`

The absence of a response is part of the format. YY says something; nothing responds; YY continues.

---

## How world events enter the narrative

World events (real-world anchors) must arrive through something YY physically encounters, not through a sentence that names the event.

**Fail:** "Someone mentioned World Art Day. Something about making things."
**Pass:** "There was a fence post nearby with marks scratched into it. Someone had taken the effort to make something in a specific place, and what they'd made was still there."

The event enters through the physical object it produces in YY's world. The meaning can then unfold — YY can think about it — but the entry point is always sensory.

---

## Voice failure boundaries

Parallel to the character's failure boundaries, but for the prose register. These produce writing that sounds wrong for YY.

| Pattern | Why it fails |
|---------|-------------|
| **Sentimental** | YY describes difficulty without softening it. No "bittersweet," no "poignant." |
| **Self-pitying** | YY complains to the universe, not to the reader. The reader is never recruited for sympathy. |
| **Constantly clever** | randomly_eloquent is 0.65, not 1.0. The cleverness should be occasional and then cut off, not sustained. |
| **Explanatory** | YY doesn't explain what a feeling IS. YY shows what it does to the math, the pace, the options. |
| **Recycled closers** | A structural device from the previous day's ending cannot appear the next day. Earn each landing independently. |
| **Abstract event entry** | See above. World events do not announce themselves. |
| **Overwrought precision** | "The kind of [X] that [elaborate description]" — this pattern becomes visible as a formula fast. Use it once; retire it. |

---

## Reference artifacts

These are the cleanest examples of the voice working correctly. Use them for calibration.

**Day 1 alt — "Nothing to Announce"**
> Acorns happened. On time. While still good.

*Three sentences. Each tighter than the last. The "while still good" earns its place by being the exactly right qualifier.*

**Day 1 alt — noticing something**
> YY noticed this approximately three seconds after waking up, in the same cautious way you notice when a bus actually arrives on time: with mild suspicion, like something is probably about to go wrong to compensate.

*Long expansion that earns its length because the simile is specific and unexpected.*

**Day 1 main — the announcement**
> "Oh MAN."
>
> This was announced to the general situation. Loudly. It assumed the universe owed an explanation.
>
> The universe did not provide one.

*The format: speech, meta-description of the speech, the lack of response. Three beats.*

**Day 2 main rewrite — depleted math**
> The territorial accounting runs fast. How much cached. How much needed. Whether the math of confrontation is worse than the math of losing the site. The math is usually quick, but yesterday was still in the system — and what usually takes a second took three or four.

*The list of three fragments accelerates the tension; the long final sentence shows the drag by enacting it.*

**Day 2 alt rewrite — the question**
> No answer that arrived today. But the question kept running.

*The compression works because of the length of the expansion that precedes it across the whole paragraph.*

---

## Fill-in sections for v1.1

These sections are placeholders for patterns that need more artifact evidence before they can be documented confidently. Fill in as the first full root completes.

**YY in extended sequences** — How does the voice sustain across a 200+ word passage without structural tricks? This needs more artifact evidence.

**YY noticing other animals** — Day 2 introduced another squirrel. The "very specific ears — alert without being twitchy" pattern is a start. More examples needed before it can be codified.

**YY across seasons** — The voice in winter vs. spring vs. summer may differ. Seasonal register changes need at least 2 months of artifacts to document.

**YY and sound** — Music is a core value (3rd in the list). No artifact has shown YY encountering music yet. The voice pattern for that encounter is undocumented.
