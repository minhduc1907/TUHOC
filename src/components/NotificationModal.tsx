import React, { useState } from 'react';
import {
  X,
  Bell,
  Volume2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Calendar,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { HomeworkItem, NotificationSetting, ScheduleItem, Subject } from '../types';
import { requestBrowserNotification, sendBrowserNotification, soundManager } from '../utils/audio';
import { getTodayDateString, getTodayDayOfWeek } from '../utils/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSetting;
  onUpdateSettings: (newSettings: NotificationSetting) => void;
  homeworks: HomeworkItem[];
  schedule: ScheduleItem[];
  subjects: Subject[];
  onNavigateToHomework: () => void;
}

export const NotificationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  homeworks,
  schedule,
  subjects,
  onNavigateToHomework,
}) => {
  const [localSettings, setLocalSettings] = useState<NotificationSetting>(settings);
  const [browserPermissionStatus, setBrowserPermissionStatus] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  );
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const todayStr = getTodayDateString();
  const todayDayOfWeek = getTodayDayOfWeek();

  const getSubjectName = (subId: string) => subjects.find((s) => s.id === subId)?.name || 'Môn học';

  // Smart dynamic reminders
  const pendingHomeworks = homeworks.filter((hw) => hw.status !== 'completed');
  const dueTodayHomeworks = pendingHomeworks.filter((hw) => hw.dueDate === todayStr);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  const dueTomorrowHomeworks = pendingHomeworks.filter((hw) => hw.dueDate === tomorrowStr);

  // Today classes
  const todayClasses = schedule
    .filter((s) => s.dayOfWeek === todayDayOfWeek)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleToggleBrowserPermission = async () => {
    const granted = await requestBrowserNotification();
    if (granted) {
      setBrowserPermissionStatus('granted');
      const updated = { ...localSettings, browserNotifications: true };
      setLocalSettings(updated);
      onUpdateSettings(updated);
      sendBrowserNotification(
        'Lịch Học Lớp 7',
        'Tuyệt vời! Bạn đã bật thông báo nhắc nhở bài tập và giờ học thành công.'
      );
    } else {
      setBrowserPermissionStatus(Notification.permission);
    }
  };

  const handleTestChimeAndNotification = () => {
    soundManager.playReminderChime();
    setTestSent(true);
    sendBrowserNotification(
      '⏰ Chuông Nhắc Nhở Học Tập',
      'Đến giờ kiểm tra lại bài tập về nhà và chuẩn bị sách vở cho ngày mai rồi bạn nhé!'
    );
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleSave = () => {
    onUpdateSettings(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3436]/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-[#E0E6ED] overflow-hidden my-8 animate-in fade-in zoom-in duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D9D2FB] bg-[#EEF2FF]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#6C5CE7] text-white flex items-center justify-center shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#2D3436]">
                Trung Tâm Thông Báo & Nhắc Nhở
              </h3>
              <p className="text-xs text-[#636E72]">
                Nhắc học bài đúng giờ, báo hạn nộp bài tập về nhà
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#636E72] hover:text-[#2D3436] hover:bg-white rounded-xl transition-colors cursor-pointer border border-transparent hover:border-[#D9D2FB]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Smart Alerts Section */}
          <div>
            <h4 className="text-xs font-bold text-[#2D3436] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FD9644]" />
              <span>Nhắc nhở quan trọng hôm nay</span>
            </h4>

            <div className="space-y-2.5">
              {/* Due Today Warning */}
              {dueTodayHomeworks.length > 0 ? (
                <div className="p-4 bg-[#FFF5F5] border border-[#FED7D7] rounded-2xl flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-[#FF7675] shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-extrabold text-[#E53E3E]">
                        Có {dueTodayHomeworks.length} bài tập cần nộp hôm nay!
                      </h5>
                      <ul className="mt-1 space-y-0.5 text-xs text-[#E53E3E] font-medium">
                        {dueTodayHomeworks.map((hw) => (
                          <li key={hw.id} className="list-disc list-inside">
                            [{getSubjectName(hw.subjectId)}] {hw.title} (hạn: {hw.dueTime || '21:00'})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToHomework();
                    }}
                    className="text-xs font-bold text-white bg-[#FF7675] hover:bg-[#e05655] px-3 py-1.5 rounded-xl shrink-0 cursor-pointer shadow-xs transition-colors"
                  >
                    Làm ngay
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-[#F0FFF4] border border-[#C6F6D5] rounded-2xl flex items-center gap-2.5 text-xs text-[#00B894] font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#00B894] shrink-0" />
                  <span>Hôm nay bạn không có bài tập nào bị quá hạn. Rất đáng khen!</span>
                </div>
              )}

              {/* Due Tomorrow Reminder */}
              {dueTomorrowHomeworks.length > 0 && (
                <div className="p-4 bg-[#FFF9EB] border border-[#FEE4A6] rounded-2xl flex items-start gap-2.5 text-xs text-[#E67E22]">
                  <Clock className="w-4 h-4 text-[#FD9644] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Nhắc nhở ngày mai: </span>
                    <span>
                      Có {dueTomorrowHomeworks.length} bài tập ({dueTomorrowHomeworks.map((h) => getSubjectName(h.subjectId)).join(', ')}) sẽ đến hạn nộp vào ngày mai. Hãy hoàn thành sớm trong tối nay nhé!
                    </span>
                  </div>
                </div>
              )}

              {/* Evening Study Reminder Card */}
              {localSettings.enableEveningStudyReminder && (
                <div className="p-4 bg-[#EEF2FF] border border-[#D9D2FB] rounded-2xl flex items-center justify-between gap-2 text-xs text-[#6C5CE7]">
                  <div className="flex items-center gap-2 font-medium">
                    <Clock className="w-4 h-4 text-[#6C5CE7]" />
                    <span>
                      Chuông nhắc tự học buổi tối đặt lúc:{' '}
                      <strong className="font-black">{localSettings.eveningStudyReminderTime}</strong>
                    </span>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 bg-white border border-[#D9D2FB] rounded-lg font-bold text-[#6C5CE7]">
                    Đã kích hoạt
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Preferences Form */}
          <div className="pt-3 border-t border-[#E0E6ED] space-y-3.5">
            <h4 className="text-xs font-bold text-[#2D3436] uppercase tracking-wider">
              Cấu hình thông báo nhắc nhở
            </h4>

            {/* Browser notification toggle */}
            <div className="p-4 bg-[#F7F9FC] border border-[#E0E6ED] rounded-2xl flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#2D3436] block">
                  Thông báo trên màn hình máy tính (Web Notification)
                </span>
                <span className="text-[11px] text-[#636E72] block mt-0.5 font-medium">
                  Nhận thông báo nổi ngay cả khi bạn đang mở tab trình duyệt khác
                </span>
              </div>

              {browserPermissionStatus === 'granted' ? (
                <span className="text-xs font-bold text-[#00B894] bg-[#F0FFF4] border border-[#C6F6D5] px-3 py-1 rounded-xl">
                  Đã cho phép
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleToggleBrowserPermission}
                  className="px-3.5 py-2 bg-[#6C5CE7] hover:bg-[#5b4bc4] text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer shadow-xs transition-colors"
                >
                  Bật quyền thông báo
                </button>
              )}
            </div>

            {/* Sound toggle */}
            <div className="p-4 bg-[#F7F9FC] border border-[#E0E6ED] rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-[#6C5CE7]" />
                <div>
                  <span className="text-xs font-bold text-[#2D3436] block">
                    Âm thanh chuông báo
                  </span>
                  <span className="text-[11px] text-[#636E72] block font-medium">
                    Phát tiếng chuông trong trẻo khi đến giờ học hoặc khi hoàn thành bài tập
                  </span>
                </div>
              </div>

              <input
                type="checkbox"
                checked={localSettings.soundEnabled}
                onChange={(e) => setLocalSettings({ ...localSettings, soundEnabled: e.target.checked })}
                className="w-4 h-4 text-[#6C5CE7] rounded-sm cursor-pointer accent-[#6C5CE7]"
              />
            </div>

            {/* Evening Study Reminder Time */}
            <div className="p-4 bg-[#F7F9FC] border border-[#E0E6ED] rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#2D3436] block">
                    Giờ nhắc tự học buổi tối
                  </span>
                  <span className="text-[11px] text-[#636E72] block font-medium">
                    Hệ thống sẽ đổ chuông nhắc học sinh ngồi vào bàn học và dọn sách vở
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.enableEveningStudyReminder}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, enableEveningStudyReminder: e.target.checked })
                  }
                  className="w-4 h-4 text-[#6C5CE7] rounded-sm cursor-pointer accent-[#6C5CE7]"
                />
              </div>

              {localSettings.enableEveningStudyReminder && (
                <div className="flex items-center gap-2 pt-2 border-t border-[#E0E6ED]">
                  <span className="text-xs font-bold text-[#2D3436]">Thời gian nhắc:</span>
                  <input
                    type="time"
                    value={localSettings.eveningStudyReminderTime}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, eveningStudyReminderTime: e.target.value })
                    }
                    className="text-xs bg-white border border-[#E0E6ED] rounded-xl px-3 py-1 font-bold text-[#6C5CE7] focus:outline-hidden focus:ring-2 focus:ring-[#6C5CE7]"
                  />
                  <span className="text-[11px] text-[#636E72] font-medium">(khuyên dùng 19:15 - 19:30)</span>
                </div>
              )}
            </div>

            {/* Homework advance reminder */}
            <div className="p-4 bg-[#F7F9FC] border border-[#E0E6ED] rounded-2xl flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#2D3436] block">
                  Cảnh báo bài tập trước hạn
                </span>
                <span className="text-[11px] text-[#636E72] block font-medium">
                  Đánh dấu bài tập cần làm gấp trước giờ nộp
                </span>
              </div>

              <select
                value={localSettings.remindBeforeDueHours}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, remindBeforeDueHours: Number(e.target.value) })
                }
                className="text-xs font-bold bg-white border border-[#E0E6ED] rounded-xl px-3 py-1.5 text-[#2D3436] cursor-pointer focus:ring-2 focus:ring-[#6C5CE7]"
              >
                <option value={2}>Trước 2 tiếng</option>
                <option value={6}>Trước 6 tiếng</option>
                <option value={12}>Trước 12 tiếng</option>
                <option value={24}>Trước 24 tiếng (1 ngày)</option>
              </select>
            </div>

            {/* Test sound & notification action */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleTestChimeAndNotification}
                className="px-3.5 py-2 bg-[#EEF2FF] hover:bg-[#D9D2FB] text-[#6C5CE7] text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors border border-[#D9D2FB]"
              >
                <Send className="w-3.5 h-3.5 text-[#6C5CE7]" />
                <span>{testSent ? 'Đã phát chuông thử nghiệm!' : 'Thử phát chuông & thông báo'}</span>
              </button>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-[#E0E6ED] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#636E72] hover:bg-[#F7F9FC] transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#6C5CE7] hover:bg-[#5b4bc4] active:bg-[#4d3db8] text-white shadow-xs transition-colors cursor-pointer"
            >
              Lưu cài đặt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
