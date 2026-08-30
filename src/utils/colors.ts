import { DISTINCT_SUBJECT_COLORS, SubjectColor } from '../config/settings';
import { Subject } from '../types';

export function getSubjectColorById(colorId: string): SubjectColor {
  const found = DISTINCT_SUBJECT_COLORS.find((c) => c.id === colorId);
  return found || DISTINCT_SUBJECT_COLORS[0];
}

export function getOccupiedColorIds(subjects: Subject[], excludeSubjectId?: string): string[] {
  return subjects
    .filter((s) => !excludeSubjectId || s.id !== excludeSubjectId)
    .map((s) => s.colorId);
}

export function getAvailableColors(subjects: Subject[], excludeSubjectId?: string): SubjectColor[] {
  const occupied = new Set(getOccupiedColorIds(subjects, excludeSubjectId));
  return DISTINCT_SUBJECT_COLORS.filter((c) => !occupied.has(c.id));
}

export function getAutoAssignedColor(subjects: Subject[], excludeSubjectId?: string): SubjectColor {
  const available = getAvailableColors(subjects, excludeSubjectId);
  if (available.length > 0) {
    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  }
  const index = subjects.length % DISTINCT_SUBJECT_COLORS.length;
  return DISTINCT_SUBJECT_COLORS[index];
}
