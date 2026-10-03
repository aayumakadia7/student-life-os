import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { ThreeDBackgroundCanvas } from '../../components/3d/ThreeDBackgroundCanvas'
import { StudentEmblemLogo } from '../../components/3d/StudentEmblemLogo'
import { StudentLogoTransition } from '../../components/3d/StudentLogoTransition'
import {
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Sparkles,
  ArrowDown,
  ArrowRight,
  Shield,
  BookOpen,
  TrendingUp,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react'

export const IntroExperiencePage: React.FC = () => {
  const { login, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  // Active page state: 0 = Page 1 (3D Showcase), 1 = Page 2 (3D Login)
  const [currentPage, setCurrentPage] = useState<0 | 1>(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Login form state
  const [email, setEmail] = useState('aayu@student.edu')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Student Logo Interstitial Transition State
  const [showLogoTransition, setShowLogoTransition] = useState(false)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const page1Ref = useRef<HTMLDivElement | null>(null)
  const page2Ref = useRef<HTMLDivElement | null>(null)

  // Track mouse coordinates normalized (-1 to 1) for 3D tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      setMousePos({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Track scroll position
  const handleScroll = () => {
    if (!containerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const totalScrollable = scrollHeight - clientHeight
    const progress = totalScrollable > 0 ? scrollTop / totalScrollable : 0
    setScrollProgress(progress)

    if (progress > 0.45 && currentPage !== 1) {
      setCurrentPage(1)
    } else if (progress <= 0.45 && currentPage !== 0) {
      setCurrentPage(0)
    }
  }

  // Smooth scroll to specific page
  const scrollToPage = (pageIndex: 0 | 1) => {
    setCurrentPage(pageIndex)
    if (pageIndex === 0 && page1Ref.current) {
      page1Ref.current.scrollIntoView({ behavior: 'smooth' })
    } else if (pageIndex === 1 && page2Ref.current) {
      page2Ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Handle Login submission on Page 2
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Trigger the 3D Student Logo transition sequence
    setShowLogoTransition(true)
  }

  // Callback when the Student Logo Transition finishes
  const handleLogoTransitionComplete = async () => {
    try {
      await login(email, password)
      toast({
        title: 'Welcome back, Scholar!',
        message: 'Access granted. All academic systems synchronized.',
        type: 'success',
      })
      navigate('/dashboard')
    } catch {
      toast({
        title: 'Authentication Error',
        message: 'Unable to connect to student registry.',
        type: 'error',
      })
      setShowLogoTransition(false)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans select-none">
      {/* 3D Interactive Canvas Background */}
      <ThreeDBackgroundCanvas scrollProgress={scrollProgress} mousePos={mousePos} />

      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-4 flex items-center justify-between backdrop-blur-md bg-zinc-950/40 border-b border-zinc-800/40">
        <div className="flex items-center gap-3">
          <StudentEmblemLogo size="sm" animated={false} />
          <div>
            <span className="font-extrabold tracking-tight text-base sm:text-lg text-white">
              STUDENT <span className="text-indigo-400">LIFE OS</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              v1.0 3D INTRO
            </span>
          </div>
        </div>

        {/* 3D Page Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-zinc-900/80 border border-zinc-700/50 backdrop-blur-lg">
          <button
            onClick={() => scrollToPage(0)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              currentPage === 0
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            01 Overview
          </button>
          <button
            onClick={() => scrollToPage(1)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              currentPage === 1
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            02 Student Login
          </button>
        </div>

        {/* Skip to Dashboard button if user prefers */}
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <button
              onClick={() => navigate('/dashboard')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-300 hover:text-white bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-800/60 transition-colors"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Floating Right Indicator / Scroll Dots */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-3">
        <button
          onClick={() => scrollToPage(0)}
          className={`group flex items-center gap-2 transition-all ${
            currentPage === 0 ? 'text-indigo-400 scale-110' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span className="text-[10px] font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            DISCOVER
          </span>
          <div
            className={`w-3 h-3 rounded-full border transition-all ${
              currentPage === 0
                ? 'bg-indigo-500 border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.8)]'
                : 'bg-zinc-800 border-zinc-600'
            }`}
          />
        </button>

        <div className="w-[1px] h-8 bg-zinc-800" />

        <button
          onClick={() => scrollToPage(1)}
          className={`group flex items-center gap-2 transition-all ${
            currentPage === 1 ? 'text-indigo-400 scale-110' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span className="text-[10px] font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            LOGIN
          </span>
          <div
            className={`w-3 h-3 rounded-full border transition-all ${
              currentPage === 1
                ? 'bg-purple-500 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]'
                : 'bg-zinc-800 border-zinc-600'
            }`}
          />
        </button>
      </div>

      {/* Main 3D Scrollable Viewport */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-auto snap-y snap-mandatory perspective-1200 scroll-smooth"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* ============================================================== */}
        {/* PAGE 1: 3D ACADEMIC COMMAND CENTER SHOWCASE (100vh)             */}
        {/* ============================================================== */}
        <section
          ref={page1Ref}
          className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-8 py-20 snap-start preserve-3d"
          style={{
            transform: `translateZ(${scrollProgress * -250}px) rotateX(${scrollProgress * 15}deg)`,
            opacity: Math.max(0, 1 - scrollProgress * 1.5),
            transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
          }}
        >
          <div className="max-w-5xl w-full mx-auto flex flex-col items-center text-center mt-6">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-5 shadow-lg shadow-indigo-500/10 backdrop-blur-md animate-float-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Next-Generation College Operating System</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight max-w-4xl">
              Turn Academic Chaos Into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                Effortless Excellence
              </span>
            </h1>

            {/* Tagline */}
            <p className="mt-4 text-sm sm:text-lg text-zinc-300 max-w-2xl font-normal leading-relaxed">
              From automated timetable conflict resolution and smart attendance radars to AI study
              schedules and task mastery. All unified in a single 3D workspace.
            </p>

            {/* 3D Interactive Floating Academic Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 w-full mt-10 perspective-1000">
              {/* Card 1: 3D Timetable & Conflict Engine */}
              <div
                className="relative p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-indigo-500/60 group"
                style={{
                  transform: `rotateY(${mousePos.x * 12}deg) rotateX(${-mousePos.y * 10}deg) translateZ(35px)`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                    LIVE TODAY
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white text-left m-0">Smart Timetable Radar</h3>
                <p className="text-xs text-zinc-400 text-left mt-1">
                  Real-time room navigation, class countdowns & zero overlaps.
                </p>

                <div className="mt-4 p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/70 text-left">
                  <div className="flex items-center justify-between text-[11px] text-zinc-300 font-semibold">
                    <span>Data Structures</span>
                    <span className="text-indigo-400">09:00 AM</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>Lab 3 • Starts in 24 mins</span>
                  </div>
                </div>
              </div>

              {/* Card 2: 3D CGPA & Attendance Vanguard */}
              <div
                className="relative p-5 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-zinc-900/80 border border-indigo-500/40 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-indigo-400/80 group"
                style={{
                  transform: `rotateY(${mousePos.x * 10}deg) rotateX(${-mousePos.y * 8}deg) translateZ(55px)`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                    9.1 CGPA
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white text-left m-0">Attendance Vanguard</h3>
                <p className="text-xs text-zinc-400 text-left mt-1">
                  Predictive safety alerts so you never fall below the 75% threshold.
                </p>

                <div className="mt-4 flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/70">
                  <div className="text-left">
                    <div className="text-xs font-bold text-emerald-400">92.4% Overall</div>
                    <div className="text-[10px] text-zinc-400">Safe to miss 4 more lectures</div>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-emerald-400 flex items-center justify-center text-[10px] font-bold text-emerald-300">
                    A+
                  </div>
                </div>
              </div>

              {/* Card 3: 3D AI Study Engine & Task Matrix */}
              <div
                className="relative p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-pink-500/60 group"
                style={{
                  transform: `rotateY(${mousePos.x * 8}deg) rotateX(${-mousePos.y * 6}deg) translateZ(35px)`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center border border-pink-500/30">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-pink-500/15 text-pink-300 font-bold border border-pink-500/30">
                    AI POWERED
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white text-left m-0">Study Planner & Tasks</h3>
                <p className="text-xs text-zinc-400 text-left mt-1">
                  Dynamic revision cycles and automated assignment deadline prioritization.
                </p>

                <div className="mt-4 p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/70 text-left">
                  <div className="flex items-center justify-between text-[11px] text-zinc-300 font-semibold">
                    <span className="truncate">OS Virtual Memory Lab</span>
                    <span className="text-amber-400 font-mono">Due Fri</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>3 of 5 milestones accomplished</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons to navigate to Page 2 */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => scrollToPage(1)}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all hover:scale-105 cursor-pointer group"
              >
                <span>Access Student Portal & Login</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => scrollToPage(1)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-700/80 text-zinc-300 hover:text-white font-medium text-xs transition-colors cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>Instant Demo Access</span>
              </button>
            </div>

            {/* Bouncing 3D Scroll Down Indicator */}
            <div
              onClick={() => scrollToPage(1)}
              className="mt-12 flex flex-col items-center gap-2 cursor-pointer group text-zinc-400 hover:text-indigo-400 transition-colors"
            >
              <span className="text-[11px] font-mono tracking-widest uppercase">
                Scroll Down for Student Login [ 01 / 02 ]
              </span>
              <div className="w-6 h-10 rounded-full border-2 border-zinc-600 group-hover:border-indigo-400 flex items-start justify-center p-1.5 transition-colors">
                <div className="w-1.5 h-2.5 rounded-full bg-indigo-400 animate-bounce" />
              </div>
              <ArrowDown className="w-4 h-4 animate-bounce text-indigo-400" />
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* PAGE 2: 3D STUDENT PORTAL & LOGIN (100vh)                       */}
        {/* ============================================================== */}
        <section
          ref={page2Ref}
          className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-8 py-20 snap-start preserve-3d"
          style={{
            transform: `translateZ(${(1 - scrollProgress) * -150}px) rotateX(${(1 - scrollProgress) * -12}deg)`,
            opacity: Math.min(1, scrollProgress * 1.8),
            transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
          }}
        >
          <div className="max-w-md w-full mx-auto relative z-20">
            {/* Top Student Emblem Badge */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-3 transform hover:scale-110 transition-transform duration-300">
                <StudentEmblemLogo size="md" animated={true} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white m-0 text-center">
                Student Portal Sign In
              </h2>
              <p className="text-xs text-zinc-400 text-center mt-1">
                Enter your scholar credentials to initiate your personalized OS
              </p>
            </div>

            {/* 3D Glassmorphism Login Card */}
            <div
              className="relative p-6 sm:p-8 rounded-3xl bg-zinc-900/75 border border-zinc-700/60 backdrop-blur-2xl shadow-2xl shadow-indigo-950/60 preserve-3d transition-transform duration-200"
              style={{
                transform: `rotateY(${mousePos.x * 6}deg) rotateX(${-mousePos.y * 6}deg)`,
              }}
            >
              {/* Glowing Corner Accents */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-tr-full pointer-events-none" />

              {/* Quick Demo Autofill Banner */}
              <div className="mb-5 p-2.5 rounded-xl bg-indigo-950/50 border border-indigo-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-indigo-300">
                  <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="font-mono text-[11px]">Demo: aayu@student.edu</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('aayu@student.edu')
                    setPassword('password123')
                    toast({
                      title: 'Credentials Set',
                      message: 'Ready to launch OS with demo student account.',
                      type: 'info',
                    })
                  }}
                  className="px-2.5 py-1 text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
                >
                  Autofill
                </button>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5 text-left">
                    College Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@student.edu"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-700/80 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Password</label>
                    <span className="text-[11px] text-indigo-400 hover:underline cursor-pointer">
                      Institute SSO
                    </span>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-700/80 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Campus Security Note */}
                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded bg-zinc-900 border-zinc-700 text-indigo-600 focus:ring-0"
                    />
                    <span>Remember session</span>
                  </label>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Lock className="w-3 h-3" />
                    256-bit Encrypted
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/60 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group mt-2"
                >
                  <span>Sign In & Launch Student OS</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              {/* Scholar Features Pills */}
              <div className="mt-6 pt-5 border-t border-zinc-800/80 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400 mx-auto mb-1" />
                  <span className="text-[10px] text-zinc-400 font-medium block">Timetable Sync</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
                  <span className="text-[10px] text-zinc-400 font-medium block">Attendance</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
                  <span className="text-[10px] text-zinc-400 font-medium block">GPA Radar</span>
                </div>
              </div>
            </div>

            {/* Back to Page 1 CTA */}
            <div className="mt-6 text-center">
              <button
                onClick={() => scrollToPage(0)}
                className="text-xs text-zinc-400 hover:text-indigo-400 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>← Back to 3D Overview Showcase</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ============================================================== */}
      {/* FULLSCREEN STUDENT LOGO INTERSTITIAL TRANSITION                */}
      {/* ============================================================== */}
      {showLogoTransition && (
        <StudentLogoTransition
          studentName={email.split('@')[0] || 'Scholar'}
          onComplete={handleLogoTransitionComplete}
        />
      )}
    </div>
  )
}
