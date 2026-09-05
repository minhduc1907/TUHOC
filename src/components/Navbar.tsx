import React, { useEffect, useState } from 'react';
import {
  Bell,
  BookOpenCheck,
  Calendar,
  Clock,
  Plus,
  Volume2,
  VolumeX,
  Timer,
  Settings,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  activeTab: 'timetable' | 'homework' | 'pomodoro';
  onTabChange: (tab: 'timetable' | 'homework' | 'pomodoro') => void;
  pendingHomeworkCount: number;
  urgentCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenNotifications: () => void;
  onOpenAddHomework: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  pendingHomeworkCount,
  urgentCount,
  soundEnabled,
  onToggleSound,
  onOpenNotifications,
  onOpenAddHomework,
  onOpenSettings,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayName = days[now.getDay()];
      const dateStr = `${dayName}, ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

      setCurrentTime(timeStr);
      setCurrentDate(dateStr);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E0E6ED] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#6C5CE7] flex items-center justify-center text-white shadow-sm ring-4 ring-[#EEF2FF]">
              <span className="font-black text-lg tracking-tight">7A</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-[#2D3436] tracking-tight leading-tight">
                  Lịch Học Lớp 7
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-[#E6FBF5] text-[#00B894] border border-[#C6F6D5]">
                  GDPT 2018
                </span>
              </div>
              <p className="text-xs text-[#636E72] hidden md:block font-medium">
                Thời khóa biểu & Quản lý bài tập về nhà
              </p>
            </div>
          </div>

          {/* Tab Navigation Controls */}
          <nav className="flex items-center gap-1 sm:gap-1.5 p-1 bg-[#F7F9FC] rounded-2xl border border-[#E0E6ED]">
            <button
              id="tab-timetable"
              onClick={() => onTabChange('timetable')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer ${
                activeTab === 'timetable'
                  ? 'bg-[#EEF2FF] text-[#6C5CE7] shadow-xs border border-[#D9D2FB]'
                  : 'text-[#636E72] hover:text-[#2D3436] hover:bg-white'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#6C5CE7]" />
              <span>Thời khóa biểu</span>
            </button>

            <button
              id="tab-homework"
              onClick={() => onTabChange('homework')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer relative ${
                activeTab === 'homework'
                  ? 'bg-[#EEF2FF] text-[#6C5CE7] shadow-xs border border-[#D9D2FB]'
                  : 'text-[#636E72] hover:text-[#2D3436] hover:bg-white'
              }`}
            >
              <BookOpenCheck className="w-4 h-4 text-[#0984E3]" />
              <span>Bài tập về nhà</span>
              {pendingHomeworkCount > 0 && (
                <span
                  className={`ml-0.5 px-1.5 py-0.2 rounded-full text-xs font-bold ${
                    urgentCount > 0
                      ? 'bg-[#FF7675] text-white animate-pulse'
                      : 'bg-[#EEF2FF] text-[#6C5CE7] border border-[#D9D2FB]'
                  }`}
                >
                  {pendingHomeworkCount}
                </span>
              )}
            </button>

            <button
              id="tab-pomodoro"
              onClick={() => onTabChange('pomodoro')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer ${
                activeTab === 'pomodoro'
                  ? 'bg-[#EEF2FF] text-[#6C5CE7] shadow-xs border border-[#D9D2FB]'
                  : 'text-[#636E72] hover:text-[#2D3436] hover:bg-white'
              }`}
            >
              <Timer className="w-4 h-4 text-[#00B894]" />
              <span className="hidden sm:inline">Góc tự học</span>
              <span className="sm:hidden">Tự học</span>
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Realtime clock (Desktop only) */}
            <div className="hidden lg:flex flex-col items-end mr-1 text-right bg-white border border-[#E0E6ED] rounded-xl px-2.5 py-1 shadow-2xs">
              <span className="text-xs font-bold text-[#2D3436] flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-[#6C5CE7]" />
                {currentTime}
              </span>
              <span className="text-[11px] text-[#636E72] font-medium">
                {currentDate}
              </span>
            </div>

            {/* Quick Add Homework Button */}
            <button
              id="btn-quick-add-homework"
              onClick={onOpenAddHomework}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#6C5CE7] hover:bg-[#5b4bc4] active:bg-[#4d3db8] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
              title="Thêm bài tập về nhà mới"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Thêm bài tập</span>
            </button>

            {/* Notification Bell */}
            <button
              id="btn-notification-bell"
              onClick={onOpenNotifications}
              className="relative p-2 bg-white border border-[#E0E6ED] hover:bg-[#EEF2FF] text-[#636E72] hover:text-[#6C5CE7] rounded-xl shadow-2xs transition-colors cursor-pointer"
              title="Thông báo và nhắc nhở"
              aria-label="Thông báo"
            >
              <Bell className="w-4 h-4" />
              {urgentCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#FF7675] rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {/* Sound Toggle */}
            <button
              id="btn-toggle-sound"
              onClick={() => {
                onToggleSound();
                if (!soundEnabled) {
                  soundManager.playTick();
                }
              }}
              className={`p-2 bg-white border border-[#E0E6ED] hover:bg-[#EEF2FF] rounded-xl shadow-2xs transition-colors cursor-pointer ${
                soundEnabled
                  ? 'text-[#6C5CE7]'
                  : 'text-[#636E72] hover:text-[#6C5CE7]'
              }`}
              title={soundEnabled ? 'Âm thanh thông báo: Bật' : 'Âm thanh thông báo: Tắt'}
              aria-label="Bật tắt âm thanh"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#00B894]" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Settings button */}
            <button
              id="btn-open-settings"
              onClick={onOpenSettings}
              className="p-2 bg-white border border-[#E0E6ED] hover:bg-[#EEF2FF] text-[#636E72] hover:text-[#6C5CE7] rounded-xl shadow-2xs transition-colors cursor-pointer"
              title="Cài đặt nhắc nhở"
              aria-label="Cài đặt nhắc nhở"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
