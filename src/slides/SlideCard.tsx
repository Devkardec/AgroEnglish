import React from 'react'

type Props = { title?:string; text?:string|string[]; image?:string }

export function SlideCard({ title, text, image }:Props){
  const lines = Array.isArray(text) ? text : (text ? [text] : [])
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
      {title ? <div className="text-sm font-semibold text-gray-700 mb-2">{title}</div> : null}
      {image ? <img src={image} alt={title||''} className="w-full h-auto object-contain max-h-[72vh] rounded-lg mb-2" /> : null}
      <div className="text-sm text-gray-800 space-y-1">
        {lines.map((t,i)=> <div key={i}>{t}</div>)}
      </div>
    </div>
  )
}
