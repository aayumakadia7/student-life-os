import React, { createContext, useContext, useState, useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastMessage {
  id: string
  title: string
  message?: string
  type: ToastType
}

interface ToastContextValue {
  toasts: ToastMessage[]
  toast: (options: { title: string; message?: string; type?: ToastType }) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const toast = ({ title, message, type = 'info' }: { title: string; message?: string; type?: ToastType }) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
    const newToast: ToastMessage = { id, title, message, type }
    setToasts((prev) => [...prev, newToast])
  }

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1))
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [toasts])

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start justify-between p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 backdrop-blur-md ${
              t.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-800/60 text-emerald-200'
                : t.type === 'error'
                ? 'bg-rose-950/80 border-rose-800/60 text-rose-200'
                : t.type === 'warning'
                ? 'bg-amber-950/80 border-amber-800/60 text-amber-200'
                : 'bg-zinc-900/90 border-zinc-800 text-zinc-100'
            }`}
          >
            <div>
              <p className="font-semibold text-sm">{t.title}</p>
              {t.message && <p className="text-xs mt-0.5 opacity-80">{t.message}</p>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-3 text-xs opacity-60 hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
