import React, { useState, useMemo } from 'react';
import { useApp } from '../../store/AppContext';
import { calculateAttendanceStats, calculateSubjectBreakdown } from '../../utils/attendanceEngine';
import { CalculationMode } from '../../config/settings';
import {
  AlertTriangle,
  BookOpen,
  ShieldCheck,
  Zap,
  Flame,
} from 'lucide-react';

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

  // Compute radial progress stroke
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
      {/* 1. Hero Radial Dial & Attendance Health Card */}
      <div className="brutal-card p-5 bg-zinc-950/95 border-2 border-zinc-800 space-y-4 relative overflow-hidden">
        {/* Scenario Toggle Switcher */}
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

        {/* Hero Radial Gauge & Core Metric */}
        <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
          {/* SVG Circular Dial */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-zinc-800"
                strokeWidth="12"
                fill="none"
              />
              {/* Target Threshold Indicator Tick */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#3F3F46"
                strokeWidth="12"
                strokeDasharray={`2 ${circumference / 20}`}
                fill="none"
              />
              {/* Active Animated Progress */}
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

            {/* Center Percentage Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
              <span className="text-3xl font-black text-white tracking-tighter">
                {displayPercentage}%
              </span>
              <span className="text-[10px] uppercase font-bold text-zinc-400">
                {scenarioMode === 'hourly' ? 'Hourly' : 'Classes'}
              </span>
            </div>
          </div>

          {/* Quick Health Summary & Streak */}
          <div className="space-y-2 text-center sm:text-left font-mono">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 border text-xs font-black uppercase mb-1"
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
                College Target: <strong className="text-white">{target}%</strong>
              </p>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-xs">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Flame size={14} className="fill-amber-400" />
                <span>{stats.streakDays} Day Streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Gamified Safe-to-Bunk & Catch-Up Intelligence Card */}
        <div className="pt-2 border-t border-zinc-850">
          {isAboveTarget ? (
            <div className="p-3 bg-emerald-950/60 border-2 border-emerald-500/80 font-mono space-y-1">
              <div className="flex items-center justify-between text-emerald-400 font-black text-xs uppercase">
                <span className="flex items-center gap-1.5">
                  <Zap size={14} className="fill-emerald-400" />
                  Bunk Budget Available!
                </span>
                <span className="text-sm font-black">
                  +{scenarioMode === 'hourly' ? stats.safeBunkHours : stats.safeBunkClasses}{' '}
                  {scenarioMode === 'hourly' ? 'HRS' : 'CLASSES'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-300">
                You can safely skip up to{' '}
                <strong className="text-emerald-300">
                  {scenarioMode === 'hourly' ? `${stats.safeBunkHours} hours` : `${stats.safeBunkClasses} classes`}
                </strong>{' '}
                and still remain strictly above your {target}% target.
              </p>
            </div>
          ) : (
            <div className="p-3 bg-rose-950/60 border-2 border-rose-500/80 font-mono space-y-1">
              <div className="flex items-center justify-between text-rose-400 font-black text-xs uppercase">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle size={14} />
                  Attendance Recovery Needed!
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
                consecutively without bunking to bring your record back above {target}%.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Detailed Metrics Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
        <div className="brutal-card p-3 bg-zinc-950 border-2 border-zinc-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Attended</span>
          <div className="text-lg font-black text-emerald-400">
            {stats.attendedHours}h <span className="text-xs text-zinc-500 font-normal">({stats.attendedClasses} cls)</span>
          </div>
        </div>

        <div className="brutal-card p-3 bg-zinc-950 border-2 border-zinc-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Proxies</span>
          <div className="text-lg font-black text-sky-400">
            {stats.proxyHours}h <span className="text-xs text-zinc-500 font-normal">({stats.proxyClasses} cls)</span>
          </div>
        </div>

        <div className="brutal-card p-3 bg-zinc-950 border-2 border-zinc-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Bunked / Absent</span>
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
            Subject-Wise Compliance ({subjects.length})
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
            const subTarget = sub.targetPercentage || target;
            const isSubSafe = subPct >= subTarget;

            return (
              <div
                key={sub.id}
                className="brutal-card p-3 bg-zinc-950 border-2 border-zinc-800 hover:border-zinc-700 transition-all space-y-2 relative overflow-hidden"
              >
                {/* Subject Color Line */}
                <div
                  className="absolute top-0 bottom-0 left-0 w-2"
                  style={{ backgroundColor: sub.colorId }}
                />

                <div className="pl-2 space-y-1.5 font-mono">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-zinc-400">
                        [{sub.code || 'SUB'}]
                      </span>
                      <h4 className="font-bold text-sm text-white">{sub.name}</h4>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-sm font-black ${
                          isSubSafe ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {subPct}%
                      </span>
                    </div>
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

                  {/* Bottom Stats & Bunk Capacity per Subject */}
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-0.5">
                    <span>
                      {subStat.attendedHours}h of {subStat.effectiveTotalHours}h attended
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
