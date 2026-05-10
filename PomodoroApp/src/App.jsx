import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Target, Bell } from 'lucide-react';

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

function App() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME);
  }, [mode]);

  const switchMode = useCallback(() => {
    const nextMode = mode === 'focus' ? 'break' : 'focus';
    setMode(nextMode);
    setTimeLeft(nextMode === 'focus' ? FOCUS_TIME : BREAK_TIME);
    setIsActive(false);
    
    // Play a notification sound if possible
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play();
    } catch (e) {
      console.log("Audio play failed", e);
    }
  }, [mode]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      switchMode();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, switchMode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'focus' 
    ? ((FOCUS_TIME - timeLeft) / FOCUS_TIME) * 100 
    : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100 p-4 font-sans overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-400 uppercase text-sm">Pomodoro Timer</h1>
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-500 ${
              mode === 'focus' 
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {mode === 'focus' ? <Target size={16} /> : <Coffee size={16} />}
              {mode === 'focus' ? 'Focus Session' : 'Short Break'}
            </div>
          </div>

          {/* Timer Display */}
          <div className="relative flex items-center justify-center py-10">
            {/* Circular Progress Ring */}
            <svg className="w-64 h-64 transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-800"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                strokeLinecap="round"
                className={`transition-all duration-1000 ease-linear ${
                  mode === 'focus' ? 'text-orange-500' : 'text-rose-500'
                }`}
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-7xl font-mono font-bold tracking-tighter">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={resetTimer}
              className="p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 transition-all active:scale-95 border border-slate-700/50"
              title="Reset Timer"
            >
              <RotateCcw size={24} />
            </button>
            
            <button
              onClick={toggleTimer}
              className={`p-6 rounded-3xl transition-all active:scale-95 shadow-xl ${
                isActive 
                  ? 'bg-slate-100 text-slate-900 hover:bg-white' 
                  : mode === 'focus' 
                    ? 'bg-orange-600 text-white hover:bg-orange-500' 
                    : 'bg-rose-600 text-white hover:bg-rose-500'
              }`}
            >
              {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
            </button>

            <button
              onClick={switchMode}
              className="p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 transition-all active:scale-95 border border-slate-700/50"
              title="Skip Session"
            >
              <Bell size={24} />
            </button>
          </div>

          {/* Settings / Footer Info */}
          <div className="pt-4 border-t border-slate-800/50 flex justify-between text-xs text-slate-500 font-medium">
            <span>25m Focus</span>
            <span>•</span>
            <span>5m Break</span>
            <span>•</span>
            <span>100% Free</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
