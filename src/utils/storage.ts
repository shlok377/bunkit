import { AppState, Subject, TimeTableSlot } from '../types';
import { DEFAULT_SETTINGS } from '../config/settings';

const STORAGE_KEY = 'bunkit_state_v1';

export const INITIAL_SAMPLE_SUBJECTS: Subject[] = [
  { id: 'sub_ds', name: 'Data Structures & Algo', code: 'CS301', colorId: 'coral', moodTag: 'fun', createdAt: Date.now() },
  { id: 'sub_ml', name: 'Machine Learning', code: 'CS302', colorId: 'lime', moodTag: 'fun', createdAt: Date.now() },
  { id: 'sub_os', name: 'Operating Systems', code: 'CS303', colorId: 'cyan', moodTag: 'ok_ok', createdAt: Date.now() },
  { id: 'sub_cn', name: 'Computer Networks', code: 'CS304', colorId: 'violet', moodTag: 'hate', createdAt: Date.now() },
  { id: 'sub_dm', name: 'Discrete Mathematics', code: 'MA301', colorId: 'amber', moodTag: 'ok_ok', createdAt: Date.now() },
];

export const INITIAL_SAMPLE_TIMETABLE: TimeTableSlot[] = [
  // Monday
  { id: 'slot_mon_1', dayOfWeek: 1, subjectId: 'sub_ds', startTime: '09:00', durationHours: 1, room: 'Room 302', order: 1 },
  { id: 'slot_mon_2', dayOfWeek: 1, subjectId: 'sub_ml', startTime: '10:00', durationHours: 2, room: 'AI Lab 2', order: 2 }, // 2 hr lab
  { id: 'slot_mon_3', dayOfWeek: 1, subjectId: 'sub_os', startTime: '13:00', durationHours: 1, room: 'Room 302', order: 3 },
  { id: 'slot_mon_4', dayOfWeek: 1, subjectId: 'sub_cn', startTime: '14:00', durationHours: 1, room: 'Room 304', order: 4 },

  // Tuesday
  { id: 'slot_tue_1', dayOfWeek: 2, subjectId: 'sub_dm', startTime: '09:00', durationHours: 1, room: 'Math Hall', order: 1 },
  { id: 'slot_tue_2', dayOfWeek: 2, subjectId: 'sub_os', startTime: '10:00', durationHours: 2, room: 'OS Lab', order: 2 },
  { id: 'slot_tue_3', dayOfWeek: 2, subjectId: 'sub_ds', startTime: '13:00', durationHours: 1, room: 'Room 302', order: 3 },

  // Wednesday
  { id: 'slot_wed_1', dayOfWeek: 3, subjectId: 'sub_ml', startTime: '09:00', durationHours: 1, room: 'Room 301', order: 1 },
  { id: 'slot_wed_2', dayOfWeek: 3, subjectId: 'sub_cn', startTime: '10:00', durationHours: 2, room: 'Net Lab', order: 2 },
  { id: 'slot_wed_3', dayOfWeek: 3, subjectId: 'sub_dm', startTime: '13:00', durationHours: 1, room: 'Math Hall', order: 3 },

  // Thursday
  { id: 'slot_thu_1', dayOfWeek: 4, subjectId: 'sub_ds', startTime: '09:00', durationHours: 3, room: 'Project Lab', order: 1 }, // 3 hr workshop
  { id: 'slot_thu_2', dayOfWeek: 4, subjectId: 'sub_os', startTime: '13:00', durationHours: 1, room: 'Room 302', order: 2 },

  // Friday
  { id: 'slot_fri_1', dayOfWeek: 5, subjectId: 'sub_ml', startTime: '09:00', durationHours: 1, room: 'Room 301', order: 1 },
  { id: 'slot_fri_2', dayOfWeek: 5, subjectId: 'sub_dm', startTime: '10:00', durationHours: 1, room: 'Math Hall', order: 2 },
  { id: 'slot_fri_3', dayOfWeek: 5, subjectId: 'sub_cn', startTime: '11:00', durationHours: 1, room: 'Room 304', order: 3 },
  { id: 'slot_fri_4', dayOfWeek: 5, subjectId: 'sub_ds', startTime: '13:00', durationHours: 1, room: 'Room 302', order: 4 },
];

export const getInitialState = (): AppState => {
  return {
    subjects: INITIAL_SAMPLE_SUBJECTS,
    timetable: INITIAL_SAMPLE_TIMETABLE,
    records: {},
    settings: DEFAULT_SETTINGS,
  };
};

export const loadAppState = (): AppState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialState();
      saveAppState(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as AppState;
    return {
      ...parsed,
      settings: {
        ...DEFAULT_SETTINGS,
        ...(parsed.settings || {}),
      },
    };
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return getInitialState();
  }
};

export const saveAppState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

export const exportStateAsJson = (state: AppState): string => {
  return JSON.stringify(state, null, 2);
};

export const importStateFromJson = (jsonStr: string): AppState => {
  const parsed = JSON.parse(jsonStr);
  if (!parsed.subjects || !parsed.timetable || !parsed.records) {
    throw new Error('Invalid BunkIt state JSON structure');
  }
  return {
    subjects: parsed.subjects,
    timetable: parsed.timetable,
    records: parsed.records,
    settings: {
      ...DEFAULT_SETTINGS,
      ...(parsed.settings || {}),
    },
  };
};
