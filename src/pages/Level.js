import { PhraseCard } from '../components/PhraseCard.js'

function pathFor(level) {
  return `/src/data/texts/${level}/basic.json`
}

export function Level(level) {
  return `
    <main class="main">
      <section class="card" style="margin-bottom:16px">
        <div class="section-title">Escolha o texto</div>
        <div id="textList" class="levels-grid"></div>
      </section>

      <section class="level-hero">
        <h2 class="title">Nível ${level}</h2>
        <p class="desc">Conteúdos práticos alinhados ao nível ${level}. Agricultura, pecuária, veterinária e máquinas com vocabulário técnico.</p>
        <div class="actions">
          <a class="btn" href="#/text/${level}/1">Começar</a>
        </div>
        <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="150" width="216" height="40" rx="12" fill="#fff"/><rect x="40" y="120" width="80" height="30" rx="8" fill="#fff"/><circle cx="70" cy="150" r="28" fill="#fff"/></svg>
      </section>
      <div id="phrases" class="grid"></div>
      <div class="small" style="margin-top:8px">Toque em Speak para ouvir com voz nativa.</div>
      
      <div style="margin-top:16px">
        <a class="btn secondary" href="#/level/A1">A1</a>
        <a class="btn secondary" href="#/level/A2">A2</a>
        <a class="btn secondary" href="#/level/B1">B1</a>
        <a class="btn secondary" href="#/level/B2">B2</a>
        <a class="btn secondary" href="#/level/C1">C1</a>
        <a class="btn secondary" href="#/level/C2">C2</a>
      </div>
    </main>
  `
}
