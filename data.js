// LearnCare Chart — mock data
// Single global namespace so all babel scripts can read it.

window.LC = window.LC || {};

LC.school = {
  name: "○○중학교",
  classRoom: "2학년 3반",
  homeroom: "박선영 교사",
};

// ---------- students for 2-3 ----------
LC.students = [
  { id: "s01", name: "김민수", initials: "민수", color: "oklch(0.85 0.05 30)", status: "담임 확인 필요", state: "attention", note: "확인 필요" },
  { id: "s02", name: "이서연", initials: "서연", color: "oklch(0.85 0.05 155)", status: "회복 관찰", state: "positive" },
  { id: "s03", name: "박지훈", initials: "지훈", color: "oklch(0.85 0.05 250)", status: "관찰 중", state: "normal" },
  { id: "s04", name: "최유나", initials: "유나", color: "oklch(0.85 0.05 295)", status: "상담 모니터링", state: "info" },
  { id: "s05", name: "정도윤", initials: "도윤", color: "oklch(0.85 0.05 90)", status: "관찰 중", state: "normal" },
  { id: "s06", name: "한지민", initials: "지민", color: "oklch(0.85 0.05 200)", status: "관찰 중", state: "normal" },
  { id: "s07", name: "강예준", initials: "예준", color: "oklch(0.85 0.05 50)", status: "학습지원 검토", state: "attention" },
  { id: "s08", name: "윤서아", initials: "서아", color: "oklch(0.85 0.05 350)", status: "관찰 중", state: "normal" },
  { id: "s09", name: "임하준", initials: "하준", color: "oklch(0.85 0.05 130)", status: "관찰 중", state: "normal" },
  { id: "s10", name: "오지원", initials: "지원", color: "oklch(0.85 0.05 270)", status: "회복 관찰", state: "positive" },
  { id: "s11", name: "송채은", initials: "채은", color: "oklch(0.85 0.05 20)", status: "관찰 중", state: "normal" },
  { id: "s12", name: "장태민", initials: "태민", color: "oklch(0.85 0.05 180)", status: "관찰 중", state: "normal" },
  { id: "s13", name: "조시현", initials: "시현", color: "oklch(0.85 0.05 60)", status: "관찰 중", state: "normal" },
  { id: "s14", name: "권나윤", initials: "나윤", color: "oklch(0.85 0.05 280)", status: "복지/돌봄 확인", state: "info" },
  { id: "s15", name: "신주원", initials: "주원", color: "oklch(0.85 0.05 110)", status: "관찰 중", state: "normal" },
  { id: "s16", name: "백서윤", initials: "서윤", color: "oklch(0.85 0.05 320)", status: "관찰 중", state: "normal" },
  { id: "s17", name: "남현우", initials: "현우", color: "oklch(0.85 0.05 240)", status: "관찰 중", state: "normal" },
  { id: "s18", name: "유다은", initials: "다은", color: "oklch(0.85 0.05 40)", status: "관찰 중", state: "normal" },
  { id: "s19", name: "홍지안", initials: "지안", color: "oklch(0.85 0.05 170)", status: "관찰 중", state: "normal" },
  { id: "s20", name: "전이안", initials: "이안", color: "oklch(0.85 0.05 305)", status: "관찰 중", state: "normal" },
];

// ---------- 빠른 태그 ----------
LC.quickTags = [
  { id: "miss-present", label: "발표 미참여", tone: "alert" },
  { id: "miss-hw", label: "과제 미제출", tone: "alert" },
  { id: "low-activity", label: "활동 저하", tone: "attention" },
  { id: "concept", label: "기초 개념 어려움", tone: "attention" },
  { id: "positive", label: "긍정 변화", tone: "positive" },
  { id: "recovery", label: "회복 조짐", tone: "positive" },
];

// ---------- 수업 기록 시드 데이터 ----------
// 5월 20일 3교시 · 국어 발표 활동
LC.classRecord = {
  subject: "국어",
  activity: "발표 활동",
  date: "2026.05.20",
  period: "3교시",
  teacher: "김지영 교사",
  template: "발표 활동",
  entries: LC.students.map((s) => {
    // seed a few specific entries
    if (s.id === "s01") return { studentId: s.id, presentation: "miss", homework: "miss", participation: "partial", tags: ["low-activity"], memo: "준비 부족" };
    if (s.id === "s02") return { studentId: s.id, presentation: "present", homework: "submit", participation: "full", tags: ["positive"], memo: "발표 적극적" };
    if (s.id === "s03") return { studentId: s.id, presentation: "present", homework: "miss", participation: "partial", tags: ["miss-hw"], memo: "" };
    if (s.id === "s07") return { studentId: s.id, presentation: "present", homework: "submit", participation: "partial", tags: ["concept"], memo: "" };
    return { studentId: s.id, presentation: "present", homework: "submit", participation: "full", tags: [], memo: "" };
  }),
};

// ---------- 같은 분반 — 최근 차시 ----------
LC.lessonSubject = {
  subject: "국어",
  className: "2학년 3반",
  teacher: "김지영 교사",
  classroom: "2-3 교실",
  studentCount: 20,
};
LC.lessonSessions = [
  { id: "L20", date: "5/20", weekday: "수", period: "3교시", topic: "발표 활동 1차", current: true,  recorded: 20, signals: 4 },
  { id: "L17", date: "5/17", weekday: "일", period: "3교시", topic: "모둠 토론 — 도서별",         recorded: 20, signals: 2 },
  { id: "L13", date: "5/13", weekday: "수", period: "3교시", topic: "독서 감상 발표",             recorded: 20, signals: 3 },
  { id: "L10", date: "5/10", weekday: "일", period: "3교시", topic: "단원 정리 · 활동지",         recorded: 20, signals: 1 },
  { id: "L07", date: "5/07", weekday: "목", period: "3교시", topic: "글쓰기 활동",                recorded: 20, signals: 2 },
  { id: "L03", date: "5/03", weekday: "일", period: "3교시", topic: "수업 안내 / 사전 진단",      recorded: 20, signals: 0 },
];

// ---------- 수행평가 ----------
// 점수 시드: 평균 잘 잡히도록 학생별로 다르게.
function _mk(rb1, rb2, rb3, rb4, rb5) {
  return { rb1, rb2, rb3, rb4, rb5 };
}
LC.assessment = {
  id: "PA1",
  name: "독서 발표 수행평가 1차",
  subject: "국어",
  area: "듣기·말하기",
  weight: "1학기 반영 30%",
  total: 30,
  period: "2026.04.27 ~ 2026.05.18",
  scored: 18,
  rubric: [
    { id: "rb1", name: "발표 구성력", desc: "주장–근거 구조, 흐름의 짜임",  max: 8 },
    { id: "rb2", name: "자료 활용",   desc: "예시·인용·시각자료의 적절성",  max: 6 },
    { id: "rb3", name: "전달력",      desc: "목소리·시선·속도·어투",       max: 6 },
    { id: "rb4", name: "내용 이해도", desc: "질문 응답의 정확성·심화",     max: 6 },
    { id: "rb5", name: "준비 과정",   desc: "사전 보고서·모둠 기여",       max: 4 },
  ],
  // 학생 id → 항목별 점수 (null = 미채점)
  scores: {
    s01: _mk(3, 2, 3, 3, 1),   // 김민수 — 구성력·자료 활용·준비 약점, 신호 트리거
    s02: _mk(8, 6, 6, 6, 4),   // 이서연 — 만점
    s03: _mk(6, 4, 4, 5, 3),
    s04: _mk(5, 5, 4, 4, 3),
    s05: _mk(7, 5, 5, 5, 4),
    s06: _mk(6, 4, 5, 5, 3),
    s07: _mk(4, 3, 3, 3, 2),   // 강예준 — 학습지원 검토, 항목 전반 낮음
    s08: _mk(7, 5, 5, 4, 4),
    s09: _mk(6, 5, 5, 5, 3),
    s10: _mk(7, 5, 6, 5, 4),
    s11: _mk(6, 5, 4, 4, 3),
    s12: _mk(5, 4, 4, 4, 3),
    s13: _mk(6, 4, 5, 5, 3),
    s14: _mk(5, 4, 4, 4, 2),   // 권나윤 — 준비 항목 낮음
    s15: _mk(6, 5, 5, 5, 3),
    s16: _mk(7, 5, 5, 5, 4),
    s17: _mk(6, 5, 4, 5, 3),
    s18: _mk(5, 4, 4, 4, 3),
    // s19, s20 — 미채점
    s19: null,
    s20: null,
  },
  signalRules: [
    { id: "sr1", text: "총점이 만점의 50% 미만이면 '학습 어려움' 신호로 전달", tone: "alert" },
    { id: "sr2", text: "특정 항목이 평균 대비 −2점 이상이면 '특정 영역 약점' 신호", tone: "attention" },
    { id: "sr3", text: "전달력/구성력 항목이 25% 이하면 '발표 부담' 신호", tone: "attention" },
  ],
};

// ---------- 과제 ----------
LC.assignments = [
  { id: "a1", title: "독서 감상문 1편",        due: "5/22", relatedAssessment: "PA1", total: 20, submitted: 16, late: 2, missing: 2, status: "진행 중" },
  { id: "a2", title: "발표 사전 보고서",       due: "5/15", relatedAssessment: "PA1", total: 20, submitted: 18, late: 1, missing: 1, status: "마감" },
  { id: "a3", title: "단원 학습 활동지 3",     due: "5/27", relatedAssessment: null,  total: 20, submitted: 5,  late: 0, missing: 0, status: "진행 중" },
  { id: "a4", title: "어휘력 점검 워크북",     due: "5/10", relatedAssessment: null,  total: 20, submitted: 17, late: 2, missing: 1, status: "마감" },
];

// 김민수 / 강예준 미제출 분포
LC.assignmentStatusByStudent = {
  a1: { s01: "miss", s03: "miss", s07: "late", s14: "late" },
  a2: { s01: "late", s07: "miss" },
  a3: { /* 진행 중 */ },
  a4: { s01: "miss", s14: "late", s07: "late" },
};

// ---------- 김민수 — 이벤트 타임라인 / 트렌드 ----------
LC.kimminsu = {
  id: "s01",
  name: "김민수",
  cls: "2-3",
  status: "담임 확인 필요",
  state: "attention",
  lastUpdate: "2026.05.20",
  homeroom: "박선영",
  // 6주 시리즈: 참여 / 제출 / 출결 / 성취도 (0-100)
  trend: {
    weeks: ["4월 4주", "5월 1주", "5월 2주", "5월 3주", "5월 4주", "최근"],
    participation: [82, 78, 70, 60, 52, 48],
    submission:    [88, 85, 78, 65, 55, 50],
    attendance:    [98, 96, 96, 94, 95, 94],
    achievement:   [76, 74, 72, 68, 66, 64],
  },
  events: [
    { date: "5/20", subject: "국어", record: "발표 미참여", signal: "발표 참여 감소", tone: "alert" },
    { date: "5/19", subject: "수학", record: "과제 미제출", signal: "제출 리듬 저하", tone: "alert" },
    { date: "5/17", subject: "영어", record: "활동지 지연", signal: "수업 참여 저하", tone: "attention" },
    { date: "5/15", subject: "출결", record: "지각 없음", signal: "출결 안정", tone: "muted" },
    { date: "5/14", subject: "사회", record: "토론 부분 참여", signal: "활동 저하", tone: "attention" },
    { date: "5/13", subject: "수학", record: "과제 지연 제출", signal: "제출 리듬 저하", tone: "attention" },
    { date: "5/10", subject: "국어", record: "발표 미참여", signal: "발표 참여 감소", tone: "alert" },
    { date: "5/08", subject: "과학", record: "실험 참여", signal: "정상 참여", tone: "muted" },
    { date: "5/02", subject: "수학", record: "수행평가 부분 참여", signal: "기초 개념 어려움 가능", tone: "attention" },
  ],
  supportHistory: [
    { date: "5/20", who: "박선영 담임", kind: "확인", note: "수업 기록 신호 누적 — 주간 브리핑에 표시" },
    { date: "5/15", who: "박선영 담임", kind: "관찰", note: "학습 부담 가능성 — 1주 추가 관찰 후 상담 결정" },
  ],
  nextCheck: "2026.05.27",
  aiSummary:
    "최근 3주간 수학·국어·영어에서 과제 제출과 발표 참여가 함께 감소했습니다. 출결 변화는 크지 않아 생활 리듬보다는 학습 부담 또는 동기 변화 여부를 먼저 확인할 필요가 있습니다.",
  checkPoints: [
    "특정 과목 학습 공백 (수학)",
    "전반적 학습 리듬 변화",
    "발표·활동 부담",
    "학교 밖 일정 변화",
    "생활 리듬 변화",
    "정서·관계 이슈 가능성",
  ],
  questions: [
    "최근 과제 제출이 어려웠던 이유가 있었어?",
    "특정 과목만 힘든지, 전반적으로 힘든지 같이 확인해볼까?",
    "발표나 활동 참여가 부담스러웠던 이유가 있었어?",
    "요즘 생활 리듬이나 수면은 괜찮아?",
    "학교 밖 일정에 변화가 있었어?",
  ],
  cautions: [
    { avoid: "왜 이렇게 안 했어?", instead: "어떤 부분이 어려웠어?" },
    { avoid: "태도가 안 좋아졌다", instead: "최근 참여가 줄어든 것 같아 보여서 확인하고 싶었어." },
    { avoid: "다른 애들은 다 하는데", instead: "지금 너에게 가장 부담되는 게 뭐야?" },
  ],
};

// ---------- 주간 브리핑 카드 ----------
LC.briefingCards = [
  {
    studentId: "s01", name: "김민수", state: "attention", statusLabel: "담임 확인 필요",
    summary: "최근 2주간 국어·수학·영어에서 제출/발표 신호 감소",
    signals: [
      { subject: "국어", text: "발표 미참여 2회" },
      { subject: "수학", text: "과제 미제출 2회" },
      { subject: "영어", text: "활동지 지연 1회" },
    ],
    actions: ["chart", "counseling", "monitor"],
  },
  {
    studentId: "s07", name: "강예준", state: "attention", statusLabel: "학습지원 검토",
    summary: "수학에서 기초 개념 어려움 신호 반복",
    signals: [
      { subject: "수학", text: "수행평가 부분 참여 2회" },
      { subject: "수학", text: "기초 개념 어려움 태그 3회" },
    ],
    actions: ["chart", "support", "monitor"],
  },
  {
    studentId: "s04", name: "최유나", state: "info", statusLabel: "상담 모니터링",
    summary: "상담 후 2주차 — 발표 참여 안정세, 제출 지연 1회",
    signals: [
      { subject: "전체", text: "발표 참여 안정" },
      { subject: "사회", text: "과제 지연 1회" },
    ],
    actions: ["chart", "monitor"],
  },
  {
    studentId: "s14", name: "권나윤", state: "info", statusLabel: "복지/돌봄 확인",
    summary: "지각 패턴 변화 + 활동 저하 — 복지 확인 진행 중",
    signals: [
      { subject: "출결", text: "지각 3회" },
      { subject: "전체", text: "활동 저하 태그 2회" },
    ],
    actions: ["chart", "monitor"],
  },
  {
    studentId: "s02", name: "이서연", state: "positive", statusLabel: "회복 신호",
    summary: "지난 2주 대비 발표·제출 회복",
    signals: [
      { subject: "국어", text: "발표 적극 3회" },
      { subject: "전체", text: "긍정 변화 태그 2회" },
    ],
    actions: ["chart"],
  },
  {
    studentId: "s10", name: "오지원", state: "positive", statusLabel: "회복 신호",
    summary: "지원 연결 후 활동 참여 안정",
    signals: [
      { subject: "수학", text: "수행평가 참여" },
      { subject: "영어", text: "발표 참여 회복" },
    ],
    actions: ["chart"],
  },
];

LC.briefingKpis = [
  { label: "확인 필요", value: 5, tone: "attention", desc: "여러 과목에서 변화가 감지된 학생" },
  { label: "회복 신호", value: 2, tone: "positive", desc: "최근 제출·참여가 회복된 학생" },
  { label: "상담 모니터링", value: 2, tone: "info", desc: "상담 또는 지원 연결 후 추적 중" },
  { label: "후속조치 지연", value: 1, tone: "alert", desc: "다음 확인일이 지난 케이스" },
];

LC.changeTypes = [
  { id: "multi-subject", label: "여러 과목 참여 감소", count: 3 },
  { id: "single-subject", label: "특정 과목 반복 어려움", count: 2 },
  { id: "attendance", label: "출결+제출 동시 변화", count: 1 },
  { id: "recovery", label: "회복 신호", count: 2 },
];

// ---------- 지원 케이스 (칸반) ----------
LC.cases = [
  { id: "c1",  name: "김민수", cls: "2-3", state: "담임 확인 필요", owner: "박선영 담임", next: "5/27", summary: "여러 과목 제출·발표 감소" },
  { id: "c2",  name: "강예준", cls: "2-3", state: "기초학력 지원 검토", owner: "김도훈 기초학력", next: "5/24", summary: "수학 기초 개념 어려움 반복" },
  { id: "c3",  name: "최유나", cls: "2-3", state: "상담교사 확인 중", owner: "이수진 상담", next: "5/26", summary: "활동 저하 → 상담 2회차" },
  { id: "c4",  name: "권나윤", cls: "2-3", state: "복지/돌봄 확인 요청", owner: "정민지 복지사", next: "5/22", summary: "출결·활동 변화 동시" },
  { id: "c5",  name: "오지원", cls: "2-3", state: "모니터링 중", owner: "박선영 담임", next: "5/30", summary: "지원 연결 후 회복 관찰" },
  { id: "c6",  name: "이도현", cls: "2-1", state: "상담교사 확인 요청", owner: "이수진 상담", next: "5/23", summary: "발표 거부 신호 누적" },
  { id: "c7",  name: "박서영", cls: "2-1", state: "지역자원 연계 검토", owner: "정민지 복지사", next: "5/25", summary: "방과후 돌봄 공백 가능" },
  { id: "c8",  name: "조윤호", cls: "2-2", state: "기초학력 지원 중", owner: "김도훈 기초학력", next: "5/28", summary: "수학·영어 학습지원 3주차" },
  { id: "c9",  name: "한도현", cls: "2-2", state: "회복 관찰", owner: "박선영 담임", next: "6/02", summary: "상담 후 참여 회복세" },
  { id: "c10", name: "윤채린", cls: "2-3", state: "상담 완료", owner: "이수진 상담", next: "—", summary: "정서지원 1회 후 종결" },
  { id: "c11", name: "임수아", cls: "2-1", state: "지역자원 연계 완료", owner: "정민지 복지사", next: "6/05", summary: "청소년상담복지센터 연계" },
];

LC.caseStates = [
  "담임 확인 필요",
  "상담교사 확인 요청",
  "상담교사 확인 중",
  "기초학력 지원 검토",
  "기초학력 지원 중",
  "복지/돌봄 확인 요청",
  "지역자원 연계 검토",
  "지역자원 연계 완료",
  "모니터링 중",
  "회복 관찰",
  "상담 완료",
];

// ---------- 지역자원 ----------
LC.resources = [
  { id: "r1",  name: "○○청소년상담복지센터",   type: "상담", subtype: "정서지원", distance: 1.8, hours: "평일 09:00–18:00", source: "한국청소년상담복지개발원", reason: "발표·활동 참여 저하 신호와 연결 가능한 상담 자원", x: 38, y: 42 },
  { id: "r2",  name: "△△기초학력지원센터",     type: "학습", subtype: "기초학력", distance: 2.4, hours: "평일 10:00–19:00", source: "교육부 기초학력지원시스템", reason: "수학·국어 기초 개념 보강 1:1 멘토링 가능", x: 56, y: 34 },
  { id: "r3",  name: "□□지역아동센터",         type: "돌봄", subtype: "방과후", distance: 0.9, hours: "평일 13:00–20:00", source: "보건복지부 사회보장정보원", reason: "방과후 학습+돌봄 동시 지원 가능", x: 48, y: 60 },
  { id: "r4",  name: "○○Wee센터",              type: "상담", subtype: "위기지원", distance: 3.2, hours: "평일 09:00–18:00", source: "교육부 학생정신건강지원센터", reason: "전문 상담 의뢰 필요 시 연계", x: 22, y: 52 },
  { id: "r5",  name: "○○구 청소년수련관",       type: "활동", subtype: "동아리", distance: 2.1, hours: "평일 10:00–22:00", source: "여성가족부 청소년활동진흥원", reason: "활동·관계 회복 자원", x: 66, y: 56 },
  { id: "r6",  name: "△△진로직업체험센터",     type: "진로", subtype: "체험", distance: 4.5, hours: "평일 09:00–17:00", source: "교육부 진로정보망", reason: "진로 동기 회복 가능 자원", x: 76, y: 32 },
  { id: "r7",  name: "○○복지관 청소년사업팀",   type: "복지", subtype: "사례관리", distance: 1.2, hours: "평일 09:00–18:00", source: "보건복지부 사회복지시설정보시스템", reason: "복지·돌봄 사례관리 의뢰", x: 32, y: 26 },
  { id: "r8",  name: "○○도서관 학습공간",       type: "학습", subtype: "자기주도", distance: 0.6, hours: "평일 09:00–21:00", source: "국립중앙도서관 공공데이터", reason: "방과후 자기주도 학습 공간", x: 50, y: 50 },
];

LC.resourceTypeColor = {
  "상담": "oklch(0.55 0.16 295)",
  "학습": "oklch(0.55 0.12 230)",
  "돌봄": "oklch(0.55 0.10 155)",
  "복지": "oklch(0.55 0.13 25)",
  "활동": "oklch(0.55 0.12 60)",
  "진로": "oklch(0.55 0.12 200)",
};

// ---------- 관리자/교육청 ----------
LC.adminKpis = [
  { label: "담임 확인 대기",   value: 128, meta: "지난 주 대비 +12",  tone: "attention" },
  { label: "상담 연계 대기",   value: 42,  meta: "지난 주 대비 +5",   tone: "alert" },
  { label: "학습지원 미연계", value: 61,  meta: "지난 주 대비 −3",   tone: "attention" },
  { label: "연계 완료율",     value: "72%", meta: "지난 분기 65%",   tone: "positive" },
  { label: "후속조치 지연",   value: 9,   meta: "다음 확인일 경과", tone: "alert" },
];

LC.schoolsGap = [
  { school: "A중학교", region: "○○구",  gap: 82, primary: "상담",     need: "청소년상담",     students: 412, change: +6 },
  { school: "B고등학교", region: "○○구", gap: 74, primary: "학습지원", need: "기초학력/멘토링", students: 631, change: +2 },
  { school: "C중학교", region: "△△구",  gap: 69, primary: "돌봄",     need: "지역아동센터",    students: 388, change: -3 },
  { school: "D중학교", region: "△△구",  gap: 58, primary: "복지",     need: "복지관 연계",     students: 401, change: +1 },
  { school: "E고등학교", region: "□□구", gap: 55, primary: "상담",     need: "Wee센터 추가",    students: 705, change: -4 },
  { school: "F중학교", region: "○○구",  gap: 47, primary: "활동",     need: "청소년수련관",    students: 356, change: -2 },
  { school: "G초등학교", region: "△△구", gap: 41, primary: "돌봄",     need: "방과후 돌봄",     students: 522, change: +0 },
  { school: "H중학교", region: "□□구",  gap: 38, primary: "학습지원", need: "멘토링",          students: 298, change: -1 },
];

LC.regionMap = [
  { region: "○○구", gap: 71, schools: 12, resources: 9,  shortage: ["상담", "활동"] },
  { region: "△△구", gap: 64, schools: 14, resources: 11, shortage: ["돌봄"] },
  { region: "□□구", gap: 49, schools: 9,  resources: 14, shortage: [] },
  { region: "◇◇구", gap: 58, schools: 11, resources: 8,  shortage: ["학습", "상담"] },
];

// ---------- helpers ----------
LC.toneStyles = {
  attention: { bg: "var(--attention-bg)", border: "var(--attention-border)", text: "oklch(0.40 0.10 60)" },
  alert:     { bg: "var(--alert-bg)",     border: "var(--alert-border)",     text: "oklch(0.42 0.13 25)" },
  positive:  { bg: "var(--positive-bg)",  border: "var(--positive-border)",  text: "oklch(0.38 0.09 155)" },
  info:      { bg: "var(--info-bg)",      border: "oklch(0.86 0.06 230)",    text: "oklch(0.36 0.10 230)" },
  normal:    { bg: "var(--surface)",      border: "var(--border)",           text: "var(--text-soft)" },
  muted:     { bg: "var(--bg-soft)",      border: "var(--border)",           text: "var(--muted)" },
};

// ============================================================
// 페르소나 모델 — 한 교사가 동시에 여러 업무 컨텍스트를 가질 수 있음
// ============================================================
// 역할(role)이 아니라 "배정(assignment) + 권한(permission)"의 조합으로 UI를 만든다.
// 데모용 perspective 스위처는 유지하되, 각 페르소나가 multi-context를 가진다.
LC.personas = [
  {
    id: "kim",
    name: "김지영",
    title: "교사",
    avatar: "김",
    school: "○○중학교",
    primaryContext: "course",
    assignments: {
      homerooms: [],
      courses: [
        { id: "cs-국어-2-3", subject: "국어", section: "2-3", students: 20, room: "2-3 교실" },
        { id: "cs-국어-2-4", subject: "국어", section: "2-4", students: 23, room: "2-4 교실" },
        { id: "cs-국어-2-6", subject: "국어", section: "2-6", students: 23, room: "2-6 교실" },
      ],
    },
    permissions: { schoolAdmin: false, districtAdmin: false },
    today: {
      schedule: [
        { period: "2교시", course: "국어 · 2-3", state: "recorded", signals: 2 },
        { period: "3교시", course: "국어 · 2-6", state: "current", signals: 0 },
        { period: "5교시", course: "국어 · 2-4", state: "upcoming", signals: 0 },
      ],
      mySignalsSent: 5,
      mySignalsAck: 3,
    },
  },
  {
    id: "park",
    name: "박선영",
    title: "교사",
    avatar: "박",
    school: "○○중학교",
    primaryContext: "homeroom",
    assignments: {
      homerooms: [{ id: "hr-2-3", name: "2학년 3반", classCode: "2-3", students: 20 }],
      courses: [
        { id: "cs-도덕-2-3", subject: "도덕", section: "2-3", students: 20 },
        { id: "cs-도덕-2-4", subject: "도덕", section: "2-4", students: 23 },
        { id: "cs-도덕-2-5", subject: "도덕", section: "2-5", students: 22 },
        { id: "cs-도덕-2-6", subject: "도덕", section: "2-6", students: 23 },
      ],
    },
    permissions: { schoolAdmin: false, districtAdmin: false },
    today: {
      schedule: [
        { period: "1교시", course: "도덕 · 2-4", state: "recorded", signals: 1 },
        { period: "4교시", course: "도덕 · 2-3", state: "current", signals: 0 },
      ],
      briefing: { changes: 5, recovery: 2, needsCheck: 2, overdue: 1 },
      pendingCases: 3,
    },
  },
  {
    id: "choi",
    name: "최은호",
    title: "교사",
    avatar: "최",
    school: "○○중학교",
    primaryContext: "homeroom",
    badges: ["담임", "교과", "학교 관리자"],
    assignments: {
      homerooms: [{ id: "hr-1-2", name: "1학년 2반", classCode: "1-2", students: 23 }],
      courses: [
        { id: "cs-수학-1-2", subject: "수학", section: "1-2", students: 23 },
        { id: "cs-수학-1-5", subject: "수학", section: "1-5", students: 23 },
        { id: "cs-수학-1-6", subject: "수학", section: "1-6", students: 22 },
      ],
    },
    permissions: { schoolAdmin: true, districtAdmin: false },
    today: {
      schedule: [
        { period: "2교시", course: "수학 · 1-5", state: "recorded", signals: 3 },
        { period: "4교시", course: "수학 · 1-2", state: "current", signals: 0 },
        { period: "6교시", course: "수학 · 1-6", state: "upcoming", signals: 0 },
      ],
      briefing: { changes: 3, recovery: 1, needsCheck: 1, overdue: 0 },
      pendingCases: 2,
      adminAlerts: 3, // 미연계 케이스 + 활동 저조 교사
    },
  },
  {
    id: "lee",
    name: "이정훈",
    title: "교감",
    avatar: "이",
    school: "○○중학교",
    primaryContext: "schoolAdmin",
    assignments: { homerooms: [], courses: [] },
    permissions: { schoolAdmin: true, districtAdmin: false },
    today: {
      adminAlerts: 7,
      pendingReports: 2,
    },
  },
  {
    id: "han",
    name: "한지석",
    title: "장학사",
    avatar: "한",
    school: "○○교육지원청 학생지원과",
    primaryContext: "districtAdmin",
    assignments: { homerooms: [], courses: [] },
    permissions: { schoolAdmin: false, districtAdmin: true },
    today: {
      districtAlerts: 4,
      pendingReports: 1,
    },
  },
];

// 페르소나별로 capability 계산 (UI 자동 생성에 사용)
LC.personaCapabilities = function(p) {
  return {
    hasCourses: p.assignments.courses.length > 0,
    hasHomeroom: p.assignments.homerooms.length > 0,
    canManageSchool: !!p.permissions.schoolAdmin,
    canManageDistrict: !!p.permissions.districtAdmin,
  };
};

// ============================================================
// 교과교사 — 내가 올린 신호 / 학생별 기록 조회
// ============================================================
LC.mySignals = [
  {
    id: "sg-101", date: "5/20", time: "10:32", course: "국어 · 2-3",
    student: "김민수", studentId: "s01",
    category: "참여 변화", weight: "alert",
    text: "발표 미참여 · 활동 저조 태그 — 최근 3주 4회 반복",
    routedTo: "박선영 담임", status: "담임 확인됨",
    statusTone: "info", ackTime: "2시간 후", actions: ["담임 확인", "차트 생성"],
  },
  {
    id: "sg-102", date: "5/19", time: "11:05", course: "국어 · 2-4",
    student: "조윤호", studentId: "s12",
    category: "기초 개념", weight: "attention",
    text: "문학 작품 해석 어려움 · 수업 중 질문 3회",
    routedTo: "정혜린 담임", status: "상담교사 연결",
    statusTone: "positive", ackTime: "1일 후", actions: ["담임 확인", "기초학력 검토"],
  },
  {
    id: "sg-103", date: "5/17", time: "14:21", course: "국어 · 2-6",
    student: "남현우", studentId: "s17",
    category: "긍정 변화", weight: "positive",
    text: "발표 적극 참여 회복 — 지난 4주 대비 큰 개선",
    routedTo: "윤태성 담임", status: "회복 신호 누적",
    statusTone: "positive", ackTime: "당일", actions: ["회복 모니터링"],
  },
  {
    id: "sg-104", date: "5/15", time: "09:18", course: "국어 · 2-3",
    student: "강예준", studentId: "s07",
    category: "기초 개념", weight: "attention",
    text: "독해 어려움 누적 — 기초학력 지원 검토 요청",
    routedTo: "박선영 담임", status: "기초학력 지원 중",
    statusTone: "info", ackTime: "1일 후", actions: ["담임 확인", "기초학력 연결"],
  },
  {
    id: "sg-105", date: "5/14", time: "13:42", course: "국어 · 2-4",
    student: "최서아", studentId: "s08",
    category: "출결·제출",  weight: "attention",
    text: "과제 미제출 3회 누적 — 다른 과목과 패턴 비교 요청",
    routedTo: "정혜린 담임", status: "담임 확인 대기",
    statusTone: "attention", ackTime: "—", actions: ["담임 확인"],
    overdue: true,
  },
  {
    id: "sg-106", date: "5/13", time: "10:15", course: "국어 · 2-6",
    student: "전이안", studentId: "s20",
    category: "참여 변화", weight: "attention",
    text: "모둠 활동 거부 1회 — 단발성으로 보임",
    routedTo: "윤태성 담임", status: "단발 — 후속 종결",
    statusTone: "muted", ackTime: "당일", actions: ["종결됨"],
  },
];

LC.mySignalKpis = [
  { label: "이번 학기 전달", value: 38, meta: "주간 평균 4.2건", tone: "info" },
  { label: "담임 확인률",   value: "92%", meta: "이번 주 12/13",  tone: "positive" },
  { label: "평균 응답 시간", value: "8시간", meta: "지난 학기 14h",  tone: "positive" },
  { label: "지원 연결됨",   value: 14, meta: "전달의 37%", tone: "info" },
];

LC.subjectStudents = [
  // 김지영 교사가 가르치는 3개 반 학생들의 누적 기록
  // 평균 점수, 최근 신호, 누적 차시 참여율
  { id: "s01", name: "김민수", section: "2-3", attendance: 0.95, participation: 0.62, lastScore: 18, peers: 23, signals: 4, trend: "down" },
  { id: "s02", name: "이서연", section: "2-3", attendance: 1.00, participation: 0.92, lastScore: 27, peers: 23, signals: 1, trend: "up" },
  { id: "s07", name: "강예준", section: "2-3", attendance: 0.95, participation: 0.75, lastScore: 19, peers: 23, signals: 2, trend: "flat" },
  { id: "s14", name: "권나윤", section: "2-3", attendance: 0.85, participation: 0.70, lastScore: 22, peers: 23, signals: 2, trend: "down" },
  { id: "s12", name: "조윤호", section: "2-4", attendance: 0.93, participation: 0.78, lastScore: 21, peers: 24, signals: 2, trend: "flat" },
  { id: "s08", name: "최서아", section: "2-4", attendance: 0.88, participation: 0.65, lastScore: 17, peers: 24, signals: 3, trend: "down" },
  { id: "s17", name: "남현우", section: "2-6", attendance: 1.00, participation: 0.88, lastScore: 25, peers: 23, signals: 1, trend: "up" },
  { id: "s20", name: "전이안", section: "2-6", attendance: 0.97, participation: 0.80, lastScore: 23, peers: 23, signals: 1, trend: "flat" },
];

// ============================================================
// 학교 관리자 — 우리 학교가 활용 중인 자원 (상세)
// ============================================================
LC.schoolResources = [
  {
    id: "r-wee", name: "Wee센터 (○○구)", category: "상담", distance: "0.4km", phone: "02-xxx-1234",
    matched: 12, capacity: 15, wait: "2주", quality: 4.6,
    activeCases: [
      { code: "2-3 · 04", since: "3주차", status: "진행" },
      { code: "2-4 · 18", since: "1주차", status: "초기" },
      { code: "1-3 · 11", since: "5주차", status: "종결 예정" },
    ],
    note: "정기 협력 협약 학교",
  },
  {
    id: "r-saha", name: "지역아동센터 햇살", category: "돌봄", distance: "0.7km", phone: "02-xxx-5566",
    matched: 6, capacity: 8, wait: "—", quality: 4.3,
    activeCases: [
      { code: "1-5 · 22", since: "8주차", status: "안정" },
      { code: "1-2 · 13", since: "4주차", status: "진행" },
    ],
    note: "방과후 시간대 매칭",
  },
  {
    id: "r-gugu", name: "○○구청 기초학력 멘토링", category: "학습지원", distance: "1.2km", phone: "02-xxx-7788",
    matched: 9, capacity: 12, wait: "1주", quality: 4.1,
    activeCases: [
      { code: "2-3 · 08", since: "2주차", status: "진행" },
      { code: "2-2 · 07", since: "5주차", status: "진행" },
    ],
    note: "주 2회 학교 방문",
  },
  {
    id: "r-cls", name: "청소년수련관 활동", category: "활동", distance: "1.5km", phone: "02-xxx-9012",
    matched: 4, capacity: 10, wait: "—", quality: 4.4,
    activeCases: [],
    note: "특기 활동 프로그램 — 자율 신청",
  },
  {
    id: "r-bok", name: "○○복지관", category: "복지", distance: "1.0km", phone: "02-xxx-3344",
    matched: 7, capacity: 9, wait: "1주", quality: 4.5,
    activeCases: [{ code: "2-2 · 03", since: "2주차", status: "초기" }],
    note: "가정 방문 가능",
  },
];

LC.schoolResourceGaps = [
  { category: "위기 상담",   need: "긴급 · 24시간 가능", available: 1, demand: 4 },
  { category: "야간 돌봄",   need: "오후 6시 이후 운영", available: 0, demand: 3 },
  { category: "다문화 지원", need: "통역 가능 상담",     available: 0, demand: 2 },
];

// ============================================================
// 교육청 — 학교군 비교 / 정책 / 데이터 출처
// ============================================================
LC.schoolCompareMetrics = [
  // 학교별 신호/연계 패턴 (LC.schoolsGap와 보완)
  // signals: 학기 누적 신호 수
  // connected: 외부 연계 완료 비율
  // avgTime: 평균 연계 시간(일)
  // engagement: 교사 활동 점수 (0-100)
  { school: "A중학교", group: "○○구·중", students: 412, signals: 218, connected: 0.71, avgTime: 6.2, engagement: 78 },
  { school: "B고등학교", group: "○○구·고", students: 631, signals: 295, connected: 0.62, avgTime: 9.1, engagement: 68 },
  { school: "C중학교", group: "△△구·중", students: 388, signals: 142, connected: 0.83, avgTime: 4.5, engagement: 82 },
  { school: "D중학교", group: "△△구·중", students: 401, signals: 162, connected: 0.79, avgTime: 5.4, engagement: 75 },
  { school: "E고등학교", group: "□□구·고", students: 705, signals: 252, connected: 0.74, avgTime: 7.0, engagement: 72 },
  { school: "F중학교", group: "○○구·중", students: 356, signals: 121, connected: 0.81, avgTime: 5.0, engagement: 80 },
  { school: "G초등학교", group: "△△구·초", students: 522, signals: 165, connected: 0.86, avgTime: 4.2, engagement: 84 },
  { school: "H중학교", group: "□□구·중", students: 298, signals: 96, connected: 0.84, avgTime: 4.8, engagement: 79 },
  { school: "○○중학교", group: "○○구·중", students: 412, signals: 218, connected: 0.75, avgTime: 6.2, engagement: 81, ours: true },
];

LC.policyKpis = [
  { label: "지원 공백 지수", value: 61, prev: 67, delta: -6, unit: "", note: "전 분기 대비 개선" },
  { label: "평균 연계 완료율", value: 75, prev: 68, delta: +7, unit: "%", note: "분기 목표 80%" },
  { label: "평균 연계 시간", value: 6.1, prev: 7.4, delta: -1.3, unit: "일", note: "단축 추세" },
  { label: "교사 활동 점수", value: 77, prev: 73, delta: +4, unit: "", note: "기록 빈도+신호량" },
];

LC.policyTimeline = [
  { quarter: "2024 Q4", gap: 78, connected: 58, time: 9.2 },
  { quarter: "2025 Q1", gap: 74, connected: 61, time: 8.5 },
  { quarter: "2025 Q2", gap: 72, connected: 65, time: 7.9 },
  { quarter: "2025 Q3", gap: 70, connected: 67, time: 7.4 },
  { quarter: "2025 Q4", gap: 67, connected: 68, time: 7.4 },
  { quarter: "2026 Q1", gap: 61, connected: 75, time: 6.1 },
];

LC.policyCards = [
  {
    id: "p-wee",  title: "○○구 Wee센터 신규 1개소 확충",
    type: "검토 중", impact: "공백 지수 -8", target: "○○구 중학교 4개",
    rationale: "○○구 신호량 대비 자원 부족도가 1위. 신규 1개소로 평균 연계 시간 4일 단축 예상.",
    status: "지역 의회 보고 단계",
  },
  {
    id: "p-elem", title: "초등 저학년 멘토링 시범 확대",
    type: "시행 중", impact: "초등 학습지원 +30%", target: "초등 5개교 → 9개교",
    rationale: "G초 시범 후 기초학력 신호 처리율 86%로 가장 우수. 동일군 학교로 확대.",
    status: "2026 Q2 시행",
  },
  {
    id: "p-night",title: "야간 돌봄 협력기관 확보",
    type: "권고", impact: "복지 미연계 -40%", target: "전 학교군",
    rationale: "오후 6시 이후 돌봄 부족이 미연계 사유 1위 (전체의 18%).",
    status: "예산 미반영",
  },
  {
    id: "p-data", title: "교과교사 신호 입력 가이드라인 표준화",
    type: "권고", impact: "응답률 +12%p", target: "전 학교 교과교사",
    rationale: "교사별 신호 입력 빈도 편차가 큰 학교에서 연계율도 낮음 (상관 0.64).",
    status: "초안 작성",
  },
];

LC.dataSources = [
  {
    id: "ds-rec", name: "수업 기록 (LearnCare)",
    type: "직접 입력", responsible: "교과교사",
    frequency: "매 차시", lastSync: "5분 전", health: "정상",
    coverage: 0.94, anonymized: true,
    schools: 8, totalRows: 24500,
    flags: [],
  },
  {
    id: "ds-neis", name: "NEIS 출결·성적",
    type: "API", responsible: "교육청 정보과",
    frequency: "일 1회", lastSync: "오늘 06:00", health: "정상",
    coverage: 1.00, anonymized: true,
    schools: 46, totalRows: 122300,
    flags: [],
  },
  {
    id: "ds-cnsl",name: "상담 기록",
    type: "직접 입력", responsible: "상담교사",
    frequency: "상담 단위", lastSync: "12분 전", health: "정상",
    coverage: 0.88, anonymized: true,
    schools: 8, totalRows: 4200,
    flags: ["원문 미저장 — 요약만 공유"],
  },
  {
    id: "ds-wel", name: "지역 복지·돌봄 매칭",
    type: "수동 연동",responsible: "복지사",
    frequency: "주 1회", lastSync: "3일 전", health: "지연",
    coverage: 0.71, anonymized: true,
    schools: 8, totalRows: 1800,
    flags: ["수기 입력 의존도 높음"],
  },
  {
    id: "ds-pub", name: "공공데이터 (지역자원)",
    type: "API",      responsible: "○○구청 데이터팀",
    frequency: "일 1회", lastSync: "오늘 04:30", health: "정상",
    coverage: 1.00, anonymized: false,
    schools: 0, totalRows: 1240,
    flags: [],
  },
  {
    id: "ds-cons",name: "보호자 동의 상태",
    type: "직접 입력", responsible: "담임교사",
    frequency: "신규 시점", lastSync: "1시간 전", health: "주의",
    coverage: 0.82, anonymized: true,
    schools: 8, totalRows: 3200,
    flags: ["미동의 6.4% — 익명 집계만 사용"],
  },
];

LC.districtResources = [
  // 지역별 × 카테고리별 가용 자원
  // matrix: { region, counts: {상담, 학습지원, 복지, 돌봄, 활동} }
  { region: "○○구", counts: { 상담: 2, 학습지원: 3, 복지: 1, 돌봄: 2, 활동: 1 }, lacking: ["상담", "활동"] },
  { region: "△△구", counts: { 상담: 3, 학습지원: 4, 복지: 2, 돌봄: 1, 활동: 1 }, lacking: ["돌봄"] },
  { region: "□□구", counts: { 상담: 4, 학습지원: 4, 복지: 3, 돌봄: 2, 활동: 1 }, lacking: [] },
  { region: "◇◇구", counts: { 상담: 1, 학습지원: 2, 복지: 2, 돌봄: 2, 활동: 1 }, lacking: ["학습", "상담"] },
];

LC.newDistrictResources = [
  { name: "○○구 Wee클래스 △△중 신설", date: "5/14", category: "상담", region: "○○구", capacity: 50 },
  { name: "햇살아동센터 야간반 확대",     date: "5/10", category: "돌봄", region: "△△구", capacity: 20 },
  { name: "□□도서관 학습지원 멘토링",     date: "5/03", category: "학습지원", region: "□□구", capacity: 30 },
];

// ---------- 학교 관리자 (○○중학교 단일 학교 시점) ----------
LC.schoolAdmin = {
  schoolName: "○○중학교",
  totalStudents: 412,
  totalTeachers: 38,
  classCount: 18,
  unconnected: 7,    // 미연계 누적 케이스
  pending: 23,       // 담임 확인 대기
  resolved4w: 31,    // 최근 4주 연계 완료

  kpis: [
    { label: "이번 주 신규 신호", value: 18, meta: "지난 주 14건", tone: "attention" },
    { label: "담임 확인 대기",   value: 23, meta: "평균 1.4일",   tone: "attention" },
    { label: "외부 연계 대기",   value: 7,  meta: "최장 11일",    tone: "alert" },
    { label: "최근 4주 연계 완료", value: 31, meta: "전 분기 22건", tone: "positive" },
  ],

  // 학년 × 반별 신호 분포 (개별 학생 식별 불가, 집계만)
  gradeMap: [
    { grade: 1, classes: [
      { name: "1-1", students: 22, attention: 3, alert: 1, info: 2, positive: 2 },
      { name: "1-2", students: 23, attention: 2, alert: 0, info: 1, positive: 1 },
      { name: "1-3", students: 22, attention: 4, alert: 2, info: 1, positive: 0 },
      { name: "1-4", students: 24, attention: 1, alert: 0, info: 2, positive: 3 },
      { name: "1-5", students: 23, attention: 5, alert: 1, info: 0, positive: 1 },
      { name: "1-6", students: 22, attention: 2, alert: 1, info: 1, positive: 2 },
    ]},
    { grade: 2, classes: [
      { name: "2-1", students: 21, attention: 3, alert: 0, info: 1, positive: 2 },
      { name: "2-2", students: 22, attention: 4, alert: 2, info: 2, positive: 1 },
      { name: "2-3", students: 20, attention: 4, alert: 1, info: 2, positive: 2 },
      { name: "2-4", students: 23, attention: 6, alert: 3, info: 1, positive: 0 },
      { name: "2-5", students: 22, attention: 2, alert: 0, info: 3, positive: 2 },
      { name: "2-6", students: 23, attention: 3, alert: 1, info: 2, positive: 1 },
    ]},
    { grade: 3, classes: [
      { name: "3-1", students: 24, attention: 2, alert: 1, info: 2, positive: 3 },
      { name: "3-2", students: 23, attention: 5, alert: 2, info: 1, positive: 1 },
      { name: "3-3", students: 24, attention: 3, alert: 0, info: 2, positive: 4 },
      { name: "3-4", students: 22, attention: 4, alert: 1, info: 2, positive: 1 },
      { name: "3-5", students: 23, attention: 1, alert: 0, info: 3, positive: 2 },
      { name: "3-6", students: 23, attention: 3, alert: 1, info: 1, positive: 2 },
    ]},
  ],

  // 미연계/지연 케이스 — 학생명 비식별, 학년-반-번호 마스킹
  unconnectedCases: [
    { id: "U-2304", grade: 2, klass: "2-4", code: "2-4 · 06", category: "상담", since: 11, status: "외부 연계 대기", reason: "Wee센터 예약 지연" },
    { id: "U-1503", grade: 1, klass: "1-5", code: "1-5 · 12", category: "학습지원", since: 9,  status: "담임 확인 대기", reason: "담임 회신 없음" },
    { id: "U-2202", grade: 2, klass: "2-2", code: "2-2 · 03", category: "복지",   since: 8,  status: "외부 연계 대기", reason: "복지관 정원 부족" },
    { id: "U-2404", grade: 2, klass: "2-4", code: "2-4 · 18", category: "상담",   since: 6,  status: "담임 확인 대기", reason: "—" },
    { id: "U-3201", grade: 3, klass: "3-2", code: "3-2 · 09", category: "학습지원", since: 6,  status: "외부 연계 대기", reason: "기초학력 자원 매칭 중" },
    { id: "U-1303", grade: 1, klass: "1-3", code: "1-3 · 17", category: "활동",   since: 5,  status: "담임 확인 대기", reason: "—" },
    { id: "U-2401", grade: 2, klass: "2-4", code: "2-4 · 22", category: "복지",   since: 4,  status: "외부 연계 대기", reason: "보호자 동의 대기" },
  ],

  // 교사별 활동 요약 (개별 학생 정보 없이)
  teacherActivity: [
    { name: "김지영", role: "교과 · 국어",  classes: 5, records4w: 60, signals4w: 22, lastActive: "오늘" },
    { name: "박선영", role: "담임 · 2-3",   classes: 6, records4w: 48, signals4w: 18, lastActive: "오늘" },
    { name: "최은호", role: "담임 · 2-4",   classes: 6, records4w: 32, signals4w: 27, lastActive: "어제", flag: "확인 지연" },
    { name: "이재훈", role: "교과 · 수학",  classes: 8, records4w: 71, signals4w: 14, lastActive: "오늘" },
    { name: "한미경", role: "담임 · 1-5",   classes: 6, records4w: 39, signals4w: 21, lastActive: "오늘" },
    { name: "정해린", role: "교과 · 영어",  classes: 8, records4w: 18, signals4w: 6,  lastActive: "5일 전", flag: "활동 저조" },
    { name: "윤태성", role: "상담교사",     classes: "—", records4w: 28, signals4w: 0, lastActive: "오늘" },
  ],

  // 자원 사용 현황 (학교 시점)
  resourceUsage: [
    { name: "Wee센터 (○○구)",      category: "상담",   matched: 12, capacity: 15, wait: "2주" },
    { name: "지역아동센터 햇살",     category: "돌봄",   matched: 6,  capacity: 8,  wait: "—" },
    { name: "○○구청 기초학력 멘토링", category: "학습지원", matched: 9, capacity: 12, wait: "1주" },
    { name: "청소년수련관 활동",      category: "활동",   matched: 4,  capacity: 10, wait: "—" },
    { name: "○○복지관",            category: "복지",   matched: 7,  capacity: 9,  wait: "1주" },
  ],
};
