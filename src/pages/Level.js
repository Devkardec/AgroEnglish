 

function pathFor(level) {
  return `/src/data/texts/${level}/basic.json`
}

export function Level(level) {
  const isA1 = String(level||'').toUpperCase()==='A1';
  const isA2 = String(level||'').toUpperCase()==='A2';
  const isB1 = String(level||'').toUpperCase()==='B1';
  const hero = isA1 ? `
      <section class="level-hero">
        <h2 class="title">Módulo A1 - Fundamentos do Campo</h2>
        <p class="desc">Bem-vindo ao Agro English!</p>
        <p class="desc">Neste primeiro módulo, você vai sair do zero e aprender o inglês essencial para o dia a dia na fazenda. Sem gramática complicada, focaremos no que realmente importa para o trabalho.</p>
        <div class="card" style="margin-top:8px">
          <div class="section-title" style="margin-bottom:6px">O que você vai dominar:</div>
          <div class="small" style="line-height:1.6">
            ✅ Identidade:  Apresentar você, sua equipe e os animais.<br>
            ✅ Rotina:  Descrever o manejo, operar máquinas e falar do clima.<br>
            ✅ Gestão:  Contar o estoque, localizar ferramentas e dar ordens de segurança.<br>
            ✅ Negócios:  Planejar a colheita e perguntar preços de insumos.
          </div>
        </div>
        <p class="desc" style="margin-top:8px">São 12 lições práticas para você começar a falar inglês no campo hoje mesmo.</p>
        <p class="desc">Vamos começar?</p>
        <div class="actions" style="margin-top:10px">
          <a class="btn" href="#/text/${level}/1">Começar</a>
        </div>
      </section>
  ` : isA2 ? `
      <section class="level-hero">
        <h2 class="title">Módulo A2 - Operação e Relatórios</h2>
        <p class="desc">Pronto para o próximo nível?</p>
        <p class="desc">No A1, você aprendeu a sobreviver. Agora, no A2, você vai aprender a trabalhar. O foco é relatar o que aconteceu, entender ordens complexas e comparar equipamentos.</p>
        <div class="card" style="margin-top:8px">
          <div class="section-title" style="margin-bottom:6px">O que você vai dominar:</div>
          <div class="small" style="line-height:1.6">
            ✅ Passado: Relatar tarefas feitas ontem e explicar problemas mecânicos.<br>
            ✅ Decisão: Comparar qual trator é mais forte ou qual animal é melhor.<br>
            ✅ Regras: Entender normas de segurança e obrigações (Must/Should).<br>
            ✅ Carreira: Falar sobre sua experiência profissional em entrevistas.
          </div>
        </div>
        <p class="desc" style="margin-top:8px">São mais 12 lições para você deixar de ser ajudante e virar um operador que se comunica bem.</p>
        <p class="desc">Vamos evoluir?</p>
        <div class="actions" style="margin-top:10px">
          <a class="btn" href="#/text/${level}/1">Começar</a>
        </div>
      </section>
  ` : isB1 ? `
      <section class="level-hero">
        <h2 class="title">Módulo B1 - Resolução de Problemas e Processos</h2>
        <p class="desc">Bem-vindo ao Nível Intermediário!</p>
        <p class="desc">Você já sabe seguir ordens e relatar o dia a dia. Agora, vamos elevar o nível. O Módulo B1 prepara você para antever problemas, entender como as coisas funcionam (processos) e falar sobre sua experiência de vida.</p>
        <div class="card" style="margin-top:8px">
          <div class="section-title" style="margin-bottom:6px">O que você vai dominar:</div>
          <div class="small" style="line-height:1.6">
            ✅ Condicionais: "Se a luz acender, pare a máquina" (Prevenção e Segurança).<br>
            ✅ Voz Passiva: "O milho é colhido em setembro" (Foco no processo, não na pessoa).<br>
            ✅ Experiência (Present Perfect): "Eu já trabalhei com gado Angus" (Conectar passado e presente).<br>
            ✅ Incerteza: "Pode ser que chova amanhã" (Uso de Might/Could).
          </div>
        </div>
        <p class="desc" style="margin-top:8px">São 12 lições estratégicas para você se tornar um profissional que pensa e propõe soluções.</p>
        <p class="desc">Vamos avançar?</p>
        <div class="actions" style="margin-top:10px">
          <a class="btn" href="#/text/${level}/1">Começar</a>
        </div>
      </section>
  ` : `
      <section class="level-hero">
        <h2 class="title">Nível ${level}</h2>
        <p class="desc">Conteúdos práticos alinhados ao nível ${level}. Agricultura, pecuária, veterinária e máquinas com vocabulário técnico.</p>
        <div class="actions">
          <a class="btn" href="#/text/${level}/1">Começar</a>
        </div>
      </section>
  `;
  return `
    <main class="main">
      ${hero}
      <section class="card" style="margin-bottom:16px">
        <div class="section-title">Escolha o texto</div>
        <div id="textList" class="levels-grid"></div>
      </section>
      <section class="card" style="margin-top:16px">
        <div class="section-title" style="text-align:center">Navegar por níveis</div>
        <div class="levels-nav">
          <a class="btn level-nav" href="#/level/A1">
            <span class="title">A1 – Iniciante</span>
            <span class="desc">Consegue entender e usar frases simples do dia a dia.</span>
          </a>
          <a class="btn level-nav" href="#/level/A2">
            <span class="title">A2 – Básico</span>
            <span class="desc">Consegue lidar com situações simples e comunicar necessidades imediatas.</span>
          </a>
          <a class="btn level-nav" href="#/level/B1">
            <span class="title">B1 – Intermediário</span>
            <span class="desc">Consegue se virar em viagens, falar sobre experiências e dar opiniões simples.</span>
          </a>
          <a class="btn level-nav" href="#/level/B2">
            <span class="title">B2 – Intermediário avançado</span>
            <span class="desc">Consegue participar de conversas mais complexas e compreender textos detalhados.</span>
          </a>
          <a class="btn level-nav" href="#/level/C1">
            <span class="title">C1 – Avançado</span>
            <span class="desc">Consegue se expressar de forma fluente e espontânea, em contextos acadêmicos ou profissionais.</span>
          </a>
          <a class="btn level-nav" href="#/level/C2">
            <span class="title">C2 – Proficiência</span>
            <span class="desc">Nível próximo ao de um falante nativo; entende praticamente tudo e comunica com precisão.</span>
          </a>
        </div>
      </section>
    </main>
  `
}
