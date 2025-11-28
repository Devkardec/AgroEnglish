/* global React, ReactDOM */
(function(){
  const e = React.createElement;

  function SlideLayout(props){
    const { slides, index, onPrev, onNext, showTr } = props;
    const cur = slides[index] || {};
    return e('div', { className: 'w-full max-w-3xl mx-auto' },
      e(SlideRenderer, { slide: cur, showTr, index }),
      e('div', { className: 'flex items-center justify-between mt-3' },
        e('div', { className: 'text-sm text-gray-600' }, `Slide ${index+1}/${slides.length}`),
        e('div', { className: 'flex gap-2' },
          e('button', { className: 'px-3 py-2 rounded bg-gray-100 text-gray-800', onClick:onPrev, disabled:index===0 }, 'Prev'),
          e('button', { className: 'px-3 py-2 rounded bg-green-600 text-white', onClick:onNext, disabled:index>=slides.length-1 }, 'Next')
        )
      )
    );
  }

  function Card({ title, children }){
    return e('div', { className: 'rounded-2xl border border-gray-200 bg-white shadow-sm p-4' },
      title ? e('div', { className: 'text-sm font-semibold text-gray-700 mb-2' }, title) : null,
      children
    );
  }

  function SlideTitle({ image }){
    return e(Card, { title: null },
      image ? e('img', { src: image, alt: '', className:'w-full h-auto object-contain rounded-lg', 'data-slide-image':'true' }) : null
    );
  }

  function SlideExplain({ text, showTr, pt, image }){
    const lines = Array.isArray(text)? text : [String(text||'')];
    const tr = Array.isArray(pt)? pt : [];
    return e(Card, { title: 'Explicação simples' },
      image ? e('img', { src:image, alt:'', className:'w-full h-auto object-contain max-h-[72vh] rounded-lg mb-2', 'data-slide-image':'true' }) : null,
      e('ul', { className: 'list-disc list-inside text-sm text-gray-800' },
        lines.map((t,i)=> e('li', { key:i }, t))
      ),
      showTr && tr.length ? e('div', { className:'mt-2 text-xs text-gray-500 space-y-1' }, tr.map((t,i)=> e('div',{key:i},t))) : null
    );
  }

  function SlideUsage({ text, pt, showTr, image }){
    const lines = Array.isArray(text)? text : [String(text||'')];
    const tr = Array.isArray(pt)? pt : [];
    return e(Card, { title:'Exemplos' },
      image ? e('img', { src:image, alt:'', className:'w-full h-auto object-contain max-h-[72vh] rounded-lg mb-2', 'data-slide-image':'true' }) : null,
      e('ul', { className:'space-y-1' },
        lines.map((t,i)=> e('li', { key:i, className:'text-sm text-gray-800' },
          e('div', { className:'flex items-center gap-2' }, e('span', { className:'inline-block w-2 h-2 rounded-full bg-green-600' }), t),
          showTr && tr[i] ? e('div', { className:'text-xs text-gray-500 mt-1' }, tr[i]) : null
        ))
      )
    );
  }

  function SlideStructure({ text, pt, showTr, image }){
    const lines = Array.isArray(text)? text : [String(text||'')];
    const tr = Array.isArray(pt)? pt : [];
    return e(Card, { title:'Estrutura rápida' },
      image ? e('img', { src:image, alt:'', className:'w-full h-auto object-contain max-h-[72vh] rounded-lg mb-2', 'data-slide-image':'true' }) : null,
      e('div', { className:'text-sm text-gray-800 space-y-1' },
        lines.map((t,i)=> e('div', { key:i }, t))
      ),
      showTr && tr.length ? e('div', { className:'mt-2 text-xs text-gray-500 space-y-1' }, tr.map((t,i)=> e('div',{key:i},t))) : null
    );
  }

  function SlideCard({ title, text, image }){
    return e(Card, { title },
      image ? e('img', { src:image, alt:title||'', className:'w-full h-36 object-cover rounded-lg mb-2', 'data-slide-image':'true' }) : null,
      e('div', { className:'text-sm text-gray-800' }, text)
    );
  }

  function SlideVocab({ items, image }){
    const list = Array.isArray(items)? items : [];
    return e(Card, { title:'Vocabulário + pronúncia' },
      image ? e('img', { src:image, alt:'', className:'w-full h-auto object-contain max-h-[72vh] rounded-lg mb-2', 'data-slide-image':'true' }) : null,
      e('div', { className:'grid grid-cols-2 gap-2' },
        list.map((it,i)=> e('div', { key:i, className:'flex items-center gap-2' },
          e('div', { className:'w-9 h-9 rounded-md bg-green-50 flex items-center justify-center text-green-700 font-bold' }, it.word[0].toUpperCase()),
          e('div', { className:'text-sm' },
            e('div', { className:'font-semibold text-gray-800' }, it.word),
            e('div', { className:'text-gray-600' }, `${it.pt} · ${it.pron}`)
          )
        ))
      )
    );
  }

  function SlideSummary({ text, image }){
    const lines = Array.isArray(text)? text : [String(text||'')];
    return e(Card, { title:'Resumo' },
      image ? e('img', { src:image, alt:'', className:'w-full h-auto object-contain max-h-[72vh] rounded-lg mb-2', 'data-slide-image':'true' }) : null,
      e('ul', { className:'list-disc list-inside text-sm text-gray-800' },
        lines.map((t,i)=> e('li', { key:i }, t))
      )
    );
  }

  function SlideRich({ html, image }){
    return e(Card, { title: null },
      image ? e('img', { src:image, alt:'', className:'w-full h-auto object-contain rounded-lg mb-2', 'data-slide-image':'true' }) : null,
      e('div', { className:'text-sm text-gray-800', dangerouslySetInnerHTML: { __html: html } })
    );
  }

  function SlideRenderer({ slide, showTr, index }){
    const t = String(slide.type||'');
    const idx = Number(index||0);
    const defaultImgs = Array.isArray(window.__A1_3_IMAGES) ? window.__A1_3_IMAGES : null;
    const image = slide.image || (defaultImgs ? defaultImgs[idx] : undefined);
    if (t==='title') return e(SlideTitle, { image });
    if (t==='explain') return e(SlideExplain, { text:slide.text, pt:slide.pt, image, showTr });
    if (t==='usage') return e(SlideUsage, { text:slide.text, pt:slide.pt, image, showTr });
    if (t==='structure') return e(SlideStructure, { text:slide.text, pt:slide.pt, image, showTr });
    if (t==='card') return e(SlideCard, { title:slide.title, text:slide.text, image });
    if (t==='vocab') return e(SlideVocab, { items:slide.items, image });
    if (t==='summary') return e(SlideSummary, { text:slide.text, image });
    if (t==='rich') return e(SlideRich, { html:slide.html, image });
    return e(Card, null, e('div', { className:'text-sm text-gray-600' }, 'Conteúdo')); 
  }

  async function loadLessonData(idx){
    const name = `a1-${idx}.json`;
    const p1 = `/src/data/${name}`;
    const p2 = `./src/data/${name}`;
    try { const r = await fetch(p1); if (r.ok) return r.json(); } catch {}
    const r2 = await fetch(p2); return r2.json();
  }

  function mountSlides(slides){
    const rootEl = document.getElementById('slideLessonRoot');
    if (!rootEl) return;
    let index = 0; let showTr = false;
    let root = null;
    try {
      if (ReactDOM.createRoot) root = ReactDOM.createRoot(rootEl);
    } catch {}
    function scrollToImage(){
      try {
        const img = rootEl.querySelector('img[data-slide-image="true"]');
        if (img && typeof img.scrollIntoView==='function') { img.scrollIntoView({ behavior:'smooth', block:'start' }); return; }
        if (typeof rootEl.scrollIntoView==='function') rootEl.scrollIntoView({ behavior:'smooth', block:'start' });
      } catch {}
    }
    const renderTree = ()=> e(SlideLayout, {
      slides,
      index,
      showTr,
      onPrev: ()=>{ index = Math.max(0, index-1); render(); setTimeout(scrollToImage, 0); },
      onNext: ()=>{ index = Math.min(slides.length-1, index+1); render(); try { if (window && window.scrollTo) window.scrollTo(0, 0); } catch {} }
    });
    function render(){
      if (root) root.render(renderTree());
      else ReactDOM.render(renderTree(), rootEl);
    }
    render();
  }

  window.SlideLessonMount = async function(level, idx){
    if (String(level).toUpperCase()!=='A1' || (Number(idx)!==1 && Number(idx)!==2 && Number(idx)!==3)) return;
    try {
      try { const ts = document.getElementById('tab-study'); if (ts) ts.style.display = 'block'; } catch {}
      const data = await loadLessonData(idx);
      const slides = Array.isArray(data && data.slides) ? data.slides : [];
      if (String(level).toUpperCase()==='A1' && Number(idx)===3) {
        window.__A1_3_IMAGES = slides.map((_,i)=> `/public/images/a1texto3/slidetx3/${i+1}.3.png`);
      } else {
        window.__A1_3_IMAGES = null;
      }
      mountSlides(slides);
    } catch {}
  };
})();
