import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, Subject, TimeTableSlot, AttendanceRecord } from '../types';
import { AppSettings, AttendanceStatusType } from '../config/settings';
import { loadAppState, saveAppState, getInitialState } from '../utils/storage';
import { getAutoAssignedColor } from '../utils/colors';

interface AppContextType {
  state: AppState;
  subjects: Subject[];
  timetable: TimeTableSlot[];
  records: Record<string, AttendanceRecord>;
  settings: AppSettings;
  
  // Subject Actions
  addSubject: (data: { name: string; colorId?: string }) => Subject;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string, cascade?: boolean) => void;
  getSubjectById: (id: string) => Subject | undefined;

  // Timetable Actions
  addSlot: (slot: Omit<TimeTableSlot, 'id'>) => TimeTableSlot;
  updateSlot: (id: string, updates: Partial<TimeTableSlot>) => void;
  deleteSlot: (id: string) => void;

  // Attendance Actions
  markAttendance: (date: string, slotId: string, subjectId: string, status: AttendanceStatusType, durationHours: number) => void;
  getRecordForSlot: (date: string, slotId: string) => AttendanceRecord | undefined;

  // Settings & State Actions
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetAllData: () => void;
  importState: (newState: AppState) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(loadAppState);

  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Add Subject with Auto-Color fallback
  const addSubject = useCallback((data: { name: string; colorId?: string }): Subject => {
    let finalColorId = data.colorId;
    if (!finalColorId) {
      finalColorId = getAutoAssignedColor(state.subjects).id;
    }

    const newSubject: Subject = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: data.name.trim(),
      colorId: finalColorId,
      createdAt: Date.now(),
    };

    setState((prev) => ({
      ...prev,
      subjects: [...prev.subjects, newSubject],
    }));

    return newSubject;
  }, [state.subjects]);

  const updateSubject = useCallback((id: string, updates: Partial<Subject>) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  }, []);

  const deleteSubject = useCallback((id: string, cascade = true) => {
    setState((prev) => {
      const newSubjects = prev.subjects.filter((s) => s.id !== id);
      let newTimetable = prev.timetable;
      let newRecords = { ...prev.records };

      if (cascade) {
        newTimetable = prev.timetable.filter((slot) => slot.subjectId !== id);
        Object.keys(newRecords).forEach((key) => {
          if (newRecords[key].subjectId === id) {
            delete newRecords[key];
          }
        });
      }

      return {
        ...prev,
        subjects: newSubjects,
        timetable: newTimetable,
        records: newRecords,
      };
    });
  }, []);

  const getSubjectById = useCallback((id: string) => {
    return state.subjects.find((s) => s.id === id);
  }, [state.subjects]);

  const addSlot = useCallback((slot: Omit<TimeTableSlot, 'id'>): TimeTableSlot => {
    const newSlot: TimeTableSlot = {
      ...slot,
      id: `slot_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };

    setState((prev) => ({
      ...prev,
      timetable: [...prev.timetable, newSlot],
    }));

    return newSlot;
  }, []);

  const updateSlot = useCallback((id: string, updates: Partial<TimeTableSlot>) => {
    setState((prev) => ({
      ...prev,
      timetable: prev.timetable.map((slot) => (slot.id === id ? { ...slot, ...updates } : slot)),
    }));
  }, []);

  const deleteSlot = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      timetable: prev.timetable.filter((slot) => slot.id !== id),
    }));
  }, []);

  const markAttendance = useCallback((
    date: string,
    slotId: string,
    subjectId: string,
    status: AttendanceStatusType,
    durationHours: number
  ) => {
    const key = `${date}_${slotId}`;
    const record: AttendanceRecord = {
      id: key,
      date,
      slotId,
      subjectId,
      status,
      durationHours,
      timestamp: Date.now(),
    };

    setState((prev) => ({
      ...prev,
      records: {
        ...prev.records,
        [key]: record,
      },
    }));
  }, []);

  const getRecordForSlot = useCallback((date: string, slotId: string) => {
    return state.records[`${date}_${slotId}`];
  }, [state.records]);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...updates,
      },
    }));
  }, []);

  const resetAllData = useCallback(() => {
    const fresh = getInitialState();
    setState(fresh);
    saveAppState(fresh);
  }, []);

  const importState = useCallback((newState: AppState) => {
    setState(newState);
    saveAppState(newState);
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        subjects: state.subjects,
        timetable: state.timetable,
        records: state.records,
        settings: state.settings,
        addSubject,
        updateSubject,
        deleteSubject,
        getSubjectById,
        addSlot,
        updateSlot,
        deleteSlot,
        markAttendance,
        getRecordForSlot,
        updateSettings,
        resetAllData,
        importState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
