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
        <div class="section-title">Vocabulário</div>
        <div id="vocab" class="flash-grid"></div>
      </section>

      <section class="card">
        <details class="accordion">
          <summary class="section-title">Gramática</summary>
          <div id="grammar"></div>
        </details>
      </section>

      <section class="card">
        <div class="section-title">Verbos</div>
        <div id="verbs" class="small"></div>
      </section>

      <section class="card">
        <div class="section-title">Exercícios – Múltipla escolha</div>
        <div id="mc"></div>
      </section>

      <section class="card">
        <div class="section-title">Exercícios – Completar frases</div>
        <div id="fill"></div>
        <button class="btn" id="checkFill" style="margin-top:8px">Checar</button>
        <div id="fillResult" class="small" style="margin-top:6px"></div>
      </section>

      <section class="card">
        <div class="section-title">Pronúncia</div>
        <div id="speakPrompt" class="small"></div>
        <div class="small" style="margin-top:6px">Treine ouvindo e lendo trechos, grave e depois ouça sua pronúncia.</div>
        <div style="margin-top:10px">
          <button class="btn" id="openPronModal">Treinar pronúncia</button>
        </div>

        <div class="section-title" style="margin-top:12px">Frases do texto</div>
        <div id="pronList" class="pron-grid"></div>
      </section>

      <div class="modal-overlay" id="pronModal" aria-hidden="true">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="pronModalTitle">
          <div class="modal-header">
            <div id="pronModalTitle">Treinar pronúncia</div>
            <button class="btn secondary" id="closePronModal">Fechar</button>
          </div>
          <div class="modal-body">
            <div class="small">Ouça a frase, leia, grave e compare sua pronúncia.</div>
            <div id="pronModalList" class="pron-grid" style="margin-top:12px"></div>
            <div id="recMeter" class="meter"><span></span></div>
            <div id="recStatus" class="small" style="margin-top:8px"></div>
          </div>
          <div class="modal-actions">
            <button class="btn secondary" id="closePronModal2">Fechar</button>
          </div>
        </div>
      </div>

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
