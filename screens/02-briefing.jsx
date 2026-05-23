// Screen 2: 담임 주간 브리핑 (Weekly Briefing)

function WeeklyBriefing({ onOpenStudent, onOpenPrep, onOpenBoard }) {
  const [period, setPeriod] = React.useState("2w");
  const [filter, setFilter] = React.useState("all");

  const filtered = React.useMemo(() => {
    if (filter === "all") return LC.briefingCards;
    return LC.briefingCards.filter((c) => c.state === filter);
  }, [filter]);

  return (
    <div className="col" style={{gap: 18}}>
      <div className="page-head">
        <div>
          <div className="crumbs">담임교사 <span className="sep">›</span> 주간 브리핑</div>
          <h1 className="page-title">2학년 3반 주간 브리핑</h1>
          <div className="page-sub">기록된 신호를 변화 흐름으로 모았어요. 위험 분류가 아니라 확인이 필요한 학생을 보여줍니다.</div>
        </div>
        <div className="row" style={{gap: 8}}>
          <div className="segmented">
            {[
              {v: "1w", label: "최근 1주"},
              {v: "2w", label: "최근 2주"},
              {v: "4w", label: "최근 4주"},
              {v: "term", label: "이번 학기"},
            ].map((o) => (
              <button key={o.v} className={period === o.v ? "active" : ""} onClick={() => setPeriod(o.v)}>{o.label}</button>
            ))}
          </div>
          <button className="btn">{Icons.Filter}유형 필터</button>
        </div>
      </div>

      {/* KPI 카드 */}
      <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12}}>
        {LC.briefingKpis.map((k) => (
          <div key={k.label} className={"kpi " + k.tone}>
            <div className="label">{k.label}</div>
            <div className="row" style={{alignItems: "baseline", gap: 6}}>
              <div className="value">{k.value}</div>
              <div style={{fontSize: 12, color: "var(--muted)"}}>명</div>
            </div>
            <div className="meta">{k.desc}</div>
          </div>
        ))}
      </div>

      {/* 변화 유형 요약 + AI 주간 요약 */}
      <div style={{display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14}}>
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">변화 유형</h3>
            <span className="muted" style={{fontSize: 12}}>기간: 최근 2주</span>
          </div>
          <div style={{display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8}}>
            {LC.changeTypes.map((c) => (
              <button key={c.id}
                onClick={() => {}}
                className="row"
                style={{
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  background: "var(--surface)",
                  cursor: "pointer",
                  textAlign: "left",
                }}>
                <span style={{fontSize: 13, fontWeight: 600}}>{c.label}</span>
                <span className="tag muted">{c.count}명</span>
              </button>
            ))}
          </div>
        </div>

        <div className="ai-card">
          <div className="ai-label"><span className="ai-dot"></span>AI 주간 요약</div>
          <div className="ai-body">
            이번 주는 <b>여러 과목에서 변화가 감지된 학생 3명</b>이 가장 주목되는 흐름입니다.
            특히 <b>김민수</b>는 국어·수학·영어에서 제출과 발표 신호가 함께 줄었고, <b>강예준</b>은 수학 한 과목에서 어려움이 반복됩니다.
            반대로 지원 연결 후 <b>회복 신호 2명</b>이 확인되었어요.
          </div>
          <div className="ai-disclaimer">AI는 신호를 요약합니다. 원인 판단은 담임의 확인 후에 이루어집니다.</div>
        </div>
      </div>

      {/* 학생 변화 카드 */}
      <div className="row" style={{justifyContent: "space-between", marginTop: 6}}>
        <h3 style={{fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: "-0.01em"}}>학생 변화 카드</h3>
        <div className="segmented">
          {[
            {v: "all", label: "전체"},
            {v: "attention", label: "확인 필요"},
            {v: "info", label: "모니터링"},
            {v: "positive", label: "회복 신호"},
          ].map((o) => (
            <button key={o.v} className={filter === o.v ? "active" : ""} onClick={() => setFilter(o.v)}>{o.label}</button>
          ))}
        </div>
      </div>

      <div style={{display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12}}>
        {filtered.map((c) => {
          const student = LC.students.find((s) => s.id === c.studentId);
          return (
            <article key={c.studentId} className="card" style={{padding: 0, overflow: "hidden"}}>
              <div style={{padding: "16px 18px", borderBottom: "1px solid var(--border)"}}>
                <div className="row" style={{justifyContent: "space-between", alignItems: "flex-start"}}>
                  <div className="row" style={{gap: 12}}>
                    <Avatar student={student} />
                    <div>
                      <div style={{fontWeight: 700, fontSize: 15}}>{c.name} <span className="muted" style={{fontWeight: 500}}>· 2-3</span></div>
                      <div style={{marginTop: 4}}>
                        <StatusPill state={c.state}>{c.statusLabel}</StatusPill>
                      </div>
                    </div>
                  </div>
                  <button className="icon-btn" style={{color: "var(--muted)"}}>{Icons.More}</button>
                </div>
                <div style={{marginTop: 12, fontSize: 13, color: "var(--text)", lineHeight: 1.55}}>
                  {c.summary}
                </div>
              </div>
              <div style={{padding: "12px 18px", background: "var(--bg-soft)"}}>
                <div className="muted" style={{fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 8}}>
                  주요 신호
                </div>
                <div className="col" style={{gap: 6}}>
                  {c.signals.map((sig, i) => (
                    <div key={i} className="row" style={{gap: 8, fontSize: 12.5}}>
                      <span className="tag muted" style={{minWidth: 56, justifyContent: "center"}}>{sig.subject}</span>
                      <span>{sig.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="row" style={{padding: "10px 14px", gap: 6, justifyContent: "flex-end", borderTop: "1px solid var(--border)"}}>
                {c.actions.includes("chart") && (
                  <button className="btn sm" onClick={() => onOpenStudent(c.studentId)}>학생 차트 보기</button>
                )}
                {c.actions.includes("counseling") && (
                  <button className="btn sm ai" onClick={() => onOpenPrep(c.studentId)}>{Icons.Sparkles}상담 준비</button>
                )}
                {c.actions.includes("monitor") && (
                  <button className="btn sm" onClick={() => onOpenBoard()}>모니터링</button>
                )}
                {c.actions.includes("support") && (
                  <button className="btn sm primary" onClick={() => onOpenBoard()}>지원 연결</button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="muted" style={{fontSize: 11.5, marginTop: 8, textAlign: "center"}}>
        AI는 변화 신호를 요약해 보여줍니다. 학생 평가나 위험 분류 목적이 아닙니다.
      </div>
    </div>
  );
}

window.WeeklyBriefing = WeeklyBriefing;
