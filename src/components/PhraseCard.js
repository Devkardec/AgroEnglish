export function PhraseCard(p, index) {
  return `
    <div class="card" data-phrase-card="${index}">
      <div><strong>${p.en}</strong></div>
      <div class="small">${p.pt}</div>
      <div style="margin-top:8px; display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="btn" data-action="speak" data-text="${p.en}">Ouvir</button>
        <button class="btn record-btn" data-action="record" data-index="${index}">Gravar</button>
        <button class="btn stop-btn" data-action="stop" data-index="${index}" style="display: none;">Parar</button>
        <button class="btn play-rec-btn" data-action="play-rec" data-index="${index}" style="display: none;">Ouvir Gravação</button>
      </div>
      <audio class="audio-player" id="audio-${index}" style="display: none; width: 100%; margin-top: 8px;" controls></audio>
      <div class="small status" data-status="${index}" style="margin-top: 6px;"></div>
    </div>
  `
}

