// Screen 1: 수업 기록 화면 (Class Record)
// 3개 탭: 차시 기록 (매 수업) / 수행평가 (항목별 채점) / 과제 (제출)

const { useState: useStateR, useMemo: useMemoR } = React;

function ClassRecord({ persona }) {
  const [tab, setTab] = useStateR("session");
  const courses = persona?.assignments?.courses || [];
  const [courseId, setCourseId] = useStateR(courses[0]?.id || "");
  const course = courses.find((c) => c.id === courseId) || courses[0];
  const teacherLabel = persona ? `${persona.name} ${persona.title}` : "교과교사";
  const hasMultiple = courses.length > 1;

  if (!course) {
    return (
      <div className="card" style={{padding: 40, textAlign: "center"}}>
        <div className="muted">배정된 수업이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="col" style={{gap: 18}}>
      <div className="crumbs">
        {teacherLabel} <span className="sep">›</span> {course.subject} · {course.section}반 <span className="sep">›</span> {
          tab === "session" ? "차시 기록"
          : tab === "performance" ? "수행평가"
          : "과제"
        }
      </div>

      {/* 코스 선택기 — 교과교사가 가진 모든 반을 한 줄에 노출 */}
      {hasMultiple && (
        <CoursePicker
          courses={courses}
          selectedId={courseId}
          onSelect={setCourseId}
        />
      )}

      <SubjectHeader course={course} teacherLabel={teacherLabel} tab={tab} setTab={setTab} />

      {tab === "session"     && <SessionTab course={course} />}
      {tab === "performance" && <PerformanceTab course={course} />}
      {tab === "assignment"  && <AssignmentTab course={course} />}
    </div>
  );
}

// ===== Course picker — 교과교사의 담당 반 전환 =====
function CoursePicker({ courses, selectedId, onSelect }) {
  // 각 반별로 오늘 기록 상태 / 신호 수 mock — 실제로는 LC.coursesState
  const stateForCourse = (id) => {
    // 첫 번째 코스는 오늘 미입력, 두번째는 신호 발생, 나머지는 정상
    const i = courses.findIndex((c) => c.id === id);
    if (i === 0) return { label: "오늘 미입력", tone: "attention", signals: 0 };
    if (i === 1) return { label: "기록 완료 · 신호 2", tone: "info", signals: 2 };
    return { label: "기록 완료", tone: "muted", signals: 0 };
  };

  return (
    <div className="card" style={{padding: "10px 12px"}}>
      <div className="row" style={{gap: 10, flexWrap: "wrap"}}>
        <div style={{fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.04em", textTransform: "uppercase", padding: "6px 4px 0"}}>
          담당 반
        </div>
        <div className="row" style={{gap: 6, flexWrap: "wrap", flex: 1}}>
          {courses.map((c) => {
            const active = c.id === selectedId;
            const s = stateForCourse(c.id);
            const toneC = s.tone === "attention" ? "var(--attention)" : s.tone === "info" ? "var(--info)" : "var(--muted)";
            const toneBg = s.tone === "attention" ? "var(--attention-bg)" : s.tone === "info" ? "var(--info-bg)" : "var(--bg-soft)";
            return (
              <button key={c.id} onClick={() => onSelect(c.id)} style={{
                padding: "8px 14px",
                background: active ? "var(--primary)" : "var(--surface)",
                border: "1px solid " + (active ? "var(--primary)" : "var(--border)"),
                borderRadius: 8, cursor: "pointer",
                color: active ? "white" : "var(--text)",
                display: "flex", alignItems: "center", gap: 10,
                fontFamily: "inherit",
              }}>
                <div style={{textAlign: "left"}}>
                  <div style={{fontSize: 12.5, fontWeight: 700, letterSpacing: "-0.01em"}}>{c.subject} · {c.section}반</div>
                  <div style={{fontSize: 10.5, color: active ? "rgba(255,255,255,0.78)" : "var(--muted)", marginTop: 1, fontVariantNumeric: "tabular-nums"}}>
                    {c.students}명 {c.room ? ` · ${c.room}` : ""}
                  </div>
                </div>
                {!active && (
                  <span style={{
                    padding: "2px 7px", borderRadius: 4,
                    background: toneBg, color: toneC,
                    fontSize: 10.5, fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}>{s.label}</span>
                )}
                {active && s.signals > 0 && (
                  <span style={{
                    padding: "2px 7px", borderRadius: 4,
                    background: "rgba(255,255,255,0.22)",
                    fontSize: 10.5, fontWeight: 700,
                  }}>신호 {s.signals}</span>
                )}
              </button>
            );
          })}
          <button className="btn sm ghost" style={{padding: "8px 12px", color: "var(--muted)", marginLeft: "auto"}}>
            {Icons.Settings}분반 관리
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Subject header + tabs =====
function SubjectHeader({ course, teacherLabel, tab, setTab }) {
  // course의 메타 — 시간표 등은 mock으로 추정
  const periodHint = course.section.startsWith("1-") ? "매주 화·목·금 2교시"
    : course.section.startsWith("2-") ? "매주 월·수·금 3교시"
    : "매주 월·수 4교시";
  const room = course.room || `${course.section} 교실`;

  const tabs = [
    { id: "session",     label: "차시 기록",  sub: "매 수업 — 발표·활동 참여",       count: `${LC.lessonSessions.length}차시` },
    { id: "performance", label: "수행평가",   sub: "항목별 채점 — 점수·약점 분석",  count: `채점 ${LC.assessment.scored}/20` },
    { id: "assignment",  label: "과제",       sub: "제출 단위",                       count: `${LC.assignments.length}건` },
  ];
  return (
    <div className="card" style={{padding: 0, overflow: "hidden"}}>
      <div className="row" style={{padding: "16px 20px", gap: 20, flexWrap: "wrap"}}>
        <div>
          <div className="muted" style={{fontSize: 11.5, marginBottom: 4, letterSpacing: "0.04em", textTransform: "uppercase"}}>수업 단위 · CourseSection</div>
          <div style={{fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em"}}>
            {course.subject} · {course.section}반
          </div>
          <div className="muted" style={{fontSize: 12.5, marginTop: 4}}>
            담당 {teacherLabel} · {course.students}명 · {room} · {periodHint}
          </div>
        </div>
        <div className="grow"></div>
        <div className="row" style={{gap: 6}}>
          <button className="btn ai">신호 변환 규칙</button>
          <button className="btn">{Icons.Settings}수업 섹션 설정</button>
        </div>
      </div>
      <div style={{borderTop: "1px solid var(--border)", display: "flex", padding: "0 12px", background: "var(--surface-2)"}}>
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: "transparent", border: "none",
              padding: "12px 16px",
              borderBottom: active ? "2px solid var(--primary)" : "2px solid transparent",
              color: active ? "var(--primary-text)" : "var(--text-soft)",
              fontWeight: active ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2,
              marginBottom: -1,
            }}>
              <span className="row" style={{gap: 8}}>
                <span>{t.label}</span>
                <span style={{
                  fontSize: 10.5, fontWeight: 600,
                  background: active ? "var(--primary-soft)" : "var(--bg-soft)",
                  color: active ? "var(--primary-text)" : "var(--muted)",
                  border: "1px solid var(--border)",
                  padding: "1px 6px", borderRadius: 999,
                  fontVariantNumeric: "tabular-nums",
                }}>{t.count}</span>
              </span>
              <span style={{fontSize: 11, fontWeight: 400, color: "var(--muted)"}}>{t.sub}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// TAB 1 — 차시 기록 (매 수업)
// ============================================================
function SessionTab() {
  const [sessionId, setSessionId] = useStateR("L20");
  const session = LC.lessonSessions.find((s) => s.id === sessionId);
  const isPast = !session.current;

  const [entries, setEntries] = useStateR(LC.classRecord.entries);
  const [selected, setSelected] = useStateR(new Set());
  const [savedAt, setSavedAt] = useStateR("방금 전 자동 저장");

  const update = (sid, patch) => {
    setEntries((prev) => prev.map((e) => (e.studentId === sid ? { ...e, ...patch } : e)));
    setSavedAt("방금 전 자동 저장");
  };

  const toggleTag = (sid, tagId) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.studentId !== sid) return e;
        const has = e.tags.includes(tagId);
        return { ...e, tags: has ? e.tags.filter((t) => t !== tagId) : [...e.tags, tagId] };
      })
    );
    setSavedAt("방금 전 자동 저장");
  };

  const toggleSelect = (sid) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(sid)) next.delete(sid); else next.add(sid);
      return next;
    });
  };

  const applyTagBulk = (tagId) => {
    if (selected.size === 0) return;
    setEntries((prev) =>
      prev.map((e) => {
        if (!selected.has(e.studentId)) return e;
        if (e.tags.includes(tagId)) return e;
        return { ...e, tags: [...e.tags, tagId] };
      })
    );
    setSavedAt("방금 전 자동 저장");
  };

  const summary = useMemoR(() => {
    let miss = 0, partial = 0, tagged = 0;
    entries.forEach((e) => {
      if (e.presentation === "miss") miss++;
      if (e.participation === "partial" || e.participation === "miss") partial++;
      if (e.tags.length > 0) tagged++;
    });
    return { miss, partial, tagged };
  }, [entries]);

  return (
    <div className="row" style={{gap: 14, alignItems: "flex-start"}}>
      {/* 좌측 — 최근 차시 sidebar */}
      <div className="card" style={{width: 232, flexShrink: 0, padding: 0, overflow: "hidden"}}>
        <div className="row" style={{padding: "12px 14px", justifyContent: "space-between"}}>
          <div style={{fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em"}}>
            최근 차시
          </div>
          <button className="btn sm" style={{padding: "2px 8px", fontSize: 11}}>+ 새 차시</button>
        </div>
        <div style={{borderTop: "1px solid var(--border)"}}>
          {LC.lessonSessions.map((s) => {
            const active = s.id === sessionId;
            return (
              <button key={s.id} onClick={() => setSessionId(s.id)} style={{
                width: "100%", textAlign: "left", border: "none",
                background: active ? "var(--primary-soft)" : "transparent",
                padding: "10px 14px 10px 11px",
                borderLeft: active ? "3px solid var(--primary)" : "3px solid transparent",
                borderBottom: "1px solid var(--border)",
                cursor: "pointer",
                display: "flex", flexDirection: "column", gap: 4,
              }}>
                <div className="row" style={{justifyContent: "space-between"}}>
                  <span style={{fontSize: 12.5, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: active ? "var(--primary-text)" : "var(--text)"}}>
                    {s.date} <span style={{fontWeight: 500, color: "var(--muted)"}}>({s.weekday})</span>
                    {s.current && <span style={{marginLeft: 6, fontSize: 10, color: "var(--positive)", fontWeight: 700}}>● 오늘</span>}
                  </span>
                  {s.signals > 0 && (
                    <span style={{fontSize: 10, fontWeight: 700, color: "var(--attention)", fontVariantNumeric: "tabular-nums"}}>
                      신호 {s.signals}
                    </span>
                  )}
                </div>
                <div style={{fontSize: 11.5, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                  {s.period} · {s.topic}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 중앙 — 차시 기록 테이블 */}
      <div className="col" style={{flex: 1, minWidth: 0, gap: 14}}>
        <div className="card" style={{padding: "14px 18px"}}>
          <div className="row" style={{justifyContent: "space-between", gap: 12, flexWrap: "wrap"}}>
            <div>
              <div className="row" style={{gap: 8, marginBottom: 4}}>
                <span style={{fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums"}}>
                  {session.date} ({session.weekday}) · {session.period}
                </span>
                {session.current
                  ? <span className="tag info" style={{padding: "1px 8px"}}>오늘 수업</span>
                  : <span className="tag muted" style={{padding: "1px 8px"}}>지난 차시</span>}
              </div>
              <div className="muted" style={{fontSize: 12.5}}>{session.topic}</div>
            </div>
            <div className="row" style={{gap: 8}}>
              <input className="input" placeholder="이 차시 메모 (예: 모둠 4 발표 연기)"
                style={{width: 280, fontSize: 12.5}} />
              <button className="btn">{Icons.Copy}이전 차시 복제</button>
            </div>
          </div>
        </div>

        <div className="card" style={{padding: 0, overflow: "hidden"}}>
          <div style={{padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)"}}>
            <div className="row" style={{gap: 10}}>
              <div style={{fontWeight: 700, fontSize: 13}}>학생 기록</div>
              <span className="tag muted">{entries.length}명</span>
              {selected.size > 0 && <span className="tag info">{selected.size}명 선택됨</span>}
            </div>
            <div className="row" style={{gap: 6, fontSize: 12, color: "var(--muted)"}}>
              <span style={{width: 6, height: 6, borderRadius: 999, background: "var(--positive)"}}></span>
              {savedAt}
            </div>
          </div>

          <div className="scroll-x" style={{maxHeight: 540, overflowY: "auto"}}>
            <table className="tbl" style={{borderRadius: 0}}>
              <thead>
                <tr>
                  <th style={{width: 36, paddingLeft: 18}}>
                    <span className={"chk" + (selected.size === entries.length ? " checked" : "")}
                      onClick={() => setSelected(selected.size === entries.length ? new Set() : new Set(entries.map(e => e.studentId)))}>
                      {selected.size === entries.length && Icons.Check}
                    </span>
                  </th>
                  <th>학생</th>
                  <th>출석</th>
                  <th>발표</th>
                  <th>활동 참여</th>
                  <th>빠른 태그</th>
                  <th style={{minWidth: 160}}>이 차시 메모</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => {
                  const s = LC.students.find((st) => st.id === e.studentId);
                  const isSel = selected.has(e.studentId);
                  return (
                    <tr key={e.studentId} className={isSel ? "selected" : ""}>
                      <td style={{paddingLeft: 18}}>
                        <span className={"chk" + (isSel ? " checked" : "")} onClick={() => toggleSelect(e.studentId)}>
                          {isSel && Icons.Check}
                        </span>
                      </td>
                      <td>
                        <div className="row" style={{gap: 10}}>
                          <Avatar student={s} size="sm" />
                          <div>
                            <div style={{fontWeight: 600}}>{s.name}</div>
                            <div className="muted" style={{fontSize: 11}}>2-3 · {String(LC.students.indexOf(s)+1).padStart(2,"0")}</div>
                          </div>
                        </div>
                      </td>
                      <td><SegPicker value="present" onChange={() => {}} options={[
                        {v: "present", label: "출석"},
                        {v: "late",    label: "지각", tone: "attention"},
                        {v: "absent",  label: "결석", tone: "alert"},
                      ]} /></td>
                      <td><SegPicker value={e.presentation} onChange={(v) => update(e.studentId, {presentation: v})} options={[
                        {v: "present", label: "참여"},
                        {v: "miss",    label: "미참여", tone: "alert"},
                        {v: "na",      label: "해당없음", tone: "muted"},
                      ]} /></td>
                      <td><SegPicker value={e.participation} onChange={(v) => update(e.studentId, {participation: v})} options={[
                        {v: "full",    label: "활발"},
                        {v: "partial", label: "보통", tone: "attention"},
                        {v: "miss",    label: "낮음", tone: "alert"},
                      ]} /></td>
                      <td>
                        <div className="row" style={{gap: 4, flexWrap: "wrap"}}>
                          {e.tags.map((tid) => {
                            const t = LC.quickTags.find((x) => x.id === tid);
                            return (
                              <span key={tid} className={"tag " + t.tone}
                                onClick={() => toggleTag(e.studentId, tid)}
                                style={{cursor: "pointer"}}>
                                {t.label} ×
                              </span>
                            );
                          })}
                          {e.tags.length === 0 && (
                            <span className="muted" style={{fontSize: 11.5}}>—</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <input
                          className="input"
                          style={{width: "100%", padding: "5px 8px", fontSize: 12.5, border: "1px solid transparent", background: "transparent"}}
                          placeholder="메모 (선택)"
                          value={e.memo}
                          onFocus={(ev) => ev.target.style.background = "var(--surface)"}
                          onBlur={(ev) => ev.target.style.background = "transparent"}
                          onChange={(ev) => update(e.studentId, {memo: ev.target.value})}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 우측 — 빠른 태그 + 차시 요약 */}
      <div className="col" style={{width: 260, flexShrink: 0, gap: 14}}>
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">빠른 태그</h3>
          </div>
          <div className="muted" style={{fontSize: 11.5, marginBottom: 10}}>
            학생을 선택한 후 태그를 누르면 일괄 적용됩니다.
          </div>
          <div className="col" style={{gap: 6}}>
            {LC.quickTags.map((t) => (
              <button key={t.id} className="btn"
                onClick={() => applyTagBulk(t.id)}
                disabled={selected.size === 0}
                style={{justifyContent: "flex-start", opacity: selected.size === 0 ? 0.5 : 1}}>
                <span className={"tag " + t.tone} style={{margin: 0}}>
                  <span className="dot" style={{opacity: 0.7}}></span>
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3 className="card-title">이 차시 요약</h3>
          </div>
          <div className="col" style={{gap: 8}}>
            <SummaryRow label="발표 미참여" value={summary.miss} tone="alert" />
            <SummaryRow label="활동 부분/낮음" value={summary.partial} tone="attention" />
            <SummaryRow label="태그 부여" value={summary.tagged} tone="info" />
          </div>
          <div className="divider"></div>
          <div className="ai-card" style={{padding: "10px 12px"}}>
            <div className="ai-body" style={{fontSize: 12, lineHeight: 1.55}}>
              이 차시 신호는 학생 차트의 <b>최근 6주 흐름</b>에 반영됩니다. 수행평가 점수와는 분리됩니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB 2 — 수행평가 (항목별 채점)
// ============================================================
function PerformanceTab() {
  const A = LC.assessment;
  const [scores, setScores] = useStateR(A.scores);

  const setCell = (sid, rid, v) => {
    setScores((prev) => {
      const cur = prev[sid] || { rb1: 0, rb2: 0, rb3: 0, rb4: 0, rb5: 0 };
      return { ...prev, [sid]: { ...cur, [rid]: v } };
    });
  };

  // stats per rubric
  const stats = useMemoR(() => {
    return A.rubric.map((r) => {
      const vals = Object.values(scores).filter((s) => s !== null).map((s) => s[r.id]);
      const n = vals.length || 1;
      const sum = vals.reduce((a, b) => a + b, 0);
      const mean = sum / n;
      const hist = [0, 0, 0, 0, 0]; // bins of % of max
      vals.forEach((v) => {
        const p = v / r.max;
        const idx = Math.min(4, Math.max(0, Math.floor(p * 5)));
        hist[idx]++;
      });
      const histMax = Math.max(1, ...hist);
      return { ...r, mean, hist, histMax, n };
    });
  }, [scores]);

  const totalMax = A.rubric.reduce((a, r) => a + r.max, 0);

  // students with attention
  const attention = useMemoR(() => {
    const out = [];
    Object.entries(scores).forEach(([sid, sc]) => {
      if (!sc) return;
      const stu = LC.students.find((s) => s.id === sid);
      const total = A.rubric.reduce((a, r) => a + sc[r.id], 0);
      const pct = total / totalMax;
      const lowItems = [];
      A.rubric.forEach((r, i) => {
        const v = sc[r.id];
        const meanV = stats[i].mean;
        if (meanV - v >= 2) lowItems.push({ name: r.name, gap: (meanV - v).toFixed(1) });
      });
      if (pct < 0.5 || lowItems.length >= 2) {
        out.push({ student: stu, pct, total, lowItems });
      }
    });
    return out.slice(0, 4);
  }, [scores, stats, totalMax]);

  return (
    <div className="col" style={{gap: 14}}>
      {/* Assessment header */}
      <div className="card" style={{padding: "16px 20px"}}>
        <div className="row" style={{gap: 24, alignItems: "flex-start", flexWrap: "wrap"}}>
          <div style={{flex: "1 1 360px", minWidth: 0}}>
            <div className="row" style={{gap: 8, marginBottom: 6}}>
              <span style={{fontSize: 11, fontWeight: 700, color: "var(--ai-accent)", letterSpacing: "0.04em", textTransform: "uppercase"}}>수행평가</span>
              <span className="tag info" style={{padding: "1px 8px"}}>{A.area}</span>
              <span className="tag muted" style={{padding: "1px 8px"}}>{A.weight}</span>
            </div>
            <div style={{fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em"}}>{A.name}</div>
            <div className="muted" style={{fontSize: 12.5, marginTop: 4}}>평가 기간 {A.period} · 만점 {A.total}점</div>
          </div>
          <div className="row" style={{gap: 16}}>
            <div style={{textAlign: "right"}}>
              <div className="muted" style={{fontSize: 11}}>채점 진행률</div>
              <div style={{fontSize: 18, fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>
                {A.scored}<span style={{fontSize: 13, color: "var(--muted)"}}>/20</span>
              </div>
              <div style={{width: 100, height: 4, background: "var(--bg-soft)", borderRadius: 999, marginTop: 4}}>
                <div style={{width: `${(A.scored/20)*100}%`, height: "100%", background: "var(--primary)", borderRadius: 999}}></div>
              </div>
            </div>
            <div className="row" style={{gap: 6}}>
              <button className="btn">{Icons.Copy}루브릭 편집</button>
              <button className="btn primary">채점 완료 · 신호 변환</button>
            </div>
          </div>
        </div>
      </div>

      {/* Rubric strip */}
      <div className="row" style={{gap: 10, alignItems: "stretch"}}>
        {stats.map((r, i) => <RubricCard key={r.id} r={r} idx={i+1} />)}
      </div>

      <div className="row" style={{gap: 14, alignItems: "flex-start"}}>
        {/* Score matrix */}
        <div className="card" style={{flex: 1, padding: 0, minWidth: 0}}>
          <div style={{padding: "12px 18px", borderBottom: "1px solid var(--border)"}} className="row">
            <div style={{fontWeight: 700, fontSize: 13}}>학생별 채점표</div>
            <span className="tag muted">{Object.values(scores).filter(s=>s).length}/20 채점</span>
            <div className="grow"></div>
            <div className="muted" style={{fontSize: 11.5}}>
              각 셀에 항목별 점수를 입력하세요 · 일자가 아닌 <b>채점 기준</b>이 단위입니다.
            </div>
          </div>
          <div className="scroll-x" style={{maxHeight: 560, overflowY: "auto"}}>
            <table style={{width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13}}>
              <thead>
                <tr>
                  <th style={th("학생", "left", 200)}></th>
                  {A.rubric.map((r) => (
                    <th key={r.id} style={th("c", "center", 92)}>
                      <div style={{fontWeight: 700, fontSize: 11.5, color: "var(--text-soft)", textTransform: "none", letterSpacing: 0}}>{r.name}</div>
                      <div style={{fontSize: 10, color: "var(--muted)", fontWeight: 500, marginTop: 2, fontVariantNumeric: "tabular-nums"}}>/ {r.max}점</div>
                    </th>
                  ))}
                  <th style={th("c", "center", 76)}>총점</th>
                  <th style={th("c", "center", 56)}>등급</th>
                </tr>
              </thead>
              <tbody>
                {LC.students.map((s) => {
                  const sc = scores[s.id];
                  const graded = sc !== null && sc !== undefined;
                  const total = graded ? A.rubric.reduce((a, r) => a + (sc[r.id] || 0), 0) : null;
                  const g = graded ? gradeOf(total, totalMax) : null;
                  return (
                    <tr key={s.id} style={{borderBottom: "1px solid var(--border)"}}>
                      <td style={td(200)}>
                        <div className="row" style={{gap: 10}}>
                          <Avatar student={s} size="sm" />
                          <div style={{minWidth: 0}}>
                            <div style={{fontWeight: 600, fontSize: 13}}>{s.name}</div>
                            <div className="muted" style={{fontSize: 11}}>2-3 · {String(LC.students.indexOf(s)+1).padStart(2,"0")}</div>
                          </div>
                        </div>
                      </td>
                      {A.rubric.map((r) => (
                        <td key={r.id} style={td(92, "center")}>
                          <ScoreCell
                            value={graded ? sc[r.id] : null}
                            max={r.max}
                            onChange={(v) => setCell(s.id, r.id, v)}
                          />
                        </td>
                      ))}
                      <td style={td(76, "center")}>
                        {graded ? (
                          <span style={{fontWeight: 700, fontVariantNumeric: "tabular-nums", fontSize: 14}}>
                            {total}<span style={{color: "var(--muted)", fontWeight: 500, fontSize: 11}}>/{totalMax}</span>
                          </span>
                        ) : <span className="muted">—</span>}
                      </td>
                      <td style={td(56, "center")}>
                        {g ? <GradeBadge g={g} /> : <span className="muted">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: 신호 변환 + 주의 학생 */}
        <div className="col" style={{width: 300, flexShrink: 0, gap: 14}}>
          <div className="card">
            <div className="card-head">
              <h3 className="card-title">신호 변환 규칙</h3>
              <span className="tag muted" style={{fontSize: 10.5}}>점수→학생지원 신호</span>
            </div>
            <div className="col" style={{gap: 8}}>
              {A.signalRules.map((r) => (
                <div key={r.id} className="row" style={{gap: 8, alignItems: "flex-start"}}>
                  <span className={"tag " + r.tone} style={{padding: "1px 7px", fontSize: 10.5, marginTop: 1}}>
                    {r.tone === "alert" ? "강" : "약"}
                  </span>
                  <span style={{fontSize: 12, lineHeight: 1.5, color: "var(--text-soft)"}}>{r.text}</span>
                </div>
              ))}
            </div>
            <div className="divider"></div>
            <div className="muted" style={{fontSize: 11.5, lineHeight: 1.55}}>
              점수 자체가 아니라 <b>변화·약점 패턴</b>이 담임 차트로 전달됩니다.
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3 className="card-title">주의 학생</h3>
              <span style={{fontSize: 11, color: "var(--muted)", fontVariantNumeric: "tabular-nums"}}>{attention.length}명</span>
            </div>
            <div className="col" style={{gap: 10}}>
              {attention.length === 0 && <div className="muted" style={{fontSize: 12}}>아직 패턴이 없습니다.</div>}
              {attention.map(({student, pct, total, lowItems}) => (
                <div key={student.id} style={{padding: "10px 12px", border: "1px solid var(--attention-border)", borderRadius: 8, background: "var(--attention-bg)"}}>
                  <div className="row" style={{justifyContent: "space-between", marginBottom: 6}}>
                    <div className="row" style={{gap: 8}}>
                      <Avatar student={student} size="sm" />
                      <div>
                        <div style={{fontSize: 13, fontWeight: 700}}>{student.name}</div>
                        <div style={{fontSize: 10.5, color: "var(--muted)", fontVariantNumeric: "tabular-nums"}}>총 {total}/{totalMax}점 · {Math.round(pct*100)}%</div>
                      </div>
                    </div>
                  </div>
                  {lowItems.length > 0 && (
                    <div style={{fontSize: 11.5, color: "oklch(0.40 0.10 60)", lineHeight: 1.5}}>
                      약점 항목: {lowItems.map(l => `${l.name} (평균 −${l.gap})`).join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RubricCard({ r, idx }) {
  const pct = r.mean / r.max;
  const tone = pct >= 0.75 ? "positive" : pct >= 0.55 ? "info" : pct >= 0.4 ? "attention" : "alert";
  const toneColor =
    tone === "positive" ? "var(--positive)" :
    tone === "info"     ? "var(--info)" :
    tone === "attention"? "var(--attention)" : "var(--alert)";
  return (
    <div className="card" style={{flex: 1, padding: 14, minWidth: 0}}>
      <div className="row" style={{gap: 6, marginBottom: 4}}>
        <span style={{fontSize: 10.5, fontWeight: 700, color: "var(--muted)", fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em"}}>
          R{idx}
        </span>
        <span style={{fontSize: 10.5, color: "var(--muted)", fontVariantNumeric: "tabular-nums", marginLeft: "auto"}}>
          / {r.max}점
        </span>
      </div>
      <div style={{fontSize: 13, fontWeight: 700, marginBottom: 2}}>{r.name}</div>
      <div className="muted" style={{fontSize: 11, lineHeight: 1.45, minHeight: 30}}>{r.desc}</div>

      <div className="row" style={{gap: 6, marginTop: 10, alignItems: "baseline"}}>
        <span style={{fontSize: 18, fontWeight: 700, color: toneColor, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em"}}>
          {r.mean.toFixed(1)}
        </span>
        <span style={{fontSize: 11, color: "var(--muted)"}}>평균</span>
      </div>
      {/* mini histogram */}
      <div className="row" style={{gap: 2, marginTop: 8, alignItems: "flex-end", height: 28}}>
        {r.hist.map((h, i) => (
          <div key={i} style={{
            flex: 1,
            height: `${(h / r.histMax) * 100}%`,
            minHeight: 2,
            background: i < 2 ? "var(--alert-bg)" : i < 3 ? "var(--attention-bg)" : "var(--positive-bg)",
            border: "1px solid " + (i < 2 ? "var(--alert-border)" : i < 3 ? "var(--attention-border)" : "var(--positive-border)"),
            borderRadius: 2,
          }} title={`${i*20}-${(i+1)*20}% · ${h}명`}></div>
        ))}
      </div>
      <div className="row" style={{justifyContent: "space-between", marginTop: 4}}>
        <span style={{fontSize: 9.5, color: "var(--muted)"}}>낮음</span>
        <span style={{fontSize: 9.5, color: "var(--muted)"}}>높음</span>
      </div>
    </div>
  );
}

function ScoreCell({ value, max, onChange }) {
  if (value === null || value === undefined) {
    return (
      <div style={{
        width: 64, height: 40, margin: "0 auto",
        border: "1px dashed var(--border-strong)",
        borderRadius: 6,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--muted)", fontSize: 11,
        background: "var(--bg-soft)",
      }}>채점 전</div>
    );
  }
  const pct = value / max;
  const tone = pct >= 0.8 ? "positive" : pct >= 0.6 ? "info" : pct >= 0.4 ? "attention" : "alert";
  const bg = {
    positive: "oklch(0.97 0.03 155)",
    info:     "var(--surface)",
    attention:"oklch(0.97 0.045 75)",
    alert:    "oklch(0.965 0.035 25)",
  }[tone];
  const fg = {
    positive: "var(--positive)",
    info:     "var(--text-soft)",
    attention:"var(--attention)",
    alert:    "var(--alert)",
  }[tone];
  const border = {
    positive: "var(--positive-border)",
    info:     "var(--border)",
    attention:"var(--attention-border)",
    alert:    "var(--alert-border)",
  }[tone];
  return (
    <div style={{
      width: 64, margin: "0 auto",
      background: bg,
      border: "1px solid " + border,
      borderRadius: 6,
      padding: "4px 6px 5px",
      display: "flex", flexDirection: "column", gap: 3,
    }}>
      <input
        type="number"
        value={value}
        min={0}
        max={max}
        onChange={(e) => {
          const v = Math.max(0, Math.min(max, Number(e.target.value) || 0));
          onChange(v);
        }}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          textAlign: "right",
          fontSize: 14,
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          color: fg,
          fontFamily: "var(--font-mono)",
          outline: "none",
          padding: 0,
          letterSpacing: "-0.02em",
        }}
      />
      <div style={{height: 3, background: "rgba(0,0,0,0.05)", borderRadius: 999, overflow: "hidden"}}>
        <div style={{width: `${pct*100}%`, height: "100%", background: fg, borderRadius: 999}}></div>
      </div>
    </div>
  );
}

function GradeBadge({ g }) {
  const tone = g === "A" || g === "B" ? "positive" : g === "C" ? "info" : g === "D" ? "attention" : "alert";
  const c = tone === "positive" ? "var(--positive)" : tone === "info" ? "var(--info)" : tone === "attention" ? "var(--attention)" : "var(--alert)";
  const bg = tone === "positive" ? "var(--positive-bg)" : tone === "info" ? "var(--info-bg)" : tone === "attention" ? "var(--attention-bg)" : "var(--alert-bg)";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 26, height: 26, borderRadius: 6,
      background: bg, color: c, fontWeight: 700, fontSize: 13,
      border: "1px solid " + (tone === "positive" ? "var(--positive-border)" : tone === "info" ? "oklch(0.86 0.06 230)" : tone === "attention" ? "var(--attention-border)" : "var(--alert-border)"),
      fontFamily: "var(--font-mono)",
    }}>{g}</span>
  );
}

function gradeOf(total, max) {
  const p = total / max;
  if (p >= 0.9) return "A";
  if (p >= 0.8) return "B";
  if (p >= 0.7) return "C";
  if (p >= 0.6) return "D";
  return "E";
}

function th(_, align, w) {
  return {
    textAlign: align || "left",
    fontSize: 11.5, fontWeight: 600,
    color: "var(--muted)",
    padding: "10px 8px",
    background: "var(--surface-2)",
    borderBottom: "1px solid var(--border)",
    letterSpacing: "0.02em", textTransform: "uppercase",
    width: w, minWidth: w,
    position: "sticky", top: 0, zIndex: 1,
  };
}
function td(w, align) {
  return {
    padding: "8px 8px",
    borderBottom: "1px solid var(--border)",
    verticalAlign: "middle",
    textAlign: align || "left",
    width: w,
  };
}

// ============================================================
// TAB 3 — 과제 (제출 단위)
// ============================================================
function AssignmentTab() {
  const [selectedId, setSelectedId] = useStateR("a1");
  const a = LC.assignments.find((x) => x.id === selectedId);
  const statusMap = LC.assignmentStatusByStudent[selectedId] || {};

  return (
    <div className="col" style={{gap: 14}}>
      {/* Assignment cards */}
      <div className="row" style={{gap: 10, alignItems: "stretch"}}>
        {LC.assignments.map((x) => {
          const active = x.id === selectedId;
          const rate = x.submitted / x.total;
          return (
            <button key={x.id} onClick={() => setSelectedId(x.id)} style={{
              flex: 1, textAlign: "left", padding: 14,
              background: active ? "var(--surface)" : "var(--surface-2)",
              border: "1px solid " + (active ? "var(--primary)" : "var(--border)"),
              borderRadius: 12,
              cursor: "pointer",
              boxShadow: active ? "0 0 0 3px oklch(0.42 0.11 250 / 0.10)" : "none",
              display: "flex", flexDirection: "column", gap: 6, minWidth: 0,
            }}>
              <div className="row" style={{gap: 6}}>
                <span className={"tag " + (x.status === "마감" ? "muted" : "info")} style={{padding: "1px 7px", fontSize: 10.5}}>
                  {x.status}
                </span>
                {x.relatedAssessment && (
                  <span className="tag" style={{padding: "1px 7px", fontSize: 10.5, background: "var(--ai-bg)", borderColor: "var(--ai-border)", color: "var(--ai-text)"}}>
                    수행평가 연계
                  </span>
                )}
              </div>
              <div style={{fontSize: 13.5, fontWeight: 700, color: active ? "var(--text)" : "var(--text-soft)"}}>{x.title}</div>
              <div className="muted" style={{fontSize: 11.5, fontVariantNumeric: "tabular-nums"}}>마감 {x.due} · 총 {x.total}명</div>
              <div className="row" style={{gap: 8, fontSize: 11.5, color: "var(--muted)", marginTop: 4}}>
                <span style={{color: "var(--positive)", fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>제출 {x.submitted}</span>
                {x.late > 0 && <span style={{color: "var(--attention)", fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>지연 {x.late}</span>}
                {x.missing > 0 && <span style={{color: "var(--alert)", fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>미제출 {x.missing}</span>}
              </div>
              <div style={{height: 4, background: "var(--bg-soft)", borderRadius: 999, marginTop: 2, overflow: "hidden"}}>
                <div style={{width: `${rate*100}%`, height: "100%", background: "var(--primary)", borderRadius: 999}}></div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="row" style={{gap: 14, alignItems: "flex-start"}}>
        {/* Per-student status */}
        <div className="card" style={{flex: 1, padding: 0, minWidth: 0}}>
          <div className="row" style={{padding: "12px 18px", borderBottom: "1px solid var(--border)"}}>
            <div style={{fontWeight: 700, fontSize: 13}}>{a.title} · 학생별 제출 상태</div>
            <div className="grow"></div>
            <button className="btn sm">{Icons.Copy}일괄 알림 보내기</button>
          </div>
          <div style={{padding: "14px 18px"}}>
            <div style={{display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8}}>
              {LC.students.map((s) => {
                const st = statusMap[s.id] || "submit";
                const cfg = {
                  submit: { label: "제출", color: "var(--positive)", bg: "var(--positive-bg)", border: "var(--positive-border)" },
                  late:   { label: "지연", color: "var(--attention)", bg: "var(--attention-bg)", border: "var(--attention-border)" },
                  miss:   { label: "미제출", color: "var(--alert)", bg: "var(--alert-bg)", border: "var(--alert-border)" },
                }[st];
                return (
                  <div key={s.id} style={{
                    padding: "8px 10px",
                    border: "1px solid " + cfg.border,
                    background: cfg.bg,
                    borderRadius: 8,
                    display: "flex", flexDirection: "column", gap: 4,
                  }}>
                    <div className="row" style={{gap: 7}}>
                      <Avatar student={s} size="sm" />
                      <span style={{fontSize: 12.5, fontWeight: 600}}>{s.name}</span>
                    </div>
                    <span style={{fontSize: 10.5, fontWeight: 700, color: cfg.color, alignSelf: "flex-start"}}>
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="col" style={{width: 280, flexShrink: 0, gap: 14}}>
          <div className="card">
            <div className="card-head"><h3 className="card-title">제출 흐름</h3></div>
            <div className="col" style={{gap: 8}}>
              <SummaryRow label="제출" value={a.submitted} tone="positive" />
              <SummaryRow label="지연" value={a.late} tone="attention" />
              <SummaryRow label="미제출" value={a.missing} tone="alert" />
            </div>
            <div className="divider"></div>
            <div className="muted" style={{fontSize: 11.5, lineHeight: 1.55}}>
              <b>3회 이상 미제출</b>이 누적되면 학생 차트에 <b>제출 리듬 저하</b> 신호로 전달됩니다.
            </div>
          </div>

          {a.relatedAssessment && (
            <div className="ai-card" style={{padding: "14px 16px"}}>
              <div className="ai-label">
                <span className="ai-dot"></span>
                연관 수행평가
              </div>
              <div className="ai-body" style={{fontSize: 12.5}}>
                이 과제는 <b>{LC.assessment.name}</b>의 사전 과제입니다. 제출 누락은 채점 시 <b>준비 과정</b> 항목에 자동 반영됩니다.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ====== shared small components ======
function SegPicker({ value, onChange, options }) {
  return (
    <div style={{display: "inline-flex", gap: 4, background: "var(--bg-soft)", padding: 2, borderRadius: 6, border: "1px solid var(--border)"}}>
      {options.map((o) => {
        const active = value === o.v;
        const toneColor = o.tone === "alert" ? "var(--alert)" : o.tone === "attention" ? "var(--attention)" : o.tone === "muted" ? "var(--muted)" : "var(--primary)";
        return (
          <button key={o.v}
            onClick={() => onChange(o.v)}
            style={{
              padding: "3px 9px",
              fontSize: 11.5,
              fontWeight: 600,
              border: "none",
              background: active ? "var(--surface)" : "transparent",
              color: active ? toneColor : "var(--muted)",
              borderRadius: 4,
              boxShadow: active ? "var(--shadow-sm)" : "none",
            }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function SummaryRow({ label, value, tone }) {
  const c = tone === "alert" ? "var(--alert)" : tone === "attention" ? "var(--attention)" : tone === "positive" ? "var(--positive)" : "var(--info)";
  return (
    <div className="row" style={{justifyContent: "space-between", fontSize: 12.5}}>
      <span className="muted">{label}</span>
      <span style={{fontWeight: 700, color: value > 0 ? c : "var(--muted)", fontVariantNumeric: "tabular-nums"}}>{value}</span>
    </div>
  );
}

window.ClassRecord = ClassRecord;
