export function Home() {
  const levels = ['A1','A2','B1','B2','C1','C2']
  const levelGrid = levels.map(l => '<a class="level-card" href="#/level/'+l+'"><span class="title">'+l+'</span><span class="badge" id="badge-'+l+'">0/10</span></a>').join('')
  return `
    <main class="main">
      <section class="hero">
        <h1>AgroEnglish Pro</h1>
        <p>Inglês técnico rural real. Estude com voz americana, exercícios práticos e conteúdo offline.</p>
        <div class="cta">
          <a class="btn" id="continueCta">Continuar</a>
          <a class="btn secondary" href="#/level/A1">Começar no A1</a>
          <span class="pill" id="progressBadge">Progresso 0%</span>
          <div class="user-actions">
            <div id="userBadge" class="user-badge-inline">
              <button id="userBadgeBtn" class="user-badge-btn" data-action="user-menu-toggle">
                <div class="avatar">${(localStorage.getItem('userName')||'A').slice(0,1).toUpperCase()}</div>
                <div class="name">Olá${(localStorage.getItem('userName')||'').trim()?`, ${(localStorage.getItem('userName')||'').trim()}`:''}</div>
              </button>
              <div id="userMenu" class="user-menu">
                <button class="btn danger" data-action="signout" style="width:100%;text-align:left;padding:8px;border-radius:8px">Sair</button>
              </div>
            </div>
            <button class="btn danger" data-action="signout">Sair</button>
          </div>
        </div>
        
      </section>

      <section class="features">
        <div class="feature-card"><div class="icon">🎧</div><div class="section-title">Narração natural</div><div class="small">Voz americana com controle de velocidade e pausa.</div></div>
        <div class="feature-card"><div class="icon">🗣️</div><div class="section-title">Prática de fala</div><div class="small">Fale e receba feedback imediato sobre pronúncia.</div></div>
        <div class="feature-card"><div class="icon">📦</div><div class="section-title">100% offline</div><div class="small">Baixe os textos por nível e use sem internet.</div></div>
        <div class="feature-card"><div class="icon">🌾</div><div class="section-title">Conteúdo agro</div><div class="small">Agricultura, pecuária, veterinária e máquinas.</div></div>
      </section>

      <section style="margin-top:20px">
        <div class="section-title">Escolha o nível</div>
        <div class="levels-grid">${levelGrid}</div>
      </section>

      <section class="home-actions">
        <button class="btn" id="preload">Baixar curso offline</button>
        <button class="btn secondary" id="dailyTipSpeak">Ouvir dica do dia</button>
      </section>

      <section class="card" style="margin-top:12px">
        <div class="section-title">Dica do dia</div>
        <div id="dailyTip" class="small">Rotacione as pastagens para melhorar o forrageio. Rotate pastures to improve forage quality.</div>
      </section>
    </main>
  `
}
