import vocabularyData from '../data/vocabularyData.js';
import { GlossaryCard } from '../components/GlossaryCard.js';

export function Glossary() {
  const categories = ['All', ...new Set(vocabularyData.map(item => item.category))];
  const saved = localStorage.getItem('glossaryCategory') || 'All';
  const savedQuery = localStorage.getItem('glossaryQuery') || '';
  const savedSort = localStorage.getItem('glossarySort') || 'az';
  
  const categoryPt = {
    All: 'Todos',
    Machinery: 'Maquinário',
    Crops: 'Culturas',
    Veterinary: 'Veterinária',
    Irrigation: 'Irrigação',
    Soil: 'Solo',
    Safety: 'Segurança'
  };
  
  const categoryIcons = {
    All: '📚',
    Machinery: '🚜',
    Crops: '🌾',
    Veterinary: '🐄',
    Irrigation: '💧',
    Soil: '🌱',
    Safety: '🛡️'
  };

  // Generate the HTML for the filter buttons
  const filterButtonsHTML = categories.map(category => `
    <button
      class="filter-btn-modern ${category === saved ? 'active' : ''}"
      data-category="${category}"
      title="${categoryPt[category] || category}"
      data-pt="${categoryPt[category] || category}"
    >
      <span class="filter-icon">${categoryIcons[category]}</span>
      <span class="filter-text">${category}</span>
    </button>
  `).join('');

  // Generate the initial grid of cards (showing all items)
  const initialData = (saved === 'All' ? vocabularyData : vocabularyData.filter(item => item.category === saved))
    .filter(i => {
      const q = savedQuery.trim().toLowerCase();
      if (!q) return true;
      const fields = [i.term_en, i.term_pt, i.definition_en, i.definition_pt];
      return fields.some(f => String(f||'').toLowerCase().includes(q));
    });
  const initialCardsHTML = initialData.map(GlossaryCard).join('');

  // Return the full page HTML structure
  return `
    <main class="glossary-page-modern">
      <div class="glossary-hero">
        <div class="glossary-hero-content">
          <h1 class="glossary-title">Agro Glossary</h1>
          <p class="glossary-subtitle">Explore termos técnicos do mundo da agricultura, pecuária e veterinária</p>
        </div>
      </div>
      
      <div class="glossary-controls">
        <div class="filter-container-modern">
          ${filterButtonsHTML}
        </div>

        <div class="glossary-actions-modern">
          <div class="search-wrapper-modern">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              type="text" 
              id="glossary-search" 
              class="search-input-modern"
              placeholder="Buscar termos, definições..." 
              value="${savedQuery}" 
            />
            ${savedQuery ? `<button class="search-clear" id="glossary-search-clear" aria-label="Limpar busca">✕</button>` : ''}
          </div>
          
          <div class="sort-wrapper-modern">
            <label for="glossary-sort-select" class="sort-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M7 12h10M11 18h2"/>
              </svg>
              Ordenar
            </label>
            <select id="glossary-sort-select" class="sort-select-modern">
              <option value="az" ${savedSort==='az'?'selected':''}>A → Z</option>
              <option value="za" ${savedSort==='za'?'selected':''}>Z → A</option>
              <option value="category" ${savedSort==='category'?'selected':''}>Categoria</option>
            </select>
          </div>
          
          <div class="count-badge-modern" id="glossary-count">
            <span class="count-number">${initialData.length}</span>
            <span class="count-label">termos</span>
          </div>
        </div>
      </div>

      <div class="glossary-grid-modern" id="glossary-grid">
        ${initialCardsHTML}
      </div>
      
      ${initialData.length > 20 ? `
        <div class="glossary-load-modern">
          <button class="btn-load-more" id="glossary-load-more">
            <span>Carregar mais termos</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </button>
        </div>
      ` : ''}
    </main>
  `;
}
