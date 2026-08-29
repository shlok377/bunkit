import { AttendanceStatusType, AppSettings } from '../config/settings';

export type MoodTagType = 'fun' | 'ok_ok' | 'hate';

export interface Subject {
  id: string;
  name: string;
  code?: string;
  colorId: string; // references DISTINCT_SUBJECT_COLORS id
  moodTag?: MoodTagType;
  targetPercentage?: number; // custom per-subject target override if any
  roomDefault?: string;
  createdAt: number;
}

export interface TimeTableSlot {
  id: string;
  dayOfWeek: number; // 0=Sun, 1=Mon, ..., 6=Sat
  subjectId: string;
  startTime: string; // e.g. "09:00"
  durationHours: number; // 1 to 6 (ratio mapped to widget height)
  room?: string;
  order: number;
}

export interface AttendanceRecord {
  id: string; // unique for date + slotId (or custom instance)
  date: string; // YYYY-MM-DD
  slotId: string;
  subjectId: string;
  status: AttendanceStatusType;
  durationHours: number;
  timestamp: number;
  note?: string;
}

export interface AttendanceStats {
  // Scenario A: Hourly (Priority)
  totalScheduledHours: number;
  attendedHours: number;
  proxyHours: number;
  absentHours: number;
  exemptedHours: number;
  effectiveTotalHours: number; // total - exempted
  hourlyPercentage: number;

  // Scenario B: Class / Lecture count
  totalClasses: number;
  attendedClasses: number;
  proxyClasses: number;
  absentClasses: number;
  exemptedClasses: number;
  effectiveTotalClasses: number;
  classPercentage: number;

  // Bunk Intelligence
  safeBunkHours: number;
  safeBunkClasses: number;
  requiredCatchUpHours: number;
  requiredCatchUpClasses: number;

  // Health Score & Status
  healthStatus: 'safe' | 'warning' | 'critical';
  streakDays: number;
}

export interface SubjectAttendanceStats {
  subject: Subject;
  totalHours: number;
  attendedHours: number;
  proxyHours: number;
  absentHours: number;
  exemptedHours: number;
  effectiveTotalHours: number;
  hourlyPercentage: number;
  classPercentage: number;
  totalClasses: number;
  attendedClasses: number;
  safeBunkHours: number;
  requiredCatchUpHours: number;
  status: 'safe' | 'warning' | 'critical';
}

export interface AppState {
  subjects: Subject[];
  timetable: TimeTableSlot[];
  records: Record<string, AttendanceRecord>; // key: `${date}_${slotId}`
  settings: AppSettings;
}
