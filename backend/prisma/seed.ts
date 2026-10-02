import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Student Life OS database seed...')

  // Clean existing data for idempotency
  await prisma.resource.deleteMany()
  await prisma.studySession.deleteMany()
  await prisma.studyTopic.deleteMany()
  await prisma.exam.deleteMany()
  await prisma.expense.deleteMany()
  await prisma.attendanceRecord.deleteMany()
  await prisma.assignment.deleteMany()
  await prisma.timetableEntry.deleteMany()
  await prisma.task.deleteMany()
  await prisma.userPreferences.deleteMany()
  await prisma.user.deleteMany()

  const saltRounds = 10
  const passwordHash = await bcrypt.hash('password123', saltRounds)

  // 1. Create Demo User
  const demoUser = await prisma.user.create({
    data: {
      name: 'Aayu Makadia',
      email: 'aayu@student.edu',
      passwordHash,
      college: 'Institute of Technology & Engineering',
      course: 'Computer Science & Engineering',
      semester: 'Semester 5',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    },
  })

  console.log(`👤 Created user: ${demoUser.name} (${demoUser.email})`)

  // 2. Create User Preferences
  await prisma.userPreferences.create({
    data: {
      userId: demoUser.id,
      theme: 'dark',
      attendanceTarget: 75,
      currency: 'USD',
      timeFormat: '12h',
      assignmentReminders: true,
      taskReminders: true,
      attendanceAlerts: true,
      studyReminders: false,
    },
  })

  // 3. Create Tasks
  const today = new Date()
  const formatDate = (offsetDays: number) => {
    const d = new Date(today.getTime() + offsetDays * 86400000)
    return d.toISOString().split('T')[0]
  }

  await prisma.task.createMany({
    data: [
      {
        userId: demoUser.id,
        title: 'Complete Linked List Assignment',
        subject: 'Data Structures',
        priority: 'high',
        status: 'todo',
        deadline: formatDate(1), // tomorrow
        estimatedMinutes: 60,
        description: 'Implement doubly linked list operations and memory leak checks.',
      },
      {
        userId: demoUser.id,
        title: 'Revise Karnaugh Maps & Sequential Circuits',
        subject: 'Digital Logic',
        priority: 'medium',
        status: 'todo',
        deadline: formatDate(2),
        estimatedMinutes: 45,
        description: 'Prepare notes for upcoming quiz on Thursday.',
      },
      {
        userId: demoUser.id,
        title: 'Design ER Diagram for Hospital Management',
        subject: 'Database Systems',
        priority: 'urgent',
        status: 'in_progress',
        deadline: formatDate(0), // today
        estimatedMinutes: 90,
        description: 'Create ER model with Chen notation and normalize to 3NF.',
      },
      {
        userId: demoUser.id,
        title: 'Read Chapter 4 on Demand & Supply Elasticity',
        subject: 'Engineering Economics',
        priority: 'low',
        status: 'completed',
        deadline: formatDate(-1),
        estimatedMinutes: 30,
        description: 'Summarize key elasticity formulas.',
      },
      {
        userId: demoUser.id,
        title: 'Implement Dijkstra’s Algorithm in C++',
        subject: 'Data Structures',
        priority: 'high',
        status: 'todo',
        deadline: formatDate(3),
        estimatedMinutes: 75,
        description: 'Graph shortest path implementation with min-heap priority queue.',
      },
    ],
  })

  // 4. Create Timetable Entries
  await prisma.timetableEntry.createMany({
    data: [
      // Monday
      {
        userId: demoUser.id,
        subject: 'Data Structures',
        code: 'CS301',
        teacher: 'Dr. Sarah Vance',
        room: 'Room 204',
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        color: 'indigo',
      },
      {
        userId: demoUser.id,
        subject: 'Digital Logic',
        code: 'EC204',
        teacher: 'Prof. Miller',
        room: 'Lab 2',
        day: 'Monday',
        startTime: '10:15',
        endTime: '11:15',
        color: 'emerald',
      },
      {
        userId: demoUser.id,
        subject: 'Engineering Economics',
        code: 'HS102',
        teacher: 'Dr. Rebecca Stone',
        room: 'Room 301',
        day: 'Monday',
        startTime: '12:00',
        endTime: '13:00',
        color: 'amber',
      },
      {
        userId: demoUser.id,
        subject: 'OOP with Java',
        code: 'CS302',
        teacher: 'Prof. Johnathan Roy',
        room: 'Lab 5',
        day: 'Monday',
        startTime: '14:00',
        endTime: '16:00',
        color: 'sky',
      },
      // Tuesday
      {
        userId: demoUser.id,
        subject: 'Database Systems',
        code: 'CS304',
        teacher: 'Dr. Andrew Davis',
        room: 'Room 204',
        day: 'Tuesday',
        startTime: '09:00',
        endTime: '10:30',
        color: 'purple',
      },
      {
        userId: demoUser.id,
        subject: 'Computer Networks',
        code: 'CS305',
        teacher: 'Prof. Karen Wilson',
        room: 'Room 108',
        day: 'Tuesday',
        startTime: '11:00',
        endTime: '12:30',
        color: 'rose',
      },
      {
        userId: demoUser.id,
        subject: 'Data Structures Lab',
        code: 'CS301L',
        teacher: 'Dr. Sarah Vance',
        room: 'Lab 1',
        day: 'Tuesday',
        startTime: '13:30',
        endTime: '15:30',
        color: 'indigo',
      },
      // Wednesday
      {
        userId: demoUser.id,
        subject: 'Data Structures',
        code: 'CS301',
        teacher: 'Dr. Sarah Vance',
        room: 'Room 204',
        day: 'Wednesday',
        startTime: '09:00',
        endTime: '10:00',
        color: 'indigo',
      },
      {
        userId: demoUser.id,
        subject: 'Digital Logic',
        code: 'EC204',
        teacher: 'Prof. Miller',
        room: 'Lab 2',
        day: 'Wednesday',
        startTime: '10:15',
        endTime: '11:15',
        color: 'emerald',
      },
      {
        userId: demoUser.id,
        subject: 'Software Engineering',
        code: 'CS308',
        teacher: 'Dr. Patricia Lee',
        room: 'Room 302',
        day: 'Wednesday',
        startTime: '12:00',
        endTime: '13:30',
        color: 'teal',
      },
      // Thursday
      {
        userId: demoUser.id,
        subject: 'Database Systems Lab',
        code: 'CS304L',
        teacher: 'Dr. Andrew Davis',
        room: 'Lab 3',
        day: 'Thursday',
        startTime: '09:00',
        endTime: '11:00',
        color: 'purple',
      },
      {
        userId: demoUser.id,
        subject: 'Computer Networks',
        code: 'CS305',
        teacher: 'Prof. Karen Wilson',
        room: 'Room 108',
        day: 'Thursday',
        startTime: '11:30',
        endTime: '13:00',
        color: 'rose',
      },
      // Friday
      {
        userId: demoUser.id,
        subject: 'OOP with Java',
        code: 'CS302',
        teacher: 'Prof. Johnathan Roy',
        room: 'Room 204',
        day: 'Friday',
        startTime: '09:30',
        endTime: '11:00',
        color: 'sky',
      },
      {
        userId: demoUser.id,
        subject: 'Engineering Economics',
        code: 'HS102',
        teacher: 'Dr. Rebecca Stone',
        room: 'Room 301',
        day: 'Friday',
        startTime: '11:30',
        endTime: '12:30',
        color: 'amber',
      },
    ],
  })

  // 5. Create Assignments
  await prisma.assignment.createMany({
    data: [
      {
        userId: demoUser.id,
        title: 'Balanced Binary Search Trees & AVL Rotations',
        subject: 'Data Structures',
        description: 'Implement self-balancing AVL tree insertion and deletion with single/double rotations in C++.',
        dueDate: formatDate(2),
        priority: 'high',
        status: 'in_progress',
        estimatedHours: 4,
      },
      {
        userId: demoUser.id,
        title: 'SQL Schema & Complex Join Optimization',
        subject: 'Database Systems',
        description: 'Write DDL scripts, triggers, and analyze query explain plans on an e-commerce sample database.',
        dueDate: formatDate(5),
        priority: 'medium',
        status: 'not_started',
        estimatedHours: 3,
      },
      {
        userId: demoUser.id,
        title: 'TCP vs UDP Wireshark Packet Analysis Report',
        subject: 'Computer Networks',
        description: 'Capture packet streams for HTTP, DNS, and video streaming. Compare throughput, jitter, and handshake.',
        dueDate: formatDate(7),
        priority: 'medium',
        status: 'not_started',
        estimatedHours: 2.5,
      },
      {
        userId: demoUser.id,
        title: 'Synchronous Counter Circuit Design',
        subject: 'Digital Logic',
        description: 'Design a modulo-12 up/down synchronous counter using JK flip-flops and test on Logisim.',
        dueDate: formatDate(-1),
        priority: 'high',
        status: 'submitted',
        estimatedHours: 3,
      },
    ],
  })

  // 6. Create Attendance Records
  await prisma.attendanceRecord.createMany({
    data: [
      {
        userId: demoUser.id,
        subject: 'Data Structures',
        code: 'CS301',
        held: 40,
        attended: 33,
        targetPercentage: 75,
      },
      {
        userId: demoUser.id,
        subject: 'Digital Logic',
        code: 'EC204',
        held: 38,
        attended: 29,
        targetPercentage: 75,
      },
      {
        userId: demoUser.id,
        subject: 'Engineering Economics',
        code: 'HS102',
        held: 34,
        attended: 31,
        targetPercentage: 75,
      },
      {
        userId: demoUser.id,
        subject: 'OOP with Java',
        code: 'CS302',
        held: 42,
        attended: 37,
        targetPercentage: 75,
      },
      {
        userId: demoUser.id,
        subject: 'Database Systems',
        code: 'CS304',
        held: 30,
        attended: 21,
        targetPercentage: 75,
      },
    ],
  })

  // 7. Create Expenses
  await prisma.expense.createMany({
    data: [
      {
        userId: demoUser.id,
        title: 'Algorithms Textbook (CLRS)',
        amount: 58.5,
        category: 'Education',
        date: formatDate(-1),
        notes: 'Bought second hand from senior student',
      },
      {
        userId: demoUser.id,
        title: 'Cafeteria Lunch & Coffee',
        amount: 8.25,
        category: 'Food',
        date: formatDate(0),
        notes: 'Campus food court',
      },
      {
        userId: demoUser.id,
        title: 'Metro Transit Monthly Pass',
        amount: 45.0,
        category: 'Transport',
        date: formatDate(-4),
        notes: 'Student discounted card',
      },
      {
        userId: demoUser.id,
        title: 'GitHub Copilot / Developer tools',
        amount: 10.0,
        category: 'Education',
        date: formatDate(-6),
        notes: 'Monthly dev subscription',
      },
      {
        userId: demoUser.id,
        title: 'Weekend Movie & Snacks',
        amount: 22.0,
        category: 'Entertainment',
        date: formatDate(-7),
        notes: 'Out with friends',
      },
      {
        userId: demoUser.id,
        title: 'Pharmacy Vitamins',
        amount: 14.5,
        category: 'Health',
        date: formatDate(-10),
      },
    ],
  })

  // 8. Create Exams
  await prisma.exam.createMany({
    data: [
      {
        userId: demoUser.id,
        subject: 'Data Structures Midterm',
        examDate: formatDate(12),
        time: '10:00 AM',
        room: 'Hall A - Desk 42',
        syllabus: 'Arrays, Linked Lists, Stacks, Queues, Binary Search Trees, Heaps, and Graph Traversals.',
      },
      {
        userId: demoUser.id,
        subject: 'Database Systems Test',
        examDate: formatDate(18),
        time: '02:00 PM',
        room: 'Hall B - Desk 19',
        syllabus: 'Relational algebra, SQL, Normalization (1NF to BCNF), and Transaction concurrency control.',
      },
      {
        userId: demoUser.id,
        subject: 'Digital Logic Quiz',
        examDate: formatDate(4),
        time: '11:15 AM',
        room: 'Lab 2',
        syllabus: 'Combinational circuit minimization, Multiplexers, and Sequential counters.',
      },
    ],
  })

  // 9. Create Study Topics
  await prisma.studyTopic.createMany({
    data: [
      { userId: demoUser.id, subject: 'Data Structures', topic: 'AVL Tree Rotations', difficulty: 'hard', progress: 72 },
      { userId: demoUser.id, subject: 'Digital Logic', topic: 'State Machine Minimization', difficulty: 'medium', progress: 58 },
      { userId: demoUser.id, subject: 'OOP with Java', topic: 'Generics & Multithreading', difficulty: 'medium', progress: 81 },
      { userId: demoUser.id, subject: 'Engineering Economics', topic: 'Net Present Value Analysis', difficulty: 'easy', progress: 65 },
      { userId: demoUser.id, subject: 'Database Systems', topic: 'B+ Tree Indexing Mechanisms', difficulty: 'hard', progress: 40 },
    ],
  })

  // 10. Create Study Sessions
  await prisma.studySession.createMany({
    data: [
      {
        userId: demoUser.id,
        subject: 'Data Structures',
        topic: 'Graph Dijkstra & Prim algorithms',
        date: formatDate(-1),
        durationMinutes: 90,
        completed: true,
      },
      {
        userId: demoUser.id,
        subject: 'Database Systems',
        topic: 'Relational algebra queries practice',
        date: formatDate(-2),
        durationMinutes: 60,
        completed: true,
      },
      {
        userId: demoUser.id,
        subject: 'Digital Logic',
        topic: 'Flip-flop state table derivation',
        date: formatDate(-3),
        durationMinutes: 45,
        completed: true,
      },
      {
        userId: demoUser.id,
        subject: 'OOP with Java',
        topic: 'ExecutorService and thread pools',
        date: formatDate(-4),
        durationMinutes: 75,
        completed: true,
      },
    ],
  })

  // 11. Create Resources
  await prisma.resource.createMany({
    data: [
      {
        userId: demoUser.id,
        title: 'Visualgo Data Structures Visualizer',
        subject: 'Data Structures',
        type: 'Website',
        url: 'https://visualgo.net/en',
        description: 'Interactive animations for sorting, graphs, recursion trees, and hash tables.',
        tags: ['Interactive', 'Visuals', 'Algorithms'],
      },
      {
        userId: demoUser.id,
        title: 'MIT 6.006 Introduction to Algorithms Notes',
        subject: 'Data Structures',
        type: 'PDF',
        url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/resources/lecture-notes/',
        description: 'Comprehensive MIT OpenCourseWare lecture notes and problem sets.',
        tags: ['MIT', 'Lecture Notes', 'PDF'],
      },
      {
        userId: demoUser.id,
        title: 'Database System Concepts (Silberschatz) Code Samples',
        subject: 'Database Systems',
        type: 'GitHub',
        url: 'https://github.com/db-book/db-book-support',
        description: 'Official repository containing SQL scripts and sample universities dataset.',
        tags: ['GitHub', 'SQL', 'Textbook'],
      },
      {
        userId: demoUser.id,
        title: 'Computerphile: How Does the Internet Work?',
        subject: 'Computer Networks',
        type: 'YouTube',
        url: 'https://www.youtube.com/watch?v=7_LPdttKXPc',
        description: 'Clear intuitive explanation of TCP packet routing, IP addressing, and switches.',
        tags: ['Video', 'Foundations'],
      },
      {
        userId: demoUser.id,
        title: 'Digital Logic Cheat Sheet & Gate Truth Tables',
        subject: 'Digital Logic',
        type: 'Notes',
        url: 'https://example.com/digital-logic-notes',
        description: 'Personal compiled notes on De Morgan laws, Karnaugh mapping, and flip-flops.',
        tags: ['Cheatsheet', 'Revision'],
      },
    ],
  })

  console.log('✅ Student Life OS seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error executing seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
