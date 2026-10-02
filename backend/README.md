# Student Life OS — Backend API 🎓

Centralized REST API backend for **Student Life OS**, powering academic productivity, timetable scheduling, assignment deadlines, attendance compliance calculations, expense analytics, exam countdowns, study mastery tracking, learning resources, user preferences, and explainable priority recommendations.

Built with **Node.js, NestJS, TypeScript, Prisma ORM, and PostgreSQL**.

---

## 🛠️ Tech Stack

- **Runtime & Framework**: Node.js & NestJS 10
- **Language**: TypeScript
- **Database & ORM**: PostgreSQL with Prisma ORM
- **Authentication**: JWT, Passport (`passport-jwt`), bcrypt password hashing
- **Validation**: `class-validator` & `class-transformer` with global `ValidationPipe`
- **API Documentation**: Swagger / OpenAPI (hosted at `/api/docs`)
- **Architecture**: Modular domain-driven architecture with guards, interceptors, and filters

---

## 📦 Project Structure

```
backend/
├── src/
│   ├── auth/           # Authentication, JWT strategy, registration, login
│   ├── users/          # Student user profile & settings
│   ├── tasks/          # Tasks CRUD, status updates, priority sorting
│   ├── timetable/      # Weekly lecture timetable schedule & day filtering
│   ├── assignments/    # Course assignments & status tracking
│   ├── attendance/     # Attendance tracking & missable/required class formula
│   ├── expenses/       # Campus expenses & category breakdown analytics
│   ├── exams/          # Upcoming exams & syllabus revision
│   ├── study/          # Syllabus topic progress & focus session logger
│   ├── resources/      # Academic bookmarks & external materials
│   ├── preferences/    # Student OS UI theme & notification toggles
│   ├── dashboard/      # Aggregated command center & "What Should I Do Now?"
│   ├── health/         # System uptime & database connection ping
│   ├── prisma/         # PrismaService & global database client
│   ├── common/         # Decorators (@CurrentUser), Guards, Filters, Interceptors
│   ├── app.module.ts   # Root NestJS module
│   └── main.ts         # NestJS application bootstrap
├── prisma/
│   ├── schema.prisma   # PostgreSQL relational schema
│   └── seed.ts         # Realistic student demo data seeder
├── .env.example
├── .env
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Prerequisites & PostgreSQL Setup

1. **Node.js**: v18+ (tested on Node v24)
2. **PostgreSQL**: Install PostgreSQL locally or run with Docker:

```bash
docker run --name student-life-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=student_life_os \
  -p 5432:5432 \
  -d postgres:16
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/student_life_os?schema=public"
JWT_SECRET="student-life-os-super-secure-secret-key-2026"
JWT_EXPIRES_IN="7d"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

---

## 🚀 Installation & Running

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Run Database Migrations
```bash
npx prisma migrate dev --name init
```

### 4. Seed Database with Realistic Student Records
```bash
npm run prisma:seed
```
*Seeds demo account:*
- **Email**: `aayu@student.edu`
- **Password**: `password123`

### 5. Start Development Server
```bash
npm run start:dev
```
Server starts on `http://localhost:3000/api`.

---

## 📖 API Documentation (Swagger)

Interactive Swagger / OpenAPI UI is accessible at:
👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

---

## 🧭 API Endpoints Overview

All routes are prefixed with `/api`.

### Health Check
- `GET /api/health` — System status and DB connectivity check

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register student account & default preferences
- `POST /api/auth/login` — Log in and receive JWT token
- `POST /api/auth/forgot-password` — Password reset request
- `GET /api/auth/me` — Currently authenticated student profile *(Protected)*

### User Profile (`/api/users`)
- `GET /api/users/me` — Get student user profile
- `PATCH /api/users/me` — Update name, college, course, semester, avatarUrl

### Tasks (`/api/tasks`)
- `GET /api/tasks` — List tasks (filters: `?status=todo`, `?priority=high`)
- `GET /api/tasks/:id` — Get task by ID
- `POST /api/tasks` — Create task
- `PATCH /api/tasks/:id` — Update task details
- `PATCH /api/tasks/:id/status` — Quick status toggle (`todo`, `in_progress`, `completed`)
- `DELETE /api/tasks/:id` — Delete task

### Timetable (`/api/timetable`)
- `GET /api/timetable` — Get schedule (filter: `?day=Monday`)
- `POST /api/timetable` — Add class to schedule
- `PATCH /api/timetable/:id` — Update class details
- `DELETE /api/timetable/:id` — Remove class from schedule

### Assignments (`/api/assignments`)
- `GET /api/assignments` — List assignments (filter: `?status=in_progress`)
- `GET /api/assignments/:id` — Get assignment by ID
- `POST /api/assignments` — Create course assignment
- `PATCH /api/assignments/:id` — Update assignment
- `DELETE /api/assignments/:id` — Delete assignment

### Attendance (`/api/attendance`)
- `GET /api/attendance` — All subjects with live compliance metrics
- `GET /api/attendance/summary` — Overall compliance, total held/attended, compliant vs at-risk count
- `GET /api/attendance/:id` — Course attendance details
- `POST /api/attendance` — Add course tracker
- `PATCH /api/attendance/:id` — Update course record
- `POST /api/attendance/:id/present` — Log lecture as Present (`held + 1`, `attended + 1`)
- `POST /api/attendance/:id/absent` — Log lecture as Absent (`held + 1`, `attended unchanged`)
- `DELETE /api/attendance/:id` — Remove course tracker

### Expenses (`/api/expenses`)
- `GET /api/expenses` — List expenses (filters: `?category=Food`, `?startDate=`, `?endDate=`)
- `GET /api/expenses/summary` — Total spend, monthly spend, daily average
- `GET /api/expenses/category-summary` — Category breakdown for Recharts donut/pie chart
- `GET /api/expenses/:id` — Get expense details
- `POST /api/expenses` — Log new expense
- `PATCH /api/expenses/:id` — Update expense
- `DELETE /api/expenses/:id` — Delete expense

### Exams (`/api/exams`)
- `GET /api/exams` — List upcoming exams
- `GET /api/exams/:id` — Get exam details
- `POST /api/exams` — Schedule new exam
- `PATCH /api/exams/:id` — Update exam date/room/syllabus
- `DELETE /api/exams/:id` — Delete exam

### Study (`/api/study`)
- `GET /api/study/topics` — List syllabus topics with mastery percentage
- `POST /api/study/topics` — Create new topic
- `PATCH /api/study/topics/:id` — Update topic progress (0 - 100)
- `DELETE /api/study/topics/:id` — Delete topic
- `GET /api/study/sessions` — List focus study session history
- `POST /api/study/sessions` — Log completed study session
- `PATCH /api/study/sessions/:id` — Update study session
- `DELETE /api/study/sessions/:id` — Delete session
- `GET /api/study/summary` — Total study hours, weekly minutes, and streak stats

### Resources (`/api/resources`)
- `GET /api/resources` — List bookmarks (filters: `?type=PDF`, `?subject=Data Structures`)
- `GET /api/resources/:id` — Get bookmark details
- `POST /api/resources` — Bookmark learning resource
- `PATCH /api/resources/:id` — Update resource
- `DELETE /api/resources/:id` — Delete resource

### Preferences (`/api/preferences`)
- `GET /api/preferences` — Get UI preferences & notification alerts
- `PATCH /api/preferences` — Update theme, currency, timeFormat, and notification settings

### Command Center Dashboard (`/api/dashboard`)
- `GET /api/dashboard` — Aggregated command center payload
- `GET /api/dashboard/recommendations` — Smart "What Should I Do Now?" rule-based recommendation with explainable reasons

---

## 🧪 Testing

Execute unit tests:
```bash
npm run test
```

---

## 🔗 Frontend Integration

The frontend located in `frontend/` connects to this backend via:
```env
VITE_API_URL=http://localhost:3000/api
```
All API interactions use JSON requests with automatic JWT Bearer token headers when authenticated.
