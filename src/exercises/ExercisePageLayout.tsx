import React from 'react'

export function ExercisePageLayout({ children }:{ children: React.ReactNode }){
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-green-700">Paul and the Farm · Exercícios (A1)</h2>
        <div className="text-xs text-gray-600">Nível A1 · Fácil</div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {children}
      </div>
    </div>
  )
}

