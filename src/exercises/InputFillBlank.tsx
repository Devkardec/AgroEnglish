import React, { useState } from 'react'

type Item = { prompt:string; answer:string }

export function InputFillBlank({ items }:{ items:Item[] }){
  const [vals, setVals] = useState<string[]>(items.map(()=>''))
  const [res, setRes] = useState<boolean|null>(null)
  function check(){ setRes(items.every((it,i)=> it.answer.toLowerCase()===vals[i].trim().toLowerCase())) }
  return (
    <div>
      {items.map((it,i)=> (
        <div key={i} className="mb-2 text-sm text-gray-800">
          <span>{i+1}. {it.prompt.replace('____','')}</span>
          <input className="ml-2 px-2 py-1 rounded border border-gray-300" value={vals[i]} onChange={ev=> setVals(vals.map((v,ix)=> ix===i ? ev.target.value : v))} placeholder="____" />
        </div>
      ))}
      <div className="mt-2 flex items-center gap-2">
        <button className="px-3 py-2 rounded bg-green-600 text-white" onClick={check}>Checar</button>
        {res!==null && <span className={`text-xs ${res?'text-green-700':'text-red-700'}`}>{res?'Correto':'Tente novamente'}</span>}
      </div>
    </div>
  )
}

