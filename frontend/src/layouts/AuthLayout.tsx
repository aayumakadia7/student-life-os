import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/dashboard" className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-600/30">
              S
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Student Life OS
            </span>
          </Link>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Personal college productivity & academic management system
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
