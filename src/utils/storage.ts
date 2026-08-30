import { AppState } from '../types';
import { DEFAULT_SETTINGS } from '../config/settings';

const STORAGE_KEY = 'bunkit_state_v1';

export const getInitialState = (): AppState => {
  return {
    subjects: [],
    timetable: [],
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
      subjects: parsed.subjects || [],
      timetable: parsed.timetable || [],
      records: parsed.records || {},
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
