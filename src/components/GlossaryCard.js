export function GlossaryCard(item) {
  if (!item) return '';
  
  const base = String(item.image||'').toLowerCase();
  const hasImage = !!item.image && !base.includes('placehold.co');
  
  // Ícones por categoria
  const categoryIcons = {
    Machinery: '🚜',
    Crops: '🌾',
    Veterinary: '🐄',
    Irrigation: '💧',
    Soil: '🌱',
    Safety: '🛡️'
  };
  
  // Cores de gradiente por categoria (baseadas no verde padronizado)
  const categoryGradients = {
    Machinery: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.08) 100%)',
    Crops: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(4, 120, 87, 0.06) 100%)',
    Veterinary: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(6, 95, 70, 0.1) 100%)',
    Irrigation: 'linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(5, 150, 105, 0.07) 100%)',
    Soil: 'linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(4, 120, 87, 0.08) 100%)',
    Safety: 'linear-gradient(135deg, rgba(16, 185, 129, 0.13) 0%, rgba(6, 95, 70, 0.07) 100%)'
  };
  
  const categoryIcon = categoryIcons[item.category] || '📚';
  const categoryGradient = categoryGradients[item.category] || categoryGradients.Machinery;
  
  const imageFront = hasImage
    ? `<div class="card-image-wrapper">
        <img src="${item.image}" alt="${item.term_en}" loading="lazy" decoding="async" onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'image-fallback cat-${item.category.toLowerCase()}\\'><span class=\\'fallback-icon\\'>${categoryIcon}</span></div>'" />
        <div class="image-overlay"></div>
      </div>`
    : `<div class="image-fallback cat-${item.category.toLowerCase()}">
        <span class="fallback-icon">${categoryIcon}</span>
      </div>`;
  
  const imageBack = hasImage
    ? `<div class="card-image-wrapper">
        <img src="${item.image}" alt="${item.term_pt}" loading="lazy" decoding="async" onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'image-fallback cat-${item.category.toLowerCase()}\\'><span class=\\'fallback-icon\\'>${categoryIcon}</span></div>'" />
        <div class="image-overlay"></div>
      </div>`
    : `<div class="image-fallback cat-${item.category.toLowerCase()}">
        <span class="fallback-icon">${categoryIcon}</span>
      </div>`;

  return `
    <div class="glossary-card-container" data-id="${item.id}" data-category="${item.category}" tabindex="0" role="button" aria-label="Flip card / Virar card">
      <div class="glossary-card">
        
        <!-- FRONT (ENGLISH) -->
        <div class="card-face card-front">
          <div class="card-header-modern">
            <div class="lang-badge lang-badge-en">
              <span class="lang-text">EN</span>
            </div>
            <button class="speak-btn-modern" data-term="${item.term_en}" title="Pronunciar termo" aria-label="Pronunciar ${item.term_en}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            </button>
          </div>
          
          <div class="card-image-modern">
            ${imageFront}
          </div>
          
          <div class="card-content-modern">
            <div class="term-section">
              <h3 class="term-title">${item.term_en}</h3>
              <p class="phonetic-modern">${item.phonetic}</p>
            </div>
            
            <div class="definition-section">
              <p class="definition-modern">${item.definition_en}</p>
            </div>
            
            <div class="example-section">
              <div class="example-label">Exemplo</div>
              <p class="example-modern">"${item.example_en}"</p>
            </div>
          </div>
          
          <div class="card-footer-modern">
            <div class="category-badge-modern" style="background: ${categoryGradient}">
              <span class="category-icon">${categoryIcon}</span>
              <span class="category-text">${item.category}</span>
            </div>
            <div class="flip-hint">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 19V5M5 12l7-7 7 7"/>
              </svg>
              <span>Clique para tradução</span>
            </div>
          </div>
        </div>

        <!-- BACK (PORTUGUESE) -->
        <div class="card-face card-back">
          <div class="card-header-modern">
            <div class="lang-badge lang-badge-pt">
              <span class="lang-text">PT</span>
            </div>
          </div>
          
          <div class="card-image-modern">
            ${imageBack}
          </div>
          
          <div class="card-content-modern">
            <div class="term-section">
              <h3 class="term-title term-title-pt">${item.term_pt}</h3>
            </div>
            
            <div class="definition-section">
              <p class="definition-modern">${item.definition_pt}</p>
            </div>
            
            <div class="example-section">
              <div class="example-label">Exemplo</div>
              <p class="example-modern">"${item.example_pt}"</p>
            </div>
          </div>
          
          <div class="card-footer-modern">
            <div class="category-badge-modern" style="background: ${categoryGradient}">
              <span class="category-icon">${categoryIcon}</span>
              <span class="category-text">${item.category}</span>
            </div>
            <div class="flip-hint">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M19 12l-7 7-7-7"/>
              </svg>
              <span>Clique para inglês</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}
