import { useState } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { SubjectManagerView } from './components/subjects/SubjectManagerView';
import { TimetableMakerView } from './components/timetable/TimetableMakerView';
import { Calendar, BarChart3, Clock, Settings, BookOpen } from 'lucide-react';

function MainApp() {
  const { settings } = useApp();
  const [activeTab, setActiveTab] = useState<'today' | 'timetable' | 'subjects' | 'analytics' | 'settings'>('subjects');

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F8FAFC] flex flex-col font-sans pb-24 selection:bg-emerald-500 selection:text-black">
      {/* Top Sticky Header */}
      <header className="border-b-2 border-zinc-800 bg-[#0E0E10] px-4 py-3 sticky top-0 z-40 flex items-center justify-between shadow-[0_4px_0_#000000]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-500 border-2 border-black flex items-center justify-center font-mono font-black text-black text-lg shadow-[2px_2px_0_#000]">
            B
          </div>
          <div>
            <h1 className="font-mono font-black tracking-wider text-sm text-white uppercase flex items-center gap-1.5">
              BunkIt <span className="text-[10px] text-emerald-400 bg-emerald-950/90 px-1.5 py-0.2 border border-emerald-500/40">v1.1</span>
            </h1>
            <p className="text-[10px] text-zinc-400 font-mono tracking-tight">ATTENDANCE INTELLIGENCE</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="font-mono text-xs px-2.5 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>TARGET: <strong className="text-white">{settings.targetAttendancePercent}%</strong></span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-4">
        {activeTab === 'subjects' && <SubjectManagerView />}

        {activeTab === 'today' && (
          <div className="space-y-4">
            <div className="brutal-card p-4 bg-zinc-950/90 border-2 border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-zinc-400 uppercase">Today's Lecture Queue</span>
                <span className="brutal-badge bg-emerald-950 text-emerald-400 border-emerald-500">TASK 7 PREVIEW</span>
              </div>
              <p className="text-xs text-zinc-300">
                Staggered list of today&apos;s lectures and direct single-click attendance marking will be fully interactive in Task 5 &amp; 7.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'timetable' && <TimetableMakerView />}

        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="brutal-card p-4 bg-zinc-950/90 border-2 border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-zinc-400 uppercase">Bunk Intelligence &amp; Gauges</span>
                <span className="brutal-badge bg-amber-950 text-amber-400 border-amber-500">TASK 6 &amp; 8</span>
              </div>
              <p className="text-xs text-zinc-300">
                Multi-scenario calculations (Hourly Priority vs Class Count vs Subject-wise) and Safe-to-Bunk meters will be populated here.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="brutal-card p-4 bg-zinc-950/90 border-2 border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-zinc-400 uppercase">Settings &amp; Data Hub</span>
                <span className="brutal-badge bg-zinc-900 text-zinc-300 border-zinc-700">TASK 9</span>
              </div>
              <p className="text-xs text-zinc-300">
                All settings parameters from <code className="text-emerald-400">settings.ts</code> and 1-click JSON backup/restore.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Floating Brutalist Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0E0E10]/95 border-t-2 border-zinc-800 p-2 backdrop-blur-none">
        <div className="max-w-md mx-auto flex items-center justify-between px-1">
          {[
            { id: 'today', label: 'Today', icon: Calendar },
            { id: 'timetable', label: 'Timetable', icon: Clock },
            { id: 'subjects', label: 'Subjects', icon: BookOpen },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center gap-1 py-1.5 px-2.5 font-mono text-[9px] uppercase font-extrabold transition-all border-2 ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-950/90 text-emerald-400 shadow-[2px_2px_0_#000] -translate-y-0.5'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
