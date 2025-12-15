export function Header() {
  const hash = location.hash || '#/'
  const prog = JSON.parse(localStorage.getItem('progress')||'{}')
  const lvl = prog.lastLevel
  const idx = lvl ? prog[lvl] : null
  
  // Determinar página ativa para navegação
  const isHome = hash === '#/' || hash.startsWith('#/home')
  const isGlossary = hash.startsWith('#/glossary')
  const isSettings = hash.startsWith('#/settings')
  
  return `
    <!-- Header Modernizado (Sem navegação - apenas logo) -->
    <header class="app-header">
      <div class="brand">
        <img src="/img/logoagroenglishSF.webp" width="84" height="84" alt="AgroEnglish Logo" loading="lazy" />
      </div>
    </header>
    
    <!-- Navegação Inferior Fixa (Mobile e Desktop) -->
    <nav class="bottom-nav" role="navigation" aria-label="Navegação principal">
      <a href="#/" class="bottom-nav-item ${isHome?'active':''}" aria-label="Home">
        <span class="bottom-nav-item-icon">🏠</span>
        <span class="bottom-nav-item-label">Home</span>
      </a>
      <a href="#/glossary" class="bottom-nav-item ${isGlossary?'active':''}" aria-label="Glossário">
        <span class="bottom-nav-item-icon">📚</span>
        <span class="bottom-nav-item-label">Glossário</span>
      </a>
      <button class="bottom-nav-item ${isSettings?'active':''}" data-action="toggle-theme" aria-label="Alternar tema">
        <span class="bottom-nav-item-icon">🌙</span>
        <span class="bottom-nav-item-label">Tema</span>
      </button>
    </nav>
  `
}
