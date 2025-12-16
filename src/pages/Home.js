export function Home() {
  const levels = ['A1','A2','B1','B2','C1','C2']
  const levelGrid = levels.map(l => '<a class="level-card" href="#/level/'+l+'"><span class="title">'+l+'</span><span class="badge" id="badge-'+l+'">0/10</span></a>').join('')
  const userName = (localStorage.getItem('userName')||'').trim()
  return `
    <main class="main">
      <!-- Hero Section Modernizada -->
      <section class="hero-modern">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="hero-badge-text">🚜 Inglês para o Campo</span>
          </div>
          <h1 class="hero-title">Aprenda Inglês Técnico Rural</h1>
          <p class="hero-subtitle">Domine o inglês essencial para agricultura, pecuária e veterinária. Voz americana, exercícios práticos e conteúdo 100% offline.</p>
          
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">6</div>
              <div class="stat-label">Níveis</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">72</div>
              <div class="stat-label">Aulas</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">100%</div>
              <div class="stat-label">Offline</div>
            </div>
          </div>

          <div class="hero-cta">
            <a class="btn btn-primary-large" id="continueCta">
              <span>▶️ Continuar Estudando</span>
            </a>
            <a class="btn btn-secondary-large" href="#/level/A1">
              <span>🌱 Começar do Zero</span>
            </a>
          </div>

          <div class="hero-progress">
            <div class="progress-label">
              <span>Seu Progresso</span>
              <span class="progress-percent" id="progressBadge">0%</span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" id="progressBarFill" style="width: 0%"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Modernizadas -->
      <section class="features-modern">
        <div class="feature-card-modern">
          <div class="feature-icon">🎧</div>
          <h3 class="feature-title">Narração Natural</h3>
          <p class="feature-desc">Voz americana autêntica com controle de velocidade e pausa para melhor compreensão.</p>
        </div>
        <div class="feature-card-modern">
          <div class="feature-icon">🗣️</div>
          <h3 class="feature-title">Prática de Fala</h3>
          <p class="feature-desc">Fale e receba feedback imediato sobre sua pronúncia em tempo real.</p>
        </div>
        <div class="feature-card-modern">
          <div class="feature-icon">📦</div>
          <h3 class="feature-title">100% Offline</h3>
          <p class="feature-desc">Baixe todo o conteúdo e estude sem precisar de internet.</p>
        </div>
        <div class="feature-card-modern">
          <div class="feature-icon">🌾</div>
          <h3 class="feature-title">Conteúdo Agro</h3>
          <p class="feature-desc">Focado em agricultura, pecuária, veterinária e operação de máquinas.</p>
        </div>
      </section>

      <!-- Níveis de Aprendizado -->
      <section class="levels-section">
        <div class="section-header">
          <h2 class="section-title-modern">Escolha Seu Nível</h2>
          <p class="section-subtitle">Do iniciante ao avançado, aprenda no seu ritmo</p>
        </div>
        <div class="levels-grid-modern">${levelGrid}</div>
      </section>

      <!-- Ações Rápidas -->
      <section class="quick-actions">
        <button class="btn-action-card" id="preload">
          <span class="action-icon">⬇️</span>
          <div class="action-content">
            <div class="action-title">Baixar Curso Offline</div>
            <div class="action-desc">Tenha todo o conteúdo disponível sem internet</div>
          </div>
        </button>
        <button class="btn-action-card" id="dailyTipSpeak">
          <span class="action-icon">💡</span>
          <div class="action-content">
            <div class="action-title">Ouvir Dica do Dia</div>
            <div class="action-desc">Aprenda uma dica prática em inglês</div>
          </div>
        </button>
      </section>

      <!-- Dica do Dia Modernizada -->
      <section class="daily-tip-modern">
        <div class="tip-header">
          <span class="tip-icon">✨</span>
          <h3 class="tip-title">Dica do Dia</h3>
        </div>
        <p class="tip-content" id="dailyTip">Rotacione as pastagens para melhorar o forrageio. Rotate pastures to improve forage quality.</p>
      </section>

      <!-- User Actions (oculto por padrão, aparece apenas quando necessário) -->
      <div class="user-actions-hidden">
        <div id="userBadge" class="user-badge-inline">
          <button id="userBadgeBtn" class="user-badge-btn" data-action="user-menu-toggle">
            <div class="name">Hello${userName ? `, ${userName}` : ''}</div>
          </button>
          <div id="userMenu" class="user-menu">
            <button class="btn danger" data-action="signout" style="width:100%;text-align:left;padding:8px;border-radius:8px">Sair</button>
          </div>
        </div>
        <button class="btn danger" data-action="signout" style="display:none">Sair</button>
      </div>
    </main>
  `
}
