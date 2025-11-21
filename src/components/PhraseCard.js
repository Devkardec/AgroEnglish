export function PhraseCard(p, index) {
  return `
    <div class="card" data-phrase-card="${index}">
      <div><strong>${p.en}</strong></div>
      <div class="small">${p.pt}</div>
      <div style="margin-top:8px; display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="btn" data-action="speak" data-text="${p.en}" aria-label="Ouvir frase">Ouvir</button>
        <button class="btn record-btn" data-action="record" data-index="${index}" aria-label="Gravar sua pronúncia">Gravar</button>
        <button class="btn stop-btn" data-action="stop" data-index="${index}" style="display: none;" aria-label="Parar gravação">Parar</button>
        <button class="btn play-rec-btn" data-action="play-rec" data-index="${index}" style="display: none;" aria-label="Ouvir gravação">Ouvir Gravação</button>
      </div>
      <audio class="audio-player" id="audio-${index}" style="display: none; width: 100%; margin-top: 8px;" controls aria-label="Reprodutor de áudio"></audio>
      <div class="small status" data-status="${index}" style="margin-top: 6px;" role="status" aria-live="polite"></div>
    </div>
  `
}
