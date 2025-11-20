import vocabularyData from '../data/vocabularyData.js';
import { GlossaryCard } from '../components/GlossaryCard.js';

export function Glossary() {
  const categories = ['All', ...new Set(vocabularyData.map(item => item.category))];
  const saved = localStorage.getItem('glossaryCategory') || 'All';
  const savedQuery = localStorage.getItem('glossaryQuery') || '';

  // Generate the HTML for the filter buttons
  const filterButtonsHTML = categories.map(category => `
    <button
      class="filter-btn ${category === saved ? 'active' : ''}"
      data-category="${category}"
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

      <div class="glossary-search">
        <input type="text" id="glossary-search" placeholder="Buscar termos e definições" value="${savedQuery}" />
        <div class="small" id="glossary-count">${initialData.length} termos</div>
      </div>

      <div class="glossary-grid" id="glossary-grid">
        ${initialCardsHTML}
      </div>
    </main>
  `;
}
