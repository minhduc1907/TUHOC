import { DayOfWeek, HomeworkItem, ScheduleItem, Subject } from '../types';

export const GRADE_7_SUBJECTS: Subject[] = [
  {
    id: 'math',
    name: 'Toán học',
    shortName: 'Toán',
    color: 'blue',
    textColor: 'text-blue-700',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconName: 'Calculator',
  },
  {
    id: 'literature',
    name: 'Ngữ văn',
    shortName: 'Văn',
    color: 'amber',
    textColor: 'text-amber-700',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconName: 'BookOpen',
  },
  {
    id: 'english',
    name: 'Tiếng Anh',
    shortName: 'T.Anh',
    color: 'emerald',
    textColor: 'text-emerald-700',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    iconName: 'Languages',
  },
  {
    id: 'science',
    name: 'Khoa học tự nhiên',
    shortName: 'KHTN',
    color: 'cyan',
    textColor: 'text-cyan-700',
    bgLight: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    iconName: 'Atom',
  },
  {
    id: 'history_geo',
    name: 'Lịch sử & Địa lí',
    shortName: 'Sử - Địa',
    color: 'rose',
    textColor: 'text-rose-700',
    bgLight: 'bg-rose-50',
    borderColor: 'border-rose-200',
    iconName: 'Compass',
  },
  {
    id: 'civics',
    name: 'Giáo dục công dân',
    shortName: 'GDCD',
    color: 'violet',
    textColor: 'text-violet-700',
    bgLight: 'bg-violet-50',
    borderColor: 'border-violet-200',
    iconName: 'ShieldCheck',
  },
  {
    id: 'informatics',
    name: 'Tin học',
    shortName: 'Tin',
    color: 'indigo',
    textColor: 'text-indigo-700',
    bgLight: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    iconName: 'Laptop',
  },
  {
    id: 'technology',
    name: 'Công nghệ',
    shortName: 'C.Nghệ',
    color: 'teal',
    textColor: 'text-teal-700',
    bgLight: 'bg-teal-50',
    borderColor: 'border-teal-200',
    iconName: 'Wrench',
  },
  {
    id: 'pe',
    name: 'Giáo dục thể chất',
    shortName: 'Thể dục',
    color: 'orange',
    textColor: 'text-orange-700',
    bgLight: 'bg-orange-50',
    borderColor: 'border-orange-200',
    iconName: 'Activity',
  },
  {
    id: 'arts',
    name: 'Nghệ thuật (Âm nhạc - Mỹ thuật)',
    shortName: 'Nghệ thuật',
    color: 'fuchsia',
    textColor: 'text-fuchsia-700',
    bgLight: 'bg-fuchsia-50',
    borderColor: 'border-fuchsia-200',
    iconName: 'Palette',
  },
  {
    id: 'experiential',
    name: 'Hoạt động trải nghiệm (HĐTN)',
    shortName: 'HĐTN',
    color: 'lime',
    textColor: 'text-lime-800',
    bgLight: 'bg-lime-50',
    borderColor: 'border-lime-200',
    iconName: 'Sparkles',
  },
  {
    id: 'self_study',
    name: 'Tự học & Ôn bài',
    shortName: 'Tự học',
    color: 'purple',
    textColor: 'text-purple-700',
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconName: 'GraduationCap',
  },
];

export const DAYS_OF_WEEK: { value: DayOfWeek; name: string; shortName: string }[] = [
  { value: 2, name: 'Thứ Hai', shortName: 'T2' },
  { value: 3, name: 'Thứ Ba', shortName: 'T3' },
  { value: 4, name: 'Thứ Tư', shortName: 'T4' },
  { value: 5, name: 'Thứ Năm', shortName: 'T5' },
  { value: 6, name: 'Thứ Sáu', shortName: 'T6' },
  { value: 7, name: 'Thứ Bảy', shortName: 'T7' },
  { value: 8, name: 'Chủ Nhật', shortName: 'CN' },
];

export const PERIOD_TIMES = [
  { session: 'morning', period: 1, label: 'Tiết 1', start: '07:15', end: '08:00' },
  { session: 'morning', period: 2, label: 'Tiết 2', start: '08:05', end: '08:50' },
  { session: 'morning', period: 3, label: 'Tiết 3', start: '09:05', end: '09:50' },
  { session: 'morning', period: 4, label: 'Tiết 4', start: '09:55', end: '10:40' },
  { session: 'morning', period: 5, label: 'Tiết 5', start: '10:45', end: '11:30' },
  { session: 'afternoon', period: 1, label: 'Tiết 1 (Chiều)', start: '13:30', end: '14:15' },
  { session: 'afternoon', period: 2, label: 'Tiết 2 (Chiều)', start: '14:20', end: '15:05' },
  { session: 'afternoon', period: 3, label: 'Tiết 3 (Chiều)', start: '15:20', end: '16:05' },
  { session: 'evening', period: 1, label: 'Ca 1 (Tối)', start: '19:30', end: '20:30' },
  { session: 'evening', period: 2, label: 'Ca 2 (Tối)', start: '20:45', end: '21:45' },
];

// Helper to get formatted relative date
export function getRelativeDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Sample Schedule for a Vietnamese 7th Grader
export const DEFAULT_SCHEDULE: ScheduleItem[] = [
  // Thứ 2
  { id: 'sch_2_1', dayOfWeek: 2, session: 'morning', period: 1, periodLabel: 'Tiết 1', startTime: '07:15', endTime: '08:00', subjectId: 'experiential', room: 'Sân trường', notes: 'Chào cờ đầu tuần' },
  { id: 'sch_2_2', dayOfWeek: 2, session: 'morning', period: 2, periodLabel: 'Tiết 2', startTime: '08:05', endTime: '08:50', subjectId: 'math', room: 'Phòng 7A2', teacher: 'Thầy Tuấn', notes: 'Đại số: Tập hợp số hữu tỉ' },
  { id: 'sch_2_3', dayOfWeek: 2, session: 'morning', period: 3, periodLabel: 'Tiết 3', startTime: '09:05', endTime: '09:50', subjectId: 'math', room: 'Phòng 7A2', teacher: 'Thầy Tuấn', notes: 'Luyện tập cộng trừ số hữu tỉ' },
  { id: 'sch_2_4', dayOfWeek: 2, session: 'morning', period: 4, periodLabel: 'Tiết 4', startTime: '09:55', endTime: '10:40', subjectId: 'literature', room: 'Phòng 7A2', teacher: 'Cô Lan', notes: 'Đọc hiểu văn bản' },
  { id: 'sch_2_5', dayOfWeek: 2, session: 'morning', period: 5, periodLabel: 'Tiết 5', startTime: '10:45', endTime: '11:30', subjectId: 'english', room: 'Phòng Lab', teacher: 'Cô Mai', notes: 'Unit 1: Hobbies - Vocabulary' },
  { id: 'sch_2_eve', dayOfWeek: 2, session: 'evening', period: 1, periodLabel: 'Ca 1 (Tối)', startTime: '19:30', endTime: '20:30', subjectId: 'self_study', room: 'Góc học tập', notes: 'Làm bài tập Toán & soạn Văn' },

  // Thứ 3
  { id: 'sch_3_1', dayOfWeek: 3, session: 'morning', period: 1, periodLabel: 'Tiết 1', startTime: '07:15', endTime: '08:00', subjectId: 'science', room: 'Phòng Thực hành', teacher: 'Thầy Bình', notes: 'KHTN: Nguyên tử - Nguyên tố' },
  { id: 'sch_3_2', dayOfWeek: 3, session: 'morning', period: 2, periodLabel: 'Tiết 2', startTime: '08:05', endTime: '08:50', subjectId: 'science', room: 'Phòng Thực hành', teacher: 'Thầy Bình', notes: 'Thí nghiệm đo khối lượng' },
  { id: 'sch_3_3', dayOfWeek: 3, session: 'morning', period: 3, periodLabel: 'Tiết 3', startTime: '09:05', endTime: '09:50', subjectId: 'literature', room: 'Phòng 7A2', teacher: 'Cô Lan', notes: 'Thực hành Tiếng Việt' },
  { id: 'sch_3_4', dayOfWeek: 3, session: 'morning', period: 4, periodLabel: 'Tiết 4', startTime: '09:55', endTime: '10:40', subjectId: 'history_geo', room: 'Phòng 7A2', teacher: 'Thầy Hưng', notes: 'Lịch sử Châu Âu thời Trung đại' },
  { id: 'sch_3_5', dayOfWeek: 3, session: 'morning', period: 5, periodLabel: 'Tiết 5', startTime: '10:45', endTime: '11:30', subjectId: 'pe', room: 'Sân bóng', teacher: 'Thầy Dũng', notes: 'Chạy cự li ngắn & bóng đá' },
  { id: 'sch_3_eve', dayOfWeek: 3, session: 'evening', period: 1, periodLabel: 'Ca 1 (Tối)', startTime: '19:30', endTime: '20:30', subjectId: 'self_study', room: 'Góc học tập', notes: 'Ôn KHTN & học từ vựng Tiếng Anh' },

  // Thứ 4
  { id: 'sch_4_1', dayOfWeek: 4, session: 'morning', period: 1, periodLabel: 'Tiết 1', startTime: '07:15', endTime: '08:00', subjectId: 'english', room: 'Phòng 7A2', teacher: 'Cô Mai', notes: 'Grammar: Present Simple' },
  { id: 'sch_4_2', dayOfWeek: 4, session: 'morning', period: 2, periodLabel: 'Tiết 2', startTime: '08:05', endTime: '08:50', subjectId: 'english', room: 'Phòng 7A2', teacher: 'Cô Mai', notes: 'Speaking practice' },
  { id: 'sch_4_3', dayOfWeek: 4, session: 'morning', period: 3, periodLabel: 'Tiết 3', startTime: '09:05', endTime: '09:50', subjectId: 'math', room: 'Phòng 7A2', teacher: 'Thầy Tuấn', notes: 'Hình học: Góc ở vị trí đặc biệt' },
  { id: 'sch_4_4', dayOfWeek: 4, session: 'morning', period: 4, periodLabel: 'Tiết 4', startTime: '09:55', endTime: '10:40', subjectId: 'civics', room: 'Phòng 7A2', teacher: 'Cô Hoa', notes: 'Tự hào về truyền thống quê hương' },
  { id: 'sch_4_5', dayOfWeek: 4, session: 'morning', period: 5, periodLabel: 'Tiết 5', startTime: '10:45', endTime: '11:30', subjectId: 'arts', room: 'Phòng Âm nhạc', teacher: 'Thầy Phong', notes: 'Luyện thanh & tập hát' },

  // Thứ 5
  { id: 'sch_5_1', dayOfWeek: 5, session: 'morning', period: 1, periodLabel: 'Tiết 1', startTime: '07:15', endTime: '08:00', subjectId: 'literature', room: 'Phòng 7A2', teacher: 'Cô Lan', notes: 'Viết đoạn văn ghi lại cảm xúc' },
  { id: 'sch_5_2', dayOfWeek: 5, session: 'morning', period: 2, periodLabel: 'Tiết 2', startTime: '08:05', endTime: '08:50', subjectId: 'science', room: 'Phòng 7A2', teacher: 'Thầy Bình', notes: 'Sinh học: Tế bào và quang hợp' },
  { id: 'sch_5_3', dayOfWeek: 5, session: 'morning', period: 3, periodLabel: 'Tiết 3', startTime: '09:05', endTime: '09:50', subjectId: 'informatics', room: 'Phòng Máy 1', teacher: 'Thầy Minh', notes: 'Bảng tính điện tử (Excel)' },
  { id: 'sch_5_4', dayOfWeek: 5, session: 'morning', period: 4, periodLabel: 'Tiết 4', startTime: '09:55', endTime: '10:40', subjectId: 'technology', room: 'Phòng 7A2', teacher: 'Cô Thảo', notes: 'Trồng trọt trong nhà kính' },
  { id: 'sch_5_5', dayOfWeek: 5, session: 'morning', period: 5, periodLabel: 'Tiết 5', startTime: '10:45', endTime: '11:30', subjectId: 'history_geo', room: 'Phòng 7A2', teacher: 'Thầy Hưng', notes: 'Địa lí: Bản đồ khí hậu thế giới' },

  // Thứ 6
  { id: 'sch_6_1', dayOfWeek: 6, session: 'morning', period: 1, periodLabel: 'Tiết 1', startTime: '07:15', endTime: '08:00', subjectId: 'math', room: 'Phòng 7A2', teacher: 'Thầy Tuấn', notes: 'Tia phân giác của một góc' },
  { id: 'sch_6_2', dayOfWeek: 6, session: 'morning', period: 2, periodLabel: 'Tiết 2', startTime: '08:05', endTime: '08:50', subjectId: 'english', room: 'Phòng 7A2', teacher: 'Cô Mai', notes: 'Skills 1: Reading & Speaking' },
  { id: 'sch_6_3', dayOfWeek: 6, session: 'morning', period: 3, periodLabel: 'Tiết 3', startTime: '09:05', endTime: '09:50', subjectId: 'science', room: 'Phòng 7A2', teacher: 'Thầy Bình', notes: 'Vật lí: Tốc độ chuyển động' },
  { id: 'sch_6_4', dayOfWeek: 6, session: 'morning', period: 4, periodLabel: 'Tiết 4', startTime: '09:55', endTime: '10:40', subjectId: 'experiential', room: 'Phòng 7A2', teacher: 'Cô Lan', notes: 'Sinh hoạt lớp & đánh giá tuần' },
  { id: 'sch_6_5', dayOfWeek: 6, session: 'morning', period: 5, periodLabel: 'Tiết 5', startTime: '10:45', endTime: '11:30', subjectId: 'pe', room: 'Nhà thi đấu', teacher: 'Thầy Dũng', notes: 'Cầu lông & rèn luyện thể lực' },

  // Thứ 7
  { id: 'sch_7_1', dayOfWeek: 7, session: 'morning', period: 1, periodLabel: 'Tiết 1', startTime: '08:00', endTime: '09:30', subjectId: 'self_study', room: 'Thư viện / Góc học tập', notes: 'Ôn tập tổng hợp cuối tuần' },
  { id: 'sch_7_2', dayOfWeek: 7, session: 'morning', period: 2, periodLabel: 'Tiết 2', startTime: '09:45', endTime: '11:00', subjectId: 'english', room: 'Phòng tự học', notes: 'Luyện nghe & xem video tiếng Anh' },
];

// Sample Initial Homework for Grade 7
export const DEFAULT_HOMEWORKS: HomeworkItem[] = [
  {
    id: 'hw_math_1',
    title: 'Giải bài tập Số hữu tỉ & Phép tính',
    subjectId: 'math',
    description: 'Làm bài 1, 2, 3 trang 14 SGK Toán 7 tập 1. Nhớ trình bày từng bước tính cẩn thận, không rút gọn vội.',
    bookRef: 'SGK Toán 7 tập 1 - Trang 14',
    dueDate: getRelativeDate(1), // Ngày mai
    dueTime: '21:00',
    priority: 'high',
    status: 'in_progress',
    createdAt: new Date().toISOString(),
    checklist: [
      { id: 'chk_1', text: 'Bài 1: Phân số biểu diễn số hữu tỉ', done: true },
      { id: 'chk_2', text: 'Bài 2: So sánh hai số hữu tỉ âm', done: false },
      { id: 'chk_3', text: 'Bài 3: Bài toán thực tế tìm độ cao', done: false },
    ],
    notes: 'Kiểm tra lại dấu âm trước ngoặc',
  },
  {
    id: 'hw_lit_1',
    title: 'Soạn bài văn: Lời của cây',
    subjectId: 'literature',
    description: 'Đọc trước bài thơ Lời của cây (Trần Đăng Khoa), trả lời 4 câu hỏi phần Đọc - Hiểu văn bản vào vở soạn.',
    bookRef: 'SGK Ngữ văn 7 tập 1 - Trang 13-15',
    dueDate: getRelativeDate(2), // Ngày kia
    dueTime: '20:30',
    priority: 'medium',
    status: 'pending',
    createdAt: new Date().toISOString(),
    checklist: [
      { id: 'chk_lit_1', text: 'Đọc diễn cảm bài thơ 2 lần', done: false },
      { id: 'chk_lit_2', text: 'Gạch chân các biện pháp nhân hóa', done: false },
      { id: 'chk_lit_3', text: 'Viết câu trả lời vào vở soạn', done: false },
    ],
    notes: 'Cô Lan nhắc mang cả bút màu để highlight',
  },
  {
    id: 'hw_eng_1',
    title: 'Unit 1: Hobbies - Từ vựng & Bài tập ngữ pháp',
    subjectId: 'english',
    description: 'Học thuộc 15 từ vựng về sở thích (making models, ice-skating, gardening...). Hoàn thành bài 3, 4 trong sách bài tập (Workbook).',
    bookRef: 'Workbook Tiếng Anh 7 Global Success - Trang 6',
    dueDate: getRelativeDate(0), // Hôm nay cần nộp
    dueTime: '21:30',
    priority: 'high',
    status: 'pending',
    createdAt: new Date().toISOString(),
    checklist: [
      { id: 'chk_eng_1', text: 'Chép từ mới vào sổ tay từ vựng', done: true },
      { id: 'chk_eng_2', text: 'Làm bài 3 trang 6 SBT', done: false },
      { id: 'chk_eng_3', text: 'Làm bài 4 chia động từ thì hiện tại đơn', done: false },
    ],
    notes: 'Có bài kiểm tra 15 phút đầu giờ ngày mai',
  },
  {
    id: 'hw_sci_1',
    title: 'KHTN: Vẽ sơ đồ cấu tạo nguyên tử Heli & Carbon',
    subjectId: 'science',
    description: 'Vẽ mô hình cấu tạo nguyên tử gồm hạt nhân (proton, neutron) và lớp vỏ electron ra giấy A4.',
    bookRef: 'SGK KHTN 7 - Trang 22',
    dueDate: getRelativeDate(3),
    dueTime: '19:00',
    priority: 'low',
    status: 'completed',
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    checklist: [
      { id: 'chk_sci_1', text: 'Chuẩn bị giấy A4 và compa', done: true },
      { id: 'chk_sci_2', text: 'Vẽ hạt nhân và các vòng electron', done: true },
      { id: 'chk_sci_3', text: 'Ghi chú số hạt p, n, e', done: true },
    ],
    notes: 'Đã hoàn thành xuất sắc!',
  },
];

export const STUDY_TIPS = [
  {
    quote: 'Quy tắc 25 phút Pomodoro: Học tập trung 25 phút, nghỉ mắt 5 phút giúp não ghi nhớ lâu gấp 2 lần!',
    author: 'Bí quyết học giỏi Lớp 7',
  },
  {
    quote: 'Môn Toán lớp 7: Hãy vẽ hình to, rõ ràng và đánh dấu các góc bằng nhau để nhìn ra lời giải nhanh hơn.',
    author: 'Thầy giáo dạy Toán',
  },
  {
    quote: 'Học từ vựng Tiếng Anh theo cụm từ và đặt câu với sở thích của chính mình để không bao giờ quên.',
    author: 'Cô giáo Tiếng Anh',
  },
  {
    quote: 'Mỗi tối hãy dành 10 phút xem lại thời khóa biểu ngày mai để chuẩn bị sách vở sẵn sàng vào cặp.',
    author: 'Thói quen học sinh chăm ngoan',
  },
];
