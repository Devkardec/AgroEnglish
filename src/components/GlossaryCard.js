export function GlossaryCard(item) {
  if (!item) return '';
  const base = String(item.image||'').toLowerCase();
  const hasImage = !!item.image && !base.includes('placehold.co');
  const cat = String(item.category||'').toLowerCase().replace(/\s+/g,'-');
  const imageFront = hasImage
    ? `<img src="${item.image}" alt="${item.term_en}" loading="lazy" decoding="async" onerror="this.onerror=null;this.remove()" />`
    : `<div class="image-fallback cat-${cat}"></div>`;
  const imageBack = hasImage
    ? `<img src="${item.image}" alt="${item.term_pt}" loading="lazy" decoding="async" onerror="this.onerror=null;this.remove()" />`
    : `<div class="image-fallback cat-${cat}"></div>`;

  return `
    <div class="glossary-card-container" data-id="${item.id}" tabindex="0" role="button" aria-label="Flip card / Virar card">
      <div class="glossary-card">
        
        <!-- FRONT (ENGLISH) -->
        <div class="card-face card-front">
            <div class="lang-chip">EN</div>
            <div class="card-image">
                ${imageFront}
            </div>
            <div class="card-header">
                <div class="term-wrapper">
                    <h3>${item.term_en}</h3>
                    <p class="phonetic">${item.phonetic}</p>
                </div>
                <button class="speak-btn" data-term="${item.term_en}" title="Speak term" aria-label="Speak ${item.term_en}">🔊</button>
            </div>
            <div class="card-body">
                <p class="definition">${item.definition_en}</p>
                <hr />
                <p class="example"><strong>Ex:</strong> "${item.example_en}"</p>
            </div>
            <div class="card-category-chip">${item.category}</div>
        </div>

        <!-- BACK (PORTUGUESE) -->
        <div class="card-face card-back">
            <div class="lang-chip">PT</div>
            <div class="card-image">
                ${imageBack}
            </div>
            <div class="card-header">
                <div class="term-wrapper">
                    <h3>${item.term_pt}</h3>
                </div>
            </div>
            <div class="card-body">
                <p class="definition">${item.definition_pt}</p>
                <hr />
                <p class="example"><strong>Ex:</strong> "${item.example_pt}"</p>
            </div>
            <div class="card-category-chip">${item.category}</div>
        </div>

      </div>
    </div>
  `;
}
