export function Header() {
  const hash = location.hash || '#/'
  const prog = JSON.parse(localStorage.getItem('progress')||'{}')
  const lvl = prog.lastLevel
  const idx = lvl ? prog[lvl] : null
  return `
    <header class="app-header">
      <div class="brand">
        <img src="/img/logoagroenglishSF.png" width="84" height="84" alt="AgroEnglish Logo" />
      </div>
      <nav class="nav">
        <a href="#/" class="${hash==='#/'?'active':''}">Home</a>
        <a href="#/glossary" class="${hash==='#/glossary'?'active':''}">Glossary</a>
        <button class="btn theme" data-action="toggle-theme">Tema</button>
      </nav>
    </header>
  `
}
