import React, { useState, useMemo } from 'react';
import { useApp } from '../../store/AppContext';
import { calculateAttendanceStats, calculateSubjectBreakdown } from '../../utils/attendanceEngine';
import { CalculationMode } from '../../config/settings';

export const AnalyticsView: React.FC = () => {
  const { subjects, records, settings } = useApp();
  const [scenarioMode, setScenarioMode] = useState<CalculationMode>(
    settings.primaryCalculationMode || 'hourly'
  );

  const stats = useMemo(() => {
    return calculateAttendanceStats(records, settings);
  }, [records, settings]);

  const subjectStats = useMemo(() => {
    return calculateSubjectBreakdown(subjects, records, settings);
  }, [subjects, records, settings]);

  const displayPercentage =
    scenarioMode === 'lecture_count' ? stats.classPercentage : stats.hourlyPercentage;

  const target = settings.targetAttendancePercent || 75;
  const isAboveTarget = displayPercentage >= target;

  return (
    <div className="space-y-4 font-mono">
      {/* 1. Giant Minimal Percentage Hero */}
      <div className="brutal-card p-4 bg-[#0D0D10] border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-850 pb-2">
          <span>Overall Attendance</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setScenarioMode('hourly')}
              className={`px-2 py-0.5 transition-all ${
                scenarioMode === 'hourly'
                  ? 'bg-white text-black font-bold'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              Hourly
            </button>
            <button
              type="button"
              onClick={() => setScenarioMode('lecture_count')}
              className={`px-2 py-0.5 transition-all ${
                scenarioMode === 'lecture_count'
                  ? 'bg-white text-black font-bold'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              Classes
            </button>
          </div>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <div className="text-4xl font-black text-white tracking-tighter">
            {displayPercentage}%
          </div>
          <span className="text-xs text-zinc-400">
            Target: <strong className="text-white">{target}%</strong>
          </span>
        </div>

        {/* Bunk Budget One-Liner */}
        <div className="pt-2 border-t border-zinc-850">
          {isAboveTarget ? (
            <div className="text-xs text-emerald-400 font-bold">
              +{scenarioMode === 'hourly' ? `${stats.safeBunkHours}h` : `${stats.safeBunkClasses} classes`} safe to bunk
            </div>
          ) : (
            <div className="text-xs text-rose-400 font-bold">
              Attend +{scenarioMode === 'hourly' ? `${stats.requiredCatchUpHours}h` : `${stats.requiredCatchUpClasses} classes`} to reach {target}%
            </div>
          )}
        </div>
      </div>

      {/* 2. Three Metric Tiles */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="brutal-card p-2 bg-[#0D0D10] border border-zinc-800">
          <span className="text-[9px] uppercase text-zinc-500 block">Attended</span>
          <span className="text-sm font-bold text-emerald-400">{stats.attendedHours}h</span>
        </div>

        <div className="brutal-card p-2 bg-[#0D0D10] border border-zinc-800">
          <span className="text-[9px] uppercase text-zinc-500 block">Bunked</span>
          <span className="text-sm font-bold text-rose-400">{stats.absentHours}h</span>
        </div>

        <div className="brutal-card p-2 bg-[#0D0D10] border border-zinc-800">
          <span className="text-[9px] uppercase text-zinc-500 block">Not Counted</span>
          <span className="text-sm font-bold text-zinc-400">{stats.exemptedHours}h</span>
        </div>
      </div>

      {/* 3. Subject Compliance List */}
      <div className="space-y-2 pt-2">
        <span className="text-xs uppercase font-bold text-zinc-400 block tracking-wider">
          Subject Breakdown ({subjects.length})
        </span>

        {subjectStats.length > 0 ? (
          <div className="space-y-2">
            {subjectStats.map((subStat) => {
              const sub = subStat.subject;
              const subPct =
                scenarioMode === 'lecture_count'
                  ? subStat.classPercentage
                  : subStat.hourlyPercentage;
              const isSubSafe = subPct >= target;

              return (
                <div
                  key={sub.id}
                  className="brutal-card p-3 bg-[#0D0D10] border border-zinc-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white truncate max-w-[200px]">
                      {sub.name}
                    </span>
                    <span
                      className={`font-black ${
                        isSubSafe ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {subPct}%
                    </span>
                  </div>

                  {/* Slim Progress Bar */}
                  <div className="h-1 bg-zinc-900 overflow-hidden">
                    <div
                      className={`h-full ${
                        isSubSafe ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, subPct)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span>
                      {subStat.attendedHours}h / {subStat.effectiveTotalHours}h
                    </span>
                    <span>
                      {isSubSafe
                        ? `+${subStat.safeBunkHours}h safe`
                        : `+${subStat.requiredCatchUpHours}h needed`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-zinc-500 text-xs">
            No subjects to track.
          </div>
        )}
      </div>
    </div>
  );
};
