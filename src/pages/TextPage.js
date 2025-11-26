export function TextPage(level, index) {
  return `
    <main class="main">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <h2 id="title">Texto ${index} · ${level}</h2>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="min-width:180px">
            <div class="progress"><div class="bar" id="levelBar" style="width:${Math.min(
              100,
              ((index - 1) / 12) * 100
            )}%"></div></div>
            <div class="small" id="progressLabel">Progresso ${index - 1}/12</div>
          </div>
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
        <div id="grammarVideo" style="margin-top:0;display:none"></div>
        <div id="slideLessonRoot" style="margin-top:12px"></div>
        <div class="section-title" style="margin-top:12px">Texto narrado</div>
        <div class="section-title">Guia de Estudo</div>
        <div class="section-title" style="margin-top:12px">Explicação e Estrutura</div>
        <div id="grammar"></div>
        <div class="section-title" style="margin-top:12px">Vocabulário</div>
        <div id="vocab" class="flash-grid"></div>
        <div class="section-title" style="margin-top:12px">Vocabulário (Pronúncia)</div>
        <div id="vocabTable"></div>
        <section class="card" id="study-footer" style="margin-top:16px">
          <div style="margin-top:8px">
            <details class="accordion">
              <summary><span class="section-title" style="margin:0">Voz da narração</span></summary>
              <div style="margin-top:8px">
                <div id="voiceSelector" class="selector" style="gap:6px"></div>
              </div>
            </details>
          </div>
          <div class="player" style="margin-top:8px">
            <div class="player-controls">
              <button class="player-btn" id="playerBack" title="Voltar 10s"><svg viewBox="0 0 24 24"><path d="M11 18l-8-6 8-6v12zm10 0l-8-6 8-6v12z"/></svg></button>
              <button class="player-btn" id="playerPlay" title="Play/Pause"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7-11-7z"/></svg></button>
              <button class="player-btn" id="playerPause" title="Pausar"><svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg></button>
              <button class="player-btn" id="playerStop" title="Parar"><svg viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg></button>
              <button class="player-btn" id="playerFwd" title="Avançar 10s"><svg viewBox="0 0 24 24"><path d="M5 6l8 6-8 6V6zm10 0l8 6-8 6V6z"/></svg></button>
              <button class="player-btn" id="playerPrevSent" title="Frase anterior"><svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3 6l9 6V6l-9 6z"/></svg></button>
              <button class="player-btn" id="playerNextSent" title="Próxima frase"><svg viewBox="0 0 24 24"><path d="M16 6h2v12h-2zM6 18l9-6-9-6v12z"/></svg></button>
              <span id="playerSent" class="small" style="min-width:64px;text-align:center">0/0</span>
              <select id="playerRate" class="player-rate" title="Velocidade">
                <option value="0.75">0.75x</option>
                <option value="1">1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
              </select>
              <input id="playerVol" class="player-vol" type="range" min="0" max="1" step="0.05" value="1" title="Volume" />
              <button class="btn" id="toggleTr" style="align-self:center;margin:8px auto">Mostrar/Ocultar tradução</button>
            </div>
            <div class="player-track">
              <input id="playerSeek" class="player-seek" type="range" min="0" max="100" step="0.1" value="0" />
              <span id="playerTime" class="small player-time">00:00 / 00:00</span>
            </div>
          </div>
          <div id="lines" class="lines" style="margin-top:8px"></div>
        </section>
      </section>


      <section id="tab-practice" class="card" style="display:none">
        <div class="section-title">Sala de Exercícios</div>
        <div id="exercisePageRoot" style="margin-top:8px"></div>
        <div id="gameTop" style="margin-bottom:12px"></div>
        <div id="mc"></div>
        <div id="gExercises" style="margin-top:12px"></div>
        <div class="section-title" style="margin-top:12px">Exercícios A1 (capítulo)</div>
        <div id="a1ex" style="margin-top:8px"></div>
        <div id="fill" style="margin-top:12px"></div>
        <button class="btn" id="checkFill" style="margin-top:8px">Checar</button>
        <div id="fillResult" class="small" style="margin-top:6px"></div>
      </section>

      <section id="tab-speech" class="card" style="display:none">
        <div class="section-title">Laboratório de Fala</div>
        <div class="small">Prática ativa de pronúncia.</div>
        <div class="section-title" style="margin-top:12px">Treinar pronúncia</div>
        <div id="pronList" class="pron-grid"></div>
        <div class="section-title" style="margin-top:12px">Narrar texto completo</div>
        <div id="fullSpeechText" class="lines" style="margin-top:8px"></div>
        <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn sm" id="fullPlayOrig" style="white-space:nowrap">Ouvir narração original</button>
          <button class="btn danger sm" id="fullRecord" style="white-space:nowrap">Gravar minha narração</button>
          <button class="btn secondary sm" id="fullStop" style="white-space:nowrap">Parar</button>
          <button class="btn secondary sm" id="fullPlayMine" style="white-space:nowrap">Ouvir minha narração</button>
          <button class="btn secondary sm" id="fullDownload" style="white-space:nowrap">Baixar minha narração</button>
          <button class="btn secondary sm" id="fullCompare" style="white-space:nowrap">Comparar</button>
        </div>
        <div id="recMeter" class="meter" style="margin-top:8px"><span style="display:block;height:6px;background:var(--primary);width:0%"></span></div>
        <audio id="fullOrigAudio" style="display:none;width:100%;margin-top:8px" controls></audio>
        <audio id="fullMyAudio" style="display:none;width:100%;margin-top:6px" controls></audio>
        <div id="fullCompareResult" class="small" style="margin-top:6px"></div>
      </section>

      <div style="margin-top:16px;display:flex;gap:8px">
        <a class="btn secondary" href="#/text/${level}/${Math.max(
          1,
          index - 1
        )}">Anterior</a>
        <a class="btn secondary" id="nextBtn" href="#/text/${level}/${Math.min(
          12,
          index + 1
        )}">Próximo texto</a>
      </div>

      

      <button id="backToTop" class="btn" style="position:fixed;bottom:20px;right:20px;display:none;border-radius:999px;width:46px;height:46px;padding:0;display:none" aria-label="Voltar ao topo" title="Voltar ao topo">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style="display:block;margin:auto">
          <path d="M12 2l3 6h-2v7l-4-2v-5H9l3-6z" />
        </svg>
      </button>
    </main>
  `;
}
