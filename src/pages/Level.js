import { PhraseCard } from '../components/PhraseCard.js'

function pathFor(level) {
  return `/src/data/texts/${level}/basic.json`
}

export function Level(level) {
  return `
    <main class="main">
      <section class="level-hero">
        <h2 class="title">Nível ${level}</h2>
        <p class="desc">Conteúdos práticos alinhados ao nível ${level}. Agricultura, pecuária, veterinária e máquinas com vocabulário técnico.</p>
        <div class="actions">
          <a class="btn" href="#/text/${level}/1">Começar</a>
        </div>
        <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="150" width="216" height="40" rx="12" fill="#fff"/><rect x="40" y="120" width="80" height="30" rx="8" fill="#fff"/><circle cx="70" cy="150" r="28" fill="#fff"/></svg>
      </section>

      <section class="card" style="margin-bottom:16px">
        <div class="section-title">Escolha o texto</div>
        <div id="textList" class="levels-grid"></div>
      </section>
      <div id="phrases" class="grid"></div>
      <div class="small" style="margin-top:8px">Toque em Speak para ouvir com voz nativa.</div>
      
      <section class="card" style="margin-top:16px">
        <div class="section-title" style="text-align:center">Navegar por níveis</div>
        <div class="levels-grid">
          <a class="level-card" href="#/level/A1">
            <span class="title" style="text-align:center">A1 – Iniciante</span>
            <span class="small" style="display:block;text-align:center">Consegue entender e usar frases simples do dia a dia.</span>
          </a>
          <a class="level-card" href="#/level/A2">
            <span class="title" style="text-align:center">A2 – Básico</span>
            <span class="small" style="display:block;text-align:center">Consegue lidar com situações simples e comunicar necessidades imediatas.</span>
          </a>
          <a class="level-card" href="#/level/B1">
            <span class="title" style="text-align:center">B1 – Intermediário</span>
            <span class="small" style="display:block;text-align:center">Consegue se virar em viagens, falar sobre experiências e dar opiniões simples.</span>
          </a>
          <a class="level-card" href="#/level/B2">
            <span class="title" style="text-align:center">B2 – Intermediário avançado</span>
            <span class="small" style="display:block;text-align:center">Consegue participar de conversas mais complexas e compreender textos detalhados.</span>
          </a>
          <a class="level-card" href="#/level/C1">
            <span class="title" style="text-align:center">C1 – Avançado</span>
            <span class="small" style="display:block;text-align:center">Consegue se expressar de forma fluente e espontânea, em contextos acadêmicos ou profissionais.</span>
          </a>
          <a class="level-card" href="#/level/C2">
            <span class="title" style="text-align:center">C2 – Proficiência</span>
            <span class="small" style="display:block;text-align:center">Nível próximo ao de um falante nativo; entende praticamente tudo e comunica com precisão.</span>
          </a>
        </div>
      </section>
    </main>
  `
}
