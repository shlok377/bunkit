import { DISTINCT_SUBJECT_COLORS, SubjectColor } from '../config/settings';
import { Subject } from '../types';

/**
 * Returns a SubjectColor object by its ID, with safe fallback to the first color.
 */
export function getSubjectColorById(colorId: string): SubjectColor {
  const found = DISTINCT_SUBJECT_COLORS.find((c) => c.id === colorId);
  return found || DISTINCT_SUBJECT_COLORS[0];
}

/**
 * Returns the list of color IDs currently occupied by existing subjects.
 * Optionally excludes a subjectId (useful when editing an existing subject).
 */
export function getOccupiedColorIds(subjects: Subject[], excludeSubjectId?: string): string[] {
  return subjects
    .filter((s) => !excludeSubjectId || s.id !== excludeSubjectId)
    .map((s) => s.colorId);
}

/**
 * Returns an array of SubjectColor objects that are currently free / unassigned.
 */
export function getAvailableColors(subjects: Subject[], excludeSubjectId?: string): SubjectColor[] {
  const occupied = new Set(getOccupiedColorIds(subjects, excludeSubjectId));
  return DISTINCT_SUBJECT_COLORS.filter((c) => !occupied.has(c.id));
}

/**
 * Returns a random or first available unassigned color from the 15-distinct palette.
 * If all 15 colors are occupied (rare edge case of >15 subjects), wraps around.
 */
export function getAutoAssignedColor(subjects: Subject[], excludeSubjectId?: string): SubjectColor {
  const available = getAvailableColors(subjects, excludeSubjectId);
  if (available.length > 0) {
    // Pick a random available color from the free list
    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  }
  // Fallback if all 15 are in use
  const index = subjects.length % DISTINCT_SUBJECT_COLORS.length;
  return DISTINCT_SUBJECT_COLORS[index];
}
