import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { games, getGame } from '../games'

type GamePageProps = {
  params: Promise<{ game: string }>
}

export function generateStaticParams() {
  return games.map((game) => ({ game: game.slug }))
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { game: slug } = await params
  const game = getGame(slug)

  if (!game) {
    return {
      title: 'Game not found',
    }
  }

  return {
    title: game.title,
    description: `${game.title} in the YY Arcade Room.`,
  }
}

export default async function GamePage({ params }: GamePageProps) {
  const { game: slug } = await params
  const game = getGame(slug)

  if (!game) {
    notFound()
  }

  return (
    <main className="embedded-game-page">
      <Link href="/arcade/" className="game-back-link">Arcade Room</Link>
      <iframe
        title={game.title}
        src={game.src}
        className="game-frame"
        allow="fullscreen"
      />
    </main>
  )
}
