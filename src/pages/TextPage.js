export function TextPage(level, index) {
  return `
    <main class="main">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <h2 id="title">Texto ${index} · ${level}</h2>
        <div style="min-width:180px">
          <div class="progress"><div class="bar" id="levelBar" style="width:${Math.min(
            100,
            ((index - 1) / 10) * 100
          )}%"></div></div>
          <div class="small">Progresso ${index - 1}/10</div>
        </div>
      </div>

      <section class="card">
        <details class="accordion">
          <summary class="section-title">Voz da narração</summary>
          <div id="voiceSelector" class="selector" style="gap:6px"></div>
        </details>
      </section>

      <section class="card">
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn" id="play">Play</button>
          <button class="btn" id="resume">Resume</button>
          <button class="btn" id="pause">Pause</button>
          <button class="btn" id="stop">Stop</button>
          <button class="btn secondary" data-speed="0.5">0.5x</button>
          <button class="btn secondary" data-speed="1">1x</button>
          <button class="btn secondary" data-speed="1.5">1.5x</button>
          <button class="btn" id="toggleTr">Mostrar/Ocultar tradução</button>
        </div>
        <div id="lines" class="lines"></div>
      </section>

      <section class="card">
        <details class="accordion">
          <summary class="section-title">Vocabulário</summary>
          <div id="vocab" class="flash-grid"></div>
        </details>
      </section>

      <section class="card">
        <details class="accordion">
          <summary class="section-title">Gramática</summary>
          <div id="grammar"></div>
        </details>
      </section>

      <section class="card">
        <details class="accordion">
          <summary class="section-title">Verbos</summary>
          <div id="verbs"></div>
        </details>
      </section>

      <section class="card">
        <details class="accordion">
          <summary class="section-title">Exercícios – Múltipla escolha</summary>
          <div id="mc"></div>
        </details>
      </section>

      <section class="card">
        <details class="accordion">
          <summary class="section-title">Exercícios – Completar frases</summary>
          <div id="fill"></div>
          <button class="btn" id="checkFill" style="margin-top:8px">Checar</button>
          <div id="fillResult" class="small" style="margin-top:6px"></div>
        </details>
      </section>

      <section class="card">
        <details class="accordion">
          <summary class="section-title">Treinar pronuncia</summary>
          <div id="pronList" class="pron-grid"></div>
        </details>
      </section>

      <div style="margin-top:16px;display:flex;gap:8px">
        <a class="btn secondary" href="#/text/${level}/${Math.max(
          1,
          index - 1
        )}">Anterior</a>
        <a class="btn secondary" id="nextBtn" href="#/text/${level}/${Math.min(
          10,
          index + 1
        )}">Próximo texto</a>
      </div>

      <button id="backToTop" class="btn" style="position:fixed;bottom:20px;right:20px;display:none;">Voltar ao topo</button>
    </main>
  `;
}
