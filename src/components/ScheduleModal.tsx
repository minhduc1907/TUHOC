import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, Info } from 'lucide-react';
import { DayOfWeek, ScheduleItem, Subject } from '../types';
import { DAYS_OF_WEEK, PERIOD_TIMES } from '../utils/constants';
import { SubjectIcon } from './SubjectIcon';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ScheduleItem) => void;
  subjects: Subject[];
  initialData?: ScheduleItem | null;
  defaultDay?: DayOfWeek;
  defaultSession?: 'morning' | 'afternoon' | 'evening';
}

export const ScheduleModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  subjects,
  initialData,
  defaultDay = 2,
  defaultSession = 'morning',
}) => {
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(defaultDay);
  const [session, setSession] = useState<'morning' | 'afternoon' | 'evening'>(defaultSession);
  const [period, setPeriod] = useState<number>(1);
  const [periodLabel, setPeriodLabel] = useState<string>('Tiết 1');
  const [startTime, setStartTime] = useState<string>('07:15');
  const [endTime, setEndTime] = useState<string>('08:00');
  const [subjectId, setSubjectId] = useState<string>('math');
  const [room, setRoom] = useState<string>('Phòng 7A2');
  const [teacher, setTeacher] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setDayOfWeek(initialData.dayOfWeek);
      setSession(initialData.session);
      setPeriod(initialData.period);
      setPeriodLabel(initialData.periodLabel);
      setStartTime(initialData.startTime);
      setEndTime(initialData.endTime);
      setSubjectId(initialData.subjectId);
      setRoom(initialData.room || '');
      setTeacher(initialData.teacher || '');
      setNotes(initialData.notes || '');
    } else {
      setDayOfWeek(defaultDay);
      setSession(defaultSession);
      const defaultPreset = PERIOD_TIMES.find((p) => p.session === defaultSession) || PERIOD_TIMES[0];
      setPeriod(defaultPreset.period);
      setPeriodLabel(defaultPreset.label);
      setStartTime(defaultPreset.start);
      setEndTime(defaultPreset.end);
      setSubjectId(defaultSession === 'evening' ? 'self_study' : 'math');
      setRoom(defaultSession === 'evening' ? 'Góc học tập' : 'Phòng 7A2');
      setTeacher('');
      setNotes('');
    }
  }, [initialData, isOpen, defaultDay, defaultSession]);

  if (!isOpen) return null;

  const handlePeriodChange = (selectedPeriod: number) => {
    setPeriod(selectedPeriod);
    const preset = PERIOD_TIMES.find((p) => p.session === session && p.period === selectedPeriod);
    if (preset) {
      setPeriodLabel(preset.label);
      setStartTime(preset.start);
      setEndTime(preset.end);
    }
  };

  const handleSessionChange = (newSession: 'morning' | 'afternoon' | 'evening') => {
    setSession(newSession);
    const preset = PERIOD_TIMES.find((p) => p.session === newSession && p.period === 1) || PERIOD_TIMES[0];
    setPeriod(1);
    setPeriodLabel(preset.label);
    setStartTime(preset.start);
    setEndTime(preset.end);
    if (newSession === 'evening') {
      setSubjectId('self_study');
      setRoom('Góc học tập');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const item: ScheduleItem = {
      id: initialData?.id || `sch_${Date.now()}`,
      dayOfWeek,
      session,
      period,
      periodLabel,
      startTime,
      endTime,
      subjectId,
      room: room.trim() || undefined,
      teacher: teacher.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    onSave(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3436]/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-[#E0E6ED] overflow-hidden my-8 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E6ED] bg-[#F7F9FC]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#EEF2FF] text-[#6C5CE7] border border-[#D9D2FB] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#2D3436]">
                {initialData ? 'Chỉnh Sửa Tiết Học' : 'Thêm Tiết Học Vào Thời Khóa Biểu'}
              </h3>
              <p className="text-xs text-[#636E72]">Lịch học lớp 7</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#636E72] hover:text-[#2D3436] hover:bg-white rounded-xl transition-colors cursor-pointer border border-transparent hover:border-[#E0E6ED]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Thứ trong tuần */}
          <div>
            <label className="block text-xs font-bold text-[#2D3436] mb-1.5">
              Thứ trong tuần
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {DAYS_OF_WEEK.map((d) => (
                <button
                  type="button"
                  key={d.value}
                  onClick={() => setDayOfWeek(d.value)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                    dayOfWeek === d.value
                      ? 'border-[#6C5CE7] bg-[#6C5CE7] text-white shadow-2xs'
                      : 'border-[#E0E6ED] bg-white hover:bg-[#F7F9FC] text-[#636E72]'
                  }`}
                >
                  {d.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* Buổi học & Tiết */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#2D3436] mb-1">
                Buổi học
              </label>
              <select
                value={session}
                onChange={(e) => handleSessionChange(e.target.value as 'morning' | 'afternoon' | 'evening')}
                className="w-full text-xs bg-[#F7F9FC] border border-[#E0E6ED] text-[#2D3436] rounded-xl px-3 py-2.5 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#6C5CE7] cursor-pointer"
              >
                <option value="morning">Buổi sáng (Chính khóa)</option>
                <option value="afternoon">Buổi chiều</option>
                <option value="evening">Buổi tối (Tự học / Học thêm)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2D3436] mb-1">
                Tiết / Ca học
              </label>
              <select
                value={period}
                onChange={(e) => handlePeriodChange(Number(e.target.value))}
                className="w-full text-xs bg-[#F7F9FC] border border-[#E0E6ED] text-[#2D3436] rounded-xl px-3 py-2.5 font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#6C5CE7] cursor-pointer"
              >
                {session === 'morning' && (
                  <>
                    <option value={1}>Tiết 1 (07:15 - 08:00)</option>
                    <option value={2}>Tiết 2 (08:05 - 08:50)</option>
                    <option value={3}>Tiết 3 (09:05 - 09:50)</option>
                    <option value={4}>Tiết 4 (09:55 - 10:40)</option>
                    <option value={5}>Tiết 5 (10:45 - 11:30)</option>
                  </>
                )}
                {session === 'afternoon' && (
                  <>
                    <option value={1}>Tiết 1 Chiều (13:30 - 14:15)</option>
                    <option value={2}>Tiết 2 Chiều (14:20 - 15:05)</option>
                    <option value={3}>Tiết 3 Chiều (15:20 - 16:05)</option>
                  </>
                )}
                {session === 'evening' && (
                  <>
                    <option value={1}>Ca 1 Tối (19:30 - 20:30)</option>
                    <option value={2}>Ca 2 Tối (20:45 - 21:45)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Thời gian bắt đầu - kết thúc */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#2D3436] mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#6C5CE7]" />
                <span>Bắt đầu</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-xs bg-[#F7F9FC] border border-[#E0E6ED] text-[#2D3436] rounded-xl px-3 py-2 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#6C5CE7]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2D3436] mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#6C5CE7]" />
                <span>Kết thúc</span>
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full text-xs bg-[#F7F9FC] border border-[#E0E6ED] text-[#2D3436] rounded-xl px-3 py-2 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#6C5CE7]"
              />
            </div>
          </div>

          {/* Môn học */}
          <div>
            <label className="block text-xs font-bold text-[#2D3436] mb-1.5">
              Môn học
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {subjects.map((sub) => (
                <button
                  type="button"
                  key={sub.id}
                  onClick={() => setSubjectId(sub.id)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                    subjectId === sub.id
                      ? 'border-[#6C5CE7] bg-[#EEF2FF] text-[#6C5CE7] ring-2 ring-[#D9D2FB]'
                      : 'border-[#E0E6ED] bg-white hover:bg-[#F7F9FC] text-[#636E72]'
                  }`}
                >
                  <SubjectIcon iconName={sub.iconName} className="w-4 h-4 text-[#6C5CE7] shrink-0" />
                  <span className="truncate">{sub.shortName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Phòng học & Giáo viên */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#2D3436] mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#6C5CE7]" />
                <span>Phòng học</span>
              </label>
              <input
                type="text"
                placeholder="VD: Phòng 7A2 / Phòng Lab..."
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full text-xs bg-[#F7F9FC] border border-[#E0E6ED] text-[#2D3436] rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-[#6C5CE7]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2D3436] mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#6C5CE7]" />
                <span>Thầy/Cô phụ trách</span>
              </label>
              <input
                type="text"
                placeholder="VD: Cô Lan, Thầy Tuấn..."
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                className="w-full text-xs bg-[#F7F9FC] border border-[#E0E6ED] text-[#2D3436] rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-[#6C5CE7]"
              />
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-xs font-bold text-[#2D3436] mb-1 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-[#6C5CE7]" />
              <span>Ghi chú bài học / Đồ dùng cần mang theo</span>
            </label>
            <input
              type="text"
              placeholder="VD: Mang compa, mang vở bài tập, học thuộc bài cũ..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs bg-[#F7F9FC] border border-[#E0E6ED] text-[#2D3436] rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-[#6C5CE7]"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[#E0E6ED] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#636E72] hover:bg-[#F7F9FC] transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#6C5CE7] hover:bg-[#5b4bc4] active:bg-[#4d3db8] text-white shadow-xs transition-colors cursor-pointer"
            >
              {initialData ? 'Lưu thay đổi' : 'Thêm vào thời khóa biểu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
