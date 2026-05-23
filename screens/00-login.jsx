// LearnCare Chart — Login Screen
// 역할 기반 진입: 교과·담임 교사 / 학교 관리자 / 교육청 관리자

const ROLE_TABS = [
  {
    id: "teacher",
    label: "교과·담임 교사",
    sub: "수업 기록, 학생 차트, 우리 반 케이스",
    match: (p) => p.assignments.homerooms.length > 0 || p.assignments.courses.length > 0,
    defaultRoute: "today",
  },
  {
    id: "school",
    label: "학교 관리자",
    sub: "학교 신호 지도, 미연계 케이스, 교사 활동",
    match: (p) => p.permissions.schoolAdmin && !p.permissions.districtAdmin,
    defaultRoute: "school",
    // 단, 다중 모자 교사(choi)는 teacher 탭과 school 탭 양쪽에 보임 — 직접 매치 함수에서 처리
  },
  {
    id: "district",
    label: "교육청 관리자",
    sub: "지원 공백 대시보드, 학교군 비교, 정책 리포트",
    match: (p) => p.permissions.districtAdmin,
    defaultRoute: "admin",
  },
];

function accountsForRole(roleId) {
  const all = LC.personas;
  if (roleId === "teacher") {
    // 담임 또는 교과 배정이 있는 모든 페르소나 (학교 관리자 겸직 포함)
    return all.filter((p) => p.assignments.homerooms.length > 0 || p.assignments.courses.length > 0);
  }
  if (roleId === "school") {
    // 학교 관리자 권한이 있는 모든 페르소나
    return all.filter((p) => p.permissions.schoolAdmin);
  }
  if (roleId === "district") {
    return all.filter((p) => p.permissions.districtAdmin);
  }
  return [];
}

function defaultRouteForLogin(roleId, persona) {
  if (roleId === "school") return "school";
  if (roleId === "district") return "admin";
  // teacher 탭: 담임이 있으면 today, 교과만이면 record
  if (persona.assignments.homerooms.length) return "today";
  return "record";
}

function personaIdFor(persona) {
  // 데모 계정 ID 패턴
  const map = {
    kim: "kjy.korean",
    park: "psy.2-3",
    choi: "ceh.math",
    lee: "ljh.vp",
    han: "hjs.edu",
  };
  return map[persona.id] || persona.id;
}

function personaRoleSubtitle(persona, roleId) {
  if (roleId === "school") {
    if (persona.permissions.districtAdmin) return "교육청 + 학교";
    if (persona.assignments.homerooms.length) return `${persona.assignments.homerooms[0].name} 담임 겸 학교 관리자`;
    return persona.title; // 교감 등
  }
  if (roleId === "district") {
    return `${persona.school}`;
  }
  // teacher
  const parts = [];
  if (persona.assignments.homerooms.length) parts.push(persona.assignments.homerooms[0].name + " 담임");
  if (persona.assignments.courses.length) {
    const subjects = [...new Set(persona.assignments.courses.map((c) => c.subject))];
    parts.push(subjects.join("·") + " " + persona.assignments.courses.length + "반");
  }
  if (persona.permissions.schoolAdmin) parts.push("학교 관리자 겸직");
  return parts.join(" · ") || persona.title;
}

function LoginScreen({ onLogin }) {
  const [roleId, setRoleId] = React.useState("teacher");
  const accounts = React.useMemo(() => accountsForRole(roleId), [roleId]);
  const [selectedId, setSelectedId] = React.useState(accounts[0]?.id);
  const [pw, setPw] = React.useState("••••••••");
  const [remember, setRemember] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  // 탭 변경 시 첫 계정 자동 선택
  React.useEffect(() => {
    if (!accounts.find((p) => p.id === selectedId)) {
      setSelectedId(accounts[0]?.id);
    }
  }, [accounts, selectedId]);

  const selected = LC.personas.find((p) => p.id === selectedId);
  const loginId = selected ? personaIdFor(selected) : "";

  const submit = (e) => {
    e?.preventDefault?.();
    if (!selected) return;
    setSubmitting(true);
    setTimeout(() => {
      onLogin(selected, defaultRouteForLogin(roleId, selected), roleId);
    }, 380);
  };

  return (
    <div className="login-stage" data-screen-label="00 로그인">
      <div className="login-card">
        {/* Left brand panel */}
        <aside className="login-brand">
          <div className="login-brand-mark">
            <div className="logo-mark" aria-hidden="true"></div>
            <div>
              <div className="login-brand-name">LearnCare Chart</div>
              <div className="login-brand-sub">학생 지원 통합 기록 시스템</div>
            </div>
          </div>

          <div className="login-brand-tag">
            교사의 작은 관찰이<br />학교와 지역의 지원으로 이어집니다.
          </div>

          <div className="login-brand-features">
            <div className="login-brand-feature">
              <span className="login-brand-feature-dot" style={{background: "var(--primary)"}}></span>
              <div>
                <div className="login-brand-feature-title">수업 기록 → 신호 자동 전달</div>
                <div className="login-brand-feature-desc">교과교사의 한 줄 기록이 담임에게 즉시 전달</div>
              </div>
            </div>
            <div className="login-brand-feature">
              <span className="login-brand-feature-dot" style={{background: "var(--ai-accent)"}}></span>
              <div>
                <div className="login-brand-feature-title">AI 상담 준비 보조</div>
                <div className="login-brand-feature-desc">학생별 변화 요약과 상담 질문 자동 제안</div>
              </div>
            </div>
            <div className="login-brand-feature">
              <span className="login-brand-feature-dot" style={{background: "var(--positive)"}}></span>
              <div>
                <div className="login-brand-feature-title">학교·교육청 지원 연계</div>
                <div className="login-brand-feature-desc">미연계 케이스 추적 및 지역자원 매칭</div>
              </div>
            </div>
          </div>

          <div className="login-brand-foot">
            <span>○○교육지원청</span>
            <span className="dotsep">·</span>
            <span>○○중학교 시범 운영</span>
          </div>
        </aside>

        {/* Right login form */}
        <section className="login-form-wrap">
          <div className="login-form-head">
            <div className="login-form-title">로그인</div>
            <div className="login-form-sub">권한별 작업 화면으로 진입합니다</div>
          </div>

          {/* Role tabs */}
          <div className="login-role-tabs" role="tablist">
            {ROLE_TABS.map((r) => {
              const active = r.id === roleId;
              const count = accountsForRole(r.id).length;
              return (
                <button
                  key={r.id}
                  role="tab"
                  aria-selected={active}
                  className={"login-role-tab" + (active ? " active" : "")}
                  onClick={() => setRoleId(r.id)}
                  type="button"
                >
                  <span className="login-role-tab-label">{r.label}</span>
                  <span className="login-role-tab-sub">{r.sub}</span>
                  <span className="login-role-tab-count">계정 {count}</span>
                </button>
              );
            })}
          </div>

          {/* Account picker */}
          <div className="login-section-label">계정 선택</div>
          <div className="login-accounts">
            {accounts.map((p) => {
              const active = p.id === selectedId;
              return (
                <button
                  key={p.id}
                  type="button"
                  className={"login-account" + (active ? " active" : "")}
                  onClick={() => setSelectedId(p.id)}
                >
                  <span className="login-account-avatar" aria-hidden="true">{p.avatar}</span>
                  <span className="login-account-info">
                    <span className="login-account-name">
                      {p.name} <span className="login-account-title">{p.title}</span>
                    </span>
                    <span className="login-account-sub">{personaRoleSubtitle(p, roleId)}</span>
                  </span>
                  <span className="login-account-check" aria-hidden="true">
                    {active ? <span className="login-account-check-dot"></span> : null}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Credentials */}
          <form className="login-fields" onSubmit={submit}>
            <label className="login-field">
              <span className="login-field-label">아이디</span>
              <input
                type="text"
                value={loginId}
                readOnly
                className="login-input"
                aria-label="아이디"
              />
            </label>
            <label className="login-field">
              <span className="login-field-label">비밀번호</span>
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className="login-input"
                aria-label="비밀번호"
              />
            </label>

            <div className="login-options">
              <label className="login-check">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <span>아이디 저장</span>
              </label>
              <div className="login-links">
                <a href="#" onClick={(e) => e.preventDefault()}>아이디 찾기</a>
                <span className="dotsep">·</span>
                <a href="#" onClick={(e) => e.preventDefault()}>비밀번호 재설정</a>
              </div>
            </div>

            <button
              type="submit"
              className={"login-submit" + (submitting ? " is-loading" : "")}
              disabled={!selected || submitting}
            >
              {submitting
                ? "로그인 중…"
                : selected
                  ? `${selected.name} ${selected.title}로 로그인`
                  : "로그인"}
            </button>
          </form>

          <div className="login-demo-note">
            <span className="login-demo-tag">DEMO</span>
            <span>
              실제 인증이 아닌 프로토타입입니다. 비밀번호는 무엇이든 통과합니다.
              로그인 후 우측 상단 메뉴에서 <b>로그아웃</b>으로 돌아올 수 있어요.
            </span>
          </div>

          <div className="login-foot">
            <span>○○교육지원청 학생지원시스템</span>
            <span className="dotsep">·</span>
            <span>NEIS 연계</span>
            <span className="dotsep">·</span>
            <a href="#" onClick={(e) => e.preventDefault()}>이용약관</a>
          </div>
        </section>
      </div>
    </div>
  );
}

window.LoginScreen = LoginScreen;
