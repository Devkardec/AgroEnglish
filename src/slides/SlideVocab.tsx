import React from 'react'

type Item = { word:string; pt:string; pron:string }
type Props = { items:Item[] }

export function SlideVocab({ items }:Props){
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="text-sm font-semibold text-gray-700 mb-2">Vocabulário + pronúncia</div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((it,i)=> (
          <div key={i} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-md bg-green-50 flex items-center justify-center text-green-700 font-bold">{it.word[0].toUpperCase()}</div>
            <div className="text-sm">
              <div className="font-semibold text-gray-800">{it.word}</div>
              <div className="text-gray-600">{it.pt} · {it.pron}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

