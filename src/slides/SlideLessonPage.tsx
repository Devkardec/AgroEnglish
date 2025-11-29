import React, { useState } from 'react'
import { SlideLayout } from './SlideLayout'
import { SlideCard } from './SlideCard'
import { SlideVocab } from './SlideVocab'

type Slide = { type:string; title?:string; text?:string[]|string; image?:string; items?:Array<{ word:string; pt:string; pron:string }> }
type Props = { slides:Slide[] }

function Title({ title, image }:{ title?:string; image?:string }){
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="flex items-center gap-3">
        {image ? <img src={(image||'').replace(/\.(png|jpg|jpeg)$/i, '.webp')} alt={title||''} className="w-14 h-14 rounded-lg object-cover" loading="lazy" /> : null}
        <h3 className="text-lg font-bold text-green-700">{title}</h3>
      </div>
    </div>
  )
}

function Explain({ text }:{ text:string[]|string }){
  const lines = Array.isArray(text)? text : [text]
  return (
    <SlideCard title="Explicação simples" text={lines} />
  )
}

function Usage({ text }:{ text:string[]|string }){
  const lines = Array.isArray(text)? text : [text]
  return (
    <SlideCard title="Exemplos" text={lines} />
  )
}

function Structure({ text }:{ text:string[]|string }){
  const lines = Array.isArray(text)? text : [text]
  return (
    <SlideCard title="Estrutura rápida" text={lines} />
  )
}

function Summary({ text }:{ text:string[]|string }){
  const lines = Array.isArray(text)? text : [text]
  return (
    <SlideCard title="Resumo" text={lines} />
  )
}

export function SlideLessonPage({ slides }:Props){
  const [index, setIndex] = useState(0)
  const [showTr, setShowTr] = useState(false)
  const cur = slides[index]
  return (
    <div className="w-full max-w-3xl mx-auto">
      <SlideLayout slides={slides} index={index} showTr={showTr} onPrev={()=>setIndex(Math.max(0,index-1))} onNext={()=>setIndex(Math.min(slides.length-1,index+1))} onToggleTr={()=>setShowTr(v=>!v)} />
      {cur?.type==='title' && <Title title={cur.title} image={cur.image} />}
      {cur?.type==='explain' && <Explain text={cur.text||[]} />}
      {cur?.type==='usage' && <Usage text={cur.text||[]} />}
      {cur?.type==='structure' && <Structure text={cur.text||[]} />}
      {cur?.type==='card' && <SlideCard title={cur.title} text={cur.text||[]} image={cur.image} />}
      {cur?.type==='vocab' && <SlideVocab items={cur.items||[]} />}
      {cur?.type==='summary' && <Summary text={cur.text||[]} />}
    </div>
  )
}
