import React, { useState } from 'react'

type Item = { text:string; correctIndex:number }

export function OrderingComponent({ items }:{ items:Item[] }){
  const [arr, setArr] = useState(items.map((it,i)=> ({...it, id:i})))
  const [res, setRes] = useState<boolean|null>(null)
  function swap(i:number, j:number){ const a=[...arr]; const t=a[i]; a[i]=a[j]; a[j]=t; setArr(a) }
  function check(){ setRes(arr.every((it,i)=> it.correctIndex===i)) }
  return (
    <div>
      <div className="space-y-2">
        {arr.map((it,i)=> (
          <div key={it.id} className="flex items-center gap-2">
            <span className="w-6 text-center text-xs text-gray-600">{i+1}</span>
            <div className="flex-1 px-3 py-2 rounded border border-gray-200 bg-gray-50 text-sm text-gray-800">{it.text}</div>
            <div className="flex gap-1">
              <button className="px-2 py-1 rounded bg-gray-100" onClick={()=> swap(i, Math.max(0,i-1))}>↑</button>
              <button className="px-2 py-1 rounded bg-gray-100" onClick={()=> swap(i, Math.min(arr.length-1,i+1))}>↓</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button className="px-3 py-2 rounded bg-green-600 text-white" onClick={check}>Checar</button>
        {res!==null && <span className={`text-xs ${res?'text-green-700':'text-red-700'}`}>{res?'Correto':'Tente novamente'}</span>}
      </div>
    </div>
  )
}

