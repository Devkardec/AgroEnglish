export function VoiceSelector({ voices, current }) {
  const filtered = voices.filter(v => (String(v.lang||'').toLowerCase()).startsWith('en-us'))
  const base = filtered.length ? filtered : voices.filter(v => (String(v.lang||'').toLowerCase()).startsWith('en'))
  const rank = v => {
    const n = String(v.name||'').toLowerCase()
    if (n.includes('google us english')) return 0
    if (/natural/i.test(String(v.name||''))) return 1
    if (/premium|enhanced/i.test(String(v.name||''))) return 2
    return 3
  }
  const sorted = base.slice().sort((a,b)=>{ const pa=rank(a), pb=rank(b); if(pa!==pb) return pa-pb; return String(a.name||'').localeCompare(String(b.name||'')) })
  const items = sorted.map(v=>`<div class="option ${v.name===current?'active':''}" data-voice="${v.name}">${v.name} <span class="small">(${v.lang})</span></div>`).join('')
  return `<div class="selector">${items||'<div class="small">Sem vozes en-US detectadas</div>'}</div>`
}
