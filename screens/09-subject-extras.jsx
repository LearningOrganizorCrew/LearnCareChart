// Screen 09: 교과교사 추가 화면
// (1) lookup — 학생별 기록 조회: 자기 과목 학생들의 누적 기록을 모아 본다.
// (2) mysignals — 내가 올린 신호: 자기가 전달한 신호의 처리 상태와 응답률.

// =================================================================
// LOOKUP — 학생별 기록 조회
// =================================================================
function StudentLookup({ persona, onOpenStudent }) {
  const [section, setSection] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState("s01");

  const sections = ["all", ...persona.assignments.courses.map((c) => c.section)];
  const students = React.useMemo(() => {
    return LC.subjectStudents
      .filter((s) => section === "all" || s.section === section)
      .filter((s) => !query || s.name.includes(query));
  }, [section, query]);

  const selected = LC.subjectStudents.find((s) => s.id === selectedId) || students[0];

  return (
    <div className="col" style={{gap: 18}}>
      <div className="page-head">
        <div>
          <div className="crumbs">교과 · {persona.name} 교사 <span className="sep">›</span> 학생별 기록 조회</div>
          <h1 className="page-title">학생별 기록 조회</h1>
          <div className="page-sub">
            내가 가르치는 과목 · 학생들의 누적 차시 기록 / 수행평가 / 과제 / 변화 신호를 한 곳에서 봅니다.
            <span style={{color: "var(--muted)", marginLeft: 8}}>다른 과목 기록은 권한상 보이지 않습니다.</span>
          </div>
        </div>
        <div className="row" style={{gap: 8}}>
          <button className="btn">{Icons.Folder}CSV 내보내기</button>
          <button className="btn">{Icons.Settings}열 표시 설정</button>
        </div>
      </div>

      <div className="row" style={{gap: 14, alignItems: "flex-start"}}>
        {/* 좌측 — 학생 리스트 */}
        <div className="card" style={{width: 320, flexShrink: 0, padding: 0, overflow: "hidden"}}>
          <div style={{padding: "12px 14px", borderBottom: "1px solid var(--border)"}}>
            <div className="row" style={{gap: 8, marginBottom: 8}}>
              <select className="select input" value={section} onChange={(e) => setSection(e.target.value)} style={{flex: 1, fontSize: 12.5}}>
                {sections.map((s) => <option key={s} value={s}>{s === "all" ? "전체 반" : s + "반"}</option>)}
              </select>
            </div>
            <div style={{position: "relative"}}>
              <input className="input" placeholder="학생 이름 검색" value={query} onChange={(e) => setQuery(e.target.value)} style={{fontSize: 12.5, paddingLeft: 30}} />
              <span style={{position: "absolute", left: 9, top: 9, color: "var(--muted)"}}>{Icons.Search}</span>
            </div>
            <div className="muted" style={{fontSize: 11, marginTop: 8}}>{students.length}명</div>
          </div>
          <div style={{maxHeight: 540, overflowY: "auto"}}>
            {students.map((s) => {
              const stu = LC.students.find((x) => x.id === s.id);
              const active = s.id === selectedId;
              const trendColor = s.trend === "down" ? "var(--alert)" : s.trend === "up" ? "var(--positive)" : "var(--muted)";
              return (
                <button key={s.id} onClick={() => setSelectedId(s.id)} style={{
                  width: "100%", textAlign: "left", border: "none",
                  background: active ? "var(--primary-soft)" : "transparent",
                  padding: "10px 14px",
                  borderLeft: active ? "3px solid var(--primary)" : "3px solid transparent",
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  {stu && <Avatar student={stu} size="sm" />}
                  <div style={{flex: 1, minWidth: 0}}>
                    <div className="row" style={{justifyContent: "space-between"}}>
                      <span style={{fontSize: 13, fontWeight: 700, color: active ? "var(--primary-text)" : "var(--text)"}}>{s.name}</span>
                      <span style={{fontSize: 11, color: "var(--muted)", fontVariantNumeric: "tabular-nums"}}>{s.section}</span>
                    </div>
                    <div className="row" style={{gap: 6, marginTop: 3, fontSize: 11}}>
                      <span style={{color: trendColor, fontWeight: 700}}>
                        {s.trend === "down" ? "▼" : s.trend === "up" ? "▲" : "—"}
                      </span>
                      <span className="muted" style={{fontVariantNumeric: "tabular-nums"}}>
                        참여 {Math.round(s.participation * 100)}% · 신호 {s.signals}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 우측 — 학생 상세 */}
        {selected && <StudentSubjectDetail student={selected} persona={persona} onOpenStudent={onOpenStudent} />}
      </div>
    </div>
  );
}

function StudentSubjectDetail({ student, persona, onOpenStudent }) {
  const stu = LC.students.find((x) => x.id === student.id);
  if (!stu) return <div className="card" style={{flex: 1}}><div className="muted">학생을 선택하세요.</div></div>;

  // 차시별 기록 mock — 최근 6차시
  const recentSessions = [
    { date: "5/20", topic: "발표 활동 1차",  pres: "miss",    part: "partial", note: "준비 부족" },
    { date: "5/17", topic: "모둠 토론",       pres: "present", part: "full",    note: "" },
    { date: "5/13", topic: "독서 감상 발표",  pres: "present", part: "partial", note: "발표 시간 짧음" },
    { date: "5/10", topic: "단원 정리 활동",  pres: "present", part: "full",    note: "" },
    { date: "5/07", topic: "글쓰기 활동",     pres: "present", part: "partial", note: "" },
    { date: "5/03", topic: "수업 안내",       pres: "present", part: "full",    note: "" },
  ];

  const presentTone = (v) => v === "miss" ? "alert" : v === "partial" ? "attention" : "positive";
  const presentLabel = (v) => v === "miss" ? "미참여" : v === "partial" ? "부분" : "참여";
  const partTone = (v) => v === "miss" ? "alert" : v === "partial" ? "attention" : "positive";
  const partLabel = (v) => v === "miss" ? "낮음" : v === "partial" ? "보통" : "활발";

  return (
    <div className="col" style={{flex: 1, minWidth: 0, gap: 14}}>
      {/* 상단 — 학생 헤더 */}
      <div className="card">
        <div className="row" style={{gap: 14, alignItems: "center"}}>
          <Avatar student={stu} />
          <div style={{flex: 1, minWidth: 0}}>
            <div className="row" style={{gap: 8}}>
              <span style={{fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em"}}>{student.name}</span>
              <span className="muted" style={{fontSize: 12.5}}>{student.section}반 · {persona.assignments.courses[0]?.subject}</span>
            </div>
            <div className="row" style={{gap: 10, marginTop: 8}}>
              <Metric label="출석률" value={Math.round(student.attendance * 100) + "%"} tone={student.attendance >= 0.95 ? "positive" : "attention"} />
              <Metric label="평균 참여" value={Math.round(student.participation * 100) + "%"} tone={student.participation >= 0.8 ? "positive" : student.participation >= 0.7 ? "info" : "attention"} />
              <Metric label="최근 수행평가" value={student.lastScore + "/30"} tone={student.lastScore >= 24 ? "positive" : student.lastScore >= 18 ? "info" : "attention"} />
              <Metric label="이번 학기 신호" value={student.signals + "건"} tone={student.signals >= 3 ? "alert" : student.signals >= 2 ? "attention" : "muted"} />
            </div>
          </div>
          <div className="row" style={{gap: 6}}>
            <button className="btn">담임에게 신호 전달</button>
            <button className="btn primary" onClick={() => onOpenStudent(student.id)}>학생 차트 보기</button>
          </div>
        </div>
      </div>

      {/* 차시별 기록 */}
      <div className="card" style={{padding: 0, overflow: "hidden"}}>
        <div className="row" style={{padding: "12px 18px", borderBottom: "1px solid var(--border)"}}>
          <div style={{fontWeight: 700, fontSize: 13}}>최근 차시 기록 · {persona.assignments.courses[0]?.subject}</div>
          <div className="grow"></div>
          <span className="muted" style={{fontSize: 12}}>최근 6차시 표시</span>
        </div>
        <table className="tbl" style={{borderRadius: 0}}>
          <thead>
            <tr>
              <th>일자</th>
              <th>차시 주제</th>
              <th>발표</th>
              <th>활동 참여</th>
              <th>메모</th>
            </tr>
          </thead>
          <tbody>
            {recentSessions.map((s, i) => (
              <tr key={i}>
                <td className="num" style={{fontVariantNumeric: "tabular-nums"}}>{s.date}</td>
                <td><b>{s.topic}</b></td>
                <td><span className={"tag " + presentTone(s.pres)}>{presentLabel(s.pres)}</span></td>
                <td><span className={"tag " + partTone(s.part)}>{partLabel(s.part)}</span></td>
                <td className="muted" style={{fontSize: 12.5}}>{s.note || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 수행평가 + 과제 요약 */}
      <div className="row" style={{gap: 14}}>
        <div className="card" style={{flex: 1}}>
          <div className="card-head">
            <h3 className="card-title">수행평가 점수</h3>
            <span className="tag muted">{LC.assessment.name}</span>
          </div>
          <div className="col" style={{gap: 10}}>
            {LC.assessment.rubric.map((r) => {
              const score = student.id === "s01" ? [4, 3, 3, 3, 5][LC.assessment.rubric.indexOf(r)] || 0
                : student.id === "s02" ? [7, 5, 5, 5, 5][LC.assessment.rubric.indexOf(r)] || 0
                : Math.round(r.max * student.participation);
              const pct = score / r.max;
              const c = pct >= 0.75 ? "var(--positive)" : pct >= 0.55 ? "var(--info)" : pct >= 0.4 ? "var(--attention)" : "var(--alert)";
              return (
                <div key={r.id} className="row" style={{gap: 10}}>
                  <span style={{minWidth: 90, fontSize: 12.5, fontWeight: 600}}>{r.name}</span>
                  <div style={{flex: 1, height: 6, background: "var(--bg-soft)", borderRadius: 999, overflow: "hidden"}}>
                    <div style={{width: pct * 100 + "%", height: "100%", background: c, borderRadius: 999}}></div>
                  </div>
                  <span style={{minWidth: 50, textAlign: "right", fontWeight: 700, color: c, fontVariantNumeric: "tabular-nums"}}>
                    {score}<span className="muted" style={{fontWeight: 500}}>/{r.max}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card" style={{width: 300}}>
          <div className="card-head">
            <h3 className="card-title">과제 제출</h3>
          </div>
          <div className="col" style={{gap: 8}}>
            {LC.assignments.map((a) => {
              const st = (LC.assignmentStatusByStudent[a.id] || {})[student.id] || "submit";
              const cfg = {
                submit: { label: "제출", c: "var(--positive)", bg: "var(--positive-bg)" },
                late:   { label: "지연", c: "var(--attention)", bg: "var(--attention-bg)" },
                miss:   { label: "미제출", c: "var(--alert)", bg: "var(--alert-bg)" },
              }[st];
              return (
                <div key={a.id} className="row" style={{
                  padding: "8px 12px", border: "1px solid var(--border)", borderRadius: 8,
                  background: cfg.bg,
                }}>
                  <div style={{flex: 1, minWidth: 0}}>
                    <div style={{fontSize: 12.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{a.title}</div>
                    <div className="muted" style={{fontSize: 11}}>마감 {a.due}</div>
                  </div>
                  <span style={{fontSize: 11, fontWeight: 700, color: cfg.c}}>{cfg.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, tone }) {
  const c = tone === "alert" ? "var(--alert)" : tone === "attention" ? "var(--attention)" : tone === "info" ? "var(--info)" : tone === "positive" ? "var(--positive)" : "var(--muted)";
  return (
    <div style={{padding: "6px 10px", border: "1px solid var(--border)", borderRadius: 8, background: "var(--surface-2)"}}>
      <div style={{fontSize: 10.5, color: "var(--muted)", fontWeight: 600}}>{label}</div>
      <div style={{fontSize: 15, fontWeight: 700, color: c, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em", marginTop: 2}}>{value}</div>
    </div>
  );
}

// =================================================================
// MYSIGNALS — 내가 올린 신호
// =================================================================
function MySignals({ persona, onOpenStudent }) {
  const [filter, setFilter] = React.useState("all"); // all | pending | acknowledged | overdue
  const [period, setPeriod] = React.useState("이번 학기");
  const [hoverId, setHoverId] = React.useState(null);

  const filtered = React.useMemo(() => {
    if (filter === "pending") return LC.mySignals.filter((s) => s.status.includes("대기"));
    if (filter === "ack")     return LC.mySignals.filter((s) => s.status.includes("확인됨") || s.status.includes("연결"));
    if (filter === "overdue") return LC.mySignals.filter((s) => s.overdue);
    return LC.mySignals;
  }, [filter]);

  return (
    <div className="col" style={{gap: 18}}>
      <div className="page-head">
        <div>
          <div className="crumbs">교과 · {persona.name} 교사 <span className="sep">›</span> 내가 올린 신호</div>
          <h1 className="page-title">내가 올린 신호</h1>
          <div className="page-sub">
            수업 기록에서 발생한 신호가 담임/상담교사에게 어떻게 전달되고 처리되는지 추적합니다.
            <span style={{color: "var(--muted)", marginLeft: 8}}>담임 화면에서 어떻게 보이는지는 권한상 직접 열람할 수 없습니다.</span>
          </div>
        </div>
        <div className="row" style={{gap: 8}}>
          <div className="segmented">
            <button className={period === "이번 학기" ? "active" : ""} onClick={() => setPeriod("이번 학기")}>이번 학기</button>
            <button className={period === "최근 4주" ? "active" : ""} onClick={() => setPeriod("최근 4주")}>최근 4주</button>
          </div>
        </div>
      </div>

      {/* KPI */}
      <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12}}>
        {LC.mySignalKpis.map((k) => (
          <div key={k.label} className={"kpi " + k.tone}>
            <div className="label">{k.label}</div>
            <div className="value">{k.value}</div>
            <div className="meta">{k.meta}</div>
          </div>
        ))}
      </div>

      <div className="row" style={{gap: 14, alignItems: "flex-start"}}>
        <div className="col" style={{flex: 1, minWidth: 0, gap: 14}}>
          {/* 필터 */}
          <div className="row" style={{gap: 6}}>
            {[
              { id: "all",     label: "전체",        count: LC.mySignals.length },
              { id: "pending", label: "담임 확인 대기", count: LC.mySignals.filter((s) => s.status.includes("대기")).length, tone: "attention" },
              { id: "ack",     label: "처리됨",        count: LC.mySignals.filter((s) => s.status.includes("확인됨") || s.status.includes("연결")).length, tone: "positive" },
              { id: "overdue", label: "응답 지연",      count: LC.mySignals.filter((s) => s.overdue).length, tone: "alert" },
            ].map((f) => (
              <button key={f.id} className={"btn sm" + (filter === f.id ? " primary" : "")} onClick={() => setFilter(f.id)}>
                {f.label} <span style={{
                  marginLeft: 6, padding: "1px 7px", borderRadius: 999,
                  background: filter === f.id ? "rgba(255,255,255,0.25)" : "var(--bg-soft)",
                  color: filter === f.id ? "white" : "var(--muted)",
                  fontSize: 10.5, fontWeight: 700, fontVariantNumeric: "tabular-nums",
                }}>{f.count}</span>
              </button>
            ))}
          </div>

          {/* 신호 카드 리스트 */}
          <div className="col" style={{gap: 10}}>
            {filtered.map((sg) => (
              <SignalCard key={sg.id} sg={sg} onOpenStudent={onOpenStudent} hovered={hoverId === sg.id} onHover={(v) => setHoverId(v ? sg.id : null)} />
            ))}
            {filtered.length === 0 && (
              <div className="card" style={{padding: 40, textAlign: "center"}}>
                <div className="muted">해당 신호가 없습니다.</div>
              </div>
            )}
          </div>
        </div>

        {/* 우측 — 처리 패턴 분석 */}
        <div className="col" style={{width: 320, flexShrink: 0, gap: 14}}>
          <div className="card">
            <div className="card-head">
              <h3 className="card-title">신호 → 처리 흐름</h3>
            </div>
            <div className="col" style={{gap: 8}}>
              <FlowStep label="내가 입력" value={38} c="var(--primary)" />
              <FlowStep label="담임 확인" value={35} c="var(--info)" />
              <FlowStep label="상담·기초학력 연결" value={14} c="var(--positive)" />
              <FlowStep label="회복 모니터링" value={9} c="var(--positive)" />
              <FlowStep label="단발성 — 종결" value={6} c="var(--muted)" />
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3 className="card-title">카테고리별</h3>
            </div>
            <div className="col" style={{gap: 8}}>
              {[
                { label: "참여 변화", value: 14, c: "var(--alert)" },
                { label: "기초 개념", value: 9,  c: "var(--attention)" },
                { label: "출결·제출", value: 7,  c: "var(--attention)" },
                { label: "긍정 변화", value: 6,  c: "var(--positive)" },
                { label: "기타", value: 2,  c: "var(--muted)" },
              ].map((row) => (
                <div key={row.label} className="row" style={{gap: 10}}>
                  <span style={{flex: 1, fontSize: 12.5}}>{row.label}</span>
                  <div style={{flex: 1.5, height: 5, background: "var(--bg-soft)", borderRadius: 999, overflow: "hidden"}}>
                    <div style={{width: (row.value / 14) * 100 + "%", height: "100%", background: row.c, borderRadius: 999}}></div>
                  </div>
                  <span style={{minWidth: 24, textAlign: "right", fontWeight: 700, fontSize: 12.5, fontVariantNumeric: "tabular-nums"}}>{row.value}</span>
                </div>
              ))}
            </div>
            <div className="divider"></div>
            <div className="ai-card" style={{padding: "10px 12px"}}>
              <div className="ai-body" style={{fontSize: 12, lineHeight: 1.55}}>
                <b>참여 변화</b> 카테고리에서 응답률이 가장 높습니다. <b>기초 개념</b> 카테고리는 평균 응답 시간이 다른 카테고리보다 1.4배 깁니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignalCard({ sg, onOpenStudent, hovered, onHover }) {
  const stu = LC.students.find((s) => s.id === sg.studentId);
  const weightColor = sg.weight === "alert" ? "var(--alert)" : sg.weight === "attention" ? "var(--attention)" : sg.weight === "positive" ? "var(--positive)" : "var(--muted)";
  const statusBg = sg.statusTone === "info" ? "var(--info-bg)" : sg.statusTone === "positive" ? "var(--positive-bg)" : sg.statusTone === "attention" ? "var(--attention-bg)" : "var(--bg-soft)";
  const statusFg = sg.statusTone === "info" ? "var(--info)" : sg.statusTone === "positive" ? "var(--positive)" : sg.statusTone === "attention" ? "var(--attention)" : "var(--muted)";
  return (
    <div
      onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}
      style={{
        border: "1px solid " + (hovered ? "var(--primary-soft-border)" : "var(--border)"),
        borderRadius: 12,
        background: "var(--surface)",
        padding: "14px 16px",
        boxShadow: hovered ? "var(--shadow)" : "var(--shadow-sm)",
        display: "flex", gap: 14, alignItems: "stretch",
      }}>
      {/* 좌측 — 강도 + 시간 */}
      <div style={{
        width: 92, flexShrink: 0,
        borderRight: "1px solid var(--border)",
        paddingRight: 12,
      }}>
        <div style={{
          fontSize: 10.5, fontWeight: 700, color: "white",
          background: weightColor,
          padding: "2px 8px", borderRadius: 4, display: "inline-block",
          letterSpacing: "0.04em", textTransform: "uppercase",
        }}>{sg.weight === "alert" ? "강" : sg.weight === "attention" ? "중" : sg.weight === "positive" ? "긍정" : "약"}</div>
        <div style={{fontSize: 12.5, fontWeight: 700, marginTop: 8, fontVariantNumeric: "tabular-nums"}}>{sg.date}</div>
        <div className="muted" style={{fontSize: 11, fontVariantNumeric: "tabular-nums"}}>{sg.time}</div>
        <div className="muted" style={{fontSize: 11, marginTop: 8}}>{sg.course}</div>
      </div>

      {/* 중앙 — 내용 */}
      <div style={{flex: 1, minWidth: 0}}>
        <div className="row" style={{gap: 10, marginBottom: 6}}>
          {stu && <Avatar student={stu} size="sm" />}
          <button onClick={() => onOpenStudent(sg.studentId)} style={{
            background: "transparent", border: "none", padding: 0, cursor: "pointer",
            fontWeight: 700, fontSize: 14, color: "var(--text)", letterSpacing: "-0.01em",
          }}>
            {sg.student}
          </button>
          <span className="tag muted" style={{fontSize: 10.5}}>{sg.category}</span>
        </div>
        <div style={{fontSize: 13, lineHeight: 1.5, color: "var(--text-soft)"}}>{sg.text}</div>
      </div>

      {/* 우측 — 처리 상태 */}
      <div style={{
        width: 200, flexShrink: 0,
        borderLeft: "1px solid var(--border)",
        paddingLeft: 14,
        display: "flex", flexDirection: "column", gap: 6, justifyContent: "center",
      }}>
        <div style={{fontSize: 10.5, color: "var(--muted)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 700}}>
          전달 · {sg.routedTo}
        </div>
        <div style={{
          padding: "4px 10px", borderRadius: 6,
          background: statusBg, color: statusFg,
          fontSize: 12, fontWeight: 700, alignSelf: "flex-start",
        }}>{sg.status}</div>
        <div className="muted" style={{fontSize: 11}}>
          {sg.overdue ? <span style={{color: "var(--alert)", fontWeight: 700}}>응답 지연</span> : `응답 ${sg.ackTime}`}
        </div>
      </div>
    </div>
  );
}

function FlowStep({ label, value, c }) {
  return (
    <div className="row" style={{gap: 10, alignItems: "center"}}>
      <span style={{flex: 1, fontSize: 12.5}}>{label}</span>
      <div style={{flex: 1, height: 18, background: "var(--bg-soft)", borderRadius: 4, overflow: "hidden", position: "relative"}}>
        <div style={{width: (value / 38) * 100 + "%", height: "100%", background: c, borderRadius: 4}}></div>
      </div>
      <span style={{minWidth: 24, textAlign: "right", fontWeight: 700, fontSize: 13, color: c, fontVariantNumeric: "tabular-nums"}}>{value}</span>
    </div>
  );
}

window.StudentLookup = StudentLookup;
window.MySignals = MySignals;
