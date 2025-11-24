import { Header } from './src/components/Header.js';
import { Home } from './src/pages/Home.js';
import { Level } from './src/pages/Level.js';
import { Settings } from './src/pages/Settings.js';
import { Offline } from './src/pages/Offline.js';
import { TextPage } from './src/pages/TextPage.js';
import { PhraseCard } from './src/components/PhraseCard.js';
import { Glossary } from './src/pages/Glossary.js';
import vocabularyData from './src/data/vocabularyData.js';
import { GlossaryCard } from './src/components/GlossaryCard.js';
import { Footer } from './src/components/Footer.js';

const state = {
  voiceName: localStorage.getItem('voiceName') || '',
  rate: Number(localStorage.getItem('rate') || 1),
  pitch: Number(localStorage.getItem('pitch') || 1),
  voices: [],
  theme: localStorage.getItem('theme') || 'light',
  progress: JSON.parse(localStorage.getItem('progress') || '{}')
};

function chooseBestEnglishVoice(list) {
  const arr = Array.isArray(list) ? list : [];
  const langOf = v => String(v.lang || '').toLowerCase();
  const us = arr.filter(x => langOf(x).startsWith('en-us'));
  const en = arr.filter(x => langOf(x).startsWith('en'));
  const pool = us.length ? us : (en.length ? en : arr);
  const byName = (substr) => pool.find(x => String(x.name || '').toLowerCase().includes(substr));
  const g = byName('google us english');
  if (g) return g;
  const nat = pool.find(x => /natural/i.test(String(x.name || '')));
  if (nat) return nat;
  const hi = pool.find(x => /premium|enhanced/i.test(String(x.name || '')));
  if (hi) return hi;
  return pool[0] || arr[0] || null;
}

function loadVoices() {
  const v = window.speechSynthesis.getVoices();
  if (v && v.length) {
    const us = v.filter(x => (x.lang || '').toLowerCase().startsWith('en-us'));
    const en = v.filter(x => (x.lang || '').toLowerCase().startsWith('en'));
    state.voices = us.length ? us : (en.length ? en : v);
    const best = chooseBestEnglishVoice(v);
    if (!state.voiceName && best) {
      state.voiceName = best.name;
    }
    if (!state.voices.find(vv => vv.name === state.voiceName)) {
      state.voiceName = best ? best.name : (state.voices[0] ? state.voices[0].name : '');
    }
  }

  function renderVerbsModule(data) {
    const el = document.querySelector('#verbs');
    if (!el) return;
    const listStr = String(data.verbs||'');
    const m = listStr.split(':')[1] || listStr;
    const baseVerbs = m.split(',').map(s=>s.trim()).filter(Boolean);
    const pairs = (Array.isArray(data.pairs) && data.pairs.length) ? data.pairs : [];
    const sentences = pairs.length ? pairs.map(p=>({en:p.en, pt:fixPT(p.pt)})) : splitSentences(String(data.text||'')).map((s,i)=>({en:s, pt: splitSentences(fixPT(String(data.translation||'')))[i]||''}));
    function findSentenceWith(v){ return sentences.find(s=> new RegExp(`\b${v}(s)?\b`,'i').test(s.en)) }
    function buildExample(v){
        const s = findSentenceWith(v);
        if (s) return s;
        const map = {
          feed: {en:'I feed cows and check plants.', pt:'I alimentar vacas and check plants.'},
          check: {en:'We check plants.', pt:'check plants.'},
          start: {en:'I start the tractor carefully.', pt:'I start the trator carefully.'},
          clean: {en:'I clean the barn after milking.', pt:'I clean the celeiro after milking.'},
          adjust: {en:'We adjust sprayer calibration.', pt:'pulverizador calibration.'},
          monitor: {en:'We monitor feed intake.', pt:'We monitor alimentar intake.'},
          operate: {en:'We operate the sprayer.', pt:'pulverizador.'},
          record: {en:'We record yields.', pt:'We record yields.'},
          assess: {en:'We assess yields.', pt:'yields.'},
          coordinate: {en:'We coordinate biosecurity.', pt:'biosecurity.'}
        };
        return map[v] || { en: `We ${v} the fields.`, pt: `Nós ${v} os campos.` };
    }
    function exerciseFor(v, ex){ return `<div class="card"><div>${v}: <strong>${ex.en}</strong></div><div class="small">${ex.pt}</div><div style="margin-top:8px"><button class="btn secondary" data-action="speak" data-text="${ex.en}">Ouvir Áudio</button></div><div style="margin-top:8px">Complete: ${ex.en.replace(new RegExp(`\b${v}\b`,'i'), '____')}</div></div>` }
    const blocks = baseVerbs.map(v=>{ const ex = buildExample(v); return exerciseFor(v, ex) }).join('');
    const micro = `<div class="card"><div class="line"><div class="en">We start work before sunrise, record yields and monitor feed intake.</div></div><div style="margin-top:8px"><button class="btn secondary" data-action="speak" data-text="We start work before sunrise, record yields and monitor feed intake.">Ouvir Áudio</button></div></div>`;
    const tablePS = `
      <table style="width:100%;border-collapse:collapse">
        <thead><tr><th style="text-align:left">Forma</th><th style="text-align:left">Exemplo agrícola</th></tr></thead>
        <tbody>
          <tr><td>I/You/We/They</td><td>We record yields. We monitor feed intake.</td></tr>
          <tr><td>He/She/It (+s)</td><td>Sprayer calibration prevents over application. The greenhouse helps control temperature and humidity.</td></tr>
        </tbody>
      </table>
    `;
    const errors = `
      <div class="grid">
        <div class="card"><div>Omissão de +s:</div><div class="small">prevents/keeps/helps/needs</div></div>
        <div class="card"><div>Rotina:</div><div class="small">Use present simple: feed, check, record, monitor.</div></div>
        <div class="card"><div>Ordem:</div><div class="small">We rotate pastures to improve forage quality.</div></div>
      </div>
    `;
    el.insertAdjacentHTML('beforeend', `
      <div class="section-title" style="margin-top:10px">Como usar no Present Simple</div>
      <div>${tablePS}</div>
      <div class="section-title" style="margin-top:10px">Verbos do texto</div>
      <div class="grid">${blocks}</div>
      <div class="section-title" style="margin-top:10px">Micro-história</div>
      <div>${micro}</div>
      <div class="section-title" style="margin-top:10px">Erros comuns do aluno iniciante</div>
      <div>${errors}</div>
    `);
  }
  try { render() } catch {}
}
loadVoices();
window.speechSynthesis.onvoiceschanged = loadVoices;

function applyTheme() { document.documentElement.dataset.theme = state.theme; }
applyTheme();

export function speak(text) {
  if (!text) return;
  const pick = () => {
    const v = state.voices;
    return chooseBestEnglishVoice(v);
  };
  const voice = state.voices.find(v => v.name === state.voiceName) || pick();
  const chunks = splitSentences(text);
  window.speechSynthesis.cancel();
  (function speakNext(i){
    if (i>=chunks.length) { try { setActiveSentence(-1) } catch {} ; return; }
    const u = new SpeechSynthesisUtterance(chunks[i]);
    if (voice) u.voice = voice;
    u.rate = Number(localStorage.getItem('rate')||state.rate);
    u.pitch = Number(localStorage.getItem('pitch')||state.pitch);
    try { setActiveSentence(i) } catch {}
    u.onend = () => speakNext(i+1);
    window.speechSynthesis.speak(u);
  })(0);
}

function getVoice(){
  const v = state.voices;
  const pref = v.find(x=> x.name === state.voiceName);
  return pref || v[0] || null;
}

function setActiveSentence(i){
  try {
    const nodes = document.querySelectorAll('#lines .line');
    nodes.forEach((el, idx) => el.classList.toggle('active', idx === i));
  } catch {}
}

function fixPT(s) {
  s = String(s || '');
  const map = {
    'Ã¡':'á','Ã¢':'â','Ã£':'ã','Ãª':'ê','Ã©':'é','Ãº':'ú','Ãõ':'õ','Ãµ':'õ','Ã´':'ô','Ã³':'ó','Ã²':'ò','Ã¼':'ü','Ã­':'í','Ã¹':'ù','Ã¨':'è','Ã§':'ç','Ãº':'ú','Ãº':'ú','Ã':'ú'
  };
  let out = s;
  for (const k in map) { out = out.split(k).join(map[k]); }
  return out;
}

function normalizeForSplit(str){
  const s = String(str||'');
  return s.replace(/([.!?])(?!\d)(\S)/g, '$1 $2');
}

function splitSentences(str){
  const s = normalizeForSplit(str);
  const out = [];
  let cur = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    cur += ch;
    if (ch === '.' || ch === '!' || ch === '?') {
      const prev = s[i - 1] || '';
      const next = s[i + 1] || '';
      const isDecimal = /\d/.test(prev) && /\d/.test(next);
      if (!isDecimal) {
        let j = i + 1;
        while (j < s.length && /\s/.test(s[j])) { cur += s[j]; i = j; j++; }
        out.push(cur.trim());
        cur = '';
      }
    }
  }
  if (cur.trim()) out.push(cur.trim());
  return out.filter(Boolean);
}

function splitOnConnectorsEN(sentence){
  const s = String(sentence||'').trim();
  if (!s) return [];
  const re = /\b(and|but|so|then|because|therefore|however|meanwhile|after|before|while)\b/gi;
  const matches = [];
  let m;
  while ((m = re.exec(s)) !== null) matches.push({ index: m.index, text: m[0] });
  if (!matches.length) return [s];
  const parts = [];
  let prevEnd = 0;
  for (let i = 0; i < matches.length; i++) {
    const head = s.slice(prevEnd, matches[i].index).trim();
    if (head) parts.push(/[.!?]$/.test(head) ? head : (head + '.'));
    const segEnd = (i + 1 < matches.length) ? matches[i+1].index : s.length;
    const connSeg = s.slice(matches[i].index, segEnd).trim();
    if (connSeg) parts.push(connSeg);
    prevEnd = segEnd;
  }
  if (prevEnd < s.length) {
    const tail = s.slice(prevEnd).trim();
    if (tail) parts.push(tail);
  }
  return parts.filter(Boolean);
}

function splitOnConnectorsPT(sentence){
  const s = String(sentence||'').trim();
  if (!s) return [];
  const re = /\b(e|mas|então|porque|portanto|porém|enquanto|depois|antes)\b/gi;
  const matches = [];
  let m;
  while ((m = re.exec(s)) !== null) matches.push({ index: m.index, text: m[0] });
  if (!matches.length) return [s];
  const parts = [];
  let prevEnd = 0;
  for (let i = 0; i < matches.length; i++) {
    const head = s.slice(prevEnd, matches[i].index).trim();
    if (head) parts.push(/[.!?]$/.test(head) ? head : (head + '.'));
    const segEnd = (i + 1 < matches.length) ? matches[i+1].index : s.length;
    const connSeg = s.slice(matches[i].index, segEnd).trim();
    if (connSeg) parts.push(connSeg);
    prevEnd = segEnd;
  }
  if (prevEnd < s.length) {
    const tail = s.slice(prevEnd).trim();
    if (tail) parts.push(tail);
  }
  return parts.filter(Boolean);
}

function buildAudioUrls(lvl, title){
  const base = `./src/audio/${lvl}/`;
  const t0 = String(title||'');
  const t1 = t0.replace(/[’']/g,'');
  const t2 = t0.replace(/[:]/g,'');
  const t3 = t0.replace(/[·]/g,'-').replace(/\s+-\s+/g,' - ');
  const candidates = Array.from(new Set([
    `${t0} · ${lvl}.mp3`,
    `${t1} · ${lvl}.mp3`,
    `${t2} · ${lvl}.mp3`,
    `${t0} - ${lvl}.mp3`,
    `${t1} - ${lvl}.mp3`,
    `${t2} - ${lvl}.mp3`,
    `${t3} - ${lvl}.mp3`,
    `${t0}.mp3`,
    `${t1}.mp3`,
    `${t2}.mp3`
  ]));
  return candidates.map(n => base + encodeURIComponent(n));
}

function baseVideoCandidates(lvl){
  const names = [
    'Base do Inglês.mp4', 'Base do Ingles.mp4',
    `${lvl}.mp4`, `${lvl} - Base.mp4`, `${lvl}_Base.mp4`, 'Base.mp4'
  ];
  const roots = ['./public/video/', './src/video/'];
  const folders = ['', 'Base do Inglês/', 'Base do Ingles/'];
  const urls = [];
  for (const root of roots){
    for (const folder of folders){
      for (const name of names){
        const u = root + encodeURIComponent(folder).replace(/%2F/g,'/') + encodeURIComponent(name);
        urls.push(u);
      }
    }
  }
  return Array.from(new Set(urls));
}

async function tryLoadVideo(vid, urls){
  for (const u of urls){
    const ok = await new Promise(resolve => {
      let done = false;
      function cleanup(){ vid.removeEventListener('loadedmetadata', onok); vid.removeEventListener('error', onerr); }
      function onok(){ if(done) return; done=true; cleanup(); resolve(true); }
      function onerr(){ if(done) return; done=true; cleanup(); resolve(false); }
      vid.addEventListener('loadedmetadata', onok, { once:true });
      vid.addEventListener('error', onerr, { once:true });
      vid.src = u; vid.load();
      setTimeout(()=>{ if(!done){ cleanup(); resolve(false); } }, 1500);
    });
    if (ok) return true;
  }
  return false;
}

function annotateTextManual(str){
  const out = String(str||'');
  return out.replace(/<[^>]*>/g, '');
}
function highlightAction(en){
  const txt = String(en||'').trim();
  const words = txt.split(/\s+/);
  function stripPunct(w){ const m = w.match(/[.,!?;:]+$/); return { base: w.replace(/[.,!?;:]+$/,''), trail: m?m[0]:'' }; }
  const firstTwo = words.slice(0,2).join(' ');
  let subjLen = 1;
  if (/^the$/i.test(words[0]) && words.length>=2) subjLen = 2;
  else if (/^(sprayer calibration|veterinary biosecurity|canadian winter)/i.test(firstTwo)) subjLen = 2;
  const auxIdx = words.findIndex(w=>/^(do|does|don't|doesn't|did|will|can|should|must|may|is|are|am)$/i.test(w.replace(/[.,!?;:]+$/,'')));
  if (auxIdx>=0) {
    const aux = stripPunct(words[auxIdx]);
    if (/^(don't|doesn't|didn't)$/i.test(aux.base)) {
      words[auxIdx] = `<span class="grammar-neg">${aux.base}</span>${aux.trail}`;
    } else if (/^(do|does|did|will|can|should|must|may)$/i.test(aux.base)) {
      words[auxIdx] = `<span class="grammar-aux">${aux.base}</span>${aux.trail}`;
    } else if (/^(is|are|am)$/i.test(aux.base)) {
      const cls = /^is$/i.test(aux.base) ? 'verb-third' : 'verb-base';
      words[auxIdx] = `<span class="verb ${cls}">${aux.base}</span>${aux.trail}`;
    }
    if (auxIdx+1 < words.length) {
      const v = stripPunct(words[auxIdx+1]);
      words[auxIdx+1] = `<span class="verb verb-base">${v.base}</span>${v.trail}`;
    }
  } else {
    const vi = Math.min(subjLen, words.length-1);
    const v = stripPunct(words[vi]);
    const isThird = /(ies|es|s)$/i.test(v.base);
    words[vi] = `<span class="verb ${isThird?'verb-third':'verb-base'}">${v.base}</span>${v.trail}`;
  }
  return words.join(' ');
}

function parseSVC(en){
  const txt = String(en||'').trim();
  const baseTxt = txt.replace(/[.?!]+$/,'');
  const words = baseTxt.split(/\s+/);
  const firstTwo = words.slice(0,2).join(' ');
  let subjLen = 1;
  if (/^the$/i.test(words[0]) && words.length>=2) subjLen = 2;
  else if (/^(sprayer calibration|veterinary biosecurity|canadian winter|the tractor|the soil)/i.test(firstTwo)) subjLen = 2;
  const auxIdx = words.findIndex(w=>/^(do|does|don't|doesn't|did|will|can|should|must|may|is|are|am)$/i.test(w.replace(/[.,!?;:]+$/,'')));
  let verbIdx = subjLen;
  let verb = words[verbIdx]||'';
  if (auxIdx>=0){
    const auxWord = words[auxIdx].replace(/[.,!?;:]+$/,'');
    if (/^(is|are|am)$/i.test(auxWord)) { verbIdx = auxIdx; verb = auxWord; }
    else if (auxIdx+1 < words.length) { verbIdx = auxIdx+1; verb = words[verbIdx].replace(/[.,!?;:]+$/,''); }
  } else {
    verb = (words[verbIdx]||'').replace(/[.,!?;:]+$/,'');
  }
  const subject = words.slice(0, subjLen).join(' ');
  const complement = words.slice(verbIdx+1).join(' ');
  return { subject, verb, complement };
}

function svcExplain(en){
  const p = parseSVC(en);
  const comp = p.complement ? p.complement : '-';
  return `<div class="small" style="margin-top:4px">Sujeito: <strong>${p.subject}</strong> · Verbo: <strong>${p.verb}</strong> · Complemento: <strong>${comp}</strong></div>`;
}

function sentenceType(en){
  const s = String(en||'').trim();
  if (/\?\s*$/.test(s)) return 'q';
  if (/\b(don't|doesn't|is not|are not|am not|cannot|can't|isn't|aren't|no)\b/i.test(s)) return 'neg';
  return 'aff';
}

function colorVerbToken(token){
  const t = String(token||'');
  const isThird = /(ies|es|s)$/i.test(t);
  const cls = isThird ? 'verb-third' : 'verb-base';
  return `<span class="verb ${cls}">${t}</span>`;
}

function findAux(en){
  const words = String(en||'').trim().split(/\s+/);
  const idx = words.findIndex(w=>/^(do|does|did|will|can|should|must|may|don't|doesn't|didn't|is|are|am)$/i.test(w.replace(/[.,!?;:]+$/,'')));
  if (idx<0) return null;
  const base = words[idx].replace(/[.,!?;:]+$/,'');
  let cls = 'grammar-aux';
  if (/^(don't|doesn't|didn't)$/i.test(base)) cls = 'grammar-neg';
  if (/^(is|are|am)$/i.test(base)) cls = /^is$/i.test(base)? 'verb-third' : 'verb-base';
  return { base, cls };
}

function guidedCard(en, pt){
  const p = parseSVC(en);
  const aux = findAux(en);
  const passo2 = aux
    ? `<div style="margin-top:4px">Passo 2: Auxiliar → <span class="${aux.cls}">${aux.base}</span> + Verbo → ${colorVerbToken(p.verb)}</div>`
    : `<div style="margin-top:4px">Passo 2: Verbo → ${colorVerbToken(p.verb)}</div>`;
  const steps = [`<div>Passo 1: Sujeito → <strong>${p.subject}</strong></div>`, passo2, `<div style="margin-top:4px">Passo 3: Complemento → <strong>${p.complement||'-'}</strong></div>`].join('');
  return `
    <div class="card">
      <div class="small"><strong>Exemplo guiado</strong></div>
      ${steps}
      <div style="margin-top:8px">Frase final: <span class="sent-${sentenceType(en)}">${highlightAction(en)}</span></div>
      ${svcExplain(en)}
      <div class="small" style="margin-top:4px">Tradução: ${fixPT(pt||'')}</div>
    </div>
  `;
}

function renderVerbsModule(data){
  const el = document.querySelector('#verbs');
  if (!el) return;
  const pairs = Array.isArray(data.pairs) ? data.pairs : [];
  const examples = pairs.filter(p=>/\b(prevents|keeps|rotates|drives)\b/i.test(p.en)).slice(0,4);
  if (!examples.length) return;
  const cards = examples.map(p=>`<div class="card"><div class="line"><div class="en">${highlightAction(p.en)}</div><div class="pt">${fixPT(p.pt||'')}</div></div></div>`).join('');
  el.insertAdjacentHTML('beforeend', `
    <details class="accordion">
      <summary class="section-title">Exemplos do texto (3ª pessoa)</summary>
      <div class="grid">${cards}</div>
    </details>
  `);
}

function setSetting(key, val) {
  state[key] = val;
  localStorage.setItem(key, String(val));
}

function render() {
  const app = document.getElementById('app');
  const hash = location.hash || '#/';
  let view = '';
  let pageInit = () => {};

  if (hash === '#/' || hash.startsWith('#/home')) {
    view = Home();
    pageInit = initHomePage;
  } else if (hash.startsWith('#/level/')) {
    const lvl = hash.split('/')[2] || 'A1';
    view = Level(lvl);
    pageInit = () => initLevelPage(lvl);
  } else if (hash.startsWith('#/text/')) {
    const parts = hash.split('/');
    const lvl = parts[2] || 'A1';
    const idx = Number(parts[3] || 1);
    view = TextPage(lvl, idx);
    pageInit = () => initTextPage(lvl, idx);
  } else if (hash.startsWith('#/glossary')) {
    view = Glossary();
    pageInit = initGlossaryPage;
  } else if (hash.startsWith('#/settings')) {
    view = Settings({ state, setSetting });
  } else {
    view = Offline();
  }
  app.innerHTML = Header() + view + Footer();
  pageInit();
}

function initGlossaryPage() {
  const filterContainer = document.querySelector('.filter-container');
  const grid = document.getElementById('glossary-grid');
  const searchInput = document.getElementById('glossary-search');
  const countEl = document.getElementById('glossary-count');
  const sortSelect = document.getElementById('glossary-sort-select');
  const loadMoreBtn = document.getElementById('glossary-load-more');
  let pageSize = 12;

  if (filterContainer && grid) {
    const apply = () => {
      const q = (localStorage.getItem('glossaryQuery')||'').trim().toLowerCase();
      const catBtn = filterContainer.querySelector('.filter-btn.active');
      const category = catBtn ? catBtn.dataset.category : (localStorage.getItem('glossaryCategory')||'All');
      const sort = localStorage.getItem('glossarySort')||'az';
      let data = (category === 'All' ? vocabularyData : vocabularyData.filter(item => item.category === category))
        .filter(i => {
          if (!q) return true;
          const fields = [i.term_en, i.term_pt, i.definition_en, i.definition_pt];
          return fields.some(f => String(f||'').toLowerCase().includes(q));
        });
      if (sort === 'az') data = data.slice().sort((a,b)=>String(a.term_en||'').localeCompare(String(b.term_en||'')));
      if (sort === 'za') data = data.slice().sort((a,b)=>String(b.term_en||'').localeCompare(String(a.term_en||'')));
      if (sort === 'category') data = data.slice().sort((a,b)=>String(a.category||'').localeCompare(String(b.category||'')) || String(a.term_en||'').localeCompare(String(b.term_en||'')));
      const visible = data.slice(0, pageSize);
      grid.innerHTML = visible.map(GlossaryCard).join('');
      if (countEl) countEl.textContent = `${data.length} termos`;
      const flipMap = JSON.parse(localStorage.getItem('glossaryFlip')||'{}');
      for (const k in flipMap) {
        const cardEl = grid.querySelector(`.glossary-card-container[data-id="${k}"] .glossary-card`);
        if (cardEl && flipMap[k]) cardEl.classList.add('is-flipped');
      }
      if (loadMoreBtn) loadMoreBtn.style.display = data.length > pageSize ? 'inline-flex' : 'none';
    };
    filterContainer.addEventListener('click', (e) => {
      if (e.target.matches('.filter-btn')) {
        const category = e.target.dataset.category;
        const active = filterContainer.querySelector('.filter-btn.active');
        if (active) active.classList.remove('active');
        e.target.classList.add('active');
        localStorage.setItem('glossaryCategory', category);
        pageSize = 12;
        apply();
      }
    });

    grid.addEventListener('click', (e) => {
      const speakButton = e.target.closest('.speak-btn');
      if (speakButton) {
        e.stopPropagation();
        const termToSpeak = speakButton.dataset.term;
        if (termToSpeak) {
          speak(termToSpeak);
        }
        return;
      }

      const cardContainer = e.target.closest('.glossary-card-container');
      if (cardContainer) {
        const card = cardContainer.querySelector('.glossary-card');
        card.classList.toggle('is-flipped');
        const id = cardContainer.getAttribute('data-id');
        const flipMap = JSON.parse(localStorage.getItem('glossaryFlip')||'{}');
        flipMap[id] = card.classList.contains('is-flipped');
        localStorage.setItem('glossaryFlip', JSON.stringify(flipMap));
      }
    });

    grid.addEventListener('keydown', (e) => {
      const key = e.key;
      if (key === 'Enter' || key === ' ') {
        const cardContainer = e.target.closest('.glossary-card-container');
        if (cardContainer) {
          e.preventDefault();
          const card = cardContainer.querySelector('.glossary-card');
          card.classList.toggle('is-flipped');
          const id = cardContainer.getAttribute('data-id');
          const flipMap = JSON.parse(localStorage.getItem('glossaryFlip')||'{}');
          flipMap[id] = card.classList.contains('is-flipped');
          localStorage.setItem('glossaryFlip', JSON.stringify(flipMap));
        }
      }
    });

    const initialFlip = JSON.parse(localStorage.getItem('glossaryFlip')||'{}');
    for (const k in initialFlip) {
      const cardEl = grid.querySelector(`.glossary-card-container[data-id="${k}"] .glossary-card`);
      if (cardEl && initialFlip[k]) cardEl.classList.add('is-flipped');
    }

    if (searchInput) {
      let t;
      const applySearch = () => {
        localStorage.setItem('glossaryQuery', searchInput.value);
        pageSize = 12;
        apply();
      };
      searchInput.addEventListener('input', () => { clearTimeout(t); t = setTimeout(applySearch, 150); });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        localStorage.setItem('glossarySort', sortSelect.value);
        pageSize = 12;
        apply();
      });
    }

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        pageSize += 12;
        apply();
      });
    }

    apply();
  }
}

async function initHomePage() {
  const lvls = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const preload = document.getElementById('preload');
  const cont = document.getElementById('continueCta');
  const prog = JSON.parse(localStorage.getItem('progress')||'{}');
  const last = prog.lastLevel;
  const idx = last ? (prog[last]||1) : 1;
  if (cont) cont.setAttribute('href', last ? `#/text/${last}/${idx}` : '#/text/A1/1');
  async function getLevelCount(level){
    const map = {
      A1: ['/src/data/texts/A1/a1_blocks.json','./src/data/texts/A1/a1_blocks.json'],
      A2: ['/src/data/texts/A2/a2_blocks.json','./src/data/texts/A2/a2_blocks.json'],
      B1: ['/src/data/texts/B1/b1_blocks.json','./src/data/texts/B1/b1_blocks.json'],
      B2: ['/src/data/texts/B2/b2_blocks.json','./src/data/texts/B2/b2_blocks.json'],
      C1: ['/src/data/texts/C1/c1_blocks.json','./src/data/texts/C1/c1_blocks.json'],
      C2: ['/src/data/texts/C2/c2_blocks.json','./src/data/texts/C2/c2_blocks.json']
    };
    const p = map[level];
    try {
      const r = await fetch(p[0]); if (r.ok) { const items = await r.json(); return Array.isArray(items)? items.length : 10; }
    } catch {}
    try {
      const r = await fetch(p[1]); const items = await r.json(); return Array.isArray(items)? items.length : 10;
    } catch {}
    return 10;
  }
  const lastTotal = last ? await getLevelCount(last) : 10;
  const percent = last ? Math.round(((idx-1)/lastTotal)*100) : 0;
  const badge = document.getElementById('progressBadge');
  if (badge) badge.textContent = `Progresso ${percent}%`;
  for (const l of lvls){ const b=document.getElementById(`badge-${l}`); if(b){ const n=prog[l]||0; const total = await getLevelCount(l); b.textContent = `${n}/${total}` } }

  const tipEl = document.getElementById('dailyTip');
  const tipSpeak = document.getElementById('dailyTipSpeak');
  const tips = [
    'Check equipment before operation. Verifique os equipamentos antes de operar.',
    'Schedule irrigation to save water. Programe a irrigação para economizar água.',
    'Rotate pastures for better forage. Rotacione as pastagens para melhor forrageio.'
  ];
  if (tipEl) { tipEl.textContent = tips[Math.floor(Math.random()*tips.length)] }
  if (tipSpeak && tipEl) { tipSpeak.addEventListener('click', ()=> speak(tipEl.textContent.split('.').slice(0,1).join(''))) }

  if (preload) {
    preload.addEventListener('click', async () => {
      const filesToCache = [];
      for (const l of lvls) {
        for (let i = 1; i <= 11; i++) {
          filesToCache.push(`/src/data/texts/${l}/text${i}.json`);
        }
      }
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CACHE_FILES',
          files: filesToCache,
        });
      }
      alert('Curso baixado para uso offline.');
    });
  }
}

function initLevelPage(level) {

  const textList = document.getElementById('textList');
  if (textList) {
    if (level === 'A1') {
      const p1 = '/src/data/texts/A1/a1_blocks.json';
      const p2 = './src/data/texts/A1/a1_blocks.json';
      (fetch(p1).then(r=> r.ok ? r.json() : Promise.reject()).catch(()=> fetch(p2).then(r=> r.json()))).then(items => {
        const total = Array.isArray(items) ? items.length : 10;
        const list = Array.isArray(items) ? items.slice().sort((a,b)=> Number(a && a.id || 0) - Number(b && b.id || 0)) : [];
        const links = list.map((data, i) => {
          const title = (data && data.title) ? data.title : `Texto ${i+1}`;
          const ptHint = String((data && data.title_pt) || '').trim();
          const dataAttr = ptHint ? ` data-pt="${ptHint}"` : '';
          const id = (data && data.id) ? Number(data.id) : (i+1);
          return `<a class="level-card" href="#/text/${level}/${id}"${dataAttr}><span class="title">${title}</span><span class="badge">${id}/${total}</span></a>`;
        }).join('');
        textList.innerHTML = links;
      }).catch(()=>{
        textList.innerHTML = Array.from({length:10},(_,i)=>`<a class="level-card" href="#/text/${level}/${i+1}"><span class="title">Texto ${i+1}</span></a>`).join('');
      });
    } else if (level === 'A2') {
      const p1 = '/src/data/texts/A2/a2_blocks.json';
      const p2 = './src/data/texts/A2/a2_blocks.json';
      (fetch(p1).then(r=> r.ok ? r.json() : Promise.reject()).catch(()=> fetch(p2).then(r=> r.json()))).then(items => {
        const total = Array.isArray(items) ? items.length : 10;
        const list = Array.isArray(items) ? items.slice().sort((a,b)=> Number(a && a.id || 0) - Number(b && b.id || 0)) : [];
        const links = list.map((data, i) => {
          const title = (data && data.title) ? data.title : `Texto ${i+1}`;
          const ptHint = String((data && data.title_pt) || '').trim();
          const dataAttr = ptHint ? ` data-pt="${ptHint}"` : '';
          const id = (data && data.id) ? Number(data.id) : (i+1);
          return `<a class="level-card" href="#/text/${level}/${id}"${dataAttr}><span class="title">${title}</span><span class="badge">${id}/${total}</span></a>`;
        }).join('');
        textList.innerHTML = links;
      }).catch(()=>{
        textList.innerHTML = Array.from({length:10},(_,i)=>`<a class="level-card" href="#/text/${level}/${i+1}"><span class="title">Texto ${i+1}</span></a>`).join('');
      });
    } else if (level === 'B1') {
      const p1 = '/src/data/texts/B1/b1_blocks.json';
      const p2 = './src/data/texts/B1/b1_blocks.json';
      (fetch(p1).then(r=> r.ok ? r.json() : Promise.reject()).catch(()=> fetch(p2).then(r=> r.json()))).then(items => {
        const total = Array.isArray(items) ? items.length : 10;
        const list = Array.isArray(items) ? items.slice().sort((a,b)=> Number(a && a.id || 0) - Number(b && b.id || 0)) : [];
        const links = list.map((data, i) => {
          const title = (data && data.title) ? data.title : `Texto ${i+1}`;
          const ptHint = String((data && data.title_pt) || '').trim();
          const dataAttr = ptHint ? ` data-pt="${ptHint}"` : '';
          const id = (data && data.id) ? Number(data.id) : (i+1);
          return `<a class="level-card" href="#/text/${level}/${id}"${dataAttr}><span class="title">${title}</span><span class="badge">${id}/${total}</span></a>`;
        }).join('');
        textList.innerHTML = links;
      }).catch(()=>{
        textList.innerHTML = Array.from({length:10},(_,i)=>`<a class="level-card" href="#/text/${level}/${i+1}"><span class="title">Texto ${i+1}</span></a>`).join('');
      });
    } else if (level === 'C1') {
      const p1 = '/src/data/texts/C1/c1_blocks.json';
      const p2 = './src/data/texts/C1/c1_blocks.json';
      (fetch(p1).then(r=> r.ok ? r.json() : Promise.reject()).catch(()=> fetch(p2).then(r=> r.json()))).then(items => {
        const total = Array.isArray(items) ? items.length : 10;
        const list = Array.isArray(items) ? items.slice().sort((a,b)=> Number(a && a.id || 0) - Number(b && b.id || 0)) : [];
        const links = list.map((data, i) => {
          const title = (data && data.title) ? data.title : `Texto ${i+1}`;
          const ptHint = String((data && data.title_pt) || '').trim();
          const dataAttr = ptHint ? ` data-pt="${ptHint}"` : '';
          const id = (data && data.id) ? Number(data.id) : (i+1);
          return `<a class="level-card" href="#/text/${level}/${id}"${dataAttr}><span class="title">${title}</span><span class="badge">${id}/${total}</span></a>`;
        }).join('');
        textList.innerHTML = links;
      }).catch(()=>{
        textList.innerHTML = Array.from({length:10},(_,i)=>`<a class="level-card" href="#/text/${level}/${i+1}"><span class="title">Texto ${i+1}</span></a>`).join('');
      });
    } else if (level === 'B2') {
      const p1 = '/src/data/texts/B2/b2_blocks.json';
      const p2 = './src/data/texts/B2/b2_blocks.json';
      (fetch(p1).then(r=> r.ok ? r.json() : Promise.reject()).catch(()=> fetch(p2).then(r=> r.json()))).then(items => {
        const total = Array.isArray(items) ? items.length : 10;
        const list = Array.isArray(items) ? items.slice().sort((a,b)=> Number(a && a.id || 0) - Number(b && b.id || 0)) : [];
        const links = list.map((data, i) => {
          const title = (data && data.title) ? data.title : `Texto ${i+1}`;
          const ptHint = String((data && data.title_pt) || '').trim();
          const dataAttr = ptHint ? ` data-pt="${ptHint}"` : '';
          const id = (data && data.id) ? Number(data.id) : (i+1);
          return `<a class="level-card" href="#/text/${level}/${id}"${dataAttr}><span class="title">${title}</span><span class="badge">${id}/${total}</span></a>`;
        }).join('');
        textList.innerHTML = links;
      }).catch(()=>{
        textList.innerHTML = Array.from({length:10},(_,i)=>`<a class="level-card" href="#/text/${level}/${i+1}"><span class="title">Texto ${i+1}</span></a>`).join('');
      });
    } else if (level === 'C2') {
      const p1 = '/src/data/texts/C2/c2_blocks.json';
      const p2 = './src/data/texts/C2/c2_blocks.json';
      (fetch(p1).then(r=> r.ok ? r.json() : Promise.reject()).catch(()=> fetch(p2).then(r=> r.json()))).then(items => {
        const total = Array.isArray(items) ? items.length : 10;
        const list = Array.isArray(items) ? items.slice().sort((a,b)=> Number(a && a.id || 0) - Number(b && b.id || 0)) : [];
        const links = list.map((data, i) => {
          const title = (data && data.title) ? data.title : `Texto ${i+1}`;
          const ptHint = String((data && data.title_pt) || '').trim();
          const dataAttr = ptHint ? ` data-pt="${ptHint}"` : '';
          const id = (data && data.id) ? Number(data.id) : (i+1);
          return `<a class="level-card" href="#/text/${level}/${id}"${dataAttr}><span class="title">${title}</span><span class="badge">${id}/${total}</span></a>`;
        }).join('');
        textList.innerHTML = links;
      }).catch(()=>{
        textList.innerHTML = Array.from({length:10},(_,i)=>`<a class="level-card" href="#/text/${level}/${i+1}"><span class="title">Texto ${i+1}</span></a>`).join('');
      });
    } else {
      const reqs = Array.from({ length: 10 }, (_, i) => fetch(`/src/data/texts/${level}/text${i + 1}.json`).then(r => r.json()).catch(()=>null));
      Promise.all(reqs).then(items => {
        const links = items.map((data, i) => {
          const title = (data && data.title) ? data.title : `Texto ${i+1}`;
          const ptHint = String((data && data.title_pt) || '').trim();
          const dataAttr = ptHint ? ` data-pt="${ptHint}"` : '';
          return `<a class="level-card" href="#/text/${level}/${i+1}"${dataAttr}><span class="title">${title}</span><span class="badge">${i+1}/10</span></a>`;
        }).join('');
        textList.innerHTML = links;
      }).catch(()=>{
        textList.innerHTML = Array.from({length:10},(_,i)=>`<a class="level-card" href="#/text/${level}/${i+1}"><span class="title">Texto ${i+1}</span></a>`).join('');
      });
    }
  }

  const openBtn = document.getElementById('openLevelInfo');
  const closeBtn = document.getElementById('closeLevelInfo');
  const closeBtn2 = document.getElementById('closeLevelInfo2');
  const modal = document.getElementById('levelModal');
  const infoText = document.getElementById('levelInfoText');
  const infoMap = {
    A1: 'Rotina básica de fazenda em inglês simples. Foque em presente simples, vocabulário essencial e comandos de segurança.',
    A2: 'Sequência de rotina, frequência e instruções curtas. Mais verbos e expressões comuns do dia a dia rural.',
    B1: 'Histórias de trabalho, relatos de colheita e manutenção. Uso de passado e modais para dar conselhos técnicos.',
    B2: 'Procedimentos técnicos, voz passiva e relatórios. Conteúdo mais detalhado sobre máquinas e biosegurança.',
    C1: 'Gestão avançada, análises e telemetria. Estruturas complexas de propósito/resultado e nominalização.',
    C2: 'Estilo acadêmico e conformidade internacional. Linguagem precisa para auditorias e revisão técnica.'
  };
  if (infoText) infoText.textContent = infoMap[level] || '';
  function showModal(){ if(modal){ modal.style.display='flex'; setTimeout(()=>modal.querySelector('.modal').classList.add('show'),0) } }
  function hideModal(){ if(modal){ modal.querySelector('.modal').classList.remove('show'); setTimeout(()=>{ modal.style.display='none' },150) } }
  if (openBtn) openBtn.addEventListener('click', showModal);
  if (closeBtn) closeBtn.addEventListener('click', hideModal);
  if (closeBtn2) closeBtn2.addEventListener('click', hideModal);
  if (modal) modal.addEventListener('click', (e)=>{ if(e.target===modal) hideModal() })
}

function initTextPage(level, idx) {
  const path1 = `/src/data/texts/${level}/text${idx}.json`;
  const path2 = `./src/data/texts/${level}/text${idx}.json`;
  const linesEl = document.querySelector('#lines');
  const backToTopBtn = document.querySelector('#backToTop');
  try { renderVoiceSelector(); } catch {}

async function setupAudio(data) {
  const rate = Number(localStorage.getItem('rate') || 1);
  const pitch = Number(localStorage.getItem('pitch') || 1);
  const voiceName = localStorage.getItem('voiceName') || '';
  const getVoice = () =>
    window.speechSynthesis.getVoices().find((v) => v.name === voiceName) ||
    null;

  let hasMp3 = false;
  const audio = new Audio();
  audio.preload = 'none';
  const audioStatusEl = document.getElementById('audioStatus');
  function renderAudioStatus(){ if(audioStatusEl) audioStatusEl.style.display = 'none'; }
  function narrate(txt) { if (!txt) return; speak(txt); }

  const title = String(data && (data.uiTitle || data.title) || '').trim();
  const level = (location.hash.split('/')[2] || '').trim();
  const idx = Number((location.hash.split('/')[3] || '1').trim());
  renderAudioStatus();
  (function tryLoadAudio(){
    const urls = buildAudioUrls(level, title);
    let i = 0;
    function attempt(){
      if (i >= urls.length) { hasMp3 = false; renderAudioStatus(); return; }
      audio.src = urls[i];
      audio.load();
    }
    audio.addEventListener('loadedmetadata', function onLoaded(){ hasMp3 = true; renderAudioStatus(); audio.removeEventListener('loadedmetadata', onLoaded); });
    audio.addEventListener('error', function onError(){ i++; attempt(); });
    attempt();
  })();

  const playBtn = document.getElementById('playerPlay');
  const pauseBtn = document.getElementById('playerPause');
  const stopBtn = document.getElementById('playerStop');
  const backBtn = document.getElementById('playerBack');
  const fwdBtn = document.getElementById('playerFwd');
  const prevSentBtn = document.getElementById('playerPrevSent');
  const nextSentBtn = document.getElementById('playerNextSent');
  const rateSel = document.getElementById('playerRate');
  const volRange = document.getElementById('playerVol');
  const seekRange = document.getElementById('playerSeek');
  const timeEl = document.getElementById('playerTime');
  const sentEl = document.getElementById('playerSent');

  function fmt(t){ if(!isFinite(t)||t<=0) return '00:00'; const m=Math.floor(t/60); const s=Math.floor(t%60); return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0'); }
  function setSeekEnabled(v){ if(seekRange) seekRange.disabled = !v; if(backBtn) backBtn.disabled = !v; if(fwdBtn) fwdBtn.disabled = !v; }
  setSeekEnabled(false);
  const savedRate = Number(localStorage.getItem('rate')||1);
  if (rateSel) rateSel.value = String(savedRate);

  const sentences = Array.from(linesEl.querySelectorAll('.line .en')).map(el=>el.textContent.trim()).filter(Boolean);
  let curSentIdx = 0;
  let boundaries = [];
  function updateSentLabel(){ if (sentEl) sentEl.textContent = `${Math.min(curSentIdx+1, sentences.length)}/${sentences.length||0}`; }
  updateSentLabel();
  function computeBoundaries(){ if (!hasMp3 || !isFinite(audio.duration) || audio.duration<=0) { boundaries = []; return; } const lens = sentences.map(s=>s.split(/\s+/).length||1); const total = lens.reduce((a,b)=>a+b,0)||1; let acc=0; boundaries=[0]; for(let i=0;i<lens.length;i++){ acc += lens[i]; boundaries.push((acc/total)*audio.duration); } }
  function seekToSentence(i){ curSentIdx = Math.max(0, Math.min(sentences.length-1, i)); updateSentLabel(); setActiveSentence(curSentIdx); if (hasMp3 && boundaries.length===sentences.length+1) { try { audio.currentTime = boundaries[curSentIdx]; audio.play(); } catch{} } else { try { window.speechSynthesis.cancel(); } catch{} const s = sentences[curSentIdx]||''; narrate(s); } }

  if (playBtn) playBtn.addEventListener('click', () => {
    if (hasMp3 && audio.src) { audio.play(); }
    else { const enText = Array.from(linesEl.querySelectorAll('.line .en')).map(el=>el.textContent).join(' '); narrate(enText); }
  });
  if (pauseBtn) pauseBtn.addEventListener('click', () => { if (hasMp3) { audio.pause(); } else { window.speechSynthesis.pause(); } });
  if (stopBtn) stopBtn.addEventListener('click', () => { if (hasMp3) { try { audio.pause(); audio.currentTime = 0; } catch{} } else { window.speechSynthesis.cancel(); } try { setActiveSentence(-1) } catch {} });
  if (backBtn) backBtn.addEventListener('click', () => { if (!hasMp3) return; try { audio.currentTime = Math.max(0, audio.currentTime - 10); } catch{} });
  if (fwdBtn) fwdBtn.addEventListener('click', () => { if (!hasMp3) return; try { audio.currentTime = Math.min(audio.duration||audio.currentTime+10, audio.currentTime + 10); } catch{} });
  if (prevSentBtn) prevSentBtn.addEventListener('click', () => seekToSentence(curSentIdx-1));
  if (nextSentBtn) nextSentBtn.addEventListener('click', () => seekToSentence(curSentIdx+1));
  if (rateSel) rateSel.addEventListener('change', () => { const sp = Number(rateSel.value||1); if (hasMp3) audio.playbackRate = sp; localStorage.setItem('rate', sp); });
  if (volRange) volRange.addEventListener('input', () => { if (hasMp3) { audio.volume = Number(volRange.value||1); } });
  if (seekRange) seekRange.addEventListener('input', () => { if (!hasMp3) return; const p = Number(seekRange.value||0)/100; if (isFinite(audio.duration) && audio.duration>0) audio.currentTime = p * audio.duration; });
  audio.addEventListener('loadedmetadata', () => { setSeekEnabled(true); if (timeEl) timeEl.textContent = fmt(0)+' / '+fmt(audio.duration||0); const sp = Number(rateSel && rateSel.value || savedRate || 1); audio.playbackRate = sp; computeBoundaries(); updateSentLabel(); setActiveSentence(0); });
  audio.addEventListener('timeupdate', () => { if (!hasMp3) return; const d = audio.duration||0; const c = audio.currentTime||0; if (seekRange && isFinite(d) && d>0) seekRange.value = String((c/d)*100); if (timeEl) timeEl.textContent = fmt(c)+' / '+fmt(d); if (boundaries.length===sentences.length+1) { for(let i=0;i<sentences.length;i++){ if (c>=boundaries[i] && c<boundaries[i+1]) { if (curSentIdx!==i) { curSentIdx=i; updateSentLabel(); setActiveSentence(curSentIdx); } break; } } } });
}

  function setupUI(data) {
    document.getElementById('title').textContent = data.title + ' · ' + level;
    const vEl = document.querySelector('#verbs'); if (vEl) vEl.textContent = '';

    const study = document.getElementById('tab-study');
    const practice = document.getElementById('tab-practice');
    const speech = document.getElementById('tab-speech');
    const btnStudy = document.getElementById('tabStudyBtn');
    const btnPractice = document.getElementById('tabPracticeBtn');
    const btnSpeech = document.getElementById('tabSpeechBtn');
    function showTab(tab){
      if (!study || !practice || !speech) return;
      study.style.display = tab==='study' ? 'block' : 'none';
      practice.style.display = tab==='practice' ? 'block' : 'none';
      speech.style.display = tab==='speech' ? 'block' : 'none';
      if (btnStudy && btnPractice && btnSpeech){
        btnStudy.classList.toggle('secondary', tab!=='study');
        btnPractice.classList.toggle('secondary', tab!=='practice');
        btnSpeech.classList.toggle('secondary', tab!=='speech');
        btnStudy.classList.toggle('active', tab==='study');
        btnPractice.classList.toggle('active', tab==='practice');
        btnSpeech.classList.toggle('active', tab==='speech');
      }
      try { localStorage.setItem('lastTab', tab) } catch {}
    }
    if (btnStudy) btnStudy.addEventListener('click', ()=> showTab('study'));
    if (btnPractice) btnPractice.addEventListener('click', ()=> showTab('practice'));
    if (btnSpeech) btnSpeech.addEventListener('click', ()=> showTab('speech'));
    const lastTab = localStorage.getItem('lastTab') || 'study';
    showTab(lastTab);

    document.querySelector('#toggleTr').addEventListener('click', () => {
      linesEl.classList.toggle('hide-pt');
    });
  }

  function renderVocabulary(data) {
    const vocabEl = document.querySelector('#vocab');
    const pairList = Array.isArray(data.pairs) && data.pairs.length ? data.pairs : null;
    let items;
    if (pairList) {
      items = pairList.map(p => ({ en: p.en, pt: fixPT(p.pt) }));
    } else {
      const en = splitSentences(String(data.text||''));
      const pt = splitSentences(fixPT(String(data.translation||'')));
      items = en.map((s,i)=>({ en: s, pt: pt[i]||'' }));
    }
    function expandToTen(list){
      let out = list.slice(0);
      if (out.length >= 10) return out.slice(0,10);
      // Try splitting by connectors to generate more cards from the same sentences
      for (let i=0; i<list.length && out.length<10; i++){
        const eParts = splitOnConnectorsEN(list[i].en);
        const pParts = splitOnConnectorsPT(list[i].pt);
        const n = Math.max(eParts.length, pParts.length);
        for (let k=0;k<n && out.length<10;k++){
          const enSeg = eParts[k] || list[i].en;
          const ptSeg = pParts[k] || list[i].pt;
          // skip identical original
          if (enSeg === list[i].en && ptSeg === list[i].pt) continue;
          out.push({ en: enSeg, pt: ptSeg });
        }
      }
      // If still less than 10, duplicate early items to reach exactly 10
      let j = 0;
      while (out.length < 10 && out.length && j < 20){ out.push(out[j % out.length]); j++; }
      return out.slice(0,10);
    }
    const shown = expandToTen(items);
    vocabEl.innerHTML = shown.map(it => `
      <div class="flashcard" data-en="${it.en.replace(/"/g,'&quot;')}">
        <div class="flashcard-inner">
          <div class="flashcard-face front">
            <div class="word">${annotateTextManual(it.en)}</div>
          </div>
          <div class="flashcard-face back">
            <div class="meaning">${fixPT(it.pt)}</div>
          </div>
        </div>
      </div>
    `).join('');
    vocabEl.addEventListener('click', (e) => {
      const card = e.target.closest('.flashcard');
      if (!card) return;
      e.preventDefault();
      e.stopPropagation();
      card.classList.toggle('flipped');
      const enText = card.dataset.en || '';
      try { speak(enText) } catch {}
    });
  }

  function renderGrammar(data) {
    const el = document.querySelector('#grammar');
    if (!el) return;
    const pairs = (Array.isArray(data.pairs) && data.pairs.length) ? data.pairs : [];
    const sentences = pairs.length ? pairs.map(p=>({en:p.en, pt:fixPT(p.pt)})) : String(data.text||'').split(/(?<=[.!?])\s+/).map((s,i)=>({en:s, pt:String(data.translation||'').split(/(?<=[.!?])\s+/).map(fixPT)[i]||''}));
    const gRaw = String(data.grammar||'');
    const gHead = (String(level).toUpperCase()==='A1' ? 'Present simple with farm routines.' : gRaw);
    function explainForBeginners(v){
      return `
        <div class="card">
          <div class="small">
            <div><strong>Explicação:</strong> ${v}</div>
            <div style="margin-top:6px"><strong>O que é:</strong> verbo é ação do dia a dia. Use forma base com <em>I/You/We/They</em>. Em <em>He/She/It</em> acrescente <span class="grammar-suffix">s/es</span>.</div>
            <div style="margin-top:6px"><strong>Verbo to be:</strong> <em>am/is/are</em> para estado, localização e identificação. Afirmativa: <em>I am</em>, <em>He/She/It is</em>, <em>We/You/They are</em>. Negativa: <em>am not</em>/<em>is not</em>/<em>are not</em>. Pergunta: <em>Am I...?</em> · <em>Is he...?</em> · <em>Are they...?</em></div>
          </div>
        </div>
      `;
    }
    const groupI = sentences.filter(s=>/^\s*i\b/i.test(s.en)).slice(0,4);
    const groupWe = sentences.filter(s=>/^\s*we\b/i.test(s.en)).slice(0,4);
    const groupIt = sentences.filter(s=>/^\s*(it|the\s)/i.test(s.en)).slice(0,4);
    function tableRow(subj, arr){ return arr.map(s=>`<tr><td>${subj}</td><td class="sent-${sentenceType(s.en)}">${highlightAction(s.en)}${svcExplain(s.en)}</td><td>${fixPT(s.pt||'')}</td></tr>`).join('') }
    const conjTable = `
      <table style="width:100%;border-collapse:collapse">
        <thead><tr><th style="text-align:left">Sujeito</th><th style="text-align:left">Frase (EN)</th><th style="text-align:left">Tradução (PT)</th></tr></thead>
        <tbody>
          ${tableRow('I', groupI)}
          ${tableRow('We', groupWe)}
          ${tableRow('It/The', groupIt)}
        </tbody>
      </table>
    `;
    const practice = [...groupI.slice(0,1), ...groupWe.slice(0,2), ...groupIt.slice(0,2)];
    function buildPresentSimpleForms(en){
      const clean = String(en||'').trim().replace(/[.?!]+$/, '');
      const words = clean.split(/\s+/);
      const firstTwo = words.slice(0,2).join(' ');
      let subject;
      if (/^the\b/i.test(clean) && words.length>=2) subject = words[0]+' '+words[1];
      else if (/^(sprayer calibration|veterinary biosecurity|canadian winter)/i.test(firstTwo)) subject = firstTwo;
      else subject = words[0];
      const subjEsc = subject.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      let rest = clean.replace(new RegExp('^'+subjEsc+'\\s+'),'');
      let v = (rest.split(/\s+/)[0]||'').toLowerCase();
      const isThird = /^(he|she|it)$/i.test(subject) || /^the\s/i.test(subject) || /^(sprayer calibration|veterinary biosecurity|canadian winter)/i.test(subject);
      if (v==='is'){
        const tail = rest.replace(/^is\s+/i,'');
        return { affirmative: clean, negative: subject+' is not '+tail, interrogative: 'Is '+subject+' '+tail+'?' };
      }
      function baseVerb(w){
        if (/^goes$/i.test(w)) return 'go';
        if (/ies$/i.test(w)) return w.replace(/ies$/i,'y');
        if (/(ch|sh|x|o|ss|zz)$/i.test(w.replace(/es$/i,'')) && /es$/i.test(w)) return w.replace(/es$/i,'');
        if (/s$/i.test(w)) return w.replace(/s$/i,'');
        return w;
      }
      const base = baseVerb(v);
      const restWords = rest.split(/\s+/);
      if (restWords.length) restWords[0] = base;
      const negAux = isThird ? "doesn't" : "don't";
      const qAux = isThird ? 'Does' : 'Do';
      return {
        affirmative: clean,
        negative: (subject+' '+negAux+' '+base+' '+restWords.slice(1).join(' ')).trim(),
        interrogative: (qAux+' '+subject+' '+restWords.join(' ')+'?').trim()
      };
    }
    const neg = (s)=>({ en: buildPresentSimpleForms(s.en).negative, pt: s.pt });
    const ques = (s)=>({ en: buildPresentSimpleForms(s.en).interrogative, pt: s.pt });
    const aff = practice;
    const negs = aff.map(neg);
    const quess = aff.map(ques);
    function table3(a,b,c){ return `
      <table style="width:100%;border-collapse:collapse">
        <thead><tr><th style="text-align:left">Afirmativa</th><th style="text-align:left">Negativa</th><th style="text-align:left">Pergunta</th></tr></thead>
        <tbody>
          ${a.map((x,i)=>`<tr><td class="sent-aff">${highlightAction(x.en)}${svcExplain(x.en)}</td><td class="sent-neg">${highlightAction(b[i].en)}${svcExplain(b[i].en)}</td><td class="sent-q">${highlightAction(c[i].en)}${svcExplain(c[i].en)}</td></tr>`).join('')}
        </tbody>
      </table>
    ` }
    function thirdSubject(en){
      const clean = String(en||'').trim();
      const w = clean.split(/\s+/);
      const subj = w.slice(0,2).join(' ');
      if (/^(he|she|it)\b/i.test(w[0])) return true;
      if (/^(the|a|an)\b/i.test(w[0])) return true;
      if (/^(rain|water|cow|engine|barn|vet|pig|chicken)\b/i.test(w[0])) return true;
      return false;
    }
    const sThird = sentences.filter(s=> thirdSubject(s.en)).slice(0,5);
    let sTable = `
      <table class="rule-table">
        <thead><tr><th style="text-align:left">Forma</th><th style="text-align:left">Exemplo</th></tr></thead>
        <tbody>
          ${sThird.map(s=>`<tr><td>He/She/It: +s</td><td class="sent-${sentenceType(s.en)}">${highlightAction(s.en)}</td></tr>`).join('')}
          ${groupWe.slice(0,3).map(s=>`<tr><td>I/You/We/They: base</td><td class="sent-${sentenceType(s.en)}">${highlightAction(s.en)}</td></tr>`).join('')}
        </tbody>
      </table>
    `;
    if (data.he_she_it_rule && data.he_she_it_rule.example) {
      sTable = `
        <table class="rule-table">
          <thead><tr><th style="text-align:left">Forma</th><th style="text-align:left">Exemplo</th></tr></thead>
          <tbody>
            <tr><td>He/She/It: +s</td><td class="sent-${sentenceType(data.he_she_it_rule.example)}">${highlightAction(data.he_she_it_rule.example)}</td></tr>
            ${groupWe.slice(0,1).map(s=>`<tr><td>I/You/We/They: base</td><td class="sent-${sentenceType(s.en)}">${highlightAction(s.en)}</td></tr>`).join('')}
          </tbody>
        </table>
      `;
    }

    function renderFormsFromChapter() {
      const gf = data.grammar_forms || {};
      const rows = [
        { label: 'Afirmativa', v: gf.affirmative },
        { label: 'Negativa', v: gf.negative },
        { label: 'Pergunta', v: gf.interrogative }
      ].filter(x => x.v && String(x.v).trim());
      if (!rows.length) return '';
      return `
        <div class="section-title" style="margin-top:12px">Formas do Present Simple (capítulo)</div>
        <table class="forms-table">
          <thead><tr><th style="text-align:left">Forma</th><th style="text-align:left">Exemplo</th></tr></thead>
          <tbody>
            ${rows.map(r=>{ const ex = String(r.v); const cls = r.label.startsWith('Af')?'sent-aff':(r.label.startsWith('Ne')?'sent-neg':'sent-q'); return `<tr><td>${r.label}</td><td class="${cls}">${highlightAction(ex)}${svcExplain(ex)}</td></tr>` }).join('')}
          </tbody>
        </table>
        <div class="card" style="margin-top:8px"><div class="small">
          <div><strong>Afirmativa:</strong> Sujeito + verbo base (+<span class="grammar-suffix">s</span> para He/She/It) + complemento.</div>
          <div style="margin-top:6px"><strong>Negativa:</strong> Sujeito + <span class="grammar-neg">don't/doesn't</span> + verbo base + complemento. Use <span class="grammar-neg">doesn't</span> com He/She/It.</div>
          <div style="margin-top:6px"><strong>Pergunta:</strong> <span class="grammar-q">Do/Does</span> + sujeito + verbo base + complemento? Respostas curtas: <strong>Yes, I <span class="grammar-aux">do</span></strong> · <strong>No, he <span class="grammar-neg">doesn't</span></strong>.</div>
        </div></div>
      `;
    }
    const explainList = aff.map(s=>`<div class="card"><div class="line"><div class="en sent-${sentenceType(s.en)}">${annotateTextManual(s.en)}</div><div class="pt">${fixPT(s.pt||'')}</div></div><div class="small" style="margin-top:6px">Presente simples: rotina agrícola.</div><div style="margin-top:8px"><button class="btn secondary" data-action="speak" data-text="${s.en}">Ouvir Áudio</button></div></div>`).join('');
    const groupBe = (()=>{
      const seen=new Set();
      const base = sentences.filter(s=>/\b(is|are)\b/i.test(s.en)).filter(s=>{ if(seen.has(s.en)) return false; seen.add(s.en); return true }).slice(0,3);
      return base;
    })();
    const baseSample = groupI[0] || groupWe[0] || sentences[0] || { en: 'I work on the farm.', pt: 'Eu trabalho na fazenda.' };
    const formsSample = buildPresentSimpleForms(baseSample.en);
    function lineHtml(s){ return `<div class="line"><div class="en sent-${sentenceType(s.en)}">${highlightAction(s.en)}</div><div class="pt">${fixPT(s.pt||'')}</div></div>` }
    const routineLines = (()=>{ const base = [...groupI.slice(0,2), ...groupWe.slice(0,1)]; return base.slice(0,3); })();
    const thirdLines = (()=>{ return sentences.filter(s=> thirdSubject(s.en)).slice(0,3); })();
    function ptNeg(s){ let out = fixPT(String(s||'')).trim().replace(/[.?!]+$/,''); if(/^Eu\s/i.test(out)) return out.replace(/^Eu\s/i,'Eu não '); if(/^Nós\s/i.test(out)) return out.replace(/^Nós\s/i,'Nós não '); if(/^Ele\s/i.test(out)) return out.replace(/^Ele\s/i,'Ele não '); if(/^Ela\s/i.test(out)) return out.replace(/^Ela\s/i,'Ela não '); return 'Não '+out.toLowerCase(); }
    function ptQ(s){ let out = fixPT(String(s||'')).trim().replace(/[.]+$/,''); return out+'?'; }
    const negLine = { en: formsSample.negative, pt: ptNeg(baseSample.pt) };
    const qLine = { en: formsSample.interrogative, pt: ptQ(baseSample.pt) };
    function negForThird(s){ const f = buildPresentSimpleForms(s.en); return { en: annotateTextManual(f.negative), pt: ptNeg(s.pt) }; }
    function qForThird(s){ const f = buildPresentSimpleForms(s.en); return { en: annotateTextManual(f.interrogative), pt: ptQ(s.pt) }; }
    function beNegSample(){ if(!groupBe.length) return null; const b = groupBe[0]; const en = String(b.en).replace(/\bis\s+/i,'is not '); let pt = fixPT(b.pt); pt = pt.replace(/\bé\b/,'não é').replace(/\bestá\b/,'não está'); if(!/não\s/.test(pt)) pt = 'Não '+pt.toLowerCase(); return { en: annotateTextManual(en), pt }; }
    const negThird = thirdLines[0] ? negForThird(thirdLines[0]) : null;
    const qThird = thirdLines[0] ? qForThird(thirdLines[0]) : null;
    const beNeg = beNegSample();
    function beNegLine(en){ return String(en).replace(/\bis\b/i,'is not').replace(/\bare\b/i,'are not').replace(/\bam\b/i,'am not'); }
    function beQuestionLine(en){
      let t = String(en||'').trim().replace(/[.]+$/,'');
      if (/\bam\b/i.test(t) && /^\s*i\b/i.test(t)) t = t.replace(/^\s*i\s+am\s+/i,'Am I ');
      else if (/\bis\b/i.test(t)) t = t.replace(/^\s*(.+?)\s+is\s+/i,'Is $1 ');
      else if (/\bare\b/i.test(t)) t = t.replace(/^\s*(.+?)\s+are\s+/i,'Are $1 ');
      if (!/\?\s*$/.test(t)) t = t + '?';
      return t;
    }
    const beAffRows = groupBe.map(s=>({ en: annotateTextManual(s.en), pt: fixPT(s.pt||'') }));
    const beNegRows = groupBe.map(s=>({ en: annotateTextManual(beNegLine(s.en)), pt: ptNeg(s.pt||'') }));
    const beQRows = groupBe.map(s=>({ en: annotateTextManual(beQuestionLine(s.en)), pt: ptQ(s.pt||'') }));
    function beTable(a,b,c){ return `
      <table style="width:100%;border-collapse:collapse">
        <thead><tr><th style="text-align:left">Afirmativa</th><th style="text-align:left">Negativa</th><th style="text-align:left">Pergunta</th></tr></thead>
        <tbody>
          ${a.map((x,i)=>`<tr><td class="sent-aff">${x.en}${svcExplain(x.en)}</td><td class="sent-neg">${b[i].en}${svcExplain(b[i].en)}</td><td class="sent-q">${c[i].en}${svcExplain(c[i].en)}</td></tr>`).join('')}
        </tbody>
      </table>
    ` }
    const affCard = aff.length ? `<div class="card"><div class="small"><strong>Afirmativa</strong></div>${aff.slice(0,3).map(lineHtml).join('')}</div>` : '';
    const negCard = negs.length ? `<div class="card"><div class="small"><strong>Negativa</strong></div>${negs.slice(0,3).map(lineHtml).join('')}</div>` : '';
    const qCard = quess.length ? `<div class="card"><div class="small"><strong>Pergunta</strong></div>${quess.slice(0,3).map(lineHtml).join('')}</div>` : '';
    const whenCards = [affCard, negCard, qCard].filter(Boolean);
    const whenList = whenCards.join('');
    const guidedSamples = [baseSample, qLine, negLine].filter(Boolean);
    const guidedList = guidedSamples.map(s=> guidedCard(s.en, s.pt)).join('');
    const beSection = groupBe.length ? (`
      <div class="section-title" style="margin-top:12px">Verb to be (A1)</div>
      ${beTable(beAffRows, beNegRows, beQRows)}
    `) : '';
    el.innerHTML = `
      <div>${explainForBeginners(gHead)}</div>
      <div class="section-title" style="margin-top:12px">Quando usar</div>
      <div class="grid when-grid">${whenList}</div>
      <div class="section-title" style="margin-top:12px">Estrutura (Tradução)</div>
      <div>${conjTable}</div>
      <div class="card" style="margin-top:8px"><div class="small">
        <div><strong>Como identificar:</strong> Em EN, sujeito (quem faz) + verbo (ação) + complemento (detalhe). Em PT, a ordem costuma ser igual.</div>
        <div style="margin-top:6px">Ex.: <strong>We</strong> (sujeito) <strong>check</strong> (verbo) <strong>the water</strong> (complemento) ↔ <strong>Nós</strong> <strong>verificamos</strong> <strong>a água</strong>.</div>
        <div style="margin-top:6px"><strong>Dica de tradução:</strong> pense primeiro no sujeito, depois diga a ação, por fim o complemento. Para He/She/It em afirmativa, lembre do <span class="grammar-suffix">+s</span>.</div>
      </div></div>
      <div class="section-title" style="margin-top:12px">Passo a passo guiado</div>
      <div class="grid when-grid">${guidedList}</div>
      <div class="section-title" style="margin-top:12px">Afirmativa/Negativa/Pergunta</div>
      <div>${table3(aff,negs,quess)}</div>
      ${renderFormsFromChapter()}
      <div class="section-title" style="margin-top:12px">Regra He/She/It (+s)</div>
      <div>${sTable}</div>
      ${beSection}
      <div class="section-title" style="margin-top:12px">Forma (Uso)</div>
      <div class="card" style="margin-top:8px"><div class="small">${sentences.slice(0,3).map(s=>lineHtml(s)).join('')}</div></div>
    `;

    

    const speechEx = document.getElementById('speechExamples');
    if (speechEx) speechEx.innerHTML = explainList;
    let gEx = document.getElementById('gExercises');
    if (gEx) {
      gEx.innerHTML = '';
      const fresh = gEx.cloneNode(false);
      fresh.id = 'gExercises';
      gEx.parentNode.replaceChild(fresh, gEx);
      gEx = document.getElementById('gExercises');
    }
    function renderClassify(){ const items = aff.map((a,i)=>({a:a.en,n:negs[i].en,q:quess[i].en})).slice(0,6).flatMap(x=>[ {txt:x.a, type:'Afirmativa'}, {txt:x.n, type:'Negativa'}, {txt:x.q, type:'Pergunta'} ]).sort(()=>Math.random()-0.5); gEx.innerHTML += `<div class="section-title" style="margin-top:10px">Classifique</div>`; const html = items.map((it,i)=>`<div class="card"><div>${i+1}. ${it.txt}</div><div style="margin-top:6px"><button class="btn secondary" data-clf="${i}" data-type="Afirmativa">Afirmativa</button> <button class="btn secondary" data-clf="${i}" data-type="Negativa">Negativa</button> <button class="btn secondary" data-clf="${i}" data-type="Pergunta">Pergunta</button></div><div class="small" id="clf${i}" style="margin-top:6px"></div></div>`).join(''); gEx.innerHTML += `<div>${html}</div>`; gEx.addEventListener('click',(e)=>{ const t=e.target; if(!t.dataset.clf) return; const i=Number(t.dataset.clf); const res = document.getElementById('clf'+i); const chosen = t.dataset.type; const correct = items[i].type; res.textContent = chosen===correct ? 'Acertou!' : 'Tente novamente.' }) }
    function renderTransform(){ const items = aff.slice(0,6); gEx.innerHTML += `<div class="section-title" style="margin-top:10px">Transforme</div>`; const html = items.map((s,i)=>`<div class="card"><div>${i+1}. ${s.en}</div><div style="margin-top:6px"><button class="btn secondary" data-showneg="${i}">Ver negativa</button> <button class="btn secondary" data-showq="${i}">Ver pergunta</button></div><div class="small" id="tr${i}" style="margin-top:6px"></div></div>`).join(''); gEx.innerHTML += `<div>${html}</div>`; gEx.addEventListener('click',(e)=>{ const t=e.target; if(t.dataset.showneg){ const i=Number(t.dataset.showneg); document.getElementById('tr'+i).textContent = negs[i].en; } if(t.dataset.showq){ const i=Number(t.dataset.showq); document.getElementById('tr'+i).textContent = quess[i].en; } }) }
    function renderOrdering(){ const parts = String(data.text||'').split(/(?<=[.!?])\s+/).filter(Boolean).slice(0,6); if(!parts.length) return; const shuffled = [...parts].sort(()=>Math.random()-0.5); gEx.innerHTML += `<div class="section-title" style="margin-top:10px">Ordene as frases</div>`; const html = shuffled.map((s,i)=>`<div class="card"><div>${i+1}. <span id="ord${i}">${s}</span></div><div style="margin-top:6px"><button class="btn secondary" data-moveup="${i}">Subir</button> <button class="btn secondary" data-movedown="${i}">Descer</button></div></div>`).join(''); gEx.innerHTML += `<div>${html}</div><div class="small" id="ordRes" style="margin-top:6px"></div>`; const list = shuffled.map((s,i)=>({idx:i, txt:s})); gEx.addEventListener('click',(e)=>{ const t=e.target; if(t.dataset.moveup||t.dataset.movedown){ const i = Number(t.dataset.moveup||t.dataset.movedown); const j = t.dataset.moveup ? i-1 : i+1; if (j<0 || j>=list.length) return; const tmp = list[i]; list[i]=list[j]; list[j]=tmp; list.forEach((x,k)=>{ const el=document.getElementById('ord'+k); if(el) el.textContent = x.txt; }); const ok = list.map(x=>x.txt).join(' ')===(parts.join(' ')); document.getElementById('ordRes').textContent = ok ? 'Acertou!' : '' } }) }
    function renderDictation(){ const parts = String(data.text||'').split(/(?<=[.!?])\s+/).filter(Boolean).slice(0,3); if(!parts.length) return; gEx.innerHTML += `<div class="section-title" style="margin-top:10px">Ditado</div>`; const html = parts.map((s,i)=>`<div class="card"><div>${i+1}. <button class="btn secondary" data-dict="${i}">Ouvir</button></div><div style="margin-top:6px"><input class="blank" data-di="${i}" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px;width:100%" /></div><div class="small" id="diRes${i}" style="margin-top:6px"></div></div>`).join(''); gEx.innerHTML += `<div>${html}</div>`; function speakText(t){ try{ speak(t) }catch{} } function lev(a,b){ const m=Array.from({length:a.length+1},(_,i)=>Array(b.length+1).fill(0)); for(let i=0;i<=a.length;i++) m[i][0]=i; for(let j=0;j<=b.length;j++) m[0][j]=j; for(let i=1;i<=a.length;i++){ for(let j=1;j<=b.length;j++){ const cost=a[i-1]===b[j-1]?0:1; m[i][j]=Math.min(m[i-1][j]+1,m[i][j-1]+1,m[i-1][j-1]+cost) } } return m[a.length][b.length] } gEx.addEventListener('click',(e)=>{ const t=e.target; if(!t.dataset.dict) return; const i=Number(t.dataset.dict); speakText(parts[i]); }); gEx.addEventListener('input',(e)=>{ const inp=e.target; if(!inp.dataset.di) return; const i=Number(inp.dataset.di); const said=(inp.value||'').trim().toLowerCase(); const exp=String(parts[i]||'').toLowerCase(); const distance=lev(said,exp); const threshold=Math.max(2,Math.round(exp.length*0.2)); const ok=distance<=threshold; const res=document.getElementById('diRes'+i); if(res) { res.textContent = ok ? 'Acertou!' : 'Tente novamente.'; res.style.color = ok ? 'green' : 'red'; } }); }
    function renderMatchVocab(){
      const voc = Array.isArray(data.vocabulary) ? data.vocabulary : [];
      if (!voc.length) return;
      const items = voc.slice(0, Math.min(8, voc.length)).map(v=>({ en: v.word || (v.en||''), pt: v.meaning || (v.translation||'') })).filter(x=>x.en && x.pt);
      if (!items.length) return;
      const left = items.map((it,i)=>`<button class="btn secondary" data-mv-l="${i}">${it.en}</button>`).join(' ');
      const right = items.map((it,i)=>`<button class="btn secondary" data-mv-r="${i}">${it.pt}</button>`).sort(()=>Math.random()-0.5).join(' ');
      gEx.innerHTML += `<div class="section-title" style="margin-top:10px">Associe vocabulário</div><div class="card"><div><div>${left}</div><div style="margin-top:8px">${right}</div><div class="small" id="mvRes" style="margin-top:6px"></div></div></div>`;
      let selL = null; let selR = null; let okPairs = 0; const total = items.length;
      gEx.addEventListener('click', (e)=>{
        const t = e.target; const l = t.dataset.mvL; const r = t.dataset.mvR; const res = document.getElementById('mvRes');
        if (l !== undefined){ selL = Number(l); t.classList.add('active'); }
        if (r !== undefined){ selR = Number(r); t.classList.add('active'); }
        if (selL !== null && selR !== null){
          if (selL === selR){ okPairs++; res.textContent = `Acertou (${okPairs}/${total}).`; res.style.color = 'green'; }
          else { res.textContent = 'Tente novamente.'; res.style.color = 'red'; }
          selL = null; selR = null;
        }
      });
    }
    function renderTrueFalse(){
      const sentences = String(data.text||'').split(/(?<=[.!?])\s+/).filter(Boolean);
      if (!sentences.length) return;
      const altWords = ['tractor','water','cow','milk','field','greenhouse','fence','storm'];
      function makeFalse(s){
        const w = s.split(/\s+/);
        for (let i=0;i<w.length;i++){
          const k = w[i].toLowerCase().replace(/[^a-z]/gi,'');
          if (altWords.includes(k)) { const pick = altWords[(altWords.indexOf(k)+3)%altWords.length]; w[i] = pick[0].toUpperCase()+pick.slice(1)+ (/[.,!?]$/.test(w[i])?w[i].match(/[.,!?]$/)[0]:''); break; }
        }
        return w.join(' ');
      }
      const items = sentences.slice(0,6).map((s,i)=>({ txt: s, truth: i%2===0 ? true : false, shown: i%2===0 ? s : makeFalse(s) }));
      gEx.innerHTML += `<div class="section-title" style="margin-top:10px">Compreensão: Verdadeiro ou Falso</div>` + items.map((it,i)=>`<div class="card"><div>${i+1}. ${it.shown}</div><div style="margin-top:6px"><button class="btn secondary" data-tf="${i}" data-ans="true">Verdadeiro</button> <button class="btn secondary" data-tf="${i}" data-ans="false">Falso</button></div><div class="small" id="tfRes${i}" style="margin-top:6px"></div></div>`).join('');
      gEx.addEventListener('click',(e)=>{ const t=e.target; if(!t.dataset.tf) return; const i=Number(t.dataset.tf); const ans=(t.dataset.ans==='true'); const ok = ans === items[i].truth; const res=document.getElementById('tfRes'+i); if(res){ res.textContent = ok ? 'Acertou!' : 'Tente novamente.'; res.style.color = ok ? 'green' : 'red'; } });
    }
    function renderTextGame(){
      const pairs = Array.isArray(data.pairs) ? data.pairs.slice(0,20) : [];
      const vocab = Array.isArray(data.vocabulary) ? data.vocabulary.slice(0,20) : [];
      const textParts = String(data.text||'').split(/(?<=[.!?])\s+/).filter(Boolean);
      const levelTag = (location.hash.split('/')[2]||'').toUpperCase();
      const titleTag = String(data.title||'').trim();
      let qSrc = [];
      if (pairs.length) {
        const translations = pairs.map(p=>fixPT(p.pt)).filter(Boolean);
        qSrc = pairs.map(p=>{
          const correct = fixPT(p.pt);
          const opts = [correct];
          const distractors = translations.filter(t=> t!==correct);
          while (opts.length<4 && distractors.length){
            const pick = distractors.splice(Math.floor(Math.random()*distractors.length),1)[0];
            if (pick && !opts.includes(pick)) opts.push(pick);
          }
          const shuffled = opts.sort(()=>Math.random()-0.5);
          return { type:'tr', prompt:p.en, options:shuffled, answer:shuffled.indexOf(correct) };
        });
      } else if (vocab.length) {
        const meanings = vocab.map(v=>v.meaning || v.translation || '').filter(Boolean);
        qSrc = vocab.map(v=>{
          const correct = v.meaning || v.translation || '';
          const opts = [correct];
          const distractors = meanings.filter(t=> t!==correct);
          while (opts.length<4 && distractors.length){
            const pick = distractors.splice(Math.floor(Math.random()*distractors.length),1)[0];
            if (pick && !opts.includes(pick)) opts.push(pick);
          }
          const shuffled = opts.sort(()=>Math.random()-0.5);
          return { type:'voc', prompt:(v.word || v.en || v.term || ''), options:shuffled, answer:shuffled.indexOf(correct) };
        });
      } else {
        const parts = textParts.slice(0,10);
        qSrc = parts.map(s=>{
          const correct = s;
          const opts = [correct, 'I drive the tractor.', 'We check the water.', 'He feeds the cows.'].sort(()=>Math.random()-0.5);
          return { type:'sent', prompt:'Qual frase apareceu no texto?', options:opts, answer:opts.indexOf(correct) };
        });
      }
      const auxItems = (()=>{
        const items = [];
        const pick = (textParts.length ? textParts : (pairs.map(p=>p.en)) ).slice(0,6);
        pick.forEach(s=>{
          const clean = String(s||'').trim();
          const words = clean.split(/\s+/);
          const subj = words[0]||'It';
          const isBe = /^(is|are|am)$/i.test(words[1]||'');
          if (isBe) return;
          const needDoes = /^(he|she|it|the|a|an)$/i.test(subj);
          const rest = clean.replace(/^\w+\s+/,'').replace(/[.?!]+$/,'');
          const prompt = `Complete com do/does: [____] ${rest}?`;
          const options = ['do','does'];
          const answer = needDoes ? 1 : 0;
          items.push({ type:'aux', prompt, options, answer });
        });
        return items.slice(0,5);
      })();
      const tfItems = (()=>{
        const items = [];
        const parts = textParts.slice(0,8);
        const altWords = ['tractor','water','cow','milk','field','greenhouse','fence','storm','engine','seat','wheel'];
        function makeFalse(s){ const w=s.split(/\s+/); for(let i=0;i<w.length;i++){ const k=w[i].toLowerCase().replace(/[^a-z]/gi,''); if(altWords.includes(k)){ const pick=altWords[(altWords.indexOf(k)+3)%altWords.length]; w[i]=pick[0].toUpperCase()+pick.slice(1)+( /[.,!?]$/.test(w[i])?w[i].match(/[.,!?]$/)[0]:'' ); break; } } return w.join(' '); }
        parts.forEach((s,i)=>{ const truth = i%2===0; const shown = truth ? s : makeFalse(s); items.push({ type:'tf', prompt: shown, options:['Verdadeiro','Falso'], answer: truth?0:1 }); });
        return items;
      })();

      const ordItems = (()=>{
        const items = [];
        const parts = textParts.slice(0,4);
        parts.forEach(s=>{
          const clean = String(s||'').trim().replace(/[.?!]+$/,'');
          const words = clean.split(/\s+/);
          if (words.length < 4) return;
          const shuffled = [...words].sort(()=>Math.random()-0.5);
          items.push({ type:'ord', prompt:'Ordene as palavras para formar a frase:', options: shuffled, answer: words });
        });
        return items;
      })();

      const negItems = (()=>{
        const items = [];
        const parts = textParts.slice(0,6);
        parts.forEach(s=>{
          const clean = String(s||'').trim();
          const words = clean.split(/\s+/);
          if (words.length < 2) return;
          const subj = words[0];
          const needDoesnt = /^(he|she|it|the|a|an)$/i.test(subj);
          const rest = clean.replace(/^[^\s]+\s+/,'').replace(/[.?!]+$/,'');
          items.push({ type:'neg', prompt:`Complete com don't/doesn't: [____] ${rest}.`, options:["don't","doesn't"], answer: needDoesnt?1:0 });
        });
        return items;
      })();

      const seqItems = (()=>{
        const items = [];
        const parts = textParts.slice(0,6).filter(Boolean);
        if (parts.length >= 3){
          for (let i=0;i<parts.length-2;i+=3){
            const group = parts.slice(i,i+3);
            if (group.length<3) break;
            const cleaned = group.map(s=> String(s||'').trim().replace(/[.?!]+$/,''));
            const shuffled = [...cleaned].sort(()=>Math.random()-0.5);
            items.push({ type:'seq', prompt:'Ordene as sentenças (sequência lógica):', options: shuffled, answer: cleaned });
          }
        }
        return items;
      })();

      function shuffle(arr){ return arr.sort(()=>Math.random()-0.5); }
      qSrc = shuffle([...auxItems, ...negItems, ...tfItems, ...ordItems, ...seqItems, ...qSrc]).slice(0,25);
      if (!qSrc.length) return;

      let score = 0; let streak = 1; let lives = 3; let timeLeft = 60; let qi = 0; let timer = null; let playing = false; let hintsLeft = 2; let best = 0;
      try { best = Number(localStorage.getItem('textSprintHiScore:'+levelTag)||0) } catch {}
      const hud = `<div id="gameHUD" class="small" style="display:flex;align-items:center;gap:12px;justify-content:space-between;flex-wrap:wrap"><div style="font-weight:600">${titleTag} · ${levelTag}</div><div>Pontuação <span id="gScore">0</span></div><div>Série x<span id="gStreak">1</span></div><div style="flex:1;min-width:160px"><div style="height:8px;background:#e6f1ec;border-radius:6px;overflow:hidden"><div id="gProg" style="width:0%;height:8px;background:linear-gradient(90deg,#0b3a1e,#36a269);transition:width .3s"></div></div></div><div>Tempo <span id="gTime">60</span>s</div><div>Vidas <span id="gLives">♥♥♥</span></div><div>Melhor <span id="gBest">${best}</span></div></div>`;

      let gameEl = document.getElementById('gameTop') || gEx;
      if (gameEl) {
        const fresh = gameEl.cloneNode(false);
        fresh.id = gameEl.id;
        gameEl.parentNode.replaceChild(fresh, gameEl);
        gameEl = document.getElementById(fresh.id);
      }
      gameEl.innerHTML = `<div class="card" style="background:linear-gradient(180deg,#f7fbf9,#ffffff);border:1px solid #cfe3d8;box-shadow:0 6px 20px rgba(11,58,30,0.08)"><div class="section-title">Game: Text Sprint</div><div>${hud}</div><div id="gameToolbar" style="margin-top:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap"><button class="btn secondary" id="gameListen">Ouvir</button><button class="btn secondary" id="gameHint">Dica (2)</button><div id="gDiff" class="diff"><span class="small diff-label">Dificuldade</span><div class="diff-options"><button class="btn sm secondary" data-gdiff="easy">Fácil</button><button class="btn sm secondary" data-gdiff="normal">Normal</button><button class="btn sm secondary" data-gdiff="hard">Difícil</button></div></div></div><div id="gameQ" class="card" style="margin-top:8px;background:#ffffff;border:1px solid #dbe7e1;word-wrap:break-word"> </div><div id="gameOpts" style="margin-top:8px;display:flex;flex-wrap:wrap;gap:8px"></div><div id="gameOrdSeq" class="small" style="margin-top:6px"></div><div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="gameStart">Start</button> <button class="btn secondary" id="gameStop">Stop</button><button class="btn sm secondary" id="gameResetOrd" style="display:none">Reset frase</button></div><div class="small" id="gameRes" style="margin-top:8px"></div></div>`;
      function livesStr(n){ return Array.from({length:Math.max(0,n)},()=> '♥').join('') || '–'; }
      function updateHUD(){ const s=document.getElementById('gScore'); const st=document.getElementById('gStreak'); const t=document.getElementById('gTime'); const l=document.getElementById('gLives'); const p=document.getElementById('gProg'); const b=document.getElementById('gBest'); if(s) s.textContent=String(score); if(st) st.textContent=String(streak); if(t) t.textContent=String(timeLeft); if(l) l.textContent=livesStr(lives); if(p) p.style.width = `${Math.round(((qi)/qSrc.length)*100)}%`; if(b) b.textContent = String(best); const hintBtn=document.getElementById('gameHint'); if(hintBtn) hintBtn.textContent = `Dica (${hintsLeft})`; }
      function showQuestion(){ const q=qSrc[qi]; const qEl=document.getElementById('gameQ'); const oEl=document.getElementById('gameOpts'); const seqEl=document.getElementById('gameOrdSeq'); const resetBtn=document.getElementById('gameResetOrd'); if(!qEl||!oEl) return; if(q.type==='ord'){ qEl.innerHTML = 'Ordene as palavras para formar a frase:'; const words = q.options.map(w=>w); oEl.innerHTML = words.map((w,j)=>`<button class="btn secondary" data-gword="${j}">${w}</button>`).join(' '); q.user = []; if(seqEl) seqEl.textContent = ''; if(resetBtn) resetBtn.style.display='inline-block'; } else if(q.type==='seq'){ qEl.innerHTML = 'Ordene as sentenças (sequência lógica):'; const sents = q.options.map(w=>w); oEl.innerHTML = sents.map((w,j)=>`<button class="btn secondary" data-gsent="${j}">${w}</button>`).join(' '); q.user = []; if(seqEl) seqEl.textContent=''; if(resetBtn) resetBtn.style.display='inline-block'; } else { if(resetBtn) resetBtn.style.display='none'; qEl.innerHTML = q.type==='tr' ? `Tradução correta: "${q.prompt}"` : (q.type==='voc' ? `Qual é a tradução de "${q.prompt}"?` : (q.type==='tf' ? q.prompt : (q.type==='neg' ? q.prompt : q.prompt))); oEl.innerHTML = q.options.map((op,j)=>`<button class="btn" style="background:#0b3a1e;color:#fff" data-gopt="${j}">${op}</button>`).join(' '); if(seqEl) seqEl.textContent = ''; }
      }
      function next(){ qi++; updateHUD(); if(qi>=qSrc.length){ end('Parabéns! Concluiu todas as questões.'); return; } showQuestion(); }
      function end(msg){ playing=false; clearInterval(timer); const r=document.getElementById('gameRes'); const stars = score>=180?3: score>=120?2: score>=60?1:0; try { if(score>best){ best=score; localStorage.setItem('textSprintHiScore:'+levelTag, String(best)); } } catch {} if(r){ r.innerHTML = `${msg} Pontuação: ${score}. ${'★'.repeat(stars)}${stars?'' : ''}`; r.style.color = 'green'; } updateHUD(); }
      gameEl.addEventListener('click',(e)=>{ const t=e.target; if(t.id==='gameStart'){ if(playing) return; playing=true; score=0; streak=1; lives=3; timeLeft=60; hintsLeft=2; qi=0; updateHUD(); showQuestion(); clearInterval(timer); timer=setInterval(()=>{ timeLeft--; updateHUD(); if(timeLeft<=0) end('Tempo esgotado.'); },1000); } else if(t.id==='gameStop'){ end('Jogo encerrado.'); } else if(t.id==='gameListen'){ const q=qSrc[qi]; try { let say = ''; if(q.type==='tr'){ say = q.prompt; } else if(q.type==='voc'){ say = q.prompt; } else if(q.type==='aux'){ say = q.prompt.replace(/Complete com do\/does: \[____\]\s*/,'').replace(/\?$/,''); } else { say = q.prompt; } if (say) speak(say); } catch {} } else if(t.id==='gameHint'){ if(!playing || hintsLeft<=0) return; hintsLeft--; const oEl=document.getElementById('gameOpts'); const q=qSrc[qi]; const wrongIdx = [0,1,2,3].filter(i=> i!==q.answer).sort(()=>Math.random()-0.5).slice(0,2); wrongIdx.forEach(i=>{ const btn = oEl.querySelector(`[data-gopt="${i}"]`); if(btn){ btn.disabled = true; btn.style.opacity = '0.6'; } }); updateHUD(); } else if(t.id==='gameResetOrd'){ const q=qSrc[qi]; if(q.type==='ord' || q.type==='seq'){ q.user=[]; const seqEl=document.getElementById('gameOrdSeq'); if(seqEl) seqEl.textContent=''; const oEl=document.getElementById('gameOpts'); oEl.querySelectorAll('[data-gword],[data-gsent]').forEach(b=>{ b.disabled=false; b.style.opacity='1'; }); } } else if(t.dataset.gdiff!==undefined){ const mode=t.dataset.gdiff; if(mode==='easy'){ timeLeft=90; lives=4; } else if(mode==='hard'){ timeLeft=45; lives=2; } else { timeLeft=60; lives=3; } updateHUD(); } else if(t.dataset.gopt!==undefined){ if(!playing) return; const j=Number(t.dataset.gopt); const q=qSrc[qi]; const r=document.getElementById('gameRes'); if(q.type!=='ord' && q.type!=='seq'){ const ok = j===q.answer; if(ok){ score += 10*streak; streak = Math.min(streak+1,5); if(r){ r.textContent='Acertou!'; r.style.color='green'; } next(); } else { streak=1; lives--; if(r){ r.textContent='Tente novamente.'; r.style.color='red'; } if(lives<=0){ end('Acabaram as vidas.'); return; } updateHUD(); } } } else if(t.dataset.gword!==undefined){ if(!playing) return; const q=qSrc[qi]; const seqEl=document.getElementById('gameOrdSeq'); const idx = Number(t.dataset.gword); q.user = q.user || []; q.user.push(q.options[idx]); t.disabled=true; t.style.opacity='0.6'; if(seqEl){ seqEl.textContent = q.user.join(' '); } if(q.user.length === q.options.length){ const ok = q.user.join(' ') === q.answer.join(' '); const r=document.getElementById('gameRes'); if(ok){ score += 12*streak; streak = Math.min(streak+1,5); if(r){ r.textContent='Acertou!'; r.style.color='green'; } next(); } else { streak=1; lives--; if(r){ r.textContent='Tente novamente.'; r.style.color='red'; } if(lives<=0){ end('Acabaram as vidas.'); return; } updateHUD(); } } } else if(t.dataset.gsent!==undefined){ if(!playing) return; const q=qSrc[qi]; const seqEl=document.getElementById('gameOrdSeq'); const idx = Number(t.dataset.gsent); q.user = q.user || []; q.user.push(q.options[idx]); t.disabled=true; t.style.opacity='0.6'; if(seqEl){ seqEl.textContent = q.user.join('  |  '); } if(q.user.length === q.options.length){ const ok = q.user.join(' ') === q.answer.join(' '); const r=document.getElementById('gameRes'); if(ok){ score += 14*streak; streak = Math.min(streak+1,5); if(r){ r.textContent='Acertou!'; r.style.color='green'; } next(); } else { streak=1; lives--; if(r){ r.textContent='Tente novamente.'; r.style.color='red'; } if(lives<=0){ end('Acabaram as vidas.'); return; } updateHUD(); } } }
      });
    }
    renderTextGame(); renderClassify(); renderTransform(); renderOrdering(); renderDictation(); renderMatchVocab(); renderTrueFalse();
  }

  function renderVerbs(data) {
    const el = document.querySelector('#verbs');
    if (!el) return;
    const textParts = String(data.text||'').split(/(?<=[.!?])\s+/).filter(Boolean);
    const trParts = String(data.translation||'').split(/(?<=[.!?])\s+/).map(fixPT).filter(Boolean);
    const listStr = String(data.verbs||'');
    const m = listStr.split(':')[1] || listStr;
    const baseVerbs = m.split(',').map(s=>s.trim().toLowerCase().replace(/[^a-z]+$/i,'')).filter(Boolean);
    function thirdForm(v){ if(/(ch|sh|x|o)$/i.test(v)||v==='go') return v==='go'?'goes':v+'es'; if(/y$/i.test(v)) return v.replace(/y$/,'ies'); return v+'s'; }
    function findExamplesForVerb(v){
      const t = thirdForm(v);
      const rx = new RegExp(`\\b(${v}|${t})\\b`,'i');
      const out = [];
      for (let i=0;i<textParts.length;i++){
        const s = textParts[i];
        if (rx.test(s)) { out.push({ en: s, pt: trParts[i]||'' }); }
        if (out.length>=2) break;
      }
      return out;
    }
    let examples = [];
    baseVerbs.forEach(v=>{ examples.push(...findExamplesForVerb(v)); });
    const seen = new Set();
    examples = examples.filter(r=>{ const k=r.en; if(seen.has(k)) return false; seen.add(k); return true; }).slice(0,10);
    const rows = examples.map(r=>`<tr><td class="sent-${sentenceType(r.en)}">${highlightAction(r.en)}</td><td>${fixPT(r.pt)}</td></tr>`).join('');
    el.innerHTML = `
      <div class="card">
        <div><strong>O que é:</strong> verbo é ação do dia a dia. Use forma base com I/You/We/They. Em He/She/It acrescente s/es.</div>
      </div>
      <div class="section-title" style="margin-top:10px">Exemplos</div>
      <table class="verbs-table">
        <thead><tr><th style="text-align:left">EN</th><th style="text-align:left">PT</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;

    (async () => {
      const wrap = document.getElementById('grammarVideo');
      const vid = document.getElementById('lessonVideo');
      if (String(level) === 'A1' && Number(idx) === 1) {
        if (vid && wrap) {
          const url = encodeURI('./public/video/Base do Inglês/Base do Inglês.mp4');
          vid.src = url;
          vid.style.display = 'block';
          wrap.style.display = 'block';
          vid.addEventListener('error', ()=>{
            wrap.innerHTML = '<div class="small">Vídeo não encontrado. Caminho esperado: <code>public/video/Base do Inglês/Base do Inglês.mp4</code>.</div>';
            vid.style.display = 'none';
          }, { once:true });
        }
      } else if (wrap) { wrap.style.display = 'none'; }
    })();
  }

  function buildExercises(data){
    const pairs = Array.isArray(data.pairs) ? data.pairs : [];
    const voc = Array.isArray(data.vocabulary) ? data.vocabulary : [];
    const textParts = String(data.text||'').split(/(?<=[.!?])\s+/).filter(Boolean);
    let mc = [];
    if (pairs.length) {
      mc = pairs.slice(0,8).map(p=>{
        const correct = fixPT(p.pt);
        const options = [correct, 'Trator', 'Estufa', 'Segurança'].sort(()=>Math.random()-0.5);
        const answer = options.indexOf(correct);
        return { question: `Tradução correta: "${p.en}"`, options, answer };
      });
    } else if (voc.length) {
      const meanings = voc.map(v=> typeof v === 'string' ? '' : (v.meaning || v.translation || '')).filter(Boolean);
      mc = voc.slice(0,8).map(v=>{
        const correct = typeof v === 'string' ? v : (v.meaning || v.translation || '');
        const opts = [correct];
        const distractors = meanings.filter(m=> m && m!==correct);
        while (opts.length<4 && distractors.length){
          const pick = distractors.splice(Math.floor(Math.random()*distractors.length),1)[0];
          if (pick && !opts.includes(pick)) opts.push(pick);
        }
        const shuffled = opts.sort(()=>Math.random()-0.5);
        const answer = shuffled.indexOf(correct);
        const word = typeof v === 'string' ? v : (v.word || v.en || v.term || '');
        return { question: `Qual é a tradução de "${word}"?`, options: shuffled, answer };
      });
    } else if (textParts.length) {
      mc = textParts.slice(0,5).map(s=>{
        const correct = s;
        const opts = [correct, 'I drive the tractor.', 'We check the water.', 'He feeds the cows.'].sort(()=>Math.random()-0.5);
        const answer = opts.indexOf(correct);
        return { question: 'Qual frase apareceu no texto?', options: opts, answer };
      });
    }

    let fill = [];
    if (pairs.length) {
      const domain = /^(tractor|water|gloves|masks|record|monitor|feed|start|drive|check|clean|park|runs|engine|seat|wheel)$/i;
      fill = pairs.slice(0,6).map(p=>{
        const words = String(p.en||'').split(/\s+/);
        const target = words.find(w=>domain.test(w.replace(/[.,]/g,''))) || words[1] || words[0] || '';
        const rx = new RegExp(`\\b${target.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'i');
        const blanked = String(p.en||'').replace(rx,'____');
        return { sentence: blanked, answer: target.replace(/[.,]/g,'').toLowerCase() };
      });
    }
    if (!fill.length && textParts.length) {
      const verbsStr = String(data.verbs||'');
      const vb = (verbsStr.includes(':') ? verbsStr.split(':')[1] : verbsStr).split(',').map(s=>s.trim()).filter(Boolean);
      const buildFromVerbs = [];
      for (let i=0;i<textParts.length;i++){
        const s = textParts[i];
        const rx = vb.length ? new RegExp(`\\b(${vb.join('|')})(es|s)?\\b`,'i') : null;
        const m = rx ? s.match(rx) : null;
        if (m){
          const blanked = s.replace(rx,'____');
          const ans = (m[0]||'').toLowerCase().replace(/[.,]/g,'');
          buildFromVerbs.push({ sentence: blanked, answer: ans });
        }
        if (buildFromVerbs.length>=6) break;
      }
      fill = buildFromVerbs.length ? buildFromVerbs : textParts.slice(0,6).map(s=>{
        const w = (s.split(/\s+/)[1]||s.split(/\s+/)[0]||'drive').replace(/[.,]/g,'');
        const rx = new RegExp(`\\b${w}\\b`,'i');
        const blanked = s.replace(rx,'____');
        return { sentence: blanked, answer: w.toLowerCase() };
      });
    }

    const speaking = `Repeat: ${data.title||''}`;
    return { multiple_choice: mc, fill_in: fill, speaking };
  }

  function renderMC(data) {
    let mcEl = document.querySelector('#mc');
    if (mcEl) {
      const fresh = mcEl.cloneNode(false);
      fresh.id = 'mc';
      mcEl.parentNode.replaceChild(fresh, mcEl);
      mcEl = document.querySelector('#mc');
    }
    const exercises = (data && data.exercises && Array.isArray(data.exercises.multiple_choice)) ? data.exercises.multiple_choice : [];

    if (!exercises.length) {
        mcEl.innerHTML = '<div class="small">Sem questões de múltipla escolha disponíveis.</div>';
        return;
    }

    const renderedQuestions = exercises.map(q => {
        const correctAnswer = q.options[q.answer];
        const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
        const newAnswerIndex = shuffledOptions.indexOf(correctAnswer);
        return {
            question: q.question,
            options: shuffledOptions,
            answer: newAnswerIndex
        };
    });

    mcEl.innerHTML = renderedQuestions.map((q,i)=>`
      <div class="card">
        <div><strong>${i+1}. ${q.question}</strong></div>
        <div style="margin-top:6px">${q.options.map((op,j)=>`<button class="btn secondary" data-mc="${i}" data-idx="${j}">${op}</button>`).join(' ')}</div>
        <div class="small" id="mcRes${i}" style="margin-top:6px"></div>
      </div>
    `).join('');

    mcEl.addEventListener('click', (e) => {
      const t = e.target;
      if (!t.dataset.mc) return;
      const qi = Number(t.dataset.mc);
      const oi = Number(t.dataset.idx);
      const ok = oi === renderedQuestions[qi].answer;
      const resEl = document.getElementById('mcRes' + qi);
      if (resEl) {
        resEl.textContent = ok ? 'Acertou!' : 'Tente novamente.';
        resEl.style.color = ok ? 'green' : 'red';
      }
    });
  }

  function renderFill(data) {
    let fillEl = document.querySelector('#fill');
    if (fillEl) {
      const fresh = fillEl.cloneNode(false);
      fresh.id = 'fill';
      fillEl.parentNode.replaceChild(fresh, fillEl);
      fillEl = document.querySelector('#fill');
    }
    const src = (data && data.exercises && Array.isArray(data.exercises.fill_in)) ? data.exercises.fill_in : [];
    
    if (!src.length) {
        fillEl.innerHTML = '<div class="small">Sem itens para completar.</div>';
        return;
    }

    fillEl.innerHTML = src.map((f,i)=>`
      <div class="card"><div>${i+1}. ${f.sentence.replace('____',`<input class="blank" data-fill="${i}" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px" />`)}</div></div>
    `).join('');

    const checkBtn = document.querySelector('#checkFill');
    if (checkBtn) {
      const freshBtn = checkBtn.cloneNode(true);
      checkBtn.parentNode.replaceChild(freshBtn, checkBtn);
    }
    document.querySelector('#checkFill').addEventListener('click', () => {
      const inputs = fillEl.querySelectorAll('input.blank');
      let correctCount = 0;
      inputs.forEach((inp) => {
        const i = Number(inp.dataset.fill);
        const userAnswer = (inp.value || '').trim().toLowerCase();
        const correctAnswer = String(src[i].answer).toLowerCase();
        if (userAnswer === correctAnswer) {
            correctCount++;
            inp.style.borderColor = 'green';
        } else {
            inp.style.borderColor = 'red';
        }
      });
      const resultEl = document.querySelector('#fillResult');
      if (resultEl) {
        if (correctCount === inputs.length) {
            resultEl.textContent = 'Parabéns, você acertou tudo!';
            resultEl.style.color = 'green';
        } else {
            resultEl.textContent = `Você acertou ${correctCount} de ${inputs.length}. Tente novamente.`;
            resultEl.style.color = 'red';
        }
      }
    });
  }

  function startRecognition(expected) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recResultEl = document.querySelector('#recResult');
    if (!SR) {
      recResultEl.textContent = 'Reconhecimento de fala não suportado.';
      return;
    }
    const r = new SR();
    r.lang = 'en-US';
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onresult = (e) => {
      const said = (e.results[0][0].transcript || '').toLowerCase().trim();
      const exp = expected.toLowerCase().trim();
      function lev(a,b){ const m=Array.from({length:a.length+1},(_,i)=>Array(b.length+1).fill(0)); for(let i=0;i<=a.length;i++) m[i][0]=i; for(let j=0;j<=b.length;j++) m[0][j]=j; for(let i=1;i<=a.length;i++){ for(let j=1;j<=b.length;j++){ const cost=a[i-1]===b[j-1]?0:1; m[i][j]=Math.min(m[i-1][j]+1,m[i][j-1]+1,m[i-1][j-1]+cost) } } return m[a.length][b.length] }
      const distance = lev(said, exp);
      const threshold = Math.max(2, Math.round(exp.length*0.2));
      const ok = distance <= threshold;
      recResultEl.textContent = ok ? 'Good pronunciation!' : 'Try again.';
    };
    r.onerror = () => {
      recResultEl.textContent = 'Try again.';
    };
    r.start();
  }

  window.onscroll = () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      backToTopBtn.style.display = 'block';
    } else {
      backToTopBtn.style.display = 'none';
    }
  };

  backToTopBtn.addEventListener('click', () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });

  function renderLines(data){
    try {
      function phoneticBR(en){
        const dict = {
          'i':'Ai','you':'iú','we':'uí','they':'dêi','he':'rí','she':'xí','it':'ít',
          'am':'ém','is':'íz','are':'ár',
          'at':'ét','the':'dâ','a':'â','an':'ân','in':'in','on':'ón','under':'ândâr','next':'nékst','to':'tú',
          'farm':'fárm','barn':'bárn','pasture':'péstcher','field':'fíld','gate':'gueit','fence':'fêns',
          'cow':'cáu','cows':'cáuz','chicken':'tchí-ken','chickens':'tchí-kens','sheep':'xíp','horse':'hórs','horses':'hórsiz',
          'water':'uóter','feed':'fíid','trough':'tróf','bucket':'bâkit','tools':'túuls','box':'bóks',
          'morning':'mór-ning','today':'tudêi','clean':'clín','ready':'rédi','work':'uârk','keep':'kíip','check':'tchék','open':'óupen','near':'nír','safe':'sêif',
          'sun':'sãn','wind':'uínd','strong':'stróng','cool':'cúl'
        };
        function mapWord(w){
          const raw = String(w||'');
          const clean = raw.replace(/[^A-Za-z'-]/g,'');
          if (!clean) return raw;
          const lw = clean.toLowerCase();
          if (dict[lw]) return dict[lw];
          let t = clean;
          t = t.replace(/tion\b/i,'tchân');
          t = t.replace(/ing\b/i,'ín');
          t = t.replace(/^th/i,'d');
          t = t.replace(/oo/i,'ú');
          t = t.replace(/ea/i,'í');
          t = t.replace(/ar/i,'ár');
          t = t.replace(/er\b/i,'âr');
          t = t.replace(/ai/i,'ei');
          return t;
        }
        const parts = String(en||'').split(/(\s+|[.,!?;:])/);
        return parts.map(p=>/^[A-Za-z'-]+$/.test(p)?mapWord(p):p).join('').replace(/\s+/g,' ').trim();
      }
      const pairs = (Array.isArray(data.pairs) && data.pairs.length) ? data.pairs : [];
      if (pairs.length) {
        linesEl.innerHTML = pairs.map(p=>`<div class="line"><div class="en">${p.en}</div><div class="pt">${fixPT(p.pt)}</div><div class="phon">${phoneticBR(p.en)}</div></div>`).join('');
        return;
      }
      const enBase = splitSentences(String(data.text||''));
      const ptBase = splitSentences(fixPT(String(data.translation||'')));
      const lvl = (location.hash.split('/')[2]||'').toUpperCase();
      const curIdx = Number((location.hash.split('/')[3]||'1').trim());
      const needsMoreLines = ['A2','B1','B2','C1','C2'].includes(lvl) && (curIdx===11 || curIdx===12);
      let en = enBase;
      let pt = ptBase;
      if (needsMoreLines) {
        en = enBase.flatMap(s=> splitOnConnectorsEN(s));
        pt = ptBase.flatMap(s=> splitOnConnectorsPT(s));
      }
      const len = Math.max(en.length, pt.length);
      linesEl.innerHTML = Array.from({length: len}, (_,i)=>`<div class="line"><div class="en">${en[i]||''}</div><div class="pt">${pt[i]||''}</div><div class="phon">${phoneticBR(en[i]||'')}</div></div>`).join('');
      if (!linesEl.innerHTML) {
        linesEl.innerHTML = '<div class="small">Texto indisponível.</div>';
      }
    } catch {
      linesEl.innerHTML = '<div class="small">Texto indisponível.</div>';
    }
  }

  function generateExercises(item, idx) {
    const tm = item.teaching_modules || {};
    const vocab = Array.isArray(tm.vocabulary)
      ? tm.vocabulary.map(v => ({ word: String(v.word||'').toLowerCase(), meaning: String(v.translation||'').toLowerCase() }))
      : (Array.isArray(item.vocabulary)
        ? item.vocabulary.map(v => ({ word: String(v.word||'').toLowerCase(), meaning: String(v.translation||'').toLowerCase() }))
        : []);
    const verbsBase = Array.isArray(tm.verbs_list)
      ? Array.from(new Set(tm.verbs_list.map(s => String(s.base||'').toLowerCase()).filter(Boolean)))
      : (Array.isArray(item.structure_table)
        ? Array.from(new Set(item.structure_table.map(s => String(s.verb||'').toLowerCase()).filter(Boolean)))
        : []);
    const verbsStr = verbsBase.length ? `Verbs used: ${verbsBase.join(', ')}.` : '';

    function buildForms(ex) {
      const clean = String(ex||'').trim().replace(/[.?!]+$/, '');
      if (!clean) return { affirmative: '', negative: '', interrogative: '' };
      const words = clean.split(/\s+/);
      let subject = words[0];
      if (/^(the|a|an)$/i.test(words[0]) && words.length >= 2) subject = words[0] + ' ' + words[1];
      const subjEsc = subject.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      let rest = clean.replace(new RegExp('^' + subjEsc + '\\s+'), '');
      const first = (rest.split(/\s+/)[0]||'').toLowerCase();
      const isThird = /^(he|she|it)$/i.test(subject) || /^(the|a|an)\b/i.test(subject);
      if (first === 'is') {
        const tail = rest.replace(/^is\s+/i,'');
        return { affirmative: clean, negative: subject + ' is not ' + tail, interrogative: 'Is ' + subject + ' ' + tail + '?' };
      }
      function baseVerb(w){
        if (/^goes$/i.test(w)) return 'go';
        if (/ies$/i.test(w)) return w.replace(/ies$/i,'y');
        if (/(ch|sh|x|o|ss|zz)$/i.test(w.replace(/es$/i,'')) && /es$/i.test(w)) return w.replace(/es$/i,'');
        if (/s$/i.test(w)) return w.replace(/s$/i,'');
        return w;
      }
      const base = baseVerb(first);
      const restWords = rest.split(/\s+/);
      if (restWords.length) restWords[0] = base;
      const negAux = isThird ? "doesn't" : "don't";
      const qAux = isThird ? 'Does' : 'Do';
      return {
        affirmative: clean,
        negative: (subject + ' ' + negAux + ' ' + base + ' ' + restWords.slice(1).join(' ')).trim(),
        interrogative: (qAux + ' ' + subject + ' ' + restWords.join(' ') + '?').trim()
      };
    }

    let heSheItExample = null;
    if (Array.isArray(tm.grammar_table)) {
      const thirdRow = tm.grammar_table.find(r => /\b(it|he|she)\b/i.test(String(r.subject||'')));
      heSheItExample = thirdRow && thirdRow.example ? String(thirdRow.example) : null;
    }
    const baseExample = heSheItExample || (Array.isArray(tm.grammar_table) ? (tm.grammar_table[0] && tm.grammar_table[0].example) : '') || '';
    const forms = buildForms(baseExample);

    const lvl = String(item.level||'').toUpperCase();
    const grammarText = (lvl === 'B1')
      ? 'Past simple narrative with cause/result (because/so). Future (will/going to) for plans.'
      : (lvl === 'A2'
        ? 'Present simple + present continuous (routine vs now).'
        : (lvl === 'B2'
          ? 'Procedures, passive voice, sequences, and technical reporting.'
          : (lvl === 'C1'
            ? 'Advanced management language, complex clauses, and precise modality.'
            : (lvl === 'C2'
              ? 'Academic/report style, compliance wording, and controlled terminology.'
              : 'Present simple with farm routines.'))));
    const grammarForms = (lvl === 'B1') ? null : (forms.affirmative ? forms : (item.grammar_forms || null));

    let mc = [];
    const textSentences = splitSentences(String(item.text_en||''));

    if (Array.isArray(vocab) && vocab.length) {
      const meanings = vocab.map(v=>v.meaning).filter(Boolean);
      mc = vocab.slice(0,5).map(v => {
        const correct = v.meaning;
        const distractors = meanings.filter(m => m !== correct);
        const opts = [correct];
        while (opts.length < 4 && distractors.length) {
          const pickIdx = Math.floor(Math.random()*distractors.length);
          const pick = distractors.splice(pickIdx,1)[0];
          if (pick && !opts.includes(pick)) opts.push(pick);
        }
        return { question: `Qual é a tradução de "${v.word}"?`, options: opts, answer: opts.indexOf(correct) };
      });
    } else if (textSentences.length > 1) {
      mc = textSentences.slice(0, 5).map((s, i) => {
        const correct = s;
        const distractors = textSentences.filter(ds => ds !== correct);
        const opts = [correct];
        while(opts.length < 4 && distractors.length > 0) {
            const d = distractors.splice(Math.floor(Math.random() * distractors.length), 1)[0];
            if(d) opts.push(d);
        }
        return { question: 'Qual frase apareceu no texto?', options: opts, answer: opts.indexOf(correct) };
      });
    }

    let fillItems = [];
    const textParts = splitSentences(String(item.text_en||''));
    const vb = Array.isArray(verbsBase) ? verbsBase : [];
    if (vb.length) {
      for (let i=0;i<textParts.length;i++) {
        const s = textParts[i];
        const rx = new RegExp(`\\b(${vb.join('|')})(es|s)?\\b`, 'i');
        const m = s.match(rx);
        if (m) {
          const blanked = s.replace(rx,'____');
          const ans = (m[0]||'').toLowerCase().replace(/[.,]/g,'');
          fillItems.push({ sentence: blanked, answer: ans });
          if (fillItems.length>=6) break;
        }
      }
    }
    
    if (fillItems.length < 6) {
        const stopWords = ['a','an','the','in','on','at','is','am','are','i','you','he','she','it','we','they','to','of','for','and','but','or'];
        const parts = textParts.slice(0, 6 - fillItems.length);
        for (let i=0;i<parts.length;i++) {
            const s = parts[i];
            const words = s.replace(/[.,!?]+$/, '').split(/\s+/);
            let targetWord = null;
            // Find a word that is not a stopword and is longer than 2 chars
            for(const w of words) {
                if(!stopWords.includes(w.toLowerCase()) && w.length > 2) {
                    targetWord = w;
                    break;
                }
            }
            // Fallback to second word if no suitable word is found
            if(!targetWord) {
                targetWord = words.length > 1 ? words[1] : words[0];
            }

            if(targetWord){
                const rx = new RegExp(`\\b${targetWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                const blanked = s.replace(rx, '____');
                fillItems.push({ sentence: blanked, answer: targetWord.toLowerCase() });
            }
        }
    }

    fillItems = fillItems.slice(0,6);
    function buildA1Exercises(){
      const enParts = splitSentences(String(item.text_en||''));
      const ptParts = splitSentences(fixPT(String(item.text_pt||'')));
      const complete = (function(){
        const vb = Array.isArray(verbsBase) ? verbsBase : [];
        const out = [];
        for (let i=0;i<enParts.length;i++){
          const s = enParts[i];
          const rx = vb.length ? new RegExp(`\\b(${vb.join('|')})(es|s)?\\b`,'i') : null;
          const m = rx ? s.match(rx) : null;
          let target = '';
          let blanked = s;
          if (m){ target = (m[0]||'').replace(/[.,!?]/g,''); blanked = s.replace(rx,'____'); }
          else {
            const words = s.replace(/[.,!?]+$/,'').split(/\s+/);
            target = words[1] || words[0] || '';
            const rx2 = new RegExp(`\\b${target.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}\\b`,'i');
            blanked = s.replace(rx2,'____');
          }
          if (target) out.push({ prompt: blanked, answer: String(target).toLowerCase() });
          if (out.length>=5) break;
        }
        return out;
      })();
      function formsFor(s){
        const f = (function(ex){
          const clean = String(ex||'').trim().replace(/[.?!]+$/,'');
          if (!clean) return { affirmative:'',negative:'',interrogative:'' };
          const words = clean.split(/\s+/);
          let subject = words[0];
          if (/^(the|a|an)$/i.test(words[0]) && words.length>=2) subject = words[0]+' '+words[1];
          const subjEsc = subject.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&');
          let rest = clean.replace(new RegExp('^'+subjEsc+'\\s+'),'');
          const first = (rest.split(/\s+/)[0]||'').toLowerCase();
          const isThird = /^(he|she|it)$/i.test(subject) || /^(the|a|an)\b/i.test(subject);
          if (first==='is'){
            const tail = rest.replace(/^is\s+/i,'');
            return { affirmative: clean, negative: subject+' is not '+tail, interrogative: 'Is '+subject+' '+tail+'?' };
          }
          function baseVerb(w){ if (/^goes$/i.test(w)) return 'go'; if (/ies$/i.test(w)) return w.replace(/ies$/i,'y'); if (/(ch|sh|x|o|ss|zz)$/i.test(w.replace(/es$/i,'')) && /es$/i.test(w)) return w.replace(/es$/i,''); if (/s$/i.test(w)) return w.replace(/s$/i,''); return w; }
          const base = baseVerb(first);
          const restWords = rest.split(/\s+/); if (restWords.length) restWords[0] = base;
          const negAux = isThird ? "doesn't" : "don't"; const qAux = isThird ? 'Does' : 'Do';
          return { affirmative: clean, negative: (subject+' '+negAux+' '+base+' '+restWords.slice(1).join(' ')).trim(), interrogative: (qAux+' '+subject+' '+restWords.join(' ')+'?').trim() };
        })(s);
        return { base: annotateTextManual(s), negative: annotateTextManual(f.negative), interrogative: annotateTextManual(f.interrogative) };
      }
      const neg = []; const ques = [];
      for (let i=0;i<enParts.length && (neg.length<3 || ques.length<3); i++){
        const f = formsFor(enParts[i]);
        if (neg.length<3 && f.negative) neg.push({ base: f.base, result: f.negative });
        if (ques.length<3 && f.interrogative) ques.push({ base: f.base, result: f.interrogative });
      }
      const trShort = [];
      for (let i=0;i<Math.min(3,enParts.length); i++){
        trShort.push({ en: annotateTextManual(enParts[i]), pt: fixPT(ptParts[i]||'') });
      }
      const repeat = enParts.slice(0,5).map(s=>({ en: annotateTextManual(s) }));
      const narration = enParts.slice(0);
      return { complete, negative: neg, question: ques, translation_short: trShort, repetition_phrases: repeat, narration_sentences: narration };
    }
    const a1ex = buildA1Exercises();
    return {
      title: item.title || `Texto ${idx}`,
      text: item.text_en || '',
      translation: item.text_pt || '',
      vocabulary: vocab,
      grammar: grammarText,
      verbs: verbsStr,
      exercises: { multiple_choice: mc, fill_in: fillItems, speaking: `Repeat: ${item.title||''}` },
      a1_exercises: a1ex,
      he_she_it_rule: heSheItExample ? { example: heSheItExample } : (item.he_she_it_rule || null),
      grammar_forms: grammarForms,
      usage_table: item.usage_table || null,
      structure_table: item.structure_table || null
    };
  }
  function fetchText() {
    if (level === 'A1') {
      const p1 = '/src/data/texts/A1/a1_blocks.json';
      const p2 = './src/data/texts/A1/a1_blocks.json';
      return (fetch(p1).then(r=> r.ok ? r.json() : Promise.reject()).catch(()=> fetch(p2).then(r=> r.json())))
        .then(items => {
          const item = (Array.isArray(items) ? (items.find(o => Number(o.id) === Number(idx)) || items[idx-1]) : null) || {};
          return generateExercises(item, idx);
        });
    }
    if (level === 'A2') {
      const p1 = '/src/data/texts/A2/a2_blocks.json';
      const p2 = './src/data/texts/A2/a2_blocks.json';
      return (fetch(p1).then(r=> r.ok ? r.json() : Promise.reject()).catch(()=> fetch(p2).then(r=> r.json())))
        .then(items => {
          const item = (Array.isArray(items) ? (items.find(o => Number(o.id) === Number(idx)) || items[idx-1]) : null) || {};
          return generateExercises(item, idx);
        });
    }
    if (level === 'B1') {
      const p1 = '/src/data/texts/B1/b1_blocks.json';
      const p2 = './src/data/texts/B1/b1_blocks.json';
      return (fetch(p1).then(r=> r.ok ? r.json() : Promise.reject()).catch(()=> fetch(p2).then(r=> r.json())))
        .then(items => {
          const item = (Array.isArray(items) ? (items.find(o => Number(o.id) === Number(idx)) || items[idx-1]) : null) || {};
          return generateExercises(item, idx);
        });
    }
    if (level === 'B2') {
      const p1 = '/src/data/texts/B2/b2_blocks.json';
      const p2 = './src/data/texts/B2/b2_blocks.json';
      return (fetch(p1).then(r=> r.ok ? r.json() : Promise.reject()).catch(()=> fetch(p2).then(r=> r.json())))
        .then(items => {
          const item = (Array.isArray(items) ? (items.find(o => Number(o.id) === Number(idx)) || items[idx-1]) : null) || {};
          return generateExercises(item, idx);
        });
    }
    if (level === 'C1') {
      const p1 = '/src/data/texts/C1/c1_blocks.json';
      const p2 = './src/data/texts/C1/c1_blocks.json';
      return (fetch(p1).then(r=> r.ok ? r.json() : Promise.reject()).catch(()=> fetch(p2).then(r=> r.json())))
        .then(items => {
          const item = (Array.isArray(items) ? (items.find(o => Number(o.id) === Number(idx)) || items[idx-1]) : null) || {};
          return generateExercises(item, idx);
        });
    }
    if (level === 'C2') {
      const p1 = '/src/data/texts/C2/c2_blocks.json';
      const p2 = './src/data/texts/C2/c2_blocks.json';
      return (fetch(p1).then(r=> r.ok ? r.json() : Promise.reject()).catch(()=> fetch(p2).then(r=> r.json())))
        .then(items => {
          const item = (Array.isArray(items) ? (items.find(o => Number(o.id) === Number(idx)) || items[idx-1]) : null) || {};
          return generateExercises(item, idx);
        });
    }
    return fetch(path1).then(r=> r.ok ? r.json() : Promise.reject()).catch(()=> fetch(path2).then(r=>r.json()));
  }
  fetchText()
    .then(async (data) => {
      let uiTitle = '';
      try {
        const lvl = String(level).toUpperCase();
        const blocksName = `${lvl.toLowerCase()}_blocks.json`;
        const bp1 = `/src/data/texts/${lvl}/${blocksName}`;
        const bp2 = `./src/data/texts/${lvl}/${blocksName}`;
        const items = await (fetch(bp1).then(r=> r.ok ? r.json() : Promise.reject()).catch(()=> fetch(bp2).then(r=> r.json())));
        const item = (Array.isArray(items) ? (items.find(o => Number(o.id) === Number(idx)) || items[idx-1]) : null) || {};
        uiTitle = String(item.title||'');
      } catch {}
      if (uiTitle) { data.uiTitle = uiTitle; }

      setupUI(data);
      if (uiTitle) {
        try { document.getElementById('title').textContent = uiTitle + ' · ' + level; } catch {}
      }
      renderLines(data);
      setupAudio(data);
      
      try { renderVocabulary(data); } catch (e) { console.error('Error in renderVocabulary:', e); }
      try { renderGrammar(data); } catch (e) { console.error('Error in renderGrammar:', e); }
      try { const vEl = document.querySelector('#verbs'); if (vEl) vEl.remove(); } catch {}
      try { renderMC(data); } catch (e) { console.error('Error in renderMC:', e); }
      try { renderFill(data); } catch (e) { console.error('Error in renderFill:', e); }
      try {
        const el = document.getElementById('a1ex');
        if (el) {
          const ex = data.a1_exercises || {};
          const comp = Array.isArray(ex.complete) ? ex.complete : [];
          const neg = Array.isArray(ex.negative) ? ex.negative : [];
          const ques = Array.isArray(ex.question) ? ex.question : [];
          const tr = Array.isArray(ex.translation_short) ? ex.translation_short : [];
          const rep = Array.isArray(ex.repetition_phrases) ? ex.repetition_phrases : [];
          const nar = Array.isArray(ex.narration_sentences) ? ex.narration_sentences : [];
          const compHtml = comp.length ? comp.map((f,i)=>`<div class="card"><div>${i+1}. ${f.prompt.replace('____',`<input class="blank" data-a1c="${i}" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px" />`)}</div></div>`).join('') : '<div class="small">Sem itens de completar.</div>';
          const negHtml = neg.length ? neg.map((r,i)=>`<div class="card"><div>${i+1}. ${r.base}</div><div style="margin-top:6px"><button class="btn secondary" data-a1neg="${i}">Ver negativa</button></div><div class="small" id="a1neg${i}" style="margin-top:6px"></div></div>`).join('') : '';
          const qHtml = ques.length ? ques.map((r,i)=>`<div class="card"><div>${i+1}. ${r.base}</div><div style="margin-top:6px"><button class="btn secondary" data-a1q="${i}">Ver pergunta</button></div><div class="small" id="a1q${i}" style="margin-top:6px"></div></div>`).join('') : '';
          const trHtml = tr.length ? tr.map((r,i)=>`<div class="card"><div>${i+1}. ${r.en}</div><div style="margin-top:6px"><button class="btn secondary" data-a1tr="${i}">Ver tradução</button></div><div class="small" id="a1tr${i}" style="margin-top:6px"></div></div>`).join('') : '';
          const repHtml = rep.length ? rep.map((r,i)=>`<div class="card"><div>${i+1}. ${r.en}</div><div style="margin-top:6px"><button class="btn secondary" data-a1rep="${i}">Ouvir</button></div></div>`).join('') : '';
          const narHtml = nar.length ? `<div class="line"><div class="en">${nar.join(' ')}</div><div class="pt">${fixPT(String(data.translation||''))}</div></div>` : '';
          el.innerHTML = `
            <div class="section-title">Complete (5 itens)</div>
            ${compHtml}
            <button class="btn" id="checkA1Complete" style="margin-top:8px">Checar</button>
            <div id="a1CompleteRes" class="small" style="margin-top:6px"></div>
            <div class="section-title" style="margin-top:12px">Transforme para negativa (3 itens)</div>
            ${negHtml || '<div class="small">Sem itens de negativa.</div>'}
            <div class="section-title" style="margin-top:12px">Transforme para pergunta (3 itens)</div>
            ${qHtml || '<div class="small">Sem itens de pergunta.</div>'}
            <div class="section-title" style="margin-top:12px">Tradução curta (3 itens)</div>
            ${trHtml || '<div class="small">Sem itens de tradução.</div>'}
            <div class="section-title" style="margin-top:12px">Frases para repetição (5 itens)</div>
            ${repHtml || '<div class="small">Sem frases de repetição.</div>'}
          `;
          const btn = document.getElementById('checkA1Complete');
          if (btn) btn.addEventListener('click', ()=>{
            const inputs = el.querySelectorAll('input.blank');
            let ok=0;
            inputs.forEach(inp=>{ const i=Number(inp.dataset.a1c||-1); const ans=(comp[i]&&comp[i].answer||'').toLowerCase(); const said=(inp.value||'').trim().toLowerCase(); if(said===ans){ ok++; inp.style.borderColor='green' } else { inp.style.borderColor='red' } });
            const res=document.getElementById('a1CompleteRes'); if(res){ if(ok===inputs.length){ res.textContent='Parabéns, você acertou tudo!'; res.style.color='green' } else { res.textContent=`Você acertou ${ok} de ${inputs.length}. Tente novamente.`; res.style.color='red' } }
          });
          el.addEventListener('click',(e)=>{
            const t=e.target;
            if(t.dataset.a1neg!==undefined){ const i=Number(t.dataset.a1neg); const r=document.getElementById('a1neg'+i); if(r) r.innerHTML = `<span class="sent-neg">${(neg[i] && neg[i].result) || ''}</span>`; }
            if(t.dataset.a1q!==undefined){ const i=Number(t.dataset.a1q); const r=document.getElementById('a1q'+i); if(r) r.innerHTML = `<span class="sent-q">${(ques[i] && ques[i].result) || ''}</span>`; }
            if(t.dataset.a1tr!==undefined){ const i=Number(t.dataset.a1tr); const r=document.getElementById('a1tr'+i); if(r) r.textContent = tr[i] && tr[i].pt || ''; }
            if(t.dataset.a1rep!==undefined){ const i=Number(t.dataset.a1rep); try { speak(rep[i] && rep[i].en || '') } catch {} }
          });
        }
      } catch (e) { console.error('Error in renderA1Exercises:', e); }

      const speakPromptEl = document.querySelector('#speakPrompt');
      if (speakPromptEl) {
        speakPromptEl.textContent = (data.exercises && data.exercises.speaking) || '';
      }
      
      const startRecEl = document.getElementById('startRec');
      if (startRecEl) {
        startRecEl.addEventListener('click', () =>
          startRecognition((data.exercises && data.exercises.speaking) || '')
        );
      }

      let mediaStream = null;
      let mediaRecorder = null;
      let recordedChunks = [];
      let recordedURL = '';
      const recStatus = document.getElementById('recStatus');
      const playback = document.getElementById('recordedPlayback');
      function setStatus(msg){ if (recStatus) recStatus.textContent = msg }
      const recordBtn = document.getElementById('recordBtn');
      const stopRecordBtn = document.getElementById('stopRecordBtn');
      const playRecordBtn = document.getElementById('playRecordBtn');
      async function startRecording(){
        try {
          recordedChunks = [];
          mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'audio/webm' });
          mediaRecorder.ondataavailable = e => { if (e.data && e.data.size > 0) recordedChunks.push(e.data) };
          mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'audio/webm' });
            if (recordedURL) URL.revokeObjectURL(recordedURL);
            recordedURL = URL.createObjectURL(blob);
            if (playback) { playback.src = recordedURL; playback.style.display = 'block' }
            setStatus('Gravação concluída.');
          };
          mediaRecorder.start();
          setStatus('Gravando…');
          if (playback) playback.style.display = 'none';
        } catch {
          setStatus('Permissão de microfone necessária.');
        }
      }
      function stopRecording(){
        try { if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop() } catch {}
        try { if (mediaStream) mediaStream.getTracks().forEach(t=>t.stop()) } catch {}
      }
      if (recordBtn) recordBtn.addEventListener('click', startRecording);
      if (stopRecordBtn) stopRecordBtn.addEventListener('click', stopRecording);
      if (playRecordBtn) playRecordBtn.addEventListener('click', () => { if (playback && playback.src) playback.play() });

      const pronList = document.getElementById('pronList');
      function getSentences(d){
        if (Array.isArray(d.pairs) && d.pairs.length) return d.pairs.map(p=>p.en);
        const textParts = String(d.text||'').split(/(?<=[.!?])\s+/).filter(Boolean);
        if (textParts.length) return textParts;
        const voc = Array.isArray(d.vocabulary) ? d.vocabulary : [];
        if (voc.length) {
          return voc.map(v=> typeof v === 'string' ? v : (v.en || v.term || '')).filter(Boolean);
        }
        return [];
      }
      const sentences = getSentences(data);
      function getPtSentences(d){
        if (Array.isArray(d.pairs) && d.pairs.length) return d.pairs.map(p=>fixPT(p.pt));
        const trParts = String(d.translation||'').split(/(?<=[.!?])\s+/).map(fixPT).filter(Boolean);
        if (trParts.length) return trParts;
        const voc = Array.isArray(d.vocabulary) ? d.vocabulary : [];
        return voc.map(v=> typeof v === 'string' ? '' : fixPT(v.pt || v.translation || '')).filter(x=>true);
      }
      const ptSentences = getPtSentences(data);
      if (pronList) {
        const shown = sentences.slice(0, Math.min(sentences.length || 0, 6));
        pronList.innerHTML = shown.map((s,i)=>`
          <div class="pron-card">
            <div class="text">${s}</div>
            <div class="toolbar" style="margin-top:8px">
              <button class="btn sm secondary" data-pron-play="${i}">Ouvir</button>
              <button class="btn sm" data-pron-record="${i}">Gravar</button>
              <button class="btn sm secondary" data-pron-stop="${i}">Parar</button>
              <button class="btn sm secondary" data-pron-playrec="${i}">Ouvir minha pronúncia</button>
              <button class="btn sm secondary" data-pron-compare="${i}">Comparar</button>
            </div>
            <audio id="pron-audio-${i}" style="margin-top:6px; width:100%; display:none" controls></audio>
          </div>
        `).join('') || '<div class="small">Sem frases disponíveis.</div>';
        const recordedURLMap = {};
        pronList.addEventListener('click', (e)=>{
          const t = e.target;
          const idxStr = t.dataset.pronPlay || t.dataset.pronRecord || t.dataset.pronStop || t.dataset.pronPlayrec || t.dataset.pronCompare;
          if (!idxStr) return;
          const i = Number(idxStr);
          if (t.dataset.pronPlay !== undefined) {
            speak(sentences[i]);
          } else if (t.dataset.pronRecord !== undefined) {
            recordedChunks = [];
            navigator.mediaDevices.getUserMedia({ audio: true }).then(stream=>{
              mediaStream = stream;
              mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
              mediaRecorder.ondataavailable = e => { if (e.data && e.data.size>0) recordedChunks.push(e.data) };
              mediaRecorder.onstop = ()=>{
                const blob = new Blob(recordedChunks, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                const prev = recordedURLMap[i]; if (prev) URL.revokeObjectURL(prev);
                recordedURLMap[i] = url;
                const a = document.getElementById('pron-audio-'+i);
                if (a) { a.src = url; a.style.display = 'block' }
                setStatus('Gravação concluída.');
              };
              mediaRecorder.start();
              setStatus('Gravando…');
              const meter = document.getElementById('recMeter');
              const bar = meter ? meter.querySelector('span') : null;
              try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const src = ctx.createMediaStreamSource(stream);
                const analyser = ctx.createAnalyser();
                analyser.fftSize = 256;
                const dataArr = new Uint8Array(analyser.frequencyBinCount);
                src.connect(analyser);
                let run = true;
                const loop = ()=>{
                  if (!run) return;
                  analyser.getByteTimeDomainData(dataArr);
                  let sum=0; for (let j=0;j<dataArr.length;j++) sum += Math.abs(dataArr[j]-128);
                  const vol = Math.min(100, Math.round((sum/dataArr.length)/1.5));
                  if (bar) bar.style.width = vol+'%';
                  requestAnimationFrame(loop);
                };
                loop();
                mediaRecorder.addEventListener('stop', ()=>{ run=false; if (bar) bar.style.width='0%' });
              } catch {}
            }).catch(()=>{ setStatus('Permissão de microfone necessária.'); });
          } else if (t.dataset.pronStop !== undefined) {
            try { if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop() } catch {}
            try { if (mediaStream) mediaStream.getTracks().forEach(tr=>tr.stop()) } catch {}
          } else if (t.dataset.pronPlayrec !== undefined) {
            const a = document.getElementById('pron-audio-'+i);
            if (a && a.src) a.play();
          } else if (t.dataset.pronCompare !== undefined) {
            const a = document.getElementById('pron-audio-'+i);
            const voice = getVoice();
            const u = new SpeechSynthesisUtterance(sentences[i]);
            if (voice) u.voice = voice;
            u.rate = Number(localStorage.getItem('rate')||state.rate);
            u.pitch = Number(localStorage.getItem('pitch')||state.pitch);
            u.onend = () => { if (a && a.src) a.play() };
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(u);
          }
        });
      }

      const fullTextEl = document.getElementById('fullSpeechText');
      const fullOrigAudio = document.getElementById('fullOrigAudio');
      const fullMyAudio = document.getElementById('fullMyAudio');
      const btnFullPlayOrig = document.getElementById('fullPlayOrig');
      const btnFullRecord = document.getElementById('fullRecord');
      const btnFullStop = document.getElementById('fullStop');
      const btnFullPlayMine = document.getElementById('fullPlayMine');
      const btnFullDownload = document.getElementById('fullDownload');
      const btnFullCompare = document.getElementById('fullCompare');
      const compareResultEl = document.getElementById('fullCompareResult');
      const fullRecordDefaultLabel = btnFullRecord ? btnFullRecord.textContent : 'Gravar minha narração';
      let hasFullMp3 = false;
      let fullMediaRecorder;
      let fullMediaStream;
      let fullRecordedChunks = [];
      let fullRecordedBlob = null;
      let fullRecTimer = null;
      let fullRecStart = 0;

      if (fullTextEl) {
        const enText = sentences.join(' ');
        const ptText = ptSentences.join(' ');
        fullTextEl.innerHTML = `<div class="line"><div class="en">${enText}</div><div class="pt">${ptText}</div></div>`;
      }

      (function tryLoadFullAudio(){
        const lvl = String(level).trim();
        const title = String(data && (data.uiTitle || data.title) || '').trim();
        const urls = buildAudioUrls(lvl, title);
        let i = 0;
        function attempt(){
          if (!fullOrigAudio) return;
          if (i >= urls.length) { hasFullMp3 = false; return; }
          fullOrigAudio.src = urls[i];
          fullOrigAudio.load();
        }
        function onLoaded(){ hasFullMp3 = true; fullOrigAudio.style.display='block'; fullOrigAudio.removeEventListener('loadedmetadata', onLoaded); fullOrigAudio.removeEventListener('error', onError); }
        function onError(){ i++; attempt(); }
        if (fullOrigAudio) { fullOrigAudio.addEventListener('loadedmetadata', onLoaded); fullOrigAudio.addEventListener('error', onError); }
        attempt();
      })();

      function speakFull(){ const txt = sentences.join(' '); speak(txt); }
      function stopInput(){
        try { if (fullMediaRecorder && fullMediaRecorder.state !== 'inactive') fullMediaRecorder.stop() } catch {}
        try { if (fullMediaStream) fullMediaStream.getTracks().forEach(t=>t.stop()) } catch {}
        if (fullRecTimer) { clearInterval(fullRecTimer); fullRecTimer = null; }
        if (btnFullRecord) { btnFullRecord.disabled = false; btnFullRecord.textContent = fullRecordDefaultLabel; }
        if (btnFullStop) btnFullStop.disabled = true;
      }
      if (btnFullPlayOrig) btnFullPlayOrig.addEventListener('click', ()=>{ if (hasFullMp3 && fullOrigAudio && fullOrigAudio.src) { fullOrigAudio.currentTime=0; fullOrigAudio.play(); } else { speakFull() } });
      if (btnFullRecord) btnFullRecord.addEventListener('click', ()=>{
        fullRecordedChunks = [];
        navigator.mediaDevices.getUserMedia({ audio:true }).then(stream=>{
          fullMediaStream = stream;
          fullMediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
          const meter = document.getElementById('recMeter');
          const bar = meter ? meter.querySelector('span') : null;
          try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const src = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            const dataArr = new Uint8Array(analyser.frequencyBinCount);
            src.connect(analyser);
            let run = true;
            const loop = ()=>{ if (!run) return; analyser.getByteTimeDomainData(dataArr); let sum=0; for(let j=0;j<dataArr.length;j++) sum += Math.abs(dataArr[j]-128); const vol = Math.min(100, Math.round((sum/dataArr.length)/1.5)); if (bar) bar.style.width = vol+'%'; requestAnimationFrame(loop); };
            loop();
            fullMediaRecorder.addEventListener('stop', ()=>{ run=false; if (bar) bar.style.width='0%' });
          } catch {}
          fullMediaRecorder.ondataavailable = e=>{ if (e.data && e.data.size>0) fullRecordedChunks.push(e.data) };
          fullMediaRecorder.onstop = ()=>{
            fullRecordedBlob = new Blob(fullRecordedChunks, { type:'audio/webm' });
            const url = URL.createObjectURL(fullRecordedBlob);
            if (fullMyAudio) { fullMyAudio.src = url; fullMyAudio.style.display='block'; }
            if (fullRecTimer) { clearInterval(fullRecTimer); fullRecTimer = null; }
            if (btnFullRecord) { btnFullRecord.disabled = false; btnFullRecord.textContent = fullRecordDefaultLabel; }
            if (btnFullStop) btnFullStop.disabled = true;
          };
          fullRecStart = Date.now();
          if (btnFullRecord) { btnFullRecord.disabled = true; btnFullRecord.textContent = 'Gravando 00:00'; }
          if (btnFullStop) btnFullStop.disabled = false;
          const fmt = (ms)=>{ const s = Math.floor(ms/1000); const m = Math.floor(s/60); const sec = s%60; return String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0'); };
          fullRecTimer = setInterval(()=>{ if (btnFullRecord) btnFullRecord.textContent = 'Gravando '+fmt(Date.now()-fullRecStart); }, 500);
          fullMediaRecorder.start();
        }).catch(()=>{});
      });
      if (btnFullStop) btnFullStop.addEventListener('click', ()=> stopInput());
      if (btnFullPlayMine) btnFullPlayMine.addEventListener('click', ()=>{ if (fullMyAudio && fullMyAudio.src) { fullMyAudio.currentTime=0; fullMyAudio.play(); } });
      if (btnFullDownload) btnFullDownload.addEventListener('click', ()=>{
        if (!fullRecordedBlob) return;
        const a = document.createElement('a');
        const url = URL.createObjectURL(fullRecordedBlob);
        a.href = url;
        const lvl = String(level).trim();
        const title = String(data && (data.uiTitle || data.title) || '').trim();
        a.download = `${title} · ${lvl} · minha-narracao.webm`;
        document.body.appendChild(a);
        a.click();
        setTimeout(()=>{ document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
      });
      if (btnFullCompare) btnFullCompare.addEventListener('click', ()=>{
        if (hasFullMp3 && fullOrigAudio && fullOrigAudio.src) {
          fullOrigAudio.currentTime=0; fullOrigAudio.play(); fullOrigAudio.onended = ()=>{ if (fullMyAudio && fullMyAudio.src) fullMyAudio.play() };
        } else {
          const u = new SpeechSynthesisUtterance(sentences.join(' '));
          const voice = getVoice(); if (voice) u.voice = voice; u.rate = Number(localStorage.getItem('rate')||state.rate); u.pitch = Number(localStorage.getItem('pitch')||state.pitch);
          u.onend = ()=>{ if (fullMyAudio && fullMyAudio.src) fullMyAudio.play() };
          window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
        }
        try {
          const words = sentences.join(' ').trim().split(/\s+/).length;
          let origDur = (fullOrigAudio && !isNaN(fullOrigAudio.duration) && fullOrigAudio.duration>0) ? fullOrigAudio.duration : null;
          let myDur = (fullMyAudio && !isNaN(fullMyAudio.duration) && fullMyAudio.duration>0) ? fullMyAudio.duration : null;
          if (!origDur && !hasFullMp3) { origDur = null; }
          const myWpm = myDur ? Math.round((words / myDur) * 60) : null;
          const origWpm = origDur ? Math.round((words / origDur) * 60) : null;
          const parts = [];
          if (origDur) parts.push(`<span class="metric-badge orig"><span class="dot"></span>Original: ${Math.round(origDur)}s${origWpm?` · ${origWpm} WPM`:''}</span>`);
          if (myDur) parts.push(`<span class="metric-badge mine"><span class="dot"></span>Minha: ${Math.round(myDur)}s${myWpm?` · ${myWpm} WPM`:''}</span>`);
          if (compareResultEl) compareResultEl.innerHTML = `<div class="compare-badges">${parts.join(' ')}</div>`;
        } catch {}
      });

      const openPronModal = document.getElementById('openPronModal');
      const pronModal = document.getElementById('pronModal');
      const closePronModal = document.getElementById('closePronModal');
      const closePronModal2 = document.getElementById('closePronModal2');
      const pronModalList = document.getElementById('pronModalList');
      if (openPronModal && pronModal && pronModalList) {
        const renderModalList = () => {
          const max = Math.min((sentences && sentences.length) || 0, 6);
          pronModalList.innerHTML = (sentences.slice(0, max)).map((s,i)=>`
            <div class="pron-card">
              <div class="text">${s}</div>
              <div class="small">${ptSentences[i] || ''}</div>
              <div class="toolbar" style="margin-top:8px">
                <button class="btn sm secondary" data-pron-play="${i}">Ouvir</button>
                <button class="btn sm" data-pron-record="${i}">Gravar</button>
                <button class="btn sm secondary" data-pron-stop="${i}">Parar</button>
                <button class="btn sm secondary" data-pron-playrec="${i}">Ouvir minha pronúncia</button>
                <button class="btn sm secondary" data-pron-compare="${i}">Comparar</button>
              </div>
              <audio id="pron-modal-audio-${i}" style="margin-top:6px; width:100%; display:none" controls></audio>
            </div>
          `).join('') || '<div class="small">Sem trechos disponíveis para este texto.</div>';
        };
        openPronModal.addEventListener('click', () => {
          renderModalList();
          pronModal.style.display = 'block';
          pronModal.setAttribute('aria-hidden','false');
        });
        [closePronModal, closePronModal2].forEach(btn=>{
          if (btn) btn.addEventListener('click', () => {
            pronModal.style.display = 'none';
            pronModal.setAttribute('aria-hidden','true');
            try { if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop() } catch {}
            try { if (mediaStream) mediaStream.getTracks().forEach(tr=>tr.stop()) } catch {}
          });
        });
        const recordedModalURLMap = {};
        pronModalList.addEventListener('click', (e)=>{
          const t = e.target;
          const idxStr = t.dataset.pronPlay || t.dataset.pronRecord || t.dataset.pronStop || t.dataset.pronPlayrec || t.dataset.pronCompare;
          if (!idxStr) return;
          const i = Number(idxStr);
          if (t.dataset.pronPlay !== undefined) {
            speak(sentences[i]);
          } else if (t.dataset.pronRecord !== undefined) {
            recordedChunks = [];
            navigator.mediaDevices.getUserMedia({ audio: true }).then(stream=>{
              mediaStream = stream;
              mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
              mediaRecorder.ondataavailable = e => { if (e.data && e.data.size>0) recordedChunks.push(e.data) };
              mediaRecorder.onstop = ()=>{
                const blob = new Blob(recordedChunks, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                const prev = recordedModalURLMap[i]; if (prev) URL.revokeObjectURL(prev);
                recordedModalURLMap[i] = url;
                const a = document.getElementById('pron-modal-audio-'+i);
                if (a) { a.src = url; a.style.display = 'block' }
                setStatus('Gravação concluída.');
              };
              mediaRecorder.start();
              setStatus('Gravando…');
            }).catch(()=>{ setStatus('Permissão de microfone necessária.'); });
          } else if (t.dataset.pronStop !== undefined) {
            try { if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop() } catch {}
            try { if (mediaStream) mediaStream.getTracks().forEach(tr=>tr.stop()) } catch {}
          } else if (t.dataset.pronPlayrec !== undefined) {
            const a = document.getElementById('pron-modal-audio-'+i);
            if (a && a.src) a.play();
          } else if (t.dataset.pronCompare !== undefined) {
            const a = document.getElementById('pron-modal-audio-'+i);
            const voice = getVoice();
            const u = new SpeechSynthesisUtterance(sentences[i]);
            if (voice) u.voice = voice;
            u.rate = Number(localStorage.getItem('rate')||state.rate);
            u.pitch = Number(localStorage.getItem('pitch')||state.pitch);
            u.onend = () => { if (a && a.src) a.play() };
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(u);
          }
        });
      }

      const prog = JSON.parse(localStorage.getItem('progress') || '{}');
      prog[level] = Math.max(Number(prog[level] || 1), idx);
      prog.lastLevel = level;
      localStorage.setItem('progress', JSON.stringify(prog));

      (async () => {
        const map = {
          A1: ['/src/data/texts/A1/a1_blocks.json','./src/data/texts/A1/a1_blocks.json'],
          A2: ['/src/data/texts/A2/a2_blocks.json','./src/data/texts/A2/a2_blocks.json'],
          B1: ['/src/data/texts/B1/b1_blocks.json','./src/data/texts/B1/b1_blocks.json'],
          B2: ['/src/data/texts/B2/b2_blocks.json','./src/data/texts/B2/b2_blocks.json'],
          C1: ['/src/data/texts/C1/c1_blocks.json','./src/data/texts/C1/c1_blocks.json'],
          C2: ['/src/data/texts/C2/c2_blocks.json','./src/data/texts/C2/c2_blocks.json']
        };
        let total = 10;
        try { const r = await fetch(map[level][0]); if (r.ok) { const arr = await r.json(); total = Array.isArray(arr)? arr.length : 10; } } catch {}
        if (total === 10) { try { const r = await fetch(map[level][1]); const arr = await r.json(); total = Array.isArray(arr)? arr.length : 10; } catch {} }
        const bar = document.getElementById('levelBar');
        if (bar) bar.style.width = Math.min(100, ((idx - 1) / total) * 100) + '%';
        const label = document.getElementById('progressLabel');
        if (label) label.textContent = `Progresso ${idx - 1}/${total}`;
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) nextBtn.setAttribute('href', `#/text/${level}/${Math.min(total, idx + 1)}`);
      })();
    })
    .catch(() => {
      if (!linesEl || !linesEl.innerHTML || !linesEl.innerHTML.trim()) {
        linesEl.innerHTML = '<div class="small">Sem dados para este texto.</div>';
      }
    });

  document.getElementById('nextBtn').addEventListener('click', async () => {
    const prog = JSON.parse(localStorage.getItem('progress') || '{}');
    const map = {
      A1: ['/src/data/texts/A1/a1_blocks.json','./src/data/texts/A1/a1_blocks.json'],
      A2: ['/src/data/texts/A2/a2_blocks.json','./src/data/texts/A2/a2_blocks.json'],
      B1: ['/src/data/texts/B1/b1_blocks.json','./src/data/texts/B1/b1_blocks.json'],
      B2: ['/src/data/texts/B2/b2_blocks.json','./src/data/texts/B2/b2_blocks.json'],
      C1: ['/src/data/texts/C1/c1_blocks.json','./src/data/texts/C1/c1_blocks.json'],
      C2: ['/src/data/texts/C2/c2_blocks.json','./src/data/texts/C2/c2_blocks.json']
    };
    let total = 10;
    try { const r = await fetch(map[level][0]); if (r.ok) { const arr = await r.json(); total = Array.isArray(arr)? arr.length : 10; } } catch {}
    if (total === 10) { try { const r = await fetch(map[level][1]); const arr = await r.json(); total = Array.isArray(arr)? arr.length : 10; } catch {} }
    prog[level] = Math.min(total, idx + 1);
    prog.lastLevel = level;
    localStorage.setItem('progress', JSON.stringify(prog));
  });
}

window.addEventListener('hashchange', render);
window.addEventListener('load', render);

document.addEventListener('click', e => {
  const t = e.target;
  if (t && t.dataset && t.dataset.action === 'speak') {
    speak(t.dataset.text);
  }
  if (t && t.dataset && t.dataset.voice) {
    setSetting('voiceName', t.dataset.voice);
    render();
  }
  if (t && t.id === 'voiceBtn') {
    const menu = document.getElementById('voiceMenu');
    if (!menu) return;
    const list = (state.voices||[])
      .filter(v=>{ const lang = String(v.lang||'').toLowerCase(); return lang.startsWith('en-us') || lang.startsWith('en') })
      .sort((a,b)=>{
        const na = String(a.name||'');
        const nb = String(b.name||'');
        const pa = na.toLowerCase().includes('google us english') ? 0 : (/natural/i.test(na) ? 1 : (/premium|enhanced/i.test(na) ? 2 : 3));
        const pb = nb.toLowerCase().includes('google us english') ? 0 : (/natural/i.test(nb) ? 1 : (/premium|enhanced/i.test(nb) ? 2 : 3));
        if (pa!==pb) return pa-pb; return na.localeCompare(nb);
      });
    const items = list.map(v=>`
      <div class="selector" style="gap:6px">
        <div class="option ${v.name===state.voiceName?'active':''}" data-voice="${v.name}">${v.name} <span class="small">(${v.lang})</span></div>
        <button class="btn sm secondary" data-voice-test="${v.name}">Testar</button>
      </div>
    `).join('') || '<div class="small">Sem vozes em inglês disponíveis</div>';
    const refresh = '<div style="margin-top:6px"><button class="btn sm" data-voice-refresh="1">Atualizar vozes</button></div>';
    menu.innerHTML = items + refresh;
    menu.style.display = menu.style.display==='none' ? 'block' : 'none';
  }
  if (t && t.dataset && t.dataset.voiceTest) {
    const name = t.dataset.voiceTest;
    const v = state.voices.find(x=>x.name===name);
    if (v) {
      const u = new SpeechSynthesisUtterance('Testing voice. AgroEnglish Pro.');
      u.voice = v;
      u.rate = Number(localStorage.getItem('rate')||state.rate);
      u.pitch = Number(localStorage.getItem('pitch')||state.pitch);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  }
  if (t && t.dataset && t.dataset.voiceRefresh) {
    try { window.speechSynthesis.getVoices() } catch {}
    setTimeout(()=> render(), 300);
  }
  const menu = document.getElementById('voiceMenu');
  if (menu && menu.style.display==='block') {
    const within = t.id === 'voiceBtn' || t.closest('#voiceMenu');
    if (!within) menu.style.display = 'none';
  }
  if (t && t.dataset && t.dataset.action === 'toggle-theme') {
    const next = state.theme === 'light' ? 'dark' : 'light';
    setSetting('theme', next);
    document.documentElement.dataset.theme = next;
  }
  if (t && t.dataset && t.dataset.action === 'user-menu-toggle') {
    const menu = document.getElementById('userMenu');
    if (menu) { menu.style.display = menu.style.display==='none' ? 'block' : 'none'; }
  }
  if (t && t.dataset && t.dataset.action === 'signout') {
    if (window.userSignOut) { window.userSignOut(); }
  }
  const uMenu = document.getElementById('userMenu');
  const badgeBtn = document.getElementById('userBadgeBtn');
  if (uMenu && uMenu.style.display==='block' && t !== badgeBtn && !t.closest('#userMenu')) { uMenu.style.display='none'; }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js');
  });
}
  function renderVoiceSelector(){
    const el = document.getElementById('voiceSelector');
    if (!el) return;
    const list = (state.voices||[])
      .filter(v=>{ const lang=String(v.lang||'').toLowerCase(); return lang.startsWith('en') })
      .sort((a,b)=>{
        const na = String(a.name||'');
        const nb = String(b.name||'');
        const pa = na.toLowerCase().includes('google us english') ? 0 : (/natural/i.test(na) ? 1 : (/premium|enhanced/i.test(na) ? 2 : 3));
        const pb = nb.toLowerCase().includes('google us english') ? 0 : (/natural/i.test(nb) ? 1 : (/premium|enhanced/i.test(nb) ? 2 : 3));
        if (pa!==pb) return pa-pb; return na.localeCompare(nb);
      });
    const items = list.map(v=>`
      <div class="selector" style="gap:6px">
        <div class="option ${v.name===state.voiceName?'active':''}" data-voice="${v.name}">${v.name} <span class="small">(${v.lang})</span></div>
        <button class="btn sm secondary" data-voice-test="${v.name}">Testar</button>
      </div>
    `).join('') || '<div class="small">Sem vozes em inglês disponíveis neste dispositivo.</div>';
    const refresh = '<div style="margin-top:6px"><button class="btn sm" data-voice-refresh="1">Atualizar vozes</button></div>';
    el.innerHTML = items + refresh;
  }
