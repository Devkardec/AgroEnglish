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
    const sentences = pairs.length ? pairs.map(p=>({en:p.en, pt:fixPT(p.pt)})) : String(data.text||'').split(/(?<=[.!?])\s+/).map((s,i)=>({en:s, pt:String(data.translation||'').split(/(?<=[.!?])\s+/).map(fixPT)[i]||''}));
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
  const chunks = String(text).split(/(?<=[.!?])\s+/);
  window.speechSynthesis.cancel();
  (function speakNext(i){
    if (i>=chunks.length) return;
    const u = new SpeechSynthesisUtterance(chunks[i]);
    if (voice) u.voice = voice;
    u.rate = Number(localStorage.getItem('rate')||state.rate);
    u.pitch = Number(localStorage.getItem('pitch')||state.pitch);
    u.onend = () => speakNext(i+1);
    window.speechSynthesis.speak(u);
  })(0);
}

function getVoice(){
  const v = state.voices;
  const pref = v.find(x=> x.name === state.voiceName);
  return pref || v[0] || null;
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

function annotateTextManual(str){
  return String(str||'')
    .replace(/\bprevents\b/g, "<span class='grammar-suffix'>prevents</span>")
    .replace(/\bkeeps\b/g, "<span class='grammar-suffix'>keeps</span>")
    .replace(/\brotates\b/g, "<span class='grammar-suffix'>rotates</span>")
    .replace(/\bdrives\b/g, "<span class='grammar-suffix'>drives</span>")
    .replace(/\bdo\b/g, "<span class='grammar-aux'>do</span>")
    .replace(/\bdoes\b/g, "<span class='grammar-aux'>does</span>")
    .replace(/\bdon't\b/g, "<span class='grammar-aux'>don't</span>")
    .replace(/\bdoesn't\b/g, "<span class='grammar-aux'>doesn't</span>");
}

function renderVerbsModule(data){
  const el = document.querySelector('#verbs');
  if (!el) return;
  const pairs = Array.isArray(data.pairs) ? data.pairs : [];
  const examples = pairs.filter(p=>/\b(prevents|keeps|rotates|drives)\b/i.test(p.en)).slice(0,4);
  const cards = examples.map(p=>`<div class="card"><div class="line"><div class="en">${annotateTextManual(p.en)}</div><div class="pt">${fixPT(p.pt||'')}</div></div></div>`).join('');
  el.innerHTML = `<div class="section-title">Verbos na 3ª pessoa</div><div class="grid">${cards||'<div class="small">Sem exemplos com prevents/keeps/rotates/drives neste texto.</div>'}</div>`;
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
  app.innerHTML = Header() + view;
  pageInit();
}

function initGlossaryPage() {
  const filterContainer = document.querySelector('.filter-container');
  const grid = document.getElementById('glossary-grid');

  if (filterContainer && grid) {
    // Handle clicks on filter buttons
    filterContainer.addEventListener('click', (e) => {
      if (e.target.matches('.filter-btn')) {
        const category = e.target.dataset.category;

        // Update the active state on buttons
        filterContainer.querySelector('.filter-btn.active').classList.remove('active');
        e.target.classList.add('active');

        // Filter the vocabulary data based on the selected category
        const filteredData = category === 'All'
          ? vocabularyData
          : vocabularyData.filter(item => item.category === category);
        
        // Re-render the grid with the filtered cards
        grid.innerHTML = filteredData.map(GlossaryCard).join('');
      }
    });

    // Handle clicks on the grid for both flipping and speaking
    grid.addEventListener('click', (e) => {
      const speakButton = e.target.closest('.speak-btn');
      if (speakButton) {
        e.stopPropagation(); // Prevents the card from flipping
        const termToSpeak = speakButton.dataset.term;
        if (termToSpeak) {
          speak(termToSpeak);
        }
        return;
      }

      const cardContainer = e.target.closest('.glossary-card-container');
      if (cardContainer) {
        cardContainer.querySelector('.glossary-card').classList.toggle('is-flipped');
      }
    });
  }
}

function initHomePage() {
  const lvls = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const preload = document.getElementById('preload');
  const cont = document.getElementById('continueCta');
  const prog = JSON.parse(localStorage.getItem('progress')||'{}');
  const last = prog.lastLevel;
  const idx = last ? (prog[last]||1) : 1;
  if (cont) cont.setAttribute('href', last ? `#/text/${last}/${idx}` : '#/text/A1/1');
  const percent = last ? Math.round(((idx-1)/10)*100) : 0;
  const badge = document.getElementById('progressBadge');
  if (badge) badge.textContent = `Progresso ${percent}%`;
  lvls.forEach(l=>{ const b=document.getElementById(`badge-${l}`); if(b){ const n=prog[l]||0; b.textContent = `${n}/10` } });

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
        for (let i = 1; i <= 10; i++) {
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
  const path = `/src/data/texts/${level}/basic.json`;
  fetch(path)
    .then(r => r.json())
    .then(list => {
      const container = document.getElementById('phrases');
      if (container) {
        container.innerHTML = list.map((p, i) => PhraseCard(p, i)).join('');
        setupRecording(container);
      }
    })
    .catch(() => {
      const container = document.getElementById('phrases');
      if (container) {
        container.innerHTML = '<div class="card">Sem dados offline para este nível.</div>';
      }
    });

  function setupRecording(container) {
    let mediaRecorder;
    let recordedChunks = [];
    let mediaStream;

    container.addEventListener('click', async (event) => {
      const target = event.target;
      const action = target.dataset.action;
      const index = target.dataset.index;

      if (!action || index === null) return;

      const card = target.closest(`[data-phrase-card="${index}"]`);
      if (!card) return;

      const recordBtn = card.querySelector('.record-btn');
      const stopBtn = card.querySelector('.stop-btn');
      const playRecBtn = card.querySelector('.play-rec-btn');
      const audioPlayer = card.querySelector('.audio-player');
      const statusEl = card.querySelector('.status');

      const setStatus = (msg) => {
        if (statusEl) statusEl.textContent = msg;
      };

      if (action === 'record') {
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          recordedChunks = [];
          mediaRecorder = new MediaRecorder(mediaStream);

          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              recordedChunks.push(e.data);
            }
          };

          mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(blob);
            audioPlayer.src = audioUrl;
            setStatus('Gravação concluída.');
            stopBtn.style.display = 'none';
            playRecBtn.style.display = 'inline-block';
            recordBtn.style.display = 'inline-block';
          };

          mediaRecorder.start();
          setStatus('Gravando...');
          recordBtn.style.display = 'none';
          stopBtn.style.display = 'inline-block';
          playRecBtn.style.display = 'none';
          audioPlayer.style.display = 'none';

        } catch (err) {
          setStatus('Permissão para microfone negada.');
          console.error('Error accessing microphone:', err);
        }
      } else if (action === 'stop') {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
        if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop());
        }
        setStatus('Parando gravação...');
      } else if (action === 'play-rec') {
        if (audioPlayer.src) {
          audioPlayer.style.display = 'block';
          audioPlayer.play();
        }
      }
    });
  }

  const textList = document.getElementById('textList');
  if (textList) {
    const reqs = Array.from({ length: 10 }, (_, i) => fetch(`/src/data/texts/${level}/text${i + 1}.json`).then(r => r.json()).catch(()=>null));
    Promise.all(reqs).then(items => {
      const links = items.map((data, i) => {
        const title = (data && data.title) ? data.title : `Texto ${i+1}`;
        return `<a class="level-card" href="#/text/${level}/${i+1}"><span class="title">${title}</span><span class="badge">${i+1}/10</span></a>`;
      }).join('');
      textList.innerHTML = links;
    }).catch(()=>{
      textList.innerHTML = Array.from({length:10},(_,i)=>`<a class="level-card" href="#/text/${level}/${i+1}"><span class="title">Texto ${i+1}</span></a>`).join('');
    });
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

  function setupAudio() {
    const rate = Number(localStorage.getItem('rate') || 1);
    const pitch = Number(localStorage.getItem('pitch') || 1);
    const voiceName = localStorage.getItem('voiceName') || '';
    const getVoice = () =>
      window.speechSynthesis.getVoices().find((v) => v.name === voiceName) ||
      null;

    let currentUtter = null;
    function narrate(txt) { if (!txt) return; speak(txt); }

    document.querySelector('#play').addEventListener('click', () => {
      const enText = Array.from(linesEl.querySelectorAll('.line .en')).map(el=>el.textContent).join(' ');
      narrate(enText);
    });
    const resumeBtn = document.querySelector('#resume');
    if (resumeBtn) resumeBtn.addEventListener('click', () => window.speechSynthesis.resume());
    document.querySelector('#pause').addEventListener('click', () => window.speechSynthesis.pause());
    document.querySelector('#stop').addEventListener('click', () => window.speechSynthesis.cancel());
    document.querySelectorAll('[data-speed]').forEach((b) => {
      b.addEventListener('click', () => {
        localStorage.setItem('rate', b.dataset.speed);
      });
    });
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
      const en = String(data.text||'').split(/(?<=[.!?])\s+/);
      const pt = String(data.translation||'').split(/(?<=[.!?])\s+/).map(fixPT);
      items = en.map((s,i)=>({ en: s, pt: pt[i]||'' }));
    }
    const width = vocabEl.clientWidth || 980;
    const cols = Math.max(1, Math.floor(width / 200));
    const rows = window.innerWidth < 640 ? 2 : 3;
    const max = Math.min(items.length, cols * rows);
    const shown = items.slice(0, max);
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
      const enText = card.dataset.en || '';
      speak(enText);
      card.classList.toggle('flipped');
    });
  }

  function renderGrammar(data) {
    const el = document.querySelector('#grammar');
    if (!el) return;
    const pairs = (Array.isArray(data.pairs) && data.pairs.length) ? data.pairs : [];
    const sentences = pairs.length ? pairs.map(p=>({en:p.en, pt:fixPT(p.pt)})) : String(data.text||'').split(/(?<=[.!?])\s+/).map((s,i)=>({en:s, pt:String(data.translation||'').split(/(?<=[.!?])\s+/).map(fixPT)[i]||''}));
    const gRaw = String(data.grammar||'');
    function explainForBeginners(v){
      const k = String(v||'').toLowerCase();
      if (k.includes('present simple')) {
        return `
          <div class="card">
            <div class="small">
              <ul style="margin:0;padding-left:18px;line-height:1.6">
                <li><strong>Uso:</strong> rotina da fazenda com verbos de ação: work, drive, check, feed.</li>
                <li><strong>Forma direta:</strong> diga quem faz + verbo base. 
                  <span style="color:#c2132a;font-weight:800">He/She/It</span> ganha 
                  <span style="color:#c2132a;font-weight:800">s</span> no verbo.
                  Ex.: <strong>I drive</strong> · <strong>He drive<span style="color:#c2132a;font-weight:800">s</span></strong>.
                </li>
                <li><strong>Negativa:</strong> 
                  <span style="color:#123b7a;font-weight:800">don't</span> para I/You/We/They · 
                  <span style="color:#123b7a;font-weight:800">doesn't</span> para He/She/It. 
                  Ex.: <strong>We <span style="color:#123b7a">don't</span> check</strong> · 
                  <strong>He <span style="color:#123b7a">doesn't</span> check</strong>.
                </li>
                <li><strong>Pergunta:</strong> 
                  <span style="color:#123b7a;font-weight:800">Do</span> (I/You/We/They) · 
                  <span style="color:#123b7a;font-weight:800">Does</span> (He/She/It) + verbo base. 
                  Ex.: <strong>Do you work?</strong> · <strong>Does he drive?</strong>
                </li>
                <li><strong>Exemplos agro curtos:</strong> 
                  <strong>I drive</strong> the tractor · 
                  <strong>She drive<span style="color:#c2132a;font-weight:800">s</span></strong> the tractor. 
                  <strong>We check</strong> water · 
                  <strong>Sprayer calibration prevent<span style="color:#c2132a;font-weight:800">s</span></strong> over application.
                </li>
              </ul>
            </div>
          </div>
        `;
      }
      if (k.includes('past simple')) {
        return `
          <div class="card">
            <div class="small">
              <div><strong>O que é:</strong> tempo para eventos concluídos no passado.</div>
              <div style="margin-top:6px"><strong>Como formar:</strong> verbo no passado (<em>worked</em>, <em>checked</em>). Irregulares mudam forma (<em>went</em>).</div>
              <div style="margin-top:6px"><strong>Negativa:</strong> <em>did not (didn't)</em> + verbo base.</div>
              <div style="margin-top:6px"><strong>Pergunta:</strong> <em>Did</em> + sujeito + verbo base?</div>
            </div>
          </div>
        `;
      }
      if (k.includes('passive')) {
        return `
          <div class="card">
            <div class="small">
              <div><strong>Ideia:</strong> foca na ação, não em quem a faz.</div>
              <div style="margin-top:6px"><strong>Estrutura:</strong> <em>be</em> + particípio (<em>is checked</em>, <em>was calibrated</em>).</div>
            </div>
          </div>
        `;
      }
      if (k.includes('modals')) {
        return `
          <div class="card">
            <div class="small">
              <div><strong>Função:</strong> dar conselho, obrigação ou possibilidade.</div>
              <div style="margin-top:6px"><strong>Exemplos:</strong> <em>should</em>, <em>must</em>, <em>can</em>, <em>may</em>.</div>
            </div>
          </div>
        `;
      }
      return `
        <div class="card">
          <div class="small">Explicação básica: foque em sujeito + verbo + complemento e observe exemplos.</div>
        </div>
      `;
    }
    const groupI = sentences.filter(s=>/^\s*i\b/i.test(s.en)).slice(0,4);
    const groupWe = sentences.filter(s=>/^\s*we\b/i.test(s.en)).slice(0,4);
    const groupIt = sentences.filter(s=>/^(the tractor|the greenhouse|veterinary biosecurity|irrigation)\b/i.test(s.en)).slice(0,4);
    function tableRow(subj, arr){ return arr.map(s=>`<tr><td>${subj}</td><td>${annotateTextManual(s.en)}</td><td>${fixPT(s.pt||'')}</td></tr>`).join('') }
    const conjTable = `
      <table style="width:100%;border-collapse:collapse">
        <thead><tr><th style="text-align:left">Sujeito</th><th style="text-align:left">Frase (EN)</th><th style="text-align:left">Tradução (PT)</th></tr></thead>
        <tbody>
          ${tableRow('I', groupI)}
          ${tableRow('We', groupWe)}
          ${tableRow('It', groupIt)}
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
    const neg = (s)=>({ en: annotateTextManual(buildPresentSimpleForms(s.en).negative), pt: s.pt });
    const ques = (s)=>({ en: annotateTextManual(buildPresentSimpleForms(s.en).interrogative), pt: s.pt });
    const aff = practice;
    const negs = aff.map(neg);
    const quess = aff.map(ques);
    function table3(a,b,c){ return `
      <table style="width:100%;border-collapse:collapse">
        <thead><tr><th style="text-align:left">Afirmativa</th><th style="text-align:left">Negativa</th><th style="text-align:left">Pergunta</th></tr></thead>
        <tbody>
          ${a.map((x,i)=>`<tr><td>${annotateTextManual(x.en)}</td><td>${b[i].en}</td><td>${c[i].en}</td></tr>`).join('')}
        </tbody>
      </table>
    ` }
    const sThird = sentences.filter(s=>/(prevents|keeps|helps|needs|starts|drives|checks|records|monitors|rotates|improves)/i.test(s.en)).slice(0,5);
    const sTable = `
      <table style="width:100%;border-collapse:collapse">
        <thead><tr><th style="text-align:left">Forma</th><th style="text-align:left">Exemplo</th></tr></thead>
        <tbody>
          ${sThird.map(s=>`<tr><td>He/She/It: +s</td><td>${annotateTextManual(s.en)}</td></tr>`).join('')}
          ${groupWe.slice(0,3).map(s=>`<tr><td>I/You/We/They: base</td><td>${s.en}</td></tr>`).join('')}
        </tbody>
      </table>
    `;
    const explainList = aff.map(s=>`<div class="card"><div class="line"><div class="en">${annotateTextManual(s.en)}</div><div class="pt">${fixPT(s.pt||'')}</div></div><div class="small" style="margin-top:6px">Presente simples: rotina agrícola.</div><div style="margin-top:8px"><button class="btn secondary" data-action="speak" data-text="${s.en}">Ouvir Áudio</button></div></div>`).join('');
    const whenList = [...groupWe.slice(0,3), ...groupIt.slice(0,2)].map(s=>`<div class="card"><div class="line"><div class="en">${annotateTextManual(s.en)}</div><div class="pt">${fixPT(s.pt||'')}</div></div></div>`).join('');
    el.innerHTML = `
      <div class="section-title">Explicação para iniciantes</div>
      <div>${explainForBeginners(gRaw)}</div>
      <div class="section-title" style="margin-top:12px">Quando usar</div>
      <div class="grid">${whenList}</div>
      <div class="section-title" style="margin-top:12px">Estrutura (Tradução)</div>
      <div>${conjTable}</div>
      <div class="section-title" style="margin-top:12px">Afirmativa/Negativa/Pergunta</div>
      <div>${table3(aff,negs,quess)}</div>
      <div class="section-title" style="margin-top:12px">Regra He/She/It (+s)</div>
      <div>${sTable}</div>
    `;

    const speechEx = document.getElementById('speechExamples');
    if (speechEx) speechEx.innerHTML = explainList;
    const gEx = document.getElementById('gExercises');
    function renderVerbFill(){ const items = [
      { sentence: 'We ____ pastures to improve forage quality.', answer: 'rotate' },
      { sentence: 'We ____ yields and monitor feed intake.', answer: 'record' },
      { sentence: 'I ____ the tractor carefully.', answer: 'start' },
      { sentence: 'I ____ cows and check plants.', answer: 'feed' }
    ]; gEx.innerHTML += `<div class="section-title" style="margin-top:10px">Complete com o verbo</div>`; const html = items.map((f,i)=>`<div class="card"><div>${i+1}. ${f.sentence.replace('____',`<input class="blank" data-gv="${i}" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px" />`)}</div></div>`).join(''); gEx.innerHTML += `<div>${html}</div><div class="small" id="gVRes" style="margin-top:6px"></div><button class="btn" id="gVCheck" style="margin-top:8px">Checar</button>`; document.getElementById('gVCheck').addEventListener('click', ()=>{ const inputs = gEx.querySelectorAll('input.blank[data-gv]'); let c=0; inputs.forEach(inp=>{ const i=Number(inp.dataset.gv); const ok = (inp.value||'').trim().toLowerCase()===items[i].answer; if(ok) c++ }); document.getElementById('gVRes').textContent = c===inputs.length ? 'Good pronunciation!' : 'Try again.' }) }
    function renderDoDoes(){ const items = [
      { sentence: '[____] we water animals and fix tools?', answer: 'do' },
      { sentence: '[____] the tractor need a safety check?', answer: 'does' },
      { sentence: '[____] sprayer calibration prevent over application?', answer: 'does' }
    ]; gEx.innerHTML += `<div class="section-title" style="margin-top:10px">Complete com do/does</div>`; const html = items.map((f,i)=>`<div class="card"><div>${i+1}. ${f.sentence.replace('[____]',`<input class="blank" data-dd="${i}" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px;width:80px" />`)}</div></div>`).join(''); gEx.innerHTML += `<div>${html}</div><div class="small" id="gDDRes" style="margin-top:6px"></div><button class="btn" id="gDDCheck" style="margin-top:8px">Checar</button>`; document.getElementById('gDDCheck').addEventListener('click', ()=>{ const inputs = gEx.querySelectorAll('input.blank[data-dd]'); let c=0; inputs.forEach(inp=>{ const i=Number(inp.dataset.dd); const ok = (inp.value||'').trim().toLowerCase()===items[i].answer; if(ok) c++ }); document.getElementById('gDDRes').textContent = c===inputs.length ? 'Good pronunciation!' : 'Try again.' }) }
    function renderClassify(){ const items = aff.map((a,i)=>({a:a.en,n:negs[i].en,q:quess[i].en})).slice(0,3).flatMap(x=>[ {txt:x.a, type:'Afirmativa'}, {txt:x.n, type:'Negativa'}, {txt:x.q, type:'Pergunta'} ]).sort(()=>Math.random()-0.5); gEx.innerHTML += `<div class="section-title" style="margin-top:10px">Classifique</div>`; const html = items.map((it,i)=>`<div class="card"><div>${i+1}. ${it.txt}</div><div style="margin-top:6px"><button class="btn secondary" data-clf="${i}" data-type="Afirmativa">Afirmativa</button> <button class="btn secondary" data-clf="${i}" data-type="Negativa">Negativa</button> <button class="btn secondary" data-clf="${i}" data-type="Pergunta">Pergunta</button></div><div class="small" id="clf${i}" style="margin-top:6px"></div></div>`).join(''); gEx.innerHTML += `<div>${html}</div>`; gEx.addEventListener('click',(e)=>{ const t=e.target; if(!t.dataset.clf) return; const i=Number(t.dataset.clf); const res = document.getElementById('clf'+i); const chosen = t.dataset.type; const correct = items[i].type; res.textContent = chosen===correct ? 'Good pronunciation!' : 'Try again.' }) }
    function renderTransform(){ const items = aff.slice(0,3); gEx.innerHTML += `<div class="section-title" style="margin-top:10px">Transforme</div>`; const html = items.map((s,i)=>`<div class="card"><div>${i+1}. ${s.en}</div><div style="margin-top:6px"><button class="btn secondary" data-showneg="${i}">Ver negativa</button> <button class="btn secondary" data-showq="${i}">Ver pergunta</button></div><div class="small" id="tr${i}" style="margin-top:6px"></div></div>`).join(''); gEx.innerHTML += `<div>${html}</div>`; gEx.addEventListener('click',(e)=>{ const t=e.target; if(t.dataset.showneg){ const i=Number(t.dataset.showneg); document.getElementById('tr'+i).textContent = negs[i].en; } if(t.dataset.showq){ const i=Number(t.dataset.showq); document.getElementById('tr'+i).textContent = quess[i].en; } }) }
    renderVerbFill(); renderDoDoes(); renderClassify(); renderTransform();
  }

  function renderVerbs(data) {
    const el = document.querySelector('#verbs');
    if (!el) return;
    const listStr = String(data.verbs||'');
    const m = listStr.split(':')[1] || listStr;
    const baseVerbs = m.split(',').map(s=>s.trim()).filter(Boolean);
    const pairs = (Array.isArray(data.pairs) && data.pairs.length) ? data.pairs : [];
    const sentences = pairs.length ? pairs.map(p=>({en:p.en, pt:fixPT(p.pt)})) : String(data.text||'').split(/(?<=[.!?])\s+/).map((s,i)=>({en:s, pt:String(data.translation||'').split(/(?<=[.!?])\s+/).map(fixPT)[i]||''}));
    function exampleForVerb(v){ const found = sentences.find(s=> new RegExp(`\b${v}(s)?\b`,'i').test(s.en)); if (found) return found; const fb = {
      feed:{en:'We feed the cows every morning.', pt:'Nós alimentamos as vacas todas as manhãs.'},
      check:{en:'We check water for the animals.', pt:'Nós verificamos a água dos animais.'},
      start:{en:'I start the tractor carefully.', pt:'Eu ligo o trator com cuidado.'},
      clean:{en:'I clean the barn after milking.', pt:'Eu limpo o celeiro após a ordenha.'},
      adjust:{en:'We adjust sprayer calibration.', pt:'Nós ajustamos a calibração do pulverizador.'},
      monitor:{en:'We monitor feed intake.', pt:'Nós monitoramos o consumo de ração.'},
      operate:{en:'We operate the sprayer safely.', pt:'Nós operamos o pulverizador com segurança.'},
      record:{en:'We record yields each week.', pt:'Nós registramos a produtividade toda semana.'},
      assess:{en:'We assess pasture quality.', pt:'Nós avaliamos a qualidade da pastagem.'},
      coordinate:{en:'We coordinate biosecurity routines.', pt:'Nós coordenamos rotinas de biossegurança.'}
    }; return fb[v] || {en:`We ${v} on the farm.`, pt:`Nós ${v} na fazenda.`}; }
    function thirdForm(v){ if(/(ch|sh|x|o)$/i.test(v)||v==='go') return v==='go'?'goes':v+'es'; if(/y$/i.test(v)) return v.replace(/y$/,'ies'); return v+'s'; }
    function ingForm(v){ if(/e$/i.test(v) && v!=='be') return v.replace(/e$/,'')+'ing'; return v+'ing'; }
    function pastForm(v){ const irr={feed:'fed',go:'went',have:'had',do:'did',buy:'bought'}; if(irr[v]) return irr[v]; if(/e$/i.test(v)) return v+'d'; return v+'ed'; }
    const listHtml = baseVerbs.map(v=>`<div class="selector"><div class="option" data-verb="${v}">${v}</div></div>`).join('');
    const collocations = `
      <div class="grid">
        <div class="card"><div>feed + cows</div><div class="small">Alimentar o gado diariamente.</div></div>
        <div class="card"><div>check + water</div><div class="small">Verificar água dos animais.</div></div>
        <div class="card"><div>start + tractor</div><div class="small">Ligar o trator com segurança.</div></div>
        <div class="card"><div>record + yields</div><div class="small">Registrar produtividade.</div></div>
        <div class="card"><div>monitor + intake</div><div class="small">Monitorar consumo de ração.</div></div>
        <div class="card"><div>calibrate + sprayer</div><div class="small">Calibrar pulverizador.</div></div>
      </div>
    `;
    el.innerHTML = `
      <details class="accordion">
        <summary class="section-title">Conceito</summary>
        <div>
          <div class="small">Verbos são ações. Use forma base para I/You/We/They e acrescente s/es em He/She/It.</div>
          <div class="small" style="margin-top:6px">Use -ing para atividades em progresso e -ed para passado regular.</div>
          <div class="small" style="margin-top:6px">Irregulares mudam forma no passado (ex.: go → went).</div>
        </div>
      </details>
      <details class="accordion">
        <summary class="section-title">Lista</summary>
        <div class="small">${listHtml}</div>
      </details>
      <details class="accordion">
        <summary class="section-title">Painel do verbo</summary>
        <div id="verbPanel">
          <div class="small">Selecione um verbo na lista para ver formas, exemplos e prática.</div>
          <div id="verbConj" style="margin-top:10px"></div>
          <div id="verbExamples" style="margin-top:10px"></div>
        </div>
      </details>
      <details class="accordion">
        <summary class="section-title">Prática</summary>
        <div id="vExercises"></div>
      </details>
      <details class="accordion">
        <summary class="section-title">Colocações no agro</summary>
        <div>${collocations}</div>
      </details>
      <details class="accordion">
        <summary class="section-title">Pronúncia</summary>
        <div class="small">Fale lentamente, enfatize consoantes finais (feed, record) e pratique pares similares (record x regard).</div>
      </details>
      <div class="small" style="margin-top:8px">Vistos neste texto: ${baseVerbs.join(', ')}</div>
    `;
    const vEx = document.getElementById('vExercises');
    if (vEx) {
      const fillItems = [
        { sentence: 'We ____ the cows every morning.', answer: 'feed' },
        { sentence: 'Start the ____ carefully.', answer: 'tractor' },
        { sentence: 'We ____ yields and ____ feed intake.', answer: 'record|monitor' }
      ];
      const fillHtml = fillItems.map((f,i)=>{
        const s = f.sentence.replace('____',`<input class="blank" data-vf="${i}" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px" />`).replace('____',`<input class="blank" data-vf2="${i}" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px" />`);
        return `<div class="card"><div>${i+1}. ${s}</div></div>`;
      }).join('');
      vEx.innerHTML = `<div class="section-title">Complete com o verbo</div><div>${fillHtml}</div><div class="small" id="vFRes" style="margin-top:6px"></div><button class="btn" id="vFCheck" style="margin-top:8px">Checar</button>`;
      const sItems = [
        { base:'monitor', subj:'He', expect:'monitors' },
        { base:'help', subj:'She', expect:'helps' },
        { base:'record', subj:'It', expect:'records' }
      ];
      const sHtml = sItems.map((it,i)=>`<div class="card"><div>${i+1}. ${it.subj} ____ feed intake.</div><input class="blank" data-vs="${i}" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px;width:120px" /></div>`).join('');
      vEx.innerHTML += `<div class="section-title" style="margin-top:10px">He/She/It (+s)</div><div>${sHtml}</div><div class="small" id="vSRes" style="margin-top:6px"></div><button class="btn" id="vSCheck" style="margin-top:8px">Checar</button>`;
      const ingItems = [
        { base:'feed', expect:'feeding' },
        { base:'check', expect:'checking' },
        { base:'operate', expect:'operating' }
      ];
      const ingHtml = ingItems.map((it,i)=>`<div class="card"><div>${i+1}. ${it.base} → <input class="blank" data-vi="${i}" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px;width:140px" /></div></div>`).join('');
      vEx.innerHTML += `<div class="section-title" style="margin-top:10px">Forma -ing</div><div>${ingHtml}</div><div class="small" id="vIRes" style="margin-top:6px"></div><button class="btn" id="vICheck" style="margin-top:8px">Checar</button>`;
      document.getElementById('vFCheck').addEventListener('click', ()=>{
        let c=0; fillItems.forEach((f,i)=>{
          const a = (f.answer||'').toLowerCase();
          const parts = a.split('|');
          const inp1 = vEx.querySelector(`input[data-vf="${i}"]`);
          const inp2 = vEx.querySelector(`input[data-vf2="${i}"]`);
          const v1 = (inp1&&inp1.value||'').trim().toLowerCase();
          const v2 = (inp2&&inp2.value||'').trim().toLowerCase();
          if (parts.length===1) { if (v1===parts[0]) c++; }
          else { if (v1===parts[0] && v2===parts[1]) c++; }
        });
        document.getElementById('vFRes').textContent = c===fillItems.length ? 'Acertou!' : 'Tente novamente.';
      });
      document.getElementById('vSCheck').addEventListener('click', ()=>{
        let c=0; sItems.forEach((it,i)=>{ const inp=vEx.querySelector(`input[data-vs="${i}"]`); if((inp&&inp.value||'').trim().toLowerCase()===it.expect) c++ });
        document.getElementById('vSRes').textContent = c===sItems.length ? 'Acertou!' : 'Tente novamente.';
      });
      document.getElementById('vICheck').addEventListener('click', ()=>{
        let c=0; ingItems.forEach((it,i)=>{ const inp=vEx.querySelector(`input[data-vi="${i}"]`); if((inp&&inp.value||'').trim().toLowerCase()===it.expect) c++ });
        document.getElementById('vIRes').textContent = c===ingItems.length ? 'Acertou!' : 'Tente novamente.';
      });
    }
    function renderVerbPanel(v){ const ex = exampleForVerb(v); const conjHtml = `
      <table style="width:100%;border-collapse:collapse">
        <thead><tr><th style="text-align:left">Forma</th><th style="text-align:left">Exemplo</th></tr></thead>
        <tbody>
          <tr><td>Base</td><td>We ${v} on the farm.</td></tr>
          <tr><td>He/She/It</td><td>He ${thirdForm(v)} tools.</td></tr>
          <tr><td>-ing</td><td>${ingForm(v)} tasks now.</td></tr>
          <tr><td>Past</td><td>We ${pastForm(v)} yesterday.</td></tr>
        </tbody>
      </table>`;
      document.getElementById('verbConj').innerHTML = conjHtml;
      document.getElementById('verbExamples').innerHTML = `
        <div class="card">
          <div class="line"><div class="en">${ex.en}</div><div class="pt">${fixPT(ex.pt||'')}</div></div>
          <div style="margin-top:8px"><button class="btn secondary" data-action="speak" data-text="${ex.en}">Ouvir Áudio</button></div>
        </div>`;
    }
    el.addEventListener('click',(e)=>{ const op = e.target.closest('.option[data-verb]'); if(!op) return; el.querySelectorAll('.selector .option').forEach(o=>o.classList.remove('active')); op.classList.add('active'); renderVerbPanel(op.dataset.verb); });
    const firstVerb = baseVerbs[0]; if(firstVerb){ const firstOp = el.querySelector(`.option[data-verb="${firstVerb}"]`); if(firstOp) firstOp.classList.add('active'); renderVerbPanel(firstVerb); }
  }

  function renderMC(data) {
    const mcEl = document.querySelector('#mc');
    let src;

    if (data && data.exercises && Array.isArray(data.exercises.multiple_choice) && data.exercises.multiple_choice.length) {
        src = data.exercises.multiple_choice.map(q => {
            const correctAnswer = q.options[q.answer];
            const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
            const newAnswer = shuffledOptions.indexOf(correctAnswer);
            return {
                question: q.question,
                options: shuffledOptions,
                answer: newAnswer
            };
        });
    } else {
        src = (() => {
          const pairs = Array.isArray(data.pairs) ? data.pairs.slice(0,5) : [];
          if (pairs.length) {
            return pairs.map(p => {
              const correctAnswer = fixPT(p.pt);
              const options = [correctAnswer, 'Trator', 'Estufa', 'Segurança'].sort(() => Math.random() - 0.5);
              const answer = options.indexOf(correctAnswer);
              return { question: `Tradução correta: "${p.en}"`, options, answer };
            });
          }
          const voc = Array.isArray(data.vocabulary) ? data.vocabulary : [];
          const items = voc.slice(0,5);
          return items.map((v)=>{
            const correctAnswer = v.meaning;
            const distractors = voc.map(v=>v.meaning).filter(Boolean).filter(m => m !== correctAnswer);
            const opts = [correctAnswer];
            while (opts.length<4 && distractors.length) {
              const pick = distractors.splice(Math.floor(Math.random()*distractors.length), 1)[0];
              if (!opts.includes(pick)) opts.push(pick);
            }
            const shuffledOpts = opts.sort(()=>Math.random()-0.5);
            const answer = shuffledOpts.indexOf(correctAnswer);
            return { question:`Qual é a tradução de "${v.word}"?`, options: shuffledOpts, answer };
          });
        })();
    }

    mcEl.innerHTML = src.map((q,i)=>`
      <div class="card">
        <div><strong>${i+1}. ${q.question}</strong></div>
        <div style="margin-top:6px">${q.options.map((op,j)=>`<button class="btn secondary" data-mc="${i}" data-idx="${j}">${op}</button>`).join(' ')}</div>
        <div class="small" id="mcRes${i}" style="margin-top:6px"></div>
      </div>
    `).join('') || '<div class="small">Sem questões disponíveis.</div>';

    mcEl.addEventListener('click', (e) => {
      const t = e.target;
      if (!t.dataset.mc) return;
      const qi = Number(t.dataset.mc);
      const oi = Number(t.dataset.idx);
      const ok = oi === src[qi].answer;
      const resEl = document.getElementById('mcRes' + qi);
      resEl.textContent = ok ? 'Acertou!' : 'Tente novamente.';
      resEl.style.color = ok ? 'green' : 'red';
    });
  }

  function renderFill(data) {
    const fillEl = document.querySelector('#fill');
    const src = (data && data.exercises && Array.isArray(data.exercises.fill_in) && data.exercises.fill_in.length) ? data.exercises.fill_in : (()=>{
      const pairs = Array.isArray(data.pairs) ? data.pairs.slice(0,3) : [];
      if (pairs.length) {
        return pairs.map(p=>{
          const words = p.en.split(' ');
          const target = words.find(w=>/^(tractor|water|gloves|masks|record|monitor|feed|start)$/i.test(w)) || words[1] || words[0];
          return { sentence: p.en.replace(target,'____'), answer: target.replace(/[.,]/g,'').toLowerCase() };
        });
      }
      const textParts = String(data.text||'').split(/(?<=[.!?])\s+/).filter(Boolean);
      const verbs = String(data.verbs||'').split(':')[1] || String(data.verbs||'');
      const baseVerbs = verbs.split(',').map(s=>s.trim()).filter(Boolean);
      const items = textParts.slice(0,3).map((s)=>{
        const v = baseVerbs.find(vv=> new RegExp(`\b${vv}(s)?\b`,'i').test(s));
        if (v) return { sentence: s.replace(new RegExp(`\b${v}(s)?\b`,'i'),'____'), answer: v.replace(/s$/,'') };
        const w = (s.split(' ')[2]||'tractor');
        return { sentence: s.replace(w,'____'), answer: w.replace(/[.,]/g,'').toLowerCase() };
      });
      return items;
    })();
    fillEl.innerHTML = src.map((f,i)=>`
      <div class="card"><div>${i+1}. ${f.sentence.replace('____',`<input class="blank" data-fill="${i}" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px" />`)}</div></div>
    `).join('') || '<div class="small">Sem itens para completar.</div>';
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
      const pairs = (Array.isArray(data.pairs) && data.pairs.length) ? data.pairs : [];
      if (pairs.length) {
      linesEl.innerHTML = pairs.map(p=>`<div class="line"><div class="en">${annotateTextManual(p.en)}</div><div class="pt">${fixPT(p.pt)}</div></div>`).join('');
        return;
      }
      const en = String(data.text||'').split(/(?<=[.!?])\s+/).filter(Boolean);
      const pt = String(data.translation||'').split(/(?<=[.!?])\s+/).map(fixPT);
      linesEl.innerHTML = en.map((s,i)=>`<div class="line"><div class="en">${annotateTextManual(s)}</div><div class="pt">${pt[i]||''}</div></div>`).join('');
      if (!linesEl.innerHTML) {
        linesEl.innerHTML = '<div class="small">Texto indisponível.</div>';
      }
    } catch {
      linesEl.innerHTML = '<div class="small">Texto indisponível.</div>';
    }
  }

  function fetchText() {
    return fetch(path1).then(r=> r.ok ? r.json() : Promise.reject()).catch(()=> fetch(path2).then(r=>r.json()));
  }
  fetchText()
    .then((data) => {
      setupUI(data);
      renderLines(data);
      setupAudio();
      
      try { renderVocabulary(data); } catch (e) { console.error('Error in renderVocabulary:', e); }
      try { renderGrammar(data); } catch (e) { console.error('Error in renderGrammar:', e); }
      try { renderVerbs(data); } catch (e) { console.error('Error in renderVerbs:', e); }
      try { renderVerbsModule(data); } catch (e) { console.error('Error in renderVerbsModule:', e); }
      try { renderMC(data); } catch (e) { console.error('Error in renderMC:', e); }
      try { renderFill(data); } catch (e) { console.error('Error in renderFill:', e); }

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
    })
    .catch(() => {
      if (!linesEl || !linesEl.innerHTML || !linesEl.innerHTML.trim()) {
        linesEl.innerHTML = '<div class="small">Sem dados para este texto.</div>';
      }
    });

  document.getElementById('nextBtn').addEventListener('click', () => {
    const prog = JSON.parse(localStorage.getItem('progress') || '{}');
    prog[level] = Math.min(10, idx + 1);
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
