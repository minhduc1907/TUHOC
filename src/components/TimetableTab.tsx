import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  RotateCcw,
  Sun,
  Sunset,
  Moon,
  Pencil,
  Trash2,
  MapPin,
  User,
  Info,
  CalendarCheck,
} from 'lucide-react';
import { DayOfWeek, ScheduleItem, Subject } from '../types';
import { DAYS_OF_WEEK } from '../utils/constants';
import { getTodayDayOfWeek } from '../utils/storage';
import { SubjectIcon } from './SubjectIcon';

interface Props {
  schedule: ScheduleItem[];
  subjects: Subject[];
  onAddScheduleItem: (day?: DayOfWeek, session?: 'morning' | 'afternoon' | 'evening') => void;
  onEditScheduleItem: (item: ScheduleItem) => void;
  onDeleteScheduleItem: (id: string) => void;
  onResetDefaultSchedule: () => void;
}

export const TimetableTab: React.FC<Props> = ({
  schedule,
  subjects,
  onAddScheduleItem,
  onEditScheduleItem,
  onDeleteScheduleItem,
  onResetDefaultSchedule,
}) => {
  const todayDayOfWeek = getTodayDayOfWeek() as DayOfWeek;
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | 'all'>('all');

  const getSubject = (subjectId: string): Subject => {
    return (
      subjects.find((s) => s.id === subjectId) || {
        id: 'other',
        name: 'Môn học khác',
        shortName: 'Khác',
        color: 'slate',
        textColor: 'text-slate-700',
        bgLight: 'bg-slate-50',
        borderColor: 'border-slate-200',
        iconName: 'BookOpen',
      }
    );
  };

  // Color mapping helper for cards
  const getColorStyles = (color: string) => {
    switch (color) {
      case 'blue':
        return { bg: 'bg-[#EBF8FF]', border: 'border-[#BEE3F8]', badge: 'bg-[#BEE3F8] text-[#0984E3]', dot: 'bg-[#0984E3]' };
      case 'amber':
        return { bg: 'bg-[#FFF9EB]', border: 'border-[#FEE4A6]', badge: 'bg-[#FEE4A6] text-[#D97706]', dot: 'bg-[#FD9644]' };
      case 'emerald':
        return { bg: 'bg-[#F0FFF4]', border: 'border-[#C6F6D5]', badge: 'bg-[#C6F6D5] text-[#00B894]', dot: 'bg-[#00B894]' };
      case 'cyan':
      case 'teal':
        return { bg: 'bg-[#E6FAF9]', border: 'border-[#B2EFE8]', badge: 'bg-[#B2EFE8] text-[#00CEC9]', dot: 'bg-[#00CEC9]' };
      case 'rose':
        return { bg: 'bg-[#FFF5F5]', border: 'border-[#FED7D7]', badge: 'bg-[#FED7D7] text-[#FF7675]', dot: 'bg-[#FF7675]' };
      case 'violet':
      case 'indigo':
      case 'purple':
        return { bg: 'bg-[#EEF2FF]', border: 'border-[#D9D2FB]', badge: 'bg-[#D9D2FB] text-[#6C5CE7]', dot: 'bg-[#6C5CE7]' };
      case 'orange':
        return { bg: 'bg-[#FFF5EE]', border: 'border-[#FDD8B5]', badge: 'bg-[#FDD8B5] text-[#FD9644]', dot: 'bg-[#FD9644]' };
      case 'fuchsia':
        return { bg: 'bg-[#FFF0F6]', border: 'border-[#FBCFE8]', badge: 'bg-[#FBCFE8] text-[#FD79A8]', dot: 'bg-[#FD79A8]' };
      case 'lime':
        return { bg: 'bg-[#F0FFF4]', border: 'border-[#C6F6D5]', badge: 'bg-[#C6F6D5] text-[#00B894]', dot: 'bg-[#00B894]' };
      default:
        return { bg: 'bg-white', border: 'border-[#E0E6ED]', badge: 'bg-[#F7F9FC] text-[#2D3436]', dot: 'bg-[#6C5CE7]' };
    }
  };

  // Group items by day
  const getDayItems = (day: DayOfWeek) => {
    return schedule
      .filter((s) => s.dayOfWeek === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const daysToRender = selectedDay === 'all' ? DAYS_OF_WEEK : DAYS_OF_WEEK.filter((d) => d.value === selectedDay);

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E0E6ED] shadow-sm">
        <div>
          <h2 className="text-lg font-extrabold text-[#2D3436] flex items-center gap-2">
            <span className="w-2 h-6 bg-[#00B894] rounded-full"></span>
            <span>Thời Khóa Biểu Học Tập Lớp 7</span>
          </h2>
          <p className="text-xs text-[#636E72] mt-1 font-medium">
            Xem và chỉnh sửa các tiết học trên lớp và các buổi tự học buổi tối
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-today-filter"
            onClick={() => setSelectedDay(todayDayOfWeek)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#EEF2FF] hover:bg-[#e0e7ff] text-[#6C5CE7] border border-[#D9D2FB] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Hôm nay (T{todayDayOfWeek === 8 ? 'CN' : todayDayOfWeek})</span>
          </button>

          <button
            id="btn-reset-schedule"
            onClick={() => {
              if (window.confirm('Bạn có muốn đặt lại thời khóa biểu mẫu chuẩn Lớp 7 không?')) {
                onResetDefaultSchedule();
              }
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#636E72] hover:text-[#2D3436] hover:bg-[#F7F9FC] border border-[#E0E6ED] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Khôi phục thời khóa biểu mẫu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại mẫu</span>
          </button>

          <button
            id="btn-add-schedule-item"
            onClick={() => onAddScheduleItem()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#6C5CE7] hover:bg-[#5b4bc4] active:bg-[#4d3db8] text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm tiết học</span>
          </button>
        </div>
      </div>

      {/* Day Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedDay('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            selectedDay === 'all'
              ? 'bg-[#2D3436] text-white shadow-xs'
              : 'bg-white text-[#636E72] hover:bg-[#F7F9FC] border border-[#E0E6ED]'
          }`}
        >
          Cả tuần (T2 - CN)
        </button>

        {DAYS_OF_WEEK.map((d) => {
          const isToday = d.value === todayDayOfWeek;
          const isSelected = selectedDay === d.value;
          return (
            <button
              key={d.value}
              onClick={() => setSelectedDay(d.value)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-[#6C5CE7] text-white shadow-xs'
                  : 'bg-white text-[#636E72] hover:text-[#2D3436] hover:bg-[#F7F9FC] border border-[#E0E6ED]'
              }`}
            >
              <span>{d.name}</span>
              {isToday && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-[#EEF2FF] text-[#6C5CE7] border border-[#D9D2FB]'
                  }`}
                >
                  Hôm nay
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Grid of Days */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {daysToRender.map((day) => {
          const isToday = day.value === todayDayOfWeek;
          const items = getDayItems(day.value);

          const morningItems = items.filter((i) => i.session === 'morning');
          const afternoonItems = items.filter((i) => i.session === 'afternoon');
          const eveningItems = items.filter((i) => i.session === 'evening');

          return (
            <div
              key={day.value}
              className={`bg-white rounded-3xl border transition-shadow overflow-hidden ${
                isToday
                  ? 'border-[#6C5CE7] ring-2 ring-[#EEF2FF] shadow-md'
                  : 'border-[#E0E6ED] shadow-sm hover:shadow-md'
              }`}
            >
              {/* Day Header */}
              <div
                className={`flex items-center justify-between px-5 py-4 border-b ${
                  isToday
                    ? 'bg-[#6C5CE7] text-white border-[#5b4bc4]'
                    : 'bg-[#F7F9FC] text-[#2D3436] border-[#E0E6ED]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-extrabold text-sm tracking-tight">{day.name}</span>
                  {isToday && (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/20 text-white border border-white/30 uppercase tracking-wider">
                      Hôm nay
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${isToday ? 'text-white/80' : 'text-[#636E72]'}`}>
                    {items.length} tiết/ca
                  </span>
                  <button
                    onClick={() => onAddScheduleItem(day.value)}
                    className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                      isToday
                        ? 'hover:bg-white/20 text-white'
                        : 'hover:bg-[#EEF2FF] text-[#636E72] hover:text-[#6C5CE7]'
                    }`}
                    title={`Thêm tiết học cho ${day.name}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="p-4 space-y-5">
                {items.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-xs text-[#636E72] italic">Chưa có lịch học cho ngày này.</p>
                    <button
                      onClick={() => onAddScheduleItem(day.value)}
                      className="mt-2 text-xs font-bold text-[#6C5CE7] hover:underline"
                    >
                      + Thêm tiết đầu tiên
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Buổi Sáng */}
                    {morningItems.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#FD9644] uppercase tracking-wider mb-2.5">
                          <Sun className="w-3.5 h-3.5 text-[#FD9644]" />
                          <span>Buổi sáng</span>
                        </div>
                        <div className="space-y-2.5">
                          {morningItems.map((item) => renderScheduleCard(item))}
                        </div>
                      </div>
                    )}

                    {/* Buổi Chiều */}
                    {afternoonItems.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0984E3] uppercase tracking-wider mb-2.5">
                          <Sunset className="w-3.5 h-3.5 text-[#0984E3]" />
                          <span>Buổi chiều</span>
                        </div>
                        <div className="space-y-2.5">
                          {afternoonItems.map((item) => renderScheduleCard(item))}
                        </div>
                      </div>
                    )}

                    {/* Buổi Tối / Tự học */}
                    {eveningItems.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6C5CE7] uppercase tracking-wider mb-2.5">
                          <Moon className="w-3.5 h-3.5 text-[#6C5CE7]" />
                          <span>Tự học buổi tối</span>
                        </div>
                        <div className="space-y-2.5">
                          {eveningItems.map((item) => renderScheduleCard(item))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  function renderScheduleCard(item: ScheduleItem) {
    const sub = getSubject(item.subjectId);
    const style = getColorStyles(sub.color);

    return (
      <div
        key={item.id}
        className={`p-3 rounded-2xl border ${style.bg} ${style.border} transition-all hover:shadow-xs group relative`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white shadow-2xs flex items-center justify-center text-[#2D3436] border border-[#E0E6ED] shrink-0">
              <SubjectIcon iconName={sub.iconName} className="w-4 h-4 text-[#6C5CE7]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-[#2D3436] leading-tight">
                  {sub.name}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-white/90 text-[#2D3436] border border-[#E0E6ED]">
                  {item.periodLabel}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#636E72] font-mono mt-0.5">
                <Clock className="w-3 h-3 text-[#6C5CE7]" />
                <span>
                  {item.startTime} - {item.endTime}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons (hover to reveal or tap) */}
          <div className="opacity-80 group-hover:opacity-100 flex items-center gap-1">
            <button
              onClick={() => onEditScheduleItem(item)}
              className="p-1.5 text-[#636E72] hover:text-[#6C5CE7] hover:bg-white rounded-lg transition-colors cursor-pointer"
              title="Chỉnh sửa tiết học"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Xóa tiết "${sub.name}" khỏi thời khóa biểu?`)) {
                  onDeleteScheduleItem(item.id);
                }
              }}
              className="p-1.5 text-[#636E72] hover:text-[#FF7675] hover:bg-white rounded-lg transition-colors cursor-pointer"
              title="Xóa tiết học"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Additional info: room, teacher, notes */}
        {(item.room || item.teacher || item.notes) && (
          <div className="mt-2 pt-2 border-t border-[#E0E6ED]/80 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#636E72]">
            {item.room && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#6C5CE7]" />
                <span>{item.room}</span>
              </span>
            )}
            {item.teacher && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-[#6C5CE7]" />
                <span>{item.teacher}</span>
              </span>
            )}
            {item.notes && (
              <span className="flex items-center gap-1 text-[#2D3436] italic">
                <Info className="w-3 h-3 text-[#6C5CE7] shrink-0" />
                <span className="line-clamp-1">{item.notes}</span>
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
};
