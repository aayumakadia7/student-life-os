import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { HorizontalNavbar, NAV_SECTIONS } from '../components/layout/HorizontalNavbar'

// The 8 Academic Module Sections matching the screenshot
import { DashboardPage } from './Dashboard'
import { TimetablePage } from './Timetable'
import { AssignmentsPage } from './Assignments'
import { AttendancePage } from './Attendance'
import { ResourcesPage } from './Resources'
import { CalendarSection } from '../components/domain/CalendarSection'
import { ProfileSection } from '../components/domain/ProfileSection'
import { SettingsPage } from './Settings'

import { ArrowUp, ChevronDown } from 'lucide-react'

export const SingleScrollFeed: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('dashboard')
  const location = useLocation()
  const isAutoScrollingRef = useRef(false)

  // Map route paths to section IDs
  const pathToSection: Record<string, string> = {
    '/dashboard': 'dashboard',
    '/classes': 'classes',
    '/timetable': 'classes',
    '/assignments': 'assignments',
    '/attendance': 'attendance',
    '/resources': 'resources',
    '/study': 'resources',
    '/calendar': 'calendar',
    '/profile': 'profile',
    '/settings': 'settings',
  }

  // Smooth scroll to a target section by ID
  const scrollToSection = (id: string, updateUrl = true) => {
    const el = document.getElementById(id)
    if (!el) return

    isAutoScrollingRef.current = true
    setActiveSection(id)

    el.scrollIntoView({ behavior: 'smooth' })

    if (updateUrl && window.history.replaceState) {
      window.history.replaceState(null, '', `/${id === 'dashboard' ? 'dashboard' : id}`)
    }

    // Reset lock after animation finishes
    setTimeout(() => {
      isAutoScrollingRef.current = false
    }, 800)
  }

  // Handle initial deep-linking from URL path or hash
  useEffect(() => {
    let target = pathToSection[location.pathname]
    if (!target && location.hash) {
      target = location.hash.replace('#', '')
    }
    if (target && target !== 'dashboard') {
      setTimeout(() => {
        scrollToSection(target, false)
      }, 150)
    }
  }, [location.pathname, location.hash])

  // ScrollSpy: evaluate which section is currently visible in viewport
  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>

    const handleScroll = () => {
      if (isAutoScrollingRef.current) return

      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        const scrollPosition = window.scrollY + 140 // offset for horizontal navbar
        const sectionElements = NAV_SECTIONS.map((sec) => ({
          id: sec.id,
          el: document.getElementById(sec.id),
        }))

        for (let i = sectionElements.length - 1; i >= 0; i--) {
          const item = sectionElements[i]
          if (item.el) {
            const top = item.el.offsetTop
            if (scrollPosition >= top - 80) {
              setActiveSection(item.id)
              break
            }
          }
        }
      }, 40)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  const currentSectionMeta = NAV_SECTIONS.find((s) => s.id === activeSection) || NAV_SECTIONS[0]
  const currentIndex = NAV_SECTIONS.findIndex((s) => s.id === activeSection)
  const nextSection = currentIndex < NAV_SECTIONS.length - 1 ? NAV_SECTIONS[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-[#F6F8FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased selection:bg-blue-500/20">
      {/* Sticky Horizontal Navbar with 8 components matching screenshot */}
      <HorizontalNavbar
        activeSection={activeSection}
        onSelectSection={(id) => scrollToSection(id, true)}
      />

      {/* Main Single-Scroll Continuous Stream */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 space-y-16">
        {/* ============================================================== */}
        {/* 01. DASHBOARD OVERVIEW SECTION (EXACT 1:1 REPLICA)             */}
        {/* ============================================================== */}
        <section id="dashboard" className="scroll-mt-32">
          <DashboardPage />
        </section>

        {/* Section Divider 1 -> 2 */}
        <SectionDivider
          nextId="classes"
          nextLabel="My Classes & Schedule"
          nextNumber="02"
          onNext={() => scrollToSection('classes')}
        />

        {/* ============================================================== */}
        {/* 02. MY CLASSES SECTION                                         */}
        {/* ============================================================== */}
        <section id="classes" className="scroll-mt-32">
          <TimetablePage />
        </section>

        {/* Section Divider 2 -> 3 */}
        <SectionDivider
          nextId="assignments"
          nextLabel="Assignments & Tasks"
          nextNumber="03"
          onNext={() => scrollToSection('assignments')}
        />

        {/* ============================================================== */}
        {/* 03. ASSIGNMENTS SECTION                                        */}
        {/* ============================================================== */}
        <section id="assignments" className="scroll-mt-32">
          <AssignmentsPage />
        </section>

        {/* Section Divider 3 -> 4 */}
        <SectionDivider
          nextId="attendance"
          nextLabel="Attendance Tracker"
          nextNumber="04"
          onNext={() => scrollToSection('attendance')}
        />

        {/* ============================================================== */}
        {/* 04. ATTENDANCE SECTION                                         */}
        {/* ============================================================== */}
        <section id="attendance" className="scroll-mt-32">
          <AttendancePage />
        </section>

        {/* Section Divider 4 -> 5 */}
        <SectionDivider
          nextId="resources"
          nextLabel="Study Resources"
          nextNumber="05"
          onNext={() => scrollToSection('resources')}
        />

        {/* ============================================================== */}
        {/* 05. STUDY RESOURCES SECTION                                    */}
        {/* ============================================================== */}
        <section id="resources" className="scroll-mt-32">
          <ResourcesPage />
        </section>

        {/* Section Divider 5 -> 6 */}
        <SectionDivider
          nextId="calendar"
          nextLabel="Academic Calendar"
          nextNumber="06"
          onNext={() => scrollToSection('calendar')}
        />

        {/* ============================================================== */}
        {/* 06. CALENDAR SECTION                                           */}
        {/* ============================================================== */}
        <section id="calendar" className="scroll-mt-32">
          <CalendarSection />
        </section>

        {/* Section Divider 6 -> 7 */}
        <SectionDivider
          nextId="profile"
          nextLabel="Student Profile"
          nextNumber="07"
          onNext={() => scrollToSection('profile')}
        />

        {/* ============================================================== */}
        {/* 07. PROFILE SECTION                                            */}
        {/* ============================================================== */}
        <section id="profile" className="scroll-mt-32">
          <ProfileSection />
        </section>

        {/* Section Divider 7 -> 8 */}
        <SectionDivider
          nextId="settings"
          nextLabel="System Settings"
          nextNumber="08"
          onNext={() => scrollToSection('settings')}
        />

        {/* ============================================================== */}
        {/* 08. SETTINGS SECTION                                           */}
        {/* ============================================================== */}
        <section id="settings" className="scroll-mt-32 pb-24">
          <SettingsPage />
        </section>
      </main>

      {/* Floating Section Status & Back to Top Utility */}
      <div className="fixed bottom-5 right-5 z-30 flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/95 dark:bg-zinc-900/95 border border-zinc-200/80 dark:border-zinc-800 shadow-xl backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
            {currentSectionMeta.label}
          </span>
          <span className="text-[10px] font-mono text-zinc-400">
            [{String(currentIndex + 1).padStart(2, '0')}/08]
          </span>
        </div>

        {nextSection && (
          <button
            onClick={() => scrollToSection(nextSection.id)}
            title={`Scroll to next: ${nextSection.label}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-transform hover:scale-105 cursor-pointer"
          >
            <span>Next: {nextSection.shortLabel}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={() => scrollToSection('dashboard')}
          title="Scroll back to top (Dashboard)"
          className="p-2.5 rounded-2xl bg-zinc-900/90 dark:bg-zinc-800/90 hover:bg-zinc-800 text-white shadow-xl border border-zinc-700/80 transition-transform hover:scale-110 cursor-pointer backdrop-blur-md"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Section Divider Helper
interface SectionDividerProps {
  nextId: string
  nextLabel: string
  nextNumber: string
  onNext: () => void
}

const SectionDivider: React.FC<SectionDividerProps> = ({ nextLabel, nextNumber, onNext }) => {
  return (
    <div className="relative py-6 flex items-center justify-center select-none">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-zinc-200 dark:border-zinc-800/80" />
      </div>
      <button
        onClick={onNext}
        className="relative px-4 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 shadow-xs flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer group"
      >
        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold">
          {nextNumber}
        </span>
        <span>Continue to {nextLabel}</span>
        <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
      </button>
    </div>
  )
}
