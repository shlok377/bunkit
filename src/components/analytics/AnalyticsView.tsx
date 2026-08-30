import React, { useState, useMemo } from 'react';
import { useApp } from '../../store/AppContext';
import { calculateAttendanceStats, calculateSubjectBreakdown } from '../../utils/attendanceEngine';
import { CalculationMode } from '../../config/settings';
import { AlertTriangle, BookOpen, ShieldCheck, Zap } from 'lucide-react';

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

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, displayPercentage) / 100) * circumference;

  const healthColor =
    displayPercentage >= target
      ? '#10B981'
      : displayPercentage >= settings.warningThresholdPercent
      ? '#F59E0B'
      : '#EF4444';

  return (
    <div className="space-y-4">
      {/* 1. Hero Radial Dial */}
      <div className="brutal-card p-5 bg-zinc-950/95 border-2 border-zinc-800 space-y-4 relative overflow-hidden">
        {/* Scenario Toggle */}
        <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
          <span className="font-mono text-xs uppercase font-bold text-zinc-400">
            Calculation Scenario:
          </span>
          <div className="flex items-center gap-1 bg-zinc-900 p-0.5 border border-zinc-700 font-mono text-[10px]">
            <button
              type="button"
              onClick={() => setScenarioMode('hourly')}
              className={`px-2.5 py-1 font-bold transition-all ${
                scenarioMode === 'hourly'
                  ? 'bg-emerald-500 text-black shadow-[1px_1px_0_#000]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Hourly (Priority)
            </button>
            <button
              type="button"
              onClick={() => setScenarioMode('lecture_count')}
              className={`px-2.5 py-1 font-bold transition-all ${
                scenarioMode === 'lecture_count'
                  ? 'bg-emerald-500 text-black shadow-[1px_1px_0_#000]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Class Count
            </button>
          </div>
        </div>

        {/* Radial Dial & Target Display */}
        <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-zinc-800"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={healthColor}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="square"
                fill="none"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
              <span className="text-3xl font-black text-white tracking-tighter">
                {displayPercentage}%
              </span>
              <span className="text-[10px] uppercase font-bold text-zinc-400">
                {scenarioMode === 'hourly' ? 'Hourly' : 'Classes'}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-center sm:text-left font-mono">
            <div
              className="inline-flex items-center gap-1.5 px-2 py-0.5 border text-xs font-black uppercase"
              style={{
                borderColor: healthColor,
                backgroundColor: `${healthColor}20`,
                color: healthColor,
              }}
            >
              {isAboveTarget ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
              <span>{isAboveTarget ? 'Safe Zone' : 'Danger Zone'}</span>
            </div>
            <p className="text-xs text-zinc-400">
              Target: <strong className="text-white">{target}%</strong>
            </p>
          </div>
        </div>

        {/* 2. Safe-to-Bunk & Catch-Up Card */}
        <div className="pt-2 border-t border-zinc-850">
          {isAboveTarget ? (
            <div className="p-3 bg-emerald-950/60 border-2 border-emerald-500/80 font-mono space-y-1">
              <div className="flex items-center justify-between text-emerald-400 font-black text-xs uppercase">
                <span className="flex items-center gap-1.5">
                  <Zap size={14} className="fill-emerald-400" />
                  Bunk Budget Available
                </span>
                <span className="text-sm font-black">
                  +{scenarioMode === 'hourly' ? stats.safeBunkHours : stats.safeBunkClasses}{' '}
                  {scenarioMode === 'hourly' ? 'HRS' : 'CLASSES'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-300">
                You can safely bunk up to{' '}
                <strong className="text-emerald-300">
                  {scenarioMode === 'hourly' ? `${stats.safeBunkHours} hours` : `${stats.safeBunkClasses} classes`}
                </strong>{' '}
                while staying above {target}%.
              </p>
            </div>
          ) : (
            <div className="p-3 bg-rose-950/60 border-2 border-rose-500/80 font-mono space-y-1">
              <div className="flex items-center justify-between text-rose-400 font-black text-xs uppercase">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle size={14} />
                  Attendance Recovery Needed
                </span>
                <span className="text-sm font-black">
                  +{scenarioMode === 'hourly' ? stats.requiredCatchUpHours : stats.requiredCatchUpClasses}{' '}
                  {scenarioMode === 'hourly' ? 'HRS' : 'CLASSES'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-300">
                Attend the next{' '}
                <strong className="text-rose-300">
                  {scenarioMode === 'hourly' ? `${stats.requiredCatchUpHours} hours` : `${stats.requiredCatchUpClasses} classes`}
                </strong>{' '}
                consecutively to reach {target}%.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Summary Tiles */}
      <div className="grid grid-cols-3 gap-2 font-mono text-xs">
        <div className="brutal-card p-3 bg-zinc-950 border-2 border-zinc-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Attended</span>
          <div className="text-lg font-black text-emerald-400">
            {stats.attendedHours}h <span className="text-xs text-zinc-500 font-normal">({stats.attendedClasses} cls)</span>
          </div>
        </div>

        <div className="brutal-card p-3 bg-zinc-950 border-2 border-zinc-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Bunked</span>
          <div className="text-lg font-black text-rose-400">
            {stats.absentHours}h <span className="text-xs text-zinc-500 font-normal">({stats.absentClasses} cls)</span>
          </div>
        </div>

        <div className="brutal-card p-3 bg-zinc-950 border-2 border-zinc-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Not Counted</span>
          <div className="text-lg font-black text-slate-400">
            {stats.exemptedHours}h <span className="text-xs text-zinc-500 font-normal">({stats.exemptedClasses} off)</span>
          </div>
        </div>
      </div>

      {/* 4. Subject-Wise Compliance Breakdown (Scenario C) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="font-bold uppercase text-zinc-300 flex items-center gap-1.5">
            <BookOpen size={14} className="text-emerald-400" />
            Subject-Wise Attendance ({subjects.length})
          </span>
          <span className="text-[11px] text-zinc-500">Scenario C</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
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
                className="brutal-card p-3 bg-zinc-950 border-2 border-zinc-800 space-y-2 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 bottom-0 left-0 w-2"
                  style={{ backgroundColor: sub.colorId }}
                />

                <div className="pl-2 space-y-1.5 font-mono">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white">{sub.name}</h4>
                    <span
                      className={`text-sm font-black ${
                        isSubSafe ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {subPct}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 bg-zinc-900 border border-black overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isSubSafe ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, subPct)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-0.5">
                    <span>
                      {subStat.attendedHours}h of {subStat.effectiveTotalHours}h
                    </span>

                    <span>
                      {isSubSafe ? (
                        <span className="text-emerald-400 font-bold">
                          Safe to bunk: {subStat.safeBunkHours}h
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold">
                          Need: +{subStat.requiredCatchUpHours}h
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
