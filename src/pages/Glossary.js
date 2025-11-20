import vocabularyData from '../data/vocabularyData.js';
import { GlossaryCard } from '../components/GlossaryCard.js';

export function Glossary() {
  const categories = ['All', ...new Set(vocabularyData.map(item => item.category))];
  const saved = localStorage.getItem('glossaryCategory') || 'All';

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
  const initialData = saved === 'All' ? vocabularyData : vocabularyData.filter(item => item.category === saved);
  const initialCardsHTML = initialData.map(GlossaryCard).join('');

  // Return the full page HTML structure
  return `
    <main class="glossary-page">
      <h2>Agro Glossary</h2>
      <p>Explore technical terms from the world of agriculture.</p>
      
      <div class="filter-container">
        ${filterButtonsHTML}
      </div>

      <div class="glossary-grid" id="glossary-grid">
        ${initialCardsHTML}
      </div>
    </main>
  `;
}
