// Screen 0: 오늘의 업무 (Teacher Workspace home)
// "역할 선택"이 아니라 "오늘 내가 해야 할 일"이 첫 화면.
// 페르소나의 assignments + permissions에서 자동으로 카드를 만든다.

function TodayWorkspace({ persona, onNavigate, onOpenStudent }) {
  const cap = LC.personaCapabilities(persona);
  const t = persona.today || {};

  // 우리 반 관련 학생만 추리기
  const homeroom = persona.assignments.homerooms[0];
  const homeroomCases = homeroom
    ? LC.cases.filter((c) => c.cls === homeroom.classCode)
    : [];
  const briefingCardsForHomeroom = homeroom
    ? LC.briefingCards
    : [];

  return (
    <div className="col" style={{gap: 18}}>
      {/* 헤더 */}
      <div className="page-head">
        <div>
          <div className="crumbs">{persona.school} <span className="sep">›</span> 오늘의 업무</div>
          <h1 className="page-title">
            안녕하세요, {persona.name} {persona.title}님.
          </h1>
          <div className="page-sub">
            {hatLine(persona, cap)}
          </div>
        </div>
        <div className="row" style={{gap: 8, alignItems: "center"}}>
          <span className="muted" style={{fontSize: 12}}>2026년 5월 22일 (금)</span>
          <button className="btn">{Icons.Calendar}주간 일정</button>
        </div>
      </div>

      {/* 페르소나가 가진 컨텍스트 요약 — 한눈에 "내가 오늘 어떤 모자를 쓰고 있나" */}
      <PersonaHats persona={persona} cap={cap} onNavigate={onNavigate} />

      {/* 메인 그리드: 컨텍스트 카드들이 capability에 따라 자동으로 들어옴 — 담임이 먼저 */}
      <div style={{display: "grid", gridTemplateColumns: gridTemplate(cap), gap: 14}}>
        {cap.hasHomeroom && (
          <TodayHomeroomCard
            persona={persona}
            briefingCards={briefingCardsForHomeroom}
            cases={homeroomCases}
            onNavigate={onNavigate}
            onOpenStudent={onOpenStudent}
          />
        )}
        {cap.hasCourses && (
          <TodayCourseCard persona={persona} onNavigate={onNavigate} />
        )}
        {cap.canManageSchool && (
          <TodaySchoolAdminCard persona={persona} onNavigate={onNavigate} />
        )}
        {cap.canManageDistrict && (
          <TodayDistrictAdminCard persona={persona} onNavigate={onNavigate} />
        )}
        {!cap.hasCourses && !cap.hasHomeroom && !cap.canManageSchool && !cap.canManageDistrict && (
          <div className="card" style={{padding: 40, textAlign: "center"}}>
            <div className="muted">배정된 업무가 없습니다.</div>
          </div>
        )}
      </div>

      {/* 하단 보조 라인 */}
      {(cap.hasCourses || cap.hasHomeroom) && (
        <RecentSignalsStrip persona={persona} onOpenStudent={onOpenStudent} />
      )}
    </div>
  );
}

function hatLine(persona, cap) {
  const hats = [];
  if (cap.hasHomeroom) hats.push(`${persona.assignments.homerooms[0].name} 담임`);
  if (cap.hasCourses) {
    const subjects = [...new Set(persona.assignments.courses.map(c => c.subject))];
    hats.push(`${subjects.join("·")} 교과 (${persona.assignments.courses.length}개 반)`);
  }
  if (cap.canManageSchool) hats.push("학교 관리자");
  if (cap.canManageDistrict) hats.push("교육청 학생지원");
  if (hats.length === 0) return "오늘은 배정된 업무가 없습니다.";
  return "오늘은 " + hats.join(" · ") + " 업무를 보고 있어요.";
}

function gridTemplate(cap) {
  const cards = [cap.hasCourses, cap.hasHomeroom, cap.canManageSchool, cap.canManageDistrict].filter(Boolean).length;
  if (cards === 1) return "1fr";
  if (cards === 2) return "1fr 1fr";
  if (cards === 3) return "1.1fr 1.1fr 0.9fr";
  return "1.1fr 1.1fr 0.9fr 0.9fr";
}

// ===================== Persona Hats =====================
function PersonaHats({ persona, cap, onNavigate }) {
  const hats = [];
  if (cap.hasHomeroom) hats.push({
    icon: Icons.Users, label: "담임",
    detail: persona.assignments.homerooms[0].name,
    sub: `${persona.assignments.homerooms[0].students}명`,
    target: "briefing",
  });
  if (cap.hasCourses) hats.push({
    icon: Icons.Clipboard, label: "교과",
    detail: [...new Set(persona.assignments.courses.map(c => c.subject))].join(", "),
    sub: `${persona.assignments.courses.length}개 반 · ${persona.assignments.courses.reduce((a,c)=>a+c.students,0)}명`,
    target: "record",
  });
  if (cap.canManageSchool) hats.push({
    icon: Icons.Dashboard, label: "학교 관리자",
    detail: persona.school,
    sub: "전체 운영 권한",
    target: "school",
  });
  if (cap.canManageDistrict) hats.push({
    icon: Icons.Dashboard, label: "교육청",
    detail: persona.school,
    sub: "지역 집계 권한",
    target: "admin",
  });
  if (hats.length <= 1) return null; // 한 가지 모자만 쓰면 굳이 보여줄 필요 없음

  return (
    <div className="card" style={{padding: "14px 18px", background: "var(--surface-2)"}}>
      <div className="row" style={{justifyContent: "space-between", marginBottom: 10}}>
        <div>
          <span style={{fontSize: 12, fontWeight: 700, color: "var(--text-soft)", letterSpacing: "-0.01em"}}>오늘 가지고 있는 업무 컨텍스트</span>
          <span className="muted" style={{fontSize: 11.5, marginLeft: 8}}>{hats.length}개 모자</span>
        </div>
        <span className="muted" style={{fontSize: 11}}>좌측 메뉴에서 컨텍스트를 전환할 수 있어요</span>
      </div>
      <div className="row" style={{gap: 10}}>
        {hats.map((h) => (
          <button key={h.label} onClick={() => onNavigate(h.target)} style={{
            flex: 1, textAlign: "left", padding: "10px 12px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 10, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{
              width: 32, height: 32, borderRadius: 8,
              background: "var(--primary-soft)", color: "var(--primary-text)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{h.icon}</span>
            <div style={{minWidth: 0, flex: 1}}>
              <div style={{fontSize: 10.5, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.04em", textTransform: "uppercase"}}>{h.label}</div>
              <div style={{fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{h.detail}</div>
              <div className="muted" style={{fontSize: 11}}>{h.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ===================== Today's Courses =====================
function TodayCourseCard({ persona, onNavigate }) {
  const sched = persona.today.schedule || [];
  const pending = sched.filter((s) => s.state !== "recorded").length;
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h3 className="card-title">오늘의 수업</h3>
          <div className="muted" style={{fontSize: 11.5, marginTop: 2}}>
            {sched.length}개 차시 · 기록 {sched.length - pending}/{sched.length}
          </div>
        </div>
        <button className="btn sm primary" onClick={() => onNavigate("record")}>수업 기록 →</button>
      </div>
      <div className="col" style={{gap: 8}}>
        {sched.map((s, i) => {
          const isCurrent = s.state === "current";
          const isRecorded = s.state === "recorded";
          const tone = isCurrent ? "info" : isRecorded ? "positive" : "muted";
          const c = tone === "info" ? "var(--info)" : tone === "positive" ? "var(--positive)" : "var(--muted)";
          const bg = tone === "info" ? "var(--info-bg)" : tone === "positive" ? "var(--positive-bg)" : "var(--bg-soft)";
          const border = tone === "info" ? "oklch(0.86 0.06 230)" : tone === "positive" ? "var(--positive-border)" : "var(--border)";
          return (
            <div key={i} onClick={() => onNavigate("record")} style={{
              padding: "10px 14px",
              border: "1px solid " + border, background: bg,
              borderRadius: 10, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 54, textAlign: "center", padding: "4px 0",
                background: "var(--surface)", border: "1px solid " + border,
                borderRadius: 6,
                fontSize: 11.5, fontWeight: 700, color: c,
              }}>{s.period}</div>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{fontWeight: 700, fontSize: 13.5, letterSpacing: "-0.01em"}}>{s.course}</div>
                <div className="muted" style={{fontSize: 11.5, marginTop: 2}}>
                  {isRecorded ? `기록 완료 · 신호 ${s.signals}건 발생`
                    : isCurrent ? "지금 진행 중 — 차시 기록을 시작하세요"
                    : "수업 전 — 기록표 미리 보기"}
                </div>
              </div>
              <span className="tag" style={{
                color: c, background: "transparent", border: "1px solid " + border, fontSize: 11,
              }}>
                {isRecorded ? "완료" : isCurrent ? "진행" : "예정"}
              </span>
            </div>
          );
        })}
      </div>
      <div className="divider"></div>
      <div className="row" style={{justifyContent: "space-between", fontSize: 12}}>
        <span className="muted">담임·상담에게 전달한 신호</span>
        <span style={{fontWeight: 700}}>
          <span style={{color: "var(--primary)"}}>{persona.today.mySignalsSent || 0}건 전달</span>
          <span className="muted" style={{fontWeight: 500}}> · {persona.today.mySignalsAck || 0}건 확인됨</span>
        </span>
      </div>
    </div>
  );
}

// ===================== Homeroom =====================
function TodayHomeroomCard({ persona, briefingCards, cases, onNavigate, onOpenStudent }) {
  const hr = persona.assignments.homerooms[0];
  const b = persona.today.briefing || {};
  const pendingCases = cases.filter((c) => c.state === "담임 확인 필요" || c.state === "확인 필요").length;
  const overdueCases = cases.filter((c) => c.next !== "—" && parseDate(c.next) < today() - 2).length;

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h3 className="card-title">우리 반 {hr.name}</h3>
          <div className="muted" style={{fontSize: 11.5, marginTop: 2}}>학생 {hr.students}명 · 이번 주 변화 신호 {b.changes || 0}건</div>
        </div>
        <button className="btn sm primary" onClick={() => onNavigate("briefing")}>주간 브리핑 →</button>
      </div>

      {/* 우리 반 KPI */}
      <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 12}}>
        <MiniKpi label="확인 필요" value={b.needsCheck || 0} tone="attention" />
        <MiniKpi label="회복 신호" value={b.recovery || 0} tone="positive" />
        <MiniKpi label="진행 케이스" value={cases.length} tone="info" />
        <MiniKpi label="후속 지연" value={overdueCases || b.overdue || 0} tone="alert" />
      </div>

      {/* 확인 필요 학생 미리보기 */}
      <div style={{fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 8}}>
        확인이 필요한 학생
      </div>
      <div className="col" style={{gap: 6}}>
        {briefingCards.filter((c) => c.state === "attention").slice(0, 3).map((c) => {
          const s = LC.students.find((x) => x.id === c.studentId);
          return (
            <div key={c.studentId} onClick={() => onOpenStudent(c.studentId)} style={{
              padding: "8px 10px",
              border: "1px solid var(--attention-border)", background: "var(--attention-bg)",
              borderRadius: 8, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <Avatar student={s} size="sm" />
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{fontSize: 12.5, fontWeight: 700}}>{c.name}</div>
                <div className="muted" style={{fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{c.summary}</div>
              </div>
              <span style={{fontSize: 11, color: "var(--attention)", fontWeight: 700}}>{c.statusLabel}</span>
            </div>
          );
        })}
      </div>

      <div className="divider"></div>
      <div className="row" style={{gap: 6}}>
        <button className="btn sm" onClick={() => onNavigate("chart")} style={{flex: 1}}>학생 차트</button>
        <button className="btn sm" onClick={() => onNavigate("prep")} style={{flex: 1}}>AI 상담 준비</button>
        <button className="btn sm" onClick={() => onNavigate("board")} style={{flex: 1}}>우리 반 케이스 ({cases.length})</button>
      </div>
    </div>
  );
}

// ===================== School Admin =====================
function TodaySchoolAdminCard({ persona, onNavigate }) {
  const SA = LC.schoolAdmin;
  const topGaps = SA.unconnectedCases.slice(0, 3);
  return (
    <div className="card" style={{
      background: "linear-gradient(180deg, oklch(0.985 0.005 250), var(--surface))",
      borderColor: "oklch(0.88 0.04 250)",
    }}>
      <div className="card-head">
        <div>
          <h3 className="card-title">학교 관리</h3>
          <div className="muted" style={{fontSize: 11.5, marginTop: 2}}>{persona.school} 전체</div>
        </div>
        <button className="btn sm primary" onClick={() => onNavigate("school")}>대시보드 →</button>
      </div>

      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12}}>
        <MiniKpi label="이번 주 신규 신호" value={SA.kpis[0].value} tone="attention" />
        <MiniKpi label="미연계 누적" value={SA.unconnected} tone="alert" />
      </div>

      <div style={{fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 8}}>
        가장 오래된 미연계 케이스
      </div>
      <div className="col" style={{gap: 6}}>
        {topGaps.map((c) => (
          <div key={c.id} onClick={() => onNavigate("cases")} style={{
            padding: "8px 10px",
            border: "1px solid var(--border)",
            borderRadius: 8, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span className="mono" style={{fontSize: 10.5, color: "var(--muted)"}}>{c.id}</span>
            <span style={{fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>{c.code}</span>
            <span className="tag muted" style={{fontSize: 10.5}}>{c.category}</span>
            <div style={{flex: 1}}></div>
            <span style={{fontSize: 11, fontWeight: 700, color: c.since >= 10 ? "var(--alert)" : "var(--attention)"}}>{c.since}일</span>
          </div>
        ))}
      </div>
      <div className="divider"></div>
      <div className="row" style={{gap: 6}}>
        <button className="btn sm" onClick={() => onNavigate("grades")} style={{flex: 1}}>학년·반 지도</button>
        <button className="btn sm" onClick={() => onNavigate("teachers")} style={{flex: 1}}>교사 활동</button>
      </div>
    </div>
  );
}

// ===================== District =====================
function TodayDistrictAdminCard({ persona, onNavigate }) {
  return (
    <div className="card" style={{
      background: "linear-gradient(180deg, oklch(0.985 0.005 295), var(--surface))",
      borderColor: "oklch(0.86 0.06 295)",
    }}>
      <div className="card-head">
        <div>
          <h3 className="card-title">교육청 학생지원</h3>
          <div className="muted" style={{fontSize: 11.5, marginTop: 2}}>○○교육지원청 권역</div>
        </div>
        <button className="btn sm primary" onClick={() => onNavigate("admin")}>대시보드 →</button>
      </div>

      <div className="col" style={{gap: 8}}>
        {LC.regionMap.slice(0, 4).map((r) => {
          const color = r.gap >= 70 ? "var(--alert)" : r.gap >= 55 ? "var(--attention)" : r.gap >= 40 ? "var(--info)" : "var(--positive)";
          return (
            <div key={r.region} style={{
              padding: "8px 12px", border: "1px solid var(--border)", borderRadius: 8,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{fontSize: 12.5, fontWeight: 700, minWidth: 60}}>{r.region}</span>
              <span className="num" style={{fontSize: 16, fontWeight: 700, color, fontVariantNumeric: "tabular-nums", minWidth: 28}}>{r.gap}</span>
              <div style={{flex: 1, height: 5, background: "var(--bg-soft)", borderRadius: 999, overflow: "hidden"}}>
                <div style={{width: r.gap + "%", height: "100%", background: color, borderRadius: 999}}></div>
              </div>
              <span className="muted" style={{fontSize: 10.5, fontVariantNumeric: "tabular-nums"}}>학교 {r.schools}</span>
            </div>
          );
        })}
      </div>
      <div className="divider"></div>
      <div className="row" style={{gap: 6}}>
        <button className="btn sm" onClick={() => onNavigate("schoolcmp")} style={{flex: 1}}>학교군 비교</button>
        <button className="btn sm" onClick={() => onNavigate("policy")} style={{flex: 1}}>정책 리포트</button>
      </div>
    </div>
  );
}

// ===================== Recent signals strip =====================
function RecentSignalsStrip({ persona, onOpenStudent }) {
  const cap = LC.personaCapabilities(persona);
  // 교과교사는 자기 과목 학생들의 변화만, 담임은 우리 반 전체
  const signals = LC.briefingCards.slice(0, 5);
  return (
    <div className="card">
      <div className="card-head">
        <h3 className="card-title">최근 24시간 동안 발생한 신호</h3>
        <span className="muted" style={{fontSize: 12}}>
          {cap.hasHomeroom ? "우리 반 학생만 표시" : "내 과목 학생만 표시"}
        </span>
      </div>
      <div className="row" style={{gap: 8, overflowX: "auto"}}>
        {signals.map((c) => {
          const s = LC.students.find((x) => x.id === c.studentId);
          const stateColor = c.state === "attention" ? "var(--attention)" : c.state === "positive" ? "var(--positive)" : c.state === "info" ? "var(--info)" : "var(--muted)";
          return (
            <div key={c.studentId} onClick={() => onOpenStudent(c.studentId)} style={{
              minWidth: 200, padding: "10px 12px",
              border: "1px solid var(--border)", borderRadius: 8,
              cursor: "pointer", flexShrink: 0,
            }}>
              <div className="row" style={{gap: 8, marginBottom: 6}}>
                <Avatar student={s} size="sm" />
                <div style={{minWidth: 0, flex: 1}}>
                  <div style={{fontSize: 12.5, fontWeight: 700}}>{c.name}</div>
                  <div style={{fontSize: 10.5, color: stateColor, fontWeight: 700}}>{c.statusLabel}</div>
                </div>
              </div>
              <div className="muted" style={{fontSize: 11, lineHeight: 1.45}}>{c.summary}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===================== utils =====================
function MiniKpi({ label, value, tone }) {
  const c = tone === "alert" ? "var(--alert)" : tone === "attention" ? "var(--attention)" : tone === "info" ? "var(--info)" : tone === "positive" ? "var(--positive)" : "var(--muted)";
  return (
    <div style={{
      padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 8,
      display: "flex", flexDirection: "column", gap: 2,
    }}>
      <span className="muted" style={{fontSize: 10.5, fontWeight: 600}}>{label}</span>
      <span style={{fontSize: 17, fontWeight: 700, color: value > 0 ? c : "var(--muted)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em"}}>
        {value}
      </span>
    </div>
  );
}

function parseDate(s) {
  if (!s || s === "—") return Infinity;
  const [m, d] = s.split("/").map(Number);
  return m * 100 + d;
}
function today() { return 5 * 100 + 22; } // 5/22 모의 today

window.TodayWorkspace = TodayWorkspace;
