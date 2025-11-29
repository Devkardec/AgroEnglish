import React from 'react'

type Item = { word:string; pt:string; image:string }

export function VocabularyMatch({ items }:{ items:Item[] }){
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((it,i)=> (
        <div key={i} className="flex items-center gap-2">
          <img src={it.image?.replace(/\.(png|jpg|jpeg)$/i, '.webp')} alt={it.word} className="w-24 h-24 object-contain rounded-md bg-gray-50" loading="lazy" />
          <div className="text-sm text-gray-800">
            <div className="font-semibold">{it.word}</div>
            <div className="text-gray-600 text-xs">{it.pt}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
