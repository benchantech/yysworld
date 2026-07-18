export const games = [
  {
    slug: 'acorn-quest',
    title: 'Acorn Quest',
    src: '/arcade-games/acorn-quest/',
  },
  {
    slug: 'tag-quest',
    title: 'Tag Quest',
    src: '/arcade-games/tag-quest/',
  },
]

export function getGame(slug: string) {
  return games.find((game) => game.slug === slug)
}
