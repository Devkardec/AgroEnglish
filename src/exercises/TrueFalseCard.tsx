import React, { useState } from 'react'

type S = { text:string; correct:boolean }

export function TrueFalseCard({ statements }:{ statements:S[] }){
  const [ans, setAns] = useState<(boolean|null)[]>(statements.map(()=>null))
  const [res, setRes] = useState<boolean|null>(null)
  function set(i:number, v:boolean){ const a=[...ans]; a[i]=v; setAns(a) }
  function check(){ setRes(statements.every((s,i)=> s.correct===ans[i])) }
  return (
    <div>
      {statements.map((s,i)=> (
        <div key={i} className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-800 flex-1">{i+1}. {s.text}</span>
          <button className={`px-2 py-1 rounded ${ans[i]===true?'bg-green-600 text-white':'bg-gray-100 text-gray-800'}`} onClick={()=>set(i,true)}>Verdadeiro</button>
          <button className={`px-2 py-1 rounded ${ans[i]===false?'bg-red-600 text-white':'bg-gray-100 text-gray-800'}`} onClick={()=>set(i,false)}>Falso</button>
        </div>
      ))}
      <div className="mt-2 flex items-center gap-2">
        <button className="px-3 py-2 rounded bg-green-600 text-white" onClick={check}>Checar</button>
        {res!==null && <span className={`text-xs ${res?'text-green-700':'text-red-700'}`}>{res?'Correto':'Tente novamente'}</span>}
      </div>
    </div>
  )
}

