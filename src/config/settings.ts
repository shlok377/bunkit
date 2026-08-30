/**
 * BunkIt Global Settings & Configurable Variables Store
 * Minimal, clean configuration without unnecessary presets or bloat.
 */

export interface SubjectColor {
  id: string;
  hex: string;
}

// 15 distinct, high-contrast colors
export const DISTINCT_SUBJECT_COLORS: SubjectColor[] = [
  { id: 'coral', hex: '#FF4F58' },
  { id: 'lime', hex: '#84CC16' },
  { id: 'cyan', hex: '#06B6D4' },
  { id: 'violet', hex: '#8B5CF6' },
  { id: 'amber', hex: '#F59E0B' },
  { id: 'pink', hex: '#EC4899' },
  { id: 'emerald', hex: '#10B981' },
  { id: 'tangerine', hex: '#F97316' },
  { id: 'cobalt', hex: '#3B82F6' },
  { id: 'fuchsia', hex: '#D946EF' },
  { id: 'mint', hex: '#14B8A6' },
  { id: 'yellow', hex: '#EAB308' },
  { id: 'indigo', hex: '#6366F1' },
  { id: 'crimson', hex: '#EF4444' },
  { id: 'teal', hex: '#0D9488' },
];

export type AttendanceStatusType = 'attended' | 'absent' | 'exempted';

export interface StatusConfig {
  id: AttendanceStatusType;
  label: string;
  shortLabel: string;
  borderColor: string;
  bgDarkColor: string;
  textColor: string;
  countsTowardAttended: boolean;
  countsTowardTotal: boolean;
}

export const ATTENDANCE_STATUS_CONFIG: Record<AttendanceStatusType, StatusConfig> = {
  attended: {
    id: 'attended',
    label: 'Attended',
    shortLabel: 'ATT',
    borderColor: '#10B981', // green border
    bgDarkColor: 'rgba(6, 78, 59, 0.75)', // dark green inside
    textColor: '#34D399',
    countsTowardAttended: true,
    countsTowardTotal: true,
  },
  absent: {
    id: 'absent',
    label: 'Absent',
    shortLabel: 'ABS',
    borderColor: '#EF4444', // red border
    bgDarkColor: 'rgba(136, 19, 55, 0.75)', // dark red inside
    textColor: '#F87171',
    countsTowardAttended: false,
    countsTowardTotal: true,
  },
  exempted: {
    id: 'exempted',
    label: 'Not Counted',
    shortLabel: 'OFF',
    borderColor: '#64748B', // grey border
    bgDarkColor: 'rgba(30, 41, 59, 0.75)', // dark grey inside
    textColor: '#94A3B8',
    countsTowardAttended: false,
    countsTowardTotal: false, // excluded from monthly total denominator
  },
};

export type CalculationMode = 'hourly' | 'lecture_count';

export interface AppSettings {
  targetAttendancePercent: number; // default 75%
  warningThresholdPercent: number; // default 65%
  criticalThresholdPercent: number; // default 50%
  defaultLectureDurationHours: number; // 1 hr default
  minLectureDurationHours: number; // 1 hr
  maxLectureDurationHours: number; // 6 hrs
  primaryCalculationMode: CalculationMode;
  enableConfetti: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  targetAttendancePercent: 75,
  warningThresholdPercent: 65,
  criticalThresholdPercent: 50,
  defaultLectureDurationHours: 1,
  minLectureDurationHours: 1,
  maxLectureDurationHours: 6,
  primaryCalculationMode: 'hourly',
  enableConfetti: true,
};
