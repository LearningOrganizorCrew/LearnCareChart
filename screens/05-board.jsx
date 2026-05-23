// Screen 5: 지원 연결·모니터링 보드 (Kanban)

function SupportBoard({ onOpenStudent, scope, myOnly, persona }) {
  const [cases, setCases] = React.useState(LC.cases);
  const [view, setView] = React.useState("kanban");
  const [filter, setFilter] = React.useState("all");
  const [dragId, setDragId] = React.useState(null);
  const [selectedCase, setSelectedCase] = React.useState(null);

  // organize columns: group states into meaningful columns
  const columns = [
    { id: "확인 필요", label: "확인 필요", states: ["담임 확인 필요"] },
    { id: "상담", label: "상담 진행", states: ["상담교사 확인 요청", "상담교사 확인 중"] },
    { id: "학습", label: "학습지원", states: ["기초학력 지원 검토", "기초학력 지원 중"] },
    { id: "복지", label: "복지·돌봄", states: ["복지/돌봄 확인 요청"] },
    { id: "지역", label: "지역자원 연계", states: ["지역자원 연계 검토", "지역자원 연계 완료"] },
    { id: "관찰", label: "모니터링·회복", states: ["모니터링 중", "회복 관찰", "상담 완료"] },
  ];

  // 1) scope에 따라 케이스 필터: 담임은 자기 반만, 학교 관리자는 전체, 교과는 자기 과목 학생만
  const scopedCases = React.useMemo(() => {
    let list = cases;
    if (scope?.class) {
      list = list.filter((c) => c.cls === scope.class);
    }
    if (myOnly && persona) {
      // 교과 교사가 올린 신호—owner가 과목명 포함 없으니 데모는 각자의 과목 반(2-3, 2-4, 2-6)에 속한 학생만.
      const sections = persona.assignments.courses.map((c) => c.section);
      list = list.filter((c) => sections.includes(c.cls));
    }
    return list;
  }, [cases, scope?.class, myOnly, persona?.id]);

  const filtered = filter === "all" ? scopedCases : scopedCases.filter((c) => c.cls === filter);

  const dropTo = (colId) => {
    if (!dragId) return;
    const col = columns.find((c) => c.id === colId);
    setCases((prev) => prev.map((c) => (c.id === dragId ? { ...c, state: col.states[0] } : c)));
    setDragId(null);
  };

  const counts = React.useMemo(() => {
    const m = {};
    columns.forEach((col) => {
      m[col.id] = filtered.filter((c) => col.states.includes(c.state)).length;
    });
    return m;
  }, [filtered]);

  return (
    <div className="col" style={{gap: 18}}>
      <div className="page-head">
        <div>
          <div className="crumbs">
            {scope ? `담임 · ${scope.label}`
              : myOnly ? `교과 · ${persona?.name || ""} 교사`
              : "학교 / 지원"}
            <span className="sep">›</span> {myOnly ? "내가 올린 신호" : "지원 연결·모니터링"}
          </div>
          <h1 className="page-title">
            {scope ? `${scope.label} 지원 케이스`
              : myOnly ? "내가 올린 신호"
              : "지원 연결·모니터링 보드"}
          </h1>
          <div className="page-sub">
            {scope ? `우리 반 학생들의 지원 케이스만 표시됩니다. 다른 학급의 케이스는 접근권이 없습니다.`
              : myOnly ? `온래 내가 담임/상담교사에게 전달한 신호와 이후 처리 결과를 추적합니다.`
              : "연결한 케이스가 방치되지 않게 다음 확인일까지 추적해요. 카드를 끌어 상태를 바꿀 수 있어요."}
          </div>
        </div>
        <div className="row" style={{gap: 8}}>
          <div className="segmented">
            <button className={view === "kanban" ? "active" : ""} onClick={() => setView("kanban")}>칸반</button>
            <button className={view === "table" ? "active" : ""} onClick={() => setView("table")}>테이블</button>
          </div>
          {!scope && !myOnly && (
            <select className="select input" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">전체 학급</option>
              <option value="2-1">2-1</option>
              <option value="2-2">2-2</option>
              <option value="2-3">2-3</option>
            </select>
          )}
          {scope && (
            <span className="tag info" style={{padding: "4px 10px"}}>{scope.label} 가시적 접근 제한</span>
          )}
        </div>
      </div>

      {/* mini kpi row */}
      <div style={{display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12}}>
        <div className="kpi compact"><div className="label">전체 케이스</div><div className="value">{filtered.length}</div></div>
        <div className="kpi attention"><div className="label">확인 필요</div><div className="value">{counts["확인 필요"] || 0}</div></div>
        <div className="kpi info"><div className="label">진행 중</div><div className="value">{(counts["상담"] || 0) + (counts["학습"] || 0) + (counts["복지"] || 0)}</div></div>
        <div className="kpi"><div className="label">지역자원 연계</div><div className="value">{counts["지역"] || 0}</div></div>
        <div className="kpi positive"><div className="label">관찰·회복</div><div className="value">{counts["관찰"] || 0}</div></div>
      </div>

      {view === "kanban" ? (
        <div className="kanban">
          {columns.map((col) => (
            <div key={col.id}
              className="kanban-col"
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--primary-soft-border)"; e.currentTarget.style.background = "var(--primary-soft)"; }}
              onDragLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-soft)"; }}
              onDrop={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-soft)"; dropTo(col.id); }}>
              <div className="kanban-col-head">
                <span className="name">{col.label}</span>
                <span className="count">{counts[col.id]}</span>
              </div>
              {filtered.filter((c) => col.states.includes(c.state)).map((c) => {
                const overdue = c.next !== "—" && isOverdue(c.next);
                return (
                  <div key={c.id}
                    className="case-card"
                    draggable
                    onDragStart={() => setDragId(c.id)}
                    onClick={() => setSelectedCase(c)}>
                    <div className="row" style={{justifyContent: "space-between"}}>
                      <span className="name">{c.name}</span>
                      <span className="muted" style={{fontSize: 11}}>{c.cls}</span>
                    </div>
                    <div className="meta">{c.summary}</div>
                    <div className="divider" style={{margin: "8px 0"}}></div>
                    <div className="row" style={{justifyContent: "space-between"}}>
                      <span className="muted" style={{fontSize: 11}}>{c.owner}</span>
                      <span className={overdue ? "tag alert" : "tag muted"} style={{fontSize: 11}}>
                        다음 {c.next}
                      </span>
                    </div>
                  </div>
                );
              })}
              <button className="btn ghost sm" style={{justifyContent: "center", color: "var(--muted)"}}>
                {Icons.Plus}케이스 추가
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{padding: 0, overflow: "hidden"}}>
          <table className="tbl" style={{borderRadius: 0}}>
            <thead>
              <tr>
                <th>학생</th>
                <th>학급</th>
                <th>상태</th>
                <th>담당자</th>
                <th>다음 확인일</th>
                <th>요약</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const overdue = c.next !== "—" && isOverdue(c.next);
                return (
                  <tr key={c.id}>
                    <td><b>{c.name}</b></td>
                    <td className="muted">{c.cls}</td>
                    <td><span className="tag info" style={{fontSize: 11}}>{c.state}</span></td>
                    <td className="muted">{c.owner}</td>
                    <td className="num"><span className={overdue ? "tag alert" : "tag muted"}>{c.next}</span></td>
                    <td style={{fontSize: 12.5}}>{c.summary}</td>
                    <td>
                      <div className="row" style={{gap: 4, justifyContent: "flex-end"}}>
                        <button className="btn sm" onClick={() => onOpenStudent(c.id)}>차트</button>
                        <button className="btn sm">상태 변경</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedCase && (
        <CaseDetailModal
          c={selectedCase}
          onClose={() => setSelectedCase(null)}
          onOpenStudent={() => { onOpenStudent(selectedCase.id); setSelectedCase(null); }}
        />
      )}
    </div>
  );
}

function isOverdue(dateStr) {
  // dateStr 형태 "5/22" — 데모 기준 today = 5/21
  const today = { m: 5, d: 21 };
  const [m, d] = dateStr.split("/").map((x) => parseInt(x, 10));
  if (isNaN(m)) return false;
  return m < today.m || (m === today.m && d < today.d);
}

function CaseDetailModal({ c, onClose, onOpenStudent }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "oklch(0.2 0.02 250 / 0.4)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
    }} onClick={onClose}>
      <div className="card" style={{width: 480, padding: 0}} onClick={(e) => e.stopPropagation()}>
        <div style={{padding: "18px 22px", borderBottom: "1px solid var(--border)"}}>
          <div className="row" style={{justifyContent: "space-between"}}>
            <div>
              <div style={{fontWeight: 700, fontSize: 18}}>{c.name} <span className="muted" style={{fontWeight: 500, fontSize: 14}}>· {c.cls}</span></div>
              <div style={{marginTop: 6}}><span className="tag info">{c.state}</span></div>
            </div>
            <button className="icon-btn" onClick={onClose} style={{fontSize: 20, color: "var(--muted)"}}>×</button>
          </div>
        </div>
        <div style={{padding: 22}} className="col">
          <Field2 label="요약">{c.summary}</Field2>
          <Field2 label="담당자">{c.owner}</Field2>
          <Field2 label="다음 확인일"><span className="num" style={{fontWeight: 700}}>{c.next}</span></Field2>
          <Field2 label="권한 안내" muted>
            관리자에게는 상세 내용이 아니라 상태 집계만 노출됩니다.
          </Field2>
        </div>
        <div className="row" style={{padding: "14px 22px", borderTop: "1px solid var(--border)", justifyContent: "flex-end", gap: 8}}>
          <button className="btn" onClick={onClose}>닫기</button>
          <button className="btn">상태 변경</button>
          <button className="btn primary" onClick={onOpenStudent}>학생 차트 열기</button>
        </div>
      </div>
    </div>
  );
}

function Field2({ label, children, muted }) {
  return (
    <div style={{display: "grid", gridTemplateColumns: "90px 1fr", gap: 12, padding: "8px 0", fontSize: 13}}>
      <div className="muted" style={{fontSize: 12}}>{label}</div>
      <div style={{color: muted ? "var(--muted)" : "var(--text)", fontSize: muted ? 12 : 13}}>{children}</div>
    </div>
  );
}

window.SupportBoard = SupportBoard;
