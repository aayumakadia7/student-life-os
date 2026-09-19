export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}

export function formatGreeting(name: string = 'Aayu'): { greeting: string; subtitle: string } {
  const now = new Date()
  const hour = now.getHours()
  let timeGreeting = 'Good Morning'
  if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good Afternoon'
  } else if (hour >= 17 || hour < 4) {
    timeGreeting = 'Good Evening'
  }

  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return {
    greeting: `${timeGreeting}, ${name} 👋`,
    subtitle: dateFormatted,
  }
}

export function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Due Today'
    if (diffDays === 1) return 'Due Tomorrow'
    if (diffDays > 1 && diffDays <= 7) return `Due in ${diffDays} days`
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
    return formatDate(dateString)
  } catch {
    return dateString
  }
}

export function getCurrentDayName(): 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday' {
  const days: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  return days[new Date().getDay()] as any
}
