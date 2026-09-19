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

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root redirect to /dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Main App Layout and protected routes */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/timetable" element={<TimetablePage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/study" element={<StudyPlannerPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Auth Layout and routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
