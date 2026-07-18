const homepageHtml =
  '<main class="page">\n' +
  '    <div class="top-left-image" aria-label="YY portrait"><img src="/images/yy-portrait.png" alt="YY portrait"></div>\n' +
  '\n' +
  '    <div class="title-container"><div class="brand">YY’s World</div></div>\n' +
  '\n' +
  '    <div class="description-container">\n' +
  '      <p class="tagline">A small stuffed animal, with a big purpose. Take a look at what he’s inspired.</p>\n' +
  '    </div>\n' +
  '\n' +
  '    <section class="cards" aria-label="Website sections">\n' +
  '      <article class="card arcade">\n' +
  '        <svg class="acorn left" viewBox="0 0 24 30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">\n' +
  '          <path d="M12 1 L12 5"></path>\n' +
  '          <path d="M4 10 Q4 5 12 5 Q20 5 20 10 Z"></path>\n' +
  '          <path d="M5 10 Q5 25 12 28 Q19 25 19 10 Z"></path>\n' +
  '        </svg>\n' +
  '        <svg class="acorn right" viewBox="0 0 24 30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">\n' +
  '          <path d="M12 1 L12 5"></path>\n' +
  '          <path d="M4 10 Q4 5 12 5 Q20 5 20 10 Z"></path>\n' +
  '          <path d="M5 10 Q5 25 12 28 Q19 25 19 10 Z"></path>\n' +
  '        </svg>\n' +
  '        <h2>Arcade Room</h2>\n' +
  '        <p>Enjoy games themed with none other than YY!</p>\n' +
  '      </article>\n' +
  '\n' +
  '      <article class="card history">\n' +
  '        <div class="history-inner">\n' +
  '          <h2>History</h2>\n' +
  '          <p>Ever curious about how YY came to be? If so, here’s your happy spot.</p>\n' +
  '        </div>\n' +
  '      </article>\n' +
  '\n' +
  '      <article class="card yy-meaning">\n' +
  '        <h2>What’s YOUR YY?</h2>\n' +
  '        <p>Find out the symbolic meaning of YY and take a look inside, here, to find out what it is.</p>\n' +
  '      </article>\n' +
  '\n' +
  '      <article class="card webcomic">\n' +
  '        <h2>WebComic</h2>\n' +
  '        <p>Look to this place to see YY in his daily trouble! This will make you laugh!</p>\n' +
  '      </article>\n' +
  '    </section>\n' +
  '\n' +
  '    <section class="circle" aria-label="The YY Method">\n' +
  '      <div class="circle-content">\n' +
  '        <div class="circle-title">The<br>YY METHOD</div>\n' +
  '        <svg class="y-symbol" viewBox="0 0 120 110" role="img" aria-label="Y-shaped YY Method symbol">\n' +
  '          <path d="M60 92 L60 55 M60 55 L25 20 M60 55 L95 20" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"></path>\n' +
  '          <circle cx="60" cy="92" r="5" fill="var(--paper)" stroke="currentColor" stroke-width="3"></circle>\n' +
  '          <circle cx="25" cy="20" r="5" fill="var(--paper)" stroke="currentColor" stroke-width="3"></circle>\n' +
  '          <circle cx="95" cy="20" r="5" fill="var(--paper)" stroke="currentColor" stroke-width="3"></circle>\n' +
  '        </svg>\n' +
  '        <p>A decision model,<br>inspired by… you<br>know who. (stop<br>gloating, YY!)</p>\n' +
  '      </div>\n' +
  '    </section>\n' +
  '  </main>'

export default function HomePage() {
  return <div dangerouslySetInnerHTML={{ __html: homepageHtml }} />
}
