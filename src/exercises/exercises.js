/* global React, ReactDOM */
(function(){
  const e = React.createElement;

  function ExerciseCard({ title, instruction, children }){
    return e('div', { className:'rounded-2xl border border-gray-200 bg-white shadow-sm p-4' },
      title ? e('div', { className:'text-sm font-semibold text-gray-700 mb-1' }, title) : null,
      instruction ? e('div', { className:'text-xs text-gray-600 mb-2' }, instruction) : null,
      children
    );
  }

  function QuestionChoices({ items=[], onCheck }){
    const [sel, setSel] = React.useState(null);
    const [res, setRes] = React.useState(null);
    function check(){ const ok = onCheck ? onCheck(sel) : false; setRes(ok); }
    return e('div', null,
      e('div', { className:'grid grid-cols-1 gap-2' },
        items.map((it,i)=> e('button', { key:i, className:`px-3 py-2 rounded border ${sel===i?'border-green-600':'border-gray-200'} text-left`, onClick:()=>setSel(i) }, it))
      ),
      e('div', { className:'mt-2 flex items-center gap-2' },
        e('button', { className:'px-3 py-2 rounded bg-green-600 text-white', onClick:check }, 'Checar'),
        res!==null ? e('span', { className:`text-xs ${res?'text-green-700':'text-red-700'}` }, res?'Correto':'Tente novamente') : null
      )
    );
  }

  function TrueFalseCard({ statements=[] }){
    const [ans, setAns] = React.useState(Array(statements.length).fill(null));
    const [res, setRes] = React.useState(null);
    function set(i,v){ const a=[...ans]; a[i]=v; setAns(a); }
    function check(){ const ok = statements.every((s,i)=> s.correct===ans[i]); setRes(ok); }
    return e('div', null,
      statements.map((s,i)=> e('div', { key:i, className:'flex items-center gap-2 mb-2' },
        e('span', { className:'text-sm text-gray-800 flex-1' }, `${i+1}. ${s.text}`),
        e('button', { className:`px-2 py-1 rounded ${ans[i]===true?'bg-green-600 text-white':'bg-gray-100 text-gray-800'}`, onClick:()=>set(i,true) }, 'Verdadeiro'),
        e('button', { className:`px-2 py-1 rounded ${ans[i]===false?'bg-red-600 text-white':'bg-gray-100 text-gray-800'}`, onClick:()=>set(i,false) }, 'Falso')
      )),
      e('div', { className:'mt-2 flex items-center gap-2' },
        e('button', { className:'px-3 py-2 rounded bg-green-600 text-white', onClick:check }, 'Checar'),
        res!==null ? e('span', { className:`text-xs ${res?'text-green-700':'text-red-700'}` }, res?'Correto':'Tente novamente') : null
      )
    );
  }

  function InputFillBlank({ items=[] }){
    const [vals, setVals] = React.useState(Array(items.length).fill(''));
    const [res, setRes] = React.useState(null);
    function set(i,v){ const a=[...vals]; a[i]=v; setVals(a); }
    function check(){ const ok = items.every((it,i)=> it.answer.toLowerCase()===String(vals[i]||'').trim().toLowerCase()); setRes(ok); }
    return e('div', null,
      items.map((it,i)=> e('div', { key:i, className:'mb-2 text-sm text-gray-800' },
        e('span', null, `${i+1}. ${it.prompt.replace('____','')}`),
        e('input', { className:'ml-2 px-2 py-1 rounded border border-gray-300', value:vals[i], onChange:ev=>set(i, ev.target.value), placeholder:'____' })
      )),
      e('div', { className:'mt-2 flex items-center gap-2' },
        e('button', { className:'px-3 py-2 rounded bg-green-600 text-white', onClick:check }, 'Checar'),
        res!==null ? e('span', { className:`text-xs ${res?'text-green-700':'text-red-700'}` }, res?'Correto':'Tente novamente') : null
      )
    );
  }

  function OrderingComponent({ items=[] }){
    const [arr, setArr] = React.useState(items.map((it,i)=> ({...it, id:i})));
    const [res, setRes] = React.useState(null);
    function swap(i,j){ const a=[...arr]; const t=a[i]; a[i]=a[j]; a[j]=t; setArr(a); }
    function check(){ const ok = arr.every((it,i)=> it.correctIndex===i); setRes(ok); }
    return e('div', null,
      e('div', { className:'space-y-2' },
        arr.map((it,i)=> e('div', { key:it.id, className:'flex items-center gap-2' },
          e('span', { className:'w-6 text-center text-xs text-gray-600' }, i+1),
          e('div', { className:'flex-1 px-3 py-2 rounded border border-gray-200 bg-gray-50 text-sm text-gray-800' }, it.text),
          e('div', { className:'flex gap-1' },
            e('button', { className:'px-2 py-1 rounded bg-gray-100', onClick:()=> swap(i, Math.max(0,i-1)) }, '↑'),
            e('button', { className:'px-2 py-1 rounded bg-gray-100', onClick:()=> swap(i, Math.min(arr.length-1,i+1)) }, '↓')
          )
        ))
      ),
      e('div', { className:'mt-2 flex items-center gap-2' },
        e('button', { className:'px-3 py-2 rounded bg-green-600 text-white', onClick:check }, 'Checar'),
        res!==null ? e('span', { className:`text-xs ${res?'text-green-700':'text-red-700'}` }, res?'Correto':'Tente novamente') : null
      )
    );
  }

  function VocabularyMatch({ items=[] }){
    return e('div', { className:'grid grid-cols-2 gap-3 sm:grid-cols-3' },
      items.map((it,i)=> e('div', { key:i, className:'flex items-center gap-2' },
        e('img', { src:it.image, alt:it.word, className:'w-24 h-24 object-contain rounded-md bg-gray-50' }),
        e('div', { className:'text-sm text-gray-800' },
          e('div', { className:'font-semibold' }, it.word),
          e('div', { className:'text-gray-600 text-xs' }, it.pt)
        )
      ))
    );
  }

  function VocabularyMemoryGame({ pairs }){
    const items = Array.isArray(pairs) ? pairs.slice(0,11) : [];
    const cards = React.useMemo(()=> {
      const deck = [];
      items.forEach((it,i)=>{
        deck.push({ id:`${i}-img`, key:i, type:'image', src:it.src });
        deck.push({ id:`${i}-txt`, key:i, type:'text', text:it.text });
      });
      for (let i=deck.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [deck[i], deck[j]]=[deck[j], deck[i]]; }
      return deck;
    }, []);
    const [open, setOpen] = React.useState([]);
    const [matchedKeys, setMatchedKeys] = React.useState({});
    function click(idx){
      const key = cards[idx].key;
      if (matchedKeys[key]) return;
      if (open.length===0) setOpen([idx]);
      else if (open.length===1) {
        const first = open[0];
        if (first===idx) return; // ignorar clique na mesma carta
        setOpen([first, idx]);
        const isPair = cards[first].key===cards[idx].key && cards[first].type!==cards[idx].type;
        setTimeout(()=>{
          if (isPair) setMatchedKeys(m=> ({...m, [cards[first].key]:true}));
          setOpen([]);
        }, 450);
      }
    }
    function reset(){ setOpen([]); setMatchedKeys({}); }
    const matchedCount = Object.keys(matchedKeys).length;
    const done = matchedCount===items.length;
    return e('div', null,
      e('div', { className:'text-xs text-gray-600 mb-2' }, `Acertos: ${matchedCount}/${items.length}`),
      e('div', { className:'grid grid-cols-3 gap-2 sm:grid-cols-4' },
        cards.map((c,idx)=> {
          const isMatched = !!matchedKeys[c.key];
          const isOpen = open.includes(idx) || isMatched;
          const btnCls = `relative rounded-xl border ${isMatched?'border-green-600':'border-gray-200'} ${isMatched?'bg-green-50':'bg-white'} shadow-sm overflow-hidden`;
          return e('button', { key:c.id, onClick:()=>click(idx), disabled:isMatched, className:btnCls },
            isOpen ? (c.type==='image'
                      ? e('img', { src:c.src, alt:'', className:'w-full aspect-square object-contain bg-gray-50' })
                      : e('div', { className:'w-full aspect-square flex items-center justify-center p-2 text-center text-sm text-gray-800' }, c.text))
                   : e('div', { className:'w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-green-50 text-green-700 font-semibold' }, 'AGRO'),
            isMatched ? e('div', { className:'absolute top-1 left-1 w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center' }, String(c.key+1)) : null
          );
        })
      ),
      e('div', { className:'mt-3 flex items-center gap-2' },
        e('button', { className:'px-3 py-2 rounded bg-green-600 text-white', onClick:reset }, 'Reiniciar'),
        done ? e('span', { className:'text-xs text-green-700' }, 'Tudo certo!') : null
      )
    );
  }

  function VisualAssociation(){
    const items = [
      { word:'farmer', pt:'fazendeiro', image:'/public/images/a1texto1/slidetx1/11.png' },
      { word:'barn', pt:'galpão', image:'/public/images/a1texto1/slidetx1/12.png' },
      { word:'cow', pt:'vaca', image:'/public/images/a1texto1/slidetx1/9.png' },
      { word:'field', pt:'campo', image:'/public/images/a1texto1/slidetx1/4.png' },
      { word:'happy', pt:'feliz', image:'/public/images/a1texto1/slidetx1/5.png' },
      { word:'ready', pt:'pronto', image:'/public/images/a1texto1/slidetx1/7.png' },
    ];
    const [selW, setSelW] = React.useState(null);
    const [matches, setMatches] = React.useState({});
    function chooseWord(i){ setSelW(i); }
    function chooseImg(i){ if (selW!==null) setMatches(m=> ({...m, [selW]:i})); setSelW(null); }
    const ok = Object.keys(matches).length===items.length;
    return e('div', null,
      e('div', { className:'grid grid-cols-2 gap-4' },
        e('div', null,
          items.map((it,i)=> e('button', { key:i, onClick:()=>chooseWord(i), className:`w-full text-left px-3 py-2 rounded border ${selW===i?'border-green-600':'border-gray-200'} mb-2` }, `${it.word} · ${it.pt}`))
        ),
        e('div', { className:'grid grid-cols-2 gap-2' },
          items.map((it,i)=> e('button', { key:i, onClick:()=>chooseImg(i), className:'rounded-xl border border-gray-200 bg-white' },
            e('img', { src:it.image, alt:it.word, className:'w-24 h-24 object-contain' }),
            matches[i]!==undefined ? e('div', { className:'text-xs text-gray-600 p-1' }, items[matches[i]].word) : null
          ))
        )
      ),
      e('div', { className:'mt-2 text-xs' }, ok ? e('span', { className:'text-green-700' }, 'Associação completa!') : e('span', { className:'text-gray-600' }, 'Selecione uma palavra e depois uma imagem'))
    );
  }

  function ExercisePageLayout({ data }){
    const ex = data.a1_exercises || {};
    const comp = Array.isArray(ex.complete) ? ex.complete : [];
    const tfStatements = [
      { text:'Paul is a farmer.', correct:true },
      { text:'The chickens are calm.', correct:false },
      { text:'The barn is open.', correct:true },
    ];
    const amIsAre = [
      { prompt:'I ____ Paul.', answer:'am' },
      { prompt:'The barn ____ open.', answer:'is' },
      { prompt:'The cows ____ calm.', answer:'are' },
    ];
    const vocabItems = [
      { word:'farmer', pt:'fazendeiro', image:'/public/images/a1texto1/slidetx1/11.png' },
      { word:'barn', pt:'galpão', image:'/public/images/a1texto1/slidetx1/12.png' },
    ];
    const orderItems = [
      { text:'I am Paul.', correctIndex:0 },
      { text:'The barn is open.', correctIndex:1 },
      { text:'The cows are calm.', correctIndex:2 },
    ];
    function makeVideoPairs(){
      const imgs = Array.from({length:11}, (_,i)=> `/public/images/a1texto1/farmedition/${i+1}.png`);
      const lines = Array.isArray(data && data.lines) ? data.lines.map(l=> String(l.en||'').trim()).filter(Boolean) : [];
      const nar = Array.isArray(data && data.a1_exercises && data.a1_exercises.narration_sentences) ? data.a1_exercises.narration_sentences.map(s=> String(s||'').trim()).filter(Boolean) : [];
      const srcTexts = lines.length ? lines : nar;
      const out = [];
      for (let i=0;i<11;i++) {
        out.push({ src: imgs[i], text: srcTexts[i] || '' });
      }
      return out;
    }
    const videoPairs = makeVideoPairs();
    return e('div', { className:'w-full max-w-4xl mx-auto' },
      e('div', { className:'mb-4 flex items-center justify-between' },
        e('h2', { className:'text-base font-bold text-green-700' }, 'Paul and the Farm · Exercícios (A1)'),
        e('div', { className:'text-xs text-gray-600' }, 'Nível A1 · Fácil')
      ),
      e('div', { className:'grid grid-cols-1 gap-4' },
        e(ExerciseCard, { title:'Vocabulário com imagens', instruction:'Veja e associe (jogo de memória)' }, e(VocabularyMemoryGame, { pairs: videoPairs })),
        e(ExerciseCard, { title:'Múltipla escolha simples', instruction:'Escolha a opção correta' },
          e(QuestionChoices, { items:['Paul is a farmer.','Paul are a farmer.','Paul am a farmer.'], onCheck:(i)=> i===0 })
        ),
        e(ExerciseCard, { title:'Classificar Affirmative/Negative/Question', instruction:'Identifique a estrutura' },
          e(QuestionChoices, { items:['She is happy.','Is she happy?','She is not happy.'], onCheck:(i)=> [0,1,2].includes(i) })
        ),
        e(ExerciseCard, { title:'Transformar frases', instruction:'Veja as versões' },
          e('div', { className:'space-y-2 text-sm text-gray-800' },
            e('div', null, 'She is happy. → She is not happy.'),
            e('div', null, 'The barn is open. → Is the barn open?')
          )
        ),
        e(ExerciseCard, { title:'Completar com Am / Is / Are', instruction:'Preencha corretamente' }, e(InputFillBlank, { items:amIsAre })),
        e(ExerciseCard, { title:'Verdadeiro ou Falso', instruction:'Marque V/F' }, e(TrueFalseCard, { statements: tfStatements })),
        e(ExerciseCard, { title:'Ordenar frases', instruction:'Coloque na ordem correta' }, e(OrderingComponent, { items:orderItems })),
        e(ExerciseCard, { title:'Ditado', instruction:'Ouça e escreva (visual leve)' }, e('div', { className:'text-sm text-gray-600' }, 'Use o player acima para praticar o ditado.')),
        e(ExerciseCard, { title:'Associação visual', instruction:'Associe palavra e imagem' }, e(VisualAssociation, {})),
        e(ExerciseCard, { title:'Finalizar', instruction:'Bom trabalho!' }, e('div', { className:'text-sm text-gray-800' }, 'Great job!'))
      )
    );
  }

  window.ExercisePageMount = function(level, idx, data){
    if (String(level).toUpperCase()!=='A1' || Number(idx)!==1) return;
    const rootEl = document.getElementById('exercisePageRoot');
    if (!rootEl) return;
    try {
      ['gameTop','mc','gExercises','fill','checkFill','fillResult','a1ex'].forEach(id=>{
        const el = document.getElementById(id);
        if (el) { el.innerHTML=''; el.style.display='none'; }
      });
    } catch {}
    const tree = e(ExercisePageLayout, { data });
    if (ReactDOM.createRoot) ReactDOM.createRoot(rootEl).render(tree); else ReactDOM.render(tree, rootEl);
  };
})();
