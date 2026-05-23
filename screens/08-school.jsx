// Screen 8: 학교 관리자 대시보드 (단일 학교 시점)
// - 학년·반별 신호 분포
// - 미연계/지연 케이스 추적
// - 교사별 활동 요약
// - 자원 활용 (학교 시점)

function SchoolAdminDashboard({ initialView }) {
  const S = LC.schoolAdmin;
  const [view, setView] = React.useState(initialView || "dashboard");
  // sync with route change
  React.useEffect(() => {
    if (initialView) setView(initialView);
  }, [initialView]);

  return (
    <div className="col" style={{gap: 18}}>
      <div className="page-head">
        <div>
          <div className="crumbs">
            학교 관리자 <span className="sep">›</span> {S.schoolName}
            <span className="sep">›</span>{" "}
            {view === "dashboard" ? "우리 학교 대시보드"
              : view === "grades" ? "학년·반별 신호 지도"
              : view === "cases" ? "미연계 케이스 추적"
              : view === "teachers" ? "교사별 활동 요약"
              : "우리 학교 자원 활용"}
          </div>
          <h1 className="page-title">{S.schoolName} 학생지원 현황</h1>
          <div className="page-sub">
            학교 안의 신호 흐름·연계 처리·자원 활용을 한 눈에. 개별 학생 차트와 상담 기록 원문은 권한상 접근할 수 없습니다.
          </div>
        </div>
        <div className="row" style={{gap: 8}}>
          <div className="segmented">
            <button className={view === "dashboard" ? "active" : ""} onClick={() => setView("dashboard")}>대시보드</button>
            <button className={view === "grades" ? "active" : ""} onClick={() => setView("grades")}>학년·반</button>
            <button className={view === "cases" ? "active" : ""} onClick={() => setView("cases")}>미연계</button>
            <button className={view === "teachers" ? "active" : ""} onClick={() => setView("teachers")}>교사</button>
          </div>
          <button className="btn">{Icons.Folder}월간 리포트</button>
        </div>
      </div>

      {view === "dashboard" && <SchoolKpisBlock S={S} />}
      {view === "grades"    && <GradesMap S={S} />}
      {view === "cases"     && <UnconnectedCases S={S} />}
      {view === "teachers"  && <TeacherActivity S={S} />}
    </div>
  );
}

function SchoolKpisBlock({ S }) {
  return (
    <div className="col" style={{gap: 14}}>
      <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12}}>
        {S.kpis.map((k) => (
          <div key={k.label} className={"kpi " + k.tone}>
            <div className="label">{k.label}</div>
            <div className="value">{k.value}</div>
            <div className="meta">{k.meta}</div>
          </div>
        ))}
      </div>

      <div className="row" style={{gap: 14, alignItems: "stretch"}}>
        <div className="card" style={{flex: 1.3}}>
          <div className="card-head">
            <h3 className="card-title">학년·반별 신호 지도</h3>
            <span className="muted" style={{fontSize: 12}}>최근 4주 누적</span>
          </div>
          <GradesMapInner S={S} compact />
        </div>

        <div className="card" style={{width: 340, flexShrink: 0}}>
          <div className="card-head">
            <h3 className="card-title">미연계 케이스 TOP</h3>
            <span className="tag alert">{S.unconnected}건</span>
          </div>
          <div className="col" style={{gap: 8}}>
            {S.unconnectedCases.slice(0, 5).map((c) => (
              <CaseRow key={c.id} c={c} />
            ))}
          </div>
          <div className="divider"></div>
          <button className="btn" style={{width: "100%"}}>전체 미연계 케이스 보기 →</button>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3 className="card-title">자원 활용 현황 (학교 시점)</h3>
          <span className="muted" style={{fontSize: 12}}>○○구 자원 중 우리 학교가 연결한 비율</span>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10}}>
          {S.resourceUsage.map((r) => {
            const pct = r.matched / r.capacity;
            const tone = pct >= 0.9 ? "alert" : pct >= 0.7 ? "attention" : "info";
            const c = tone === "alert" ? "var(--alert)" : tone === "attention" ? "var(--attention)" : "var(--info)";
            return (
              <div key={r.name} style={{padding: 12, border: "1px solid var(--border)", borderRadius: 10}}>
                <div className="row" style={{gap: 6, marginBottom: 4}}>
                  <span className="tag muted" style={{padding: "1px 6px", fontSize: 10.5}}>{r.category}</span>
                  {r.wait !== "—" && <span className="tag attention" style={{padding: "1px 6px", fontSize: 10.5}}>대기 {r.wait}</span>}
                </div>
                <div style={{fontSize: 13, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.01em"}}>{r.name}</div>
                <div className="row" style={{gap: 8, alignItems: "baseline", marginBottom: 6}}>
                  <span style={{fontSize: 22, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: c, letterSpacing: "-0.02em"}}>{r.matched}</span>
                  <span className="muted" style={{fontSize: 11, fontVariantNumeric: "tabular-nums"}}>/ {r.capacity}명 연결</span>
                </div>
                <div style={{height: 5, background: "var(--bg-soft)", borderRadius: 999, overflow: "hidden"}}>
                  <div style={{width: pct*100 + "%", height: "100%", background: c, borderRadius: 999}}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="muted" style={{fontSize: 11.5, padding: "4px 4px", lineHeight: 1.6}}>
        ⓘ 화면의 모든 수치는 학교 단위 집계입니다. 개별 학생 차트와 상담 기록은 접근 권한이 없습니다.
      </div>
    </div>
  );
}

function GradesMap({ S }) {
  return (
    <div className="card">
      <div className="card-head">
        <h3 className="card-title">학년·반별 신호 분포</h3>
        <span className="muted" style={{fontSize: 12}}>최근 4주 · 학생 식별정보 없음</span>
      </div>
      <GradesMapInner S={S} />
      <div className="divider"></div>
      <div className="row" style={{gap: 16, fontSize: 11.5, color: "var(--muted)", flexWrap: "wrap"}}>
        <LegendDot color="var(--alert)" label="긴급 — 외부 연계 필요 신호" />
        <LegendDot color="var(--attention)" label="주의 — 담임 확인 신호" />
        <LegendDot color="var(--info)" label="모니터링 — 상담/복지 관찰" />
        <LegendDot color="var(--positive)" label="회복 — 긍정 변화" />
      </div>
    </div>
  );
}

function GradesMapInner({ S, compact }) {
  // grid: row per grade, 6 columns of classes
  const maxSignals = 10;
  return (
    <div className="col" style={{gap: compact ? 8 : 12}}>
      {S.gradeMap.map((g) => (
        <div key={g.grade} className="row" style={{gap: compact ? 6 : 10, alignItems: "stretch"}}>
          <div style={{
            width: 44, flexShrink: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "8px 0",
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            borderRadius: 8,
          }}>
            <span style={{fontSize: 10.5, color: "var(--muted)", fontWeight: 600}}>학년</span>
            <span style={{fontSize: 18, fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em"}}>{g.grade}</span>
          </div>
          <div style={{flex: 1, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: compact ? 6 : 8}}>
            {g.classes.map((c) => {
              const total = c.attention + c.alert + c.info + c.positive;
              const intensity = Math.min(1, (c.attention + c.alert*2) / 10);
              return (
                <div key={c.name} style={{
                  padding: compact ? "8px 9px" : "10px 12px",
                  background: intensity > 0.5 ? "oklch(0.97 0.04 25 / " + intensity + ")" : "var(--surface)",
                  border: "1px solid " + (intensity > 0.5 ? "var(--alert-border)" : "var(--border)"),
                  borderRadius: 8,
                  display: "flex", flexDirection: "column", gap: compact ? 4 : 6,
                  cursor: "pointer",
                }}>
                  <div className="row" style={{justifyContent: "space-between"}}>
                    <span style={{fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>{c.name}</span>
                    <span style={{fontSize: 10, color: "var(--muted)", fontVariantNumeric: "tabular-nums"}}>{c.students}명</span>
                  </div>
                  <SignalBars c={c} />
                  <div className="row" style={{gap: 4, fontSize: 10.5, fontVariantNumeric: "tabular-nums"}}>
                    {c.alert > 0 && <span style={{color: "var(--alert)", fontWeight: 700}}>긴급 {c.alert}</span>}
                    {c.attention > 0 && <span style={{color: "var(--attention)", fontWeight: 700}}>주의 {c.attention}</span>}
                    {c.info > 0 && <span style={{color: "var(--info)"}}>관찰 {c.info}</span>}
                    {c.positive > 0 && <span style={{color: "var(--positive)"}}>회복 {c.positive}</span>}
                    {total === 0 && <span className="muted">—</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function SignalBars({ c }) {
  const total = c.alert + c.attention + c.info + c.positive;
  if (total === 0) {
    return <div style={{height: 6, background: "var(--bg-soft)", borderRadius: 999}}></div>;
  }
  const seg = (n, color) => n > 0 ? (
    <div style={{flex: n, height: "100%", background: color}}></div>
  ) : null;
  return (
    <div style={{display: "flex", width: "100%", height: 6, borderRadius: 999, overflow: "hidden", background: "var(--bg-soft)"}}>
      {seg(c.alert, "var(--alert)")}
      {seg(c.attention, "var(--attention)")}
      {seg(c.info, "var(--info)")}
      {seg(c.positive, "var(--positive)")}
    </div>
  );
}

function CaseRow({ c }) {
  const cat = LC.resourceColors?.[c.category] || "var(--muted)";
  const tone = c.since >= 10 ? "alert" : c.since >= 6 ? "attention" : "info";
  const toneColor = tone === "alert" ? "var(--alert)" : tone === "attention" ? "var(--attention)" : "var(--info)";
  return (
    <div style={{padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 8, background: "var(--surface)"}}>
      <div className="row" style={{justifyContent: "space-between", marginBottom: 4}}>
        <span style={{fontSize: 12.5, fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>{c.code}</span>
        <span className="mono" style={{fontSize: 10, color: "var(--muted)"}}>{c.id}</span>
      </div>
      <div className="row" style={{gap: 6, marginBottom: 6, flexWrap: "wrap"}}>
        <span className="tag muted" style={{padding: "1px 6px", fontSize: 10.5}}>
          <span className="dot" style={{background: cat}}></span>{c.category}
        </span>
        <span className="tag" style={{padding: "1px 6px", fontSize: 10.5, color: toneColor, background: tone === "alert" ? "var(--alert-bg)" : tone === "attention" ? "var(--attention-bg)" : "var(--info-bg)", borderColor: "transparent"}}>
          {c.status} · {c.since}일째
        </span>
      </div>
      <div style={{fontSize: 11.5, color: "var(--muted)", lineHeight: 1.5}}>
        {c.reason}
      </div>
    </div>
  );
}

function UnconnectedCases({ S }) {
  return (
    <div className="card" style={{padding: 0, overflow: "hidden"}}>
      <div className="row" style={{padding: "14px 18px", justifyContent: "space-between", borderBottom: "1px solid var(--border)"}}>
        <div>
          <div style={{fontWeight: 700, fontSize: 14}}>미연계 / 지연 케이스 ({S.unconnectedCases.length}건)</div>
          <div className="muted" style={{fontSize: 11.5, marginTop: 2}}>
            담임 확인 또는 외부 연계가 6일 이상 지연된 케이스. 학생명은 마스킹됩니다.
          </div>
        </div>
        <div className="row" style={{gap: 6}}>
          <button className="btn sm">담임에게 푸시</button>
          <button className="btn sm primary">연계 미팅 일정</button>
        </div>
      </div>
      <table className="tbl" style={{borderRadius: 0}}>
        <thead>
          <tr>
            <th>케이스 ID</th>
            <th>학년·반·번호</th>
            <th>유형</th>
            <th>경과일</th>
            <th>현재 상태</th>
            <th>지연 사유</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {S.unconnectedCases.map((c) => {
            const cat = LC.resourceColors?.[c.category] || "var(--muted)";
            const tone = c.since >= 10 ? "alert" : c.since >= 6 ? "attention" : "info";
            const toneColor = tone === "alert" ? "var(--alert)" : tone === "attention" ? "var(--attention)" : "var(--info)";
            return (
              <tr key={c.id}>
                <td><span className="mono" style={{fontSize: 12}}>{c.id}</span></td>
                <td><b style={{fontVariantNumeric: "tabular-nums"}}>{c.code}</b></td>
                <td>
                  <span className="tag muted">
                    <span className="dot" style={{background: cat}}></span>{c.category}
                  </span>
                </td>
                <td>
                  <span style={{fontWeight: 700, color: toneColor, fontVariantNumeric: "tabular-nums"}}>
                    {c.since}일
                  </span>
                </td>
                <td><span className="tag muted" style={{color: toneColor, borderColor: "transparent", background: tone === "alert" ? "var(--alert-bg)" : tone === "attention" ? "var(--attention-bg)" : "var(--info-bg)"}}>{c.status}</span></td>
                <td className="muted" style={{fontSize: 12.5}}>{c.reason}</td>
                <td><button className="btn sm">담당자 확인</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TeacherActivity({ S }) {
  return (
    <div className="card" style={{padding: 0, overflow: "hidden"}}>
      <div className="row" style={{padding: "14px 18px", justifyContent: "space-between", borderBottom: "1px solid var(--border)"}}>
        <div>
          <div style={{fontWeight: 700, fontSize: 14}}>교사별 활동 요약 (최근 4주)</div>
          <div className="muted" style={{fontSize: 11.5, marginTop: 2}}>
            기록 빈도와 신호 발생량 · 개별 학생 정보는 포함되지 않습니다.
          </div>
        </div>
        <button className="btn sm">CSV 내보내기</button>
      </div>
      <table className="tbl" style={{borderRadius: 0}}>
        <thead>
          <tr>
            <th>교사</th>
            <th>역할</th>
            <th>담당</th>
            <th>기록 (4주)</th>
            <th>신호 (4주)</th>
            <th>마지막 활동</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          {S.teacherActivity.map((t) => (
            <tr key={t.name}>
              <td><b>{t.name}</b></td>
              <td className="muted" style={{fontSize: 12.5}}>{t.role}</td>
              <td className="num muted">{t.classes}</td>
              <td>
                <div className="row" style={{gap: 8}}>
                  <span className="num" style={{fontWeight: 700, minWidth: 26, fontVariantNumeric: "tabular-nums"}}>{t.records4w}</span>
                  <div style={{flex: 1, maxWidth: 100, height: 5, background: "var(--bg-soft)", borderRadius: 999, overflow: "hidden"}}>
                    <div style={{width: Math.min(100, t.records4w) + "%", height: "100%", background: "var(--primary)", borderRadius: 999}}></div>
                  </div>
                </div>
              </td>
              <td>
                <span className="num" style={{fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>{t.signals4w}</span>
              </td>
              <td className="muted" style={{fontSize: 12.5}}>{t.lastActive}</td>
              <td>
                {t.flag
                  ? <span className="tag attention">{t.flag}</span>
                  : <span className="muted" style={{fontSize: 12}}>—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <span className="row" style={{gap: 6}}>
      <span style={{width: 10, height: 10, borderRadius: 2, background: color}}></span>
      <span>{label}</span>
    </span>
  );
}

window.SchoolAdminDashboard = SchoolAdminDashboard;
