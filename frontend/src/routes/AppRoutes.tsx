import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { AuthLayout } from '../layouts/AuthLayout'

// Pages
import { DashboardPage } from '../pages/Dashboard'
import { TimetablePage } from '../pages/Timetable'
import { TasksPage } from '../pages/Tasks'
import { AssignmentsPage } from '../pages/Assignments'
import { AttendancePage } from '../pages/Attendance'
import { ExpensesPage } from '../pages/Expenses'
import { StudyPlannerPage } from '../pages/StudyPlanner'
import { ResourcesPage } from '../pages/Resources'
import { AnalyticsPage } from '../pages/Analytics'
import { SettingsPage } from '../pages/Settings'

// Auth Pages
import { LoginPage } from '../pages/Login'
import { RegisterPage } from '../pages/Register'
import { ForgotPasswordPage } from '../pages/ForgotPassword'
// 3D Intro Experience Page
import { IntroExperiencePage } from '../pages/IntroExperience'
// Single Scroll Layout with Horizontal Navbar
import { SingleScrollFeed } from '../pages/SingleScrollFeed'

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 3D 2-Page Scroll & Student Logo Intro Experience */}
      <Route path="/" element={<IntroExperiencePage />} />
      <Route path="/intro" element={<IntroExperiencePage />} />
      <Route path="/login" element={<IntroExperiencePage />} />

      {/* Single Scroll App with Horizontal Navbar (8 Modules) */}
      <Route path="/dashboard" element={<SingleScrollFeed />} />
      <Route path="/classes" element={<SingleScrollFeed />} />
      <Route path="/timetable" element={<SingleScrollFeed />} />
      <Route path="/tasks" element={<SingleScrollFeed />} />
      <Route path="/assignments" element={<SingleScrollFeed />} />
      <Route path="/attendance" element={<SingleScrollFeed />} />
      <Route path="/resources" element={<SingleScrollFeed />} />
      <Route path="/expenses" element={<SingleScrollFeed />} />
      <Route path="/study" element={<SingleScrollFeed />} />
      <Route path="/calendar" element={<SingleScrollFeed />} />
      <Route path="/profile" element={<SingleScrollFeed />} />
      <Route path="/analytics" element={<SingleScrollFeed />} />
      <Route path="/settings" element={<SingleScrollFeed />} />

      {/* Auth Layout and routes */}
      <Route element={<AuthLayout />}>
        <Route path="/classic-login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
