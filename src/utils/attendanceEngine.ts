import { Subject, AttendanceRecord, AttendanceStats, SubjectAttendanceStats } from '../types';
import { AppSettings } from '../config/settings';

export function calculateAttendanceStats(
  records: Record<string, AttendanceRecord>,
  settings: AppSettings,
  filterSubjectId?: string,
  filterMonth?: string
): AttendanceStats {
  const recordList = Object.values(records).filter((r) => {
    if (filterSubjectId && r.subjectId !== filterSubjectId) return false;
    if (filterMonth && !r.date.startsWith(filterMonth)) return false;
    return true;
  });

  let totalScheduledHours = 0;
  let attendedHours = 0;
  let absentHours = 0;
  let exemptedHours = 0;

  let totalClasses = 0;
  let attendedClasses = 0;
  let absentClasses = 0;
  let exemptedClasses = 0;

  for (const r of recordList) {
    const hrs = r.durationHours || 1;
    totalClasses += 1;
    totalScheduledHours += hrs;

    switch (r.status) {
      case 'attended':
        attendedHours += hrs;
        attendedClasses += 1;
        break;
      case 'absent':
        absentHours += hrs;
        absentClasses += 1;
        break;
      case 'exempted':
        exemptedHours += hrs;
        exemptedClasses += 1;
        break;
    }
  }

  // Exclude exempted/not counted hours & classes from total denominator
  const effectiveTotalHours = Math.max(0, totalScheduledHours - exemptedHours);
  const effectiveTotalClasses = Math.max(0, totalClasses - exemptedClasses);

  // Scenario A: Hourly Percentage (Priority)
  const hourlyPercentage = effectiveTotalHours > 0
    ? Math.round((attendedHours / effectiveTotalHours) * 1000) / 10
    : 100;

  // Scenario B: Class Count Percentage
  const classPercentage = effectiveTotalClasses > 0
    ? Math.round((attendedClasses / effectiveTotalClasses) * 1000) / 10
    : 100;

  const targetDecimal = (settings.targetAttendancePercent || 75) / 100;

  // Safe to bunk / Catch up calculations
  let safeBunkHours = 0;
  let requiredCatchUpHours = 0;

  if (effectiveTotalHours > 0) {
    if (hourlyPercentage >= settings.targetAttendancePercent) {
      safeBunkHours = Math.max(
        0,
        Math.floor((attendedHours - targetDecimal * effectiveTotalHours) / targetDecimal)
      );
    } else {
      requiredCatchUpHours = Math.max(
        0,
        Math.ceil((targetDecimal * effectiveTotalHours - attendedHours) / (1 - targetDecimal))
      );
    }
  }

  let safeBunkClasses = 0;
  let requiredCatchUpClasses = 0;

  if (effectiveTotalClasses > 0) {
    if (classPercentage >= settings.targetAttendancePercent) {
      safeBunkClasses = Math.max(
        0,
        Math.floor((attendedClasses - targetDecimal * effectiveTotalClasses) / targetDecimal)
      );
    } else {
      requiredCatchUpClasses = Math.max(
        0,
        Math.ceil((targetDecimal * effectiveTotalClasses - attendedClasses) / (1 - targetDecimal))
      );
    }
  }

  return {
    totalScheduledHours,
    attendedHours,
    absentHours,
    exemptedHours,
    effectiveTotalHours,
    hourlyPercentage,

    totalClasses,
    attendedClasses,
    absentClasses,
    exemptedClasses,
    effectiveTotalClasses,
    classPercentage,

    safeBunkHours,
    safeBunkClasses,
    requiredCatchUpHours,
    requiredCatchUpClasses,
  };
}

export function calculateSubjectBreakdown(
  subjects: Subject[],
  records: Record<string, AttendanceRecord>,
  settings: AppSettings,
  filterMonth?: string
): SubjectAttendanceStats[] {
  return subjects.map((sub) => {
    const stats = calculateAttendanceStats(records, settings, sub.id, filterMonth);

    return {
      subject: sub,
      totalHours: stats.totalScheduledHours,
      attendedHours: stats.attendedHours,
      absentHours: stats.absentHours,
      exemptedHours: stats.exemptedHours,
      effectiveTotalHours: stats.effectiveTotalHours,
      hourlyPercentage: stats.hourlyPercentage,
      classPercentage: stats.classPercentage,
      totalClasses: stats.totalClasses,
      attendedClasses: stats.attendedClasses,
      safeBunkHours: stats.safeBunkHours,
      requiredCatchUpHours: stats.requiredCatchUpHours,
    };
  });
}
