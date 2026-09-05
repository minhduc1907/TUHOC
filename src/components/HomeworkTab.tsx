import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  BookOpenCheck,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Calendar,
  CheckSquare,
  Square,
  Pencil,
  Trash2,
  Book,
  FileText,
  Sparkles,
  Layers,
} from 'lucide-react';
import { HomeworkItem, PriorityLevel, Subject } from '../types';
import { soundManager } from '../utils/audio';
import { getTodayDateString } from '../utils/storage';
import { SubjectIcon } from './SubjectIcon';

interface Props {
  homeworks: HomeworkItem[];
  subjects: Subject[];
  soundEnabled: boolean;
  onAddHomework: () => void;
  onEditHomework: (item: HomeworkItem) => void;
  onDeleteHomework: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onToggleChecklistItem: (homeworkId: string, checklistId: string) => void;
}

export const HomeworkTab: React.FC<Props> = ({
  homeworks,
  subjects,
  soundEnabled,
  onAddHomework,
  onEditHomework,
  onDeleteHomework,
  onToggleComplete,
  onToggleChecklistItem,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'urgent' | 'pending' | 'completed'>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const todayStr = getTodayDateString();

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

  // Helper to check deadline status
  const getDueStatus = (dueDate: string, dueTime: string = '21:00') => {
    const today = new Date(todayStr);
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `Quá hạn ${Math.abs(diffDays)} ngày`, isOverdue: true, isToday: false, isTomorrow: false };
    }
    if (diffDays === 0) {
      return { label: `Hạn nộp hôm nay (${dueTime})`, isOverdue: false, isToday: true, isTomorrow: false };
    }
    if (diffDays === 1) {
      return { label: `Hạn nộp ngày mai (${dueTime})`, isOverdue: false, isToday: false, isTomorrow: true };
    }
    return { label: `Còn ${diffDays} ngày (${dueDate.split('-').reverse().join('/')})`, isOverdue: false, isToday: false, isTomorrow: false };
  };

  // Handle confetti when student completes a task!
  const handleToggleCompleteWithCelebration = (id: string, currentStatus: string) => {
    if (currentStatus !== 'completed') {
      // Trigger joyful celebration!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'],
      });
      if (soundEnabled) {
        soundManager.playSuccessChime();
      }
    }
    onToggleComplete(id);
  };

  // Priority color tags
  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'high':
        return { label: 'Cần làm gấp', className: 'bg-[#FFF5F5] text-[#FF7675] border-[#FED7D7] font-bold' };
      case 'medium':
        return { label: 'Quan trọng', className: 'bg-[#FFF9EB] text-[#FD9644] border-[#FEE4A6] font-bold' };
      case 'low':
        return { label: 'Bình thường', className: 'bg-[#F7F9FC] text-[#636E72] border-[#E0E6ED] font-semibold' };
    }
  };

  // Filter homeworks
  const filteredHomeworks = homeworks.filter((hw) => {
    // Status filter
    if (filterStatus === 'urgent') {
      const { isOverdue, isToday, isTomorrow } = getDueStatus(hw.dueDate, hw.dueTime);
      if (hw.status === 'completed' || (!isOverdue && !isToday && !isTomorrow && hw.priority !== 'high')) {
        return false;
      }
    } else if (filterStatus === 'pending') {
      if (hw.status === 'completed') return false;
    } else if (filterStatus === 'completed') {
      if (hw.status !== 'completed') return false;
    }

    // Subject filter
    if (filterSubject !== 'all' && hw.subjectId !== filterSubject) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = hw.title.toLowerCase().includes(q);
      const matchDesc = hw.description.toLowerCase().includes(q);
      const matchBook = hw.bookRef ? hw.bookRef.toLowerCase().includes(q) : false;
      if (!matchTitle && !matchDesc && !matchBook) return false;
    }

    return true;
  });

  // Calculate statistics
  const totalCount = homeworks.length;
  const completedCount = homeworks.filter((h) => h.status === 'completed').length;
  const pendingCount = totalCount - completedCount;
  const dueTodayCount = homeworks.filter((h) => h.status !== 'completed' && h.dueDate === todayStr).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics Bar */}
      <div className="bg-white p-6 rounded-3xl border border-[#E0E6ED] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E0E6ED]">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#2D3436] flex items-center gap-2">
              <span className="w-2 h-6 bg-[#FF7675] rounded-full"></span>
              <span>Quản Lý Bài Tập Về Nhà</span>
            </h2>
            <p className="text-xs text-[#636E72] mt-1 font-medium">
              Theo dõi hạn nộp, sách giáo khoa, bài tập và đánh dấu hoàn thành mỗi ngày
            </p>
          </div>

          <button
            id="btn-add-homework-main"
            onClick={onAddHomework}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#6C5CE7] hover:bg-[#5b4bc4] active:bg-[#4d3db8] text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm bài tập mới</span>
          </button>
        </div>

        {/* Quick Metrics & Progress */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
          <div className="p-4 bg-[#F7F9FC] rounded-2xl border border-[#E0E6ED]">
            <span className="text-[11px] font-bold text-[#636E72] uppercase tracking-wider">Tổng số bài tập</span>
            <p className="text-xl font-black text-[#2D3436] mt-1">{totalCount} bài</p>
          </div>

          <div className="p-4 bg-[#FFF5F5] rounded-2xl border border-[#FED7D7]">
            <span className="text-[11px] font-bold text-[#FF7675] flex items-center gap-1 uppercase tracking-wider">
              <Clock className="w-3 h-3" />
              Cần nộp hôm nay
            </span>
            <p className="text-xl font-black text-[#E53E3E] mt-1">{dueTodayCount} bài</p>
          </div>

          <div className="p-4 bg-[#FFF9EB] rounded-2xl border border-[#FEE4A6]">
            <span className="text-[11px] font-bold text-[#FD9644] uppercase tracking-wider">Chưa hoàn thành</span>
            <p className="text-xl font-black text-[#E67E22] mt-1">{pendingCount} bài</p>
          </div>

          <div className="p-4 bg-[#F0FFF4] rounded-2xl border border-[#C6F6D5]">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#00B894] uppercase tracking-wider">
              <span>Đã hoàn thành</span>
              <span className="font-black">{progressPercent}%</span>
            </div>
            <p className="text-xl font-black text-[#00B894] mt-1">{completedCount} bài</p>
            <div className="w-full bg-[#C6F6D5] h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#00B894] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E0E6ED] shadow-xs">
        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 cursor-pointer transition-colors ${
              filterStatus === 'all'
                ? 'bg-[#2D3436] text-white shadow-xs'
                : 'bg-[#F7F9FC] text-[#636E72] hover:bg-white hover:text-[#2D3436] border border-[#E0E6ED]'
            }`}
          >
            Tất cả ({totalCount})
          </button>

          <button
            onClick={() => setFilterStatus('urgent')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 cursor-pointer transition-colors flex items-center gap-1.5 ${
              filterStatus === 'urgent'
                ? 'bg-[#FF7675] text-white shadow-xs'
                : 'bg-[#FFF5F5] text-[#FF7675] hover:bg-[#FED7D7] border border-[#FED7D7]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Cần nộp gấp</span>
          </button>

          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 cursor-pointer transition-colors ${
              filterStatus === 'pending'
                ? 'bg-[#FD9644] text-white shadow-xs'
                : 'bg-[#FFF9EB] text-[#E67E22] hover:bg-[#FEE4A6] border border-[#FEE4A6]'
            }`}
          >
            Chưa xong ({pendingCount})
          </button>

          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 cursor-pointer transition-colors flex items-center gap-1.5 ${
              filterStatus === 'completed'
                ? 'bg-[#00B894] text-white shadow-xs'
                : 'bg-[#F0FFF4] text-[#00B894] hover:bg-[#C6F6D5] border border-[#C6F6D5]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đã xong ({completedCount})</span>
          </button>
        </div>

        {/* Subject & Search */}
        <div className="flex items-center gap-2">
          {/* Subject Dropdown */}
          <div className="relative shrink-0">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              aria-label="Lọc theo môn học"
              className="text-xs font-bold bg-[#F7F9FC] hover:bg-white text-[#2D3436] border border-[#E0E6ED] rounded-xl px-3 py-2 pr-7 focus:outline-hidden focus:ring-2 focus:ring-[#6C5CE7] cursor-pointer"
            >
              <option value="all">Tất cả môn học</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#636E72] pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm bài tập, số trang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-medium bg-[#F7F9FC] border border-[#E0E6ED] rounded-xl pl-9 pr-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-[#6C5CE7] focus:bg-white text-[#2D3436]"
            />
          </div>
        </div>
      </div>

      {/* Homework List */}
      {filteredHomeworks.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-[#E0E6ED] shadow-sm">
          <BookOpenCheck className="w-12 h-12 text-[#6C5CE7] opacity-60 mx-auto mb-3" />
          <h3 className="text-base font-extrabold text-[#2D3436]">Không tìm thấy bài tập nào</h3>
          <p className="text-xs text-[#636E72] max-w-sm mx-auto mt-1">
            Không có bài tập nào phù hợp với bộ lọc hiện tại. Bạn có thể thêm bài tập mới hoặc đổi bộ lọc.
          </p>
          <button
            onClick={onAddHomework}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-[#6C5CE7] hover:bg-[#5b4bc4] text-white inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm bài tập ngay</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHomeworks.map((hw) => {
            const sub = getSubject(hw.subjectId);
            const dueInfo = getDueStatus(hw.dueDate, hw.dueTime);
            const priorityBadge = getPriorityBadge(hw.priority);
            const isDone = hw.status === 'completed';

            const checklistTotal = hw.checklist.length;
            const checklistDone = hw.checklist.filter((c) => c.done).length;

            return (
              <div
                key={hw.id}
                className={`bg-white rounded-3xl border p-5 transition-all flex flex-col justify-between ${
                  isDone
                    ? 'border-[#C6F6D5] bg-[#F0FFF4]/40 opacity-90'
                    : dueInfo.isOverdue
                    ? 'border-[#FED7D7] ring-2 ring-[#FFF5F5] shadow-xs'
                    : dueInfo.isToday
                    ? 'border-[#FED7D7] ring-2 ring-[#FFF9EB] shadow-xs'
                    : 'border-[#E0E6ED] shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  {/* Card Header: Subject, Priority, Status */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-[#EEF2FF] text-[#6C5CE7] border border-[#D9D2FB]">
                        <SubjectIcon iconName={sub.iconName} className="w-3.5 h-3.5 text-[#6C5CE7]" />
                        <span>{sub.name}</span>
                      </span>

                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-lg border ${priorityBadge.className}`}
                      >
                        {priorityBadge.label}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditHomework(hw)}
                        className="p-1.5 text-[#636E72] hover:text-[#6C5CE7] hover:bg-[#F7F9FC] rounded-lg transition-colors cursor-pointer"
                        title="Chỉnh sửa bài tập"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Bạn có chắc muốn xóa bài tập "${hw.title}"?`)) {
                            onDeleteHomework(hw.id);
                          }
                        }}
                        className="p-1.5 text-[#636E72] hover:text-[#FF7675] hover:bg-[#FFF5F5] rounded-lg transition-colors cursor-pointer"
                        title="Xóa bài tập"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Sách giáo khoa */}
                  <h3
                    className={`text-sm sm:text-base font-extrabold text-[#2D3436] leading-snug mb-1 ${
                      isDone ? 'line-through text-[#636E72]' : ''
                    }`}
                  >
                    {hw.title}
                  </h3>

                  {hw.bookRef && (
                    <div className="flex items-center gap-1.5 text-xs text-[#6C5CE7] font-bold mb-2">
                      <Book className="w-3.5 h-3.5 text-[#6C5CE7] shrink-0" />
                      <span>{hw.bookRef}</span>
                    </div>
                  )}

                  {/* Description */}
                  {hw.description && (
                    <p className="text-xs text-[#636E72] leading-relaxed mb-3 bg-[#F7F9FC] p-3 rounded-2xl border border-[#E0E6ED]">
                      {hw.description}
                    </p>
                  )}

                  {/* Checklist items */}
                  {hw.checklist.length > 0 && (
                    <div className="mb-3 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-[#636E72] font-bold">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3 text-[#6C5CE7]" />
                          <span>Checklist chi tiết ({checklistDone}/{checklistTotal})</span>
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {hw.checklist.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              if (soundEnabled) soundManager.playTick();
                              onToggleChecklistItem(hw.id, item.id);
                            }}
                            className="flex items-center gap-2.5 text-xs text-[#2D3436] hover:text-[#6C5CE7] p-1.5 rounded-xl hover:bg-[#F7F9FC] cursor-pointer select-none transition-colors"
                          >
                            {item.done ? (
                              <CheckSquare className="w-4 h-4 text-[#00B894] shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-[#636E72] shrink-0" />
                            )}
                            <span className={item.done ? 'line-through text-[#636E72]' : 'font-medium'}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes if any */}
                  {hw.notes && (
                    <p className="text-[11px] text-[#E67E22] font-medium bg-[#FFF9EB] px-3 py-2 rounded-xl border border-[#FEE4A6] mb-3 flex items-start gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#FD9644] shrink-0 mt-0.5" />
                      <span>{hw.notes}</span>
                    </p>
                  )}
                </div>

                {/* Footer: Due date pill and toggle button */}
                <div className="pt-3.5 border-t border-[#E0E6ED] flex items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-[#636E72]" />
                    <span
                      className={`font-bold ${
                        isDone
                          ? 'text-[#00B894]'
                          : dueInfo.isOverdue
                          ? 'text-[#E53E3E]'
                          : dueInfo.isToday
                          ? 'text-[#FF7675]'
                          : 'text-[#636E72]'
                      }`}
                    >
                      {dueInfo.label}
                    </span>
                  </div>

                  <button
                    id={`btn-toggle-hw-${hw.id}`}
                    onClick={() => handleToggleCompleteWithCelebration(hw.id, hw.status)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                      isDone
                        ? 'bg-[#F0FFF4] hover:bg-[#DCFCE7] text-[#00B894] border border-[#C6F6D5]'
                        : 'bg-[#6C5CE7] hover:bg-[#5b4bc4] text-white'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00B894]" />
                        <span>Đã xong!</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-[#FFEAA7]" />
                        <span>Đánh dấu đã làm</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
