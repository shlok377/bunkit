/**
 * Date and Calendar Mathematics Utilities for BunkIt
 * Handles month progress, week navigation, and ISO date formatting.
 */

export interface MonthProgressInfo {
  year: number;
  monthName: string; // e.g. "August"
  monthIndex: number; // 0-11
  totalDays: number; // 28, 29, 30, or 31
  currentDay: number; // 1-31
  daysElapsed: number;
  daysRemaining: number;
  percentElapsed: number; // 0 to 100
  percentRemaining: number; // 0 to 100 (Progress of how much month is left)
}

export interface DayInfo {
  dateStr: string; // YYYY-MM-DD
  date: Date;
  dayOfWeek: number; // 0=Sun, 1=Mon, ..., 6=Sat
  dayNumber: number; // 1-31
  dayName: string; // "Monday"
  shortDay: string; // "MON"
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
}

/**
 * Format a Date object to YYYY-MM-DD string in local time
 */
export function formatToIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parse YYYY-MM-DD string to local Date object
 */
export function parseIsoDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Calculate total days in a month (handles leap years accurately)
 */
export function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/**
 * Computes exact month progress and remaining days
 */
export function getMonthProgress(date: Date = new Date()): MonthProgressInfo {
  const year = date.getFullYear();
  const monthIndex = date.getMonth();
  const currentDay = date.getDate();
  const totalDays = getDaysInMonth(year, monthIndex);

  const daysElapsed = currentDay;
  const daysRemaining = totalDays - currentDay;

  const percentElapsed = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));
  const percentRemaining = Math.min(100, Math.max(0, (daysRemaining / totalDays) * 100));

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return {
    year,
    monthName: monthNames[monthIndex],
    monthIndex,
    totalDays,
    currentDay,
    daysElapsed,
    daysRemaining,
    percentElapsed: Math.round(percentElapsed * 10) / 10,
    percentRemaining: Math.round(percentRemaining * 10) / 10,
  };
}

/**
 * Get days for the current week (Monday to Sunday) containing targetDate
 */
export function getWeekDays(targetDate: Date = new Date()): DayInfo[] {
  const todayStr = formatToIsoDate(new Date());
  const current = new Date(targetDate);
  const day = current.getDay(); // 0 is Sun, 1 is Mon
  
  // Calculate Monday as start of week (if Sunday, day is 0 -> go back 6 days)
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(current);
  monday.setDate(current.getDate() + diffToMonday);

  const days: DayInfo[] = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = formatToIsoDate(d);
    const dayOfWeek = d.getDay();

    days.push({
      dateStr,
      date: d,
      dayOfWeek,
      dayNumber: d.getDate(),
      dayName: dayNames[dayOfWeek],
      shortDay: shortNames[dayOfWeek],
      isToday: dateStr === todayStr,
      isPast: dateStr < todayStr,
      isFuture: dateStr > todayStr,
    });
  }

  return days;
}

/**
 * Format a human-readable display date, e.g. "Monday, 28 August"
 */
export function formatDisplayDate(dateStr: string): {
  weekday: string;
  dayNum: string;
  month: string;
  year: number;
} {
  const date = parseIsoDate(dateStr);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return {
    weekday: dayNames[date.getDay()],
    dayNum: String(date.getDate()).padStart(2, '0'),
    month: monthNames[date.getMonth()],
    year: date.getFullYear(),
  };
}

/**
 * Add / subtract days from a date string
 */
export function addDays(dateStr: string, days: number): string {
  const date = parseIsoDate(dateStr);
  date.setDate(date.getDate() + days);
  return formatToIsoDate(date);
}
