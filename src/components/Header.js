export function Header() {
  const hash = location.hash || '#/'
  const prog = JSON.parse(localStorage.getItem('progress')||'{}')
  const lvl = prog.lastLevel
  const idx = lvl ? prog[lvl] : null
  return `
    <header class="app-header">
      <div class="brand">
        <img src="/img/logoagroenglishSF.png" width="28" height="28" alt="AgroEnglish Logo" />
      </div>
      <nav class="nav">
        <a href="#/" class="${hash==='#/'?'active':''}">Home</a>
        <a href="#/level/A1" class="${hash.startsWith('#/level')?'active':''}">Levels</a>
        <a class="continue" href="#/text/${lvl||'A1'}/${idx||1}" ${!lvl?'style="display:none"':''}>Continuar</a>
        <button class="btn theme" data-action="toggle-theme">Tema</button>
      </nav>
    </header>
  `
}
