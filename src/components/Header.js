export function Header() {
  const hash = location.hash || '#/'
  const prog = JSON.parse(localStorage.getItem('progress')||'{}')
  const lvl = prog.lastLevel
  const idx = lvl ? prog[lvl] : null
  return `
    <header class="app-header">
      <div class="brand">
        <img src="/img/logoagroenglishSF.png" width="28" height="28" alt="AgroEnglish Logo" />
        <span>AgroEnglish Pro</span>
      </div>
      <nav class="nav">
        <a href="#/" class="${hash==='#/'?'active':''}">Home</a>
        <a href="#/level/A1" class="${hash.startsWith('#/level')?'active':''}">Levels</a>
        <a href="#/settings" class="${hash.startsWith('#/settings')?'active':''}">Settings</a>
        <a class="continue" href="#/text/${lvl||'A1'}/${idx||1}" ${!lvl?'style="display:none"':''}>Continuar</a>
        <button class="btn theme" data-action="toggle-theme">Tema</button>
        <button class="btn theme" id="voiceBtn" style="margin-left:6px">Voz</button>
      </nav>
      <div id="voiceMenu" style="display:none; position:absolute; right:16px; top:56px; background:#fff; border:1px solid #e5e9e7; border-radius:10px; padding:8px; box-shadow:0 8px 24px rgba(0,0,0,0.12); min-width:240px; z-index:60"></div>
    </header>
  `
}
