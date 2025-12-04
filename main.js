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
      const abbrev = (() => {
        // prevent split on common abbreviations (EN + PT)
        const m = cur.trim().match(/\b(Dr|Dra|Mr|Mrs|Ms|Prof|Profª|Sr|Sra|Srª|St|vs|etc)\.$/i);
        // also handle initials like "J." followed by surname: keep together
        const init = cur.trim().match(/\b[A-Z]\.$/);
        return !!(m || init);
      })();
      if (!isDecimal) {
        if (abbrev) {
          // do not split; continue accumulating until next punctuation
        } else {
          let j = i + 1;
          while (j < s.length && /\s/.test(s[j])) { cur += s[j]; i = j; j++; }
          out.push(cur.trim());
          cur = '';
        }
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
  const auxIdx = words.findIndex(w=>{ const t=w.replace(/[.,!?;:]+$/,''); if (/^(AM|PM)$/i.test(t)) return false; return /^(do|does|don't|doesn't|did|will|can|should|must|may|is|are|am)$/i.test(t); });
  let subjStart = 0;
  let subjLen = 1;
  if (auxIdx===0) { subjStart = 1; }
  const candidate = words[subjStart]||'';
  if (/^the$/i.test(candidate)) {
    const adj = (words[subjStart+1]||'').toLowerCase();
    const noun = words[subjStart+2];
    const isAdj = /^(small|big|young|old|green|strong|healthy|safe|white|brown|black)$/i.test(adj);
    if (isAdj && noun) subjLen = 3; else if (words.length>=subjStart+2) subjLen = 2;
  } else if (/^(sprayer calibration|veterinary biosecurity|canadian winter|the tractor|the soil)/i.test(firstTwo)) subjLen = 2;
  let verbIdx = subjStart+subjLen;
  let verb = words[verbIdx]||'';
  if (auxIdx>=0){
    const auxWord = words[auxIdx].replace(/[.,!?;:]+$/,'');
    if (/^(is|are|am)$/i.test(auxWord)) { verbIdx = auxIdx; verb = auxWord; }
    else { const cand = Math.max(auxIdx+1, subjStart+subjLen); verbIdx = Math.min(cand, words.length-1); verb = (words[verbIdx]||'').replace(/[.,!?;:]+$/,''); }
  } else {
    verb = (words[verbIdx]||'').replace(/[.,!?;:]+$/,'');
  }
  const subject = words.slice(subjStart, subjStart+subjLen).join(' ');
  const complement = words.slice(verbIdx+1).join(' ');
  return { subject, verb, complement };
}

function svcExplain(en){
  const p = parseSVC(en);
  const comp = p.complement ? p.complement : '-';
  const aux = findAux(en);
  const isBe = aux && /^(is|are|am)$/i.test(aux.base);
  if (aux && !isBe) {
    return `<div class="small" style="margin-top:4px">Auxiliar: <strong>${aux.base}</strong> | Sujeito: <strong>${p.subject}</strong> | Verbo: <strong>${p.verb}</strong> | Complemento: <strong>${comp}</strong></div>`;
  }
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
  const idx = words.findIndex(w=>{ const t=w.replace(/[.,!?;:]+$/,''); if (/^(AM|PM)$/i.test(t)) return false; return /^(do|does|did|will|can|should|must|may|don't|doesn't|didn't|is|are|am)$/i.test(t); });
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
  const levelTagNow = (location.hash.split('/')[2]||'').toUpperCase();
  const curIdxNow = Number((location.hash.split('/')[3]||'1'));
  const isA1Lesson1 = (levelTagNow==='A1' && curIdxNow===1);
  const isQ = /\?\s*$/.test(String(en||''));
  const isBeAux = aux && /^(is|are|am)$/i.test(aux.base);
  const steps = (isA1Lesson1)
    ? (isQ && isBeAux
        ? [`<div>Passo 1: Ache o verbo → <strong>${aux.base}</strong></div>`,`<div style="margin-top:4px">Passo 2: Mova para o início</div>`,`<div style="margin-top:4px">Passo 3: Adicione a interrogação</div>`].join('')
        : (function(){ const passo2 = `<div style="margin-top:4px">Passo 2: Verbo → <strong>${isBeAux?aux.base:p.verb}</strong></div>`; return [`<div>Passo 1: Sujeito → <strong>${p.subject}</strong></div>`, passo2, `<div style="margin-top:4px">Passo 3: Complemento → <strong>${p.complement||'-'}</strong></div>`].join('') })()
      )
    : (function(){ const passo2 = aux ? `<div style="margin-top:4px">Passo 2: Auxiliar → <span class="${aux.cls}">${aux.base}</span> + Verbo → ${colorVerbToken(p.verb)}</div>` : `<div style="margin-top:4px">Passo 2: Verbo → ${colorVerbToken(p.verb)}</div>`; return [`<div>Passo 1: Sujeito → <strong>${p.subject}</strong></div>`, passo2, `<div style="margin-top:4px">Passo 3: Complemento → <strong>${p.complement||'-'}</strong></div>`].join('') })();
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
      if (tab==='practice') {
        try { if (window.ExercisePageMount) window.ExercisePageMount(level, idx, data); } catch {}
      }
    }
    if (btnStudy) btnStudy.addEventListener('click', ()=> showTab('study'));
    if (btnPractice) btnPractice.addEventListener('click', ()=> showTab('practice'));
    if (btnSpeech) btnSpeech.addEventListener('click', ()=> showTab('speech'));
    const routeKey = `textRoute:${String(level).toUpperCase()}:${String(idx)}`;
    const visited = (function(){ try { return sessionStorage.getItem(routeKey) } catch { return null } })();
    const initialTab = visited ? (localStorage.getItem('lastTab') || 'study') : 'study';
    showTab(initialTab);
    try { sessionStorage.setItem(routeKey, '1') } catch {}

    document.querySelector('#toggleTr').addEventListener('click', () => {
      linesEl.classList.toggle('hide-pt');
    });
  }

function renderVocabulary(data) {
  const vocabEl = document.querySelector('#vocab');
  const levelTag = (location.hash.split('/')[2]||'').toUpperCase();
  const curIdx = Number((location.hash.split('/')[3]||'1'));
  if (levelTag==='A1' && curIdx===1) {
    vocabEl.innerHTML = `
      <div class="card">
        <ul>
          <li><strong>Farmer:</strong> Fazendeiro</li>
          <li><strong>Barn:</strong> Celeiro/Galpão</li>
          <li><strong>Cows:</strong> Vacas</li>
          <li><strong>Wind:</strong> Vento</li>
          <li><strong>Ready:</strong> Pronto</li>
          <li><strong>Happy:</strong> Feliz</li>
        </ul>
      </div>
    `;
    return;
  }
  if (levelTag==='A1' && curIdx===2) {
    vocabEl.innerHTML = `
      <div class="card">
        <ul>
          <li><strong>Livestock:</strong> Pecuária/Gado</li>
          <li><strong>Bull:</strong> Touro</li>
          <li><strong>Injury:</strong> Lesão</li>
          <li><strong>Veterinarian:</strong> Veterinária</li>
          <li><strong>Medical kit:</strong> Kit médico</li>
          <li><strong>Medicine:</strong> Remédio</li>
          <li><strong>Body:</strong> Corpo</li>
          <li><strong>Leg:</strong> Perna</li>
          <li><strong>Safe:</strong> Seguro</li>
          <li><strong>Healthy:</strong> Saudável</li>
        </ul>
      </div>
    `;
    return;
  }
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

  function toPhoneticBR(str){
    const dict = {
      'farmer':'fármer','farm':'fárm','sister':'sístâr','barn':'bárn','cows':'cáuz','chickens':'tchí-kens','sun':'sãn','wind':'uínd','happy':'répi','big':'bíg','fast':'fést','funny':'fâni','ready':'rédi','day':'dêi','open':'óupen','hot':'hót','strong':'stróng',
      'livestock':'láiv-stók','veterinarian':'vé-te-ri-né-ri-en','bull':'búl','medical kit':'mé-dicol quít','injury':'ín-djuri','medicine':'mé-di-sin','body':'bó-di','leg':'lég','healthy':'hél-fi',
      'start':'stárt','walk':'uólk','eat':'ít','drink':'drínk','check':'tchék','feed':'fíid','need':'níid','pasture':'péstcher','calf':'káf','water tanks':'uóter ténks','corn':'córn','farm worker':'fárm uârkâr','grass':'grés','pigs':'pígz',
      'tractor':'tráktor','harvester':'hár-vis-târ','machine':'mâ-xín','shed':'shéd','soybeans':'sói-bíns','field':'fíld','soil':'sóil','seeds':'síidz','harvest season':'hár-vest sí-zân','humid':'híu-mid','dry':'drái','heavy':'hé-vi','drive':'dráiv','plant':'plánt','work':'uârk','brother':'brâthâr',
      'weather':'ué-dâr','rain':'rêin','raining':'rêi-ning','clouds':'cláudz','sky':'skái','soybean field':'sói-bín fíld','depends on':'di-péndz ón','dark':'dárk','water':'uóter','how many':'ráu mé-ni','there is':'dér íz','there are':'dér ár','only':'óun-li','more':'mór','bags of corn':'bégs óv córn','bag':'bég','inventory':'ín-ven-tó-ri','salt':'sólt','cattle':'ké-tôl','one':'uãn','five':'fáiv','ten':'tén','twenty':'twén-ti','horses':'hórsiz','tractors':'tráktôrz',
      'where':'uéâr','in':'ín','on':'ón','under':'ândâr','next to':'nékst tú','behind':'biháind','shovel':'xó-vôl','hammer':'ré-mâr','buckets':'bâkits','tap':'tép','wood table':'úd téi-bol','organization':'ór-ga-né-zêi-xân','right place':'ráit plêis',
      'safety':'sêi-f-ti','signs':'sáinz','wear':'uér','boots':'búts','gloves':'glâvz','stop':'stóp','electric fence':'iléktrik fêns','dangerous':'dên-dja-râs','smoke':'smóuk','wash':'uóx','hands':'hêndz','soap':'sôup','be careful':'bî kér-fôl','please':'plíiz',
      'repairing':'ri-pér-ing','fixing':'fíks-ing','cleaning':'clí-nin','waiting':'uêi-tin','moving':'mú-vin','engine':'énd-jin','milking machine':'mílk-ing mâ-xín','now':'náu','at this moment':'ét dís mô-ment','shade':'xêid',
      'can':'kén','cannot':'ké-not','operate':'ó-pe-reit','pull':'púl','help':'hélp','do':'dú','license':'lái-sens','trailer':'trêi-lâr','tons':'tânz','pickup truck':'pík-âp trúk','red':'réd','large':'lárdj','together':'tugé-thâr',
      'will':'uíl','tomorrow':'tô-mó-rôu','week':'uíik','monday':'mân-dêi','tuesday':'tiúz-dêi','friday':'frái-dêi','arrive':'â-ráiv','load':'lôud','sell':'sél','grain':'grêin','silos':'sái-lôus','mechanic':'mê-ké-nik','sunny':'sâ-ni','production':'prô-dâk-chan','busy':'bí-zi','trucks':'trâks',
      'price':'práis','cost':'cóst','money':'mâ-ni','profit':'pró-fit','inputs':'ín-púts','cooperative':'co-ó-pe-ra-tiv','market':'már-ket','buyer':'báier','buy':'bái','cheap':'tchíp','expensive':'éks-pén-siv','pay':'pêi','ton':'tân','dollars':'dó-lârz','how much':'ráu mâch'
      ,
      'yesterday':'iés-târ-dêi','last night':'lást náit','cold':'cóuld','rainy':'rêi-ni','muddy':'mâ-di','difficult':'dí-fi-cúlt','because':'bi-cóz','tired':'táierd','broken':'brôu-kân','garage':'gâ-ráj','vet':'vét'
      ,
          'worked':'uârk-t','started':'stár-ted','checked':'tchékt','cleaned':'clíind','repaired':'ri-pérd','stopped':'stópt','finished':'fí-ni-sht','then':'dén','in the afternoon':'ín di áf-târ-nún','late':'lêit','tractor cab':'tráktor kéb','fence line':'fêns láin','organized':'ór-ga-náizd'
          ,
          'go':'gôu','went':'uént','see':'sí','saw':'só','break':'brêik','broke':'brôuk','have':'rév','had':'réd','take':'têik','took':'túk','drive':'dráiv','drove':'drôuv','buy':'bái','bought':'bót','come':'kâm','came':'keim','spare':'spér','part':'párt','main':'mein','belt':'bélt','store':'stór','suddenly':'sâ-dâ-nli','pickup':'pík-âp','city':'sí-ri','corn':'córn','field':'fíld'
          ,
          'did':'díd','didn\'t':'dídânt','cattle':'ké-tôl','brush':'brâsh','fever':'fí-vâr','find':'fáind','yet':'yét','horse':'hórs','sick':'sík','tank':'ténk'
          ,
          'herd':'hârd','genetics':'djê-né-tiks','heavier':'hé-viâr','calmer':'cáu-mâr','bigger':'bí-gâr','stronger':'strón-gâr','more':'mór','expensive':'éks-pén-siv','better':'bé-târ','choose':'tchúuz','than':'thén','however':'ráu-évâr','black':'blék','white':'uáit','bull':'búl','strong':'stróng','heavy':'hé-vi','calm':'cám','big':'bíg','good':'gud'
          ,
          'newest':'nú-est','most':'móst','modern':'mó-dârn','strongest':'strón-gest','best':'bést','important':'im-pór-tânt','gps':'djí-pi-és','autopilot':'óu-to-pái-lôt','stumps':'stâmps','pulling':'púl-ing','repair':'ri-pér','parts':'párts','green':'grín','old':'ôuld','red':'réd','tractor':'tráktor'
          ,
          'supplies':'sû-pláis','diesel':'dí-zel','fuel':'fiúl','liters':'lí-târz','bags':'bégz','seeds':'síidz','a':'a','lot':'lór','of':'óv','enough':'enóf','left':'léft','chemical':'ké-mi-col','mix':'míks','many':'mé-ni'
          ,
          'must':'mâst','should':'xúd','mandatory':'mán-de-tó-ri','prohibited':'pro-hí-bi-ted','hydrated':'rái-drêi-ted','dizzy':'dí-zi','protect':'prô-tékt','chemicals':'ké-mi-cols','glasses':'glá-siz','fuel':'fiúl','tanks':'ténks','hot':'hót','hat':'rét','sun':'sân','immediately':'i-mí-di-ét-li','every':'évri','hour':'áu-âr'
          ,
          'always':'ól-uêiz','usually':'iú-ju-li','sometimes':'sâm-táims','rarely':'réar-li','never':'né-vâr','maintenance':'mêin-tê-nâns','schedule':'ské-dju-l','oil':'óiol','level':'lé-vol','air':'ér','filters':'fíltârz','tires':'táiârz','dashboard':'déch-bórd','warning':'uór-ning','light':'láit','consistency':'cón-sis-ten-si'
          ,
          'so':'sôu','dropped':'drópt','stressed':'strést','thirsty':'thâr-sti','essential':'i-sên-xial','return to normal':'ri-târn tú nór-mol'
          ,
          'going':'gôu-ing','going to':'gôu-ing tú','vaccination':'vék-si-néi-chân','cattle chute':'ké-tôl xút','needles':'ní-dôlz','cooler':'cú-lâr','separate':'sé-pâ-reit'
          ,
          'experience':'éks-pí-ri-êns','hard worker':'hárd uârkâr','honest':'ó-nest','gps systems':'djí-pi-és sís-temz','heavy trucks':'hé-vi trâks','i want to':'ái uónt tú'
          ,
          'warning light':'uór-ning láit','shut off':'xât óf','cooling system':'cú-lin sís-tem','leak':'lík','emergency stop':'i-mârd-jen-si stóp','protective gloves':'prô-ték-tiv glâvz'
          ,
          'turns on':'târns ón','overheats':'óuvâr-ríts','cool down':'cúl dáun','strange noise':'strêindj nóiz','protocols':'pró-to-cols'
          ,
          'budget':'bâ-djêt','upgrades':'âp-grêidz','solar energy':'sô-lâr é-ne-rji','rose':'rôuz','monitoring':'mó-ni-tâ-ring','would':'úd'
          ,
          'used to':'iúzd tú','didn\'t use to':'dídnt iúz tú','milk by hand':'mílk bai hénd','ac':'êi-sí','air conditioning':'ér con-di-xô-ning','straight lines':'strêit láinz','efficiency':'ê-fí-xian-si','owner':'ôu-nâr','robots':'rôu-bóts'
          ,
          'milking parlor':'míul-kin párlâr','udders':'â-dârz','iodine':'áiô-dáin','stainless steel':'stêin-lês stíl','samples':'sém-plz','dairy cooperative':'déi-ri cô-uó-pâ-râ-tiv','brought':'brót','cleaned':'clínd','collected':'co-léc-ted','cooled':'cúld','sent':'sént','sold':'sôuld','maintained':'mein-têind'
          ,
          'logbook':'lóg-búk','service':'sér-vis','harvester':'hár-ves-târ','engine oil':'ên-djin ói-ol','air filters':'ér fíltârz','tires':'táiârz','hydraulic system':'rai-dró-lik sís-tem','done':'dân','changed':'tchéindjd','replaced':'ri-plêi-st','inspected':'in-spék-ted','tested':'tés-ted','solved':'sólv-d','returned':'ri-târn-d'
          ,
          'who':'rú','which':'uí-tch','that':'dét','tag':'tég','shelf':'xélf','virus':'váirâs','vacation':'vêi-кêi-xân','critical':'crí-ti-col'
          ,
          'operated':'ó-pe-rei-ted','worked':'uârk-t','visited':'ví-zi-ted','seen':'sín','learned':'lârn-d','education':'é-dju-cêi-xân','john deere':'djón dír','angus':'éngâs','nelore':'ne-ló-ri','usa':'iú-é-sêi'
          ,
          'already':'ól-ré-di','just':'djâst','supplier':'sâ-plái-âr','entered':'ên-târd','gate':'gêit','half':'háf','called':'cól-d','arrived':'â-ráivd','fuel truck':'fiúl trâk'
          ,
          'reliable':'ri-lái-â-bol','dust':'dâst','built':'bílt','history':'rís-tô-ri','for':'fór','since':'sins'
          ,
          'uncertainty':'ân-sâr-ten-ti','damage':'dá-mêdj','stalks':'stóks','unstable':'ân-stêi-bol','yield':'í-ild','scenario':'si-né-ri-ôu','might':'máit','could':'cúd','storm':'stórm'
          ,
          'progress':'pró-gres','speed up':'spíid âp','brakes':'brêiks','meeting':'míi-ting','said':'séd','told':'tóuld'
          ,
          'ready to go':'ré-di tú gôu','leaks':'líks','floor':'flór','hope':'hôup','operator':'óu-pe-rêi-târ','map':'mép'
          ,
          'tillage':'tí-lêdj','no-till farming':'nôu-tíl fár-min','soil erosion':'sóil i-rôu-jan','moisture retention':'móis-tchâr ri-tén-xân','undeniable':'ân-di-nái-a-bol','transition':'trán-zí-xân'
          ,
          'outsource':'áut-sórs','contractor':'cón-trék-tôr','ensure':'ên-xûr','serviced':'sér-vis-t'
          ,
          'cornerstone':'cór-nâr-stôn','marbling':'már-blin','hereditary':'ri-ré-di-téri','mitigate':'mí-ti-gueit','traits':'trêits','genome':'djí-nôm'
          ,
          'roof':'rúf','painted':'pêin-ted','installed':'íns-tóld','reports':'ri-pórts'
          ,
          'irrigation logs':'i-rri-gêi-xân lógs','mild':'máiold','nutrient deficiency':'nú-tri-ent di-fí-xen-si','growth stage':'grôuth stêidj','roots':'rúts','nitrogen':'nái-tro-djén','fungus':'fân-gâs','underground':'ân-dâr-gráund','stolen':'stôu-lân'
          ,
          'tight schedule':'táit skéd-jul','weather holds':'ué-dâr rôulds','noon':'núun','goals':'gôuls','by':'bái','finished':'fí-nisht','upgraded':'âp-grêi-did','implemented':'ím-ple-mén-tid'
          ,
          'cargo':'cár-gôu','delay':'di-lêi','invoice':'ín-vóiss','approved':'â-prúvd','regarding':'ri-gár-din'
          ,
          'break down':'brêik dáun','put off':'pút óf','look into':'lúk ín-tú','carry out':'ké-ri áut','run out of':'rân áut óv','keep up':'kíp âp','hydraulic pump':'rai-dró-lik pâmp','valves':'vélvz','hydraulic fluid':'rai-dró-lik flú-id','schedule':'ské-dju-l'
          ,
          'inventory':'in-vén-tô-ri','forklift':'fórk-líft','insurance':'in-xú-râns','pests':'pésts','accounting':'a-cáun-tin'
          ,
          'rust':'râst','fungicide':'fân-ji-sáid','delayed':'di-lêid','forecast':'fór-cást','profit':'pró-fit','acted':'ék-tid','would have':'wú-dav','would\'ve':'wú-dav','hadn\'t':'réd-nt'
          ,
          'bulk':'bâlk','upfront':'âp-frônt','payment terms':'pêi-mênt târms','net 30':'nét thâ-rí-di','premium':'prí-mi-am','discount':'dís-cáunt','reduction':'ri-dâk-xân','meet halfway':'mít réf-uêi','deal':'díal','work something out':'uârk sâm-thin áut','over budget':'ôu-vâr bâ-djit'
          ,
          'meeting minutes':'mí-tin mín-nâts','shift':'shíft','release the budget':'ri-lís dê bân-djit','postpone':'pós-pôun'
          ,
          'contamination':'côn-tâ-mi-nêi-xân','leak':'lík','circumstances':'sâr-câm-stên-siz','prevented':'pri-vén-tid','protocol':'prô-tô-cól','incident':'ín-si-dênt','extinguished':'êks-tín-güisht','valve':'vélv','water supply':'uó-ter sâ-plái','closed':'clôuzd'
          ,
          'strategic investment':'stra-tí-djik in-vés-ti-mên','efficiency':'ê-fí-xan-si','ROI':'ár-ôu-áí','pay for itself':'pêi fór it-sélf','competitive edge':'com-pé-ti-tiv édj','recommend':'ré-co-ménd','propose':'prô-pôuz','analyze':'é-na-láiz','furthermore':'fâr-dâr-mór','consequently':'cón-si-quent-li','electricity bills':'e-lék-trí-si ti bîls','therefore':'dér-fór'
        };
    const w = String(str||'').toLowerCase();
    if (dict[w]) return dict[w];
    let t = String(str||'');
    t = t.replace(/tion\b/i,'tchân').replace(/ing\b/i,'ín').replace(/^th/i,'d').replace(/oo/i,'ú').replace(/ea/i,'í').replace(/ar/i,'ár').replace(/er\b/i,'âr').replace(/ai/i,'ei');
    return t;
  }

  function renderVocabTable(data){
    const el = document.getElementById('vocabTable'); if(!el) return;
    const list = Array.isArray(data.vocabulary_table) ? data.vocabulary_table : [];
    if (!list.length) { el.innerHTML = '<div class="small">Sem vocabulário listado.</div>'; return; }
    const rows = list.map(v=> `<tr><td>${v.word}</td><td>${v.translation}</td><td>${toPhoneticBR(v.word)}</td></tr>`).join('');
    el.innerHTML = `
      <table style="width:100%;border-collapse:collapse">
        <thead><tr><th style="text-align:left">EN</th><th style="text-align:left">PT</th><th style="text-align:left">Pronúncia (BR)</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

function renderGrammar(data) {
    const el = document.querySelector('#grammar');
    if (!el) return;
    const pairs = (Array.isArray(data.pairs) && data.pairs.length) ? data.pairs : [];
    const sentences = pairs.length ? pairs.map(p=>({en:p.en, pt:fixPT(p.pt)})) : String(data.text||'').split(/(?<=[.!?])\s+/).map((s,i)=>({en:s, pt:String(data.translation||'').split(/(?<=[.!?])\s+/).map(fixPT)[i]||''}));
    const gRaw = String(data.grammar||'');
    const levelTag = (location.hash.split('/')[2]||'').toUpperCase();
    const curIdx = Number((location.hash.split('/')[3]||'1'));
    const gHead = (levelTag==='A1' && curIdx===1) ? 'Present simple with farm routines.' : (gRaw || '');
  function explainForBeginners(v){
    const levelTagNow = (location.hash.split('/')[2]||'').toUpperCase();
    const curIdxNow = Number((location.hash.split('/')[3]||'1'));
    const isA1BeMode = (levelTagNow==='A1' && curIdxNow===1);
    const isA1HaveModeNow = (levelTagNow==='A1' && curIdxNow===2);
    const coreBe = `<div style=\"margin-top:6px\"><strong>O que é:</strong> O Verbo To Be significa <em>ser</em> ou <em>estar</em>. Ele é especial e <strong>não usa</strong> auxiliares como <em>Do</em> ou <em>Don't</em>. Ele muda de forma sozinho: I <span style=\"color:#1e40af;font-weight:bold;\">am</span> · You <span style=\"color:#1e40af;font-weight:bold;\">are</span> · He/She/It <span style=\"color:#1e40af;font-weight:bold;\">is</span> · We/You/They <span style=\"color:#1e40af;font-weight:bold;\">are</span>.</div>`;
    const coreHave = `<div style=\"margin-top:6px\"><strong>O que é:</strong> O Verbo <em>To Have</em> significa <strong>ter</strong> (posse) ou expressar <strong>características</strong> físicas. <strong>Regra:</strong> <span style=\"color:#1e40af;font-weight:bold;\">have</span> com I/You/We/They · <span style=\"color:#1e40af;font-weight:bold;\">has</span> com He/She/It.</div>`;
    const defaultPS = `<div style=\"margin-top:6px\"><strong>O que é:</strong> verbo é ação do dia a dia. Use forma base com <em>I/You/We/They</em>. Em <em>He/She/It</em> acrescente <span class=\"grammar-suffix\">s/es</span>.</div>`;
    return `
      <div class=\"card\">
        <div class=\"small\">
          <div><strong>Explicação:</strong> ${v}</div>
          ${isA1BeMode ? coreBe : (isA1HaveModeNow ? coreHave : defaultPS)}
          ${isA1BeMode ? `<div style=\"margin-top:6px\"><strong>Verbo to be:</strong> <span style=\"color:#1e40af;font-weight:bold;\">am</span>/<span style=\"color:#1e40af;font-weight:bold;\">is</span>/<span style=\"color:#1e40af;font-weight:bold;\">are</span> para estado, localização e identificação. Afirmativa: I <span style=\"color:#1e40af;font-weight:bold;\">am</span>, He/She/It <span style=\"color:#1e40af;font-weight:bold;\">is</span>, We/You/They <span style=\"color:#1e40af;font-weight:bold;\">are</span>. Negativa: <span style=\"color:#1e40af;font-weight:bold;\">am</span> <span style=\"color:#dc2626;font-weight:bold;\">not</span> / <span style=\"color:#1e40af;font-weight:bold;\">is</span> <span style=\"color:#dc2626;font-weight:bold;\">not</span> / <span style=\"color:#1e40af;font-weight:bold;\">are</span> <span style=\"color:#dc2626;font-weight:bold;\">not</span>. Pergunta: <span style=\"color:#1e40af;font-weight:bold;\">Am</span> I...<span style=\"color:#dc2626;font-weight:bold;\">?</span> · <span style=\"color:#1e40af;font-weight:bold;\">Is</span> he...<span style=\"color:#dc2626;font-weight:bold;\">?</span> · <span style=\"color:#1e40af;font-weight:bold;\">Are</span> they...<span style=\"color:#dc2626;font-weight:bold;\">?</span></div>` : ''}
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
      if (/^(the|a|an|my|your|his|her|our|their|this|that|these|those)$/i.test(words[0]) && words.length>=2) {
        const adj = (words[1]||'').toLowerCase();
        const noun = words[2];
        const isAdj = /^(small|big|young|old|green|strong|healthy|safe|white|brown|black)$/i.test(adj);
        subject = (isAdj && noun) ? (words[0]+' '+words[1]+' '+words[2]) : (words[0]+' '+words[1]);
      }
      else if (/^(sprayer calibration|veterinary biosecurity|canadian winter)/i.test(firstTwo)) subject = firstTwo;
      else subject = words[0];
      const subjEsc = subject.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      let rest = clean.replace(new RegExp('^'+subjEsc+'\\s+'),'');
      let v = (rest.split(/\s+/)[0]||'').toLowerCase();
      const subjLower = subject.toLowerCase();
      const secondWord = (subject.split(/\s+/)[1]||'').toLowerCase();
      const pluralPronoun = /^(we|you|they)\b/.test(subjLower);
      const pluralNoun = /\b(cows|animals|tools|buckets|hammers|calves|people|children|workers|hands)\b/.test(secondWord) || /s$/.test(secondWord);
      const isThird = !pluralPronoun && !pluralNoun && ( /^(he|she|it)\b/.test(subjLower) || /^the\s/.test(subjLower) || /^(sprayer calibration|veterinary biosecurity|canadian winter)/i.test(subject) );
      if (v==='is'){
        const tail = rest.replace(/^is\s+/i,'');
        return { affirmative: clean, negative: subject+' is not '+tail, interrogative: 'Is '+subject+' '+tail+'?' };
      }
      if (v==='am'){
        const tail = rest.replace(/^am\s+/i,'');
        return { affirmative: clean, negative: subject+' am not '+tail, interrogative: 'Am '+subject+' '+tail+'?' };
      }
      if (v==='are'){
        const tail = rest.replace(/^are\s+/i,'');
        return { affirmative: clean, negative: subject+' are not '+tail, interrogative: 'Are '+subject+' '+tail+'?' };
      }
      function baseVerb(w){
        if (/^has$/i.test(w)) return 'have';
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
    const baseSample = (levelTag==='A1' && curIdx===1)
      ? (groupBe[0] || { en: 'I am Paul.', pt: 'Eu sou Paul.' })
      : (groupI[0] || groupWe[0] || sentences[0] || { en: 'I work on the farm.', pt: 'Eu trabalho na fazenda.' });
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
    function colorBeTokens(t){
      let s = String(t||'');
      s = s.replace(/\b(am|is|are|have|has)\b/gi, (m)=>`<span class="verb verb-base">${m}</span>`);
      s = s.replace(/\bnot\b/gi, `<span class="grammar-neg">not</span>`);
      s = s.replace(/\?$/,'<span class="grammar-neg">?</span>');
      return s;
    }
    const beAffRows = groupBe.map(s=>({ en: annotateTextManual(s.en), pt: fixPT(s.pt||'') }));
    const beNegRows = groupBe.map(s=>({ en: annotateTextManual(beNegLine(s.en)), pt: ptNeg(s.pt||'') }));
    const beQRows = groupBe.map(s=>({ en: annotateTextManual(beQuestionLine(s.en)), pt: ptQ(s.pt||'') }));
    function beTable(a,b,c){ return `
      <table style="width:100%;border-collapse:collapse">
        <thead><tr><th style="text-align:left;color:#15803d">Afirmativa</th><th style="text-align:left">Negativa</th><th style="text-align:left">Pergunta</th></tr></thead>
        <tbody>
          ${a.map((x,i)=>`<tr><td class="sent-aff">${colorBeTokens(x.en)}${svcExplain(x.en)}</td><td class="sent-neg">${colorBeTokens(b[i].en)}${svcExplain(b[i].en)}</td><td class="sent-q">${colorBeTokens(c[i].en)}${svcExplain(c[i].en)}</td></tr>`).join('')}
        </tbody>
      </table>
    ` }
    const levelTag2 = (location.hash.split('/')[2]||'').toUpperCase();
    const curIdx2 = Number((location.hash.split('/')[3]||'1'));
    const isA1BeMode = (levelTag2==='A1' && curIdx2===1);
    const isA1HaveMode = (levelTag2==='A1' && curIdx2===2);
    const isA1PSMode = (levelTag2==='A1' && curIdx2===3);
    const isA1AdjMode = (levelTag2==='A1' && curIdx2===4);
    const isA1ClimateMode = (levelTag2==='A1' && curIdx2===5);
    const affCard = (aff.length && !(isA1BeMode||isA1HaveMode)) ? `<div class=\"card\"><div class=\"small\"><strong>Afirmativa</strong></div>${aff.slice(0,3).map(lineHtml).join('')}</div>` : '';
    const negCard = (negs.length && !(isA1BeMode||isA1HaveMode)) ? `<div class=\"card\"><div class=\"small\"><strong>Negativa</strong></div>${negs.slice(0,3).map(lineHtml).join('')}</div>` : '';
    const qCard = (quess.length && !(isA1BeMode||isA1HaveMode)) ? `<div class=\"card\"><div class=\"small\"><strong>Pergunta</strong></div>${quess.slice(0,3).map(lineHtml).join('')}</div>` : '';
    const whenCards = [affCard, negCard, qCard].filter(Boolean);
    const whenList = whenCards.join('');
    const guidedSamples = [baseSample, qLine, negLine].filter(Boolean);
    const guidedList = guidedSamples.map(s=> guidedCard(s.en, s.pt)).join('');
    const beSection = groupBe.length ? (`
      <div class="section-title" style="margin-top:12px">Verb to be (A1)</div>
      ${beTable(beAffRows, beNegRows, beQRows)}
    `) : '';
    function beTableTarget(){
      function norm(x){ return String(x||'').trim().replace(/[.!?]+$/,'').toLowerCase(); }
      const find = (t)=> sentences.find(s=> norm(s.en) === norm(t)) || null;
      const b1 = find('The barn is open');
      const w1 = { en: 'We are ready', pt: '' };
      const s1 = find('She is happy');
      const affs = [ b1 ? { en:b1.en, pt:b1.pt } : { en:'The barn is open.', pt:'' }, w1, s1 ? { en:s1.en, pt:s1.pt } : { en:'She is happy.', pt:'' } ];
      const negs2 = affs.map(x=>({ en: beNegLine(x.en), pt: '' }));
      const qs2 = affs.map(x=>({ en: beQuestionLine(x.en), pt: '' }));
      return beTable(affs, negs2, qs2);
    }
    function haveTableTarget(){
      const affs = [
        { en: 'The bull has a strong body', pt: '' },
        { en: 'We have safe animals', pt: '' }
      ];
      function haveNegLine(en){
        const t = String(en||'');
        const lower = t.toLowerCase();
        const isPlural = /^\s*we\b/.test(lower) || /^\s*they\b/.test(lower) || /^\s*the\s+.+s\b/.test(lower) || /\b(cows|animals|calves|people|children|workers|hands)\b/.test(lower);
        if (/has\s+/i.test(t)) return t.replace(/^\s*(.+?)\s+has\s+/i, `$1 ${isPlural?"don't":"doesn't"} have `);
        return t.replace(/^\s*(.+?)\s+have\s+/i, `$1 ${isPlural?"don't":"doesn't"} have `);
      }
      function haveQuestionLine(en){
        const t = String(en||'');
        const lower = t.toLowerCase();
        const isPlural = /^\s*we\b/.test(lower) || /^\s*they\b/.test(lower) || /^\s*the\s+.+s\b/.test(lower) || /\b(cows|animals|calves|people|children|workers|hands)\b/.test(lower);
        const aux = isPlural ? 'Do ' : 'Does ';
        if (/has\s+/i.test(t)) return aux + t.replace(/^\s*(.+?)\s+has\s+/i,'$1 have ') + '?';
        return aux + t.replace(/^\s*(.+?)\s+have\s+/i,'$1 have ') + '?';
      }
      const b = affs.map(x=>({ en: haveNegLine(x.en), pt: '' }));
      const c = affs.map(x=>({ en: haveQuestionLine(x.en), pt: '' }));
      return table3(affs, b, c);
    }
    const formaUso = data.forma_uso || null;
    const goldenTip = String(data.golden_tip||'').trim();
    const summaryMap = Array.isArray(data.summary_map) ? data.summary_map : [];
    let formaUsoHtml = '';
    if (formaUso) {
      function block(b){ if(!b) return ''; const exs = Array.isArray(b.examples)? b.examples.slice(0,3):[]; return `<div class=\"card\"><div class=\"small\"><strong>${b.title||''}</strong> ${b.explain||''}<div style=\"margin-top:6px\">${exs.map(x=>`<div>${x}</div>`).join('')}</div></div></div>` }
      const fuTitle = isA1HaveMode ? 'Forma e Uso · To Have' : 'Forma e Uso · To Be';
      formaUsoHtml = `
        <div class=\"section-title\" style=\"margin-top:12px\">${fuTitle}</div>
        ${block(formaUso.identity)}
        ${block(formaUso.location)}
        ${block(formaUso.description)}
      `;
    }
  const tipHtml = goldenTip ? `<div class=\"card\" style=\"margin-top:8px\"><div class=\"small\"><strong>Dica de Ouro:</strong> ${goldenTip}</div></div>` : '';
  const summaryHtml = summaryMap.length ? (`
      <div class=\"section-title\" style=\"margin-top:12px\">Tabela Resumo</div>
      <table style=\"width:100%;border-collapse:collapse\">
        <thead><tr><th style=\"text-align:left\">Pessoa</th><th style=\"text-align:left\">Verbo</th></tr></thead>
        <tbody>
          ${summaryMap.map(r=>`<tr><td>${r.person}</td><td>${r.verb}</td></tr>`).join('')}
        </tbody>
      </table>
    `) : '';
    const expEstruturaHtml = isA1BeMode ? `
      <div class=\"section-title\" style=\"margin-top:12px\">Explicação e Estrutura</div>
      <div class=\"card\"><div class=\"small\">
        <h3>1. O Verbo To Be (Ser/Estar)</h3>
        <p>Neste texto, o verbo To Be é usado de 3 formas principais:</p>
        <ul>
          <li><strong>Identidade (Quem é):</strong> \"I <span style=\"color:#1e40af;font-weight:bold;\">am</span> Paul\", \"I <span style=\"color:#1e40af;font-weight:bold;\">am</span> a farmer\".</li>
          <li><strong>Localização (Onde está):</strong> \"I <span style=\"color:#1e40af;font-weight:bold;\">am</span> at the farm\", \"My sister <span style=\"color:#1e40af;font-weight:bold;\">is</span> here\".</li>
          <li><strong>Descrição (Como é/está):</strong> \"The barn <span style=\"color:#1e40af;font-weight:bold;\">is</span> open\", \"The cows <span style=\"color:#1e40af;font-weight:bold;\">are</span> calm\".</li>
        </ul>
        <blockquote style=\"background-color:#fef9c3;border:1px solid #f59e0b;border-radius:6px;padding:8px\"><strong>Dica:</strong> Em inglês, usamos o verbo To Be para falar a idade (Ex: \"I <span style=\"color:#1e40af;font-weight:bold;\">am</span> 20 years old\"), diferente do português (\"Eu tenho\").</blockquote>
        <h3>2. Como usar (Regras)</h3>
        <p>O Verbo To Be é especial. Ele <strong>NÃO</strong> usa auxiliares como \"Do\" ou \"Don't\".</p>
        <ul>
          <li><strong>Afirmativa:</strong> Sujeito + Verbo (Ex: She <span style=\"color:#1e40af;font-weight:bold;\">is</span> happy).</li>
          <li><strong>Negativa:</strong> Adicione <span style=\"color:#dc2626;font-weight:bold;\">NOT</span> depois do verbo (Ex: She <span style=\"color:#1e40af;font-weight:bold;\">is</span> <span style=\"color:#dc2626;font-weight:bold;\">not</span> happy).</li>
          <li><strong>Interrogativa:</strong> Inverta a ordem (Ex: <span style=\"color:#1e40af;font-weight:bold;\">Is</span> she happy<span style=\"color:#dc2626;font-weight:bold;\">?</span>).</li>
        </ul>
        <h3>3. Tabela de Exemplos</h3>
        <table style=\"width:100%;border-collapse:collapse\">
          <thead><tr><th style=\"text-align:left\">Afirmativa</th><th style=\"text-align:left\">Negativa</th><th style=\"text-align:left\">Interrogativa</th></tr></thead>
          <tbody>
            <tr><td>I <span style=\"color:#1e40af;font-weight:bold;\">am</span> a farmer.</td><td>I <span style=\"color:#1e40af;font-weight:bold;\">am</span> <span style=\"color:#dc2626;font-weight:bold;\">not</span> a farmer.</td><td><span style=\"color:#1e40af;font-weight:bold;\">Am</span> I a farmer<span style=\"color:#dc2626;font-weight:bold;\">?</span></td></tr>
            <tr><td>The barn <span style=\"color:#1e40af;font-weight:bold;\">is</span> open.</td><td>The barn <span style=\"color:#1e40af;font-weight:bold;\">is</span> <span style=\"color:#dc2626;font-weight:bold;\">not</span> open.</td><td><span style=\"color:#1e40af;font-weight:bold;\">Is</span> the barn open<span style=\"color:#dc2626;font-weight:bold;\">?</span></td></tr>
            <tr><td>We <span style=\"color:#1e40af;font-weight:bold;\">are</span> ready.</td><td>We <span style=\"color:#1e40af;font-weight:bold;\">are</span> <span style=\"color:#dc2626;font-weight:bold;\">not</span> ready.</td><td><span style=\"color:#1e40af;font-weight:bold;\">Are</span> we ready<span style=\"color:#dc2626;font-weight:bold;\">?</span></td></tr>
          </tbody>
        </table>
      </div></div>
    ` : (isA1HaveMode ? `
      <div class=\"section-title\" style=\"margin-top:12px\">Explicação e Estrutura</div>
      <div class=\"card\"><div class=\"small\">
        <h3>1. O Poder do Verbo \"To Have\" (Ter)</h3>
        <p>Nesta lição, aprendemos um dos verbos mais importantes do inglês. Usamos ele para duas coisas principais:</p>
        <ul>
          <li><strong>Posse (Coisas que você tem):</strong> <em>\"I <span style=\"color:#1e40af;font-weight:bold;\">have</span> a farm\"</em> ↔ Eu tenho uma fazenda. <em>\"She <span style=\"color:#1e40af;font-weight:bold;\">has</span> a medical kit\"</em> ↔ Ela tem um kit médico.</li>
          <li><strong>Características (Como algo é):</strong> <em>\"The bull <span style=\"color:#1e40af;font-weight:bold;\">has</span> a strong body\"</em> ↔ O touro tem um corpo forte.</li>
        </ul>
        <h3>2. O Segredo do \"S\" (HAVE vs HAS)</h3>
        <p>Muitos alunos confundem, mas a regra é simples. O inglês adora colocar a letra <strong>S</strong> para Ele (He), Ela (She) ou Isso/Animal (It).</p>
        <ul>
          <li><strong>Eu/Nós/Eles (I, We, They):</strong> usam <span style=\"color:#1e40af;font-weight:bold;\">HAVE</span>.</li>
          <li><strong>Ele/Ela/Isso (He, She, It):</strong> usam <span style=\"color:#1e40af;font-weight:bold;\">HAS</span>.</li>
        </ul>
        <blockquote style=\"background-color:#fef9c3;border:1px solid #f59e0b;border-radius:6px;padding:8px\"><strong>Dica:</strong> He/She/It → <span style=\"color:#1e40af;font-weight:bold;\">HAS</span>. Em perguntas/negativas, o auxiliar <span style=\"color:#1e40af;font-weight:bold;\">Does</span>/<span style=\"color:#dc2626;font-weight:bold;\">Doesn't</span> aparece e o verbo volta para <span style=\"color:#1e40af;font-weight:bold;\">HAVE</span>.</blockquote>
        <h3>3. Cuidado! O \"Has\" é tímido</h3>
        <p>Quando fazemos uma <strong>Pergunta</strong> ou <strong>Negativa</strong>, o <em>has</em> perde a força e volta a ser <em>have</em>.</p>
        <ul>
          <li><strong>Afirmativa:</strong> The bull <span style=\"color:#1e40af;font-weight:bold;\">has</span>...</li>
          <li><strong>Pergunta:</strong> <span style=\"color:#1e40af;font-weight:bold;\">Does</span> the bull <span style=\"color:#1e40af;font-weight:bold;\">have</span>...<span style=\"color:#dc2626;font-weight:bold;\">?</span> (O auxiliar <em>does</em> já tem o S, então o verbo volta ao normal.)</li>
          <li><strong>Negativa:</strong> The bull <span style=\"color:#dc2626;font-weight:bold;\">doesn't</span> <span style=\"color:#1e40af;font-weight:bold;\">have</span>...</li>
        </ul>
      </div></div>
    ` : (isA1PSMode ? '' : ''));
    el.innerHTML = `
      <div>${explainForBeginners(gHead)}</div>
      ${expEstruturaHtml}
      ${(isA1BeMode||isA1HaveMode) ? '' : `<div class="section-title" style="margin-top:12px">Quando usar</div><div class="grid when-grid">${whenList}</div>`}
      ${isA1PSMode ? `
      <div class="section-title" style="margin-top:12px">Tradução simples</div>
      <div class="card"><div class="small">
        ${practice.slice(0,5).map(s=>`<div>${fixPT(s.pt||'')}</div>`).join('')}
      </div></div>
      ` : `
      <div class="section-title" style="margin-top:12px">Estrutura (Tradução)</div>
      ${isA1HaveMode ? `<div class="small" style="margin-bottom:6px">Observe como a ordem das palavras em inglês é muito parecida com o português: Sujeito + Verbo + O que ele tem.</div>` : ''}
      <div>${conjTable}</div>
      <div class="card" style="margin-top:8px"><div class="small">
        <div><strong>Como identificar:</strong> Em EN, sujeito (quem faz) + verbo (ação) + complemento (detalhe). Em PT, a ordem costuma ser igual.</div>
        <div style="margin-top:6px">Ex.: <strong>We</strong> (sujeito) <strong>check</strong> (verbo) <strong>the water</strong> (complemento) ↔ <strong>Nós</strong> <strong>verificamos</strong> <strong>a água</strong>.</div>
        <div style="margin-top:6px"><strong>Dica de tradução:</strong> pense primeiro no sujeito, depois diga a ação, por fim o complemento.</div>
      </div></div>
      `}
      <div class="section-title" style="margin-top:12px">Passo a passo guiado</div>
      ${(levelTag2==='A1' && curIdx2===1) ? (`
        <div class="card"><div class="small"><strong>Exemplo guiado</strong></div>
          <div>Frase Original: "My sister is here."</div>
          <div style="margin-top:6px">Passo 1: Ache o verbo (<strong>is</strong>).</div>
          <div style="margin-top:6px">Passo 2: Mova para o início (<strong>Is</strong>).</div>
          <div style="margin-top:6px">Resultado: "<strong>Is</strong> my sister here?"</div>
        </div>
      `) : (levelTag2==='A1' && curIdx2===2) ? (`
        <div class="card"><div class="small"><strong>Como saber se uso HAVE ou HAS?</strong></div>
          <div>Passo 1: Olhe o sujeito. É <strong>He/She/It</strong>?</div>
          <div style="margin-top:6px">Passo 2: Se <strong>SIM</strong> → use <strong>HAS</strong>. Ex.: She <strong>has</strong> a kit.</div>
          <div style="margin-top:6px">Passo 3: Se <strong>NÃO</strong> → use <strong>HAVE</strong>. Ex.: We <strong>have</strong> cows.</div>
        </div>
      `) : `<div class="grid when-grid">${guidedList}</div>`}
      ${isA1BeMode ? `<div class=\"section-title\" style=\"margin-top:12px\">Afirmativa/Negativa/Pergunta (To Be)</div><div>${beTableTarget()}</div>` : (isA1HaveMode ? `<div class=\"section-title\" style=\"margin-top:12px\">Afirmativa/Negativa/Pergunta (To Have)</div><div>${haveTableTarget()}</div>` : `<div class=\"section-title\" style=\"margin-top:12px\">Afirmativa/Negativa/Pergunta</div><div>${table3(aff,negs,quess)}</div>`)}
      ${(isA1BeMode||isA1HaveMode||isA1PSMode) ? '' : renderFormsFromChapter()}
      ${(isA1BeMode||isA1HaveMode) ? '' : `<div class="section-title" style="margin-top:12px">Regra He/She/It (+s)</div><div>${sTable}</div>`}
      ${(isA1BeMode ? beSection : '')}
      ${formaUsoHtml}
      ${tipHtml}
      ${summaryHtml}
    `;

    const gv = document.getElementById('grammarVideo');
    if (gv && (isA1BeMode || isA1HaveMode || isA1PSMode || isA1AdjMode || isA1ClimateMode)) {
      try { gv.style.display = 'block' } catch {}
      const scene = `
        <div class="card" style="padding:0">
          <div class="video-area" style="padding:12px">
            <div id="vidImage" style="width:100%;height:min(260px,42vh);border-radius:10px;background:url('https://source.unsplash.com/800x450/?farm') center/cover no-repeat;background-color:#f5f7fb;transition:transform .6s, opacity .4s"></div>
            <div id="vidEN" style="font-size:28px;line-height:1.2;margin-top:10px;transition:opacity .4s, transform .4s; text-align:center"></div>
            <div id="vidPT" class="small" style="font-size:16px;color:#374151;margin-top:6px;transition:opacity .4s, transform .4s; text-align:center"></div>
            <audio id="vidAudio" preload="metadata" style="display:none"></audio>
            <div class="yt-controls" style="margin-top:12px;background:#0f0f0f;color:#fff;border-radius:12px;padding:6px 8px;display:flex;align-items:center;gap:3px;flex-wrap:nowrap">
              <button id="ytPrev" title="Anterior" style="background:#1f2937;color:#fff;border:none;border-radius:8px;padding:4px 6px">⏮</button>
              <button id="ytPlay" title="Play/Pause" style="background:#0b3a1e;color:#fff;border:none;border-radius:999px;padding:6px 8px;font-weight:700">▶</button>
              <button id="ytNext" title="Próximo" style="background:#1f2937;color:#fff;border:none;border-radius:8px;padding:4px 6px">⏭</button>
              <div style="display:flex;align-items:center;gap:4px;flex:0 0 auto">
                <input id="ytProgress" type="range" min="0" max="1000" value="0" style="width:70px;flex:0 0 70px;height:5px;border-radius:4px;background:linear-gradient(90deg,#16a34a 0%,#34d399 0%,#555 0%,#555 100%);appearance:none">
                <div id="ytTime" class="small" style="min-width:36px;text-align:right;color:#e5e7eb;white-space:nowrap">00:00</div>
                <div style="opacity:.7;min-width:6px">/</div>
                <div id="ytDuration" class="small" style="min-width:36px;color:#e5e7eb;white-space:nowrap">00:00</div>
              </div>
              <div style="position:relative;display:flex;align-items:center">
                <button id="ytVolIcon" title="Volume" style="background:#1f2937;color:#fff;border:none;border-radius:8px;padding:4px 6px">🔊</button>
                <div id="ytVolPopup" style="position:absolute;bottom:100%;right:0;background:#1f2937;color:#fff;border-radius:8px;padding:6px;display:none;box-shadow:0 8px 20px rgba(0,0,0,.3)">
                  <input id="ytVolume" type="range" min="0" max="1" step="0.01" value="1" style="width:120px">
                </div>
              </div>
              <select id="ytRate" title="Velocidade" style="background:#1f2937;color:#fff;border:none;border-radius:8px;padding:4px 6px;min-width:56px;font-weight:700">
                <option value="0.75">0.75x</option>
                <option value="1" selected>1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
              </select>
            </div>
            <div id="vidTip" class="small" style="margin-top:8px;color:#6b7280;text-align:center;font-weight:600"></div>
          </div>
        </div>
      `;
      gv.innerHTML = scene;
      (function(){
        const { level, index } = parseRoute();
        if (String(level).toUpperCase()==='A1' && Number(index)===4) {
          try {
            gv.insertAdjacentHTML('beforeend', `
              <div style="margin-top:12px">
                <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;background:#000">
                  <iframe src="https://www.youtube.com/embed/Q39ia_h7l5Q" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%" loading="lazy"></iframe>
                </div>
              </div>
            `);
          } catch {}
        }
        if (String(level).toUpperCase()==='A1' && Number(index)===5) {
          try {
            gv.insertAdjacentHTML('beforeend', `
              <div style="margin-top:12px">
                <div id="ytVideo5" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;background:#000">
                  <iframe src="https://www.youtube.com/embed/CwqqtZ3knsg" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%" loading="lazy"></iframe>
                </div>
              </div>
            `);
            const lessonHTML5 = `
              <div class="section-title" style="margin-top:12px">🌱 Aula de Inglês: Adjetivos na Fazenda</div>
              <div class="card">
                <div class="small"><strong>📌 Objetivo da aula</strong></div>
                <div class="small" style="margin-top:6px">Entender o que são adjetivos e como usá-los para descrever pessoas, animais, objetos e clima na fazenda.</div>
              </div>
              <div class="section-title" style="margin-top:12px">🔤 O que é adjetivo?</div>
              <div class="card">
                <div class="small">Definição: Adjetivo é a palavra que descreve como algo é ou está.</div>
              </div>
              <div class="section-title" style="margin-top:12px">Exemplos básicos</div>
              <div class="card">
                <div class="small">big (grande)</div>
                <div class="small">small (pequeno)</div>
                <div class="small">happy (feliz)</div>
                <div class="small">calm (calmo)</div>
                <div class="small" style="margin-top:8px"><strong>👉 Exemplo em frase:</strong> The farmer is happy. (O fazendeiro está feliz.)</div>
              </div>
              <div class="section-title" style="margin-top:12px">🐄 Adjetivos para animais da fazenda</div>
              <div class="card">
                <div class="small">brown (marrom)</div>
                <div class="small">white (branco)</div>
                <div class="small">strong (forte)</div>
                <div class="small">slow (lento)</div>
                <div class="small" style="margin-top:8px"><strong>👉 Exemplos em frases:</strong> The cow is brown. (A vaca é marrom.) · The horse is strong. (O cavalo é forte.)</div>
              </div>
              <div class="section-title" style="margin-top:12px">🚜 Adjetivos para objetos e lugares</div>
              <div class="card">
                <div class="small">clean (limpo)</div>
                <div class="small">dirty (sujo)</div>
                <div class="small">new (novo)</div>
                <div class="small">old (velho)</div>
                <div class="small">big (grande)</div>
                <div class="small" style="margin-top:8px"><strong>👉 Exemplos em frases:</strong> The barn is clean. (O celeiro está limpo.) · The tractor is old. (O trator é velho.)</div>
              </div>
              <div class="section-title" style="margin-top:12px">☀️ Adjetivos para clima na fazenda</div>
              <div class="card">
                <div class="small">hot (quente)</div>
                <div class="small">cold (frio)</div>
                <div class="small">rainy (chuvoso)</div>
                <div class="small">sunny (ensolarado)</div>
                <div class="small">windy (ventoso)</div>
                <div class="small" style="margin-top:8px"><strong>👉 Exemplos em frases:</strong> The day is sunny. (O dia está ensolarado.) · The morning is cold. (A manhã está fria.)</div>
              </div>
            `;
            gv.insertAdjacentHTML('beforeend', lessonHTML5);
          } catch {}
        }
      })();
      function sentencesFor(d){
        if (Array.isArray(d.pairs) && d.pairs.length) return d.pairs.map(p=>p.en);
        const lines = Array.isArray(d.lines) ? d.lines.map(l=> String(l.en||'').trim()).filter(Boolean) : [];
        if (lines.length) return lines;
        const nar = Array.isArray(d.a1_exercises && d.a1_exercises.narration_sentences) ? d.a1_exercises.narration_sentences.map(s=> String(s||'').trim()).filter(Boolean) : [];
        if (nar.length) return nar;
        const textParts = String(d.text||'').split(/(?<=[.!?])\s+/).filter(Boolean);
        if (textParts.length) return textParts;
        const voc = Array.isArray(d.vocabulary) ? d.vocabulary : [];
        if (voc.length) return voc.map(v=> typeof v === 'string' ? v : (v.en || v.term || '')).filter(Boolean);
        return [];
      }
      function ptSentencesFor(d){
        if (Array.isArray(d.pairs) && d.pairs.length) return d.pairs.map(p=>fixPT(p.pt));
        const trParts = splitSentences(fixPT(String(d.translation||'')));
        if (trParts.length) return trParts;
        const voc = Array.isArray(d.vocabulary) ? d.vocabulary : [];
        return voc.map(v=> typeof v === 'string' ? '' : fixPT(v.pt || v.translation || '')).filter(x=>true);
      }
      const en = isA1BeMode ? [
        'Hello.',
        'I am Paul, and I am a farmer.',
        'I am at the farm now.',
        'My sister is here too.',
        'She is happy.',
        'The barn is open.',
        'It is very big.',
        'The cows are calm, but the chickens are fast.',
        'They are funny.',
        'The sun is hot, but the wind is not strong.',
        'We are ready for the day.'
      ] : (isA1AdjMode ? sentencesFor(data).slice(0,10) : sentencesFor(data));
      const pt = isA1BeMode ? [
        'Olá.',
        'Eu sou Paul e sou fazendeiro.',
        'Eu estou na fazenda agora.',
        'Minha irmã está aqui também.',
        'Ela está feliz.',
        'O galpão está aberto.',
        'Ele é muito grande.',
        'As vacas estão calmas, mas as galinhas são rápidas.',
        'Elas são engraçadas.',
        'O sol está quente, mas o vento não está forte.',
        'Nós estamos prontos para o dia.'
      ] : (isA1AdjMode ? ptSentencesFor(data).slice(0,10) : ptSentencesFor(data));
      const imgQ = isA1BeMode ? [
        'farm',
        'farmer portrait',
        'farm entrance',
        'farm family',
        'smiling woman farm',
        'barn open',
        'big barn',
        'cows pasture',
        'chickens running',
        'sun wind farm',
        'farm workers morning'
      ] : (isA1PSMode ? (
        (en || []).map((s,i)=>{
          const t = String(s||'');
          if (i===0) return 'farm cover';
          if (/start\s+work/i.test(t)) return 'farm workers morning';
          if (/walk\s+to\s+the\s+pasture/i.test(t)) return 'cows pasture';
          if (/check\s+the\s+water\s+tanks?/i.test(t)) return 'water tanks farm';
          if (/calf.*drinks\s+milk/i.test(t)) return 'calf drinks milk';
          if (/feeds?\s+the\s+pigs?/i.test(t)) return 'feeding pigs farm';
          return 'farm routine';
        })
      ) : (isA1AdjMode ? (
        (en || []).map((s,i)=> i===0 ? 'farm cover' : 'farm routine')
      ) : (
        (en || []).map((s,i)=> i===0 ? 'farm' : (/vet|veterinarian/i.test(s) ? 'veterinarian cattle' : (/cow|cattle|calf/i.test(s) ? 'cattle farm' : (/barn/i.test(s) ? 'barn' : 'farm'))))
      )));
      const tips = isA1BeMode ? [
        'Cumprimento simples com pausa para repetição.',
        'Identidade: I am + profissão.',
        'Localização: I am at + lugar.',
        'Família: My sister + is.',
        'Estado/emoção: She is + adjetivo.',
        'Lugar/objeto: The barn is + estado.',
        'Tamanho: It is + very big.',
        'Plural: cows are; contraste com chickens are + adjetivo.',
        'Humor: They are + funny.',
        'Clima: The sun is; wind is not + adjetivo.',
        'Preparação: We are + pronto.'
      ] : (isA1PSMode ? [
        'Horário: We start work at 6:00 AM.',
        'Rotina: The cows walk to the pasture.',
        'Checagem: I check the water tanks.',
        'Bezerro: The small calf drinks milk.',
        'Alimentação: The farm worker feeds the pigs.',
        'Regra do S: He/She/It → verbo + s/es.',
        'Negativa: don\'t/doesn\'t + verbo base.',
        'Pergunta: Do/Does + sujeito + verbo base.'
      ] : [
        'To Have no presente: I/We have; She/He/It has.',
        'Posse: We have cows. Característica: The bull has a strong body.',
        'Regra do S: He/She/It → has. I/We/They → have.',
        'Pergunta: Does + sujeito + have...? (o verbo volta para have).',
        "Negativa: sujeito + doesn\'t + have...",
        'Exemplo: The bull (He) has a small injury on the leg.',
        'Identificar sujeito → escolher have/has → dizer o complemento.'
      ]);
      let i = 0;
      let playing = false;
      const enEl = document.getElementById('vidEN');
      const ptEl = document.getElementById('vidPT');
      const imgEl = document.getElementById('vidImage');
      const tipEl = document.getElementById('vidTip');
      const audioEl = document.getElementById('vidAudio');
      let segLen = 0; let lastScene = -1;
      function parseRoute(){
        const h = String(window.location.hash||'');
        const m = h.match(/#\/text\/(\w+)\/(\d+)/i);
        if (!m) return { level: 'A1', index: 1 };
        return { level: m[1], index: Number(m[2]||1) };
      }
      function imageBases(){
        const { level, index } = parseRoute();
        const L = String(level||'A1').toLowerCase();
        const i = String(index||1);
        return [
          `./public/images/${L}texto${i}/`,
          `./public/images/${L}texto${i}/farmedition/`,
          `./public/images/${L}/texto${i}/`,
          `./public/images/${L}/text${i}/`,
          `./public/images/a1texto1/farmedition/`
        ];
      }
      function setCoverImage(){
        const bases = imageBases();
        const exts = ['.png','.jpg','.jpeg','.webp'];
        const { level, index } = parseRoute();
        const isA1 = String(level).toUpperCase()==='A1';
        const idxNum = Number(index);
        const coverDecimal = (isA1 && idxNum===2) ? '0.0' : (isA1 && idxNum===3) ? '0.3' : (isA1 && idxNum===4) ? '0.4' : (isA1 && idxNum===5) ? '0.5' : null;
        const names = coverDecimal ? [coverDecimal,'0'] : ['0'];
        let bi = 0, ni = 0, ei = 0;
        function tryNext(){
          if (bi >= bases.length){ imgEl.style.backgroundImage = `url("https://source.unsplash.com/800x450/?farm")`; imgEl.style.backgroundSize='cover'; imgEl.style.backgroundPosition='center'; imgEl.style.backgroundRepeat='no-repeat'; imgEl.style.opacity='1'; imgEl.style.transform='scale(1.02)'; return; }
          if (ni < names.length && ei < exts.length){
            const url = bases[bi] + names[ni] + exts[ei++];
            const probe = new Image();
            probe.onload = ()=>{ imgEl.style.backgroundImage = `url('${url}')`; imgEl.style.backgroundSize='cover'; imgEl.style.backgroundPosition='center'; imgEl.style.backgroundRepeat='no-repeat'; imgEl.style.backgroundColor='#f5f7fb'; imgEl.style.opacity='1'; imgEl.style.transform='scale(1.02)'; };
            probe.onerror = tryNext;
            probe.src = url;
          } else if (ni + 1 < names.length) { ni++; ei = 0; tryNext(); }
          else { bi++; ni = 0; ei = 0; tryNext(); }
        }
        tryNext();
      }
      function loadAudio(){
        if (!audioEl) return;
        if (isA1BeMode) {
          const file = 'Paul and the Farm (Identity & Description) · A1.mp3';
          const encoded = encodeURIComponent(file);
          const bases = ['./src/audio/A1/','./src/audio/','./public/audio/a1texto1/','./public/audio/A1/','./public/audio/','./'];
          let idx = 0;
          function tryNext(){
            if (idx >= bases.length){ if (tipEl) tipEl.textContent = 'Áudio não encontrado'; return; }
            const src = bases[idx++] + encoded;
            audioEl.src = src;
            audioEl.load();
          }
          audioEl.addEventListener('error', tryNext);
          audioEl.addEventListener('loadedmetadata', ()=>{ segLen = (audioEl.duration||0) / en.length; });
          audioEl.addEventListener('canplay', ()=>{ audioEl.removeEventListener('error', tryNext); });
          audioEl.addEventListener('timeupdate', ()=>{
            if (!segLen) return;
            const cur = Math.floor((audioEl.currentTime||0) / segLen);
            const k = Math.min(en.length-1, Math.max(0, cur));
            if (k !== lastScene){ lastScene = k; i = k; show(i); }
          });
          audioEl.addEventListener('ended', ()=>{ playing=false; });
          tryNext();
        } else if (isA1AdjMode) {
          const file = 'The Tractor and The Field (Machinery & Crops) · A1.mp3';
          const encoded = encodeURIComponent(file);
          const bases = ['./src/audio/A1/','./src/audio/','./public/audio/a1texto4/','./public/audio/A1/','./public/audio/','./'];
          let idx = 0;
          function tryNext(){
            if (idx >= bases.length){ if (tipEl) tipEl.textContent = 'Áudio não encontrado'; return; }
            const src = bases[idx++] + encoded;
            audioEl.src = src;
            audioEl.load();
          }
          audioEl.addEventListener('error', tryNext);
          audioEl.addEventListener('loadedmetadata', ()=>{ segLen = (audioEl.duration||0) / Math.max(1,en.length); });
          audioEl.addEventListener('canplay', ()=>{ audioEl.removeEventListener('error', tryNext); });
          audioEl.addEventListener('timeupdate', ()=>{
            if (!segLen) return;
            const cur = Math.floor((audioEl.currentTime||0) / segLen);
            const k = Math.min(en.length-1, Math.max(0, cur));
            if (k !== lastScene){ lastScene = k; i = k; show(i); }
          });
          audioEl.addEventListener('ended', ()=>{ playing=false; });
          tryNext();
        } else {
          const lvl = String(level).trim();
          const title = String(data && (data.uiTitle || data.title) || '').trim();
          const urls = buildAudioUrls(lvl, title);
          let iUrl = 0;
          function attempt(){ if (iUrl >= urls.length){ if (tipEl) tipEl.textContent = 'Áudio não encontrado'; return; } audioEl.src = urls[iUrl++]; audioEl.load(); }
          function onLoaded(){ segLen = (audioEl.duration||0) / Math.max(1,en.length); audioEl.removeEventListener('loadedmetadata', onLoaded); audioEl.removeEventListener('error', onError); }
          function onError(){ attempt(); }
          audioEl.addEventListener('loadedmetadata', onLoaded);
          audioEl.addEventListener('error', onError);
          audioEl.addEventListener('timeupdate', ()=>{
            if (!segLen) return;
            const cur = Math.floor((audioEl.currentTime||0) / segLen);
            const k = Math.min(en.length-1, Math.max(0, cur));
            if (k !== lastScene){ lastScene = k; i = k; show(i); }
          });
          audioEl.addEventListener('ended', ()=>{ playing=false; });
          attempt();
        }
      }
      let preloaded = {};
      function preloadImages(){
        const bases = imageBases();
        const exts = ['.jpg','.jpeg','.png','.webp'];
        const { level, index } = parseRoute();
        const isA1 = String(level).toUpperCase()==='A1';
        const idxNum = Number(index);
        for (let k=0;k<en.length;k++){
          let done = false;
          for (let bi=0; bi<bases.length && !done; bi++){
            for (let ei=0; ei<exts.length && !done; ei++){
              let name = String(k+1);
              if (isA1 && idxNum===2) name = `${k+1}.${k+1}`;
              else if (isA1 && idxNum===3) name = `${k+1}.3`;
              else if (isA1 && idxNum===4) name = `${k+1}.4`;
              else if (isA1 && idxNum===5) name = `${k+1}.5`;
              const url = bases[bi] + name + exts[ei];
              const im = new Image();
              im.onload = ()=>{ if (!preloaded[k]) preloaded[k] = url; };
              im.src = url;
            }
          }
        }
      }
      function setSceneImage(k){
        const q = imgQ[k] || imgQ[imgQ.length-1];
        const ready = preloaded[k];
        if (ready){ imgEl.style.backgroundImage = `url('${ready}')`; imgEl.style.backgroundSize='contain'; imgEl.style.backgroundPosition='top center'; imgEl.style.backgroundRepeat='no-repeat'; imgEl.style.backgroundColor='#f5f7fb'; imgEl.style.opacity='1'; imgEl.style.transform='scale(1.03)'; return; }
        const bases = imageBases();
        const exts = ['.jpg','.jpeg','.png','.webp'];
        const { level, index } = parseRoute();
        const isA1 = String(level).toUpperCase()==='A1';
        const idxNum = Number(index);
        let bi = 0, ei = 0;
        function tryNext(){
          if (bi >= bases.length){ imgEl.style.backgroundImage = `url("https://source.unsplash.com/800x450/?${encodeURIComponent(q)}")`; imgEl.style.backgroundSize='cover'; imgEl.style.backgroundPosition='center'; imgEl.style.backgroundRepeat='no-repeat'; imgEl.style.opacity='1'; imgEl.style.transform='scale(1.03)'; return; }
          if (ei < exts.length){
            let name = String(k+1);
            if (isA1 && idxNum===2) name = `${k+1}.${k+1}`;
            else if (isA1 && idxNum===3) name = `${k+1}.3`;
            else if (isA1 && idxNum===4) name = `${k+1}.4`;
            else if (isA1 && idxNum===5) name = `${k+1}.5`;
            const url = bases[bi] + name + exts[ei++];
            const probe = new Image();
            probe.onload = ()=>{ imgEl.style.backgroundImage = `url('${url}')`; imgEl.style.backgroundSize='cover'; imgEl.style.backgroundPosition='center'; imgEl.style.backgroundRepeat='no-repeat'; imgEl.style.backgroundColor='#f5f7fb'; imgEl.style.opacity='1'; imgEl.style.transform='scale(1.03)'; };
            probe.onerror = tryNext;
            probe.src = url;
        } else { bi++; ei=0; tryNext(); }
        }
        tryNext();
      }
      
      function show(k){
        const e = en[k] || en[en.length-1];
        const p = pt[k] || pt[pt.length-1];
        enEl.style.opacity = '0'; ptEl.style.opacity = '0';
        setSceneImage(k);
        enEl.innerHTML = colorBeTokens(e);
        ptEl.textContent = p;
        if (tipEl) tipEl.textContent = tips[k] || '';
        enEl.style.transform = 'translateY(6px)'; ptEl.style.transform = 'translateY(6px)';
        enEl.style.opacity = '1'; ptEl.style.opacity = '1';
        setTimeout(()=>{ enEl.style.transform='translateY(0)'; ptEl.style.transform='translateY(0)'; },100);
      }
      function fmt(ms){ const s = Math.floor(ms); const m = Math.floor(s/60); const sec = s%60; return String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0'); }
      function renderProgress(){
        const prog = document.getElementById('ytProgress');
        const curEl = document.getElementById('ytTime');
        const durEl = document.getElementById('ytDuration');
        const dur = Number(audioEl && audioEl.duration || 0);
        const cur = Number(audioEl && audioEl.currentTime || 0);
        if (durEl) durEl.textContent = fmt(Math.floor(dur));
        if (curEl) curEl.textContent = fmt(Math.floor(cur));
        if (prog && dur){ const p = Math.round(cur/dur*1000); prog.value = String(p); prog.style.background = `linear-gradient(90deg,#16a34a 0%,#34d399 ${p/10}%,#555 ${p/10}%,#555 100%)`; }
      }
      function play(){
        playing = true; if (i<0) i=0; lastScene = -1; show(i);
        const rateSel = document.getElementById('ytRate');
        if (audioEl) { audioEl.playbackRate = rateSel ? Number(rateSel.value||1) : 1; try { audioEl.play(); } catch {} }
        const btn = document.getElementById('ytPlay'); if (btn) btn.textContent = '⏸';
      }
      function pause(){ playing=false; if (audioEl) { try { audioEl.pause(); } catch {} } const btn = document.getElementById('ytPlay'); if (btn) btn.textContent = '▶'; }
      function next(){ i = Math.min(i+1, en.length-1); show(i); if (audioEl && segLen) { audioEl.currentTime = i * segLen; renderProgress(); } }
      function prev(){ i = Math.max(i-1, 0); show(i); if (audioEl && segLen) { audioEl.currentTime = i * segLen; renderProgress(); } }
      const btnPlay = document.getElementById('ytPlay');
      const btnNext = document.getElementById('ytNext');
      const btnPrev = document.getElementById('ytPrev');
      const rateSel = document.getElementById('ytRate');
      const volIcon = document.getElementById('ytVolIcon');
      const volPopup = document.getElementById('ytVolPopup');
      const volSl = document.getElementById('ytVolume');
      const prog = document.getElementById('ytProgress');
      if (btnPlay) btnPlay.addEventListener('click', ()=>{ if (playing) pause(); else play(); });
      if (btnNext) btnNext.addEventListener('click', next);
      if (btnPrev) btnPrev.addEventListener('click', prev);
      if (rateSel) rateSel.addEventListener('change', ()=>{ if (audioEl) audioEl.playbackRate = Number(rateSel.value||1) });
      if (volIcon && volPopup) volIcon.addEventListener('click', ()=>{ const show = (volPopup.style.display!=='block'); volPopup.style.display = show ? 'block' : 'none'; });
      if (volSl) volSl.addEventListener('input', ()=>{ if (audioEl) { audioEl.volume = Number(volSl.value||1); audioEl.muted = (audioEl.volume===0); if (volIcon) volIcon.textContent = (audioEl.volume===0)?'🔇':'🔊'; } });
      document.addEventListener('click', (e)=>{ try { const t = e.target; if (volPopup && volIcon && !volPopup.contains(t) && !volIcon.contains(t)) volPopup.style.display='none'; } catch {} });
      if (prog) prog.addEventListener('input', ()=>{ if (!audioEl) return; const dur = Number(audioEl.duration||0); const p = Number(prog.value||0)/1000; audioEl.currentTime = p * dur; renderProgress(); if (segLen) { const k = Math.floor(audioEl.currentTime/segLen); i = Math.min(en.length-1, Math.max(0,k)); show(i); } });
      if (audioEl) {
        audioEl.addEventListener('timeupdate', renderProgress);
        audioEl.addEventListener('loadedmetadata', renderProgress);
        audioEl.addEventListener('ended', ()=>{ pause(); });
      }
      setCoverImage();
      preloadImages();
      loadAudio();
      }

    

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
    (function(){
      const curLevel = (location.hash.split('/')[2]||'').toUpperCase();
      if (curLevel !== 'A1') {
        renderTextGame();
        renderClassify();
        renderTransform();
        renderOrdering();
        renderDictation();
        renderMatchVocab();
        renderTrueFalse();
      }
    })();
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
      const isA1Now = String(level) === 'A1';
      const idxNum = Number(idx);
      const showGV = isA1Now && (idxNum===1 || idxNum===2 || idxNum===3);
      if (wrap) { try { wrap.style.display = showGV ? 'block' : 'none'; } catch {} }
      if (isA1Now && idxNum === 1 && vid && wrap) {
        const url = encodeURI('./public/video/Base do Inglês/Base do Inglês.mp4');
        vid.src = url;
        vid.style.display = 'block';
        wrap.style.display = 'block';
        vid.addEventListener('error', ()=>{
          wrap.innerHTML = '<div class="small">Vídeo não encontrado. Caminho esperado: <code>public/video/Base do Inglês/Base do Inglês.mp4</code>.</div>';
          vid.style.display = 'none';
        }, { once:true });
      }
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
          'at':'ét','the':'dâ','a':'â','an':'ân','in':'in','on':'ón','under':'ândâr','next':'nékst','to':'tú','behind':'biháind','where':'uéâr',
          'farm':'fárm','barn':'bárn','pasture':'péstcher','field':'fíld','gate':'gueit','fence':'fêns',
          'cow':'cáu','cows':'cáuz','chicken':'tchí-ken','chickens':'tchí-kens','sheep':'xíp','horse':'hórs','horses':'hórsiz',
          'water':'uóter','feed':'fíid','trough':'tróf','bucket':'bâkit','buckets':'bâkits','tools':'túuls','box':'bóks','tap':'tép','shovel':'xó-vôl','hammer':'ré-mâr','wood':'úd','table':'téi-bol',
          'morning':'mór-ning','today':'tudêi','clean':'clín','ready':'rédi','work':'uârk','keep':'kíip','check':'tchék','open':'óupen','near':'nír','safe':'sêif',
          'sun':'sãn','wind':'uínd','strong':'stróng','cool':'cúl',
          'boots':'búts','gloves':'glâvz','signs':'sáinz','electric':'iléktrik','dangerous':'dên-dja-râs','smoke':'smóuk','wash':'uóx','hands':'hêndz','soap':'sôup','please':'plíiz','careful':'kér-fôl',
          'can':'kén','cannot':'ké-not','operate':'ó-pe-reit','pull':'púl','help':'hélp','do':'dú','license':'lái-sens','trailer':'trêi-lâr','tons':'tânz','pickup':'pík-âp','truck':'trúk','red':'réd','large':'lárdj','together':'tugé-thâr',
          'will':'uíl','tomorrow':'tô-mó-rôu','week':'uíik','monday':'mân-dêi','tuesday':'tiúz-dêi','friday':'frái-dêi','arrive':'â-ráiv','load':'lôud','sell':'sél','grain':'grêin','silos':'sái-lôus','mechanic':'mê-ké-nik','sunny':'sâ-ni','production':'prô-dâk-chan','busy':'bí-zi','trucks':'trâks',
          'price':'práis','cost':'cóst','money':'mâ-ni','profit':'pró-fit','inputs':'ín-púts','cooperative':'co-ó-pe-ra-tiv','market':'már-ket','buyer':'báier','buy':'bái','cheap':'tchíp','expensive':'éks-pén-siv','pay':'pêi','ton':'tân','dollars':'dó-lârz','how':'ráu','much':'mâch',
          'yesterday':'iés-târ-dêi','last':'lást','night':'náit','cold':'cóuld','rainy':'rêi-ni','muddy':'mâ-di','difficult':'dí-fi-cúlt','because':'bi-cóz','tired':'táierd','broken':'brôu-kân','garage':'gâ-ráj','vet':'vét'
          ,
      'worked':'uârk-t','started':'stár-ted','checked':'tchékt','cleaned':'clíind','repaired':'ri-pérd','stopped':'stópt','finished':'fí-ni-sht','then':'dén','afternoon':'áf-târ-nún','late':'lêit','tractor':'tráktor','cab':'kéb','fence':'fêns','line':'láin','organized':'ór-ga-náizd'
      ,
      'go':'gôu','went':'uént','see':'sí','saw':'só','break':'brêik','broke':'brôuk','have':'rév','had':'réd','take':'têik','took':'túk','drive':'dráiv','drove':'drôuv','buy':'bái','bought':'bót','come':'kâm','came':'keim','spare part':'spér párt','main belt':'mein bélt','belt':'bélt','store':'stór','suddenly':'sâ-dâ-nli','pickup':'pík-âp','city':'sí-ri','corn field':'córn fíld',
      'did':'díd','didn\'t':'dídânt','cattle':'ké-tôl','brush':'brâsh','fever':'fí-vâr','find':'fáind','yet':'yét','horse':'hórs','sick':'sík','water tank':'uóter ténk',
      'herd':'hârd','genetics':'djê-né-tiks','heavier':'hé-viâr','calmer':'cáu-mâr','bigger':'bí-gâr','stronger':'strón-gâr','more expensive':'mór éks-pén-siv','better':'bé-târ','choose':'tchúuz','than':'thén','however':'ráu-évâr','black bull':'blék búl','white bull':'uáit búl','black':'blék','white':'uáit','bull':'búl','expensive':'éks-pén-siv','strong':'stróng','heavy':'hé-vi','calm':'cám','big':'bíg','good':'gud',
      'newest':'nú-est','most modern':'móst mó-dârn','strongest':'strón-guest','best':'bést','most expensive':'móst éks-pén-siv','most important':'móst im-pór-tânt','gps':'djí-pi-és','autopilot':'óu-to-pái-lôt','stumps':'stâmps','pulling':'púl-ing','repair parts':'ri-pér párts','fleet':'flíit','machinery':'mâ-xí-nri','green':'grín','old':'ôuld','red':'réd','tractor':'tráktor',
      'supplies':'sû-pláis','diesel':'dí-zel','fuel':'fiúl','liters':'lí-târz','bags':'bégz','seeds':'síidz','a lot of':'a lórof','enough':'enóf','left':'léft','chemical mix':'ké-mi-col míks','mix':'míks','how many':'ráu mé-ni',
      'must':'mâst','must not':'mâst nót','should':'xúd','mandatory':'mán-de-tó-ri','prohibited':'pro-hí-bi-ted','hydrated':'rái-drêi-ted','dizzy':'dí-zi','protect':'prô-tékt','chemicals':'ké-mi-cols','safety glasses':'sêi-f-ti glá-siz','fuel tanks':'fiúl ténks','hot':'hót','hat':'rét','sun':'sân','immediately':'i-mí-di-ét-li','every hour':'évri áu-âr'
      ,
      'always':'ól-uêiz','usually':'iú-ju-li','sometimes':'sâm-táims','rarely':'réar-li','never':'né-vâr','maintenance':'mêin-tê-nâns','schedule':'ské-dju-l','oil level':'óiol lé-vol','air filters':'ér fíltârz','filters':'fíltârz','oil':'óiol','air':'ér','tires':'táiârz','dashboard':'déch-bórd','warning light':'uór-ning láit','consistency':'cón-sis-ten-si'
      ,
      'so':'sôu','dropped':'drópt','stressed':'strést','thirsty':'thâr-sti','essential':'i-sên-xial','return to normal':'ri-târn tú nór-mol'
      ,
      'going':'gôu-ing','going to':'gôu-ing tú','vaccination':'vék-si-néi-chân','cattle chute':'ké-tôl xút','needles':'ní-dôlz','cooler':'cú-lâr','separate':'sé-pâ-reit'
      ,
      'experience':'éks-pí-ri-êns','hard worker':'hárd uârkâr','honest':'ó-nest','gps systems':'djí-pi-és sís-temz','heavy trucks':'hé-vi trâks','i want to':'ái uónt tú'
      ,
      'warning':'uór-ning','light':'láit','shut':'xât','off':'óf','cooling':'cú-lin','system':'sís-tem','leak':'lík','emergency':'i-mârd-jen-si','stop':'stóp','protective':'prô-ték-tiv','gloves':'glâvz'
      ,
      'turns':'târns','on':'ón','overheats':'óuvâr-ríts','cool':'cúl','down':'dáun','strange':'strêindj','noise':'nóiz','protocols':'pró-to-cols'
      ,
      'budget':'bâ-djêt','upgrades':'âp-grêidz','solar':'sô-lâr','energy':'é-ne-rji','rose':'rôuz','monitoring':'mó-ni-tâ-ring','would':'úd'
      ,
      'used to':'iúzd tú','didn\'t use to':'dídnt iúz tú','milk by hand':'mílk bai hénd','ac':'êi-sí','air conditioning':'ér con-di-xô-ning','straight lines':'strêit láinz','efficiency':'ê-fí-xian-si','owner':'ôu-nâr','robots':'rôu-bóts'
      ,
      'milking parlor':'míul-kin párlâr','udders':'â-dârz','iodine':'áiô-dáin','stainless steel':'stêin-lês stíl','samples':'sém-plz','dairy cooperative':'déi-ri cô-uó-pâ-râ-tiv','brought':'brót','cleaned':'clínd','collected':'co-léc-ted','cooled':'cúld','sent':'sént','sold':'sôuld','maintained':'mein-têind'
      ,
      'logbook':'lóg-búk','service':'sér-vis','harvester':'hár-ves-târ','engine oil':'ên-djin ói-ol','air filters':'ér fíltârz','tires':'táiârz','hydraulic system':'rai-dró-lik sís-tem','done':'dân','changed':'tchéindjd','replaced':'ri-plêi-st','inspected':'in-spék-ted','tested':'tés-ted','solved':'sólv-d','returned':'ri-târn-d'
      ,
      'who':'rú','which':'uí-tch','that':'dét','tag':'tég','shelf':'xélf','virus':'váirâs','vacation':'vêi-кêi-xân','critical':'crí-ti-col'
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
      let pairs = (Array.isArray(data.pairs) && data.pairs.length) ? data.pairs : [];
      const lvl = (location.hash.split('/')[2]||'').toUpperCase();
      const curIdx = Number((location.hash.split('/')[3]||'1').trim());
      if (!pairs.length && lvl==='A1' && curIdx===2) {
        pairs = [
          { en: 'I have a livestock farm.', pt: 'Eu tenho uma fazenda de pecuária.' },
          { en: 'We have many cows here.', pt: 'Nós temos muitas vacas aqui.' },
          { en: 'This is the veterinarian.', pt: 'Esta é a veterinária.' },
          { en: 'Her name is Dr. Silva.', pt: 'O nome dela é Dra. Silva.' },
          { en: 'She has a medical kit.', pt: 'Ela tem um kit médico.' },
          { en: 'The bull has a strong body, but he has a small injury on the leg.', pt: 'O touro tem um corpo forte, mas ele tem um ferimento pequeno na perna.' },
          { en: 'Dr. Silva has the medicine.', pt: 'Dra. Silva tem o remédio.' },
          { en: 'We have safe and healthy animals now.', pt: 'Agora nós temos animais seguros e saudáveis.' }
        ];
      }
      if (pairs.length) {
        linesEl.innerHTML = pairs.map(p=>`<div class="line"><div class="en">${p.en}</div><div class="pt">${fixPT(p.pt)}</div><div class="phon">${phoneticBR(p.en)}</div></div>`).join('');
        return;
      }
      const enBase = splitSentences(String(data.text||''));
      const ptBase = splitSentences(fixPT(String(data.translation||'')));
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
      if (first === 'am') {
        const tail = rest.replace(/^am\s+/i,'');
        return { affirmative: clean, negative: subject + ' am not ' + tail, interrogative: 'Am ' + subject + ' ' + tail + '?' };
      }
      if (first === 'are') {
        const tail = rest.replace(/^are\s+/i,'');
        return { affirmative: clean, negative: subject + ' are not ' + tail, interrogative: 'Are ' + subject + ' ' + tail + '?' };
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
    const grammarText = item.grammar ? String(item.grammar)
      : (lvl === 'B1'
        ? 'Past simple narrative with cause/result (because/so). Future (will/going to) for plans.'
        : (lvl === 'A2'
          ? 'Present simple + present continuous (routine vs now).'
          : (lvl === 'B2'
            ? 'Procedures, passive voice, sequences, and technical reporting.'
            : (lvl === 'C1'
              ? 'Advanced management language, complex clauses, and precise modality.'
              : (lvl === 'C2'
                ? 'Academic/report style, compliance wording, and controlled terminology.'
                : 'Present simple with farm routines.')))));
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
          if (first==='am'){
            const tail = rest.replace(/^am\s+/i,'');
            return { affirmative: clean, negative: subject+' am not '+tail, interrogative: 'Am '+subject+' '+tail+'?' };
          }
          if (first==='are'){
            const tail = rest.replace(/^are\s+/i,'');
            return { affirmative: clean, negative: subject+' are not '+tail, interrogative: 'Are '+subject+' '+tail+'?' };
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
        structure_table: item.structure_table || null,
        vocabulary_table: item.vocabulary_table || null,
        forma_uso: item.forma_uso || null,
        golden_tip: item.golden_tip || '',
        summary_map: item.summary_map || null
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
      try { if (window.SlideLessonMount) window.SlideLessonMount(level, idx); } catch {}
      if (uiTitle) {
        try { document.getElementById('title').textContent = uiTitle + ' · ' + level; } catch {}
      }
      renderLines(data);
      setupAudio(data);
      
      try { renderVocabulary(data); } catch (e) { console.error('Error in renderVocabulary:', e); }
      try { renderGrammar(data); } catch (e) { console.error('Error in renderGrammar:', e); }
      try {
        if (String(level).toUpperCase()==='A1' && Number(idx)===1) {
          const g = document.getElementById('grammar'); if (g) { g.innerHTML=''; g.style.display = 'none'; }
          const v = document.getElementById('vocab'); if (v) v.style.display = 'none';
          const vt = document.getElementById('vocabTable'); if (vt) vt.style.display = 'none';
          try {
            const study = document.getElementById('tab-study');
            if (study) {
              const titles = Array.from(study.querySelectorAll('.section-title'));
              titles.forEach(el=> {
                const txt = String(el.textContent||'').trim();
                const shouldRemove = /^(Guia de Estudo|Explicação e Estrutura|Vocabulário|Vocabulário \(Pronúncia\))$/i.test(txt);
                if (shouldRemove) el.remove();
              });
              const quickCards = Array.from(study.querySelectorAll('.card')).filter(el=> el!==study);
              quickCards.forEach(el=> {
                const hasGrammar = /Gramática rápida|Resumo/i.test(el.textContent||'');
                if (hasGrammar) { el.remove(); }
              });
              const grammarCards = Array.from((document.getElementById('grammar')||study).querySelectorAll('.card'));
              grammarCards.forEach(el=> el.remove());
            }
          } catch {}
          try {
            const root = document.getElementById('slideLessonRoot');
            if (root) {
              const vocab1 = [
                ['farmer','fazendeiro'],
                ['farm','fazenda'],
                ['sister','irmã'],
                ['barn','galpão/celeiro'],
                ['cows','vacas'],
                ['chickens','galinhas'],
                ['sun','sol'],
                ['wind','vento'],
                ['happy','feliz'],
                ['big','grande'],
                ['fast','rápido'],
                ['funny','engraçado'],
                ['ready','pronto'],
                ['day','dia']
              ];
              const rows1 = vocab1.map(([en,pt])=>`<tr><td>${en}</td><td>${pt}</td><td>${toPhoneticBR(en)}</td></tr>`).join('');
              root.innerHTML = `
                <div class="section-title" style="margin-top:12px">🌾 Aula de Inglês 1 – Paul e a Fazenda (Identity & Description)</div>
                <div class="card"><div class="small">📌 Objetivo da aula: Aprender a usar o verbo To Be (am/is/are) para falar de identidade, localização e descrição na fazenda.</div></div>
                <div class="section-title" style="margin-top:12px">🔤 O verbo To Be</div>
                <div class="card">
                  <div class="small">I → am</div>
                  <div class="small" style="margin-top:6px">He/She/It → is</div>
                  <div class="small" style="margin-top:6px">You/We/They → are</div>
                  <div class="small" style="margin-top:6px"><strong>Usos principais</strong></div>
                  <div class="line" style="margin-top:6px"><div class="en">I am Paul.</div><div class="pt">Eu sou Paul.</div></div>
                  <div class="line"><div class="en">I am at the farm.</div><div class="pt">Eu estou na fazenda.</div></div>
                  <div class="line"><div class="en">The barn is open.</div><div class="pt">O galpão está aberto.</div></div>
                </div>
                <div class="section-title" style="margin-top:12px">🏗️ Estrutura da frase</div>
                <div class="card">
                  <div class="small">Ordem: Sujeito + Verbo + Complemento</div>
                  <div class="line" style="margin-top:6px"><div class="en">I am a farmer.</div><div class="pt">Eu sou fazendeiro.</div></div>
                  <div class="line"><div class="en">My sister is here.</div><div class="pt">Minha irmã está aqui.</div></div>
                  <div class="line"><div class="en">The cows are calm.</div><div class="pt">As vacas estão calmas.</div></div>
                  <div class="line"><div class="en">The chickens are fast.</div><div class="pt">As galinhas são rápidas.</div></div>
                </div>
                <div class="card" style="margin-top:8px">
                  <div class="small"><strong>⚖️ Afirmativa / Negativa / Pergunta</strong></div>
                  <div class="line" style="margin-top:6px"><div class="en">She is happy.</div><div class="pt">Ela está feliz.</div></div>
                  <div class="line"><div class="en">She is not happy.</div><div class="pt">Ela não está feliz.</div></div>
                  <div class="line"><div class="en">Is she happy?</div><div class="pt">Ela está feliz?</div></div>
                </div>
                <div class="card" style="margin-top:8px">
                  <div class="small"><strong>🧱 Estrutura</strong></div>
                  <div class="small" style="margin-top:6px">Afirmativa → Sujeito + am/is/are + complemento</div>
                  <div class="small" style="margin-top:6px">Negativa → Sujeito + am/is/are + not + complemento</div>
                  <div class="small" style="margin-top:6px">Pergunta → Am/Is/Are + sujeito + complemento</div>
                </div>
                <div class="card" style="margin-top:8px">
                  <div class="small"><strong>Dicas importantes</strong></div>
                  <div class="small" style="margin-top:6px">Em inglês, usamos To Be para idade e estados:</div>
                  <div class="line" style="margin-top:6px"><div class="en">I am 20 years old.</div><div class="pt">Eu tenho 20 anos.</div></div>
                  <div class="line"><div class="en">I am hungry.</div><div class="pt">Eu estou com fome.</div></div>
                  <div class="small" style="margin-top:6px">Diferente do português, não usamos “ter” nesses casos.</div>
                </div>
                <div class="section-title" style="margin-top:12px">📘 Vocabulário essencial da aula</div>
                <div class="card">
                  <table style="width:100%;border-collapse:collapse">
                    <thead><tr><th style="text-align:left">EN</th><th style="text-align:left">PT</th><th style="text-align:left">Pronúncia (BR)</th></tr></thead>
                    <tbody>${rows1}</tbody>
                  </table>
                </div>
                
              `;
            }
          } catch {}
        }
        if (String(level).toUpperCase()==='A1' && Number(idx)===2) {
          const g = document.getElementById('grammar'); if (g) { g.innerHTML=''; g.style.display = 'none'; }
          const v = document.getElementById('vocab'); if (v) { v.innerHTML=''; v.style.display = 'none'; }
          const vt = document.getElementById('vocabTable'); if (vt) { vt.innerHTML=''; vt.style.display = 'none'; }
          try {
            const study = document.getElementById('tab-study');
            if (study) {
              const titles = Array.from(study.querySelectorAll('.section-title'));
              titles.forEach(el=> {
                const txt = String(el.textContent||'').trim();
                const shouldRemove = /^(Guia de Estudo|Explicação e Estrutura|Estrutura \(Tradução\)|Vocabulário|Vocabulário \(Pronúncia\))$/i.test(txt);
                if (shouldRemove) el.remove();
              });
              const cards = Array.from(study.querySelectorAll('.card'));
              cards.forEach(el=> {
                const t = String(el.textContent||'');
                if (/Vocabulário|Pronúncia|Gramática rápida|Resumo/i.test(t)) el.remove();
              });
            }
          } catch {}
          try {
            const root = document.getElementById('slideLessonRoot');
            if (root) {
              const vocab2 = [
                ['livestock','pecuária/gado'],
                ['veterinarian','veterinária(o)'],
                ['bull','touro'],
                ['medical kit','kit médico'],
                ['injury','ferimento/lesão'],
                ['medicine','remédio'],
                ['body','corpo'],
                ['leg','perna'],
                ['healthy','saudável'],
                ['safe','seguro'],
                ['farm','fazenda'],
                ['cows','vacas']
              ];
              const rows2 = vocab2.map(([en,pt])=>`<tr><td>${en}</td><td>${pt}</td><td>${toPhoneticBR(en)}</td></tr>`).join('');
              root.innerHTML = `
                <div class="section-title" style="margin-top:12px">🐂 Aula de Inglês 2 – A Visita da Veterinária (Livestock & Health)</div>
                <div class="card"><div class="small">📌 Objetivo da aula: Aprender a usar o verbo To Have no presente para falar de posse e características físicas dos animais e da fazenda.</div></div>
                <div class="section-title" style="margin-top:12px">🔤 O verbo To Have</div>
                <div class="card">
                  <div class="small">I/You/We/They → have</div>
                  <div class="small" style="margin-top:6px">He/She/It → has</div>
                  <div class="small" style="margin-top:6px"><strong>Usos principais</strong></div>
                  <div class="line" style="margin-top:6px"><div class="en">I have a livestock farm.</div><div class="pt">Eu tenho uma fazenda de pecuária.</div></div>
                  <div class="line"><div class="en">The bull has a strong body.</div><div class="pt">O touro tem um corpo forte.</div></div>
                </div>
                <div class="section-title" style="margin-top:12px">🏗️ Estrutura da frase</div>
                <div class="card">
                  <div class="small">Ordem: Sujeito + Verbo + Complemento</div>
                  <div class="line" style="margin-top:6px"><div class="en">We have many cows here.</div><div class="pt">Nós temos muitas vacas aqui.</div></div>
                  <div class="line"><div class="en">She has a medical kit.</div><div class="pt">Ela tem um kit médico.</div></div>
                  <div class="line"><div class="en">The bull has a small injury on the leg.</div><div class="pt">O touro tem um ferimento pequeno na perna.</div></div>
                </div>
                <div class="card" style="margin-top:8px">
                  <div class="small"><strong>⚖️ Afirmativa / Negativa / Pergunta</strong></div>
                  <div class="line" style="margin-top:6px"><div class="en">The bull has a strong body.</div><div class="pt">O touro tem um corpo forte.</div></div>
                  <div class="line"><div class="en">The bull doesn't have a strong body.</div><div class="pt">O touro não tem um corpo forte.</div></div>
                  <div class="line"><div class="en">Does the bull have a strong body?</div><div class="pt">O touro tem um corpo forte?</div></div>
                </div>
                <div class="card" style="margin-top:8px">
                  <div class="small"><strong>🧱 Estrutura</strong></div>
                  <div class="small" style="margin-top:6px">Afirmativa → Sujeito + have/has + complemento</div>
                  <div class="small" style="margin-top:6px">Negativa → Sujeito + don't/doesn't + have + complemento</div>
                  <div class="small" style="margin-top:6px">Pergunta → Do/Does + sujeito + have + complemento</div>
                </div>
                <div class="card" style="margin-top:8px">
                  <div class="small"><strong>Regra prática</strong></div>
                  <div class="small" style="margin-top:6px">Se o sujeito for He/She/It, use has.</div>
                  <div class="small" style="margin-top:6px">Em negativas e perguntas, o verbo volta para have, porque o s já está no auxiliar (does/doesn’t).</div>
                  <div class="line" style="margin-top:6px"><div class="en">She has a medical kit.</div><div class="pt">Ela tem um kit médico.</div></div>
                  <div class="line"><div class="en">Does she have a medical kit?</div><div class="pt">Ela tem um kit médico?</div></div>
                  <div class="line"><div class="en">The bull doesn't have an injury.</div><div class="pt">O touro não tem uma lesão.</div></div>
                </div>
                <div class="section-title" style="margin-top:12px">📘 Vocabulário essencial da aula</div>
                <div class="card">
                  <table style="width:100%;border-collapse:collapse">
                    <thead><tr><th style="text-align:left">EN</th><th style="text-align:left">PT</th><th style="text-align:left">Pronúncia (BR)</th></tr></thead>
                    <tbody>${rows2}</tbody>
                  </table>
                </div>
                
              `;
            }
          } catch {}
        }
        if (String(level).toUpperCase()==='A1' && Number(idx)===3) {
          // Padroniza a aba de estudo do texto 3 para seguir mesma configuração do texto 1 e 2
          try {
            const g = document.getElementById('grammar'); if (g) { g.innerHTML=''; g.style.display = 'none'; }
            const v = document.getElementById('vocab'); if (v) { v.innerHTML=''; v.style.display = 'none'; }
            const vt = document.getElementById('vocabTable'); if (vt) { vt.innerHTML=''; vt.style.display = 'none'; }
          } catch {}
          try {
            const study = document.getElementById('tab-study');
            if (study) {
              const skipIds = new Set(['slideLessonRoot','grammarVideo']);
              const titles = Array.from(study.querySelectorAll('.section-title'));
              titles.forEach(el=>{
                const txt = String(el.textContent||'').trim();
                const shouldRemove = /^(Guia de Estudo|Explicação e Estrutura|Estrutura \(Tradução\)|Vocabulário|Vocabulário \(Pronúncia\))$/i.test(txt);
                if (shouldRemove) {
                  const next = el.nextElementSibling;
                  if (next && next.id && skipIds.has(next.id)) {
                    // não remover vídeo/cenas nem container de slides
                  } else if (next && next.classList && next.classList.contains('card')) {
                    next.remove();
                  }
                  el.remove();
                }
              });
              const cards = Array.from(study.querySelectorAll('.card'));
              cards.forEach(el=>{
                const t = String(el.textContent||'');
                if (/Vocabulário|Pronúncia|Gramática rápida|Resumo/i.test(t)) el.remove();
              });
            }
          } catch {}
          try {
            const root = document.getElementById('slideLessonRoot');
            if (root) {
              const vocab3 = [
                ['start','começar'],
                ['walk','andar'],
                ['eat','comer'],
                ['drink','beber'],
                ['check','conferir'],
                ['feed','alimentar'],
                ['need','precisar'],
                ['pasture','pasto'],
                ['calf','bezerro'],
                ['water tanks','bebedouros/tanques'],
                ['corn','milho'],
                ['farm worker','trabalhador rural/peão'],
                ['grass','capim'],
                ['pigs','porcos']
              ];
              const rows3 = vocab3.map(([en,pt])=>`<tr><td>${en}</td><td>${pt}</td><td>${toPhoneticBR(en)}</td></tr>`).join('');
              root.innerHTML = `
                <div class=\"section-title\" style=\"margin-top:12px\">🍽️ Aula de Inglês 3 – Rotina de Alimentação (Daily Feeding Routine)</div>
                <div class=\"card\"><div class=\"small\">📌 Objetivo da aula: Aprender a usar o Present Simple para descrever ações e hábitos diários na fazenda, como alimentar animais, verificar água e iniciar o trabalho.</div></div>
                <div class=\"section-title\" style=\"margin-top:12px\">📗 Present Simple</div>
                <div class=\"card\">
                  <div class=\"small\">I/You/We/They → verbo na forma base (eat, drink, start).</div>
                  <div class=\"small\" style=\"margin-top:6px\">He/She/It → verbo + s/es (feeds, drinks, walks).</div>
                  <div class=\"line\" style=\"margin-top:6px\"><div class=\"en\">The cows walk to the pasture.</div><div class=\"pt\">As vacas caminham para o pasto.</div></div>
                  <div class=\"line\"><div class=\"en\">The calf drinks milk.</div><div class=\"pt\">O bezerro bebe leite.</div></div>
                </div>
                <div class=\"section-title\" style=\"margin-top:12px\">🏗️ Estrutura da frase</div>
                <div class=\"card\">
                  <div class=\"small\">Ordem: Sujeito + Verbo + Complemento</div>
                  <div class=\"line\" style=\"margin-top:6px\"><div class=\"en\">I check the water tanks.</div><div class=\"pt\">Eu confiro os bebedouros/tanques de água.</div></div>
                  <div class=\"line\"><div class=\"en\">We start work at 6:00 AM.</div><div class=\"pt\">Nós começamos o trabalho às 6:00.</div></div>
                  <div class=\"line\"><div class=\"en\">The farm worker feeds the pigs.</div><div class=\"pt\">O trabalhador rural alimenta os porcos.</div></div>
                </div>
                <div class=\"card\" style=\"margin-top:8px\">
                  <div class=\"small\"><strong>⚖️ Afirmativa / Negativa / Pergunta</strong></div>
                  <div class=\"line\" style=\"margin-top:6px\"><div class=\"en\">The small calf drinks milk.</div><div class=\"pt\">O bezerro pequeno bebe leite.</div></div>
                  <div class=\"line\"><div class=\"en\">The small calf doesn't drink milk.</div><div class=\"pt\">O bezerro pequeno não bebe leite.</div></div>
                  <div class=\"line\"><div class=\"en\">Does the small calf drink milk?</div><div class=\"pt\">O bezerro pequeno bebe leite?</div></div>
                </div>
                <div class=\"card\" style=\"margin-top:8px\">
                  <div class=\"small\"><strong>🧱 Estrutura</strong></div>
                  <div class=\"small\" style=\"margin-top:6px\">Afirmativa → Sujeito + verbo base (+s para He/She/It) + complemento</div>
                  <div class=\"small\" style=\"margin-top:6px\">Negativa → Sujeito + don't/doesn't + verbo base + complemento</div>
                  <div class=\"small\" style=\"margin-top:6px\">Pergunta → Do/Does + sujeito + verbo base + complemento</div>
                </div>
                <div class=\"card\" style=\"margin-top:8px\">
                  <div class=\"small\"><strong>Regra He/She/It (+s)</strong></div>
                  <div class=\"small\" style=\"margin-top:6px\">Para He/She/It, acrescenta-se s/es ao verbo. Em negativas e perguntas, o s vai para o auxiliar (does/doesn't) e o verbo volta à forma base.</div>
                  <div class=\"line\" style=\"margin-top:6px\"><div class=\"en\">The calf drinks milk.</div><div class=\"pt\">O bezerro bebe leite.</div></div>
                  <div class=\"line\"><div class=\"en\">Does the calf drink milk?</div><div class=\"pt\">O bezerro bebe leite?</div></div>
                  <div class=\"line\"><div class=\"en\">The farm worker feeds the pigs.</div><div class=\"pt\">O trabalhador rural alimenta os porcos.</div></div>
                </div>
                <div class=\"section-title\" style=\"margin-top:12px\">📘 Vocabulário essencial da rotina</div>
                <div class=\"card\">
                  <table style=\"width:100%;border-collapse:collapse\">
                    <thead><tr><th style=\"text-align:left\">EN</th><th style=\"text-align:left\">PT</th><th style=\"text-align:left\">Pronúncia (BR)</th></tr></thead>
                    <tbody>${rows3}</tbody>
                  </table>
                </div>
                
              `;
            }
          } catch {}
        }
        if (String(level).toUpperCase()==='A1' && Number(idx)===4) {
          try {
            const g = document.getElementById('grammar'); if (g) { g.innerHTML=''; g.style.display = 'none'; }
            const v = document.getElementById('vocab'); if (v) { v.innerHTML=''; v.style.display = 'none'; }
            const vt = document.getElementById('vocabTable'); if (vt) { vt.innerHTML=''; vt.style.display = 'none'; }
          } catch {}
          try {
            const study = document.getElementById('tab-study');
            if (study) {
              const keepIds = new Set(['grammarVideo','slideLessonRoot','study-footer']);
              const titles = Array.from(study.querySelectorAll('.section-title'));
              titles.forEach(el=>{
                const txt = String(el.textContent||'').trim();
                const keep = /^(Texto narrado)$/i.test(txt);
                if (!keep) {
                  const next = el.nextElementSibling;
                  if (next && next.id && keepIds.has(next.id)) {
                    // manter blocos essenciais
                  } else {
                    if (next && next.classList && next.classList.contains('card')) next.remove();
                    el.remove();
                  }
                }
              });
              const cards = Array.from(study.querySelectorAll('.card'));
              cards.forEach(el=>{
                if (el.id && keepIds.has(el.id)) return;
                if (el.closest('#grammarVideo')) return; // manter vídeo narrado (card dentro do wrapper)
                if (el.closest('#slideLessonRoot')) return; // manter slides
                if (el.closest('#study-footer')) return; // manter texto narrado e voz
                el.remove();
              });
            }
          } catch {}
        }
        if (String(level).toUpperCase()==='A1' && Number(idx)===4) {
          try {
            const root = document.getElementById('slideLessonRoot');
            if (root) {
              const vocab = [
                ['tractor','trator'],
                ['harvester','colheitadeira'],
                ['machine','máquina'],
                ['shed','galpão'],
                ['soybeans','soja'],
                ['field','campo/talhão'],
                ['soil','solo'],
                ['seeds','sementes'],
                ['harvest season','safra'],
                ['humid','úmido'],
                ['dry','seco'],
                ['heavy','pesado'],
                ['plant','plantar'],
                ['drive','dirigir/operar'],
                ['work','trabalhar']
              ];
              const rows = vocab.map(([en,pt])=>`<tr><td>${en}</td><td>${pt}</td><td>${toPhoneticBR(en)}</td></tr>`).join('');
              root.innerHTML = `
                <div class="section-title" style="margin-top:12px">🚜 Aula de Inglês 4 – O Trator e o Campo (Machinery & Crops)</div>
                <div class="card"><div class="small">📌 Objetivo da aula: Aprender como usar adjetivos e o Present Simple para descrever máquinas, campos e condições da fazenda.</div></div>
                <div class="section-title" style="margin-top:12px">🎨 Adjetivos na frase</div>
                <div class="card">
                  <div class="small">Em inglês, o adjetivo pode aparecer:</div>
                  <ul class="list-disc pl-5 text-sm mt-1 space-y-1">
                    <li><code>The tractor is green.</code> <span class="text-gray-600">→ O trator é verde.</span></li>
                    <li><code>The green tractor.</code> <span class="text-gray-600">→ O trator verde.</span></li>
                  </ul>
                  <div class="small" style="margin-top:6px">👉 Regra geral: em inglês, o adjetivo costuma vir antes do substantivo.</div>
                </div>
                <div class="section-title" style="margin-top:12px">🏗️ Estrutura da frase</div>
                <div class="card">
                  <div class="small">Ordem: Sujeito + Verbo + Complemento</div>
                  <div class="line" style="margin-top:6px"><div class="en">I drive the green tractor.</div><div class="pt">Eu dirijo o trator verde.</div></div>
                  <div class="line"><div class="en">We plant soybeans in the large field.</div><div class="pt">Nós plantamos soja no campo grande.</div></div>
                  <div class="line"><div class="en">The machine is very strong and heavy.</div><div class="pt">A máquina é muito forte e pesada.</div></div>
                </div>
                <div class="card" style="margin-top:8px">
                  <div class="small"><strong>⚖️ Afirmativa / Negativa / Pergunta</strong></div>
                  <div class="line" style="margin-top:6px"><div class="en">I drive the green tractor.</div><div class="pt">Eu dirijo o trator verde.</div></div>
                  <div class="line"><div class="en">I don't drive the green tractor.</div><div class="pt">Eu não dirijo o trator verde.</div></div>
                  <div class="line"><div class="en">Do I drive the green tractor?</div><div class="pt">Eu dirijo o trator verde?</div></div>
                </div>
                <div class="card" style="margin-top:8px">
                  <div class="small"><strong>Estruturas</strong></div>
                  <div class="small" style="margin-top:6px">Afirmativa → Sujeito + verbo base (+s para He/She/It) + complemento</div>
                  <div class="small" style="margin-top:6px">Negativa → Sujeito + don't/doesn't + verbo base + complemento</div>
                  <div class="small" style="margin-top:6px">Pergunta → Do/Does + sujeito + verbo base + complemento</div>
                </div>
                <div class="card" style="margin-top:8px">
                  <div class="small"><strong>Regra He/She/It (+s)</strong></div>
                  <div class="small" style="margin-top:6px">Para He/She/It, acrescenta-se s/es ao verbo.</div>
                  <div class="line" style="margin-top:6px"><div class="en">It is new.</div><div class="pt">Ele é novo.</div></div>
                  <div class="line"><div class="en">The soil is good today.</div><div class="pt">O solo está bom hoje.</div></div>
                  <div class="line"><div class="en">It is humid, not dry.</div><div class="pt">Está úmido, não seco.</div></div>
                  <div class="line"><div class="en">The harvester is in the shed.</div><div class="pt">A colheitadeira está no galpão.</div></div>
                </div>
                <div class="section-title" style="margin-top:12px">📘 Vocabulário essencial da fazenda</div>
                <div class="card">
                  <table style="width:100%;border-collapse:collapse">
                    <thead><tr><th style="text-align:left">EN</th><th style="text-align:left">PT</th><th style="text-align:left">Pronúncia (BR)</th></tr></thead>
                    <tbody>${rows}</tbody>
                  </table>
                </div>
                
              `;
            }
          } catch {}
        }
        if (String(level).toUpperCase()==='A1' && Number(idx)===5) {
          try {
            const g = document.getElementById('grammar'); if (g) { g.innerHTML=''; g.style.display = 'none'; }
            const v = document.getElementById('vocab'); if (v) { v.innerHTML=''; v.style.display = 'none'; }
            const vt = document.getElementById('vocabTable'); if (vt) { vt.innerHTML=''; vt.style.display = 'none'; }
          } catch {}
          try {
            const study = document.getElementById('tab-study');
            if (study) {
              const keepIds = new Set(['grammarVideo','slideLessonRoot','study-footer']);
              const titles = Array.from(study.querySelectorAll('.section-title'));
              titles.forEach(el=>{
                if (el.closest('#grammarVideo')) return;
                const txt = String(el.textContent||'').trim();
                const keep = /^(Texto narrado)$/i.test(txt);
                if (!keep) {
                  const next = el.nextElementSibling;
                  if (next && next.id && keepIds.has(next.id)) {
                  } else {
                    if (next && next.classList && next.classList.contains('card')) next.remove();
                    el.remove();
                  }
                }
              });
              const cards = Array.from(study.querySelectorAll('.card'));
              cards.forEach(el=>{
                if (el.id && keepIds.has(el.id)) return;
                if (el.closest('#grammarVideo')) return;
                if (el.closest('#slideLessonRoot')) return;
                if (el.closest('#study-footer')) return;
                el.remove();
              });
            }
          } catch {}
        }
      } catch {}
      try { const vEl = document.querySelector('#verbs'); if (vEl) vEl.remove(); } catch {}
      try {
        const curLevelNow = (location.hash.split('/')[2]||'').toUpperCase();
        const activeTabNow = (function(){ try { return localStorage.getItem('lastTab')||'study' } catch { return 'study' } })();
        if (curLevelNow !== 'A1' && activeTabNow==='practice') {
          try { renderMC(data); } catch (e) { console.error('Error in renderMC:', e); }
          try { renderFill(data); } catch (e) { console.error('Error in renderFill:', e); }
        }
        try { renderVocabTable(data); } catch (e) { console.error('Error in renderVocabTable:', e); }
      } catch {}
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
            ${String(level).toUpperCase()==='A1' && Number((location.hash.split('/')[3]||'1'))===1 ? `
            <div class="section-title" style="margin-top:12px">True or False (3 itens)</div>
            <div class="card">
              <div>1. Paul is a farmer. <span class="small" id="tf1"></span></div>
              <div style="margin-top:6px">2. The chickens are calm. <span class="small" id="tf2"></span></div>
              <div style="margin-top:6px">3. The barn is open. <span class="small" id="tf3"></span></div>
              <div style="margin-top:8px"><button class="btn" id="checkTF">Checar</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Complete com Am / Is / Are</div>
            <div class="card">
              <div>1. I ___ Paul.</div>
              <div style="margin-top:6px">2. The barn ___ open.</div>
              <div style="margin-top:6px">3. The cows ___ calm.</div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A1' && Number((location.hash.split('/')[3]||'1'))===2 ? `
            <div class="section-title" style="margin-top:12px">True or False (3 itens)</div>
            <div class="card">
              <div>1. The veterinarian has a medical kit. <span class="small" id="tf21"></span></div>
              <div style="margin-top:6px">2. The bull has a big injury on the leg. <span class="small" id="tf22"></span></div>
              <div style="margin-top:6px">3. We have safe and healthy animals now. <span class="small" id="tf23"></span></div>
              <div style="margin-top:8px"><button class="btn" id="checkTF2">Checar</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Complete com HAVE / HAS</div>
            <div class="card">
              <div>1. We ___ many cows.</div>
              <div style="margin-top:6px">2. She ___ a medical kit.</div>
              <div style="margin-top:6px">3. The bull ___ a strong body.</div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A1' && Number((location.hash.split('/')[3]||'1'))===3 ? `
            <div class="section-title" style="margin-top:12px">True or False (3 itens)</div>
            <div class="card">
              <div>1. We start work at 6:00 AM. <span class="small" id="tf31"></span></div>
              <div style="margin-top:6px">2. The cows walk to the barn. <span class="small" id="tf32"></span></div>
              <div style="margin-top:6px">3. The farm worker feeds the pigs. <span class="small" id="tf33"></span></div>
              <div style="margin-top:8px"><button class="btn" id="checkTF3">Checar</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Complete com DO / DOES</div>
            <div class="card">
              <div>1. ___ the cows walk to the pasture?</div>
              <div style="margin-top:6px">2. The calf ___ drink milk.</div>
              <div style="margin-top:6px">3. ___ we clean the feeding area?</div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='C1' && Number((location.hash.split('/')[3]||'1'))===1 ? `
            <div class="section-title" style="margin-top:12px">Transforme Ativa → Passiva Impessoal (3 itens)</div>
            <div class="card">
              <div>1. Researchers think that feed conversion is improving → <span class="small" id="ip11"></span></div>
              <div style="margin-top:6px">2. Scientists estimate that demand will double → <span class="small" id="ip12"></span></div>
              <div style="margin-top:6px">3. Reports say that gene editing eliminates diseases → <span class="small" id="ip13"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showIP1C1">Ver reescritas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Reescreva com sujeito + passiva + to‑infinitive (3 itens)</div>
            <div class="card">
              <div>1. It is said that the bull is strong → <span class="small" id="to11"></span></div>
              <div style="margin-top:6px">2. It is believed that precise breeding mitigates impact → <span class="small" id="to12"></span></div>
              <div style="margin-top:6px">3. It is acknowledged that genetic selection is the cornerstone → <span class="small" id="to13"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showTO1C1">Ver respostas</button></div>
            </div>
            ` : ''}
          ${String(level).toUpperCase()==='B1' && Number((location.hash.split('/')[3]||'1'))===8 ? `
            <div class="section-title" style="margin-top:12px">Complete com JUST / ALREADY / YET (3 itens)</div>
            <div class="card">
              <div>1. I have ___ finished checking the tanks. <span class="small" id="jy81"></span></div>
              <div style="margin-top:6px">2. Have you called the supplier ___? <span class="small" id="jy82"></span></div>
              <div style="margin-top:6px">3. We have ___ done half of the work. <span class="small" id="jy83"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showJY8">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Transforme (3 itens)</div>
            <div class="card">
              <div>1. Eu acabei de ligar para o fornecedor → <span class="small" id="tr81"></span></div>
              <div style="margin-top:6px">2. Eles já chegaram? → <span class="small" id="tr82"></span></div>
              <div style="margin-top:6px">3. Nós já fizemos metade do trabalho → <span class="small" id="tr83"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showTR8">Ver exemplos</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='B1' && Number((location.hash.split('/')[3]||'1'))===9 ? `
            <div class="section-title" style="margin-top:12px">FOR ou SINCE? (3 itens)</div>
            <div class="card">
              <div>1. I have worked here ___ fifteen years. <span class="small" id="fs91"></span></div>
              <div style="margin-top:6px">2. He has been here ___ two months. <span class="small" id="fs92"></span></div>
              <div style="margin-top:6px">3. It hasn't rained ___ September. <span class="small" id="fs93"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showFS9">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Tradução correta (3 itens)</div>
            <div class="card">
              <div>1. Faz 10 anos que moro aqui → <span class="small" id="tr91"></span></div>
              <div style="margin-top:6px">2. Desde 2010, eu moro nesta casa → <span class="small" id="tr92"></span></div>
              <div style="margin-top:6px">3. Nós usamos John Deere há muito tempo → <span class="small" id="tr93"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showTR9">Ver exemplos</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='B1' && Number((location.hash.split('/')[3]||'1'))===10 ? `
            <div class="section-title" style="margin-top:12px">Troque WILL → MIGHT (3 itens)</div>
            <div class="card">
              <div>1. It will rain later → <span class="small" id="wm101"></span></div>
              <div style="margin-top:6px">2. The price of soybeans will rise → <span class="small" id="wm102"></span></div>
              <div style="margin-top:6px">3. We will hire more workers → <span class="small" id="wm103"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showWM10">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Situações de risco (use COULD)</div>
            <div class="card">
              <div>1. The wind ___ damage the corn stalks → <span class="small" id="rc101"></span></div>
              <div style="margin-top:6px">2. The tractor ___ break → <span class="small" id="rc102"></span></div>
              <div style="margin-top:6px">3. The price ___ drop → <span class="small" id="rc103"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showRC10">Ver exemplos</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='B1' && Number((location.hash.split('/')[3]||'1'))===11 ? `
            <div class="section-title" style="margin-top:12px">Transforme em discurso indireto (3 itens)</div>
            <div class="card">
              <div>1. Boss: "Clean the barn" → He told me ___ the barn. <span class="small" id="rs111"></span></div>
              <div style="margin-top:6px">2. Owner: "Speed up the planting" → He told us ___ the planting. <span class="small" id="rs112"></span></div>
              <div style="margin-top:6px">3. Mechanic: "Fix the brakes immediately" → He told the mechanic ___ the brakes immediately. <span class="small" id="rs113"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showRS11">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Escolha SAID ou TOLD (3 itens)</div>
            <div class="card">
              <div>1. He [said/told] that the rain was coming. <span class="small" id="st111"></span></div>
              <div style="margin-top:6px">2. He [said/told] us to speed up. <span class="small" id="st112"></span></div>
              <div style="margin-top:6px">3. He [said/told] me the news. <span class="small" id="st113"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showST11">Ver respostas</button></div>
            </div>
            ` : ''}
          ${String(level).toUpperCase()==='B1' && Number((location.hash.split('/')[3]||'1'))===12 ? `
            <div class="section-title" style="margin-top:12px">Complete a Tag Question (3 itens)</div>
            <div class="card">
              <div>1. The harvester is ready, ___? <span class="small" id="tg121"></span></div>
              <div style="margin-top:6px">2. You didn't find any leaks, ___? <span class="small" id="tg122"></span></div>
              <div style="margin-top:6px">3. We can start the engine now, ___? <span class="small" id="tg123"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showTG12">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Confirme a informação (3 itens)</div>
            <div class="card">
              <div>1. Tanque cheio → <span class="small" id="cf121"></span></div>
              <div style="margin-top:6px">2. Piso limpo → <span class="small" id="cf122"></span></div>
              <div style="margin-top:6px">3. Operador com o mapa → <span class="small" id="cf123"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showCF12">Ver exemplos</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='B2' && Number((location.hash.split('/')[3]||'1'))===1 ? `
            <div class="section-title" style="margin-top:12px">Reescreva trocando Although → Despite (3 itens)</div>
            <div class="card">
              <div>1. Although it is traditional, conventional tillage causes erosion. → <span class="small" id="cd11"></span></div>
              <div style="margin-top:6px">2. Although no-till is challenging, the benefits are undeniable. → <span class="small" id="cd12"></span></div>
              <div style="margin-top:6px">3. Although the machinery is expensive, we save money on fuel. → <span class="small" id="cd13"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showCD1">Ver reescritas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Complete argumentos técnicos (3 itens)</div>
            <div class="card">
              <div>1. Despite the high price, the tractor is ___ → <span class="small" id="ag11"></span></div>
              <div style="margin-top:6px">2. Despite the initial challenge, the long-term plan is ___ → <span class="small" id="ag12"></span></div>
              <div style="margin-top:6px">3. Despite lower first-year yield, soil management is ___ → <span class="small" id="ag13"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showAG1">Ver exemplos</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='B2' && Number((location.hash.split('/')[3]||'1'))===2 ? `
            <div class="section-title" style="margin-top:12px">Transforme Do → Have/Get done (3 itens)</div>
            <div class="card">
              <div>1. I cut the grass → <span class="small" id="ca21"></span></div>
              <div style="margin-top:6px">2. We test the soil → <span class="small" id="ca22"></span></div>
              <div style="margin-top:6px">3. They fix the pump → <span class="small" id="ca23"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showCA2">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Situações de gestão (3 itens)</div>
            <div class="card">
              <div>1. Telhado com vazamento → <span class="small" id="mg21"></span></div>
              <div style="margin-top:6px">2. Relatórios pendentes → <span class="small" id="mg22"></span></div>
              <div style="margin-top:6px">3. Cerca antiga quebrada → <span class="small" id="mg23"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showMG2">Ver exemplos</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='B2' && Number((location.hash.split('/')[3]||'1'))===3 ? `
            <div class="section-title" style="margin-top:12px">Situações de mistério (3 deduções)</div>
            <div class="card">
              <div>1. Tank vazio, sem vazamento → <span class="small" id="md31"></span></div>
              <div style="margin-top:6px">2. Log de irrigação regular, plantas secas → <span class="small" id="md32"></span></div>
              <div style="margin-top:6px">3. Temperatura amena, folhas amareladas → <span class="small" id="md33"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showMD3">Ver deduções</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Tradução: descartar hipóteses (3 itens)</div>
            <div class="card">
              <div>1. Não pode ter sido falta de água → <span class="small" id="nh31"></span></div>
              <div style="margin-top:6px">2. Não pode ter sido a temperatura → <span class="small" id="nh32"></span></div>
              <div style="margin-top:6px">3. Não pode ter sido o clima → <span class="small" id="nh33"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showNH3">Ver traduções</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='B2' && Number((location.hash.split('/')[3]||'1'))===4 ? `
            <div class="section-title" style="margin-top:12px">Timeline 2030 (3 previsões)</div>
            <div class="card">
              <div>1. By 2030, we [finish] ___ the expansion → <span class="small" id="tl41"></span></div>
              <div style="margin-top:6px">2. By 2030, they [upgrade] ___ the irrigation system → <span class="small" id="tl42"></span></div>
              <div style="margin-top:6px">3. By 2030, the team [implement] ___ precision agriculture → <span class="small" id="tl43"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showTL4">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Complete com BY ou IN (3 itens)</div>
            <div class="card">
              <div>1. We will start ___ June → <span class="small" id="bi41"></span></div>
              <div style="margin-top:6px">2. We will have finished ___ next Friday → <span class="small" id="bi42"></span></div>
              <div style="margin-top:6px">3. The reports will be ready ___ the afternoon → <span class="small" id="bi43"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showBI4">Ver respostas</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='B2' && Number((location.hash.split('/')[3]||'1'))===5 ? `
            <div class="section-title" style="margin-top:12px">Transforme Direta → Indireta (3 itens)</div>
            <div class="card">
              <div>1. Where is the boss? → <span class="small" id="iq51"></span></div>
              <div style="margin-top:6px">2. What time does the truck arrive? → <span class="small" id="iq52"></span></div>
              <div style="margin-top:6px">3. Is the invoice approved? → <span class="small" id="iq53"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showIQ5">Ver reescritas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Escolha a frase de e-mail (3 itens)</div>
            <div class="card">
              <div>1. [Where is the cargo? / Could you tell me where the cargo is?] → <span class="small" id="em51"></span></div>
              <div style="margin-top:6px">2. [Is it approved? / Do you know if it is approved?] → <span class="small" id="em52"></span></div>
              <div style="margin-top:6px">3. [What time is the truck? / Do you know what time the truck arrives?] → <span class="small" id="em53"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showEM5">Ver opções</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='B2' && Number((location.hash.split('/')[3]||'1'))===6 ? `
            <div class="section-title" style="margin-top:12px">Substitua formal → phrasal verb (3 itens)</div>
            <div class="card">
              <div>1. Please [investigate] ___ the noise → <span class="small" id="pv61"></span></div>
              <div style="margin-top:6px">2. Do not [postpone] ___ the repair → <span class="small" id="pv62"></span></div>
              <div style="margin-top:6px">3. We must [perform] ___ a full inspection → <span class="small" id="pv63"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showPV6">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Situações de emergência (3 itens)</div>
            <div class="card">
              <div>1. The tractor ___ this morning → <span class="small" id="em61"></span></div>
              <div style="margin-top:6px">2. We are ___ diesel → <span class="small" id="em62"></span></div>
              <div style="margin-top:6px">3. We must ___ with the schedule → <span class="small" id="em63"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showEM6">Ver respostas</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='B2' && Number((location.hash.split('/')[3]||'1'))===7 ? `
            <div class="section-title" style="margin-top:12px">Una frases com vírgulas (3 itens)</div>
            <div class="card">
              <div>1. The boss is here. He is old. → <span class="small" id="rc71"></span></div>
              <div style="margin-top:6px">2. The red tractor is expensive. It was imported from the USA. → <span class="small" id="rc72"></span></div>
              <div style="margin-top:6px">3. Silo 3 is full. We stored soybeans there. → <span class="small" id="rc73"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showRC7">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Corrija o erro do THAT (3 itens)</div>
            <div class="card">
              <div>1. The car, that is blue, is mine → <span class="small" id="th71"></span></div>
              <div style="margin-top:6px">2. Mr. Jones, that manages logistics, is on leave → <span class="small" id="th72"></span></div>
              <div style="margin-top:6px">3. The barn, that is old, needs insurance → <span class="small" id="th73"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showTH7">Ver correções</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='B2' && Number((location.hash.split('/')[3]||'1'))===8 ? `
            <div class="section-title" style="margin-top:12px">Conecte causa e efeito no passado (3 itens)</div>
            <div class="card">
              <div>1. I didn't study → <span class="small" id="tc81"></span></div>
              <div style="margin-top:6px">2. We applied fungicide late → <span class="small" id="tc82"></span></div>
              <div style="margin-top:6px">3. The manager didn't check the forecast → <span class="small" id="tc83"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showTC8">Ver exemplos</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Crie frases "Se tivéssemos..." (3 itens)</div>
            <div class="card">
              <div>1. Tractor without oil → <span class="small" id="sf81"></span></div>
              <div style="margin-top:6px">2. Prices dropped in March → <span class="small" id="sf82"></span></div>
              <div style="margin-top:6px">3. Application delayed → <span class="small" id="sf83"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showSF8">Ver respostas</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='B2' && Number((location.hash.split('/')[3]||'1'))===9 ? `
            <div class="section-title" style="margin-top:12px">Toma lá, dá cá (3 trocas)</div>
            <div class="card">
              <div>1. If you lower the price, we ___ the order → <span class="small" id="ng91"></span></div>
              <div style="margin-top:6px">2. If we pay upfront, can you ___ a discount? → <span class="small" id="ng92"></span></div>
              <div style="margin-top:6px">3. If we buy in bulk, you ___ 10% → <span class="small" id="ng93"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showNG9">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Recuse educadamente (3 itens)</div>
            <div class="card">
              <div>1. Oferta cara → <span class="small" id="pr91"></span></div>
              <div style="margin-top:6px">2. Termos ruins → <span class="small" id="pr92"></span></div>
              <div style="margin-top:6px">3. Precisamos do meio termo → <span class="small" id="pr93"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showPR9">Ver exemplos</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='B2' && Number((location.hash.split('/')[3]||'1'))===10 ? `
            <div class="section-title" style="margin-top:12px">Reescreva com reporting verbs (3 itens)</div>
            <div class="card">
              <div>1. "Let's buy a new truck" → <span class="small" id="rv101"></span></div>
              <div style="margin-top:6px">2. "We should vaccinate the calves now" → <span class="small" id="rv102"></span></div>
              <div style="margin-top:6px">3. "I hit the fence" → <span class="small" id="rv103"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showRV10">Ver reescritas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Escolha o padrão correto (3 itens)</div>
            <div class="card">
              <div>1. She agreed [helping / to help] the logistics team → <span class="small" id="ch101"></span></div>
              <div style="margin-top:6px">2. They decided [to postpone / postponing] the planting → <span class="small" id="ch102"></span></div>
              <div style="margin-top:6px">3. He denied [driving / to drive] too fast → <span class="small" id="ch103"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showCH10">Ver respostas</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='B2' && Number((location.hash.split('/')[3]||'1'))===11 ? `
            <div class="section-title" style="margin-top:12px">Transforme ativa → passiva com modais (3 itens)</div>
            <div class="card">
              <div>1. We must clean the tank → <span class="small" id="pm111"></span></div>
              <div style="margin-top:6px">2. They should move the animals → <span class="small" id="pm112"></span></div>
              <div style="margin-top:6px">3. We can solve the issue → <span class="small" id="pm113"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showPM11">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Ordens de segurança (3 itens)</div>
            <div class="card">
              <div>1. The fire ___ immediately → <span class="small" id="sc111"></span></div>
              <div style="margin-top:6px">2. Contaminated water ___ for irrigation → <span class="small" id="sc112"></span></div>
              <div style="margin-top:6px">3. The main valve ___ right now → <span class="small" id="sc113"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showSC11">Ver exemplos</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='B2' && Number((location.hash.split('/')[3]||'1'))===12 ? `
            <div class="section-title" style="margin-top:12px">Complete com conectivos formais (3 itens)</div>
            <div class="card">
              <div>1. The machine is fast; ___, it is cheap → <span class="small" id="co121"></span></div>
              <div style="margin-top:6px">2. The system wastes energy; ___, we must upgrade → <span class="small" id="co122"></span></div>
              <div style="margin-top:6px">3. We will save 30%; ___, ROI will be fast → <span class="small" id="co123"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showCO12">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Argumentos de venda (3 itens)</div>
            <div class="card">
              <div>1. We should buy this because it will bring ___ → <span class="small" id="sa121"></span></div>
              <div style="margin-top:6px">2. We should upgrade because it will give ___ → <span class="small" id="sa122"></span></div>
              <div style="margin-top:6px">3. We should invest because it will ___ in two years → <span class="small" id="sa123"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showSA12">Ver exemplos</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A1' && Number((location.hash.split('/')[3]||'1'))===6 ? `
            <div class="section-title" style="margin-top:12px">Complete com There is / There are</div>
            <div class="card">
              <div>1. The shed ___ bags of corn. <input id="st61" class="blank" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px;width:120px" placeholder="there is/are"> <span class="small" id="st61r"></span></div>
              <div style="margin-top:6px">2. There ___ one tractor. <input id="st62" class="blank" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px;width:120px" placeholder="there is/are"> <span class="small" id="st62r"></span></div>
              <div style="margin-top:6px">3. In the field ___ twenty cows. <input id="st63" class="blank" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px;width:120px" placeholder="there is/are"> <span class="small" id="st63r"></span></div>
              <div style="margin-top:8px"><button class="btn" id="checkST6">Checar</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Matemática simples em inglês</div>
            <div class="card">
              <div>1. Five + Five = Ten <span class="small" id="sm61"></span></div>
              <div style="margin-top:6px">2. Ten + Ten = Twenty <span class="small" id="sm62"></span></div>
              <div style="margin-top:6px">3. One + Twenty = Twenty-one <span class="small" id="sm63"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showSM6">Ver respostas</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A1' && Number((location.hash.split('/')[3]||'1'))===7 ? `
            <div class="section-title" style="margin-top:12px">Escolha a preposição correta (3 itens)</div>
            <div class="card">
              <div>1. The shovel is <label><input type="radio" name="p71" value="in"> in</label> <label><input type="radio" name="p71" value="on"> on</label> the shed. <span class="small" id="p71r"></span></div>
              <div style="margin-top:6px">2. The hammer is <label><input type="radio" name="p72" value="in"> in</label> <label><input type="radio" name="p72" value="on"> on</label> the wood table. <span class="small" id="p72r"></span></div>
              <div style="margin-top:6px">3. The buckets are <label><input type="radio" name="p73" value="under"> under</label> <label><input type="radio" name="p73" value="behind"> behind</label> the water tap. <span class="small" id="p73r"></span></div>
              <div style="margin-top:8px"><button class="btn" id="checkP7">Checar</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Tradução simples (3 itens)</div>
            <div class="card">
              <div>1. O trator está ao lado do galpão. <span class="small" id="tr71"></span></div>
              <div style="margin-top:6px">2. As vacas estão atrás da cerca. <span class="small" id="tr72"></span></div>
              <div style="margin-top:6px">3. A pá está no galpão. <span class="small" id="tr73"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showTR7">Ver traduções</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A1' && Number((location.hash.split('/')[3]||'1'))===8 ? `
            <div class="section-title" style="margin-top:12px">Transforme para negativa (imperativo)</div>
            <div class="card">
              <div>1. Touch the electric fence. <span class="small" id="neg81"></span></div>
              <div style="margin-top:6px">2. Smoke near the dry hay. <span class="small" id="neg82"></span></div>
              <div style="margin-top:6px">3. Start the machine now. <span class="small" id="neg83"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showNEG8">Ver negativas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Associações de segurança (3 itens)</div>
            <div class="card">
              <div>1. Mãos sujas → <span class="small" id="ass81"></span></div>
              <div style="margin-top:6px">2. Cerca elétrica → <span class="small" id="ass82"></span></div>
              <div style="margin-top:6px">3. Feno seco → <span class="small" id="ass83"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showASS8">Ver respostas</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A1' && Number((location.hash.split('/')[3]||'1'))===9 ? `
            <div class="section-title" style="margin-top:12px">Transforme rotina → agora (3 itens)</div>
            <div class="card">
              <div>1. I clean the machine. <span class="small" id="pc91"></span></div>
              <div style="margin-top:6px">2. They eat now. <span class="small" id="pc92"></span></div>
              <div style="margin-top:6px">3. Carlos repairs the fence. <span class="small" id="pc93"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showPC9">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Compreensão (present continuous)</div>
            <div class="card">
              <div>1. Who is repairing the fence? <span class="small" id="pqa91"></span></div>
              <div style="margin-top:6px">2. What are the cows doing? <span class="small" id="pqa92"></span></div>
              <div style="margin-top:6px">3. Are they eating at this moment? <span class="small" id="pqa93"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showPQA9">Ver respostas</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A1' && Number((location.hash.split('/')[3]||'1'))===10 ? `
            <div class="section-title" style="margin-top:12px">True or False (3 itens)</div>
            <div class="card">
              <div>1. John can operate the new harvester. <span class="small" id="tf101"></span></div>
              <div style="margin-top:6px">2. I can drive the heavy tractor. <span class="small" id="tf102"></span></div>
              <div style="margin-top:6px">3. The tractor can pull a large trailer. <span class="small" id="tf103"></span></div>
              <div style="margin-top:8px"><button class="btn" id="checkTF10">Checar</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Complete com Can / Cannot</div>
            <div class="card">
              <div>1. John ___ operate the harvester.</div>
              <div style="margin-top:6px">2. I ___ drive the heavy tractor.</div>
              <div style="margin-top:6px">3. It ___ pull a large trailer.</div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A1' && Number((location.hash.split('/')[3]||'1'))===11 ? `
            <div class="section-title" style="margin-top:12px">Coloque em ordem (3 itens)</div>
            <div class="card">
              <div>1. [will / arrive / The trucks] <span class="small" id="ord111"></span></div>
              <div style="margin-top:6px">2. [We / will / start / the soybean harvest] <span class="small" id="ord112"></span></div>
              <div style="margin-top:6px">3. [We / will / sell / the production / on Friday] <span class="small" id="ord113"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showORD11">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Compreensão (agenda)</div>
            <div class="card">
              <div>1. O que acontece na segunda? <span class="small" id="sch111"></span></div>
              <div style="margin-top:6px">2. O que acontece na terça? <span class="small" id="sch112"></span></div>
              <div style="margin-top:6px">3. O que acontece na sexta? <span class="small" id="sch113"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showSCH11">Ver respostas</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A1' && Number((location.hash.split('/')[3]||'1'))===12 ? `
            <div class="section-title" style="margin-top:12px">Caro ou Barato (3 itens)</div>
            <div class="card">
              <div>1. Harvester → <span class="small" id="ec121"></span></div>
              <div style="margin-top:6px">2. Inputs → <span class="small" id="ec122"></span></div>
              <div style="margin-top:6px">3. Bag → <span class="small" id="ec123"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showEC12">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Compreensão (preço)</div>
            <div class="card">
              <div>1. What does the buyer ask? <span class="small" id="mq121"></span></div>
              <div style="margin-top:6px">2. How much is one ton? <span class="small" id="mq122"></span></div>
              <div style="margin-top:6px">3. What do we do with the money? <span class="small" id="mq123"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showMQ12">Ver respostas</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A2' && Number((location.hash.split('/')[3]||'1'))===1 ? `
            <div class="section-title" style="margin-top:12px">Complete com Was / Were (3 itens)</div>
            <div class="card">
              <div>1. The tractor ___ dirty. <span class="small" id="ww11r"></span></div>
              <div style="margin-top:6px">2. The cows ___ in the barn. <span class="small" id="ww12r"></span></div>
              <div style="margin-top:6px">3. It ___ rainy in the morning. <span class="small" id="ww13r"></span></div>
              <div style="margin-top:8px">
                <input id="ww11" class="blank" placeholder="was/were" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px;width:100px" />
                <input id="ww12" class="blank" placeholder="was/were" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px;width:100px;margin-left:6px" />
                <input id="ww13" class="blank" placeholder="was/were" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px;width:100px;margin-left:6px" />
                <button class="btn" id="checkWW1" style="margin-left:6px">Checar</button>
              </div>
            </div>
            <div class="section-title" style="margin-top:12px">Transforme Presente → Passado</div>
            <div class="card">
              <div>1. It is cold → <span class="small" id="tp11"></span></div>
              <div style="margin-top:6px">2. The cows are hungry → <span class="small" id="tp12"></span></div>
              <div style="margin-top:6px">3. We are tired → <span class="small" id="tp13"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showTP1">Ver respostas</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A2' && Number((location.hash.split('/')[3]||'1'))===2 ? `
            <div class="section-title" style="margin-top:12px">Adicione -ED (3 itens)</div>
            <div class="card">
              <div>1. I work → <span class="small" id="ed21"></span></div>
              <div style="margin-top:6px">2. We check → <span class="small" id="ed22"></span></div>
              <div style="margin-top:6px">3. They repair → <span class="small" id="ed23"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showED2">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Tradução (relatório)</div>
            <div class="card">
              <div>1. Eu limpei o tanque. <span class="small" id="tr21"></span></div>
              <div style="margin-top:6px">2. Nós consertamos a cerca. <span class="small" id="tr22"></span></div>
              <div style="margin-top:6px">3. A chuva parou de tarde. <span class="small" id="tr23"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showTR2">Ver traduções</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A2' && Number((location.hash.split('/')[3]||'1'))===3 ? `
            <div class="section-title" style="margin-top:12px">Complete com o passado (3 itens)</div>
            <div class="card">
              <div>1. Yesterday I [buy] ___ a new belt. <span class="small" id="iv31r"></span></div>
              <div style="margin-top:6px">2. We [go] ___ to the city. <span class="small" id="iv32r"></span></div>
              <div style="margin-top:6px">3. The belt [break] ___ suddenly. <span class="small" id="iv33r"></span></div>
              <div style="margin-top:8px">
                <input id="iv31" class="blank" placeholder="bought" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px;width:120px" />
                <input id="iv32" class="blank" placeholder="went" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px;width:120px;margin-left:6px" />
                <input id="iv33" class="blank" placeholder="broke" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px;width:120px;margin-left:6px" />
                <button class="btn" id="checkIV3" style="margin-left:6px">Checar</button>
              </div>
            </div>
            <div class="section-title" style="margin-top:12px">Associe Presente → Passado</div>
            <div class="card">
              <div>Go → <span class="small" id="map31"></span></div>
              <div style="margin-top:6px">Drive → <span class="small" id="map32"></span></div>
              <div style="margin-top:6px">Buy → <span class="small" id="map33"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showMAP3">Ver respostas</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A2' && Number((location.hash.split('/')[3]||'1'))===4 ? `
            <div class="section-title" style="margin-top:12px">Transforme em pergunta (3 itens)</div>
            <div class="card">
              <div>1. You worked → <span class="small" id="q41"></span></div>
              <div style="margin-top:6px">2. She cleaned the tank → <span class="small" id="q42"></span></div>
              <div style="margin-top:6px">3. They fed the cattle → <span class="small" id="q43"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showQ4">Ver perguntas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Transforme em negativa (3 itens)</div>
            <div class="card">
              <div>1. I saw the cow → <span class="small" id="n41"></span></div>
              <div style="margin-top:6px">2. The vet arrived → <span class="small" id="n42"></span></div>
              <div style="margin-top:6px">3. We checked the horse → <span class="small" id="n43"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showN4">Ver negativas</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A2' && Number((location.hash.split('/')[3]||'1'))===5 ? `
            <div class="section-title" style="margin-top:12px">Compare com o adjetivo (3 itens)</div>
            <div class="card">
              <div>1. The tractor is [fast] ___ than the horse. <span class="small" id="comp51r"></span></div>
              <div style="margin-top:6px">2. The Black Bull is [heavy] ___ than the White Bull. <span class="small" id="comp52r"></span></div>
              <div style="margin-top:6px">3. The cow is [calm] ___ than the bull. <span class="small" id="comp53r"></span></div>
              <div style="margin-top:8px">
                <input id="comp51" class="blank" placeholder="faster" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px;width:110px" />
                <input id="comp52" class="blank" placeholder="heavier" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px;width:110px;margin-left:6px" />
                <input id="comp53" class="blank" placeholder="calmer" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px;width:110px;margin-left:6px" />
                <button class="btn" id="checkCOMP5" style="margin-left:6px">Checar</button>
              </div>
            </div>
            <div class="section-title" style="margin-top:12px">Escolha lógica (3 itens)</div>
            <div class="card">
              <div>1. Para carregar peso: o mais forte ou o mais fraco? <span class="small" id="log51"></span></div>
              <div style="margin-top:6px">2. Para acalmar o rebanho: o mais calmo ou o mais nervoso? <span class="small" id="log52"></span></div>
              <div style="margin-top:6px">3. Para gastar menos: o mais caro ou o mais barato? <span class="small" id="log53"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showLOG5">Ver respostas</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A2' && Number((location.hash.split('/')[3]||'1'))===6 ? `
            <div class="section-title" style="margin-top:12px">Transforme em superlativo (3 itens)</div>
            <div class="card">
              <div>1. Big → <span class="small" id="sup61"></span></div>
              <div style="margin-top:6px">2. Strong → <span class="small" id="sup62"></span></div>
              <div style="margin-top:6px">3. Expensive → <span class="small" id="sup63"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showSUP6">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Compreensão (superlativo)</div>
            <div class="card">
              <div>1. Qual é o trator mais moderno? <span class="small" id="sc61"></span></div>
              <div style="margin-top:6px">2. Qual é o trator mais forte? <span class="small" id="sc62"></span></div>
              <div style="margin-top:6px">3. O que é a coisa mais importante? <span class="small" id="sc63"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showSC6">Ver respostas</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A2' && Number((location.hash.split('/')[3]||'1'))===7 ? `
            <div class="section-title" style="margin-top:12px">MUCH ou MANY? (3 itens)</div>
            <div class="card">
              <div>1. How ___ pesticide do we need? <span class="small" id="mm71"></span></div>
              <div style="margin-top:6px">2. How ___ cows are in the field? <span class="small" id="mm72"></span></div>
              <div style="margin-top:6px">3. How ___ diesel is in the tank? <span class="small" id="mm73"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showMM7">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Tradução (suficiência)</div>
            <div class="card">
              <div>1. Temos água suficiente. <span class="small" id="suf71"></span></div>
              <div style="margin-top:6px">2. Não temos muitos sacos sobrando. <span class="small" id="suf72"></span></div>
              <div style="margin-top:6px">3. Precisamos comprar mais sementes rapidamente. <span class="small" id="suf73"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showSUF7">Ver traduções</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A2' && Number((location.hash.split('/')[3]||'1'))===8 ? `
            <div class="section-title" style="margin-top:12px">MUST ou SHOULD? (3 situações)</div>
            <div class="card">
              <div>1. Fumar no posto de gasolina → <span class="small" id="ms81"></span></div>
              <div style="margin-top:6px">2. Beber água no calor → <span class="small" id="ms82"></span></div>
              <div style="margin-top:6px">3. Usar óculos ao misturar químicos → <span class="small" id="ms83"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showMS8">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Tradução (placas de aviso)</div>
            <div class="card">
              <div>1. Proibido fumar <span class="small" id="pl81"></span></div>
              <div style="margin-top:6px">2. Obrigatório usar óculos de segurança <span class="small" id="pl82"></span></div>
              <div style="margin-top:6px">3. Pare imediatamente <span class="small" id="pl83"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showPL8">Ver traduções</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A2' && Number((location.hash.split('/')[3]||'1'))===9 ? `
            <div class="section-title" style="margin-top:12px">Reescreva com advérbio (3 itens)</div>
            <div class="card">
              <div>1. I clean the filters [+ Always] → <span class="small" id="af91"></span></div>
              <div style="margin-top:6px">2. We change the tires [+ Sometimes] → <span class="small" id="af92"></span></div>
              <div style="margin-top:6px">3. They have engine problems [+ Rarely] → <span class="small" id="af93"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showAF9">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Rotina pessoal (3 perguntas)</div>
            <div class="card">
              <div>1. Com que frequência você checa o nível do óleo? <span class="small" id="pr91"></span></div>
              <div style="margin-top:6px">2. Com que frequência você limpa os filtros de ar? <span class="small" id="pr92"></span></div>
              <div style="margin-top:6px">3. Com que frequência você troca os pneus? <span class="small" id="pr93"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showPR9">Ver exemplos</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='B1' && Number((location.hash.split('/')[3]||'1'))===1 ? `
            <div class="section-title" style="margin-top:12px">Conecte condição → resultado (3 itens)</div>
            <div class="card">
              <div>A1. If it rains heavily tomorrow → <span class="small" id="con11"></span></div>
              <div style="margin-top:6px">A2. If the engine overheats → <span class="small" id="con12"></span></div>
              <div style="margin-top:6px">A3. If the red light turns on → <span class="small" id="con13"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showCON1">Ver conexões</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Situações de emergência (complete 3 itens)</div>
            <div class="card">
              <div>1. If the fire starts, ___ <span class="small" id="em11"></span></div>
              <div style="margin-top:6px">2. If the fuel leaks, ___ <span class="small" id="em12"></span></div>
              <div style="margin-top:6px">3. If the panel freezes, ___ <span class="small" id="em13"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showEM1">Ver exemplos</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='B1' && Number((location.hash.split('/')[3]||'1'))===2 ? `
            <div class="section-title" style="margin-top:12px">Complete com WOULD + verbo (3 itens)</div>
            <div class="card">
              <div>1. If I had a truck, I [go] ___ to the city. <span class="small" id="sc21"></span></div>
              <div style="margin-top:6px">2. If we had a drone, we [monitor] ___ the fields. <span class="small" id="sc22"></span></div>
              <div style="margin-top:6px">3. If the old tractor were faster, we [finish] ___ early. <span class="small" id="sc23"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showSC2">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Perguntas pessoais (3 questões)</div>
            <div class="card">
              <div>1. What would you do if you won the lottery? <span class="small" id="pq21"></span></div>
              <div style="margin-top:6px">2. What would you buy for the farm? <span class="small" id="pq22"></span></div>
              <div style="margin-top:6px">3. If you were the manager, what would you change? <span class="small" id="pq23"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showPQ2">Ver exemplos</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='B1' && Number((location.hash.split('/')[3]||'1'))===3 ? `
            <div class="section-title" style="margin-top:12px">Transforme hábitos antigos (3 itens)</div>
            <div class="card">
              <div>1. Eu fumava → <span class="small" id="uh31"></span></div>
              <div style="margin-top:6px">2. Nós ordenhávamos à mão → <span class="small" id="uh32"></span></div>
              <div style="margin-top:6px">3. Nós não tínhamos GPS → <span class="small" id="uh33"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showUH3">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Antes vs Agora (3 contrastes)</div>
            <div class="card">
              <div>1. Antes: ordenhar à mão → Agora: usar robôs <span class="small" id="ct31"></span></div>
              <div style="margin-top:6px">2. Antes: trabalhar sob o sol → Agora: tratores com ar <span class="small" id="ct32"></span></div>
              <div style="margin-top:6px">3. Antes: sem linhas retas → Agora: com GPS <span class="small" id="ct33"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showCT3">Ver exemplos</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='B1' && Number((location.hash.split('/')[3]||'1'))===4 ? `
            <div class="section-title" style="margin-top:12px">Transforme Ativa → Passiva (3 itens)</div>
            <div class="card">
              <div>1. We clean the tank → <span class="small" id="ap41"></span></div>
              <div style="margin-top:6px">2. Machines collect milk → <span class="small" id="ap42"></span></div>
              <div style="margin-top:6px">3. The lab tests the samples → <span class="small" id="ap43"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showAP4">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Complete com IS / ARE (3 itens)</div>
            <div class="card">
              <div>1. The cows ___ fed. <span class="small" id="be41"></span></div>
              <div style="margin-top:6px">2. The milk ___ cooled. <span class="small" id="be42"></span></div>
              <div style="margin-top:6px">3. High standards ___ maintained. <span class="small" id="be43"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showBE4">Ver respostas</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='B1' && Number((location.hash.split('/')[3]||'1'))===5 ? `
            <div class="section-title" style="margin-top:12px">Ativa Passada → Passiva Passada (3 itens)</div>
            <div class="card">
              <div>1. He repaired the fence → <span class="small" id="pp51"></span></div>
              <div style="margin-top:6px">2. They inspected the tires → <span class="small" id="pp52"></span></div>
              <div style="margin-top:6px">3. The specialist tested the hydraulic system → <span class="small" id="pp53"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showPP5">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Complete com WAS / WERE (3 itens)</div>
            <div class="card">
              <div>1. The engine oil ___ changed on Monday. <span class="small" id="bw51"></span></div>
              <div style="margin-top:6px">2. The air filters ___ replaced on Tuesday. <span class="small" id="bw52"></span></div>
              <div style="margin-top:6px">3. The tires ___ not changed because they are new. <span class="small" id="bw53"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showBW5">Ver respostas</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='B1' && Number((location.hash.split('/')[3]||'1'))===6 ? `
            <div class="section-title" style="margin-top:12px">Complete com WHO / WHICH (3 itens)</div>
            <div class="card">
              <div>1. The veterinarian ___ visited us last week. <span class="small" id="rw61"></span></div>
              <div style="margin-top:6px">2. The fence ___ is near the river. <span class="small" id="rw62"></span></div>
              <div style="margin-top:6px">3. The cow ___ has the red tag is sick. <span class="small" id="rw63"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showRW6">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Una com THAT (3 itens)</div>
            <div class="card">
              <div>1. We have a cow. It is sick → <span class="small" id="th61"></span></div>
              <div style="margin-top:6px">2. Call the veterinarian. He understands this virus → <span class="small" id="th62"></span></div>
              <div style="margin-top:6px">3. Check the fence. It is near the river → <span class="small" id="th63"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showTH6">Ver exemplos</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='B1' && Number((location.hash.split('/')[3]||'1'))===7 ? `
            <div class="section-title" style="margin-top:12px">Perguntas "Have you ever...?" (3 itens)</div>
            <div class="card">
              <div>1. Have you ever operated a harvester? → <span class="small" id="hv71"></span></div>
              <div style="margin-top:6px">2. Have you ever worked with Angus cattle? → <span class="small" id="hv72"></span></div>
              <div style="margin-top:6px">3. Have you ever visited farms in the USA? → <span class="small" id="hv73"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showHV7">Ver exemplos</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Past Simple ou Present Perfect (3 itens)</div>
            <div class="card">
              <div>1. I [saw / have seen] the movie yesterday → <span class="small" id="pf71"></span></div>
              <div style="margin-top:6px">2. He [visited / has visited] farms in the USA → <span class="small" id="pf72"></span></div>
              <div style="margin-top:6px">3. We [learned / have learned] a lot over the years → <span class="small" id="pf73"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showPF7">Ver respostas</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A2' && Number((location.hash.split('/')[3]||'1'))===11 ? `
            <div class="section-title" style="margin-top:12px">Coloque em ordem (3 itens)</div>
            <div class="card">
              <div>1. [going to / am / organize / I] → <span class="small" id="ord111"></span></div>
              <div style="margin-top:6px">2. [bring / going to / is / The vet / the vaccines] → <span class="small" id="ord112"></span></div>
              <div style="margin-top:6px">3. [are / start / going to / We / at 5:00 AM] → <span class="small" id="ord113"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showORD11">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Planos pessoais (3 frases)</div>
            <div class="card">
              <div>1. Amanhã, eu… <span class="small" id="gp111"></span></div>
              <div style="margin-top:6px">2. Amanhã, eu… <span class="small" id="gp112"></span></div>
              <div style="margin-top:6px">3. Amanhã, nós… <span class="small" id="gp113"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showGP11">Ver exemplos</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A2' && Number((location.hash.split('/')[3]||'1'))===12 ? `
            <div class="section-title" style="margin-top:12px">Entrevista: perguntas (3 itens)</div>
            <div class="card">
              <div>1. Why do you want this job? <span class="small" id="int121"></span></div>
              <div style="margin-top:6px">2. What can you operate? <span class="small" id="int122"></span></div>
              <div style="margin-top:6px">3. What experience do you have? <span class="small" id="int123"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showINT12">Ver exemplos</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Minhas qualidades (3 frases)</div>
            <div class="card">
              <div>1. I am ___ and ___. <span class="small" id="qual121"></span></div>
              <div style="margin-top:6px">2. I am ___ and ___. <span class="small" id="qual122"></span></div>
              <div style="margin-top:6px">3. I am ___ and ___. <span class="small" id="qual123"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showQUAL12">Ver exemplos</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A2' && Number((location.hash.split('/')[3]||'1'))===10 ? `
            <div class="section-title" style="margin-top:12px">Complete com Because / So (3 itens)</div>
            <div class="card">
              <div>1. It dropped ___ the cows were stressed. <span class="small" id="bs101"></span></div>
              <div style="margin-top:6px">2. It was extremely hot, ___ the animals did not eat well. <span class="small" id="bs102"></span></div>
              <div style="margin-top:6px">3. The pump broke, ___ they were thirsty for two hours. <span class="small" id="bs103"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showBS10">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Conecte problema → solução (3 itens)</div>
            <div class="card">
              <div>1. Cows stressed → <span class="small" id="ps101"></span></div>
              <div style="margin-top:6px">2. Water pump broke → <span class="small" id="ps102"></span></div>
              <div style="margin-top:6px">3. Production dropped → <span class="small" id="ps103"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showPS10">Ver respostas</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A1' && Number((location.hash.split('/')[3]||'1'))===2 ? `
            <div class="section-title" style="margin-top:12px">Complete com Have / Has</div>
            <div class="card">
              <div>1. The cow ___ milk.</div>
              <div style="margin-top:6px">2. We ___ many cows.</div>
              <div style="margin-top:6px">3. The veterinarian ___ a medical kit.</div>
            </div>
            <div class="section-title" style="margin-top:12px">Compreensão (bull)</div>
            <div class="card">
              <div>1. Does the bull have an injury?</div>
              <div style="margin-top:6px">2. Where is the injury?</div>
              <div style="margin-top:6px">3. What does Dr. Silva have?</div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A1' && Number((location.hash.split('/')[3]||'1'))===3 ? `
            <div class="section-title" style="margin-top:12px">Escolha a forma correta (3 itens)</div>
            <div class="card">
              <div>1. The pig <label><input type="radio" name="mc1" value="eat"> eat</label> <label><input type="radio" name="mc1" value="eats"> eats</label> corn. <span class="small" id="mc1r"></span></div>
              <div style="margin-top:6px">2. The calf <label><input type="radio" name="mc2" value="drink"> drink</label> <label><input type="radio" name="mc2" value="drinks"> drinks</label> milk. <span class="small" id="mc2r"></span></div>
              <div style="margin-top:6px">3. We <label><input type="radio" name="mc3" value="need"> need</label> <label><input type="radio" name="mc3" value="needs"> needs</label> water. <span class="small" id="mc3r"></span></div>
              <div style="margin-top:8px"><button class="btn" id="checkMC">Checar</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Como fazer perguntas? (Passo a Passo)</div>
            <div class="card">
              <div>Para transformar "The cows are calm" em pergunta:</div>
              <div style="margin-top:6px">1. Identifique o verbo (<strong>Are</strong>).</div>
              <div style="margin-top:6px">2. Mova ele para o início da frase.</div>
              <div style="margin-top:6px">3. Resultado: "<strong>Are</strong> the cows calm?"</div>
            </div>
            <div class="section-title" style="margin-top:12px">Tradução simples (3 itens)</div>
            <div class="card">
              <div>1. Nós conferimos os bebedouros/tanques. <span class="small" id="tr31"></span></div>
              <div style="margin-top:6px">2. O bezerro bebe leite. <span class="small" id="tr32"></span></div>
              <div style="margin-top:6px">3. O trabalhador rural alimenta os porcos. <span class="small" id="tr33"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showTR3">Ver traduções</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A1' && Number((location.hash.split('/')[3]||'1'))===4 ? `
            <div class="section-title" style="margin-top:12px">Reorganize a frase (3 itens)</div>
            <div class="card">
              <div>1. [tractor / is / The / heavy] <span class="small" id="ord41"></span></div>
              <div style="margin-top:6px">2. [We / plant / soybeans / in / the / large / field] <span class="small" id="ord42"></span></div>
              <div style="margin-top:6px">3. [soil / humid / is / The] <span class="small" id="ord43"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showORD4">Ver respostas</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Tradução técnica (3 itens)</div>
            <div class="card">
              <div>1. O trator é novo. <span class="small" id="tr41"></span></div>
              <div style="margin-top:6px">2. O solo está úmido, não seco. <span class="small" id="tr42"></span></div>
              <div style="margin-top:6px">3. A colheitadeira está no galpão. <span class="small" id="tr43"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showTR4">Ver traduções</button></div>
            </div>
            ` : ''}
            ${String(level).toUpperCase()==='A1' && Number((location.hash.split('/')[3]||'1'))===5 ? `
            <div class="section-title" style="margin-top:12px">Descreva o tempo (3 itens)</div>
            <div class="card">
              <div>1. [Sol forte] It is <input id="w51" class="blank" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px;width:120px" placeholder="hot/strong"> <span class="small" id="w51r"></span></div>
              <div style="margin-top:6px">2. [Chuva pesada] It is <input id="w52" class="blank" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px;width:120px" placeholder="raining/heavy"> <span class="small" id="w52r"></span></div>
              <div style="margin-top:6px">3. [Nuvens escuras] There are <input id="w53" class="blank" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px;width:160px" placeholder="dark clouds"> <span class="small" id="w53r"></span></div>
              <div style="margin-top:8px"><button class="btn" id="checkW5">Checar</button></div>
            </div>
            <div class="section-title" style="margin-top:12px">Compreensão (clima)</div>
            <div class="card">
              <div>1. What do the plants need? <span class="small" id="wc51"></span></div>
              <div style="margin-top:6px">2. How is the sky? <span class="small" id="wc52"></span></div>
              <div style="margin-top:6px">3. What does the harvest depend on? <span class="small" id="wc53"></span></div>
              <div style="margin-top:8px"><button class="btn" id="showWC5">Ver respostas</button></div>
            </div>
            ` : ''}
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
          const tfBtn = document.getElementById('checkTF');
          if (tfBtn) tfBtn.addEventListener('click', ()=>{
            const r1 = document.getElementById('tf1'); if (r1) { r1.textContent = 'Verdadeiro'; r1.style.color='green'; }
            const r2 = document.getElementById('tf2'); if (r2) { r2.textContent = 'Falso'; r2.style.color='red'; }
            const r3 = document.getElementById('tf3'); if (r3) { r3.textContent = 'Verdadeiro'; r3.style.color='green'; }
          });
          const tfBtn2 = document.getElementById('checkTF2');
          if (tfBtn2) tfBtn2.addEventListener('click', ()=>{
            const r1 = document.getElementById('tf21'); if (r1) { r1.textContent = 'Verdadeiro'; r1.style.color='green'; }
            const r2 = document.getElementById('tf22'); if (r2) { r2.textContent = 'Falso'; r2.style.color='red'; }
            const r3 = document.getElementById('tf23'); if (r3) { r3.textContent = 'Verdadeiro'; r3.style.color='green'; }
          });
          const tfBtn3 = document.getElementById('checkTF3');
          if (tfBtn3) tfBtn3.addEventListener('click', ()=>{
            const r1 = document.getElementById('tf31'); if (r1) { r1.textContent = 'Verdadeiro'; r1.style.color='green'; }
            const r2 = document.getElementById('tf32'); if (r2) { r2.textContent = 'Falso'; r2.style.color='red'; }
            const r3 = document.getElementById('tf33'); if (r3) { r3.textContent = 'Verdadeiro'; r3.style.color='green'; }
          });
          const mcBtn = document.getElementById('checkMC');
          if (mcBtn) mcBtn.addEventListener('click', ()=>{
            const a1 = document.querySelector('input[name="mc1"]:checked'); const r1 = document.getElementById('mc1r'); if (r1) { if (a1 && a1.value==='eats') { r1.textContent='Correto'; r1.style.color='green' } else { r1.textContent='Incorreto'; r1.style.color='red' } }
            const a2 = document.querySelector('input[name="mc2"]:checked'); const r2 = document.getElementById('mc2r'); if (r2) { if (a2 && a2.value==='drinks') { r2.textContent='Correto'; r2.style.color='green' } else { r2.textContent='Incorreto'; r2.style.color='red' } }
            const a3 = document.querySelector('input[name="mc3"]:checked'); const r3 = document.getElementById('mc3r'); if (r3) { if (a3 && a3.value==='need') { r3.textContent='Correto'; r3.style.color='green' } else { r3.textContent='Incorreto'; r3.style.color='red' } }
          });
          const showTR3 = document.getElementById('showTR3');
          if (showTR3) showTR3.addEventListener('click', ()=>{
            const s1 = document.getElementById('tr31'); if (s1) { s1.textContent = 'We check the water tanks.' }
            const s2 = document.getElementById('tr32'); if (s2) { s2.textContent = 'The calf drinks milk.' }
            const s3 = document.getElementById('tr33'); if (s3) { s3.textContent = 'The farm worker feeds the pigs.' }
          });
          const showORD4 = document.getElementById('showORD4');
          if (showORD4) showORD4.addEventListener('click', ()=>{
            const o1 = document.getElementById('ord41'); if (o1) { o1.textContent = 'The tractor is heavy.' }
            const o2 = document.getElementById('ord42'); if (o2) { o2.textContent = 'We plant soybeans in the large field.' }
            const o3 = document.getElementById('ord43'); if (o3) { o3.textContent = 'The soil is humid.' }
          });
          const showTR4 = document.getElementById('showTR4');
          if (showTR4) showTR4.addEventListener('click', ()=>{
            const t1 = document.getElementById('tr41'); if (t1) { t1.textContent = 'The tractor is new.' }
            const t2 = document.getElementById('tr42'); if (t2) { t2.textContent = 'The soil is humid, not dry.' }
            const t3 = document.getElementById('tr43'); if (t3) { t3.textContent = 'The harvester is in the shed.' }
          });
          const wBtn = document.getElementById('checkW5');
          if (wBtn) wBtn.addEventListener('click', ()=>{
            const v1 = (document.getElementById('w51')||{}).value||''; const r1 = document.getElementById('w51r'); if (r1) { const ok = /^(hot|strong)$/i.test(v1.trim()); r1.textContent = ok?'Correto':'Sugestão: hot/strong'; r1.style.color = ok?'green':'black'; }
            const v2 = (document.getElementById('w52')||{}).value||''; const r2 = document.getElementById('w52r'); if (r2) { const ok = /^(raining|heavy)$/i.test(v2.trim()); r2.textContent = ok?'Correto':'Sugestão: raining/heavy'; r2.style.color = ok?'green':'black'; }
            const v3 = (document.getElementById('w53')||{}).value||''; const r3 = document.getElementById('w53r'); if (r3) { const ok = /^dark\s+clouds$/i.test(v3.trim()); r3.textContent = ok?'Correto':'Sugestão: dark clouds'; r3.style.color = ok?'green':'black'; }
          });
          const showWC5 = document.getElementById('showWC5');
          if (showWC5) showWC5.addEventListener('click', ()=>{
            const c1 = document.getElementById('wc51'); if (c1) { c1.textContent = 'Water.' }
            const c2 = document.getElementById('wc52'); if (c2) { c2.textContent = 'There are dark clouds.' }
            const c3 = document.getElementById('wc53'); if (c3) { c3.textContent = 'The weather.' }
          });
          const stBtn6 = document.getElementById('checkST6');
          if (stBtn6) stBtn6.addEventListener('click', ()=>{
            const a1 = (document.getElementById('st61')||{}).value||''; const r1 = document.getElementById('st61r'); if (r1) { const ok=/^there\s+are$/i.test(a1.trim()); r1.textContent = ok?'Correto':'Use: There are'; r1.style.color = ok?'green':'black'; }
            const a2 = (document.getElementById('st62')||{}).value||''; const r2 = document.getElementById('st62r'); if (r2) { const ok=/^there\s+is$/i.test(a2.trim()); r2.textContent = ok?'Correto':'Use: There is'; r2.style.color = ok?'green':'black'; }
            const a3 = (document.getElementById('st63')||{}).value||''; const r3 = document.getElementById('st63r'); if (r3) { const ok=/^there\s+are$/i.test(a3.trim()); r3.textContent = ok?'Correto':'Use: There are'; r3.style.color = ok?'green':'black'; }
          });
          const smBtn6 = document.getElementById('showSM6');
          if (smBtn6) smBtn6.addEventListener('click', ()=>{
            const s1 = document.getElementById('sm61'); if (s1) { s1.textContent = 'Five plus five equals ten.' }
            const s2 = document.getElementById('sm62'); if (s2) { s2.textContent = 'Ten plus ten equals twenty.' }
            const s3 = document.getElementById('sm63'); if (s3) { s3.textContent = 'One plus twenty equals twenty-one.' }
          });
          const pBtn7 = document.getElementById('checkP7');
          if (pBtn7) pBtn7.addEventListener('click', ()=>{
            const a1 = document.querySelector('input[name="p71"]:checked'); const r1 = document.getElementById('p71r'); if (r1) { if (a1 && a1.value==='in') { r1.textContent='Correto'; r1.style.color='green' } else { r1.textContent='In = dentro'; r1.style.color='black' } }
            const a2 = document.querySelector('input[name="p72"]:checked'); const r2 = document.getElementById('p72r'); if (r2) { if (a2 && a2.value==='on') { r2.textContent='Correto'; r2.style.color='green' } else { r2.textContent='On = sobre a superfície'; r2.style.color='black' } }
            const a3 = document.querySelector('input[name="p73"]:checked'); const r3 = document.getElementById('p73r'); if (r3) { if (a3 && a3.value==='under') { r3.textContent='Correto'; r3.style.color='green' } else { r3.textContent='Under = embaixo'; r3.style.color='black' } }
          });
          const showTR7 = document.getElementById('showTR7');
          if (showTR7) showTR7.addEventListener('click', ()=>{
            const t1 = document.getElementById('tr71'); if (t1) { t1.textContent = 'The tractor is next to the barn.' }
            const t2 = document.getElementById('tr72'); if (t2) { t2.textContent = 'The cows are behind the fence.' }
            const t3 = document.getElementById('tr73'); if (t3) { t3.textContent = 'The shovel is in the shed.' }
          });
          const showNEG8 = document.getElementById('showNEG8');
          if (showNEG8) showNEG8.addEventListener('click', ()=>{
            const n1 = document.getElementById('neg81'); if (n1) { n1.textContent = "Don't touch the electric fence." }
            const n2 = document.getElementById('neg82'); if (n2) { n2.textContent = "Don't smoke near the dry hay." }
            const n3 = document.getElementById('neg83'); if (n3) { n3.textContent = "Don't start the machine now." }
          });
          const showASS8 = document.getElementById('showASS8');
          if (showASS8) showASS8.addEventListener('click', ()=>{
            const a1 = document.getElementById('ass81'); if (a1) { a1.textContent = 'Wash your hands with soap.' }
            const a2 = document.getElementById('ass82'); if (a2) { a2.textContent = "Don't touch the electric fence." }
            const a3 = document.getElementById('ass83'); if (a3) { a3.textContent = "Don't smoke near the dry hay." }
          });
          const showPC9 = document.getElementById('showPC9');
          if (showPC9) showPC9.addEventListener('click', ()=>{
            const r1 = document.getElementById('pc91'); if (r1) { r1.textContent = 'I am cleaning the machine.' }
            const r2 = document.getElementById('pc92'); if (r2) { r2.textContent = 'They are eating now.' }
            const r3 = document.getElementById('pc93'); if (r3) { r3.textContent = 'Carlos is repairing the fence.' }
          });
          const showPQA9 = document.getElementById('showPQA9');
          if (showPQA9) showPQA9.addEventListener('click', ()=>{
            const q1 = document.getElementById('pqa91'); if (q1) { q1.textContent = 'Carlos.' }
            const q2 = document.getElementById('pqa92'); if (q2) { q2.textContent = 'They are waiting in the shade.' }
            const q3 = document.getElementById('pqa93'); if (q3) { q3.textContent = 'No, they are not eating.' }
          });
          const tfBtn10 = document.getElementById('checkTF10');
          if (tfBtn10) tfBtn10.addEventListener('click', ()=>{
            const r1 = document.getElementById('tf101'); if (r1) { r1.textContent = 'Verdadeiro'; r1.style.color='green'; }
            const r2 = document.getElementById('tf102'); if (r2) { r2.textContent = 'Falso'; r2.style.color='red'; }
            const r3 = document.getElementById('tf103'); if (r3) { r3.textContent = 'Verdadeiro'; r3.style.color='green'; }
          });
          const showORD11 = document.getElementById('showORD11');
          if (showORD11) showORD11.addEventListener('click', ()=>{
            const o1 = document.getElementById('ord111'); if (o1) { o1.textContent = 'I am going to organize.' }
            const o2 = document.getElementById('ord112'); if (o2) { o2.textContent = 'The vet is going to bring the vaccines.' }
            const o3 = document.getElementById('ord113'); if (o3) { o3.textContent = 'We are going to start at 5:00 AM.' }
          });
          const showGP11 = document.getElementById('showGP11');
          if (showGP11) showGP11.addEventListener('click', ()=>{
            const g1 = document.getElementById('gp111'); if (g1) { g1.textContent = 'I am going to wake up early.' }
            const g2 = document.getElementById('gp112'); if (g2) { g2.textContent = 'I am going to study English.' }
            const g3 = document.getElementById('gp113'); if (g3) { g3.textContent = 'We are going to check the cattle chute.' }
          });
          const showCON1 = document.getElementById('showCON1');
          if (showCON1) showCON1.addEventListener('click', ()=>{
            const a1 = document.getElementById('con11'); if (a1) { a1.textContent = 'we will not harvest the soybeans.' }
            const a2 = document.getElementById('con12'); if (a2) { a2.textContent = 'we will wait for it to cool down.' }
            const a3 = document.getElementById('con13'); if (a3) { a3.textContent = 'stop the engine immediately.' }
          });
          const showEM1 = document.getElementById('showEM1');
          if (showEM1) showEM1.addEventListener('click', ()=>{
            const e1 = document.getElementById('em11'); if (e1) { e1.textContent = 'use the emergency stop and call for help.' }
            const e2 = document.getElementById('em12'); if (e2) { e2.textContent = 'shut off the engine and check for leaks.' }
            const e3 = document.getElementById('em13'); if (e3) { e3.textContent = 'reset the panel and write a short report.' }
          });
          const showSC2 = document.getElementById('showSC2');
          if (showSC2) showSC2.addEventListener('click', ()=>{
            const s1 = document.getElementById('sc21'); if (s1) { s1.textContent = 'would go' }
            const s2 = document.getElementById('sc22'); if (s2) { s2.textContent = 'would monitor' }
            const s3 = document.getElementById('sc23'); if (s3) { s3.textContent = 'would finish' }
          });
          const showPQ2 = document.getElementById('showPQ2');
          if (showPQ2) showPQ2.addEventListener('click', ()=>{
            const p1 = document.getElementById('pq21'); if (p1) { p1.textContent = 'I would invest in solar energy.' }
            const p2 = document.getElementById('pq22'); if (p2) { p2.textContent = 'I would buy a drone for monitoring.' }
            const p3 = document.getElementById('pq23'); if (p3) { p3.textContent = 'I would upgrade the tractors and the budget.' }
          });
          const showUH3 = document.getElementById('showUH3');
          if (showUH3) showUH3.addEventListener('click', ()=>{
            const u1 = document.getElementById('uh31'); if (u1) { u1.textContent = 'I used to smoke.' }
            const u2 = document.getElementById('uh32'); if (u2) { u2.textContent = 'We used to milk by hand.' }
            const u3 = document.getElementById('uh33'); if (u3) { u3.textContent = "We didn't use to have GPS." }
          });
          const showCT3 = document.getElementById('showCT3');
          if (showCT3) showCT3.addEventListener('click', ()=>{
            const c1 = document.getElementById('ct31'); if (c1) { c1.textContent = 'We used to milk by hand, but now we use robots.' }
            const c2 = document.getElementById('ct32'); if (c2) { c2.textContent = 'We used to work under the hot sun, but now the tractors have AC.' }
            const c3 = document.getElementById('ct33'); if (c3) { c3.textContent = "We didn't use to have GPS, but now we make straight lines." }
          });
          const showAP4 = document.getElementById('showAP4');
          if (showAP4) showAP4.addEventListener('click', ()=>{
            const a1 = document.getElementById('ap41'); if (a1) { a1.textContent = 'The tank is cleaned.' }
            const a2 = document.getElementById('ap42'); if (a2) { a2.textContent = 'Milk is collected.' }
            const a3 = document.getElementById('ap43'); if (a3) { a3.textContent = 'The samples are tested.' }
          });
          const showBE4 = document.getElementById('showBE4');
          if (showBE4) showBE4.addEventListener('click', ()=>{
            const b1 = document.getElementById('be41'); if (b1) { b1.textContent = 'are' }
            const b2 = document.getElementById('be42'); if (b2) { b2.textContent = 'is' }
            const b3 = document.getElementById('be43'); if (b3) { b3.textContent = 'are' }
          });
          const showPP5 = document.getElementById('showPP5');
          if (showPP5) showPP5.addEventListener('click', ()=>{
            const p1 = document.getElementById('pp51'); if (p1) { p1.textContent = 'The fence was repaired.' }
            const p2 = document.getElementById('pp52'); if (p2) { p2.textContent = 'The tires were inspected.' }
            const p3 = document.getElementById('pp53'); if (p3) { p3.textContent = 'The hydraulic system was tested by the specialist.' }
          });
          const showBW5 = document.getElementById('showBW5');
          if (showBW5) showBW5.addEventListener('click', ()=>{
            const w1 = document.getElementById('bw51'); if (w1) { w1.textContent = 'was' }
            const w2 = document.getElementById('bw52'); if (w2) { w2.textContent = 'were' }
            const w3 = document.getElementById('bw53'); if (w3) { w3.textContent = 'were' }
          });
          const showRW6 = document.getElementById('showRW6');
          if (showRW6) showRW6.addEventListener('click', ()=>{
            const r1 = document.getElementById('rw61'); if (r1) { r1.textContent = 'who' }
            const r2 = document.getElementById('rw62'); if (r2) { r2.textContent = 'which' }
            const r3 = document.getElementById('rw63'); if (r3) { r3.textContent = 'which' }
          });
          const showTH6 = document.getElementById('showTH6');
          if (showTH6) showTH6.addEventListener('click', ()=>{
            const t1 = document.getElementById('th61'); if (t1) { t1.textContent = 'We have a cow that is sick.' }
            const t2 = document.getElementById('th62'); if (t2) { t2.textContent = 'Call the veterinarian that understands this virus.' }
            const t3 = document.getElementById('th63'); if (t3) { t3.textContent = 'Check the fence that is near the river.' }
          });
          const showHV7 = document.getElementById('showHV7');
          if (showHV7) showHV7.addEventListener('click', ()=>{
            const h1 = document.getElementById('hv71'); if (h1) { h1.textContent = 'Yes, I have operated one many times.' }
            const h2 = document.getElementById('hv72'); if (h2) { h2.textContent = 'No, I have never worked with Angus.' }
            const h3 = document.getElementById('hv73'); if (h3) { h3.textContent = 'Yes, I have visited farms in the USA.' }
          });
          const showPF7 = document.getElementById('showPF7');
          if (showPF7) showPF7.addEventListener('click', ()=>{
            const p1 = document.getElementById('pf71'); if (p1) { p1.textContent = 'saw' }
            const p2 = document.getElementById('pf72'); if (p2) { p2.textContent = 'has visited' }
            const p3 = document.getElementById('pf73'); if (p3) { p3.textContent = 'have learned' }
          });
          const showJY8 = document.getElementById('showJY8');
          if (showJY8) showJY8.addEventListener('click', ()=>{
            const j1 = document.getElementById('jy81'); if (j1) { j1.textContent = 'just' }
            const j2 = document.getElementById('jy82'); if (j2) { j2.textContent = 'yet' }
            const j3 = document.getElementById('jy83'); if (j3) { j3.textContent = 'already' }
          });
          const showTR8 = document.getElementById('showTR8');
          if (showTR8) showTR8.addEventListener('click', ()=>{
            const t1 = document.getElementById('tr81'); if (t1) { t1.textContent = 'I have just called the supplier.' }
            const t2 = document.getElementById('tr82'); if (t2) { t2.textContent = 'Have they arrived yet?' }
            const t3 = document.getElementById('tr83'); if (t3) { t3.textContent = 'We have already done half of the work.' }
          });
          const showFS9 = document.getElementById('showFS9');
          if (showFS9) showFS9.addEventListener('click', ()=>{
            const f1 = document.getElementById('fs91'); if (f1) { f1.textContent = 'for' }
            const f2 = document.getElementById('fs92'); if (f2) { f2.textContent = 'for' }
            const f3 = document.getElementById('fs93'); if (f3) { f3.textContent = 'since' }
          });
          const showTR9 = document.getElementById('showTR9');
          if (showTR9) showTR9.addEventListener('click', ()=>{
            const t1 = document.getElementById('tr91'); if (t1) { t1.textContent = 'I have lived here for 10 years.' }
            const t2 = document.getElementById('tr92'); if (t2) { t2.textContent = 'I have lived in this house since 2010.' }
            const t3 = document.getElementById('tr93'); if (t3) { t3.textContent = 'We have used John Deere tractors for a long time.' }
          });
          const showWM10 = document.getElementById('showWM10');
          if (showWM10) showWM10.addEventListener('click', ()=>{
            const w1 = document.getElementById('wm101'); if (w1) { w1.textContent = 'It might rain later.' }
            const w2 = document.getElementById('wm102'); if (w2) { w2.textContent = 'The price of soybeans might rise.' }
            const w3 = document.getElementById('wm103'); if (w3) { w3.textContent = 'We might hire more workers.' }
          });
          const showRC10 = document.getElementById('showRC10');
          if (showRC10) showRC10.addEventListener('click', ()=>{
            const r1 = document.getElementById('rc101'); if (r1) { r1.textContent = 'could damage the corn stalks' }
            const r2 = document.getElementById('rc102'); if (r2) { r2.textContent = 'could break' }
            const r3 = document.getElementById('rc103'); if (r3) { r3.textContent = 'could drop' }
          });
          const showRS11 = document.getElementById('showRS11');
          if (showRS11) showRS11.addEventListener('click', ()=>{
            const s1 = document.getElementById('rs111'); if (s1) { s1.textContent = 'to clean' }
            const s2 = document.getElementById('rs112'); if (s2) { s2.textContent = 'to speed up' }
            const s3 = document.getElementById('rs113'); if (s3) { s3.textContent = 'to fix' }
          });
          const showST11 = document.getElementById('showST11');
          if (showST11) showST11.addEventListener('click', ()=>{
            const t1 = document.getElementById('st111'); if (t1) { t1.textContent = 'said' }
            const t2 = document.getElementById('st112'); if (t2) { t2.textContent = 'told' }
            const t3 = document.getElementById('st113'); if (t3) { t3.textContent = 'told' }
          });
          const showTG12 = document.getElementById('showTG12');
          if (showTG12) showTG12.addEventListener('click', ()=>{
            const g1 = document.getElementById('tg121'); if (g1) { g1.textContent = "isn't it" }
            const g2 = document.getElementById('tg122'); if (g2) { g2.textContent = 'did you' }
            const g3 = document.getElementById('tg123'); if (g3) { g3.textContent = "can't we" }
          });
          const showCF12 = document.getElementById('showCF12');
          if (showCF12) showCF12.addEventListener('click', ()=>{
            const c1 = document.getElementById('cf121'); if (c1) { c1.textContent = "The tank is full, isn't it?" }
            const c2 = document.getElementById('cf122'); if (c2) { c2.textContent = "The floor is clean, isn't it?" }
            const c3 = document.getElementById('cf123'); if (c3) { c3.textContent = "The operator has the map, doesn't he?" }
          });
          const showCD1 = document.getElementById('showCD1');
          if (showCD1) showCD1.addEventListener('click', ()=>{
            const s1 = document.getElementById('cd11'); if (s1) { s1.textContent = 'Despite tradition, conventional tillage causes erosion.' }
            const s2 = document.getElementById('cd12'); if (s2) { s2.textContent = 'Despite the challenge, the benefits are undeniable.' }
            const s3 = document.getElementById('cd13'); if (s3) { s3.textContent = 'Despite the cost, we save money on fuel.' }
          });
          const showAG1 = document.getElementById('showAG1');
          if (showAG1) showAG1.addEventListener('click', ()=>{
            const a1 = document.getElementById('ag11'); if (a1) { a1.textContent = 'efficient' }
            const a2 = document.getElementById('ag12'); if (a2) { a2.textContent = 'viable' }
            const a3 = document.getElementById('ag13'); if (a3) { a3.textContent = 'more sustainable' }
          });
          const showCA2 = document.getElementById('showCA2');
          if (showCA2) showCA2.addEventListener('click', ()=>{
            const c1 = document.getElementById('ca21'); if (c1) { c1.textContent = 'I had the grass cut.' }
            const c2 = document.getElementById('ca22'); if (c2) { c2.textContent = 'We got the soil tested.' }
            const c3 = document.getElementById('ca23'); if (c3) { c3.textContent = 'They had the pump fixed.' }
          });
          const showMG2 = document.getElementById('showMG2');
          if (showMG2) showMG2.addEventListener('click', ()=>{
            const m1 = document.getElementById('mg21'); if (m1) { m1.textContent = 'Have the roof repaired.' }
            const m2 = document.getElementById('mg22'); if (m2) { m2.textContent = 'Have the reports sent by Friday.' }
            const m3 = document.getElementById('mg23'); if (m3) { m3.textContent = 'Get the fence replaced.' }
          });
          const showMD3 = document.getElementById('showMD3');
          if (showMD3) showMD3.addEventListener('click', ()=>{
            const d1 = document.getElementById('md31'); if (d1) { d1.textContent = 'Someone must have stolen the fuel.' }
            const d2 = document.getElementById('md32'); if (d2) { d2.textContent = "It can't have been lack of irrigation; the pump might have failed." }
            const d3 = document.getElementById('md33'); if (d3) { d3.textContent = 'It must have been a nutrient deficiency.' }
          });
          const showNH3 = document.getElementById('showNH3');
          if (showNH3) showNH3.addEventListener('click', ()=>{
            const n1 = document.getElementById('nh31'); if (n1) { n1.textContent = "It can't have been a lack of water." }
            const n2 = document.getElementById('nh32'); if (n2) { n2.textContent = "It can't have been the temperature." }
            const n3 = document.getElementById('nh33'); if (n3) { n3.textContent = "It can't have been the weather." }
          });
          const showTL4 = document.getElementById('showTL4');
          if (showTL4) showTL4.addEventListener('click', ()=>{
            const t1 = document.getElementById('tl41'); if (t1) { t1.textContent = 'will have finished' }
            const t2 = document.getElementById('tl42'); if (t2) { t2.textContent = 'will have upgraded' }
            const t3 = document.getElementById('tl43'); if (t3) { t3.textContent = 'will have implemented' }
          });
          const showBI4 = document.getElementById('showBI4');
          if (showBI4) showBI4.addEventListener('click', ()=>{
            const b1 = document.getElementById('bi41'); if (b1) { b1.textContent = 'in' }
            const b2 = document.getElementById('bi42'); if (b2) { b2.textContent = 'by' }
            const b3 = document.getElementById('bi43'); if (b3) { b3.textContent = 'by' }
          });
          const showIQ5 = document.getElementById('showIQ5');
          if (showIQ5) showIQ5.addEventListener('click', ()=>{
            const i1 = document.getElementById('iq51'); if (i1) { i1.textContent = 'Do you know where the boss is?' }
            const i2 = document.getElementById('iq52'); if (i2) { i2.textContent = 'Could you tell me what time the truck arrives?' }
            const i3 = document.getElementById('iq53'); if (i3) { i3.textContent = 'Do you know if the invoice is approved?' }
          });
          const showEM5 = document.getElementById('showEM5');
          if (showEM5) showEM5.addEventListener('click', ()=>{
            const e1 = document.getElementById('em51'); if (e1) { e1.textContent = 'Could you tell me where the cargo is?' }
            const e2 = document.getElementById('em52'); if (e2) { e2.textContent = 'Do you know if it is approved?' }
            const e3 = document.getElementById('em53'); if (e3) { e3.textContent = 'Do you know what time the truck arrives?' }
          });
          const showPV6 = document.getElementById('showPV6');
          if (showPV6) showPV6.addEventListener('click', ()=>{
            const p1 = document.getElementById('pv61'); if (p1) { p1.textContent = 'look into' }
            const p2 = document.getElementById('pv62'); if (p2) { p2.textContent = 'put off' }
            const p3 = document.getElementById('pv63'); if (p3) { p3.textContent = 'carry out' }
          });
          const showEM6 = document.getElementById('showEM6');
          if (showEM6) showEM6.addEventListener('click', ()=>{
            const s1 = document.getElementById('em61'); if (s1) { s1.textContent = 'broke down' }
            const s2 = document.getElementById('em62'); if (s2) { s2.textContent = 'running out of' }
            const s3 = document.getElementById('em63'); if (s3) { s3.textContent = 'keep up' }
          });
          const showRC7 = document.getElementById('showRC7');
          if (showRC7) showRC7.addEventListener('click', ()=>{
            const r1 = document.getElementById('rc71'); if (r1) { r1.textContent = 'The boss, who is old, is here.' }
            const r2 = document.getElementById('rc72'); if (r2) { r2.textContent = 'The red tractor, which was imported from the USA, is expensive.' }
            const r3 = document.getElementById('rc73'); if (r3) { r3.textContent = 'Silo 3, where we stored soybeans, is full.' }
          });
          const showTH7 = document.getElementById('showTH7');
          if (showTH7) showTH7.addEventListener('click', ()=>{
            const t1 = document.getElementById('th71'); if (t1) { t1.textContent = 'The car, which is blue, is mine.' }
            const t2 = document.getElementById('th72'); if (t2) { t2.textContent = 'Mr. Jones, who manages logistics, is on leave.' }
            const t3 = document.getElementById('th73'); if (t3) { t3.textContent = 'The barn, which is old, needs insurance.' }
          });
          const showTC8 = document.getElementById('showTC8');
          if (showTC8) showTC8.addEventListener('click', ()=>{
            const t1 = document.getElementById('tc81'); if (t1) { t1.textContent = 'If I had studied, I would not have failed.' }
            const t2 = document.getElementById('tc82'); if (t2) { t2.textContent = 'If we had applied earlier, we would have saved the plants.' }
            const t3 = document.getElementById('tc83'); if (t3) { t3.textContent = 'If the manager had checked the forecast, he would not have delayed the application.' }
          });
          const showSF8 = document.getElementById('showSF8');
          if (showSF8) showSF8.addEventListener('click', ()=>{
            const s1 = document.getElementById('sf81'); if (s1) { s1.textContent = "If we had checked the oil, we wouldn't have broken down." }
            const s2 = document.getElementById('sf82'); if (s2) { s2.textContent = 'If prices had not dropped, we would have made a higher profit.' }
            const s3 = document.getElementById('sf83'); if (s3) { s3.textContent = 'If we had acted faster, the results would have been better.' }
          });
          const showNG9 = document.getElementById('showNG9');
          if (showNG9) showNG9.addEventListener('click', ()=>{
            const n1 = document.getElementById('ng91'); if (n1) { n1.textContent = 'will increase' }
            const n2 = document.getElementById('ng92'); if (n2) { n2.textContent = 'offer' }
            const n3 = document.getElementById('ng93'); if (n3) { n3.textContent = 'can give' }
          });
          const showPR9B2 = document.getElementById('showPR9');
          if (showPR9B2) showPR9B2.addEventListener('click', ()=>{
            const p1 = document.getElementById('pr91'); if (p1) { p1.textContent = "I'm afraid that is over our budget." }
            const p2 = document.getElementById('pr92'); if (p2) { p2.textContent = 'I appreciate it, but the payment terms are not feasible.' }
            const p3 = document.getElementById('pr93'); if (p3) { p3.textContent = 'Could you meet us halfway?' }
          });
          const showRV10 = document.getElementById('showRV10');
          if (showRV10) showRV10.addEventListener('click', ()=>{
            const r1 = document.getElementById('rv101'); if (r1) { r1.textContent = 'He suggested buying a new truck.' }
            const r2 = document.getElementById('rv102'); if (r2) { r2.textContent = 'He insisted on vaccinating the calves now.' }
            const r3 = document.getElementById('rv103'); if (r3) { r3.textContent = 'He admitted hitting the fence.' }
          });
          const showCH10 = document.getElementById('showCH10');
          if (showCH10) showCH10.addEventListener('click', ()=>{
            const c1 = document.getElementById('ch101'); if (c1) { c1.textContent = 'to help' }
            const c2 = document.getElementById('ch102'); if (c2) { c2.textContent = 'to postpone' }
            const c3 = document.getElementById('ch103'); if (c3) { c3.textContent = 'driving' }
          });
          const showPM11 = document.getElementById('showPM11');
          if (showPM11) showPM11.addEventListener('click', ()=>{
            const p1 = document.getElementById('pm111'); if (p1) { p1.textContent = 'The tank must be cleaned.' }
            const p2 = document.getElementById('pm112'); if (p2) { p2.textContent = 'The animals should be moved.' }
            const p3 = document.getElementById('pm113'); if (p3) { p3.textContent = 'The issue can be solved.' }
          });
          const showSC11 = document.getElementById('showSC11');
          if (showSC11) showSC11.addEventListener('click', ()=>{
            const s1 = document.getElementById('sc111'); if (s1) { s1.textContent = 'must be extinguished' }
            const s2 = document.getElementById('sc112'); if (s2) { s2.textContent = 'cannot be used' }
            const s3 = document.getElementById('sc113'); if (s3) { s3.textContent = 'must be closed' }
          });
          const showCO12 = document.getElementById('showCO12');
          if (showCO12) showCO12.addEventListener('click', ()=>{
            const c1 = document.getElementById('co121'); if (c1) { c1.textContent = 'furthermore' }
            const c2 = document.getElementById('co122'); if (c2) { c2.textContent = 'therefore' }
            const c3 = document.getElementById('co123'); if (c3) { c3.textContent = 'consequently' }
          });
          const showSA12 = document.getElementById('showSA12');
          if (showSA12) showSA12.addEventListener('click', ()=>{
            const s1 = document.getElementById('sa121'); if (s1) { s1.textContent = 'more profit' }
            const s2 = document.getElementById('sa122'); if (s2) { s2.textContent = 'a competitive edge' }
            const s3 = document.getElementById('sa123'); if (s3) { s3.textContent = 'pay for itself' }
          });
          const showINT12 = document.getElementById('showINT12');
          if (showINT12) showINT12.addEventListener('click', ()=>{
            const i1 = document.getElementById('int121'); if (i1) { i1.textContent = 'I want to work here because this farm is the best in the region.' }
            const i2 = document.getElementById('int122'); if (i2) { i2.textContent = 'I can operate GPS systems and drive heavy trucks.' }
            const i3 = document.getElementById('int123'); if (i3) { i3.textContent = 'I have five years of experience in agriculture.' }
          });
          const showQUAL12 = document.getElementById('showQUAL12');
          if (showQUAL12) showQUAL12.addEventListener('click', ()=>{
            const q1 = document.getElementById('qual121'); if (q1) { q1.textContent = 'I am hardworking and honest.' }
            const q2 = document.getElementById('qual122'); if (q2) { q2.textContent = 'I am ready and responsible.' }
            const q3 = document.getElementById('qual123'); if (q3) { q3.textContent = 'I am careful and fast.' }
          });
          const showEC12 = document.getElementById('showEC12');
          if (showEC12) showEC12.addEventListener('click', ()=>{
            const e1 = document.getElementById('ec121'); if (e1) { e1.textContent = 'Expensive' }
            const e2 = document.getElementById('ec122'); if (e2) { e2.textContent = 'Expensive' }
            const e3 = document.getElementById('ec123'); if (e3) { e3.textContent = 'Cheap' }
          });
          const showMQ12 = document.getElementById('showMQ12');
          if (showMQ12) showMQ12.addEventListener('click', ()=>{
            const m1 = document.getElementById('mq121'); if (m1) { m1.textContent = 'How much is one ton?' }
            const m2 = document.getElementById('mq122'); if (m2) { m2.textContent = 'It costs 500 dollars per ton.' }
            const m3 = document.getElementById('mq123'); if (m3) { m3.textContent = 'We pay the costs and we see the profit.' }
          });
          (function(){
            function ensurePrintButton(){
              if (!String(location.hash||'').startsWith('#/text/')) return;
              if (!document.getElementById('printLesson')){
                const b = document.createElement('button');
                b.id = 'printLesson';
                b.className = 'btn';
                b.textContent = 'Versão imprimível';
                b.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:9999';
                document.body.appendChild(b);
                b.addEventListener('click', ()=>{
                  document.querySelectorAll('button[id^="show"]').forEach(x=>{ try { x.click(); } catch(e){} });
                  const old = document.getElementById('answerSheet'); if (old) old.remove();
                  const sheet = document.createElement('div');
                  sheet.id = 'answerSheet';
                  sheet.style.cssText = 'margin-top:24px;padding:12px;border-top:1px solid #ddd';
                  const h = document.createElement('h3'); h.textContent = 'Respostas'; sheet.appendChild(h);
                  document.querySelectorAll('.card .small[id]').forEach(s=>{
                    const id = s.id; const val = (s.textContent||'').trim(); if (!val) return;
                    const p = document.createElement('div'); p.textContent = id+': '+val; sheet.appendChild(p);
                  });
                  document.body.appendChild(sheet);
                  window.print();
                });
              }
            }
            function cleanupPrint(){
              const b = document.getElementById('printLesson'); if (b) b.remove();
              const s = document.getElementById('answerSheet'); if (s) s.remove();
            }
            function checkRoute(){
              cleanupPrint();
            }
            window.addEventListener('hashchange', checkRoute);
            document.addEventListener('DOMContentLoaded', checkRoute);
          })();
          const wwBtn1 = document.getElementById('checkWW1');
          if (wwBtn1) wwBtn1.addEventListener('click', ()=>{
            const a1 = (document.getElementById('ww11')||{}).value||''; const r1 = document.getElementById('ww11r'); if (r1) { const ok=/^was$/i.test(a1.trim()); r1.textContent = ok?'Correto':'Use: was'; r1.style.color = ok?'green':'black'; }
            const a2 = (document.getElementById('ww12')||{}).value||''; const r2 = document.getElementById('ww12r'); if (r2) { const ok=/^were$/i.test(a2.trim()); r2.textContent = ok?'Correto':'Use: were'; r2.style.color = ok?'green':'black'; }
            const a3 = (document.getElementById('ww13')||{}).value||''; const r3 = document.getElementById('ww13r'); if (r3) { const ok=/^was$/i.test(a3.trim()); r3.textContent = ok?'Correto':'Use: was'; r3.style.color = ok?'green':'black'; }
          });
          const showTP1 = document.getElementById('showTP1');
          if (showTP1) showTP1.addEventListener('click', ()=>{
            const t1 = document.getElementById('tp11'); if (t1) { t1.textContent = 'It was cold.' }
            const t2 = document.getElementById('tp12'); if (t2) { t2.textContent = 'The cows were hungry.' }
            const t3 = document.getElementById('tp13'); if (t3) { t3.textContent = 'We were tired.' }
          });
          const showIP1C1 = document.getElementById('showIP1C1');
          if (showIP1C1) showIP1C1.addEventListener('click', ()=>{
            const r1 = document.getElementById('ip11'); if (r1) { r1.textContent = 'It is thought that feed conversion is improving.' }
            const r2 = document.getElementById('ip12'); if (r2) { r2.textContent = 'It is estimated that demand will double.' }
            const r3 = document.getElementById('ip13'); if (r3) { r3.textContent = 'It has been reported that gene editing eliminates diseases.' }
          });
          const showTO1C1 = document.getElementById('showTO1C1');
          if (showTO1C1) showTO1C1.addEventListener('click', ()=>{
            const k1 = document.getElementById('to11'); if (k1) { k1.textContent = 'The bull is said to be strong.' }
            const k2 = document.getElementById('to12'); if (k2) { k2.textContent = 'Precise breeding is believed to mitigate impact.' }
            const k3 = document.getElementById('to13'); if (k3) { k3.textContent = 'Genetic selection is acknowledged to be the cornerstone.' }
          });
          const showED2 = document.getElementById('showED2');
          if (showED2) showED2.addEventListener('click', ()=>{
            const e1 = document.getElementById('ed21'); if (e1) { e1.textContent = 'I worked.' }
            const e2 = document.getElementById('ed22'); if (e2) { e2.textContent = 'We checked.' }
            const e3 = document.getElementById('ed23'); if (e3) { e3.textContent = 'They repaired.' }
          });
          const showTR2 = document.getElementById('showTR2');
          if (showTR2) showTR2.addEventListener('click', ()=>{
            const t1 = document.getElementById('tr21'); if (t1) { t1.textContent = 'I cleaned the tank.' }
            const t2 = document.getElementById('tr22'); if (t2) { t2.textContent = 'We repaired the fence.' }
            const t3 = document.getElementById('tr23'); if (t3) { t3.textContent = 'The rain stopped in the afternoon.' }
          });
          const ivBtn3 = document.getElementById('checkIV3');
          if (ivBtn3) ivBtn3.addEventListener('click', ()=>{
            const a1 = (document.getElementById('iv31')||{}).value||''; const r1 = document.getElementById('iv31r'); if (r1) { const ok=/^bought$/i.test(a1.trim()); r1.textContent = ok?'Correto':'Sugestão: bought'; r1.style.color = ok?'green':'black'; }
            const a2 = (document.getElementById('iv32')||{}).value||''; const r2 = document.getElementById('iv32r'); if (r2) { const ok=/^went$/i.test(a2.trim()); r2.textContent = ok?'Correto':'Sugestão: went'; r2.style.color = ok?'green':'black'; }
            const a3 = (document.getElementById('iv33')||{}).value||''; const r3 = document.getElementById('iv33r'); if (r3) { const ok=/^broke$/i.test(a3.trim()); r3.textContent = ok?'Correto':'Sugestão: broke'; r3.style.color = ok?'green':'black'; }
          });
          const showMAP3 = document.getElementById('showMAP3');
          if (showMAP3) showMAP3.addEventListener('click', ()=>{
            const m1 = document.getElementById('map31'); if (m1) { m1.textContent = 'Went' }
            const m2 = document.getElementById('map32'); if (m2) { m2.textContent = 'Drove' }
            const m3 = document.getElementById('map33'); if (m3) { m3.textContent = 'Bought' }
          });
          const showQ4 = document.getElementById('showQ4');
          if (showQ4) showQ4.addEventListener('click', ()=>{
            const q1 = document.getElementById('q41'); if (q1) { q1.textContent = 'Did you work?' }
            const q2 = document.getElementById('q42'); if (q2) { q2.textContent = 'Did she clean the tank?' }
            const q3 = document.getElementById('q43'); if (q3) { q3.textContent = 'Did they feed the cattle?' }
          });
          const showN4 = document.getElementById('showN4');
          if (showN4) showN4.addEventListener('click', ()=>{
            const n1 = document.getElementById('n41'); if (n1) { n1.textContent = "I didn't see the cow." }
            const n2 = document.getElementById('n42'); if (n2) { n2.textContent = "The vet didn't arrive." }
            const n3 = document.getElementById('n43'); if (n3) { n3.textContent = "We didn't check the horse." }
          });
          const compBtn5 = document.getElementById('checkCOMP5');
          if (compBtn5) compBtn5.addEventListener('click', ()=>{
            const a1 = (document.getElementById('comp51')||{}).value||''; const r1 = document.getElementById('comp51r'); if (r1) { const ok=/^faster$/i.test(a1.trim()); r1.textContent = ok?'Correto':'Sugestão: faster'; r1.style.color = ok?'green':'black'; }
            const a2 = (document.getElementById('comp52')||{}).value||''; const r2 = document.getElementById('comp52r'); if (r2) { const ok=/^heavier$/i.test(a2.trim()); r2.textContent = ok?'Correto':'Sugestão: heavier'; r2.style.color = ok?'green':'black'; }
            const a3 = (document.getElementById('comp53')||{}).value||''; const r3 = document.getElementById('comp53r'); if (r3) { const ok=/^calmer$/i.test(a3.trim()); r3.textContent = ok?'Correto':'Sugestão: calmer'; r3.style.color = ok?'green':'black'; }
          });
          const showLOG5 = document.getElementById('showLOG5');
          if (showLOG5) showLOG5.addEventListener('click', ()=>{
            const l1 = document.getElementById('log51'); if (l1) { l1.textContent = 'O mais forte.' }
            const l2 = document.getElementById('log52'); if (l2) { l2.textContent = 'O mais calmo.' }
            const l3 = document.getElementById('log53'); if (l3) { l3.textContent = 'O mais barato.' }
          });
          const showSUP6 = document.getElementById('showSUP6');
          if (showSUP6) showSUP6.addEventListener('click', ()=>{
            const s1 = document.getElementById('sup61'); if (s1) { s1.textContent = 'The biggest' }
            const s2 = document.getElementById('sup62'); if (s2) { s2.textContent = 'The strongest' }
            const s3 = document.getElementById('sup63'); if (s3) { s3.textContent = 'The most expensive' }
          });
          const showSC6 = document.getElementById('showSC6');
          if (showSC6) showSC6.addEventListener('click', ()=>{
            const c1 = document.getElementById('sc61'); if (c1) { c1.textContent = 'The green tractor.' }
            const c2 = document.getElementById('sc62'); if (c2) { c2.textContent = 'The old red tractor.' }
            const c3 = document.getElementById('sc63'); if (c3) { c3.textContent = 'Safety.' }
          });
          const showMM7 = document.getElementById('showMM7');
          if (showMM7) showMM7.addEventListener('click', ()=>{
            const m1 = document.getElementById('mm71'); if (m1) { m1.textContent = 'much' }
            const m2 = document.getElementById('mm72'); if (m2) { m2.textContent = 'many' }
            const m3 = document.getElementById('mm73'); if (m3) { m3.textContent = 'much' }
          });
          const showSUF7 = document.getElementById('showSUF7');
          if (showSUF7) showSUF7.addEventListener('click', ()=>{
            const s1 = document.getElementById('suf71'); if (s1) { s1.textContent = 'We have enough water.' }
            const s2 = document.getElementById('suf72'); if (s2) { s2.textContent = "We don't have many bags left." }
            const s3 = document.getElementById('suf73'); if (s3) { s3.textContent = 'We need to buy more seeds quickly.' }
          });
          const showMS8 = document.getElementById('showMS8');
          if (showMS8) showMS8.addEventListener('click', ()=>{
            const m1 = document.getElementById('ms81'); if (m1) { m1.textContent = 'You must not smoke.' }
            const m2 = document.getElementById('ms82'); if (m2) { m2.textContent = 'You should drink water every hour.' }
            const m3 = document.getElementById('ms83'); if (m3) { m3.textContent = 'You must wear safety glasses.' }
          });
          const showPL8 = document.getElementById('showPL8');
          if (showPL8) showPL8.addEventListener('click', ()=>{
            const p1 = document.getElementById('pl81'); if (p1) { p1.textContent = 'No smoking' }
            const p2 = document.getElementById('pl82'); if (p2) { p2.textContent = 'Safety glasses required' }
            const p3 = document.getElementById('pl83'); if (p3) { p3.textContent = 'Stop immediately' }
          });
        const showAF9 = document.getElementById('showAF9');
        if (showAF9) showAF9.addEventListener('click', ()=>{
          const a1 = document.getElementById('af91'); if (a1) { a1.textContent = 'I always clean the filters.' }
          const a2 = document.getElementById('af92'); if (a2) { a2.textContent = 'We sometimes change the tires.' }
          const a3 = document.getElementById('af93'); if (a3) { a3.textContent = 'They rarely have engine problems.' }
        });
        const showBS10 = document.getElementById('showBS10');
        if (showBS10) showBS10.addEventListener('click', ()=>{
          const b1 = document.getElementById('bs101'); if (b1) { b1.textContent = 'because' }
          const b2 = document.getElementById('bs102'); if (b2) { b2.textContent = 'so' }
          const b3 = document.getElementById('bs103'); if (b3) { b3.textContent = 'so' }
        });
        const showPS10 = document.getElementById('showPS10');
        if (showPS10) showPS10.addEventListener('click', ()=>{
          const s1 = document.getElementById('ps101'); if (s1) { s1.textContent = 'We are monitoring the herd because we want healthy animals.' }
          const s2 = document.getElementById('ps102'); if (s2) { s2.textContent = 'We fixed the pump immediately because water is essential.' }
          const s3 = document.getElementById('ps103'); if (s3) { s3.textContent = 'The stress is over, so production will return to normal.' }
        });
          const showPR9 = document.getElementById('showPR9');
          if (showPR9) showPR9.addEventListener('click', ()=>{
            const r1 = document.getElementById('pr91'); if (r1) { r1.textContent = 'I always check the oil level.' }
            const r2 = document.getElementById('pr92'); if (r2) { r2.textContent = 'We usually clean the air filters on Friday.' }
            const r3 = document.getElementById('pr93'); if (r3) { r3.textContent = 'We sometimes change the tires.' }
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
        const lines = Array.isArray(d.lines) ? d.lines.map(l=> String(l.en||'').trim()).filter(Boolean) : [];
        if (lines.length) return lines;
        const nar = Array.isArray(d.a1_exercises && d.a1_exercises.narration_sentences) ? d.a1_exercises.narration_sentences.map(s=> String(s||'').trim()).filter(Boolean) : [];
        if (nar.length) return nar;
        const textParts = String(d.text||'').split(/(?<=[.!?])\s+/).filter(Boolean);
        if (textParts.length) return textParts;
        const voc = Array.isArray(d.vocabulary) ? d.vocabulary : [];
        if (voc.length) {
          return voc.map(v=> typeof v === 'string' ? v : (v.en || v.term || '')).filter(Boolean);
        }
        return [];
      }
      let sentences = getSentences(data);
      function getPtSentences(d){
        if (Array.isArray(d.pairs) && d.pairs.length) return d.pairs.map(p=>fixPT(p.pt));
        const trParts = String(d.translation||'').split(/(?<=[.!?])\s+/).map(fixPT).filter(Boolean);
        if (trParts.length) return trParts;
        const voc = Array.isArray(d.vocabulary) ? d.vocabulary : [];
        return voc.map(v=> typeof v === 'string' ? '' : fixPT(v.pt || v.translation || '')).filter(x=>true);
      }
      let ptSentences = getPtSentences(data);
      if (pronList) {
        const maxCount = (Number(idx)===3 ? 9 : 11);
        const isA1 = String(level).toUpperCase()==='A1';
        if (isA1 && Number(idx)===4) {
          sentences = [
            'I drive the green tractor.',
            'The farmer waters the plants in the greenhouse.',
            'The harvester collects the ripe wheat.',
            'The trailer carries bales of hay.',
            'He repairs the engine in the shed.',
            'The field is ready for sowing.',
            'The cow drinks water near the barn.'
          ];
          ptSentences = Array(sentences.length).fill('');
        }
        const shown = sentences.slice(0, Math.min((sentences.length || 0), maxCount));
        const useImages = isA1 && (Number(idx)===1 || Number(idx)===2 || Number(idx)===3 || Number(idx)===4);
        try {
          if (useImages) { pronList.classList.add('speech-a1'); } else { pronList.classList.remove('speech-a1'); }
        } catch {}
        const imgs = useImages ? (
          Number(idx)===1
            ? Array.from({length:shown.length}, (_,i)=> `/public/images/a1texto1/farmedition/${i+1}.webp`)
            : (Number(idx)===2
                ? Array.from({length:shown.length}, (_,i)=> `/public/images/a1texto2/${i+1}.${i+1}.webp`)
                : (Number(idx)===3
                    ? Array.from({length:shown.length}, (_,i)=> `/public/images/a1texto3/${i+1}.3.webp`)
                    : [
                      '/public/images/a1texto4/1.4.webp',
                      '/public/images/a1texto4/5.4.webp',
                      '/public/images/a1texto4/3.4.webp',
                      '/public/images/a1texto4/7.4.webp',
                      '/public/images/a1texto4/8.4.webp',
                      '/public/images/a1texto4/9.4.webp',
                      '/public/images/a1texto4/10.4.webp'
                    ]))
        ) : [];
        const segUrls = isA1 && Number(idx)===1
          ? Array.from({length:shown.length}, (_,i)=> `/src/audio/A1/texto-a1.1-dividido/seg${i+1}.mp3`)
          : (isA1 && Number(idx)===2
              ? Array.from({length:shown.length}, (_,i)=> `/src/audio/A1/texto-a1.2-dividido/${i+1}.${i+1}.mp3`)
              : (isA1 && Number(idx)===3
                  ? Array.from({length:shown.length}, (_,i)=> `/src/audio/A1/texto-a1.3-dividido/${i+1}.3.mp3`)
                  : (isA1 && Number(idx)===4
                      ? [
                        '/src/audio/A1/texto-a1.4-dividido/part_1.mp3',
                        '/src/audio/A1/texto-a1.4-dividido/part_5.mp3',
                        '/src/audio/A1/texto-a1.4-dividido/part_3.mp3',
                        '/src/audio/A1/texto-a1.4-dividido/part_7.mp3',
                        '/src/audio/A1/texto-a1.4-dividido/part_8.mp3',
                        '/src/audio/A1/texto-a1.4-dividido/part_9.mp3',
                        '/src/audio/A1/texto-a1.4-dividido/part_10.mp3'
                      ]
                      : [])));
        pronList.innerHTML = shown.map((s,i)=>`
          <div class="pron-card">
            ${useImages ? `<img src="${imgs[i]}" alt="${s}" loading="lazy" class="object-contain rounded-xl bg-gray-50 mx-auto block" />` : ''}
            <div class="text">${s}</div>
            <div class="toolbar" style="margin-top:8px">
              <button class="btn sm secondary" data-pron-play="${i}">Ouvir</button>
              <button class="btn sm" data-pron-record="${i}">Gravar</button>
              <button class="btn sm secondary" data-pron-stop="${i}">Parar</button>
              <button class="btn sm secondary" data-pron-playrec="${i}">Ouvir minha pronúncia</button>
              <button class="btn sm secondary" data-pron-compare="${i}">Comparar</button>
            </div>
            ${segUrls.length ? `<audio id="pron-orig-${i}" src="${segUrls[i]}" style="display:none"></audio>` : ''}
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
            const orig = document.getElementById('pron-orig-'+i);
            if (orig && orig.src) { try { orig.currentTime=0; orig.play(); } catch {} }
            else { speak(sentences[i]); }
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
            const orig = document.getElementById('pron-orig-'+i);
            if (orig && orig.src) { orig.currentTime=0; orig.play(); orig.onended = () => { if (a && a.src) a.play() }; }
            else {
              const voice = getVoice();
              const u = new SpeechSynthesisUtterance(sentences[i]);
              if (voice) u.voice = voice;
              u.rate = Number(localStorage.getItem('rate')||state.rate);
              u.pitch = Number(localStorage.getItem('pitch')||state.pitch);
              u.onend = () => { if (a && a.src) a.play() };
              window.speechSynthesis.cancel();
              window.speechSynthesis.speak(u);
            }
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
          const isA1 = String(level).toUpperCase()==='A1';
          const segUrls = (isA1 && Number(idx)===1)
            ? Array.from({length:max}, (_,i)=> `/src/audio/A1/texto-a1.1-dividido/seg${i+1}.mp3`)
            : (isA1 && Number(idx)===2)
              ? Array.from({length:max}, (_,i)=> `/src/audio/A1/texto-a1.2-dividido/${i+1}.${i+1}.mp3`)
              : (isA1 && Number(idx)===3)
                ? Array.from({length:max}, (_,i)=> `/src/audio/A1/texto-a1.3-dividido/${i+1}.3.mp3`)
                : (isA1 && Number(idx)===4)
                  ? [
                    '/src/audio/A1/texto-a1.4-dividido/part_1.mp3',
                    '/src/audio/A1/texto-a1.4-dividido/part_5.mp3',
                    '/src/audio/A1/texto-a1.4-dividido/part_3.mp3',
                    '/src/audio/A1/texto-a1.4-dividido/part_7.mp3',
                    '/src/audio/A1/texto-a1.4-dividido/part_8.mp3',
                    '/src/audio/A1/texto-a1.4-dividido/part_9.mp3'
                  ]
                  : [];
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
              ${segUrls.length ? `<audio id="pron-modal-orig-${i}" src="${segUrls[i]}" style="display:none"></audio>` : ''}
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
            const orig = document.getElementById('pron-modal-orig-'+i);
            if (orig && orig.src) { try { orig.currentTime=0; orig.play(); } catch {} }
            else { speak(sentences[i]); }
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
            const orig = document.getElementById('pron-modal-orig-'+i);
            if (orig && orig.src) { orig.currentTime=0; orig.play(); orig.onended = () => { if (a && a.src) a.play() }; }
            else {
              const voice = getVoice();
              const u = new SpeechSynthesisUtterance(sentences[i]);
              if (voice) u.voice = voice;
              u.rate = Number(localStorage.getItem('rate')||state.rate);
              u.pitch = Number(localStorage.getItem('pitch')||state.pitch);
              u.onend = () => { if (a && a.src) a.play() };
              window.speechSynthesis.cancel();
              window.speechSynthesis.speak(u);
            }
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
