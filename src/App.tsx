import React, { useState, useEffect, useRef } from 'react';
import {
  DayOfWeek,
  HomeworkItem,
  NotificationSetting,
  ScheduleItem,
} from './types';
import { GRADE_7_SUBJECTS, DEFAULT_SCHEDULE, DEFAULT_HOMEWORKS } from './utils/constants';
import {
  loadSchedule,
  saveSchedule,
  loadHomeworks,
  saveHomeworks,
  loadSettings,
  saveSettings,
  getTodayDateString,
} from './utils/storage';
import { sendBrowserNotification, soundManager } from './utils/audio';
import { Navbar } from './components/Navbar';
import { TodayBanner } from './components/TodayBanner';
import { TimetableTab } from './components/TimetableTab';
import { HomeworkTab } from './components/HomeworkTab';
import { PomodoroTimer } from './components/PomodoroTimer';
import { AddHomeworkModal } from './components/AddHomeworkModal';
import { ScheduleModal } from './components/ScheduleModal';
import { NotificationModal } from './components/NotificationModal';

export default function App() {
  // Main Data States
  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => loadSchedule());
  const [homeworks, setHomeworks] = useState<HomeworkItem[]>(() => loadHomeworks());
  const [settings, setSettings] = useState<NotificationSetting>(() => loadSettings());

  // UI Navigation
  const [activeTab, setActiveTab] = useState<'timetable' | 'homework' | 'pomodoro'>('timetable');

  // Modal States
  const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState<boolean>(false);
  const [editingHomework, setEditingHomework] = useState<HomeworkItem | null>(null);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [editingScheduleItem, setEditingScheduleItem] = useState<ScheduleItem | null>(null);
  const [scheduleDefaultDay, setScheduleDefaultDay] = useState<DayOfWeek>(2);
  const [scheduleDefaultSession, setScheduleDefaultSession] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);

  // Keep track of reminders fired in this session to prevent spamming
  const remindedEventsRef = useRef<Set<string>>(new Set());

  // Persist schedule changes
  useEffect(() => {
    saveSchedule(schedule);
  }, [schedule]);

  // Persist homework changes
  useEffect(() => {
    saveHomeworks(homeworks);
  }, [homeworks]);

  // Persist settings changes
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Background reminder heartbeat check (runs every 30 seconds)
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMins = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMins}`;
      const todayDateStr = getTodayDateString();

      // 1. Check Evening Study Reminder
      if (settings.enableEveningStudyReminder && settings.eveningStudyReminderTime === currentTimeStr) {
        const reminderKey = `evening_study_${todayDateStr}_${currentTimeStr}`;
        if (!remindedEventsRef.current.has(reminderKey)) {
          remindedEventsRef.current.add(reminderKey);
          if (settings.soundEnabled) {
            soundManager.playReminderChime();
          }
          sendBrowserNotification(
            '⏰ Giờ Tự Học Buổi Tối Đã Đến!',
            'Chào bạn, đã 19:15 rồi! Hãy dọn dẹp góc học tập và bắt đầu làm bài tập nhé.'
          );
        }
      }

      // 2. Check Urgent Due Homeworks
      const pending = homeworks.filter((h) => h.status !== 'completed');
      for (const hw of pending) {
        if (hw.dueDate === todayDateStr && hw.dueTime) {
          const hwReminderKey = `hw_${hw.id}_${todayDateStr}_${hw.dueTime}`;
          if (hw.dueTime === currentTimeStr && !remindedEventsRef.current.has(hwReminderKey)) {
            remindedEventsRef.current.add(hwReminderKey);
            if (settings.soundEnabled) {
              soundManager.playReminderChime();
            }
            sendBrowserNotification(
              '⚠️ Bài Tập Sắp Đến Hạn Nộp!',
              `Bài tập "${hw.title}" có hạn nộp vào lúc ${hw.dueTime} hôm nay!`
            );
          }
        }
      }
    };

    const interval = setInterval(checkReminders, 30000);
    return () => clearInterval(interval);
  }, [settings, homeworks]);

  // Counts for Badges
  const pendingHomeworkCount = homeworks.filter((hw) => hw.status !== 'completed').length;
  const todayStr = getTodayDateString();
  const urgentCount = homeworks.filter(
    (hw) => hw.status !== 'completed' && (hw.dueDate === todayStr || hw.priority === 'high')
  ).length;

  // Handlers for Homework
  const handleOpenAddHomework = () => {
    setEditingHomework(null);
    setIsHomeworkModalOpen(true);
  };

  const handleEditHomework = (item: HomeworkItem) => {
    setEditingHomework(item);
    setIsHomeworkModalOpen(true);
  };

  const handleSaveHomework = (savedItem: HomeworkItem) => {
    setHomeworks((prev) => {
      const exists = prev.some((h) => h.id === savedItem.id);
      if (exists) {
        return prev.map((h) => (h.id === savedItem.id ? savedItem : h));
      }
      return [savedItem, ...prev];
    });
  };

  const handleDeleteHomework = (id: string) => {
    setHomeworks((prev) => prev.filter((h) => h.id !== id));
  };

  const handleToggleHomeworkComplete = (id: string) => {
    setHomeworks((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const newStatus = h.status === 'completed' ? 'pending' : 'completed';
          return {
            ...h,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return h;
      })
    );
  };

  const handleToggleChecklistItem = (homeworkId: string, checklistId: string) => {
    setHomeworks((prev) =>
      prev.map((h) => {
        if (h.id === homeworkId) {
          return {
            ...h,
            checklist: h.checklist.map((c) =>
              c.id === checklistId ? { ...c, done: !c.done } : c
            ),
          };
        }
        return h;
      })
    );
  };

  // Handlers for Timetable
  const handleOpenAddScheduleItem = (
    day?: DayOfWeek,
    session?: 'morning' | 'afternoon' | 'evening'
  ) => {
    setEditingScheduleItem(null);
    if (day) setScheduleDefaultDay(day);
    if (session) setScheduleDefaultSession(session);
    setIsScheduleModalOpen(true);
  };

  const handleEditScheduleItem = (item: ScheduleItem) => {
    setEditingScheduleItem(item);
    setIsScheduleModalOpen(true);
  };

  const handleSaveScheduleItem = (savedItem: ScheduleItem) => {
    setSchedule((prev) => {
      const exists = prev.some((s) => s.id === savedItem.id);
      if (exists) {
        return prev.map((s) => (s.id === savedItem.id ? savedItem : s));
      }
      return [...prev, savedItem];
    });
  };

  const handleDeleteScheduleItem = (id: string) => {
    setSchedule((prev) => prev.filter((s) => s.id !== id));
  };

  const handleResetDefaultSchedule = () => {
    setSchedule(DEFAULT_SCHEDULE);
  };

  // Sound toggle
  const handleToggleSound = () => {
    setSettings((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] text-[#2D3436]">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingHomeworkCount={pendingHomeworkCount}
        urgentCount={urgentCount}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        onOpenAddHomework={handleOpenAddHomework}
        onOpenSettings={() => setIsNotificationModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Today's friendly summary card */}
        <TodayBanner
          schedule={schedule}
          homeworks={homeworks}
          subjects={GRADE_7_SUBJECTS}
          onNavigateToHomework={() => setActiveTab('homework')}
          onNavigateToSchedule={() => setActiveTab('timetable')}
          onNavigateToPomodoro={() => setActiveTab('pomodoro')}
        />

        {/* Tab Views */}
        {activeTab === 'timetable' && (
          <TimetableTab
            schedule={schedule}
            subjects={GRADE_7_SUBJECTS}
            onAddScheduleItem={handleOpenAddScheduleItem}
            onEditScheduleItem={handleEditScheduleItem}
            onDeleteScheduleItem={handleDeleteScheduleItem}
            onResetDefaultSchedule={handleResetDefaultSchedule}
          />
        )}

        {activeTab === 'homework' && (
          <HomeworkTab
            homeworks={homeworks}
            subjects={GRADE_7_SUBJECTS}
            soundEnabled={settings.soundEnabled}
            onAddHomework={handleOpenAddHomework}
            onEditHomework={handleEditHomework}
            onDeleteHomework={handleDeleteHomework}
            onToggleComplete={handleToggleHomeworkComplete}
            onToggleChecklistItem={handleToggleChecklistItem}
          />
        )}

        {activeTab === 'pomodoro' && (
          <PomodoroTimer
            subjects={GRADE_7_SUBJECTS}
            soundEnabled={settings.soundEnabled}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E0E6ED] bg-white/80 py-6 text-center text-xs text-[#636E72]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold text-[#2D3436]">
            Lịch Học Lớp 7 — Chương trình Giáo dục phổ thông mới (GDPT 2018)
          </p>
          <p className="text-[#636E72]">
            Học tập chủ động • Hoàn thành bài tập đúng hạn • Rèn luyện tính kỷ luật
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AddHomeworkModal
        isOpen={isHomeworkModalOpen}
        onClose={() => setIsHomeworkModalOpen(false)}
        onSave={handleSaveHomework}
        subjects={GRADE_7_SUBJECTS}
        initialData={editingHomework}
      />

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSave={handleSaveScheduleItem}
        subjects={GRADE_7_SUBJECTS}
        initialData={editingScheduleItem}
        defaultDay={scheduleDefaultDay}
        defaultSession={scheduleDefaultSession}
      />

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        homeworks={homeworks}
        schedule={schedule}
        subjects={GRADE_7_SUBJECTS}
        onNavigateToHomework={() => setActiveTab('homework')}
      />
    </div>
  );
}
