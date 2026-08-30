import { AttendanceStatusType, AppSettings } from '../config/settings';

export interface Subject {
  id: string;
  name: string;
  colorId: string;
  createdAt: number;
}

export interface TimeTableSlot {
  id: string;
  dayOfWeek: number; // 0=Sun, 1=Mon, ..., 6=Sat
  subjectId: string;
  startTime: string; // e.g. "09:00"
  durationHours: number; // 1 to 6
  order: number;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  slotId: string;
  subjectId: string;
  status: AttendanceStatusType;
  durationHours: number;
  timestamp: number;
}

export interface AttendanceStats {
  // Scenario A: Hourly
  totalScheduledHours: number;
  attendedHours: number;
  absentHours: number;
  exemptedHours: number;
  effectiveTotalHours: number;
  hourlyPercentage: number;

  // Scenario B: Class Count
  totalClasses: number;
  attendedClasses: number;
  absentClasses: number;
  exemptedClasses: number;
  effectiveTotalClasses: number;
  classPercentage: number;

  // Bunk Metrics
  safeBunkHours: number;
  safeBunkClasses: number;
  requiredCatchUpHours: number;
  requiredCatchUpClasses: number;
}

export interface SubjectAttendanceStats {
  subject: Subject;
  totalHours: number;
  attendedHours: number;
  absentHours: number;
  exemptedHours: number;
  effectiveTotalHours: number;
  hourlyPercentage: number;
  classPercentage: number;
  totalClasses: number;
  attendedClasses: number;
  safeBunkHours: number;
  requiredCatchUpHours: number;
}

export interface AppState {
  subjects: Subject[];
  timetable: TimeTableSlot[];
  records: Record<string, AttendanceRecord>;
  settings: AppSettings;
}
