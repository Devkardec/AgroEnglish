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

  function SentenceClassifier({ sentences=[] }){
    const types = ['Affirmative','Negative','Question'];
    const [sel, setSel] = React.useState(Array(sentences.length).fill(null));
    const [res, setRes] = React.useState(null);
    function set(i,v){ const a=[...sel]; a[i]=v; setSel(a); }
    function check(){ const ok = sentences.every((s,i)=>{
      const t = sel[i];
      const want = s.type;
      return (want==='aff' && t===0) || (want==='neg' && t===1) || (want==='q' && t===2);
    }); setRes(ok); }
    return e('div', null,
      sentences.map((s,i)=> e('div', { key:i, className:'mb-2' },
        e('div', { className:'text-sm text-gray-800 mb-1' }, `${i+1}. ${s.text}`),
        e('div', { className:'flex items-center gap-2' },
          types.map((t,idx)=> e('button', { key:idx, className:`px-2 py-1 rounded border ${sel[i]===idx?'border-green-600 bg-green-50':'border-gray-200 bg-gray-100'} text-xs`, onClick:()=>set(i,idx) }, t))
        )
      )),
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

  function TransformSentences({ items=[] }){
    const [vals, setVals] = React.useState(Array(items.length).fill(''));
    const [res, setRes] = React.useState(null);
    function set(i,v){ const a=[...vals]; a[i]=v; setVals(a); }
    function norm(s){ return String(s||'').trim().replace(/\s+/g,' ').replace(/\s*([?.!])\s*$/,'$1').toLowerCase(); }
    function check(){ const ok = items.every((it,i)=> norm(it.answer)===norm(vals[i])); setRes(ok); }
    return e('div', null,
      items.map((it,i)=> e('div', { key:i, className:'mb-2' },
        e('div', { className:'text-sm text-gray-800' }, `${i+1}. ${it.base}`),
        e('div', { className:'text-xs text-gray-600 mb-1' }, `Transforme para: ${it.target==='neg'?'Negativa':it.target==='q'?'Pergunta':'Affirmativa'}`),
        e('input', { className:'w-full px-2 py-1 rounded border border-gray-300', value:vals[i], onChange:ev=>set(i, ev.target.value), placeholder:'Digite a versão' })
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

  function OrderWords({ sentence }){
    const words = React.useMemo(()=> String(sentence||'').replace(/[.?!]$/,'').split(/\s+/).filter(Boolean), [sentence]);
    const [arr, setArr] = React.useState(()=> {
      const a = words.slice();
      for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
      return a.map((w,i)=> ({ w, id:i }));
    });
    const [res, setRes] = React.useState(null);
    function swap(i,j){ const a=[...arr]; const t=a[i]; a[i]=a[j]; a[j]=t; setArr(a); }
    function check(){ const ok = arr.map(x=>x.w).join(' ')===words.join(' '); setRes(ok); }
    return e('div', null,
      e('div', { className:'space-y-2' },
        arr.map((it,i)=> e('div', { key:it.id, className:'flex items-center gap-2' },
          e('span', { className:'w-6 text-center text-xs text-gray-600' }, i+1),
          e('div', { className:'flex-1 px-3 py-2 rounded border border-gray-200 bg-gray-50 text-sm text-gray-800' }, it.w),
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

  function VisualAssociation12({ items:provided=null }){
    const items = provided || [
      { word:'farmer', pt:'fazendeiro' },
      { word:'barn', pt:'galpão' },
      { word:'cow', pt:'vaca' },
      { word:'field', pt:'campo' },
      { word:'happy', pt:'feliz' },
      { word:'ready', pt:'pronto' },
    ];
    const shuffledBottom = React.useMemo(()=>{
      const arr = items.map((it,i)=> ({ pt:it.pt, idx:i }));
      for (let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
      return arr;
    }, []);
    const [selTop, setSelTop] = React.useState(null);
    const [matches, setMatches] = React.useState({});
    function chooseTop(i){ setSelTop(i); }
    function chooseBottom(j){ const orig = shuffledBottom[j].idx; if (selTop!==null && orig===selTop) { setMatches(m=> ({...m, [selTop]:orig})); setSelTop(null); } else { setSelTop(null); } }
    const matchedBottomSet = React.useMemo(()=>{ const s={}; Object.values(matches).forEach(v=> s[v]=true); return s; }, [matches]);
    const done = Object.keys(matches).length===items.length;
    return e('div', null,
      e('div', { className:'grid grid-cols-6 gap-2 mb-3' },
        items.map((it,i)=> {
          const isMatched = matches[i]!==undefined;
          const cls = isMatched ? 'border-green-600 bg-green-600 text-white' : (selTop===i ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-gray-100');
          return e('button', { key:i, onClick:()=>chooseTop(i), disabled:isMatched, className:`px-2 py-1 rounded border text-xs ${cls} text-left` }, it.word);
        })
      ),
      e('div', { className:'grid grid-cols-6 gap-2' },
        shuffledBottom.map((it,j)=> {
          const isMatched = matchedBottomSet[it.idx];
          const cls = isMatched ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-gray-100';
          return e('button', { key:j, onClick:()=>chooseBottom(j), disabled:isMatched, className:`px-2 py-1 rounded border text-xs ${cls} text-left` }, it.pt);
        })
      ),
      e('div', { className:'mt-2 text-xs' }, done ? e('span', { className:'text-green-700' }, 'Associação completa!') : e('span', { className:'text-gray-600' }, 'Toque primeiro no botão de cima (EN) e depois no de baixo (PT)'))
    );
  }

  function DictationExercise({ sentences=[], segUrls=[] }){
    const sents = Array.isArray(sentences) ? sentences.slice(0,3) : [];
    const [vals, setVals] = React.useState(Array(sents.length).fill(''));
    const [res, setRes] = React.useState(null);
    function setVal(i,v){ const a=[...vals]; a[i]=v; setVals(a); }
    function norm(s){ return String(s||'').trim().replace(/\s+/g,' ').replace(/\s*([?.!])\s*$/,'$1').toLowerCase(); }
    const useSeg = Array.isArray(segUrls) && segUrls.length>=sents.length;
    function speakOne(txt, i){
      if (useSeg) { try { const a = new Audio(segUrls[i]); a.play(); } catch{} return; }
      try { const u=new SpeechSynthesisUtterance(String(txt||'')); u.rate=Number(localStorage.getItem('rate')||1); u.pitch=Number(localStorage.getItem('pitch')||1); window.speechSynthesis.speak(u); } catch{}
    }
    function playAll(){
      if (useSeg) { let i=0; const next=()=>{ if(i>=sents.length) return; const a=new Audio(segUrls[i]); a.onended=()=>{ i++; next(); }; a.play(); }; next(); return; }
      let i=0; function step(){ if(i>=sents.length) return; const u=new SpeechSynthesisUtterance(String(sents[i]||'')); u.rate=Number(localStorage.getItem('rate')||1); u.pitch=Number(localStorage.getItem('pitch')||1); u.onend=()=>{ i++; step(); }; try { window.speechSynthesis.cancel(); } catch{} window.speechSynthesis.speak(u); } step();
    }
    function check(){ const ok = sents.every((t,i)=> norm(t)===norm(vals[i])); setRes(ok); }
    return e('div', null,
      e('div', { className:'text-sm text-gray-800 mb-2' }, 'Ouça cada frase e escreva.'),
      sents.map((t,i)=> e('div', { key:i, className:'mb-2' },
        e('div', { className:'flex items-center gap-2 mb-1' },
          e('button', { className:'px-2 py-1 rounded bg-green-600 text-white text-xs', onClick:()=>speakOne(t, i) }, `Play ${i+1}`)
        ),
        e('input', { className:'w-full px-2 py-1 rounded border border-gray-300', value:vals[i], onChange:ev=>setVal(i, ev.target.value), placeholder:`Digite a frase ${i+1}` })
      )),
      e('div', { className:'mt-2 flex items-center gap-2' },
        e('button', { className:'px-3 py-2 rounded bg-green-600 text-white', onClick:playAll }, 'Play 3 frases'),
        e('button', { className:'px-3 py-2 rounded bg-green-600 text-white', onClick:check }, 'Checar'),
        res!==null ? e('span', { className:`text-xs ${res?'text-green-700':'text-red-700'}` }, res?'Correto':'Tente novamente') : null
      )
    );
  }

  function ExercisePageLayout({ data, idx }){
    const ex = data.a1_exercises || {};
    const comp = Array.isArray(ex.complete) ? ex.complete : [];
    const tfStatements = (Number(idx)===2) ? [
      { text:'The veterinarian has a medical kit.', correct:true },
      { text:'The bull has a big injury on the leg.', correct:false },
      { text:'We have safe and healthy animals now.', correct:true },
    ] : (Number(idx)===3 ? [
      { text:'We start work at 6:00 AM.', correct:true },
      { text:'The cows walk to the barn.', correct:false },
      { text:'The farm worker feeds the pigs.', correct:true },
    ] : [
      { text:'Paul is a farmer.', correct:true },
      { text:'The chickens are calm.', correct:false },
      { text:'The barn is open.', correct:true },
    ]);
    const amIsAre = (Number(idx)===2) ? [
      { prompt:'We ____ many cows.', answer:'have' },
      { prompt:'She ____ a medical kit.', answer:'has' },
      { prompt:'The bull ____ a strong body.', answer:'has' },
    ] : (Number(idx)===3 ? [
      { prompt:'____ the cows walk to the pasture?', answer:'Do' },
      { prompt:'The calf ____ drink milk.', answer:"doesn't" },
      { prompt:'____ we clean the feeding area?', answer:'Do' },
    ] : [
      { prompt:'I ____ Paul.', answer:'am' },
      { prompt:'The barn ____ open.', answer:'is' },
      { prompt:'The cows ____ calm.', answer:'are' },
    ]);
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
      const isTx2 = Number(idx)===2;
      const isTx3 = Number(idx)===3;
      const count = isTx2 ? 8 : 11;
      const imgs = isTx2
        ? Array.from({length:count}, (_,i)=> `/public/images/a1texto2/${i+1}.${i+1}.png`)
        : (isTx3
            ? Array.from({length:count}, (_,i)=> `/public/images/a1texto3/${i+1}.3.png`)
            : Array.from({length:count}, (_,i)=> `/public/images/a1texto1/farmedition/${i+1}.png`));
      const lines = Array.isArray(data && data.lines) ? data.lines.map(l=> String(l.en||'').trim()).filter(Boolean) : [];
      const nar = Array.isArray(data && data.a1_exercises && data.a1_exercises.narration_sentences) ? data.a1_exercises.narration_sentences.map(s=> String(s||'').trim()).filter(Boolean) : [];
      const srcTexts = (lines.length ? lines : nar).slice(0,count);
      const out = [];
      for (let i=0;i<count;i++) {
        out.push({ src: imgs[i], text: srcTexts[i] || '' });
      }
      return out;
    }
    const videoPairs = makeVideoPairs();
    const assocItems = (Number(idx)===2)
      ? [
          { word:'veterinarian', pt:'veterinária(o)' },
          { word:'bull', pt:'touro' },
          { word:'medical kit', pt:'kit médico' },
          { word:'injury', pt:'lesão' },
          { word:'medicine', pt:'remédio' },
          { word:'leg', pt:'perna' },
        ]
      : null;
    const transformItems = (Number(idx)===2)
      ? [
          { base:'She has a medical kit.', target:'neg', answer: "She doesn't have a medical kit." },
          { base:'The bull has a strong body.', target:'q', answer: 'Does the bull have a strong body?' },
          { base:'We have safe and healthy animals now.', target:'neg', answer: "We don't have safe and healthy animals now." },
        ]
      : (Number(idx)===3
          ? [
              { base:'We start work at 6:00 AM.', target:'neg', answer:"We don't start work at 6:00 AM." },
              { base:'The cows walk to the pasture.', target:'q', answer:'Do the cows walk to the pasture?' },
              { base:'The small calf drinks milk.', target:'neg', answer:"The small calf doesn't drink milk." }
            ]
          : [
              { base:'She is happy.', target:'neg', answer:'She is not happy.' },
              { base:'The barn is open.', target:'q', answer:'Is the barn open?' }
            ]);
    const orderSentence = (Number(idx)===2) ? 'We have safe and healthy animals now.' : (Number(idx)===3 ? 'We start work at 6:00 AM.' : 'The barn is open.');
    return e('div', { className:'w-full max-w-4xl mx-auto' },
      e('div', { className:'mb-4 flex items-center justify-between' },
        e('h2', { className:'text-base font-bold text-green-700' }, `${String(data.uiTitle||data.title||'A1 Texto')} · Exercícios (A1)`),
        e('div', { className:'text-xs text-gray-600' }, 'Nível A1 · Fácil')
      ),
      e('div', { className:'grid grid-cols-1 gap-4' },
        e(ExerciseCard, { title:'Vocabulário com imagens', instruction:'Veja e associe (jogo de memória)' }, e(VocabularyMemoryGame, { pairs: videoPairs })),
        
        e(ExerciseCard, { title:'Transformar frases', instruction:'Digite a versão pedida' }, e(TransformSentences, { items: transformItems })),
        e(ExerciseCard, { title:(Number(idx)===2?'Completar com HAVE / HAS':(Number(idx)===3?'Completar com DO / DOES':'Completar com Am / Is / Are')), instruction:'Preencha corretamente' }, e(InputFillBlank, { items:amIsAre })),
        e(ExerciseCard, { title:'Verdadeiro ou Falso', instruction:'Marque V/F' }, e(TrueFalseCard, { statements: tfStatements })),
        e(ExerciseCard, { title:'Ordenar palavras', instruction:'Monte a frase correta' },
          e('div', null,
            e('div', { className:'text-sm text-gray-800 mb-2' }, orderSentence),
            e(OrderWords, { sentence: orderSentence })
          )
        ),
        e(ExerciseCard, { title:'Ditado', instruction:'Ouça e escreva' }, e(DictationExercise, { sentences: videoPairs.map(p=>p.text).filter(Boolean).slice(0,3), segUrls: (Number(idx)===2 ? ['/src/audio/A1/texto-a1.2-dividido/1.1.mp3','/src/audio/A1/texto-a1.2-dividido/2.2.mp3','/src/audio/A1/texto-a1.2-dividido/3.3.mp3'] : (Number(idx)===3 ? ['/src/audio/A1/texto-a1.3-dividido/1.3.mp3','/src/audio/A1/texto-a1.3-dividido/2.3.mp3','/src/audio/A1/texto-a1.3-dividido/3.3.mp3'] : ['/src/audio/A1/texto-a1.1-dividido/seg1.mp3','/src/audio/A1/texto-a1.1-dividido/seg2.mp3','/src/audio/A1/texto-a1.1-dividido/seg3.mp3'])) })),
        e(ExerciseCard, { title:'Associação visual', instruction:'Associe botões de cima e de baixo' }, e(VisualAssociation12, { items: assocItems })),
        e(ExerciseCard, { title:'Finalizar', instruction:'Bom trabalho!' }, e('div', { className:'text-sm text-gray-800' }, 'Great job!'))
      )
    );
  }

  window.ExercisePageMount = function(level, idx, data){
    if (String(level).toUpperCase()!=='A1' || (Number(idx)!==1 && Number(idx)!==2 && Number(idx)!==3)) return;
    const practiceTab = document.getElementById('tab-practice');
    if (!practiceTab || practiceTab.style.display==='none') return;
    const rootEl = document.getElementById('exercisePageRoot');
    if (!rootEl) return;
    try {
      ['gameTop','mc','gExercises','fill','checkFill','fillResult','a1ex'].forEach(id=>{
        const el = document.getElementById(id);
        if (el) { el.innerHTML=''; el.style.display='none'; }
      });
    } catch {}
    const tree = e(ExercisePageLayout, { data, idx });
    if (ReactDOM.createRoot) ReactDOM.createRoot(rootEl).render(tree); else ReactDOM.render(tree, rootEl);
  };
})();
