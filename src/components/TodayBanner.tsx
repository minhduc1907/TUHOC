import React, { useState } from 'react';
import {
  CalendarDays,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { HomeworkItem, ScheduleItem, Subject } from '../types';
import { STUDY_TIPS } from '../utils/constants';
import { getTodayDayOfWeek, getTodayDateString } from '../utils/storage';
import { SubjectIcon } from './SubjectIcon';

interface Props {
  schedule: ScheduleItem[];
  homeworks: HomeworkItem[];
  subjects: Subject[];
  onNavigateToHomework: () => void;
  onNavigateToSchedule: () => void;
  onNavigateToPomodoro: () => void;
}

export const TodayBanner: React.FC<Props> = ({
  schedule,
  homeworks,
  subjects,
  onNavigateToHomework,
  onNavigateToSchedule,
  onNavigateToPomodoro,
}) => {
  const [tipIndex, setTipIndex] = useState(0);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? 'Chào buổi sáng bạn nhỏ! ☀️'
      : currentHour < 18
      ? 'Chào buổi chiều! Cố gắng học tốt nhé! 🌤️'
      : 'Chào buổi tối! Chúc bạn có buổi tự học hiệu quả! 🌙';

  const todayDayOfWeek = getTodayDayOfWeek();
  const todayDateStr = getTodayDateString();

  // Filter schedule for today
  const todayClasses = schedule
    .filter((s) => s.dayOfWeek === todayDayOfWeek)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Homework due today or tomorrow
  const pendingHomeworks = homeworks.filter((hw) => hw.status !== 'completed');
  const dueTodayHomeworks = pendingHomeworks.filter((hw) => hw.dueDate === todayDateStr);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  const dueTomorrowHomeworks = pendingHomeworks.filter((hw) => hw.dueDate === tomorrowStr);

  // Subject lookup
  const getSubject = (id: string) => subjects.find((s) => s.id === id);

  const nextTip = () => {
    setTipIndex((prev) => (prev + 1) % STUDY_TIPS.length);
  };

  return (
    <div className="mb-6">
      {/* Top greeting row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2D3436] tracking-tight">
            {greeting}
          </h1>
          <p className="text-sm text-[#636E72] mt-1 font-medium">
            Lớp 7 là năm học bản lề với nhiều kiến thức mới. Cùng lên kế hoạch để việc học nhẹ nhàng hơn nhé!
          </p>
        </div>

        {/* Tip of the day pill */}
        <div
          onClick={nextTip}
          className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-[#E0E6ED] rounded-2xl shadow-xs hover:border-[#6C5CE7] cursor-pointer transition-colors max-w-md group"
          title="Bấm để đổi mẹo học tập khác"
        >
          <Sparkles className="w-4 h-4 text-[#FD9644] shrink-0 group-hover:rotate-12 transition-transform" />
          <div className="text-xs">
            <span className="font-bold text-[#2D3436] line-clamp-1">
              {STUDY_TIPS[tipIndex].quote}
            </span>
            <span className="text-[11px] text-[#636E72]">
              — {STUDY_TIPS[tipIndex].author} (Nhấn để đổi)
            </span>
          </div>
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Today's Schedule Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E0E6ED] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-extrabold text-[#2D3436] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#00B894] rounded-full"></span>
                <span>Lịch học hôm nay</span>
              </h2>
              <button
                onClick={onNavigateToSchedule}
                className="text-xs font-bold text-[#6C5CE7] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Xem tất cả</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {todayClasses.length > 0 ? (
                <>
                  {todayClasses.slice(0, 3).map((cls, idx) => {
                    const sub = getSubject(cls.subjectId);
                    const isFirst = idx === 0;
                    return (
                      <div
                        key={cls.id}
                        className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all ${
                          isFirst
                            ? 'bg-[#F0FFF4] border-[#C6F6D5]'
                            : 'bg-white border-[#E0E6ED]'
                        }`}
                      >
                        <div className="text-center w-14 shrink-0">
                          <p className="text-[11px] font-bold text-[#2D3436] opacity-60 font-mono">
                            {cls.startTime}
                          </p>
                          <p className="text-[10px] font-medium text-[#636E72] font-mono">
                            {cls.endTime}
                          </p>
                        </div>
                        <div
                          className={`w-1 h-9 rounded-full shrink-0 ${
                            isFirst ? 'bg-[#00B894]' : 'bg-[#0984E3]'
                          }`}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-xs sm:text-sm text-[#2D3436] truncate">
                            {sub?.name || 'Môn học'}: {cls.notes || cls.periodLabel}
                          </h3>
                          <p className="text-[11px] text-[#636E72] truncate">
                            {cls.room || 'Phòng học'}{cls.teacher ? ` • ${cls.teacher}` : ''}
                          </p>
                        </div>
                        {isFirst && (
                          <span className="px-2 py-0.5 bg-[#00B894] text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shrink-0">
                            Tiếp theo
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {todayClasses.length > 3 && (
                    <p className="text-xs text-[#6C5CE7] font-semibold pt-1">
                      + Còn {todayClasses.length - 3} tiết học khác trong ngày
                    </p>
                  )}
                </>
              ) : (
                <div className="p-6 text-center text-xs text-[#636E72] italic bg-[#F7F9FC] rounded-2xl border border-[#E0E6ED]">
                  Hôm nay không có tiết học nào. Hãy tự ôn tập nhé!
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E0E6ED] mt-4 flex items-center justify-between text-xs">
            <span className="text-[#636E72] font-medium">
              Tổng cộng: <strong className="text-[#2D3436]">{todayClasses.length} tiết/ca</strong>
            </span>
            <button
              onClick={onNavigateToSchedule}
              className="font-bold text-[#6C5CE7] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Chi tiết TKB &rarr;
            </button>
          </div>
        </div>

        {/* Homework Urgent Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E0E6ED] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-extrabold text-[#2D3436] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#FF7675] rounded-full"></span>
                <span>Bài tập về nhà</span>
              </h2>
              <button
                onClick={onNavigateToHomework}
                className="text-xs font-bold text-[#6C5CE7] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Xem tất cả</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {dueTodayHomeworks.length > 0 ? (
                dueTodayHomeworks.slice(0, 3).map((hw) => {
                  const sub = getSubject(hw.subjectId);
                  return (
                    <div
                      key={hw.id}
                      onClick={onNavigateToHomework}
                      className="p-3.5 bg-[#FFF5F5] border border-[#FED7D7] rounded-2xl cursor-pointer hover:border-[#FF7675] transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 mt-0.5 border-2 border-[#FF7675] rounded-md bg-white flex items-center justify-center shrink-0">
                          <span className="text-[10px] text-[#FF7675] font-bold">!</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs sm:text-sm text-[#2D3436] truncate">
                            [{sub?.shortName}] {hw.title}
                          </h4>
                          <p className="text-[11px] text-[#E53E3E] font-bold mt-0.5 uppercase tracking-wide">
                            Hạn nộp: Hôm nay {hw.dueTime ? `(${hw.dueTime})` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : dueTomorrowHomeworks.length > 0 ? (
                dueTomorrowHomeworks.slice(0, 3).map((hw) => {
                  const sub = getSubject(hw.subjectId);
                  return (
                    <div
                      key={hw.id}
                      onClick={onNavigateToHomework}
                      className="p-3.5 bg-white border border-[#E0E6ED] rounded-2xl cursor-pointer hover:border-[#6C5CE7] transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 mt-0.5 border-2 border-[#E0E6ED] rounded-md bg-white flex items-center justify-center shrink-0"></div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs sm:text-sm text-[#2D3436] truncate">
                            [{sub?.shortName}] {hw.title}
                          </h4>
                          <p className="text-[11px] text-[#636E72] font-semibold mt-0.5 uppercase">
                            Hạn nộp: Ngày mai
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-[#00B894] font-semibold bg-[#F0FFF4] rounded-2xl border border-[#C6F6D5] flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00B894]" />
                  <span>Tất cả bài tập đã hoàn thành xuất sắc!</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E0E6ED] mt-4 flex items-center justify-between text-xs">
            <span className="text-[#636E72] font-medium">
              Chưa hoàn thành: <strong className="text-[#E53E3E]">{pendingHomeworks.length} bài</strong>
            </span>
            <button
              onClick={onNavigateToHomework}
              className="font-bold text-[#6C5CE7] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Làm bài tập &rarr;
            </button>
          </div>
        </div>

        {/* Study Routine / Pomodoro Vibrant Card */}
        <div className="bg-[#6C5CE7] p-6 rounded-3xl shadow-md text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-lg italic text-white flex items-center gap-2">
                <span>Góc nhắc nhở ⚡</span>
              </h3>
              <span className="px-2.5 py-1 bg-white/20 rounded-lg text-xs font-bold text-white">
                Tập trung
              </span>
            </div>

            <ul className="text-xs space-y-2.5 text-white/90 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-white font-bold">•</span>
                <span>Kiểm tra lại sách giáo khoa và vở bài tập theo thời khóa biểu ngày mai.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white font-bold">•</span>
                <span>Bật đồng hồ Pomodoro 25 phút để tự học buổi tối không xao nhãng.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white font-bold">•</span>
                <span>Uống đủ nước và để mắt thư giãn sau mỗi tiết học.</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-white/20 mt-4">
            <div className="flex items-center justify-between text-xs text-white/90 font-medium mb-2">
              <span>Mục tiêu tự học tuần này</span>
              <span className="font-bold">85%</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-3">
              <div className="bg-white h-full rounded-full" style={{ width: '85%' }}></div>
            </div>
            <button
              onClick={onNavigateToPomodoro}
              className="w-full py-2 bg-white text-[#6C5CE7] hover:bg-[#F7F9FC] font-extrabold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Vào góc tự học 25 phút</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
