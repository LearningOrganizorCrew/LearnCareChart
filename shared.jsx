// LearnCare Chart — shared components & icons
// expose to window so other babel scripts can use them.

const { useState, useEffect, useMemo, useRef } = React;

// ----- Icons (16px, stroke 1.5) -----
const Icon = ({ d, size = 16, fill = "none", stroke = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);

const Icons = {
  Clipboard: <Icon d={<><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4h6v3H9z" /><path d="M9 11h6M9 15h4" /></>} />,
  Calendar: <Icon d={<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>} />,
  Chart: <Icon d={<><path d="M4 19V5" /><path d="M4 19h16" /><path d="M8 16v-4M12 16v-7M16 16v-2" /></>} />,
  Spark: <Icon d={<><path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z" /><circle cx="19" cy="5" r="1.2" /></>} />,
  Users: <Icon d={<><circle cx="9" cy="9" r="3.2" /><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5" /><circle cx="17" cy="8" r="2.6" /><path d="M21 18c0-2.4-2-4-4-4" /></>} />,
  Link: <Icon d={<><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>} />,
  Map: <Icon d={<><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z" /><path d="M9 4v14M15 6v14" /></>} />,
  Dashboard: <Icon d={<><rect x="3" y="3" width="8" height="9" rx="1.5" /><rect x="13" y="3" width="8" height="5" rx="1.5" /><rect x="13" y="10" width="8" height="11" rx="1.5" /><rect x="3" y="14" width="8" height="7" rx="1.5" /></>} />,
  Bell: <Icon d={<><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2H4.5z" /><path d="M10 21a2 2 0 0 0 4 0" /></>} />,
  Search: <Icon d={<><circle cx="11" cy="11" r="6" /><path d="m20 20-4-4" /></>} />,
  ChevronDown: <Icon d={<path d="m6 9 6 6 6-6" />} />,
  ChevronRight: <Icon d={<path d="m9 6 6 6-6 6" />} />,
  Plus: <Icon d={<path d="M12 5v14M5 12h14" />} />,
  Check: <Icon d={<path d="m5 12 5 5 9-11" />} size={14} />,
  Filter: <Icon d={<path d="M4 5h16l-6 8v6l-4-2v-4z" />} />,
  More: <Icon d={<><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></>} />,
  Help: <Icon d={<><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7" /><circle cx="12" cy="17" r="0.6" fill="currentColor" /></>} />,
  Sparkles: <Icon d={<><path d="M12 4v4M12 16v4M4 12h4M16 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></>} />,
  Folder: <Icon d={<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />} />,
  Database: <Icon d={<><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" /><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>} />,
  Settings: <Icon d={<><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.4l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2.4-1.4L13.7 3h-3.4l-.5 2.2a7 7 0 0 0-2.4 1.4l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.4l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2.4 1.4l.5 2.2h3.4l.5-2.2a7 7 0 0 0 2.4-1.4l2.3.9 2-3.4-2-1.5c0-.5.1-.9.1-1.4z" /></>} />,
  Copy: <Icon d={<><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></>} />,
};

// ----- Top Bar -----
function TopBar({ persona, onLogout }) {
  const cap = LC.personaCapabilities(persona);
  const hats = [];
  if (cap.hasHomeroom) hats.push("담임");
  if (cap.hasCourses) hats.push("교과");
  if (cap.canManageSchool) hats.push("학교 관리자");
  if (cap.canManageDistrict) hats.push("교육청");

  return (
    <header className="topbar">
      <div className="logo">
        <div className="logo-mark" aria-hidden="true"></div>
        <span>LearnCare Chart</span>
      </div>
      <div className="school-name">{persona.school}</div>
      <div className="spacer"></div>
      <div className="row" style={{ gap: 14 }}>
        {/* 여러 모자를 한 사람이 동시에 쓰고 있다는 걸 강조 */}
        <div className="row" style={{gap: 4}}>
          {hats.map((h, i) => (
            <span key={h} style={{
              fontSize: 11.5, fontWeight: 600,
              padding: "3px 9px", borderRadius: 999,
              background: i === 0 ? "var(--primary-soft)" : "var(--bg-soft)",
              color: i === 0 ? "var(--primary-text)" : "var(--text-soft)",
              border: "1px solid " + (i === 0 ? "var(--primary-soft-border)" : "var(--border)"),
            }}>{h}</span>
          ))}
        </div>
        <button className="icon-btn" aria-label="알림">
          {Icons.Bell}
          <span className="dot"></span>
        </button>
        <button className="icon-btn" aria-label="도움말">{Icons.Help}</button>
        <div className="profile" title={persona.name + " " + persona.title}>{persona.avatar}</div>
        {onLogout && (
          <button className="logout-btn" onClick={onLogout} aria-label="로그아웃">
            로그아웃
          </button>
        )}
      </div>
    </header>
  );
}

// ----- Side Nav: capability-driven -----
// 페르소나의 assignments + permissions로부터 메뉴를 자동 생성.
// 한 명의 교사가 담임+교과+관리자를 동시에 가지면 모든 섹션이 표시됨.
function buildSideNav(persona) {
  const cap = LC.personaCapabilities(persona);
  const groups = [];

  // 1) Always: 오늘
  groups.push({
    label: "오늘",
    items: [
      { id: "today", label: "오늘의 업무", icon: Icons.Sparkles },
    ],
  });

  // 2) 학급 — 담임 배정이 있으면 (담임이 primary identity이므로 교과보다 먼저)
  if (cap.hasHomeroom) {
    const hr = persona.assignments.homerooms[0];
    const b = persona.today?.briefing || {};
    groups.push({
      label: `학급 · ${hr.name}`,
      items: [
        { id: "briefing", label: "주간 브리핑", icon: Icons.Sparkles, count: b.changes || undefined },
        { id: "chart", label: "학생 지원 차트", icon: Icons.Chart },
        { id: "prep", label: "AI 상담 준비", icon: Icons.Users },
        { id: "board", label: "우리 반 지원 케이스", icon: Icons.Link, hint: hr.name + " 한정" },
        { id: "local", label: "지역자원 추천", icon: Icons.Map },
      ],
    });
  }

  // 3) 수업 — 배정된 과목이 있으면
  if (cap.hasCourses) {
    const todaySchedule = persona.today?.schedule || [];
    const pending = todaySchedule.filter(s => s.state !== "recorded").length;
    const subjects = [...new Set(persona.assignments.courses.map(c => c.subject))];
    groups.push({
      label: `수업 · ${subjects.join("·")} ${persona.assignments.courses.length}반`,
      items: [
        { id: "record", label: "수업 기록", icon: Icons.Clipboard, count: pending || undefined, hint: pending ? `오늘 ${pending}개 미입력` : undefined },
        { id: "lookup", label: "학생별 기록 조회", icon: Icons.Search },
        { id: "mysignals", label: "내가 올린 신호", icon: Icons.Link, hint: "담임/상담 전달" },
      ],
    });
  }

  // 4) 학교 관리 — 학교 관리자 권한이 있으면
  if (cap.canManageSchool) {
    groups.push({
      label: "학교 관리",
      items: [
        { id: "school", label: "학교 대시보드", icon: Icons.Dashboard },
        { id: "grades", label: "학년·반 신호 지도", icon: Icons.Chart },
        { id: "cases", label: "미연계 케이스 추적", icon: Icons.Link, count: 7 },
        { id: "teachers", label: "교사별 활동", icon: Icons.Users },
        { id: "schoolLocal", label: "우리 학교 자원", icon: Icons.Map },
      ],
    });
  }

  // 5) 교육청 — 교육청 관리자 권한이 있으면
  if (cap.canManageDistrict) {
    groups.push({
      label: "교육청",
      items: [
        { id: "admin", label: "지원 공백 대시보드", icon: Icons.Dashboard },
        { id: "schoolcmp", label: "학교군 비교", icon: Icons.Chart },
        { id: "districtLocal", label: "지역자원 분포", icon: Icons.Map },
        { id: "policy", label: "정책 리포트", icon: Icons.Folder },
        { id: "data", label: "데이터 출처", icon: Icons.Database },
      ],
    });
  }

  return groups;
}

function SideNav({ persona, route, onNavigate }) {
  const groups = buildSideNav(persona);
  return (
    <nav className="sidenav" aria-label="주 메뉴">
      <div style={{padding: "14px 14px 6px"}}>
        <div style={{fontSize: 13, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em"}}>
          {persona.name} {persona.title}
        </div>
        <div style={{fontSize: 11, color: "var(--muted)", marginTop: 2}}>
          {personaSubtitle(persona)}
        </div>
      </div>
      {groups.map((g, gi) => (
        <div key={gi} style={{marginTop: gi === 0 ? 4 : 8}}>
          <div className="nav-section" style={{padding: "6px 14px 4px"}}>{g.label}</div>
          {g.items.map((it) => {
            const active = route === it.id;
            return (
              <button
                key={it.id}
                className={"nav-item" + (active ? " active" : "")}
                onClick={() => onNavigate(it.id)}
                title={it.hint || ""}
              >
                <span className="nav-icon">{it.icon}</span>
                <span style={{display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.25, minWidth: 0, flex: 1}}>
                  <span style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%"}}>{it.label}</span>
                  {it.hint && !active && (
                    <span style={{fontSize: 10.5, color: "var(--muted)", fontWeight: 400, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%"}}>
                      {it.hint}
                    </span>
                  )}
                </span>
                {it.count ? <span className="count">{it.count}</span> : null}
              </button>
            );
          })}
        </div>
      ))}
      <div style={{flex: 1}}></div>
      <div className="nav-section">데모</div>
      <div style={{padding: "6px 14px 14px", fontSize: 11, color: "var(--muted)", lineHeight: 1.5}}>
        Tweaks에서 페르소나를 바꿔보세요. 같은 사람이 여러 업무를 동시에 가질 수 있어요.
      </div>
    </nav>
  );
}

function personaSubtitle(p) {
  const parts = [];
  if (p.assignments.homerooms.length) parts.push(p.assignments.homerooms[0].name + " 담임");
  if (p.assignments.courses.length) {
    const subjects = [...new Set(p.assignments.courses.map(c => c.subject))];
    parts.push(subjects.join("·") + " " + p.assignments.courses.length + "반");
  }
  if (p.permissions.schoolAdmin && parts.length === 0) parts.push(p.title);
  if (p.permissions.districtAdmin) parts.push("학생지원과");
  return parts.length ? parts.join(" · ") : p.title;
}

// ----- shared bits -----
function Tag({ tone = "muted", children }) {
  return <span className={"tag " + tone}><span className="dot" style={{opacity: 0.7}}></span>{children}</span>;
}

function StatusPill({ state, children }) {
  const s = LC.toneStyles[state] || LC.toneStyles.normal;
  return (
    <span className="status-pill" style={{ background: s.bg, borderColor: s.border, color: s.text }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: "currentColor", opacity: 0.7, display: "inline-block" }}></span>
      {children}
    </span>
  );
}

function Avatar({ student, size = "" }) {
  const cls = "avatar" + (size ? " " + size : "");
  return (
    <span className={cls} style={{ background: student.color }}>
      {student.name.slice(-2)}
    </span>
  );
}

function Sparkline({ values, color = "var(--primary)", height = 36, width = 120, fill = true }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / (values.length - 1);
  const pts = values.map((v, i) => [i * stepX, height - ((v - min) / range) * (height - 4) - 2]);
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const area = `${path} L${width},${height} L0,${height} Z`;
  return (
    <svg className="spark" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{height}}>
      {fill && <path d={area} fill={color} opacity="0.12" />}
      <path d={path} fill="none" stroke={color} strokeWidth="1.6" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 2.6 : 0} fill={color} />
      ))}
    </svg>
  );
}

// expose
Object.assign(window, { Icons, TopBar, SideNav, Tag, StatusPill, Avatar, Sparkline });
