import { useState } from 'react';
import { AppProvider } from './store/AppContext';
import { TodayView } from './components/today/TodayView';
import { TimetableMakerView } from './components/timetable/TimetableMakerView';
import { SubjectManagerView } from './components/subjects/SubjectManagerView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { Calendar, BarChart3, Clock, Settings, Layers } from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'today' | 'timetable' | 'subjects' | 'analytics' | 'settings'>('today');

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F8FAFC] flex flex-col font-sans pt-4 pb-24 selection:bg-emerald-500 selection:text-black">
      {/* Main Content View */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 space-y-4">
        {activeTab === 'today' && <TodayView />}
        {activeTab === 'timetable' && <TimetableMakerView />}
        {activeTab === 'subjects' && <SubjectManagerView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Floating Brutalist Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0E0E10]/95 border-t-2 border-zinc-800 p-2 backdrop-blur-none shadow-[0_-4px_10px_rgba(0,0,0,0.5)]">
        <div className="max-w-md mx-auto flex items-center justify-between px-1">
          {[
            { id: 'today', label: 'Today', icon: Calendar },
            { id: 'timetable', label: 'Timetable', icon: Clock },
            { id: 'subjects', label: 'Subjects', icon: Layers },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
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
