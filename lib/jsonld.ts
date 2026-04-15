/**
 * JSON-LD schema generators for yysworld.
 * Priority order per ADR-021: BreadcrumbList everywhere, Article on snapshots,
 * Dataset on compare pages, Person on character pages, WebSite on home.
 */

import { BASE_URL } from '@/lib/nav'
import type { BreadcrumbItem } from '@/lib/nav'

// ─── BreadcrumbList ───────────────────────────────────────────────────────────
// ADR-021: on every page — signals page hierarchy to crawlers

export function schemaBreadcrumbList(items: BreadcrumbItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${BASE_URL}${item.href}` } : {}),
    })),
  }
}

// ─── WebSite ─────────────────────────────────────────────────────────────────
// ADR-021: home page only, with SearchAction

export function schemaWebSite(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'yysworld',
    url: BASE_URL,
    description:
      'Same being, different paths. Watch how YY responds to the same world under different circumstances — branching, diverging, drifting over time.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/yy/{runDate}/{branch}/day/{day}`,
      },
      'query-input': 'required name=runDate name=branch name=day',
    },
  }
}

// ─── Person (fictional) ───────────────────────────────────────────────────────
// ADR-021: character pages — noted as fictional

export function schemaCharacterPerson(
  name: string,
  url: string,
  description: string,
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url: `${BASE_URL}${url}`,
    description,
    // Noted as fictional per ADR-021 schema map
    additionalProperty: {
      '@type': 'PropertyValue',
      name: 'characterType',
      value: 'fictional',
    },
  }
}

// ─── Article ─────────────────────────────────────────────────────────────────
// ADR-021: snapshot/artifact pages
// headline from change_summary.notable_shift, datePublished from snapshot_date

export interface ArticleSchemaInput {
  headline: string
  datePublished: string // ISO date string
  pageUrl: string       // relative URL
  aboutName: string     // character name
  aboutUrl: string      // relative URL of character page
}

export function schemaArticle(input: ArticleSchemaInput): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    datePublished: input.datePublished,
    author: {
      '@type': 'Person',
      name: 'Ben Chan',
    },
    about: {
      '@type': 'Person',
      name: input.aboutName,
      url: `${BASE_URL}${input.aboutUrl}`,
    },
    url: `${BASE_URL}${input.pageUrl}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'yysworld',
      url: BASE_URL,
    },
  }
}

// ─── Dataset ─────────────────────────────────────────────────────────────────
// ADR-021: compare pages only — signals structured comparison content to Google
// variableMeasured: (hunger, attention, active_burdens) per ADR-021

export interface DatasetSchemaInput {
  name: string
  description: string
  pageUrl: string // relative URL
}

const BRANCH_VARIABLES = ['food', 'health', 'attention', 'active_burdens']

export function schemaDataset(input: DatasetSchemaInput): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: input.name,
    description: input.description,
    url: `${BASE_URL}${input.pageUrl}`,
    creator: {
      '@type': 'Person',
      name: 'Ben Chan',
    },
    variableMeasured: BRANCH_VARIABLES.map((v) => ({
      '@type': 'PropertyValue',
      name: v,
    })),
  }
}
