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
          <button class="btn" data-tab="study" id="tabStudyBtn">📘 Guia de Estudo</button>
          <button class="btn secondary" data-tab="practice" id="tabPracticeBtn">✍️ Sala de Exercícios</button>
          <button class="btn secondary" data-tab="speech" id="tabSpeechBtn">🎧 Laboratório de Fala</button>
        </div>
      </section>

      <section id="tab-study" class="card">
        <div class="section-title">Guia de Estudo</div>
        <div style="margin-top:8px">
          <details class="accordion">
            <summary><span class="section-title" style="margin:0">Voz da narração</span></summary>
            <div style="margin-top:8px">
              <div id="voiceSelector" class="selector" style="gap:6px"></div>
            </div>
          </details>
        </div>
        <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn" id="play">Play</button>
          <button class="btn" id="resume">Resume</button>
          <button class="btn" id="pause">Pause</button>
          <button class="btn" id="stop">Stop</button>
          <button class="btn secondary" data-speed="0.5">0.5x</button>
          <button class="btn secondary" data-speed="1">1x</button>
          <button class="btn secondary" data-speed="1.5">1.5x</button>
          <button class="btn" id="toggleTr">Mostrar/Ocultar tradução</button>
          <span id="audioStatus" class="small" style="align-self:center"></span>
        </div>
        <div id="lines" class="lines" style="margin-top:8px"></div>

        <div class="section-title" style="margin-top:12px">Explicação e Estrutura</div>
        <div id="grammar"></div>
        <div class="section-title" style="margin-top:12px">Vocabulário</div>
        <div id="vocab" class="flash-grid"></div>
        <div class="section-title" style="margin-top:12px">Verbos</div>
        <div id="verbs"></div>
      </section>

      <section id="tab-practice" class="card" style="display:none">
        <div class="section-title">Sala de Exercícios</div>
        <div id="mc"></div>
        <div id="gExercises" style="margin-top:12px"></div>
        <div id="fill" style="margin-top:12px"></div>
        <button class="btn" id="checkFill" style="margin-top:8px">Checar</button>
        <div id="fillResult" class="small" style="margin-top:6px"></div>
      </section>

      <section id="tab-speech" class="card" style="display:none">
        <div class="section-title">Laboratório de Fala</div>
        <div class="small">Prática ativa de pronúncia.</div>
        <div class="section-title" style="margin-top:12px">Treinar pronúncia</div>
        <div id="pronList" class="pron-grid"></div>
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
