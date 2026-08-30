import { Subject, TimeTableSlot, AttendanceRecord } from '../types';
import { SubjectColor } from '../config/settings';
import { getSubjectColorById } from './colors';
import { parseIsoDate } from './dateUtils';

export interface MaterializedSlot {
  slotId: string;
  dateStr: string;
  dayOfWeek: number;
  subjectId: string;
  subject: Subject;
  color: SubjectColor;
  startTime: string;
  endTime: string;
  timeRangeFormatted: string;
  durationHours: number;
  order: number;
  record?: AttendanceRecord;
  aspectRatioClass: string;
  minHeightPx: number;
}

export function computeEndTime(startTime: string, durationHours: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + Math.round(durationHours * 60);
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}

export function formatTo12Hour(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function formatTimeRange(startTime: string, durationHours: number): string {
  const endTime = computeEndTime(startTime, durationHours);
  const start12 = formatTo12Hour(startTime);
  const end12 = formatTo12Hour(endTime);
  return `${start12} – ${end12}`;
}

export function getDurationRatioMetrics(durationHours: number): {
  ratioLabel: string;
  minHeightPx: number;
  durationBadgeText: string;
} {
  const clamped = Math.min(6, Math.max(1, Math.round(durationHours)));
  const baseHeight = 110;
  const minHeightPx = baseHeight + (clamped - 1) * 75;

  return {
    ratioLabel: `1:${clamped}`,
    minHeightPx,
    durationBadgeText: clamped === 1 ? '1 hr' : `${clamped} hrs`,
  };
}

export function materializeDaySchedule(
  dateStr: string,
  timetable: TimeTableSlot[],
  records: Record<string, AttendanceRecord>,
  subjects: Subject[]
): MaterializedSlot[] {
  const date = parseIsoDate(dateStr);
  const dayOfWeek = date.getDay();

  const daySlots = timetable.filter((slot) => slot.dayOfWeek === dayOfWeek);

  const sorted = [...daySlots].sort((a, b) => {
    if (a.startTime !== b.startTime) {
      return a.startTime.localeCompare(b.startTime);
    }
    return a.order - b.order;
  });

  const subjectMap = new Map<string, Subject>();
  subjects.forEach((s) => subjectMap.set(s.id, s));

  return sorted.map((slot) => {
    const subject = subjectMap.get(slot.subjectId) || {
      id: slot.subjectId,
      name: 'Unknown Subject',
      colorId: 'coral',
      createdAt: Date.now(),
    };

    const color = getSubjectColorById(subject.colorId);
    const endTime = computeEndTime(slot.startTime, slot.durationHours);
    const timeRangeFormatted = formatTimeRange(slot.startTime, slot.durationHours);
    const ratioMetrics = getDurationRatioMetrics(slot.durationHours);
    const record = records[`${dateStr}_${slot.id}`];

    return {
      slotId: slot.id,
      dateStr,
      dayOfWeek,
      subjectId: slot.subjectId,
      subject,
      color,
      startTime: slot.startTime,
      endTime,
      timeRangeFormatted,
      durationHours: slot.durationHours,
      order: slot.order,
      record,
      aspectRatioClass: ratioMetrics.ratioLabel,
      minHeightPx: ratioMetrics.minHeightPx,
    };
  });
}
