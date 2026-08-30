import { Subject, AttendanceRecord, AttendanceStats, SubjectAttendanceStats } from '../types';
import { AppSettings } from '../config/settings';

/**
 * Pure mathematical calculation engine for Attendance & Bunk Intelligence.
 */

export function calculateAttendanceStats(
  records: Record<string, AttendanceRecord>,
  settings: AppSettings,
  filterSubjectId?: string,
  filterMonth?: string // YYYY-MM
): AttendanceStats {
  const recordList = Object.values(records).filter((r) => {
    if (filterSubjectId && r.subjectId !== filterSubjectId) return false;
    if (filterMonth && !r.date.startsWith(filterMonth)) return false;
    return true;
  });

  let totalScheduledHours = 0;
  let attendedHours = 0;
  let proxyHours = 0;
  let absentHours = 0;
  let exemptedHours = 0;

  let totalClasses = 0;
  let attendedClasses = 0;
  let proxyClasses = 0;
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
      case 'proxy':
        proxyHours += hrs;
        proxyClasses += 1;
        break;
      case 'exam':
        attendedHours += hrs; // Exam counts as attended credit
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

  // Effective denominators excluding exempted/not counted lectures
  const effectiveTotalHours = Math.max(0, totalScheduledHours - exemptedHours);
  const effectiveTotalClasses = Math.max(0, totalClasses - exemptedClasses);

  const totalCreditedHours = attendedHours + proxyHours;
  const totalCreditedClasses = attendedClasses + proxyClasses;

  // Scenario A: Hourly Percentage
  const hourlyPercentage = effectiveTotalHours > 0
    ? Math.round((totalCreditedHours / effectiveTotalHours) * 1000) / 10
    : 100;

  // Scenario B: Class Count Percentage
  const classPercentage = effectiveTotalClasses > 0
    ? Math.round((totalCreditedClasses / effectiveTotalClasses) * 1000) / 10
    : 100;

  const targetDecimal = (settings.targetAttendancePercent || 75) / 100;

  // Safe to bunk calculation: Floor((Attended - Target * Total) / Target)
  let safeBunkHours = 0;
  let requiredCatchUpHours = 0;

  if (effectiveTotalHours > 0) {
    if (hourlyPercentage >= settings.targetAttendancePercent) {
      safeBunkHours = Math.max(
        0,
        Math.floor((totalCreditedHours - targetDecimal * effectiveTotalHours) / targetDecimal)
      );
    } else {
      // Catch up required: Ceil((Target * Total - Attended) / (1 - Target))
      requiredCatchUpHours = Math.max(
        0,
        Math.ceil((targetDecimal * effectiveTotalHours - totalCreditedHours) / (1 - targetDecimal))
      );
    }
  }

  let safeBunkClasses = 0;
  let requiredCatchUpClasses = 0;

  if (effectiveTotalClasses > 0) {
    if (classPercentage >= settings.targetAttendancePercent) {
      safeBunkClasses = Math.max(
        0,
        Math.floor((totalCreditedClasses - targetDecimal * effectiveTotalClasses) / targetDecimal)
      );
    } else {
      requiredCatchUpClasses = Math.max(
        0,
        Math.ceil((targetDecimal * effectiveTotalClasses - totalCreditedClasses) / (1 - targetDecimal))
      );
    }
  }

  // Health status categorization
  let healthStatus: 'safe' | 'warning' | 'critical' = 'safe';
  const effectivePct = settings.primaryCalculationMode === 'lecture_count' ? classPercentage : hourlyPercentage;

  if (effectivePct < (settings.criticalThresholdPercent || 50)) {
    healthStatus = 'critical';
  } else if (effectivePct < (settings.targetAttendancePercent || 75)) {
    healthStatus = 'warning';
  } else {
    healthStatus = 'safe';
  }

  // Calculate consecutive attended days streak
  const streakDays = calculateStreak(recordList);

  return {
    totalScheduledHours,
    attendedHours,
    proxyHours,
    absentHours,
    exemptedHours,
    effectiveTotalHours,
    hourlyPercentage,

    totalClasses,
    attendedClasses,
    proxyClasses,
    absentClasses,
    exemptedClasses,
    effectiveTotalClasses,
    classPercentage,

    safeBunkHours,
    safeBunkClasses,
    requiredCatchUpHours,
    requiredCatchUpClasses,

    healthStatus,
    streakDays,
  };
}

/**
 * Calculates per-subject attendance breakdown (Scenario C)
 */
export function calculateSubjectBreakdown(
  subjects: Subject[],
  records: Record<string, AttendanceRecord>,
  settings: AppSettings,
  filterMonth?: string
): SubjectAttendanceStats[] {
  return subjects.map((sub) => {
    const stats = calculateAttendanceStats(records, settings, sub.id, filterMonth);
    const subTarget = sub.targetPercentage || settings.targetAttendancePercent || 75;

    let status: 'safe' | 'warning' | 'critical' = 'safe';
    if (stats.hourlyPercentage < settings.criticalThresholdPercent) {
      status = 'critical';
    } else if (stats.hourlyPercentage < subTarget) {
      status = 'warning';
    }

    return {
      subject: sub,
      totalHours: stats.totalScheduledHours,
      attendedHours: stats.attendedHours + stats.proxyHours,
      proxyHours: stats.proxyHours,
      absentHours: stats.absentHours,
      exemptedHours: stats.exemptedHours,
      effectiveTotalHours: stats.effectiveTotalHours,
      hourlyPercentage: stats.hourlyPercentage,
      classPercentage: stats.classPercentage,
      totalClasses: stats.totalClasses,
      attendedClasses: stats.attendedClasses + stats.proxyClasses,
      safeBunkHours: stats.safeBunkHours,
      requiredCatchUpHours: stats.requiredCatchUpHours,
      status,
    };
  });
}

function calculateStreak(records: AttendanceRecord[]): number {
  if (records.length === 0) return 0;
  // Group by date
  const dateMap = new Map<string, AttendanceRecord[]>();
  records.forEach((r) => {
    const list = dateMap.get(r.date) || [];
    list.push(r);
    dateMap.set(r.date, list);
  });

  const sortedDates = Array.from(dateMap.keys()).sort().reverse();
  let streak = 0;

  for (const d of sortedDates) {
    const dayRecords = dateMap.get(d) || [];
    // If every non-exempted record on this day is attended/proxy/exam
    const nonExempt = dayRecords.filter((r) => r.status !== 'exempted');
    if (nonExempt.length > 0) {
      const allPresent = nonExempt.every((r) => r.status === 'attended' || r.status === 'proxy' || r.status === 'exam');
      if (allPresent) {
        streak++;
      } else {
        break;
      }
    }
  }

  return streak;
}
