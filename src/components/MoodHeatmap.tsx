import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X, Calendar as CalendarIcon, Clock, MessageSquare } from 'lucide-react';

interface MoodEntry {
  id: string;
  mood: number;
  duration?: number; // Duration in seconds
  minutes?: number;  // Kept for backward compatibility
  note?: string;
  createdAt: any;
}

interface AggregatedDay {
  date: Date;
  dayKey: string;
  weightedMood: number | null;
  totalSeconds: number;
  count: number;
  sessions: MoodEntry[];
}

interface MoodHeatmapProps {
  moods: MoodEntry[];
  isLight: boolean;
  t: any;
  formatDayKey: (date: Date) => string;
  calendarMonth: Date;
}

export function MoodHeatmap({ moods, isLight, t, formatDayKey, calendarMonth }: MoodHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<AggregatedDay | null>(null);
  const [selectedDay, setSelectedDay] = useState<AggregatedDay | null>(null);
  const [localMonth, setLocalMonth] = useState<Date>(calendarMonth);

  useEffect(() => {
    setLocalMonth(calendarMonth);
  }, [calendarMonth]);

  const prevMonth = () => {
    setLocalMonth(new Date(localMonth.getFullYear(), localMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setLocalMonth(new Date(localMonth.getFullYear(), localMonth.getMonth() + 1, 1));
  };

  const aggregatedData = useMemo(() => {
    const currentMonth = localMonth.getMonth();
    const currentYear = localMonth.getFullYear();
    
    // Get first and last day of current month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    const data: Record<string, { totalWeighted: number; totalSeconds: number; count: number; sessions: MoodEntry[] }> = {};
    const days: AggregatedDay[] = [];
    
    // Initialize all days of the current month
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
      const date = new Date(currentYear, currentMonth, d);
      date.setHours(0, 0, 0, 0);
      const key = formatDayKey(date);
      data[key] = { totalWeighted: 0, totalSeconds: 0, count: 0, sessions: [] };
    }

    // Fill with actual mood data
    moods.forEach(mood => {
      const date = mood.createdAt?.toDate ? mood.createdAt.toDate() : new Date(mood.createdAt);
      const key = formatDayKey(date);
      if (data[key]) {
        // Use duration (seconds) if available, fallback to minutes * 60
        const durationSeconds = mood.duration || (mood.minutes ? Math.round(mood.minutes * 60) : 60);
        data[key].totalWeighted += mood.mood * durationSeconds;
        data[key].totalSeconds += durationSeconds;
        data[key].count += 1;
        data[key].sessions.push(mood);
      }
    });

    // Convert to array
    Object.keys(data).sort().forEach(key => {
      const d = data[key];
      const [year, month, day] = key.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      
      days.push({
        date,
        dayKey: key,
        weightedMood: d.totalSeconds > 0 ? d.totalWeighted / d.totalSeconds : null,
        totalSeconds: d.totalSeconds,
        count: d.count,
        sessions: d.sessions.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
          return dateB - dateA;
        })
      });
    });

    return days;
  }, [moods, formatDayKey, localMonth]);

  // Group by weeks for the grid (7 columns)
  const calendarGrid = useMemo(() => {
    const result: (AggregatedDay | null)[][] = [];
    let currentWeek: (AggregatedDay | null)[] = [];
    
    // Pad the first week to start on Monday (index 1 in JS getDay, but we want Mon-Sun)
    // JS getDay: 0=Sun, 1=Mon, ..., 6=Sat
    // We want: 0=Mon, 1=Tue, ..., 6=Sun
    const firstDate = aggregatedData[0].date;
    let firstDayIdx = firstDate.getDay() - 1;
    if (firstDayIdx === -1) firstDayIdx = 6; // Sunday becomes 6
    
    for (let i = 0; i < firstDayIdx; i++) {
      currentWeek.push(null);
    }

    aggregatedData.forEach(day => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      result.push(currentWeek);
    }

    return result;
  }, [aggregatedData]);

  const getMoodColor = (mood: number | null) => {
    if (mood === null) return isLight ? 'bg-[#e5e5e7]' : 'bg-[#2a2a2a]';
    
    // Apple-style emotional gradient
    // Very stressed -> #3a1f1f
    // Neutral -> #2a2a2a
    // Calm -> #2f6f5e
    // Very calm -> #4fd1a5
    
    if (mood <= 1.5) return 'bg-[#3a1f1f]';
    if (mood <= 2.5) return 'bg-[#4a3a3a]'; // Intermediate
    if (mood <= 3.5) return 'bg-[#2a2a2a]';
    if (mood <= 4.5) return 'bg-[#2f6f5e]';
    return 'bg-[#4fd1a5]';
  };

  const getMoodLabel = (mood: number) => {
    if (mood <= 1.5) return t.veryStressed;
    if (mood <= 2.5) return t.slightlyStressed;
    if (mood <= 3.5) return t.neutral;
    if (mood <= 4.5) return t.relaxed;
    return t.veryCalm;
  };

  const weekdays = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];

  return (
    <div className="flex flex-col w-full">
      <div className="month-nav-row flex items-center justify-between mb-4 px-1">
        <h2 className={`card-title text-[18px] m-0 ${isLight ? 'text-gray-900' : 'text-[#e8e4dc]'}`}>{t.moodOverTime}</h2>
        <div className={`flex items-center gap-4 text-[13px] ${isLight ? 'text-gray-500' : 'text-[#888]'}`}>
          <button onClick={prevMonth} className={`hover:accent-text p-1 transition-colors ${isLight ? 'text-gray-400' : 'text-gray-500'}`}>‹</button>
          <span className="font-sans uppercase tracking-wider min-w-[120px] text-center">
            {t.months[localMonth.getMonth()]} {localMonth.getFullYear()}
          </span>
          <button onClick={nextMonth} className={`hover:accent-text p-1 transition-colors ${isLight ? 'text-gray-400' : 'text-gray-500'}`}>›</button>
        </div>
      </div>

      <div className="month-days-grid grid grid-cols-7 gap-1.5 mb-4 px-[0.1rem] max-w-[320px] md:max-w-none mx-auto w-full">
        {/* Weekday Labels */}
        {weekdays.map((day, i) => (
          <div key={i} className={`text-center text-[10px] font-bold uppercase tracking-tighter mb-1 ${isLight ? 'text-gray-400' : 'text-[#555]'}`}>
            {day}
          </div>
        ))}

        {/* Calendar Grid Cells */}
        {calendarGrid.flat().map((day, idx) => (
          <div key={idx} className="w-full relative pt-[100%]">
            {day ? (
              <div className="absolute inset-0 group outline-none" tabIndex={0}>
                <motion.button
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  onClick={() => setSelectedDay(day)}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`w-full h-full rounded-[4px] transition-all duration-300 ${getMoodColor(day.weightedMood)} ${day.weightedMood !== null ? 'cursor-pointer hover:shadow-[0_0_15px_rgba(79,209,165,0.3)]' : 'cursor-default'}`}
                />
                  
                  {/* Tooltip inside the cell container to match App.tsx logic */}
                  <AnimatePresence>
                    {hoveredDay === day && day.weightedMood !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none p-2.5 rounded-xl shadow-2xl border text-[11px] whitespace-nowrap backdrop-blur-md ${isLight ? 'bg-white/90 border-gray-100 text-gray-800' : 'bg-[#0b0b0c]/90 border-[#333] text-[#e8e4dc]'}`}
                      >
                        <div className="font-bold mb-1 opacity-60">
                          {day.date.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <div>{t.avgMood}: <span className="accent-text font-bold">{day.weightedMood.toFixed(1)}</span></div>
                          <div>{t.sessions}: <span className="font-medium">{day.count}</span></div>
                        </div>
                        <div className={`mt-1.5 pt-1.5 border-t ${isLight ? 'border-gray-100' : 'border-white/5'} font-medium text-[10px] uppercase tracking-wider opacity-80`}>
                          {getMoodLabel(day.weightedMood)}
                        </div>
                        {/* Arrow */}
                        <div className={`absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent ${isLight ? 'border-t-gray-100' : 'border-t-[#333]'}`}></div>
                        <div className={`absolute top-full left-1/2 -translate-x-1/2 border-[3px] border-transparent ${isLight ? 'border-t-white' : 'border-t-[#0b0b0c]'} -mt-[1px]`}></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="absolute inset-0" />
              )}
            </div>
          ))}
        </div>

      {/* Legend - Centered below */}
      <div className="flex flex-col items-center gap-2 mt-2">
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map(v => (
            <div key={v} className={`w-2.5 h-2.5 rounded-[2px] ${getMoodColor(v)}`} />
          ))}
        </div>
        <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.1em] text-gray-500 font-medium">
          <span>{t.veryStressed}</span>
          <span className="opacity-30">——</span>
          <span>{t.veryCalm}</span>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDay && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl ${isLight ? 'bg-[#f5f4f0]' : 'bg-[#0a0a0a]'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isLight ? 'bg-gray-100' : 'bg-white/5'}`}>
                      <CalendarIcon size={20} className="accent-text" />
                    </div>
                    <div>
                      <h3 className={`text-[18px] font-serif ${isLight ? 'text-gray-900' : 'text-[#e8e4dc]'}`}>
                        {selectedDay.date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                      </h3>
                      <p className="text-[11px] uppercase tracking-widest text-gray-500">{t.moodDetails}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedDay(null)}
                    className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-gray-100 text-gray-400' : 'hover:bg-white/5 text-gray-500'}`}
                  >
                    <X size={20} />
                  </button>
                </div>

                {selectedDay.weightedMood !== null ? (
                  <div className="flex flex-col gap-4">
                    <div className={`p-5 rounded-2xl flex items-center justify-between ${isLight ? 'bg-white border border-gray-100' : 'bg-white/5 border border-white/10'}`}>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">{t.avgMood}</p>
                        <p className="text-[24px] font-serif accent-text">{selectedDay.weightedMood.toFixed(1)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">{t.emotionalState}</p>
                        <p className={`text-[14px] font-medium ${isLight ? 'text-gray-700' : 'text-[#aaa]'}`}>{getMoodLabel(selectedDay.weightedMood)}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {selectedDay.sessions.map((session, idx) => (
                        <div key={session.id || idx} className={`p-4 rounded-xl flex flex-col gap-2 ${isLight ? 'bg-white/50 border border-gray-100' : 'bg-white/[0.02] border border-white/5'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getMoodColor(session.mood)}`} />
                              <span className={`text-[13px] font-medium ${isLight ? 'text-gray-800' : 'text-[#ccc]'}`}>{getMoodLabel(session.mood)}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>
                                  {session.duration 
                                    ? `${Math.floor(session.duration / 60)} min ${session.duration % 60}s`
                                    : `${Math.round(session.minutes || 0)} min`
                                  }
                                </span>
                              </div>
                              <span>{session.createdAt?.toDate ? session.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                          {session.note && (
                            <div className="flex items-start gap-2 mt-1">
                              <MessageSquare size={12} className="text-gray-600 mt-1 flex-shrink-0" />
                              <p className={`text-[12px] italic ${isLight ? 'text-gray-600' : 'text-[#888]'}`}>{session.note}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center opacity-30">
                    <Info size={40} strokeWidth={1} className="mb-3" />
                    <p className="text-[12px] uppercase tracking-widest">{t.noMoodData}</p>
                  </div>
                )}

                <button
                  onClick={() => setSelectedDay(null)}
                  className={`w-full py-4 rounded-2xl text-[13px] uppercase tracking-[0.2em] font-medium transition-all ${isLight ? 'bg-gray-900 text-white' : 'bg-[#e8e4dc] text-[#0a0a0a]'}`}
                >
                  {t.close || 'Chiudi'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
