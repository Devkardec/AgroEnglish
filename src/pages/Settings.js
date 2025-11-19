import { VoiceSelector } from '../components/VoiceSelector.js'

export function Settings({ state, setSetting }) {
  return `
    <main class="main">
      <h2>Configurações de Voz</h2>
      ${VoiceSelector({ voices: state.voices, current: state.voiceName })}
      <div style="margin-top:16px">
        <label>Velocidade: <span class="small">${state.rate.toFixed(2)}</span></label>
        <input type="range" min="0.6" max="1.6" step="0.1" value="${state.rate}" id="rate">
      </div>
      <div style="margin-top:8px">
        <label>Tom: <span class="small">${state.pitch.toFixed(2)}</span></label>
        <input type="range" min="0.6" max="1.6" step="0.1" value="${state.pitch}" id="pitch">
      </div>
      <div style="margin-top:12px">
        <button class="btn" id="test">Test Voice</button>
      </div>
      <script type="module">
        import { speak } from '../../main.js'
        const rate = document.getElementById('rate')
        const pitch = document.getElementById('pitch')
        const test = document.getElementById('test')
        rate.addEventListener('input', e => { localStorage.setItem('rate', e.target.value); location.hash='#/settings' })
        pitch.addEventListener('input', e => { localStorage.setItem('pitch', e.target.value); location.hash='#/settings' })
        test.addEventListener('click', () => speak('This is AgroEnglish Pro. Ready for farm work.'))
      </script>
    </main>
  `
}
