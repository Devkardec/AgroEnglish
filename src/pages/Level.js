 

function pathFor(level) {
  return `/src/data/texts/${level}/basic.json`
}

export function Level(level) {
  const isA1 = String(level||'').toUpperCase()==='A1';
  const isA2 = String(level||'').toUpperCase()==='A2';
  const isB1 = String(level||'').toUpperCase()==='B1';
  const isB2 = String(level||'').toUpperCase()==='B2';
  const isC1 = String(level||'').toUpperCase()==='C1';
  const isC2 = String(level||'').toUpperCase()==='C2';
  const hero = isA1 ? `
      <section class="level-hero">
        <h2 class="title">Módulo A1 - Fundamentos do Campo</h2>
        <p class="desc">Bem-vindo ao Agro English!</p>
        <p class="desc">Neste primeiro módulo, você vai sair do zero e aprender o inglês essencial para o dia a dia na fazenda. Sem gramática complicada, focaremos no que realmente importa para o trabalho.</p>
        <div class="card" style="margin-top:8px">
          <img src="/public/images/modulo1.webp" alt="Módulo A1 - Fundamentos do Campo" style="display:block;width:100%;border-radius:12px" loading="lazy" />
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
  ` : isB2 ? `
      <section class="level-hero">
        <h2 class="title">Módulo B2 - Supervisão e Liderança</h2>
        <p class="desc">Bem-vindo ao Nível Profissional!</p>
        <p class="desc">Chegamos ao nível onde a liderança acontece. No B2, você deixará de apenas relatar problemas para começar a negociar soluções, gerenciar crises e liderar equipes. O foco é sofisticação e estratégia.</p>
        <div class="card" style="margin-top:8px">
          <div class="section-title" style="margin-bottom:6px">O que você vai dominar:</div>
          <div class="small" style="line-height:1.6">
            ✅ Argumentação: Defender seu ponto de vista (Conectivos de contraste: However, Although).<br>
            ✅ Gestão: Delegar tarefas e fazer com que os outros trabalhem (Causative Form).<br>
            ✅ Investigação: Deduzir o que causou um acidente ou falha (Modals of Deduction).<br>
            ✅ Planejamento Avançado: Metas de longo prazo (Future Perfect: "Até outubro, teremos terminado").
          </div>
        </div>
        <p class="desc" style="margin-top:8px">São 12 lições avançadas para quem quer assumir cargos de chefia ou negociar diretamente com americanos.</p>
        <p class="desc">Vamos liderar?</p>
        <div class="actions" style="margin-top:10px">
          <a class="btn" href="#/text/${level}/1">Começar</a>
        </div>
      </section>
  ` : isC1 ? `
      <section class="level-hero">
        <h2 class="title">Módulo C1 - Pesquisa e Especialização</h2>
        <p class="desc">Bem-vindo à Elite Agrícola!</p>
        <p class="desc">No nível C1, você não fala apenas sobre "plantar e colher". Você fala sobre sequenciamento genético, análise de dados, epidemiologia e mercados globais. O foco é o inglês acadêmico e sofisticado usado em conferências internacionais e pesquisas de ponta.</p>
        <div class="card" style="margin-top:8px">
          <div class="section-title" style="margin-bottom:6px">O que você vai dominar:</div>
          <div class="small" style="line-height:1.6">
            ✅ Inglês Acadêmico: Vocabulário formal em textos e apresentações (Therefore, Hence, Albeit).<br>
            ✅ Precisão Científica: Descrever experimentos com estruturas passivas e impessoais.<br>
            ✅ Debate Ético: Discutir GMOs e sustentabilidade com argumentos sólidos.<br>
            ✅ Cautela Científica: Usar hedging para não afirmar o que não foi provado.
          </div>
        </div>
        <p class="desc" style="margin-top:8px">São 12 lições densas para transformar você em um especialista internacional.</p>
        <p class="desc">Vamos para o laboratório?</p>
        <div class="actions" style="margin-top:10px">
          <a class="btn" href="#/text/${level}/1">Começar</a>
        </div>
      </section>
  ` : isC2 ? `
      <section class="level-hero">
        <h2 class="title">Módulo C2 - Maestria e Fluência Nativa</h2>
        <p class="desc">Bem-vindo ao Nível Nativo!</p>
        <p class="desc">No C1, você aprendeu a ciência. No C2, você aprende a alma do campo. Este módulo foca nas sutilezas que os livros tradicionais não ensinam: expressões rurais idiomáticas, humor, ironia e a capacidade de negociar com elegância absoluta. O objetivo é que você soe tão natural que esqueçam que você é estrangeiro.</p>
        <div class="card" style="margin-top:8px">
          <div class="section-title" style="margin-bottom:6px">O que você vai dominar:</div>
          <div class="small" style="line-height:1.6">
            ✅ Idioms do Campo: Expressões como "Don't count your chickens" ou "Buy the farm".<br>
            ✅ Ironia e Humor: Entender quando o "Sim" na verdade quer dizer "Não".<br>
            ✅ Inglês Literário: Ler narrativas complexas e histórias do agronegócio.<br>
            ✅ Negociação Sutil: A arte de persuadir sem parecer que está vendendo.
          </div>
        </div>
        <p class="desc" style="margin-top:8px">São 12 lições finais para você zerar o jogo do inglês agrícola.</p>
        <p class="desc">Vamos fechar com chave de ouro?</p>
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
