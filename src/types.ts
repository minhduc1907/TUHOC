export interface Subject {
  id: string;
  name: string;
  shortName: string;
  color: string; // Tailwind color class or hex
  textColor: string;
  bgLight: string;
  borderColor: string;
  iconName: string; // Lucide icon name mapping
}

export type DayOfWeek = 2 | 3 | 4 | 5 | 6 | 7 | 8; // 2 = Thứ Hai, ..., 8 = Chủ Nhật

export interface ScheduleItem {
  id: string;
  dayOfWeek: DayOfWeek;
  session: 'morning' | 'afternoon' | 'evening';
  period: number; // 1 to 5 for morning/afternoon, or 1 to 3 for evening
  periodLabel: string; // e.g. "Tiết 1", "Tiết 2", "Ca 1 (Tối)"
  startTime: string; // "07:15"
  endTime: string; // "08:00"
  subjectId: string;
  room?: string;
  teacher?: string;
  notes?: string;
}

export type PriorityLevel = 'low' | 'medium' | 'high';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface HomeworkItem {
  id: string;
  title: string;
  subjectId: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm, default 21:00 or 23:59
  priority: PriorityLevel;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  completedAt?: string;
  checklist: ChecklistItem[];
  bookRef?: string; // e.g., "SGK trang 52, bài 1-4"
  notes?: string;
}

export interface NotificationSetting {
  soundEnabled: boolean;
  browserNotifications: boolean;
  eveningStudyReminderTime: string; // e.g. "19:00"
  enableEveningStudyReminder: boolean;
  remindBeforeDueHours: number; // e.g. 2, 6, 12, 24
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'urgent_homework' | 'due_today' | 'upcoming_class' | 'study_time' | 'cheer';
  timestamp: string;
  read: boolean;
  relatedHomeworkId?: string;
}
