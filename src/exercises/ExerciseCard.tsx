import React from 'react'

export function ExerciseCard({ title, instruction, children }:{ title?:string; instruction?:string; children: React.ReactNode }){
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
      {title ? <div className="text-sm font-semibold text-gray-700 mb-1">{title}</div> : null}
      {instruction ? <div className="text-xs text-gray-600 mb-2">{instruction}</div> : null}
      {children}
    </div>
  )
}

