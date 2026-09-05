import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, BookOpen, AlertCircle, Clock } from 'lucide-react';
import { ChecklistItem, HomeworkItem, PriorityLevel, Subject } from '../types';
import { getRelativeDate } from '../utils/constants';
import { SubjectIcon } from './SubjectIcon';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (homework: HomeworkItem) => void;
  subjects: Subject[];
  initialData?: HomeworkItem | null;
}

export const AddHomeworkModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  subjects,
  initialData,
}) => {
  const [subjectId, setSubjectId] = useState<string>('math');
  const [title, setTitle] = useState<string>('');
  const [bookRef, setBookRef] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>(getRelativeDate(1));
  const [dueTime, setDueTime] = useState<string>('21:00');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [notes, setNotes] = useState<string>('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 'chk_init_1', text: 'Đọc lý thuyết trong SGK', done: false },
    { id: 'chk_init_2', text: 'Làm bài tập vào vở bài tập', done: false },
  ]);
  const [newChecklistText, setNewChecklistText] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setSubjectId(initialData.subjectId);
      setTitle(initialData.title);
      setBookRef(initialData.bookRef || '');
      setDescription(initialData.description || '');
      setDueDate(initialData.dueDate);
      setDueTime(initialData.dueTime || '21:00');
      setPriority(initialData.priority);
      setNotes(initialData.notes || '');
      setChecklist(initialData.checklist || []);
    } else {
      setSubjectId('math');
      setTitle('');
      setBookRef('');
      setDescription('');
      setDueDate(getRelativeDate(1));
      setDueTime('21:00');
      setPriority('medium');
      setNotes('');
      setChecklist([
        { id: 'chk_1', text: 'Đọc kỹ đề và công thức', done: false },
        { id: 'chk_2', text: 'Trình bày vào vở bài tập', done: false },
      ]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setChecklist((prev) => [
      ...prev,
      {
        id: `chk_${Date.now()}`,
        text: newChecklistText.trim(),
        done: false,
      },
    ]);
    setNewChecklistText('');
  };

  const handleRemoveChecklist = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const item: HomeworkItem = {
      id: initialData?.id || `hw_${Date.now()}`,
      title: title.trim(),
      subjectId,
      bookRef: bookRef.trim() || undefined,
      description: description.trim(),
      dueDate,
      dueTime,
      priority,
      status: initialData?.status || 'pending',
      createdAt: initialData?.createdAt || new Date().toISOString(),
      completedAt: initialData?.completedAt,
      checklist,
      notes: notes.trim() || undefined,
    };

    onSave(item);
    onClose();
  };

  const currentSubject = subjects.find((s) => s.id === subjectId) || subjects[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3436]/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-[#E0E6ED] overflow-hidden my-8 animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E6ED] bg-[#F7F9FC]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#EEF2FF] text-[#6C5CE7] border border-[#D9D2FB] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#2D3436]">
                {initialData ? 'Chỉnh Sửa Bài Tập' : 'Giao Bài Tập Mới'}
              </h3>
              <p className="text-xs text-[#636E72]">
                Ghi chú bài tập về nhà dành cho học sinh Lớp 7
              </p>
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
          
          {/* Môn học */}
          <div>
            <label className="block text-xs font-bold text-[#2D3436] mb-1.5">
              Môn học <span className="text-[#FF7675]">*</span>
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

          {/* Tên bài tập */}
          <div>
            <label className="block text-xs font-bold text-[#2D3436] mb-1">
              Tiêu đề bài tập <span className="text-[#FF7675]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Làm bài tập 1, 2, 3 Số hữu tỉ"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs sm:text-sm bg-[#F7F9FC] border border-[#E0E6ED] text-[#2D3436] rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6C5CE7] focus:bg-white"
            />
          </div>

          {/* Vị trí sách / Trang SGK */}
          <div>
            <label className="block text-xs font-bold text-[#2D3436] mb-1">
              Sách tham khảo / Trang sách (tùy chọn)
            </label>
            <input
              type="text"
              placeholder="VD: SGK Toán 7 tập 1 - Trang 14 bài 2"
              value={bookRef}
              onChange={(e) => setBookRef(e.target.value)}
              className="w-full text-xs bg-[#F7F9FC] border border-[#E0E6ED] text-[#2D3436] rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6C5CE7] focus:bg-white"
            />
          </div>

          {/* Chi tiết nội dung */}
          <div>
            <label className="block text-xs font-bold text-[#2D3436] mb-1">
              Nội dung chi tiết & Lời dặn của thầy/cô
            </label>
            <textarea
              rows={2}
              placeholder="VD: Trình bày từng bước, vẽ hình bằng bút chì, nhớ chuẩn bị thêm compa..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs bg-[#F7F9FC] border border-[#E0E6ED] text-[#2D3436] rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6C5CE7] focus:bg-white resize-none"
            />
          </div>

          {/* Ngày nộp & Giờ nộp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#2D3436] mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#6C5CE7]" />
                <span>Hạn nộp (Ngày)</span>
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs bg-[#F7F9FC] border border-[#E0E6ED] text-[#2D3436] font-medium rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6C5CE7] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2D3436] mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#6C5CE7]" />
                <span>Giờ nộp</span>
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full text-xs bg-[#F7F9FC] border border-[#E0E6ED] text-[#2D3436] font-medium rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#6C5CE7] focus:bg-white"
              />
            </div>
          </div>

          {/* Mức độ ưu tiên */}
          <div>
            <label className="block text-xs font-bold text-[#2D3436] mb-1.5">
              Mức độ ưu tiên
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('low')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center ${
                  priority === 'low'
                    ? 'border-[#2D3436] bg-[#2D3436] text-white shadow-2xs'
                    : 'border-[#E0E6ED] bg-white text-[#636E72] hover:bg-[#F7F9FC]'
                }`}
              >
                Bình thường
              </button>
              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center ${
                  priority === 'medium'
                    ? 'border-[#FEE4A6] bg-[#FFF9EB] text-[#FD9644] ring-1 ring-[#FD9644]'
                    : 'border-[#E0E6ED] bg-white text-[#636E72] hover:bg-[#F7F9FC]'
                }`}
              >
                Quan trọng
              </button>
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center ${
                  priority === 'high'
                    ? 'border-[#FED7D7] bg-[#FFF5F5] text-[#FF7675] ring-1 ring-[#FF7675]'
                    : 'border-[#E0E6ED] bg-white text-[#636E72] hover:bg-[#F7F9FC]'
                }`}
              >
                Cần làm gấp
              </button>
            </div>
          </div>

          {/* Checklist chi tiết các câu */}
          <div>
            <label className="block text-xs font-bold text-[#2D3436] mb-1">
              Các đầu việc nhỏ (Checklist bài tập)
            </label>
            <div className="space-y-1.5 mb-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 p-2.5 bg-[#F7F9FC] border border-[#E0E6ED] rounded-xl text-xs"
                >
                  <span className="text-[#2D3436] font-medium truncate">{item.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklist(item.id)}
                    className="text-[#636E72] hover:text-[#FF7675] p-1 rounded-md hover:bg-white"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="VD: Bài 1: Tính toán; Bài 2: Chứng minh..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
                className="flex-1 text-xs bg-[#F7F9FC] border border-[#E0E6ED] text-[#2D3436] rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-2 focus:ring-[#6C5CE7]"
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="px-3.5 py-2 bg-[#EEF2FF] hover:bg-[#D9D2FB] text-[#6C5CE7] text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors border border-[#D9D2FB]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm mục</span>
              </button>
            </div>
          </div>

          {/* Footer buttons */}
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
              {initialData ? 'Lưu thay đổi' : 'Thêm bài tập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
