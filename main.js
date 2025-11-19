import { Header } from './src/components/Header.js';
import { Home } from './src/pages/Home.js';
import { Level } from './src/pages/Level.js';
import { Settings } from './src/pages/Settings.js';
import { Offline } from './src/pages/Offline.js';
import { TextPage } from './src/pages/TextPage.js';
import { PhraseCard } from './src/components/PhraseCard.js';

const state = {
  voiceName: localStorage.getItem('voiceName') || '',
  rate: Number(localStorage.getItem('rate') || 1),
  pitch: Number(localStorage.getItem('pitch') || 1),
  voices: [],
  theme: localStorage.getItem('theme') || 'light',
  progress: JSON.parse(localStorage.getItem('progress') || '{}')
};

function loadVoices() {
  const v = window.speechSynthesis.getVoices();
  if (v && v.length) {
    const us = v.filter(x => (x.lang || '').toLowerCase().startsWith('en-us'));
    const en = v.filter(x => (x.lang || '').toLowerCase().startsWith('en'));
    state.voices = us.length ? us : (en.length ? en : v);
    if (!state.voiceName) {
      const preferred = state.voices.find(x => x.name.includes('Google US English')) || state.voices[0];
      if (preferred) state.voiceName = preferred.name;
    }
    if (!state.voices.find(vv => vv.name === state.voiceName)) {
      state.voiceName = state.voices[0] ? state.voices[0].name : '';
    }
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
    const prefOrder = [
      (n, lang) => n.includes('Google US English') && lang.startsWith('en'),
      (n, lang) => n.includes('Google') && lang.startsWith('en'),
      (n, lang) => n.includes('Microsoft') && lang.startsWith('en'),
      (n, lang) => lang.startsWith('en'),
      () => true
    ];
    for (const rule of prefOrder) {
      const found = v.find(x => rule(x.name, x.lang||''));
      if (found) return found;
    }
    return v[0];
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

function fixPT(s) {
  s = String(s || '');
  const map = {
    'Ã¡':'á','Ã¢':'â','Ã£':'ã','Ãª':'ê','Ã©':'é','Ãº':'ú','Ãõ':'õ','Ãµ':'õ','Ã´':'ô','Ã³':'ó','Ã²':'ò','Ã¼':'ü','Ã­':'í','Ã¹':'ù','Ã¨':'è','Ã§':'ç','Ãº':'ú','Ãº':'ú','Ã':'ú'
  };
  let out = s;
  for (const k in map) { out = out.split(k).join(map[k]); }
  return out;
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
  } else if (hash.startsWith('#/settings')) {
    view = Settings({ state, setSetting });
  } else {
    view = Offline();
  }
  app.innerHTML = Header() + view;
  pageInit();
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
            <div class="word">${it.en}</div>
          </div>
          <div class="flashcard-face back">
            <div class="meaning">${it.pt}</div>
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
    const groupI = sentences.filter(s=>/^\s*i\b/i.test(s.en)).slice(0,4);
    const groupWe = sentences.filter(s=>/^\s*we\b/i.test(s.en)).slice(0,4);
    const groupIt = sentences.filter(s=>/^(the tractor|the greenhouse|veterinary biosecurity|irrigation)\b/i.test(s.en)).slice(0,4);
    function tableRow(subj, arr){ return arr.map(s=>`<tr><td>${subj}</td><td>${s.en}</td><td>${fixPT(s.pt||'')}</td></tr>`).join('') }
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
    const practice = [...groupI.slice(0,1), ...groupWe.slice(0,2), ...groupIt.slice(0,1)];
    el.innerHTML = `
      <div class="section-title">Conceito</div>
      <div class="small">${gRaw}</div>
      <div class="section-title" style="margin-top:10px">Estrutura</div>
      <div>${conjTable}</div>
      <div class="section-title" style="margin-top:10px">Prática</div>
      <div class="grid">${practice.map(ex=>`
        <div class="card">
          <div class="line"><div class="en">${ex.en}</div><div class="pt">${fixPT(ex.pt||'')}</div></div>
          <div style="margin-top:8px"><button class="btn secondary" data-action="speak" data-text="${ex.en}">Ouvir Áudio</button></div>
        </div>
      `).join('')}</div>
    `;
  }

  function renderVerbs(data) {
    const el = document.querySelector('#verbs');
    if (!el) return;
    const listStr = String(data.verbs||'');
    const m = listStr.split(':')[1] || listStr;
    const baseVerbs = m.split(',').map(s=>s.trim()).filter(Boolean);
    const pairs = (Array.isArray(data.pairs) && data.pairs.length) ? data.pairs : [];
    const sentences = pairs.length ? pairs.map(p=>p.en) : String(data.text||'').split(/(?<=[.!?])\s+/);
    function includesVerb(s){ return baseVerbs.some(v=> new RegExp(`\\b${v}\\b`,'i').test(s)) }
    const examples = sentences.filter(includesVerb).slice(0,6);
    const cards = examples.map(en=>`
      <div class="card">
        <div class="line"><div class="en">${en}</div></div>
        <div style="margin-top:8px"><button class="btn secondary" data-action="speak" data-text="${en}">Ouvir Áudio</button></div>
      </div>
    `).join('');
    const listHtml = baseVerbs.map(v=>`<div class="selector"><div class="option">${v}</div></div>`).join('');
    el.innerHTML = `
      <div class="section-title">Lista</div>
      <div class="small">${listHtml}</div>
      <div class="section-title" style="margin-top:10px">Exemplos</div>
      <div class="grid">${cards}</div>
      <div class="small" style="margin-top:8px">Vistos neste texto: ${baseVerbs.join(', ')}</div>
    `;
  }

  function renderMC(list) {
    const mcEl = document.querySelector('#mc');
    mcEl.innerHTML = list
      .map(
        (q, i) => `
        <div class="card">
          <div><strong>${i + 1}. ${q.question}</strong></div>
          <div style="margin-top:6px">${q.options
            .map(
              (op, j) =>
                `<button class="btn secondary" data-mc="${i}" data-idx="${j}">${op}</button>`
            )
            .join(' ')}</div>
          <div class="small" id="mcRes${i}" style="margin-top:6px"></div>
        </div>`
      )
      .join('');
    mcEl.addEventListener('click', (e) => {
      const t = e.target;
      if (!t.dataset.mc) return;
      const qi = Number(t.dataset.mc);
      const oi = Number(t.dataset.idx);
      const ok = oi === list[qi].answer;
      document.getElementById('mcRes' + qi).textContent = ok
        ? 'Good pronunciation!'
        : 'Try again.';
    });
  }

  function renderFill(list) {
    const fillEl = document.querySelector('#fill');
    fillEl.innerHTML = list
      .map(
        (f, i) => `
        <div class="card">
          <div>${
            i + 1
          }. ${f.sentence.replace(
            '____',
            `<input class="blank" data-fill="${i}" style="border:1px solid #cfd7d3;border-radius:6px;padding:4px" />`
          )}</div>
        </div>`
      )
      .join('');
    document.querySelector('#checkFill').addEventListener('click', () => {
      const inputs = fillEl.querySelectorAll('input.blank');
      let correct = 0;
      inputs.forEach((inp) => {
        const i = Number(inp.dataset.fill);
        if (
          (inp.value || '').trim().toLowerCase() ===
          String(list[i].answer).toLowerCase()
        )
          correct++;
      });
      document.querySelector('#fillResult').textContent =
        correct === inputs.length ? 'Good pronunciation!' : 'Try again.';
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
        linesEl.innerHTML = pairs.map(p=>`<div class="line"><div class="en">${p.en}</div><div class="pt">${fixPT(p.pt)}</div></div>`).join('');
        return;
      }
      const en = String(data.text||'').split(/(?<=[.!?])\s+/).filter(Boolean);
      const pt = String(data.translation||'').split(/(?<=[.!?])\s+/).map(fixPT);
      linesEl.innerHTML = en.map((s,i)=>`<div class="line"><div class="en">${s}</div><div class="pt">${pt[i]||''}</div></div>`).join('');
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
      renderVocabulary(data);
      renderGrammar(data);
      renderVerbs(data);
      renderMC((data.exercises && data.exercises.multiple_choice) || []);
      renderFill((data.exercises && data.exercises.fill_in) || []);
      document.querySelector('#speakPrompt').textContent =
        (data.exercises && data.exercises.speaking) || '';
      document
        .getElementById('startRec')
        .addEventListener('click', () =>
          startRecognition((data.exercises && data.exercises.speaking) || '')
        );

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
        const width = pronList.clientWidth || 980;
        const cols = Math.max(1, Math.floor(width / 280));
        const rows = 2;
        const max = Math.min(sentences.length || 0, cols * rows);
        const shown = sentences.slice(0, max);
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
    const list = (state.voices||[]).filter(v=>{
      const lang = (v.lang||'').toLowerCase();
      return lang.startsWith('en-us') || lang.startsWith('en');
    }).sort((a,b)=>a.name.localeCompare(b.name));
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
