export function Header() {
  const hash = location.hash || '#/'
  const prog = JSON.parse(localStorage.getItem('progress')||'{}')
  const lvl = prog.lastLevel
  const idx = lvl ? prog[lvl] : null
  const userName = (localStorage.getItem('userName')||'').trim()
  const initials = (userName||'A').trim().slice(0,1).toUpperCase()
  return `
    <header class="app-header">
      <div class="brand">
        <img src="/img/logoagroenglishSF.png" width="84" height="84" alt="AgroEnglish Logo" />
      </div>
      <nav class="nav">
        <a href="#/" class="${hash==='#/'?'active':''}">Home</a>
        <a href="#/glossary" class="${hash==='#/glossary'?'active':''}">Glossary</a>
        <a class="continue" href="#/text/${lvl||'A1'}/${idx||1}" ${!lvl?'style="display:none"':''}>Continuar</a>
        <button class="btn theme" data-action="toggle-theme">Tema</button>
        <div id="userBadge" class="user-badge-inline">
          <button id="userBadgeBtn" class="user-badge-btn" data-action="user-menu-toggle">
            <div class="avatar">${initials}</div>
            <div class="name">Olá${userName?`, ${userName}`:''}</div>
          </button>
          <div id="userMenu" class="user-menu">
            <button class="btn" data-action="open-profile" style="width:100%;text-align:left;padding:8px;border-radius:8px">Perfil</button>
            <button class="btn danger" data-action="signout" style="width:100%;text-align:left;padding:8px;border-radius:8px">Sair</button>
          </div>
        </div>
      </nav>
    </header>
  `
}
