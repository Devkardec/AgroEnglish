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
        e('img', { src:String(it.image||'').replace(/\.(png|jpg|jpeg)$/i, '.webp'), alt:it.word, className:'w-24 h-24 object-contain rounded-md bg-gray-50', loading:'lazy' }),
        e('div', { className:'text-sm text-gray-800' },
          e('div', { className:'font-semibold' }, it.word),
          e('div', { className:'text-gray-600 text-xs' }, it.pt)
        )
      ))
    );
  }

  function VocabularyMemoryGame({ pairs, initialCorrect=0 }){
    const items = Array.isArray(pairs) ? pairs.slice(0,11) : [];
    const cards = React.useMemo(()=> {
      const deck = [];
      items.forEach((it,i)=>{
        deck.push({ id:`${i}-img`, key:i, type:'image', src:String(it.src||'') });
        deck.push({ id:`${i}-txt`, key:i, type:'text', text:it.text, audio:it.audio });
      });
      for (let i=deck.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [deck[i], deck[j]]=[deck[j], deck[i]]; }
      return deck;
    }, []);
    const [open, setOpen] = React.useState([]);
    const initMatched = React.useMemo(()=>{
      const m={};
      const n = Math.max(0, Math.min(Number(initialCorrect||0), items.length));
      for (let i=0;i<n;i++){ m[i]=true; }
      return m;
    }, [items.length, initialCorrect]);
    const [matchedKeys, setMatchedKeys] = React.useState(initMatched);
    function playAudio(src){ try { if (src) { const a = new Audio(src); a.play(); } } catch {}
    }
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
      try {
        const c = cards[idx];
        if (c.type==='text' && c.audio) playAudio(c.audio);
      } catch {}
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
                      ? e('img', { src:c.src, alt:'', className:'w-full aspect-square object-contain bg-gray-50', loading:'lazy', onError: function(e){ e.target.style.display='none'; e.target.parentElement.innerHTML='<div class="w-full aspect-square flex items-center justify-center bg-gray-100 text-gray-400">Imagem</div>'; } })
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
          return e('button', { key:j, onClick:()=>chooseBottom(j), disabled:isMatched, className:`px-2 py-1 rounded border text-xs ${cls} text-left`, style:{wordBreak:'break-word', overflowWrap:'anywhere', minWidth:0} }, it.pt);
        })
      ),
      e('div', { className:'mt-2 text-xs' }, done ? e('span', { className:'text-green-700' }, 'Associação completa!') : e('span', { className:'text-gray-600' }, 'Toque primeiro no botão de cima (EN) e depois no de baixo (PT)'))
    );
  }

  function DictationMultipleChoice({ items=[] }){
    const list = Array.isArray(items) ? items.slice(0,6) : [];
    function play(src){ try { const a=new Audio(src); a.play(); } catch{} }
    return e('div', null,
      list.map((it,idx)=>{
        const options = React.useMemo(()=>{
          const arr = [it.correct, ...it.wrong.slice(0,5)];
          for (let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
          return arr;
        }, [it]);
        const correctIndex = options.indexOf(it.correct);
        return e('div', { key:idx, className:'mb-3' },
          e('div', { className:'flex items-center gap-2 mb-1' },
            e('button', { className:'px-2 py-1 rounded bg-green-600 text-white text-xs', onClick:()=>play(it.audio) }, `Play ${idx+1}`)
          ),
          e(QuestionChoices, { items: options, onCheck:(sel)=> sel===correctIndex })
        );
      })
    );
  }

  function ImageSentenceAssociation({ items=[] }){
    const arr = Array.isArray(items) ? items : [];
    const shuffledBottom = React.useMemo(()=>{
      const a = arr.map((it,i)=> ({ text:it.text, idx:i, audio:it.audio }));
      for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
      return a;
    }, [items]);
    const [selTop, setSelTop] = React.useState(null);
    const [matches, setMatches] = React.useState({});
    function chooseTop(i){ setSelTop(i); }
    function playAudio(src){ try { if (src) { const a=new Audio(src); a.play(); } } catch{} }
    function chooseBottom(j){ const orig = shuffledBottom[j].idx; if (selTop!==null && orig===selTop) { setMatches(m=> ({...m, [selTop]:orig})); setSelTop(null); } else { setSelTop(null); } }
    const matchedBottomSet = React.useMemo(()=>{ const s={}; Object.values(matches).forEach(v=> s[v]=true); return s; }, [matches]);
    const done = Object.keys(matches).length===arr.length;
    return e('div', null,
      e('div', { className:'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-4' },
        arr.map((it,i)=>{
          const isMatched = matches[i]!==undefined;
          const cls = isMatched ? 'border-green-600 bg-green-600 text-white' : (selTop===i ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-gray-100');
          return e('button', { key:i, onClick:()=>chooseTop(i), disabled:isMatched, className:`rounded-lg border-2 ${cls} overflow-hidden transition-all hover:scale-105` },
            e('img', { src:String(it.src||'').replace(/\.(png|jpg|jpeg)$/i, '.webp'), alt:'', className:'w-full h-20 sm:h-24 md:h-28 object-cover bg-gray-50', onError: function(e){ e.target.style.display='none'; e.target.parentElement.innerHTML='<div class="w-full h-20 sm:h-24 md:h-28 flex items-center justify-center bg-gray-100 text-gray-400 text-xs">Imagem</div>'; } })
          );
        })
      ),
      e('div', { className:'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-2' },
        shuffledBottom.map((it,j)=>{
          const isMatched = matchedBottomSet[it.idx];
          const cls = isMatched ? 'border-green-600 bg-green-600 text-white' : 'border-gray-200 bg-gray-100 hover:border-green-400';
          return e('button', { 
            key:j, 
            onClick:()=>{ playAudio(it.audio); chooseBottom(j); }, 
            disabled:isMatched, 
            className:`px-3 py-2 rounded-lg border-2 text-sm font-medium ${cls} text-left transition-all hover:scale-105 min-h-[44px] flex items-center justify-start` 
          }, it.text);
        })
      ),
      e('div', { className:'mt-3 text-sm text-center' }, done ? e('span', { className:'text-green-700 font-semibold' }, '✅ Associação completa!') : e('span', { className:'text-gray-600' }, 'Toque primeiro na imagem e depois na frase'))
    );
  }

  function DictationExercise({ sentences=[], segUrls=[] }){
    const sents = Array.isArray(sentences) ? sentences.slice(0, Math.min(6, sentences.length)) : [];
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
        e('button', { className:'px-3 py-2 rounded bg-green-600 text-white', onClick:playAll }, `Play ${sents.length} frases`),
        e('button', { className:'px-3 py-2 rounded bg-green-600 text-white', onClick:check }, 'Checar'),
        res!==null ? e('span', { className:`text-xs ${res?'text-green-700':'text-red-700'}` }, res?'Correto':'Tente novamente') : null
      )
    );
  }

  function ExercisePageLayout({ data, idx, level }){
    const ex = data.a1_exercises || {};
    const comp = Array.isArray(ex.complete) ? ex.complete : [];
    function deriveTF(){
      const isA1 = String(level||'').toUpperCase()==='A1';
      const isA2 = String(level||'').toUpperCase()==='A2';
      if (isA1) {
        if (Number(idx)===2) return [
          { text:'The veterinarian has a medical kit.', correct:true },
          { text:'The bull has a big injury on the leg.', correct:false },
          { text:'We have safe and healthy animals now.', correct:true },
        ];
        if (Number(idx)===3) return [
          { text:'We start work at 6:00 AM.', correct:true },
          { text:'The cows walk to the barn.', correct:false },
          { text:'The farm worker feeds the pigs.', correct:true },
        ];
        if (Number(idx)===4) return [
          { text:'I drive the green tractor.', correct:true },
          { text:'The harvester is in the shed.', correct:true },
          { text:'It is ready.', correct:true },
        ];
        if (Number(idx)===5) return [
          { text:'The sun is very hot today.', correct:true },
          { text:'The plants are yellow.', correct:false },
          { text:'The harvest will be good this year.', correct:true },
        ];
        return [
          { text:'Paul is a farmer.', correct:true },
          { text:'The chickens are calm.', correct:false },
          { text:'The barn is open.', correct:true },
        ];
      }
      if (isA2 && Number(idx)===1) {
        return [
          { text:'Yesterday was a very busy day.', correct:true },
          { text:'The weather was sunny in the morning.', correct:false },
          { text:'The cows were in the barn because they were hungry.', correct:true },
        ];
      }
      const base = Array.isArray(ex.narration_sentences) ? ex.narration_sentences : (Array.isArray(data.lines)? data.lines.map(l=>l.en) : String(data.text||'').split(/(?<=[.!?])\s+/));
      const sents = base.filter(Boolean).slice(0,3).map(t=> String(t).trim());
      return sents.map(t=> ({ text:t, correct:true }));
    }
    const tfStatements = deriveTF();
    function deriveFill(){
      const isA1 = String(level||'').toUpperCase()==='A1';
      const isA2 = String(level||'').toUpperCase()==='A2';
      if (isA1) {
        if (Number(idx)===2) return [
          { prompt:'We ____ many cows.', answer:'have' },
          { prompt:'She ____ a medical kit.', answer:'has' },
          { prompt:'The bull ____ a strong body.', answer:'has' },
        ];
        if (Number(idx)===3) return [
          { prompt:'____ the cows walk to the pasture?', answer:'Do' },
          { prompt:'The calf ____ drink milk.', answer:"doesn't" },
          { prompt:'____ we clean the feeding area?', answer:'Do' },
        ];
        if (Number(idx)===4) return [
          { prompt:'The tractor ____ new.', answer:'is' },
          { prompt:'The harvester ____ in the shed.', answer:'is' },
          { prompt:'It ____ ready.', answer:'is' },
        ];
        if (Number(idx)===5) return [
          { prompt:'The sun ____ very hot today.', answer:'is' },
          { prompt:'The plants ____ green.', answer:'are' },
          { prompt:'The temperature ____ mild.', answer:'is' },
        ];
        return [
          { prompt:'I ____ Paul.', answer:'am' },
          { prompt:'The barn ____ open.', answer:'is' },
          { prompt:'The cows ____ calm.', answer:'are' },
        ];
      }
      if (isA2 && Number(idx)===1) {
        return [
          { prompt:'Yesterday ____ a very busy day.', answer:'was' },
          { prompt:'The weather ____ cold and rainy in the morning.', answer:'was' },
          { prompt:'The cows ____ in the barn because they were hungry.', answer:'were' },
        ];
      }
      const items = Array.isArray(data.exercises && data.exercises.fill_in) ? data.exercises.fill_in.slice(0,3) : [];
      if (items.length) return items.map(it=> ({ prompt:it.prompt, answer:it.answer }));
      const src = Array.isArray(ex.narration_sentences) ? ex.narration_sentences : (Array.isArray(data.lines)? data.lines.map(l=>l.en) : String(data.text||'').split(/(?<=[.!?])\s+/));
      const out = [];
      for (let i=0;i<src.length && out.length<3;i++){
        const s = String(src[i]||'').trim();
        const words = s.replace(/[.,!?]+$/,'').split(/\s+/);
        const target = words[1] || words[0] || '';
        const rx = new RegExp(`\\b${String(target).replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}\\b`,'i');
        const blanked = s.replace(rx,'____');
        out.push({ prompt: blanked, answer: String(target).toLowerCase() });
      }
      return out;
    }
    const fillItems = deriveFill();
    function deriveTransform(){
      const isA1 = String(level||'').toUpperCase()==='A1';
      const isA2 = String(level||'').toUpperCase()==='A2';
      if (isA1) {
        if (Number(idx)===2) return [
          { base:'She has a medical kit.', target:'neg', answer: "She doesn't have a medical kit." },
          { base:'The bull has a strong body.', target:'q', answer: 'Does the bull have a strong body?' },
          { base:'We have safe and healthy animals now.', target:'neg', answer: "We don't have safe and healthy animals now." },
        ];
        if (Number(idx)===3) return [
          { base:'We start work at 6:00 AM.', target:'neg', answer:"We don't start work at 6:00 AM." },
          { base:'The cows walk to the pasture.', target:'q', answer:'Do the cows walk to the pasture?' },
          { base:'The small calf drinks milk.', target:'neg', answer:"The small calf doesn't drink milk." }
        ];
        if (Number(idx)===4) return [
          { base:'I drive the green tractor.', target:'q', answer:'Do I drive the green tractor?' },
          { base:'The harvester is in the shed.', target:'neg', answer:'The harvester is not in the shed.' },
          { base:'It is ready.', target:'q', answer:'Is it ready?' }
        ];
        if (Number(idx)===5) return [
          { base:'The sun is very hot today.', target:'neg', answer:'The sun is not very hot today.' },
          { base:'The plants are green.', target:'q', answer:'Are the plants green?' },
          { base:'The harvest will be good this year.', target:'neg', answer:'The harvest will not be good this year.' }
        ];
        return [
          { base:'She is happy.', target:'neg', answer:'She is not happy.' },
          { base:'The barn is open.', target:'q', answer:'Is the barn open?' }
        ];
      }
      if (isA2 && Number(idx)===1) {
        return [
          { base:'The weather was cold and rainy.', target:'neg', answer:'The weather was not cold and rainy.' },
          { base:'The cows were in the barn.', target:'q', answer:'Were the cows in the barn?' },
          { base:'One calf was sick.', target:'neg', answer:'One calf was not sick.' }
        ];
      }
      const neg = Array.isArray(ex.negative) ? ex.negative.slice(0,2) : [];
      const ques = Array.isArray(ex.question) ? ex.question.slice(0,1) : [];
      const toItem = (o, t)=> ({ base: String(o && o.base || '').trim(), target: t, answer: String(o && o.result || '').trim() });
      return [...neg.map(o=> toItem(o,'neg')), ...ques.map(o=> toItem(o,'q'))].filter(it=> it.base && it.answer);
    }
    const transformItems = deriveTransform();
    function deriveOrderSentence(){
      const src = Array.isArray(ex.narration_sentences) ? ex.narration_sentences : (Array.isArray(data.lines)? data.lines.map(l=>l.en) : String(data.text||'').split(/(?<=[.!?])\s+/));
      return String(src[0]||'').trim() || 'The barn is open.';
    }
    const orderSentence = deriveOrderSentence();
    // ============================================================
    // PADRÃO PARA ADICIONAR IMAGENS NA SALA DE EXERCÍCIOS
    // ============================================================
    // REGRA GERAL:
    // 1. Adicionar detecção do nível: const isA2 = String(level||'').toUpperCase()==='A2';
    // 2. Adicionar condição específica: const isA2Tx1 = isA2 && Number(idx)===1;
    // 3. Adicionar bloco if com as imagens mapeadas para as frases
    // 4. Estrutura: /public/images/{LEVEL}/{level}texto{idx}/{n}.{idx}.webp
    // 5. Usar data.pairs ou ex.narration_sentences para obter as frases
    // ============================================================
    function deriveMemoryPairs(){
      const isA1 = String(level||'').toUpperCase()==='A1';
      const isA2 = String(level||'').toUpperCase()==='A2';
      const isTx1 = isA1 && Number(idx)===1;
      const isTx2 = isA1 && Number(idx)===2;
      const isTx3 = isA1 && Number(idx)===3;
      const isTx4 = isA1 && Number(idx)===4;
      const isTx5 = isA1 && Number(idx)===5;
      const isTx6 = isA1 && Number(idx)===6;
      const isTx7 = isA1 && Number(idx)===7;
      const isTx8 = isA1 && Number(idx)===8;
      const isTx9 = isA1 && Number(idx)===9;
      const isA2Tx1 = isA2 && Number(idx)===1;
      const count = isTx2 ? 8 : (isTx4 ? 7 : (isTx5 ? 6 : 10));
      if (isTx1) {
        return [
          { src:'/public/images/A1/a1texto1/1.1.webp', text:'Hello!' },
          { src:'/public/images/A1/a1texto1/2.1.webp', text:'I am Paul, and I am a farmer.' },
          { src:'/public/images/A1/a1texto1/3.1.webp', text:'I am at the farm now.' },
          { src:'/public/images/A1/a1texto1/4.1.webp', text:'My sister is here too.' },
          { src:'/public/images/A1/a1texto1/5.1.webp', text:'She is happy.' },
          { src:'/public/images/A1/a1texto1/6.1.webp', text:'The barn is open.' },
          { src:'/public/images/A1/a1texto1/7.1.webp', text:'It is very big.' },
          { src:'/public/images/A1/a1texto1/8.1.webp', text:'The cows are calm, but the chickens are fast.' },
          { src:'/public/images/A1/a1texto1/9.1.webp', text:'They are funny.' },
          { src:'/public/images/A1/a1texto1/10.1.webp', text:'The sun is hot, but the wind is not strong.' },
          { src:'/public/images/A1/a1texto1/11.1.webp', text:'We are ready for the day.' }
        ];
      }
      if (isTx2) {
        return [
          { src:'/public/images/A1/a1texto2/1.2.webp', text:'I have a livestock farm.' },
          { src:'/public/images/A1/a1texto2/2.2.webp', text:'We have many cows here.' },
          { src:'/public/images/A1/a1texto2/3.2.webp', text:'This is the veterinarian. Her name is Dr. Silva.' },
          { src:'/public/images/A1/a1texto2/4.2.webp', text:'She has a medical kit.' },
          { src:'/public/images/A1/a1texto2/5.2.webp', text:'The bull has a strong body, but he has a small injury on the leg.' },
          { src:'/public/images/A1/a1texto2/6.2.webp', text:'Dr. Silva has the medicine.' },
          { src:'/public/images/A1/a1texto2/7.2.webp', text:'We have safe and healthy animals now.' }
        ];
      }
      if (isTx3) {
        const imgs = Array.from({length:count}, (_,i)=> `/public/images/A1/a1texto3/${i+1}.3.webp`);
        const lines = Array.isArray(ex.narration_sentences) ? ex.narration_sentences : [];
        return Array.from({length:count}, (_,i)=> ({ src: imgs[i], text: String(lines[i]||'').trim() }));
      }
      if (isTx4 || isTx5 || isTx6) {
        const items = (isTx4 ? [
          { src:'/public/images/A1/a1texto4/1.4.webp', text:'I drive the green tractor.', audio:'/src/audio/A1/texto-a1.4-dividido/part_1.mp3' },
          { src:'/public/images/A1/a1texto4/5.4.webp', text:'The farmer waters the plants in the greenhouse.', audio:'/src/audio/A1/texto-a1.4-dividido/part_5.mp3' },
          { src:'/public/images/A1/a1texto4/3.4.webp', text:'The harvester collects the ripe wheat.', audio:'/src/audio/A1/texto-a1.4-dividido/part_3.mp3' },
          { src:'/public/images/A1/a1texto4/7.4.webp', text:'The trailer carries bales of hay.', audio:'/src/audio/A1/texto-a1.4-dividido/part_7.mp3' },
          { src:'/public/images/A1/a1texto4/8.4.webp', text:'He repairs the engine in the shed.', audio:'/src/audio/A1/texto-a1.4-dividido/part_8.mp3' },
          { src:'/public/images/A1/a1texto4/9.4.webp', text:'The field is ready for sowing.', audio:'/src/audio/A1/texto-a1.4-dividido/part_9.mp3' },
          { src:'/public/images/A1/a1texto4/10.4.webp', text:'The cow drinks water near the barn.', audio:'/src/audio/A1/texto-a1.4-dividido/part_10.mp3' }
        ] : isTx6 ? [
          { src:'/public/images/A1/a1texto6/1.6.webp', text:'We have a lot of work today.', audio:'/src/audio/A1/texto-a1.6-dividido/part_1.mp3' },
          { src:'/public/images/A1/a1texto6/2.6.webp', text:'How many bags of corn are in the shed?', audio:'/src/audio/A1/texto-a1.6-dividido/part_2.mp3' },
          { src:'/public/images/A1/a1texto6/3.6.webp', text:'There are ten bags of corn.', audio:'/src/audio/A1/texto-a1.6-dividido/part_3.mp3' },
          { src:'/public/images/A1/a1texto6/4.6.webp', text:'How many tractors are here?', audio:'/src/audio/A1/texto-a1.6-dividido/part_4.mp3' },
          { src:'/public/images/A1/a1texto6/5.6.webp', text:'There is only one tractor.', audio:'/src/audio/A1/texto-a1.6-dividido/part_5.mp3' },
          { src:'/public/images/A1/a1texto6/6.6.webp', text:'I see five horses and twenty cows.', audio:'/src/audio/A1/texto-a1.6-dividido/part_6.mp3' },
          { src:'/public/images/A1/a1texto6/7.6.webp', text:'The inventory is correct.', audio:'/src/audio/A1/texto-a1.6-dividido/part_7.mp3' },
          { src:'/public/images/A1/a1texto6/8.6.webp', text:'We need more salt for the cattle.', audio:'/src/audio/A1/texto-a1.6-dividido/part_8.mp3' }
        ] : [
          { src:'/public/images/A1/a1texto5/1.5.webp', text:'The sun is very hot today.', audio:'/src/audio/A1/texto-a1.5-dividido/part_1.mp3' },
          { src:'/public/images/A1/a1texto5/3.5.webp', text:'The corn needs rain.', audio:'/src/audio/A1/texto-a1.5-dividido/part_3.mp3' },
          { src:'/public/images/A1/a1texto5/5.5.webp', text:'It will rain soon.', audio:'/src/audio/A1/texto-a1.5-dividido/part_5.mp3' },
          { src:'/public/images/A1/a1texto5/7.5.webp', text:'The plants are green.', audio:'/src/audio/A1/texto-a1.5-dividido/part_7.mp3' },
          { src:'/public/images/A1/a1texto5/9.5.webp', text:'The temperature is mild.', audio:'/src/audio/A1/texto-a1.5-dividido/part_9.mp3' },
          { src:'/public/images/A1/a1texto5/10.5.webp', text:'The harvest will be good this year.', audio:'/src/audio/A1/texto-a1.5-dividido/part_10.mp3' }
        ]);
        return items;
      }
      if (isTx7) {
        const imgs = [
          '/public/images/A1/a1texto7/1.7.webp',
          '/public/images/A1/a1texto7/2.7.webp',
          '/public/images/A1/a1texto7/3.7.webp',
          '/public/images/A1/a1texto7/4.7.webp',
          '/public/images/A1/a1texto7/5.7.webp',
          '/public/images/A1/a1texto7/6.7.webp',
          '/public/images/A1/a1texto7/7.7.webp',
          '/public/images/A1/a1texto7/8.7.webp'
        ];
        const lines = Array.isArray(ex.narration_sentences)
          ? ex.narration_sentences
          : (Array.isArray(data.lines) ? data.lines.map(l=>l.en) : []);
        return imgs.map((src,i)=> ({ src, text: String(lines[i]||'').trim() }));
      }
      if (isTx8) {
        const imgs = [
          '/public/images/A1/a1texto8/1.8.webp',
          '/public/images/A1/a1texto8/2.8.webp',
          '/public/images/A1/a1texto8/3.8.webp',
          '/public/images/A1/a1texto8/4.8.webp',
          '/public/images/A1/a1texto8/5.8.webp',
          '/public/images/A1/a1texto8/6.8.webp',
          '/public/images/A1/a1texto8/7.8.webp',
          '/public/images/A1/a1texto8/8.8.webp',
          '/public/images/A1/a1texto8/9.8.webp'
        ];
        const lines = Array.isArray(ex.narration_sentences)
          ? ex.narration_sentences
          : (Array.isArray(data.lines) ? data.lines.map(l=>l.en) : []);
        return imgs.map((src,i)=> ({ src, text: String(lines[i]||'').trim() }));
      }
      if (isTx9) {
        const imgs = [
          '/public/images/A1/a1texto9/1.9.webp',
          '/public/images/A1/a1texto9/2.9.webp',
          '/public/images/A1/a1texto9/3.9.webp',
          '/public/images/A1/a1texto9/4.9.webp',
          '/public/images/A1/a1texto9/5.9.webp',
          '/public/images/A1/a1texto9/6.9.webp',
          '/public/images/A1/a1texto9/7.9.webp',
          '/public/images/A1/a1texto9/8.9.webp'
        ];
        const lines = Array.isArray(data.pairs)
          ? data.pairs.map(p=> String(p.en||'').trim())
          : (Array.isArray(ex.narration_sentences)
              ? ex.narration_sentences
              : (Array.isArray(data.lines)
                  ? data.lines.map(l=> String(l.en||'').trim())
                  : String(data.text||'').split(/(?<=[.!?])\s+/)));
        return imgs.map((src,i)=> ({ src, text: String(lines[i]||'').trim() }));
      }
      if (isA1 && Number(idx)===10) {
        const imgs = [
          '/public/images/A1/a1texto10/1.10.webp',
          '/public/images/A1/a1texto10/2.10.webp',
          '/public/images/A1/a1texto10/3.10.webp',
          '/public/images/A1/a1texto10/4.10.webp',
          '/public/images/A1/a1texto10/5.10.webp',
          '/public/images/A1/a1texto10/6.10.webp',
          '/public/images/A1/a1texto10/7.10.webp',
          '/public/images/A1/a1texto10/8.10.webp'
        ];
        const lines = Array.isArray(data.pairs)
          ? data.pairs.map(p=> String(p.en||'').trim())
          : (Array.isArray(ex.narration_sentences)
              ? ex.narration_sentences
              : (Array.isArray(data.lines)
                  ? data.lines.map(l=> String(l.en||'').trim())
                  : String(data.text||'').split(/(?<=[.!?])\s+/)));
        return imgs.map((src,i)=> ({ src, text: String(lines[i]||'').trim() }));
      }
      if (isA1 && Number(idx)===11) {
        return [
          { src:'./public/images/A1/a1texto11/1.11.webp', text:'Tomorrow is Monday.' },
          { src:'./public/images/A1/a1texto11/2.11.webp', text:'It is an important day.' },
          { src:'./public/images/A1/a1texto11/3.11.webp', text:'We will start the soybean harvest.' },
          { src:'./public/images/A1/a1texto11/4.11.webp', text:'The trucks will arrive at 7:00 AM.' },
          { src:'./public/images/A1/a1texto11/5.11.webp', text:'On Tuesday, we will load the grain into the silos.' },
          { src:'./public/images/A1/a1texto11/6.11.webp', text:'The mechanic will check the harvester again.' },
          { src:'./public/images/A1/a1texto11/7.11.webp', text:'The weather will be sunny all week.' },
          { src:'./public/images/A1/a1texto11/8.11.webp', text:'We will sell the production on Friday.' },
          { src:'./public/images/A1/a1texto11/9.11.webp', text:'It will be a busy week for us.' }
        ];
      }
      if (isA1 && Number(idx)===12) {
        return [
          { src:'/public/images/A1/a1texto12/1.12.webp', text:'The harvest is finished. The silos are full.' },
          { src:'/public/images/A1/a1texto12/2.12.webp', text:'We go to the cooperative.' },
          { src:'/public/images/A1/a1texto12/3.12.webp', text:'We sell the grain at the market.' },
          { src:'/public/images/A1/a1texto12/4.12.webp', text:'The buyer asks, How much is one ton?' },
          { src:'/public/images/A1/a1texto12/5.12.webp', text:'It costs 500 dollars per ton.' },
          { src:'/public/images/A1/a1texto12/6.12.webp', text:'Some machines are expensive.' },
          { src:'/public/images/A1/a1texto12/7.12.webp', text:'Inputs are expensive too.' },
          { src:'/public/images/A1/a1texto12/8.12.webp', text:'A small bag is cheap.' },
          { src:'/public/images/A1/a1texto12/9.12.webp', text:'We count the money.' },
          { src:'/public/images/A1/a1texto12/10.12.webp', text:'We pay the costs and we see the profit.' }
        ];
      }
      if (isA2Tx1) {
        const lines = Array.isArray(data.pairs)
          ? data.pairs.map(p=> String(p.en||'').trim())
          : (Array.isArray(ex.narration_sentences)
              ? ex.narration_sentences
              : (Array.isArray(data.lines)
                  ? data.lines.map(l=> String(l.en||'').trim())
                  : String(data.text||'').split(/(?<=[.!?])\s+/)));
        return [
          { src:'/public/images/A2/a2texto1/1.1.webp', text: String(lines[0]||'').trim() },
          { src:'/public/images/A2/a2texto1/2.1.webp', text: String(lines[1]||'').trim() },
          { src:'/public/images/A2/a2texto1/3.1.webp', text: String(lines[2]||'').trim() },
          { src:'/public/images/A2/a2texto1/4.1.webp', text: String(lines[3]||'').trim() },
          { src:'/public/images/A2/a2texto1/5.1.webp', text: String(lines[4]||'').trim() },
          { src:'/public/images/A2/a2texto1/6.1.webp', text: String(lines[5]||'').trim() },
          { src:'/public/images/A2/a2texto1/7.1.webp', text: String(lines[6]||'').trim() },
          { src:'/public/images/A2/a2texto1/8.1.webp', text: String(lines[7]||'').trim() }
        ];
      }
      const base = Array.isArray(ex.narration_sentences) ? ex.narration_sentences : (Array.isArray(data.lines)? data.lines.map(l=>l.en) : String(data.text||'').split(/(?<=[.!?])\s+/));
      const texts = base.filter(Boolean).slice(0,count).map(t=> String(t).trim());
      const placeholder = '/public/icons/apple-touch-icon.webp';
      return texts.map(t=> ({ src: placeholder, text: t }));
    }
    const videoPairs = deriveMemoryPairs();
    function deriveAssoc(){
      const v = Array.isArray(data.vocabulary) ? data.vocabulary.slice(0,6) : null;
      if (v) return v.map(it=> ({ word: String(it.en||it.word||'').trim(), pt: String(it.pt||'').trim() })).filter(it=> it.word && it.pt);
      const trs = Array.isArray(ex.translation_short) ? ex.translation_short.slice(0,6) : [];
      return trs.map(it=> ({ word: String(it.en||'').trim(), pt: String(it.pt||'').trim() }));
    }
    const assocItems = deriveAssoc();
    const isA1 = String(level||'').toUpperCase()==='A1';
    const isA2 = String(level||'').toUpperCase()==='A2';
    return e('div', { className:'w-full max-w-4xl mx-auto' },
      e('div', { className:'mb-4 flex items-center justify-between' },
        e('h2', { className:'text-base font-bold text-green-700' }, isA1 ? `${String(data.uiTitle||data.title||'A1 Texto')} · Exercícios (A1)` : `${String(data.uiTitle||data.title||'Texto')} · Exercícios (${String(level||'').toUpperCase()})`),
        e('div', { className:'text-xs text-gray-600' }, isA1 ? 'Nível A1 · Fácil' : `Nível ${String(level||'').toUpperCase()}`)
      ),
      e('div', { className:'grid grid-cols-1 gap-4' },
        e(ExerciseCard, { title:'Vocabulário com imagens', instruction:'Veja e associe (jogo de memória)' }, e(VocabularyMemoryGame, { pairs: videoPairs, initialCorrect: (isA1 && Number(idx)===7 ? 1 : 0) })),
        e(ExerciseCard, { title:'Transformar frases', instruction:'Digite a versão pedida' }, e(TransformSentences, { items: transformItems })),
        e(ExerciseCard, { title: (isA1 ? (Number(idx)===2?'Completar com HAVE / HAS':(Number(idx)===3?'Completar com DO / DOES':'Completar com Am / Is / Are')) : 'Completar lacunas'), instruction:'Preencha corretamente' }, e(InputFillBlank, { items: fillItems })),
        e(ExerciseCard, { title:'Verdadeiro ou Falso', instruction:'Marque V/F' }, e(TrueFalseCard, { statements: tfStatements })),
        e(ExerciseCard, { title:'Ordenar palavras', instruction:'Monte a frase correta' },
          e('div', null,
            e('div', { className:'text-sm text-gray-800 mb-2' }, orderSentence),
            e(OrderWords, { sentence: orderSentence })
          )
        ),
        e(ExerciseCard, { title:'Ditado', instruction:'Ouça e escreva' },
          (isA1 && (Number(idx)===1 || Number(idx)===4 || Number(idx)===5 || Number(idx)===6 || Number(idx)===7 || Number(idx)===8 || Number(idx)===9 || Number(idx)===10 || Number(idx)===11))
            ? e(DictationExercise, {
                sentences: (Number(idx)===1 ? [
                  "Hello! I am Paul, and I am a farmer.",
                  "I am at the farm now.",
                  "My sister is here too. She is happy.",
                  "The barn is open. It is very big.",
                  "The cows are calm, but the chickens are fast. They are funny.",
                  "The sun is hot, but the wind is not strong.",
                  "We are ready for the day."
                ] : Number(idx)===4 ? [
                  'I drive the green tractor.',
                  'The farmer waters the plants in the greenhouse.',
                  'The harvester collects the ripe wheat.',
                  'The trailer carries bales of hay.',
                  'He repairs the engine in the shed.',
                  'The field is ready for sowing.'
                ] : Number(idx)===6 ? [
                  'We have a lot of work today.',
                  'How many bags of corn are in the shed?',
                  'There are ten bags of corn.',
                  'How many tractors are here?',
                  'There is only one tractor.',
                  'I see five horses and twenty cows.',
                  'The inventory is correct.',
                  'We need more salt for the cattle.'
                ] : Number(idx)===7 ? [
                  'Where are the farm tools?',
                  'The shovel is in the shed.',
                  'The hammer is on the wood table.',
                  'The buckets are under the water tap.',
                  'The tractor is next to the barn.',
                  'The cows are behind the fence.',
                  'Everything is in the right place.',
                  'Organization is important.'
                ] : Number(idx)===8 ? [
                  'Safety is priority number one.',
                  'Please, read the signs.',
                  'Wear your heavy boots and gloves.',
                  'Stop the machine immediately!',
                  "Don't touch the electric fence. It is dangerous.",
                  "Don't smoke near the dry hay."
                ] : Number(idx)===9 ? [
                  'Look at the team now!',
                  'We are working hard.',
                  'Carlos is repairing the old fence.',
                  'The mechanic is fixing the tractor engine.',
                  'I am cleaning the milking machine.',
                  'The cows are waiting in the shade.',
                  'They are not eating at this moment.',
                  'Everything is moving fast today.'
                ] : Number(idx)===10 ? [
                  'We have a skilled team on the farm.',
                  'John can operate the new harvester.',
                  'He has a special license.',
                  'I can drive the pickup truck, but I cannot drive the heavy tractor.',
                  'This red tractor is very strong.',
                  'It can pull a large trailer with five tons of soy.',
                  'Can you help me with the bags?',
                  'Yes, we can do this together.'
                ] : Number(idx)===11 ? [
                  'Tomorrow is Monday.',
                  'It is an important day.',
                  'We will start the soybean harvest.',
                  'The trucks will arrive at 7:00 AM.',
                  'On Tuesday, we will load the grain into the silos.',
                  'The mechanic will check the harvester again.',
                  'The weather will be sunny all week.',
                  'We will sell the production on Friday.',
                  'It will be a busy week for us.'
                ] : [
                  'The sun is very hot today.',
                  'The corn needs rain.',
                  'It will rain soon.',
                  'The plants are green.',
                  'The temperature is mild.',
                  'The harvest will be good this year.'
                ]),
                segUrls: (Number(idx)===1 ? [
                  '/src/audio/A1/texto-a1.1-dividido/part_1.mp3',
                  '/src/audio/A1/texto-a1.1-dividido/part_2.mp3',
                  '/src/audio/A1/texto-a1.1-dividido/part_3.mp3',
                  '/src/audio/A1/texto-a1.1-dividido/part_4.mp3',
                  '/src/audio/A1/texto-a1.1-dividido/part_5.mp3',
                  '/src/audio/A1/texto-a1.1-dividido/part_6.mp3',
                  '/src/audio/A1/texto-a1.1-dividido/part_7.mp3'
                ] : Number(idx)===4 ? [
                  '/src/audio/A1/texto-a1.4-dividido/part_1.mp3',
                  '/src/audio/A1/texto-a1.4-dividido/part_5.mp3',
                  '/src/audio/A1/texto-a1.4-dividido/part_3.mp3',
                  '/src/audio/A1/texto-a1.4-dividido/part_7.mp3',
                  '/src/audio/A1/texto-a1.4-dividido/part_8.mp3',
                  '/src/audio/A1/texto-a1.4-dividido/part_9.mp3'
                ] : Number(idx)===6 ? [
                  '/src/audio/A1/texto-a1.6-dividido/audio_part_1.mp3',
                  '/src/audio/A1/texto-a1.6-dividido/audio_part_2.mp3',
                  '/src/audio/A1/texto-a1.6-dividido/audio_part_3.mp3',
                  '/src/audio/A1/texto-a1.6-dividido/audio_part_4.mp3',
                  '/src/audio/A1/texto-a1.6-dividido/audio_part_5.mp3',
                  '/src/audio/A1/texto-a1.6-dividido/audio_part_6.mp3',
                  '/src/audio/A1/texto-a1.6-dividido/audio_part_7.mp3',
                  '/src/audio/A1/texto-a1.6-dividido/audio_part_8.mp3'
                ] : Number(idx)===7 ? [
                  '/src/audio/A1/texto-a1.7-dividido/part_1.mp3',
                  '/src/audio/A1/texto-a1.7-dividido/part_2.mp3',
                  '/src/audio/A1/texto-a1.7-dividido/part_3.mp3',
                  '/src/audio/A1/texto-a1.7-dividido/part_4.mp3',
                  '/src/audio/A1/texto-a1.7-dividido/part_5.mp3',
                  '/src/audio/A1/texto-a1.7-dividido/part_6.mp3',
                  '/src/audio/A1/texto-a1.7-dividido/part_7.mp3',
                  '/src/audio/A1/texto-a1.7-dividido/part_8.mp3'
                ] : Number(idx)===8 ? [
                  '/src/audio/A1/texto-a1.8-dividido/audio_part_1.mp3',
                  '/src/audio/A1/texto-a1.8-dividido/audio_part_2.mp3',
                  '/src/audio/A1/texto-a1.8-dividido/audio_part_3.mp3',
                  '/src/audio/A1/texto-a1.8-dividido/audio_part_4.mp3',
                  '/src/audio/A1/texto-a1.8-dividido/audio_part_5.mp3',
                  '/src/audio/A1/texto-a1.8-dividido/audio_part_6.mp3'
                ] : Number(idx)===9 ? [
                  '/src/audio/A1/texto-a1.9-dividido/part1.mp3',
                  '/src/audio/A1/texto-a1.9-dividido/part2.mp3',
                  '/src/audio/A1/texto-a1.9-dividido/part3.mp3',
                  '/src/audio/A1/texto-a1.9-dividido/part4.mp3',
                  '/src/audio/A1/texto-a1.9-dividido/part5.mp3',
                  '/src/audio/A1/texto-a1.9-dividido/part6.mp3',
                  '/src/audio/A1/texto-a1.9-dividido/part7.mp3',
                  '/src/audio/A1/texto-a1.9-dividido/part8.mp3'
                ] : Number(idx)===10 ? [
                  '/src/audio/A1/texto-a1.10-dividido/audio_1.mp3',
                  '/src/audio/A1/texto-a1.10-dividido/audio_2.mp3',
                  '/src/audio/A1/texto-a1.10-dividido/audio_3.mp3',
                  '/src/audio/A1/texto-a1.10-dividido/audio_4.mp3',
                  '/src/audio/A1/texto-a1.10-dividido/audio_5.mp3',
                  '/src/audio/A1/texto-a1.10-dividido/audio_6.mp3',
                  '/src/audio/A1/texto-a1.10-dividido/audio_7.mp3',
                  '/src/audio/A1/texto-a1.10-dividido/audio_8.mp3'
                ] : Number(idx)===11 ? [
                  '/src/audio/A1/texto-a1.11-dividido/audio_1.mp3',
                  '/src/audio/A1/texto-a1.11-dividido/audio_2.mp3',
                  '/src/audio/A1/texto-a1.11-dividido/audio_3.mp3',
                  '/src/audio/A1/texto-a1.11-dividido/audio_4.mp3',
                  '/src/audio/A1/texto-a1.11-dividido/audio_5.mp3',
                  '/src/audio/A1/texto-a1.11-dividido/audio_6.mp3',
                  '/src/audio/A1/texto-a1.11-dividido/audio_7.mp3',
                  '/src/audio/A1/texto-a1.11-dividido/audio_8.mp3',
                  '/src/audio/A1/texto-a1.11-dividido/audio_9.mp3'
                ] : [
                    '/src/audio/A1/texto-a1.5-dividido/part_1.mp3',
                    '/src/audio/A1/texto-a1.5-dividido/part_3.mp3',
                    '/src/audio/A1/texto-a1.5-dividido/part_5.mp3',
                    '/src/audio/A1/texto-a1.5-dividido/part_7.mp3',
                    '/src/audio/A1/texto-a1.5-dividido/part_9.mp3',
                    '/src/audio/A1/texto-a1.5-dividido/part_10.mp3'
                ])
              })
            : e(DictationExercise, { sentences: (Array.isArray(ex.narration_sentences)? ex.narration_sentences.slice(0,6) : (Array.isArray(data.lines)? data.lines.map(l=>l.en) : String(data.text||'').split(/(?<=[.!?])\s+/))).slice(0,6) })
        ),
        // ============================================================
        // PADRÃO PARA ADICIONAR IMAGENS NA ASSOCIAÇÃO VISUAL
        // ============================================================
        // REGRA: Adicionar condição na verificação acima e no array de items
        // Estrutura: { src:'/public/images/{LEVEL}/{level}texto{idx}/{n}.{idx}.webp', 
        //              text:'Frase em inglês', 
        //              audio:'/src/audio/{LEVEL}/texto-{level}.{idx}-dividido/part_{NN}.mp3' }
        // ============================================================
        e(ExerciseCard, { title:'Associação visual', instruction:'Associe imagem e frase' },
          ((isA1 && (Number(idx)===1 || Number(idx)===4 || Number(idx)===5 || Number(idx)===6 || Number(idx)===9 || Number(idx)===11 || Number(idx)===12)) || (isA2 && Number(idx)===1))
            ? e(ImageSentenceAssociation, { items: (isA2 && Number(idx)===1 ? [
                { src:'/public/images/A2/a2texto1/1.1.webp', text:'Yesterday was a very busy day.', audio:'/src/audio/A2/texto-a2.1-dividido/part_01.mp3' },
                { src:'/public/images/A2/a2texto1/2.1.webp', text:'The weather was cold and rainy in the morning.', audio:'/src/audio/A2/texto-a2.1-dividido/part_02.mp3' },
                { src:'/public/images/A2/a2texto1/3.1.webp', text:'The corn field was muddy.', audio:'/src/audio/A2/texto-a2.1-dividido/part_03.mp3' },
                { src:'/public/images/A2/a2texto1/4.1.webp', text:'It was difficult to drive there.', audio:'/src/audio/A2/texto-a2.1-dividido/part_04.mp3' },
                { src:'/public/images/A2/a2texto1/5.1.webp', text:'The cows were in the barn because they were hungry.', audio:'/src/audio/A2/texto-a2.1-dividido/part_05.mp3' },
                { src:'/public/images/A2/a2texto1/6.1.webp', text:'One calf was sick, but the vet was here quickly.', audio:'/src/audio/A2/texto-a2.1-dividido/part_06.mp3' },
                { src:'/public/images/A2/a2texto1/7.1.webp', text:'The tractors were in the garage. They were not broken.', audio:'/src/audio/A2/texto-a2.1-dividido/part_07.mp3' },
                { src:'/public/images/A2/a2texto1/8.1.webp', text:'We were tired at night, but the animals were safe.', audio:'/src/audio/A2/texto-a2.1-dividido/part_08.mp3' }
              ] : Number(idx)===1 ? [
                { src:'/public/images/A1/a1texto1/1.1.webp', text:'Hello!', audio:'/src/audio/A1/texto-a1.1-dividido/part_1.mp3' },
                { src:'/public/images/A1/a1texto1/2.1.webp', text:'I am Paul, and I am a farmer.', audio:'/src/audio/A1/texto-a1.1-dividido/part_1.mp3' },
                { src:'/public/images/A1/a1texto1/3.1.webp', text:'I am at the farm now.', audio:'/src/audio/A1/texto-a1.1-dividido/part_2.mp3' },
                { src:'/public/images/A1/a1texto1/4.1.webp', text:'My sister is here too.', audio:'/src/audio/A1/texto-a1.1-dividido/part_3.mp3' },
                { src:'/public/images/A1/a1texto1/5.1.webp', text:'She is happy.', audio:'/src/audio/A1/texto-a1.1-dividido/part_3.mp3' },
                { src:'/public/images/A1/a1texto1/6.1.webp', text:'The barn is open.', audio:'/src/audio/A1/texto-a1.1-dividido/part_4.mp3' },
                { src:'/public/images/A1/a1texto1/7.1.webp', text:'It is very big.', audio:'/src/audio/A1/texto-a1.1-dividido/part_4.mp3' },
                { src:'/public/images/A1/a1texto1/8.1.webp', text:'The cows are calm, but the chickens are fast.', audio:'/src/audio/A1/texto-a1.1-dividido/part_5.mp3' },
                { src:'/public/images/A1/a1texto1/9.1.webp', text:'They are funny.', audio:'/src/audio/A1/texto-a1.1-dividido/part_5.mp3' },
                { src:'/public/images/A1/a1texto1/10.1.webp', text:'The sun is hot, but the wind is not strong.', audio:'/src/audio/A1/texto-a1.1-dividido/part_6.mp3' },
                { src:'/public/images/A1/a1texto1/11.1.webp', text:'We are ready for the day.', audio:'/src/audio/A1/texto-a1.1-dividido/part_7.mp3' }
              ] : Number(idx)===4 ? [
                { src:'/public/images/A1/a1texto4/1.4.webp', text:'I drive the green tractor.', audio:'/src/audio/A1/texto-a1.4-dividido/part_1.mp3' },
                { src:'/public/images/A1/a1texto4/5.4.webp', text:'The farmer waters the plants in the greenhouse.', audio:'/src/audio/A1/texto-a1.4-dividido/part_5.mp3' },
                { src:'/public/images/A1/a1texto4/3.4.webp', text:'The harvester collects the ripe wheat.', audio:'/src/audio/A1/texto-a1.4-dividido/part_3.mp3' },
                { src:'/public/images/A1/a1texto4/7.4.webp', text:'The trailer carries bales of hay.', audio:'/src/audio/A1/texto-a1.4-dividido/part_7.mp3' },
                { src:'/public/images/A1/a1texto4/8.4.webp', text:'He repairs the engine in the shed.', audio:'/src/audio/A1/texto-a1.4-dividido/part_8.mp3' },
                { src:'/public/images/A1/a1texto4/9.4.webp', text:'The field is ready for sowing.', audio:'/src/audio/A1/texto-a1.4-dividido/part_9.mp3' },
                { src:'/public/images/A1/a1texto4/10.4.webp', text:'The cow drinks water near the barn.', audio:'/src/audio/A1/texto-a1.4-dividido/part_10.mp3' }
              ] : Number(idx)===6 ? [
                { src:'/public/images/A1/a1texto6/1.6.webp', text:'We have a lot of work today.', audio:'/src/audio/A1/texto-a1.6-dividido/part_1.mp3' },
                { src:'/public/images/A1/a1texto6/2.6.webp', text:'How many bags of corn are in the shed?', audio:'/src/audio/A1/texto-a1.6-dividido/part_2.mp3' },
                { src:'/public/images/A1/a1texto6/3.6.webp', text:'There are ten bags of corn.', audio:'/src/audio/A1/texto-a1.6-dividido/part_3.mp3' },
                { src:'/public/images/A1/a1texto6/4.6.webp', text:'How many tractors are here?', audio:'/src/audio/A1/texto-a1.6-dividido/part_4.mp3' },
                { src:'/public/images/A1/a1texto6/5.6.webp', text:'There is only one tractor.', audio:'/src/audio/A1/texto-a1.6-dividido/part_5.mp3' },
                { src:'/public/images/A1/a1texto6/6.6.webp', text:'I see five horses and twenty cows.', audio:'/src/audio/A1/texto-a1.6-dividido/part_6.mp3' },
                { src:'/public/images/A1/a1texto6/7.6.webp', text:'The inventory is correct.', audio:'/src/audio/A1/texto-a1.6-dividido/part_7.mp3' },
                { src:'/public/images/A1/a1texto6/8.6.webp', text:'We need more salt for the cattle.', audio:'/src/audio/A1/texto-a1.6-dividido/part_8.mp3' }
              ] : Number(idx)===9 ? [
                { src:'/public/images/A1/a1texto9/1.9.webp', text:'Look at the team now!' },
                { src:'/public/images/A1/a1texto9/2.9.webp', text:'We are working hard.' },
                { src:'/public/images/A1/a1texto9/3.9.webp', text:'Carlos is repairing the old fence.' },
                { src:'/public/images/A1/a1texto9/4.9.webp', text:'The mechanic is fixing the tractor engine.' },
                { src:'/public/images/A1/a1texto9/5.9.webp', text:'I am cleaning the milking machine.' },
                { src:'/public/images/A1/a1texto9/6.9.webp', text:'The cows are waiting in the shade.' },
                { src:'/public/images/A1/a1texto9/7.9.webp', text:'They are not eating at this moment.' },
                { src:'/public/images/A1/a1texto9/8.9.webp', text:'Everything is moving fast today.' }
              ] : Number(idx)===11 ? [
                { src:'./public/images/A1/a1texto11/1.11.webp', text:'Tomorrow is Monday.', audio:'./src/audio/A1/texto-a1.11-dividido/audio_1.mp3' },
                { src:'./public/images/A1/a1texto11/2.11.webp', text:'It is an important day.', audio:'./src/audio/A1/texto-a1.11-dividido/audio_2.mp3' },
                { src:'./public/images/A1/a1texto11/3.11.webp', text:'We will start the soybean harvest.', audio:'./src/audio/A1/texto-a1.11-dividido/audio_3.mp3' },
                { src:'./public/images/A1/a1texto11/4.11.webp', text:'The trucks will arrive at 7:00 AM.', audio:'./src/audio/A1/texto-a1.11-dividido/audio_4.mp3' },
                { src:'./public/images/A1/a1texto11/5.11.webp', text:'On Tuesday, we will load the grain into the silos.', audio:'./src/audio/A1/texto-a1.11-dividido/audio_5.mp3' },
                { src:'./public/images/A1/a1texto11/6.11.webp', text:'The mechanic will check the harvester again.', audio:'./src/audio/A1/texto-a1.11-dividido/audio_6.mp3' },
                { src:'./public/images/A1/a1texto11/7.11.webp', text:'The weather will be sunny all week.', audio:'./src/audio/A1/texto-a1.11-dividido/audio_7.mp3' },
                { src:'./public/images/A1/a1texto11/8.11.webp', text:'We will sell the production on Friday.', audio:'./src/audio/A1/texto-a1.11-dividido/audio_8.mp3' },
                { src:'./public/images/A1/a1texto11/9.11.webp', text:'It will be a busy week for us.', audio:'./src/audio/A1/texto-a1.11-dividido/audio_9.mp3' }
              ] : Number(idx)===12 ? [
                { src:'/public/images/A1/a1texto12/1.12.webp', text:'The harvest is finished. The silos are full.' },
                { src:'/public/images/A1/a1texto12/2.12.webp', text:'We go to the cooperative.' },
                { src:'/public/images/A1/a1texto12/3.12.webp', text:'We sell the grain at the market.' },
                { src:'/public/images/A1/a1texto12/4.12.webp', text:'The buyer asks, How much is one ton?' },
                { src:'/public/images/A1/a1texto12/5.12.webp', text:'It costs 500 dollars per ton.' },
                { src:'/public/images/A1/a1texto12/6.12.webp', text:'Some machines are expensive.' },
                { src:'/public/images/A1/a1texto12/7.12.webp', text:'Inputs are expensive too.' },
                { src:'/public/images/A1/a1texto12/8.12.webp', text:'A small bag is cheap.' },
                { src:'/public/images/A1/a1texto12/9.12.webp', text:'We count the money.' },
                { src:'/public/images/A1/a1texto12/10.12.webp', text:'We pay the costs and we see the profit.' }
              ] : [
                { src:'/public/images/A1/a1texto5/1.5.webp', text:'The sun is very hot today.', audio:'/src/audio/A1/texto-a1.5-dividido/part_1.mp3' },
                { src:'/public/images/A1/a1texto5/3.5.webp', text:'The corn needs rain.', audio:'/src/audio/A1/texto-a1.5-dividido/part_3.mp3' },
                { src:'/public/images/A1/a1texto5/5.5.webp', text:'It will rain soon.', audio:'/src/audio/A1/texto-a1.5-dividido/part_5.mp3' },
                { src:'/public/images/A1/a1texto5/7.5.webp', text:'The plants are green.', audio:'/src/audio/A1/texto-a1.5-dividido/part_7.mp3' },
                { src:'/public/images/A1/a1texto5/9.5.webp', text:'The temperature is mild.', audio:'/src/audio/A1/texto-a1.5-dividido/part_9.mp3' },
                { src:'/public/images/A1/a1texto5/10.5.webp', text:'The harvest will be good this year.', audio:'/src/audio/A1/texto-a1.5-dividido/part_10.mp3' }
              ]) })
            : e(VisualAssociation12, { items: assocItems })
        ),
        e(ExerciseCard, { title:'Finalizar', instruction:'Bom trabalho!' }, e('div', { className:'text-sm text-gray-800' }, 'Great job!'))
      )
    );
  }

  window.ExercisePageMount = function(level, idx, data){
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
    const tree = e(ExercisePageLayout, { data, idx, level });
    if (ReactDOM.createRoot) ReactDOM.createRoot(rootEl).render(tree); else ReactDOM.render(tree, rootEl);
  };
})();
