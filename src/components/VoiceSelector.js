export function VoiceSelector({ voices, current }) {
  const filtered = voices.filter(v => (v.lang||'').toLowerCase().startsWith('en-us'))
  const base = filtered.length ? filtered : voices.filter(v => (v.lang||'').toLowerCase().startsWith('en'))
  const sorted = base.slice().sort((a,b)=>a.name.localeCompare(b.name))
  const items = sorted.map(v=>`<div class="option ${v.name===current?'active':''}" data-voice="${v.name}">${v.name} <span class="small">(${v.lang})</span></div>`).join('')
  return `<div class="selector">${items||'<div class="small">Sem vozes en-US detectadas</div>'}</div>`
}
