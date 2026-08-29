/**
 * BunkIt Global Settings & Configurable Variables Store
 * Central source of truth for all configurable constants, thresholds, palettes, and rules.
 */

export interface SubjectColor {
  id: string;
  name: string;
  hex: string;
  text: string;
  border: string;
  badgeBg: string;
}

// 15 distinct, high-contrast colors carefully selected to avoid overlapping hues
export const DISTINCT_SUBJECT_COLORS: SubjectColor[] = [
  { id: 'coral', name: 'Electric Coral', hex: '#FF4F58', text: '#FFFFFF', border: '#E02630', badgeBg: 'rgba(255, 79, 88, 0.2)' },
  { id: 'lime', name: 'Acid Lime', hex: '#84CC16', text: '#0A0A0A', border: '#65A30D', badgeBg: 'rgba(132, 204, 22, 0.2)' },
  { id: 'cyan', name: 'Cyber Cyan', hex: '#06B6D4', text: '#0A0A0A', border: '#0891B2', badgeBg: 'rgba(6, 182, 212, 0.2)' },
  { id: 'violet', name: 'Royal Violet', hex: '#8B5CF6', text: '#FFFFFF', border: '#7C3AED', badgeBg: 'rgba(139, 92, 246, 0.2)' },
  { id: 'amber', name: 'Vivid Amber', hex: '#F59E0B', text: '#0A0A0A', border: '#D97706', badgeBg: 'rgba(245, 158, 11, 0.2)' },
  { id: 'pink', name: 'Neon Pink', hex: '#EC4899', text: '#FFFFFF', border: '#DB2777', badgeBg: 'rgba(236, 72, 153, 0.2)' },
  { id: 'emerald', name: 'Emerald Green', hex: '#10B981', text: '#0A0A0A', border: '#059669', badgeBg: 'rgba(16, 185, 129, 0.2)' },
  { id: 'tangerine', name: 'Deep Tangerine', hex: '#F97316', text: '#FFFFFF', border: '#EA580C', badgeBg: 'rgba(249, 115, 22, 0.2)' },
  { id: 'cobalt', name: 'Cobalt Blue', hex: '#3B82F6', text: '#FFFFFF', border: '#2563EB', badgeBg: 'rgba(59, 130, 246, 0.2)' },
  { id: 'fuchsia', name: 'Bright Fuchsia', hex: '#D946EF', text: '#FFFFFF', border: '#C026D3', badgeBg: 'rgba(217, 70, 239, 0.2)' },
  { id: 'mint', name: 'Mint Turquoise', hex: '#14B8A6', text: '#0A0A0A', border: '#0D9488', badgeBg: 'rgba(20, 184, 166, 0.2)' },
  { id: 'yellow', name: 'Sunburst Yellow', hex: '#EAB308', text: '#0A0A0A', border: '#CA8A04', badgeBg: 'rgba(234, 179, 8, 0.2)' },
  { id: 'indigo', name: 'Indigo Ink', hex: '#6366F1', text: '#FFFFFF', border: '#4F46E5', badgeBg: 'rgba(99, 102, 241, 0.2)' },
  { id: 'crimson', name: 'Crimson Red', hex: '#EF4444', text: '#FFFFFF', border: '#DC2626', badgeBg: 'rgba(239, 68, 68, 0.2)' },
  { id: 'teal', name: 'Steel Teal', hex: '#0D9488', text: '#FFFFFF', border: '#0F766E', badgeBg: 'rgba(13, 148, 136, 0.2)' },
];

export type AttendanceStatusType = 'attended' | 'absent' | 'proxy' | 'exam' | 'exempted';

export interface StatusConfig {
  id: AttendanceStatusType;
  label: string;
  shortLabel: string;
  description: string;
  borderColor: string;
  bgDarkColor: string;
  textColor: string;
  badgeBg: string;
  countsTowardAttended: boolean;
  countsTowardTotal: boolean;
}

export const ATTENDANCE_STATUS_CONFIG: Record<AttendanceStatusType, StatusConfig> = {
  attended: {
    id: 'attended',
    label: 'Attended',
    shortLabel: 'ATT',
    description: 'Present in class. Full attendance credit granted.',
    borderColor: '#10B981', // green border
    bgDarkColor: 'rgba(6, 78, 59, 0.75)', // darkened green inside
    textColor: '#34D399',
    badgeBg: '#064E3B',
    countsTowardAttended: true,
    countsTowardTotal: true,
  },
  absent: {
    id: 'absent',
    label: 'Absent',
    shortLabel: 'ABS',
    description: 'Missed class / Bunked. Counts against attendance record.',
    borderColor: '#EF4444', // red border
    bgDarkColor: 'rgba(136, 19, 55, 0.75)', // darkened red inside
    textColor: '#F87171',
    badgeBg: '#881337',
    countsTowardAttended: false,
    countsTowardTotal: true,
  },
  proxy: {
    id: 'proxy',
    label: 'Proxy',
    shortLabel: 'PRX',
    description: 'Proxy marked by friend. Counted as attended in college tally.',
    borderColor: '#0EA5E9', // blue border
    bgDarkColor: 'rgba(12, 74, 110, 0.75)', // darkened blue inside
    textColor: '#38BDF8',
    badgeBg: '#0C4A6E',
    countsTowardAttended: true,
    countsTowardTotal: true,
  },
  exam: {
    id: 'exam',
    label: 'Exam',
    shortLabel: 'EXM',
    description: 'Internal exam, midterm, or practical test.',
    borderColor: '#F59E0B', // yellow border
    bgDarkColor: 'rgba(120, 53, 15, 0.75)', // darkened yellow inside
    textColor: '#FBBF24',
    badgeBg: '#78350F',
    countsTowardAttended: true,
    countsTowardTotal: true,
  },
  exempted: {
    id: 'exempted',
    label: 'Not Counted',
    shortLabel: 'OFF',
    description: 'Holiday, professor absent, college fest, or duty leave. Not counted in total.',
    borderColor: '#64748B', // grey border
    bgDarkColor: 'rgba(30, 41, 59, 0.75)', // darkened grey inside
    textColor: '#94A3B8',
    badgeBg: '#1E293B',
    countsTowardAttended: false,
    countsTowardTotal: false, // excluded from denominator!
  },
};

export type CalculationMode = 'hourly' | 'lecture_count' | 'subject_wise';

export interface AppSettings {
  targetAttendancePercent: number; // e.g. 75%
  warningThresholdPercent: number; // e.g. 65%
  criticalThresholdPercent: number; // e.g. 50%
  defaultLectureDurationHours: number; // 1 hr default
  minLectureDurationHours: number; // 1 hr
  maxLectureDurationHours: number; // 6 hrs
  primaryCalculationMode: CalculationMode;
  workingDays: number[]; // 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 0=Sun
  semesterStartDate: string; // YYYY-MM-DD
  semesterEndDate: string; // YYYY-MM-DD
  enableConfetti: boolean;
  enableVibration: boolean;
  themeMode: 'dark'; // Brutalist Dark
}

export const DEFAULT_SETTINGS: AppSettings = {
  targetAttendancePercent: 75,
  warningThresholdPercent: 65,
  criticalThresholdPercent: 50,
  defaultLectureDurationHours: 1,
  minLectureDurationHours: 1,
  maxLectureDurationHours: 6,
  primaryCalculationMode: 'hourly',
  workingDays: [1, 2, 3, 4, 5], // Mon-Fri
  semesterStartDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  semesterEndDate: new Date(new Date().getFullYear(), new Date().getMonth() + 4, 0).toISOString().split('T')[0],
  enableConfetti: true,
  enableVibration: true,
  themeMode: 'dark',
};

export const DAYS_OF_WEEK = [
  { dayIndex: 1, name: 'Monday', short: 'MON' },
  { dayIndex: 2, name: 'Tuesday', short: 'TUE' },
  { dayIndex: 3, name: 'Wednesday', short: 'WED' },
  { dayIndex: 4, name: 'Thursday', short: 'THU' },
  { dayIndex: 5, name: 'Friday', short: 'FRI' },
  { dayIndex: 6, name: 'Saturday', short: 'SAT' },
  { dayIndex: 0, name: 'Sunday', short: 'SUN' },
];

export const SUBJECT_MOOD_TAGS = [
  { id: 'fun', label: 'Fun / Love it', emoji: '🔥', color: '#10B981' },
  { id: 'ok_ok', label: 'Ok Ok / Neutral', emoji: '😐', color: '#F59E0B' },
  { id: 'hate', label: 'Hate / Boring', emoji: '💀', color: '#EF4444' },
] as const;
