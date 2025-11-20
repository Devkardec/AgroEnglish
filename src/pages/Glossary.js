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

  // Generate the HTML for the filter buttons
  const filterButtonsHTML = categories.map(category => `
    <button
      class="filter-btn ${category === saved ? 'active' : ''}"
      data-category="${category}"
      title="${categoryPt[category] || category}"
      data-pt="${categoryPt[category] || category}"
    >
      ${category}
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
    <main class="glossary-page">
      <h2>Agro Glossary</h2>
      <p>Explore technical terms from the world of agriculture.</p>
      
      <div class="filter-container">
        ${filterButtonsHTML}
      </div>

      <div class="glossary-actions">
        <div class="glossary-search">
          <input type="text" id="glossary-search" placeholder="Buscar termos e definições" value="${savedQuery}" />
        </div>
        <div class="glossary-sort">
          <label for="glossary-sort-select" class="small">Ordenar</label>
          <select id="glossary-sort-select">
            <option value="az" ${savedSort==='az'?'selected':''}>A → Z</option>
            <option value="za" ${savedSort==='za'?'selected':''}>Z → A</option>
            <option value="category" ${savedSort==='category'?'selected':''}>Categoria</option>
          </select>
        </div>
        <div class="small" id="glossary-count">${initialData.length} termos</div>
      </div>

      <div class="glossary-grid" id="glossary-grid">
        ${initialCardsHTML}
      </div>
      <div class="glossary-load">
        <button class="btn" id="glossary-load-more">Carregar mais</button>
      </div>
    </main>
  `;
}
