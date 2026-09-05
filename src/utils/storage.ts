import { HomeworkItem, NotificationSetting, ScheduleItem } from '../types';
import { DEFAULT_HOMEWORKS, DEFAULT_SCHEDULE } from './constants';

const STORAGE_KEYS = {
  SCHEDULE: 'grade7_study_schedule_v1',
  HOMEWORKS: 'grade7_study_homeworks_v1',
  SETTINGS: 'grade7_study_settings_v1',
  STREAK: 'grade7_study_streak_v1',
};

export const DEFAULT_SETTINGS: NotificationSetting = {
  soundEnabled: true,
  browserNotifications: false,
  eveningStudyReminderTime: '19:15',
  enableEveningStudyReminder: true,
  remindBeforeDueHours: 12,
};

export function loadSchedule(): ScheduleItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load schedule from storage', e);
  }
  return DEFAULT_SCHEDULE;
}

export function saveSchedule(schedule: ScheduleItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
  } catch (e) {
    console.error('Failed to save schedule', e);
  }
}

export function loadHomeworks(): HomeworkItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.HOMEWORKS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load homeworks from storage', e);
  }
  return DEFAULT_HOMEWORKS;
}

export function saveHomeworks(homeworks: HomeworkItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HOMEWORKS, JSON.stringify(homeworks));
  } catch (e) {
    console.error('Failed to save homeworks', e);
  }
}

export function loadSettings(): NotificationSetting {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: NotificationSetting): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function getTodayDayOfWeek(): number {
  const day = new Date().getDay();
  // In JS: 0 is Sunday, 1 is Monday ... 6 is Saturday
  // In our model: 2 = Thứ 2 ... 7 = Thứ 7, 8 = Chủ Nhật
  if (day === 0) return 8; // Chủ nhật
  return day + 1;
}

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
