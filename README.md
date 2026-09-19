# Student Life OS 🎓

> **Student Life OS** is a modern, modular, personal college productivity system designed to manage a student's entire academic and campus life in one centralized command center.

Built with **React 19, Vite, TypeScript, Tailwind CSS v4, Lucide React, Recharts, and React Hook Form + Zod**.

---

## ✨ Features

1. **Dashboard & Academic Command Center**
   - Dynamic time-sensitive student greeting (*Good Morning / Afternoon / Evening, Aayu 👋*).
   - Quick Stat cards: Today's Tasks, Scheduled Classes, Overall Attendance, Pending Assignments.
   - **Signature "What Should I Do Now?"** recommendation engine: rule-based scoring factoring in urgent/high priorities, closest deadlines, free schedule windows before upcoming lectures, and exam countdowns.
   - Today's class timeline highlighting active and upcoming lectures.
   - Priority tasks checklist with instant completion toggling.
   - Live attendance compliance progress bars and monthly expense charts.

2. **Timetable & Course Schedule (`/timetable`)**
   - Interactive day-of-week switcher (Monday to Sunday) with class counter badges.
   - Detailed lecture cards featuring room locations, course codes, and professor names.
   - Add/Edit Class modal with time selectors and day picker.

3. **Task Management (`/tasks`)**
   - Filter tabs: *All Tasks, Today, Upcoming, High Priority, Completed*.
   - Instant search and sorting by deadline, priority, or duration.
   - Add / Edit Task modal with priority badges (Urgent, High, Medium, Low) and minute estimations.

4. **Course Assignments & Projects (`/assignments`)**
   - Status tracker: *Not Started, In Progress, Submitted, Completed*.
   - Filter by status, search by keywords, and deadline indicators (*Due Today, Due in 2 days, Overdue*).
   - Add / Edit Assignment modal with estimated hours and requirements notes.

5. **Attendance Dashboard (`/attendance`)**
   - Overall attendance compliance vs user-configurable target threshold (e.g., 75% or 80%).
   - Dynamic safety margin formula:
     - **"You can miss X more classes"** when attendance is above target.
     - **"Need to attend next Y classes to reach target"** when attendance falls below target.
   - Instant 1-click **Present** / **Absent** logger buttons that immediately recalculate percentages and dashboard KPIs.

6. **Student Expense Tracker (`/expenses`)**
   - Track meals, transit cards, textbook purchases, and subscriptions.
   - Recharts category breakdown (Donut / Pie chart) and daily spend pace.
   - Category filtering (Food, Transport, Education, Shopping, Entertainment, Health, Other) and live transaction search.

7. **Study Planner & Exam Readiness (`/study`)**
   - Upcoming Midterms and Final Exam countdowns with complete syllabus scope details.
   - Syllabus topic mastery checklist with interactive proficiency trackers (`-10%`, `+10%`).
   - Revision session logger updating weekly focus streaks (🔥).

8. **Academic Resources & Bookmarks (`/resources`)**
   - Categorized bookmarks for textbooks (PDFs), Visualizers, Video lectures, GitHub code samples, and personal notes.
   - Filter by resource type and search tags with instant external links.

9. **Analytics & Productivity Insights (`/analytics`)**
   - Recharts Bar Chart: Subject attendance vs university target threshold.
   - Recharts Line Chart: Focus study hours trend over time.
   - Recharts Pie Chart: Expense breakdown.
   - Task completion rate velocity meters.

10. **Custom Preferences & Settings (`/settings`)**
    - Profile management (Name, College, Course, Semester).
    - Light / Dark mode toggle with persistent local styling.
    - Configurable minimum attendance target percentage slider (50% to 95%).
    - Currency selector (USD, INR, EUR, GBP).
    - Proactive notification toggles (Deadlines, Attendance Shortage alerts, Daily reminders).
    - **Reset to Sample Data** button to quickly restore rich mock records.

11. **Authentication Flow (`/login`, `/register`, `/forgot-password`)**
    - Clean dedicated authentication layout with form validation.
    - Client-side mock session management ready for future JWT integration.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Forms & Validation**: React Hook Form, Zod, @hookform/resolvers
- **Routing**: React Router DOM v7
- **State & Storage**: React Context + resilient type-safe `localStorage` synchronization

---

## 📁 Frontend Architecture

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/               # Button, Input, Select, Card, Badge, ProgressBar, Modal, StatCard, EmptyState
│   │   ├── layout/           # Sidebar, TopNavbar, MobileBottomNav
│   │   └── domain/           # TaskCard, ClassCard, AssignmentCard, AttendanceCard, ExpenseCard, ResourceCard, RecommendationCard
│   ├── context/
│   │   ├── AppContext.tsx    # Central state store for tasks, classes, attendance, expenses, study, resources
│   │   ├── AuthContext.tsx   # User profile and mock auth session
│   │   └── ToastContext.tsx  # Global feedback notification system
│   ├── data/
│   │   └── mockData.ts       # Authentic student mock data across 5 CS courses
│   ├── layouts/
│   │   ├── AppLayout.tsx     # Responsive desktop sidebar + mobile drawer & bottom nav
│   │   └── AuthLayout.tsx    # Centered card layout for login/register
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── Timetable/
│   │   ├── Tasks/
│   │   ├── Assignments/
│   │   ├── Attendance/
│   │   ├── Expenses/
│   │   ├── StudyPlanner/
│   │   ├── Resources/
│   │   ├── Analytics/
│   │   ├── Settings/
│   │   ├── Login/
│   │   ├── Register/
│   │   └── ForgotPassword/
│   ├── routes/
│   │   └── AppRoutes.tsx     # Route declarations for all 13 paths
│   ├── services/             # Clean API simulation layer ready for future NestJS/Prisma endpoints
│   │   ├── api.ts
│   │   ├── tasks.service.ts
│   │   ├── timetable.service.ts
│   │   ├── assignments.service.ts
│   │   ├── attendance.service.ts
│   │   ├── expenses.service.ts
│   │   ├── study.service.ts
│   │   └── resources.service.ts
│   ├── types/
│   │   └── index.ts          # Core domain TypeScript models
│   ├── utils/
│   │   ├── cn.ts             # Tailwind classnames merger
│   │   ├── date.ts           # Time ago and date formatters
│   │   ├── recommendation.ts # Deterministic rule-based recommendation algorithm
│   │   └── storage.ts        # Resilient type-safe localStorage wrapper
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 How to Run the Frontend

### 1. Navigate to the frontend directory
```bash
cd frontend
```

### 2. Install dependencies (if cloning fresh)
```bash
npm install
```

### 3. Start the local development server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for production and verify types
```bash
npm run build
```

---

## 🛣️ Available Routes

| Route | Description |
|---|---|
| `/dashboard` | Command center with quick stats, recommendation, timeline, and task checklist |
| `/timetable` | Weekly timetable and daily schedule with add/edit class modal |
| `/tasks` | Task tracker with filters (Today, Upcoming, High Priority), search, and modal |
| `/assignments`| Homework and project tracker with status kanban and deadlines |
| `/attendance` | Subject cards with attendance percentages, safety margins, and quick log |
| `/expenses` | Student expense tracker with Recharts category distribution |
| `/study` | Study planner, exam countdowns, syllabus topic mastery, and session logger |
| `/resources` | Resource bookmarks with type filtering and external link launcher |
| `/analytics` | In-depth Recharts graphs for attendance, study hours, and spending |
| `/settings` | Profile, dark mode toggle, target percentage slider, notifications, data reset |
| `/login` | Sign in form |
| `/register` | Account registration form |
| `/forgot-password` | Password recovery form |

---

## 🔮 Future Development Phases

1. **Phase 2: Backend & Database Integration**
   - NestJS API backend with TypeScript.
   - PostgreSQL database with Prisma ORM migrations.
   - JWT authentication & secure HTTP-only cookies.
   - Switch frontend services (`src/services/`) from local storage to real REST endpoints.
2. **Phase 3: AI Copilot Modules**
   - Connect LLM API to replace deterministic `recommendation.ts` with adaptive AI study scheduling.
   - AI Flashcard and Viva Question Generator from lecture notes.
   - Syllabus exam roadmap generator.
