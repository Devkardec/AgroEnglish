import React from 'react'

type Slide = { type:string; title?:string; text?:string[]|string; image?:string; items?:Array<{ word:string; pt:string; pron:string }> }

type Props = { slides:Slide[]; index:number; showTr:boolean; onPrev:()=>void; onNext:()=>void; onToggleTr:()=>void }

export function SlideLayout({ slides, index, showTr, onPrev, onNext, onToggleTr }:Props){
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-600">Slide {index+1}/{slides.length}</div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded bg-gray-100 text-gray-800" onClick={onPrev} disabled={index===0}>Prev</button>
          <button className="px-3 py-2 rounded bg-green-600 text-white" onClick={onNext} disabled={index>=slides.length-1}>Next</button>
          <button className="px-3 py-2 rounded bg-gray-100 text-gray-800" onClick={onToggleTr}>{showTr?'Ocultar tradução':'Mostrar tradução'}</button>
        </div>
      </div>
    </div>
  )
}

