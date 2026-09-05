import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Brain,
  Sparkles,
  Volume2,
  CheckCircle,
  Eye,
  Smile,
} from 'lucide-react';
import { Subject } from '../types';
import { soundManager } from '../utils/audio';
import { SubjectIcon } from './SubjectIcon';

interface Props {
  subjects: Subject[];
  soundEnabled: boolean;
}

type Mode = 'study' | 'short_break' | 'long_break';

const MODE_CONFIG = {
  study: { label: 'Tập trung học', duration: 25 * 60, color: 'indigo' },
  short_break: { label: 'Nghỉ ngắn 5 phút', duration: 5 * 60, color: 'emerald' },
  long_break: { label: 'Nghỉ dài 15 phút', duration: 15 * 60, color: 'amber' },
};

export const PomodoroTimer: React.FC<Props> = ({ subjects, soundEnabled }) => {
  const [mode, setMode] = useState<Mode>('study');
  const [timeLeft, setTimeLeft] = useState<number>(MODE_CONFIG.study.duration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('math');
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  const timerRef = useRef<number | null>(null);

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  // Tick effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const handleTimerComplete = () => {
    setIsRunning(false);

    if (soundEnabled) {
      soundManager.playReminderChime();
    }

    if (mode === 'study') {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      setCompletedSessions((prev) => prev + 1);
      // Auto switch to short break
      setMode('short_break');
      setTimeLeft(MODE_CONFIG.short_break.duration);
    } else {
      // Break is over
      setMode('study');
      setTimeLeft(MODE_CONFIG.study.duration);
    }
  };

  const switchMode = (newMode: Mode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_CONFIG[newMode].duration);
  };

  const togglePlay = () => {
    if (!isRunning && soundEnabled) {
      soundManager.playTick();
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODE_CONFIG[mode].duration);
  };

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalDuration = MODE_CONFIG[mode].duration;
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Introduction Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#E0E6ED] shadow-sm text-center">
        <h2 className="text-xl font-extrabold text-[#2D3436] flex items-center justify-center gap-2">
          <span className="w-2 h-6 bg-[#6C5CE7] rounded-full inline-block"></span>
          <span>Góc Tự Học Tập Trung (Pomodoro)</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#636E72] mt-1 max-w-lg mx-auto font-medium">
          Phương pháp học 25 phút giúp học sinh lớp 7 rèn luyện tính tập trung cao độ, hoàn thành bài tập nhanh gấp đôi mà không thấy mệt mỏi.
        </p>

        {/* Mode selector */}
        <div className="flex items-center justify-center gap-2 mt-5 p-1.5 bg-[#F7F9FC] rounded-2xl max-w-md mx-auto border border-[#E0E6ED]">
          <button
            onClick={() => switchMode('study')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'study'
                ? 'bg-[#6C5CE7] text-white shadow-xs'
                : 'text-[#636E72] hover:text-[#2D3436] hover:bg-white'
            }`}
          >
            Tập trung (25p)
          </button>
          <button
            onClick={() => switchMode('short_break')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'short_break'
                ? 'bg-[#00B894] text-white shadow-xs'
                : 'text-[#636E72] hover:text-[#2D3436] hover:bg-white'
            }`}
          >
            Nghỉ ngắn (5p)
          </button>
          <button
            onClick={() => switchMode('long_break')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'long_break'
                ? 'bg-[#FD9644] text-white shadow-xs'
                : 'text-[#636E72] hover:text-[#2D3436] hover:bg-white'
            }`}
          >
            Nghỉ dài (15p)
          </button>
        </div>
      </div>

      {/* Main Focus Clock Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E0E6ED] shadow-sm flex flex-col items-center">
        {/* Subject selector when in study mode */}
        {mode === 'study' && (
          <div className="mb-6 flex items-center gap-2 bg-[#EEF2FF] border border-[#D9D2FB] px-4 py-2 rounded-2xl">
            <span className="text-xs text-[#636E72] font-semibold">Đang học môn:</span>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="text-xs font-extrabold text-[#6C5CE7] bg-transparent focus:outline-hidden cursor-pointer"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Big Circular Dial / Timer */}
        <div className="relative w-64 h-64 flex items-center justify-center my-2">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="112"
              stroke="#F7F9FC"
              strokeWidth="14"
              fill="transparent"
            />
            {/* Animated progress circle */}
            <circle
              cx="128"
              cy="128"
              r="112"
              stroke={mode === 'study' ? '#6C5CE7' : mode === 'short_break' ? '#00B894' : '#FD9644'}
              strokeWidth="14"
              strokeDasharray={2 * Math.PI * 112}
              strokeDashoffset={2 * Math.PI * 112 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Center text */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-5xl sm:text-6xl font-black text-[#2D3436] font-mono tracking-tight">
              {formattedTime}
            </span>
            <span
              className={`mt-2 text-xs font-extrabold px-3 py-1 rounded-xl border ${
                mode === 'study'
                  ? 'bg-[#EEF2FF] text-[#6C5CE7] border-[#D9D2FB]'
                  : mode === 'short_break'
                  ? 'bg-[#F0FFF4] text-[#00B894] border-[#C6F6D5]'
                  : 'bg-[#FFF9EB] text-[#FD9644] border-[#FEE4A6]'
              }`}
            >
              {mode === 'study' ? `Môn ${currentSubject.name}` : MODE_CONFIG[mode].label}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl text-[#636E72] hover:text-[#2D3436] hover:bg-[#F7F9FC] transition-colors border border-[#E0E6ED] cursor-pointer"
            title="Đặt lại đồng hồ"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            id="btn-pomodoro-toggle"
            onClick={togglePlay}
            className={`px-8 py-3.5 rounded-2xl font-bold text-white shadow-md transition-transform active:scale-95 flex items-center gap-2 cursor-pointer ${
              isRunning
                ? 'bg-[#FD9644] hover:bg-[#e67e22]'
                : 'bg-[#6C5CE7] hover:bg-[#5b4bc4]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Bắt đầu học</span>
              </>
            )}
          </button>
        </div>

        {/* Session count badge */}
        <div className="mt-6 flex items-center gap-2 text-xs text-[#636E72] font-semibold">
          <CheckCircle className="w-4 h-4 text-[#00B894]" />
          <span>Hôm nay bạn đã hoàn thành: <strong className="text-[#6C5CE7] font-black">{completedSessions} phiên tập trung</strong></span>
        </div>
      </div>

      {/* Helpful Habits Cards for 7th graders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#E0E6ED] shadow-sm flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-[#EEF2FF] text-[#6C5CE7] shrink-0 border border-[#D9D2FB]">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#2D3436]">Bảo vệ mắt (Quy tắc 20-20-20)</h4>
            <p className="text-xs text-[#636E72] mt-1 leading-relaxed">
              Cứ sau 20 phút nhìn vào sách vở hoặc màn hình máy tính, hãy nhìn ra xa 6 mét trong vòng 20 giây để mắt thư giãn.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E0E6ED] shadow-sm flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-[#F0FFF4] text-[#00B894] shrink-0 border border-[#C6F6D5]">
            <Smile className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#2D3436]">Tư thế ngồi học chuẩn</h4>
            <p className="text-xs text-[#636E72] mt-1 leading-relaxed">
              Lưng thẳng, ngực không tì vào bàn, khoảng cách từ mắt đến trang sách từ 25 - 30cm giúp học sinh lớp 7 tránh gù lưng và cận thị.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
