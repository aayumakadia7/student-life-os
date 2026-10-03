import React, { useState, useEffect } from 'react'
import { StudentEmblemLogo } from './StudentEmblemLogo'
import { Sparkles, ShieldCheck, Zap } from 'lucide-react'

interface StudentLogoTransitionProps {
  studentName?: string
  onComplete: () => void
}

export const StudentLogoTransition: React.FC<StudentLogoTransitionProps> = ({
  studentName = 'Aayu Makadia',
  onComplete,
}) => {
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState('Authenticating Student Identity...')
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Stepped telemetry messages & smooth progress counter
    const startTime = Date.now()
    const totalDuration = 2200 // 2.2 seconds for full cinematic impact

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const currentPct = Math.min(100, Math.round((elapsed / totalDuration) * 100))
      setProgress(currentPct)

      if (currentPct < 25) {
        setStatusMessage('Authenticating Student Credentials & Digital Token...')
      } else if (currentPct < 55) {
        setStatusMessage('Mounting Semester Timetable & Active Classes...')
      } else if (currentPct < 85) {
        setStatusMessage('Syncing Attendance Radar & AI Study Modules...')
      } else if (currentPct < 100) {
        setStatusMessage('Finalizing Scholar Dashboard Workspace...')
      } else {
        setStatusMessage(`Access Granted • Welcome, Scholar ${studentName}!`)
      }

      if (elapsed >= totalDuration) {
        clearInterval(interval)
        setIsExiting(true)
        setTimeout(() => {
          onComplete()
        }, 650) // Allow exit flash expansion to complete
      }
    }, 35)

    return () => clearInterval(interval)
  }, [onComplete, studentName])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-2xl overflow-hidden select-none">
      {/* Background Energy Pulses & Shockwaves */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full border border-indigo-500/20 animate-shockwave" />
        <div
          className="w-[700px] h-[700px] rounded-full border border-purple-500/15 animate-shockwave"
          style={{ animationDelay: '0.6s' }}
        />
        <div
          className="w-[900px] h-[900px] rounded-full border border-cyan-500/10 animate-shockwave"
          style={{ animationDelay: '1.2s' }}
        />
        {/* Ambient Glowing Orbs */}
        <div className="absolute w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute w-[350px] h-[350px] bg-purple-600/20 rounded-full blur-[100px] translate-y-16" />
      </div>

      {/* Main 3D Logo Stage */}
      <div
        className={`relative z-20 flex flex-col items-center max-w-lg px-6 text-center transition-all ${
          isExiting ? 'animate-student-exit pointer-events-none' : 'animate-student-appear'
        }`}
      >
        {/* Scholar Verification Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-lg shadow-indigo-500/10 backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="tracking-wide uppercase text-[11px]">Scholar Authentication Protocol</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
        </div>

        {/* The 3D Student Logo */}
        <div className="relative mb-6 transform hover:scale-105 transition-transform duration-500 cursor-pointer">
          <StudentEmblemLogo size="2xl" animated={true} glowIntensity="ultra" />

          {/* Golden Corner Accents */}
          <div className="absolute -top-3 -left-3 w-4 h-4 border-t-2 border-l-2 border-amber-400/80" />
          <div className="absolute -top-3 -right-3 w-4 h-4 border-t-2 border-r-2 border-amber-400/80" />
          <div className="absolute -bottom-3 -left-3 w-4 h-4 border-b-2 border-l-2 border-amber-400/80" />
          <div className="absolute -bottom-3 -right-3 w-4 h-4 border-b-2 border-r-2 border-amber-400/80" />
        </div>

        {/* Title & Tagline */}
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white m-0">
          STUDENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300">LIFE OS</span>
        </h2>

        <p className="text-sm font-medium text-indigo-200/90 mt-2 flex items-center justify-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>Next-Generation Academic Command Center</span>
        </p>

        {/* Dynamic Progress Telemetry */}
        <div className="w-full mt-7 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
            <span className="text-indigo-300 truncate max-w-[280px] text-left">{statusMessage}</span>
            <span className="font-bold text-amber-400 pl-2">{progress}%</span>
          </div>

          {/* Neon Progress Bar */}
          <div className="relative w-full h-2.5 bg-zinc-900/90 border border-zinc-700/60 rounded-full overflow-hidden p-[1px] shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_rgba(129,140,248,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Subtext info */}
          <p className="text-[11px] text-zinc-500 font-mono tracking-wider pt-1">
            SECURE CAMPUS SSO • ENCRYPTED SESSION INITIALIZING
          </p>
        </div>
      </div>

      {/* Quick Skip button in top right */}
      <button
        onClick={() => {
          setIsExiting(true)
          setTimeout(onComplete, 300)
        }}
        className="absolute top-6 right-6 px-3.5 py-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-900/70 hover:bg-zinc-800/80 border border-zinc-800 rounded-full transition-all cursor-pointer backdrop-blur-md z-30"
      >
        Skip Animation ➔
      </button>
    </div>
  )
}
