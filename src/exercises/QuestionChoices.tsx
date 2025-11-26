import React, { useState } from 'react'

export function QuestionChoices({ items, onCheck }:{ items:string[]; onCheck:(i:number|null)=>boolean }){
  const [sel, setSel] = useState<number|null>(null)
  const [res, setRes] = useState<boolean|null>(null)
  return (
    <div>
      <div className="grid grid-cols-1 gap-2">
        {items.map((it,i)=> (
          <button key={i} className={`px-3 py-2 rounded border ${sel===i?'border-green-600':'border-gray-200'} text-left`} onClick={()=>setSel(i)}>{it}</button>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button className="px-3 py-2 rounded bg-green-600 text-white" onClick={()=> setRes(onCheck(sel))}>Checar</button>
        {res!==null && <span className={`text-xs ${res?'text-green-700':'text-red-700'}`}>{res?'Correto':'Tente novamente'}</span>}
      </div>
    </div>
  )
}

