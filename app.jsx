// LearnCare Chart — app shell
// 한 명의 Teacher가 동시에 여러 업무 컨텍스트를 가질 수 있다는 모델.
// "role" 스위처가 아니라 "persona" 스위처: 각 페르소나는 담임·교과·관리자 권한 중 여러 개를 동시에 가질 수 있다.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "personaId": "park",
  "font": "Pretendard",
  "startRoute": "today",
  "requireLogin": true
}/*EDITMODE-END*/;

// 페르소나의 primary context에 따라 첫 화면을 정함
function defaultRouteFor(persona) {
  // 항상 오늘의 업무로 시작 — 한 사람이 여러 모자를 쓰고 있다는 걸 보여주기 위해
  return "today";
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // 로그인 상태 — Tweaks로 끄면 바로 앱 진입
  const [authed, setAuthed] = React.useState(!t.requireLogin);

  React.useEffect(() => {
    // requireLogin이 false로 바뀌면 자동 인증
    if (!t.requireLogin && !authed) setAuthed(true);
  }, [t.requireLogin, authed]);

  const persona = React.useMemo(() => {
    return LC.personas.find((p) => p.id === t.personaId) || LC.personas[0];
  }, [t.personaId]);

  const [route, setRoute] = React.useState(t.startRoute || defaultRouteFor(persona));
  const [focusStudent, setFocusStudent] = React.useState("s01");

  // when persona changes, jump to today (a fresh teacher landing on workspace)
  const lastPersonaRef = React.useRef(persona.id);
  React.useEffect(() => {
    if (lastPersonaRef.current !== persona.id) {
      lastPersonaRef.current = persona.id;
      setRoute("today");
    }
  }, [persona.id]);

  // apply font
  React.useEffect(() => {
    document.documentElement.style.setProperty("--font-sans",
      t.font === "Spoqa" ? '"Spoqa Han Sans Neo", "Pretendard", sans-serif'
      : t.font === "IBM" ? '"IBM Plex Sans KR", "Pretendard", sans-serif'
      : '"Pretendard", "Pretendard Variable", sans-serif'
    );
  }, [t.font]);

  const navigate = (r) => setRoute(r);
  const openStudent = (id) => { setFocusStudent(id || "s01"); setRoute("chart"); };
  const openPrep = (id) => { setFocusStudent(id || "s01"); setRoute("prep"); };
  const openBoard = () => setRoute("board");

  const handleLogin = (p, nextRoute, _roleId) => {
    lastPersonaRef.current = p.id;
    if (p.id !== t.personaId) setTweak("personaId", p.id);
    setRoute(nextRoute);
    setAuthed(true);
  };

  const handleLogout = () => {
    setAuthed(false);
  };

  // expose demo nav for external drivers (PPTX export, scripted tours)
  React.useEffect(() => {
    window.__demoNav = (personaId, nextRoute, sid) => {
      lastPersonaRef.current = personaId;
      setTweak("personaId", personaId);
      if (sid) setFocusStudent(sid);
      setRoute(nextRoute);
      setAuthed(true); // 스크립트 데모는 로그인 우회
    };
  }, [setTweak]);

  // 담임의 board는 자기 반만 보여줘야 한다 (학교 관리자가 보는 board와 다름)
  const homeroom = persona.assignments.homerooms[0];
  const boardScope = homeroom ? { class: homeroom.classCode, label: homeroom.name } : null;

  // ===== 로그인 게이트 =====
  if (!authed) {
    return (
      <React.Fragment>
        <LoginScreen onLogin={handleLogin} />
        {renderTweaks()}
      </React.Fragment>
    );
  }

  function renderTweaks() {
    return (
      <TweaksPanel title="Tweaks">
        <TweakSection label="데모 페르소나">
          <TweakSelect
            label="현재 사용자"
            value={t.personaId}
            options={LC.personas.map((p) => ({
              value: p.id,
              label: personaTweakLabel(p),
            }))}
            onChange={(v) => setTweak("personaId", v)}
          />
          <div style={{fontSize: 11, color: "var(--text-soft)", marginTop: 8, padding: "10px 12px", background: "var(--bg-soft)", borderRadius: 8, lineHeight: 1.5}}>
            한 사람이 동시에 담임 + 교과 + 학교 관리자 같은 여러 모자를 가질 수 있어요. 사이드바는 페르소나의 배정·권한에서 자동 생성됩니다.
          </div>
        </TweakSection>
        <TweakSection label="로그인">
          <TweakToggle
            label="로그인 게이트 사용"
            value={t.requireLogin}
            onChange={(v) => { setTweak("requireLogin", v); if (!v) setAuthed(true); }}
          />
          <div style={{fontSize: 11, color: "var(--muted)", marginTop: 6, lineHeight: 1.5}}>
            끄면 로그인 화면을 건너뛰고 바로 앱으로 진입합니다. 디자인 검토용.
          </div>
        </TweakSection>
        <TweakSection label="타이포그래피">
          <TweakRadio
            label="본문 폰트"
            value={t.font}
            options={[
              {value: "Pretendard", label: "Pretendard"},
              {value: "Spoqa",      label: "Spoqa"},
              {value: "IBM",        label: "IBM Plex"},
            ]}
            onChange={(v) => setTweak("font", v)}
          />
        </TweakSection>
        <TweakSection label="시작 화면">
          <TweakSelect
            label="진입 시 화면"
            value={t.startRoute}
            options={[
              {value: "today",    label: "0. 오늘의 업무"},
              {value: "record",   label: "1. 수업 기록"},
              {value: "briefing", label: "2. 주간 브리핑"},
              {value: "chart",    label: "3. 학생 차트"},
              {value: "prep",     label: "4. AI 상담 준비"},
              {value: "board",    label: "5. 지원 모니터링"},
              {value: "local",    label: "6. 지역자원 추천"},
              {value: "school",   label: "7. 학교 대시보드"},
              {value: "admin",    label: "8. 교육청 대시보드"},
            ]}
            onChange={(v) => setTweak("startRoute", v)}
          />
        </TweakSection>
      </TweaksPanel>
    );
  }

  return (
    <div className="app">
      <TopBar persona={persona} onLogout={handleLogout} />
      <div className="shell">
        <SideNav persona={persona} route={route} onNavigate={navigate} />
        <main className="content" data-screen-label={routeLabel(route)}>
          {route === "today"    && <TodayWorkspace persona={persona} onNavigate={navigate} onOpenStudent={openStudent} />}
          {route === "record"   && <ClassRecord persona={persona} />}
          {route === "briefing" && <WeeklyBriefing onOpenStudent={openStudent} onOpenPrep={openPrep} onOpenBoard={openBoard} />}
          {route === "chart"    && <StudentChart studentId={focusStudent} onOpenPrep={openPrep} onOpenBoard={openBoard} />}
          {route === "prep"     && <CounselingPrep studentId={focusStudent} onOpenBoard={openBoard} />}
          {route === "board"    && <SupportBoard onOpenStudent={openStudent} scope={boardScope} />}
          {route === "local"    && <LocalResources onOpenBoard={openBoard} />}
          {route === "admin"    && <AdminDashboard />}
          {route === "school"   && <SchoolAdminDashboard initialView="dashboard" />}
          {route === "grades"   && <SchoolAdminDashboard initialView="grades" />}
          {route === "cases"    && <SchoolAdminDashboard initialView="cases" />}
          {route === "teachers" && <SchoolAdminDashboard initialView="teachers" />}
          {route === "schoolLocal" && <SchoolLocalResources />}
          {route === "districtLocal" && <DistrictLocalResources />}
          {route === "schoolcmp" && <SchoolComparison />}
          {route === "policy"   && <PolicyReport />}
          {route === "data"     && <DataSources />}
          {route === "lookup"   && <StudentLookup persona={persona} onOpenStudent={openStudent} />}
          {route === "mysignals" && <MySignals persona={persona} onOpenStudent={openStudent} />}
        </main>
      </div>

      <DemoStepper setRoute={setRoute} setStudent={setFocusStudent} persona={persona} setTweak={setTweak} />

      {renderTweaks()}
    </div>
  );
}

function personaTweakLabel(p) {
  const hats = [];
  if (p.assignments.homerooms.length) hats.push("담임");
  if (p.assignments.courses.length) hats.push("교과");
  if (p.permissions.schoolAdmin) hats.push("학교");
  if (p.permissions.districtAdmin) hats.push("교육청");
  return `${p.name} ${p.title} — ${hats.join("+")}`;
}

function routeLabel(r) {
  return {
    today: "00 오늘의 업무",
    record: "01 수업 기록",
    briefing: "02 주간 브리핑",
    chart: "03 학생 지원 차트",
    prep: "04 AI 상담 준비",
    board: "05 우리 반 지원 케이스",
    local: "06 지역자원 추천",
    admin: "07 교육청 대시보드",
    school: "08 학교 대시보드",
    grades: "08 학년·반별 신호 지도",
    cases: "08 미연계 케이스",
    teachers: "08 교사별 활동",
    lookup: "01 학생별 기록 조회",
    mysignals: "01 내가 올린 신호",
    schoolLocal: "08 우리 학교 자원",
    districtLocal: "07 지역자원 분포",
    schoolcmp: "07 학교군 비교",
    policy: "07 정책 리포트",
    data: "07 데이터 출처",
  }[r] || r;
}

// ===== Demo Stepper =====
// 김민수 케이스를 따라가되, 한 사람이 여러 모자를 쓴다는 걸 강조하는 흐름.
const DEMO_STEPS = [
  { id: 1,  personaId: "kim",  route: "record",   label: "국어 김지영 교사가 수업 기록을 연다",      note: "교과 컨텍스트" },
  { id: 2,  personaId: "kim",  route: "record",   label: "김민수 — 발표 미참여 체크",                note: "교과 신호 → 담임에게 전달" },
  { id: 3,  personaId: "park", route: "today",    label: "박선영 담임이 오늘의 업무 화면을 연다",     note: "담임+교과 컨텍스트 모두 노출" },
  { id: 4,  personaId: "park", route: "briefing", label: "여러 과목 신호 통합 — 변화 카드 생성",      note: "주간 브리핑" },
  { id: 5,  personaId: "park", route: "chart",    label: "김민수 학생 지원 차트 열람",                note: "트렌드 + 타임라인" },
  { id: 6,  personaId: "park", route: "prep",     label: "AI가 변화 요약과 상담 질문 제안",           note: "AI 상담 준비" },
  { id: 7,  personaId: "park", route: "board",    label: "우리 반 케이스만 — 기초학력/상담 연결",     note: "scope = 2-3" },
  { id: 8,  personaId: "park", route: "local",    label: "지역자원 추천 확인",                       note: "" },
  { id: 9,  personaId: "choi", route: "today",    label: "최은호 — 담임+교과+학교 관리자 한꺼번에",  note: "multi-role 페르소나" },
  { id: 10, personaId: "choi", route: "school",   label: "학교 관리자 모자: 학교 전체 미연계 케이스", note: "같은 사람이 학교 차원 본다" },
  { id: 11, personaId: "lee",  route: "school",   label: "이정훈 교감 — 학교 단위 운영만",            note: "관리자 전담" },
  { id: 12, personaId: "han",  route: "admin",    label: "교육청에 익명 집계 반영",                  note: "지원 공백 지수" },
];

function DemoStepper({ setRoute, setStudent, persona, setTweak }) {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const cur = DEMO_STEPS[step];

  const goto = (i) => {
    const s = DEMO_STEPS[i];
    setStep(i);
    setStudent("s01");
    if (s.personaId !== persona.id) setTweak("personaId", s.personaId);
    setRoute(s.route);
  };

  if (!open) {
    return (
      <button data-pptx-hide onClick={() => setOpen(true)} style={{
        position: "fixed", bottom: 14, left: 14, zIndex: 40,
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 999, padding: "8px 14px",
        fontSize: 12, fontWeight: 600, cursor: "pointer",
        boxShadow: "var(--shadow)",
      }}>
        ▸ 데모 시나리오 열기
      </button>
    );
  }

  const stepPersona = LC.personas.find((p) => p.id === cur.personaId);

  return (
    <div data-pptx-hide style={{
      position: "fixed", bottom: 14, left: 14, zIndex: 40,
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      boxShadow: "var(--shadow)",
      width: 400,
      overflow: "hidden",
    }}>
      <div className="row" style={{padding: "10px 14px", justifyContent: "space-between", borderBottom: "1px solid var(--border)", background: "var(--bg-soft)"}}>
        <div className="row" style={{gap: 8}}>
          <span style={{fontSize: 12, fontWeight: 700}}>데모 시나리오</span>
          <span className="tag info">김민수 케이스</span>
        </div>
        <button onClick={() => setOpen(false)} style={{border: "none", background: "transparent", cursor: "pointer", color: "var(--muted)", fontSize: 16}}>−</button>
      </div>
      <div style={{padding: 14}}>
        <div className="row" style={{gap: 8, marginBottom: 8}}>
          <span style={{fontSize: 11, fontWeight: 700, color: "var(--primary)", fontVariantNumeric: "tabular-nums"}}>
            STEP {String(cur.id).padStart(2, "0")} / {DEMO_STEPS.length}
          </span>
          <span className="tag muted" style={{fontSize: 10.5}}>
            {stepPersona.name} {stepPersona.title}
          </span>
        </div>
        <div style={{fontSize: 13.5, fontWeight: 600, lineHeight: 1.45, marginBottom: 2}}>{cur.label}</div>
        {cur.note && <div className="muted" style={{fontSize: 11.5}}>{cur.note}</div>}

        <div className="row" style={{gap: 6, marginTop: 12, alignItems: "center"}}>
          <button className="btn sm" disabled={step === 0} onClick={() => goto(step - 1)} style={{opacity: step === 0 ? 0.5 : 1}}>← 이전</button>
          <button className="btn sm primary" disabled={step === DEMO_STEPS.length - 1} onClick={() => goto(step + 1)} style={{opacity: step === DEMO_STEPS.length - 1 ? 0.5 : 1}}>다음 →</button>
          <div className="grow"></div>
          <button className="btn sm ghost" onClick={() => goto(0)} style={{color: "var(--muted)"}}>처음</button>
        </div>

        <div className="row" style={{gap: 4, marginTop: 12, flexWrap: "wrap"}}>
          {DEMO_STEPS.map((s, i) => (
            <button key={i} onClick={() => goto(i)}
              title={s.label}
              style={{
                width: 22, height: 22, border: "none",
                background: i === step ? "var(--primary)" : i < step ? "var(--primary-soft)" : "var(--bg-soft)",
                color: i === step ? "white" : i < step ? "var(--primary-text)" : "var(--muted)",
                borderRadius: 4, fontSize: 10, fontWeight: 700, cursor: "pointer",
                fontVariantNumeric: "tabular-nums",
              }}>
              {s.id}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
