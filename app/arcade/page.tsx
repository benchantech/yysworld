import type { Metadata } from 'next'
import Link from 'next/link'
import { games } from './games'

export const metadata: Metadata = {
  title: 'Arcade Room',
  description: 'YY-themed games, starting with two slots and room for more.',
}

export default function ArcadePage() {
  return (
    <main className="arcade-page">
      <Link href="/" className="back-link">YY's World</Link>

      <section className="arcade-room" aria-labelledby="arcade-title">
        <div className="arcade-room__intro">
          <p>Arcade Room</p>
          <h1 id="arcade-title">YY games start here.</h1>
        </div>

        <div className="game-grid" aria-label="Games">
          {games.map((game) => (
            <Link key={game.slug} className="game-slot" href={`/arcade/${game.slug}/`}>
              <h2>{game.title}</h2>
            </Link>
          ))}
        </div>

        <p className="more-games">More games coming.</p>
      </section>
    </main>
  )
}
