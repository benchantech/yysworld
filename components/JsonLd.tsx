/**
 * Injects a JSON-LD <script> block into the page.
 * Accepts a single schema object or an array (for multiple schemas on one page).
 * Usage: <JsonLd schema={schemaBreadcrumbList(items)} />
 */
export function JsonLd({ schema }: { schema: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
