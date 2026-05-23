// Screen 11: 교육청 — 학교군 비교 / 지역자원 분포 / 정책 리포트 / 데이터 출처

// =====================================================================
// SCHOOL COMPARISON — 학교군 비교
// =====================================================================
function SchoolComparison() {
  const [group, setGroup] = React.useState("전체");
  const [sortBy, setSortBy] = React.useState("connected");
  const [view, setView] = React.useState("scatter");

  const groups = ["전체", "○○구·중", "○○구·고", "△△구·중", "△△구·초", "□□구·중", "□□구·고"];
  const list = LC.schoolCompareMetrics.filter((s) => group === "전체" || s.group === group);

  const sorted = React.useMemo(() => {
    return [...list].sort((a, b) => {
      if (sortBy === "connected") return b.connected - a.connected;
      if (sortBy === "signals")   return b.signals - a.signals;
      if (sortBy === "avgTime")   return a.avgTime - b.avgTime;
      if (sortBy === "engagement")return b.engagement - a.engagement;
      return 0;
    });
  }, [list, sortBy]);

  return (
    <div className="col" style={{gap: 18}}>
      <div className="page-head">
        <div>
          <div className="crumbs">교육청 관리자 <span className="sep">›</span> ○○교육지원청 <span className="sep">›</span> 학교군 비교</div>
          <h1 className="page-title">학교군 비교</h1>
          <div className="page-sub">
            학교 간 신호량·연계율·응답시간을 한 그래프에서 봅니다. 우상단은 운영이 잘 되는 학교, 좌하단은 지원 필요 학교군입니다.
          </div>
        </div>
        <div className="row" style={{gap: 8}}>
          <select className="select input" value={group} onChange={(e) => setGroup(e.target.value)}>
            {groups.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <div className="segmented">
            <button className={view === "scatter" ? "active" : ""} onClick={() => setView("scatter")}>분포</button>
            <button className={view === "table" ? "active" : ""} onClick={() => setView("table")}>테이블</button>
          </div>
        </div>
      </div>

      {/* Quadrant scatter */}
      {view === "scatter" && (
        <div className="card">
          <div className="row" style={{justifyContent: "space-between", marginBottom: 10}}>
            <div>
              <div style={{fontSize: 14, fontWeight: 700}}>신호량 × 연계율 분포</div>
              <div className="muted" style={{fontSize: 12, marginTop: 2}}>점 크기 = 학생 수 · 색 = 평균 연계 시간</div>
            </div>
            <div className="row" style={{gap: 12, fontSize: 11.5, color: "var(--muted)"}}>
              <ScatterLegend color="var(--positive)" label="≤ 5일" />
              <ScatterLegend color="var(--info)" label="5–7일" />
              <ScatterLegend color="var(--attention)" label="7–9일" />
              <ScatterLegend color="var(--alert)" label="≥ 9일" />
            </div>
          </div>
          <ScatterPlot data={list} />
        </div>
      )}

      {/* Table */}
      {view === "table" && (
        <div className="card" style={{padding: 0, overflow: "hidden"}}>
          <div className="row" style={{padding: "14px 18px", borderBottom: "1px solid var(--border)"}}>
            <div style={{fontWeight: 700, fontSize: 14}}>학교별 운영 지표</div>
            <div className="grow"></div>
            <span className="muted" style={{fontSize: 12, marginRight: 8}}>정렬</span>
            <div className="segmented">
              <button className={sortBy === "connected" ? "active" : ""} onClick={() => setSortBy("connected")}>연계율</button>
              <button className={sortBy === "signals" ? "active" : ""} onClick={() => setSortBy("signals")}>신호량</button>
              <button className={sortBy === "avgTime" ? "active" : ""} onClick={() => setSortBy("avgTime")}>응답시간</button>
              <button className={sortBy === "engagement" ? "active" : ""} onClick={() => setSortBy("engagement")}>교사 활동</button>
            </div>
          </div>
          <table className="tbl" style={{borderRadius: 0}}>
            <thead>
              <tr>
                <th>학교</th>
                <th>학교군</th>
                <th>학생 수</th>
                <th>학기 신호</th>
                <th>연계 완료율</th>
                <th>평균 응답</th>
                <th>교사 활동</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s) => (
                <tr key={s.school} style={s.ours ? {background: "var(--primary-soft)"} : {}}>
                  <td><b>{s.school}</b> {s.ours && <span className="tag info" style={{marginLeft: 6, padding: "1px 7px", fontSize: 10}}>관할</span>}</td>
                  <td className="muted">{s.group}</td>
                  <td className="num muted">{s.students.toLocaleString()}</td>
                  <td className="num"><b style={{fontVariantNumeric: "tabular-nums"}}>{s.signals}</b></td>
                  <td>
                    <div className="row" style={{gap: 8}}>
                      <span className="num" style={{fontWeight: 700, minWidth: 36, color: s.connected >= 0.8 ? "var(--positive)" : s.connected >= 0.7 ? "var(--info)" : "var(--attention)", fontVariantNumeric: "tabular-nums"}}>
                        {Math.round(s.connected * 100)}%
                      </span>
                      <div style={{flex: 1, maxWidth: 120, height: 5, background: "var(--bg-soft)", borderRadius: 999, overflow: "hidden"}}>
                        <div style={{width: s.connected * 100 + "%", height: "100%", background: s.connected >= 0.8 ? "var(--positive)" : s.connected >= 0.7 ? "var(--info)" : "var(--attention)", borderRadius: 999}}></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{fontWeight: 700, fontVariantNumeric: "tabular-nums", color: s.avgTime <= 5 ? "var(--positive)" : s.avgTime <= 7 ? "var(--info)" : s.avgTime <= 9 ? "var(--attention)" : "var(--alert)"}}>
                      {s.avgTime.toFixed(1)}일
                    </span>
                  </td>
                  <td>
                    <div className="row" style={{gap: 8}}>
                      <span className="num" style={{fontWeight: 700, minWidth: 28}}>{s.engagement}</span>
                      <div style={{flex: 1, maxWidth: 80, height: 5, background: "var(--bg-soft)", borderRadius: 999, overflow: "hidden"}}>
                        <div style={{width: s.engagement + "%", height: "100%", background: "var(--primary)", borderRadius: 999}}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 학교군 평균 */}
      <div className="card">
        <h3 className="card-title">학교군 평균</h3>
        <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 10}}>
          {[
            { label: "○○구 중학교", schools: list.filter((s) => s.group === "○○구·중") },
            { label: "△△구 중학교", schools: list.filter((s) => s.group === "△△구·중") },
            { label: "□□구 중학교", schools: list.filter((s) => s.group === "□□구·중") },
          ].filter((g) => g.schools.length > 0).map((g) => {
            const n = g.schools.length || 1;
            const avgConn = g.schools.reduce((a, s) => a + s.connected, 0) / n;
            const avgTime = g.schools.reduce((a, s) => a + s.avgTime, 0) / n;
            const avgEng = g.schools.reduce((a, s) => a + s.engagement, 0) / n;
            return (
              <div key={g.label} style={{padding: 14, border: "1px solid var(--border)", borderRadius: 10}}>
                <div style={{fontSize: 13, fontWeight: 700, marginBottom: 8}}>{g.label}</div>
                <div className="col" style={{gap: 6, fontSize: 12}}>
                  <GroupStat label="평균 연계율" value={Math.round(avgConn * 100) + "%"} />
                  <GroupStat label="평균 응답" value={avgTime.toFixed(1) + "일"} />
                  <GroupStat label="평균 활동 점수" value={Math.round(avgEng)} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GroupStat({ label, value }) {
  return (
    <div className="row" style={{justifyContent: "space-between"}}>
      <span className="muted">{label}</span>
      <span style={{fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>{value}</span>
    </div>
  );
}

function ScatterLegend({ color, label }) {
  return (
    <span className="row" style={{gap: 5}}>
      <span style={{width: 10, height: 10, borderRadius: 5, background: color}}></span>
      <span>{label}</span>
    </span>
  );
}

function ScatterPlot({ data }) {
  // x = signals/students normalized, y = connected
  const xVals = data.map((d) => d.signals / d.students);
  const xMin = Math.min(...xVals), xMax = Math.max(...xVals);
  const w = 700, h = 360, pad = 40;
  const innerW = w - pad * 2, innerH = h - pad * 2;
  const xPos = (v) => pad + ((v - xMin) / (xMax - xMin || 1)) * innerW;
  const yPos = (v) => pad + (1 - v) * innerH; // connected 0-1

  const color = (t) => t <= 5 ? "var(--positive)" : t <= 7 ? "var(--info)" : t <= 9 ? "var(--attention)" : "var(--alert)";

  return (
    <div style={{position: "relative"}}>
      <svg viewBox={`0 0 ${w} ${h}`} style={{width: "100%", height: "auto"}}>
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <line key={g} x1={pad} y1={yPos(g)} x2={w - pad} y2={yPos(g)} stroke="var(--border)" strokeWidth="1" strokeDasharray={g === 0.5 ? "4 4" : ""} />
        ))}
        {/* Quadrant labels */}
        <text x={pad + 6} y={pad + 14} fontSize="10" fill="var(--muted)" fontWeight="600">고연계율 · 저신호량</text>
        <text x={w - pad - 6} y={pad + 14} fontSize="10" fill="var(--muted)" fontWeight="600" textAnchor="end">고연계율 · 고신호량 ★</text>
        <text x={pad + 6} y={h - pad - 6} fontSize="10" fill="var(--alert)" fontWeight="600">저연계율 · 저신호량 (사각지대 가능)</text>
        <text x={w - pad - 6} y={h - pad - 6} fontSize="10" fill="var(--alert)" fontWeight="600" textAnchor="end">저연계율 · 고신호량 ⚠ 지원 필요</text>

        {/* Y-axis labels */}
        <text x={6} y={yPos(1)} fontSize="10" fill="var(--muted)">100%</text>
        <text x={6} y={yPos(0.5)} fontSize="10" fill="var(--muted)">50%</text>
        <text x={6} y={yPos(0)} fontSize="10" fill="var(--muted)">0%</text>
        <text x={pad - 8} y={pad - 8} fontSize="10" fill="var(--muted)" fontWeight="600">연계율</text>
        <text x={w - pad} y={h - 6} fontSize="10" fill="var(--muted)" fontWeight="600" textAnchor="end">신호량 / 학생 수 (학기)</text>

        {/* Points */}
        {data.map((s) => {
          const cx = xPos(s.signals / s.students);
          const cy = yPos(s.connected);
          const r = Math.sqrt(s.students) / 3;
          return (
            <g key={s.school}>
              <circle cx={cx} cy={cy} r={r} fill={color(s.avgTime)} fillOpacity="0.32" stroke={color(s.avgTime)} strokeWidth={s.ours ? 2.5 : 1.4} />
              {s.ours && <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="3 3" />}
              <text x={cx} y={cy + r + 12} fontSize="11" fill="var(--text)" textAnchor="middle" fontWeight={s.ours ? 700 : 500} letterSpacing="-0.02em">
                {s.school}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}


// =====================================================================
// DISTRICT LOCAL — 지역자원 분포
// =====================================================================
function DistrictLocalResources() {
  const cats = ["상담", "학습지원", "복지", "돌봄", "활동"];
  const max = Math.max(...LC.districtResources.flatMap((r) => Object.values(r.counts)));

  return (
    <div className="col" style={{gap: 18}}>
      <div className="page-head">
        <div>
          <div className="crumbs">교육청 관리자 <span className="sep">›</span> 지역자원 분포</div>
          <h1 className="page-title">지역자원 분포</h1>
          <div className="page-sub">지역 × 자원 종류 매트릭스 — 부족한 영역과 신규 등록 자원을 추적합니다.</div>
        </div>
        <button className="btn">{Icons.Plus}자원 등록 안내</button>
      </div>

      {/* Heatmap matrix */}
      <div className="card">
        <div className="card-head">
          <h3 className="card-title">지역 × 자원 종류 매트릭스</h3>
          <span className="muted" style={{fontSize: 12}}>색이 진할수록 자원이 많음</span>
        </div>
        <div style={{overflowX: "auto"}}>
          <table style={{width: "100%", borderCollapse: "separate", borderSpacing: 4, minWidth: 500}}>
            <thead>
              <tr>
                <th style={{textAlign: "left", padding: "8px 12px", fontSize: 12, fontWeight: 700, color: "var(--text-soft)"}}>지역</th>
                {cats.map((c) => (
                  <th key={c} style={{textAlign: "center", padding: "8px 12px", fontSize: 11.5, fontWeight: 700, color: "var(--text-soft)"}}>
                    <span className="dot" style={{background: LC.resourceColors?.[c] || "var(--muted)", width: 8, height: 8, marginRight: 4}}></span>
                    {c}
                  </th>
                ))}
                <th style={{textAlign: "center", padding: "8px 12px", fontSize: 11.5, fontWeight: 700, color: "var(--text-soft)"}}>부족</th>
              </tr>
            </thead>
            <tbody>
              {LC.districtResources.map((r) => (
                <tr key={r.region}>
                  <td style={{padding: "10px 12px", fontWeight: 700, background: "var(--surface-2)", borderRadius: 8}}>{r.region}</td>
                  {cats.map((c) => {
                    const v = r.counts[c] || 0;
                    const intensity = v / max;
                    return (
                      <td key={c} style={{
                        textAlign: "center", padding: "12px 8px",
                        background: `oklch(${0.96 - intensity * 0.18} ${0.04 + intensity * 0.12} 250)`,
                        border: "1px solid " + (intensity > 0.4 ? "oklch(0.78 0.10 250)" : "var(--border)"),
                        borderRadius: 8,
                        fontWeight: 700, fontSize: 18,
                        color: intensity > 0.5 ? "white" : "var(--text)",
                        fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em",
                      }}>
                        {v}
                      </td>
                    );
                  })}
                  <td style={{textAlign: "center", padding: "10px 12px"}}>
                    {r.lacking.length === 0
                      ? <span className="tag positive">충분</span>
                      : r.lacking.map((l) => <span key={l} className="tag attention" style={{marginRight: 4, fontSize: 10.5}}>{l}</span>)
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 신규 자원 + 부족 자원 */}
      <div className="row" style={{gap: 14, alignItems: "flex-start"}}>
        <div className="card" style={{flex: 1}}>
          <div className="card-head">
            <h3 className="card-title">최근 등록된 자원</h3>
            <span className="tag info">최근 30일 {LC.newDistrictResources.length}건</span>
          </div>
          <div className="col" style={{gap: 8}}>
            {LC.newDistrictResources.map((r) => (
              <div key={r.name} style={{
                padding: "10px 12px", border: "1px solid var(--positive-border)",
                background: "var(--positive-bg)", borderRadius: 10,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{width: 36, fontSize: 11, fontWeight: 700, color: "var(--positive)", fontVariantNumeric: "tabular-nums"}}>{r.date}</span>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontSize: 13, fontWeight: 700}}>{r.name}</div>
                  <div className="muted" style={{fontSize: 11.5}}>{r.region} · {r.category} · 정원 {r.capacity}명</div>
                </div>
                <button className="btn sm">상세</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{flex: 1}}>
          <div className="card-head">
            <h3 className="card-title">집중 부족 영역</h3>
            <span className="tag alert">권역 우선순위</span>
          </div>
          <div className="col" style={{gap: 10}}>
            {LC.districtResources.filter((r) => r.lacking.length > 0).map((r) => (
              <div key={r.region} style={{padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 10}}>
                <div className="row" style={{justifyContent: "space-between", marginBottom: 6}}>
                  <span style={{fontWeight: 700, fontSize: 13}}>{r.region}</span>
                  <span className="muted" style={{fontSize: 11}}>자원 {Object.values(r.counts).reduce((a, b) => a + b, 0)}개</span>
                </div>
                <div className="row" style={{gap: 6, flexWrap: "wrap"}}>
                  {r.lacking.map((l) => (
                    <span key={l} className="tag attention" style={{padding: "2px 8px"}}>{l} 부족</span>
                  ))}
                </div>
                <div style={{fontSize: 11.5, color: "var(--muted)", marginTop: 8, lineHeight: 1.5}}>
                  관할 학교 {LC.regionMap.find((rm) => rm.region === r.region)?.schools || 0}곳에서 매칭 어려움 보고됨.
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


// =====================================================================
// POLICY — 정책 리포트
// =====================================================================
function PolicyReport() {
  const [tab, setTab] = React.useState("recommendations");

  return (
    <div className="col" style={{gap: 18}}>
      <div className="page-head">
        <div>
          <div className="crumbs">교육청 관리자 <span className="sep">›</span> 정책 리포트</div>
          <h1 className="page-title">정책 리포트</h1>
          <div className="page-sub">분기별 KPI 추세와 AI 정책 권고 — 다음 분기 의사결정에 활용됩니다.</div>
        </div>
        <div className="row" style={{gap: 8}}>
          <button className="btn">{Icons.Folder}분기 보고서 PDF</button>
          <button className="btn primary">{Icons.Plus}정책 등록</button>
        </div>
      </div>

      {/* KPI 추세 */}
      <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12}}>
        {LC.policyKpis.map((k) => {
          const improved = k.delta < 0 ? (k.label.includes("시간") || k.label.includes("공백")) : (k.label.includes("율") || k.label.includes("점수"));
          const arrow = k.delta > 0 ? "▲" : k.delta < 0 ? "▼" : "—";
          const c = improved ? "var(--positive)" : "var(--alert)";
          return (
            <div key={k.label} className="kpi">
              <div className="label">{k.label}</div>
              <div className="row" style={{gap: 8, alignItems: "baseline"}}>
                <div className="value">{k.value}{k.unit}</div>
                <span style={{fontSize: 12, fontWeight: 700, color: c, fontVariantNumeric: "tabular-nums"}}>
                  {arrow} {Math.abs(k.delta)}{k.unit}
                </span>
              </div>
              <div className="meta">전 분기 {k.prev}{k.unit} · {k.note}</div>
            </div>
          );
        })}
      </div>

      {/* Trend chart */}
      <div className="card">
        <div className="card-head">
          <h3 className="card-title">분기별 추세</h3>
          <div className="row" style={{gap: 14, fontSize: 11.5}}>
            <span className="row" style={{gap: 5}}><span style={{width: 10, height: 2, background: "var(--alert)"}}></span><span className="muted">지원 공백 지수</span></span>
            <span className="row" style={{gap: 5}}><span style={{width: 10, height: 2, background: "var(--positive)"}}></span><span className="muted">연계 완료율 (%)</span></span>
            <span className="row" style={{gap: 5}}><span style={{width: 10, height: 2, background: "var(--info)"}}></span><span className="muted">평균 연계 시간 (일)</span></span>
          </div>
        </div>
        <PolicyTrendChart data={LC.policyTimeline} />
      </div>

      {/* 정책 카드 */}
      <div className="card" style={{padding: 0, overflow: "hidden"}}>
        <div className="row" style={{padding: "12px 18px", borderBottom: "1px solid var(--border)"}}>
          <h3 className="card-title" style={{margin: 0}}>정책 권고 / 시행</h3>
          <div className="grow"></div>
          <div className="segmented">
            <button className={tab === "recommendations" ? "active" : ""} onClick={() => setTab("recommendations")}>전체</button>
            <button className={tab === "active" ? "active" : ""} onClick={() => setTab("active")}>시행 중</button>
            <button className={tab === "review" ? "active" : ""} onClick={() => setTab("review")}>검토 중</button>
            <button className={tab === "suggested" ? "active" : ""} onClick={() => setTab("suggested")}>권고</button>
          </div>
        </div>
        <div style={{padding: 18, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14}}>
          {LC.policyCards
            .filter((p) => tab === "recommendations"
              || (tab === "active" && p.type === "시행 중")
              || (tab === "review" && p.type === "검토 중")
              || (tab === "suggested" && p.type === "권고"))
            .map((p) => {
              const tone = p.type === "시행 중" ? "positive" : p.type === "검토 중" ? "info" : "attention";
              const c = tone === "positive" ? "var(--positive)" : tone === "info" ? "var(--info)" : "var(--attention)";
              const bg = tone === "positive" ? "var(--positive-bg)" : tone === "info" ? "var(--info-bg)" : "var(--attention-bg)";
              return (
                <div key={p.id} style={{padding: 16, border: "1px solid var(--border)", borderRadius: 12, background: "var(--surface)"}}>
                  <div className="row" style={{gap: 6, marginBottom: 8}}>
                    <span style={{
                      fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                      background: bg, color: c,
                    }}>{p.type}</span>
                    <span className="tag muted" style={{fontSize: 10.5}}>{p.impact}</span>
                  </div>
                  <div style={{fontSize: 14.5, fontWeight: 700, letterSpacing: "-0.01em", marginBottom: 6}}>{p.title}</div>
                  <div style={{fontSize: 12, color: "var(--muted)", marginBottom: 8}}>적용 대상 · {p.target}</div>
                  <div style={{fontSize: 12.5, color: "var(--text-soft)", lineHeight: 1.55, marginBottom: 10}}>{p.rationale}</div>
                  <div className="row" style={{gap: 6, padding: "8px 10px", background: "var(--bg-soft)", borderRadius: 8, fontSize: 11.5}}>
                    <span className="muted">진행 상태</span>
                    <span style={{fontWeight: 700}}>{p.status}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

function PolicyTrendChart({ data }) {
  const w = 800, h = 280, pad = 50;
  const innerW = w - pad * 2, innerH = h - pad * 2;
  const stepX = innerW / (data.length - 1);
  // Both gap and connected scaled to 0-100
  const gapPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${pad + i * stepX},${pad + (1 - d.gap / 100) * innerH}`).join(" ");
  const connPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${pad + i * stepX},${pad + (1 - d.connected / 100) * innerH}`).join(" ");
  const timePath = data.map((d, i) => `${i === 0 ? "M" : "L"}${pad + i * stepX},${pad + (1 - d.time / 12) * innerH}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{width: "100%", height: "auto"}}>
      {/* gridlines */}
      {[0, 25, 50, 75, 100].map((y) => (
        <line key={y} x1={pad} y1={pad + (1 - y / 100) * innerH} x2={w - pad} y2={pad + (1 - y / 100) * innerH} stroke="var(--border)" strokeWidth="1" strokeDasharray={y === 50 ? "4 4" : ""} />
      ))}
      {[0, 25, 50, 75, 100].map((y) => (
        <text key={y} x={pad - 8} y={pad + (1 - y / 100) * innerH + 4} fontSize="10" fill="var(--muted)" textAnchor="end" fontVariantNumeric="tabular-nums">{y}</text>
      ))}
      {/* Lines */}
      <path d={gapPath} fill="none" stroke="var(--alert)" strokeWidth="2.5" />
      <path d={connPath} fill="none" stroke="var(--positive)" strokeWidth="2.5" />
      <path d={timePath} fill="none" stroke="var(--info)" strokeWidth="2.5" strokeDasharray="6 3" />
      {/* points */}
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={pad + i * stepX} cy={pad + (1 - d.gap / 100) * innerH} r="4" fill="var(--alert)" />
          <circle cx={pad + i * stepX} cy={pad + (1 - d.connected / 100) * innerH} r="4" fill="var(--positive)" />
          <circle cx={pad + i * stepX} cy={pad + (1 - d.time / 12) * innerH} r="4" fill="var(--info)" />
          <text x={pad + i * stepX} y={h - pad + 18} fontSize="11" fill="var(--muted)" textAnchor="middle">{d.quarter}</text>
        </g>
      ))}
    </svg>
  );
}


// =====================================================================
// DATA SOURCES — 데이터 출처 관리
// =====================================================================
function DataSources() {
  return (
    <div className="col" style={{gap: 18}}>
      <div className="page-head">
        <div>
          <div className="crumbs">교육청 관리자 <span className="sep">›</span> 데이터 출처 관리</div>
          <h1 className="page-title">데이터 출처 관리</h1>
          <div className="page-sub">통합 대시보드에 들어오는 모든 데이터의 출처·주기·익명화 처리·품질을 한 곳에서 관리합니다.</div>
        </div>
        <button className="btn">{Icons.Settings}수집 설정</button>
      </div>

      {/* KPI */}
      <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12}}>
        <div className="kpi info">
          <div className="label">데이터 출처</div>
          <div className="value">{LC.dataSources.length}</div>
          <div className="meta">{LC.dataSources.filter((s) => s.type === "API").length}개 API · {LC.dataSources.filter((s) => s.type !== "API").length}개 수동</div>
        </div>
        <div className="kpi positive">
          <div className="label">정상</div>
          <div className="value">{LC.dataSources.filter((s) => s.health === "정상").length}</div>
          <div className="meta">최근 24시간</div>
        </div>
        <div className="kpi attention">
          <div className="label">주의 / 지연</div>
          <div className="value">{LC.dataSources.filter((s) => s.health !== "정상").length}</div>
          <div className="meta">수동 입력 의존</div>
        </div>
        <div className="kpi">
          <div className="label">평균 적용률</div>
          <div className="value">{Math.round(LC.dataSources.reduce((a, s) => a + s.coverage, 0) / LC.dataSources.length * 100)}%</div>
          <div className="meta">학교/학생 커버리지</div>
        </div>
      </div>

      <div className="card" style={{padding: 0, overflow: "hidden"}}>
        <div className="row" style={{padding: "12px 18px", borderBottom: "1px solid var(--border)"}}>
          <h3 className="card-title" style={{margin: 0}}>데이터 출처 목록</h3>
          <div className="grow"></div>
          <span className="muted" style={{fontSize: 12}}>마지막 갱신 · 5분 전</span>
        </div>
        <table className="tbl" style={{borderRadius: 0}}>
          <thead>
            <tr>
              <th>출처</th>
              <th>유형</th>
              <th>책임자</th>
              <th>수집 주기</th>
              <th>마지막 동기화</th>
              <th>적용률</th>
              <th>건수</th>
              <th>상태</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {LC.dataSources.map((s) => {
              const healthTone = s.health === "정상" ? "positive" : s.health === "지연" ? "alert" : "attention";
              const c = healthTone === "positive" ? "var(--positive)" : healthTone === "alert" ? "var(--alert)" : "var(--attention)";
              const bg = healthTone === "positive" ? "var(--positive-bg)" : healthTone === "alert" ? "var(--alert-bg)" : "var(--attention-bg)";
              return (
                <tr key={s.id}>
                  <td>
                    <b>{s.name}</b>
                    {s.flags.length > 0 && (
                      <div style={{fontSize: 11, color: "var(--attention)", marginTop: 2}}>
                        ⓘ {s.flags.join(" · ")}
                      </div>
                    )}
                  </td>
                  <td><span className="tag muted">{s.type}</span></td>
                  <td className="muted" style={{fontSize: 12.5}}>{s.responsible}</td>
                  <td className="muted" style={{fontSize: 12.5}}>{s.frequency}</td>
                  <td style={{fontSize: 12, fontVariantNumeric: "tabular-nums"}}>{s.lastSync}</td>
                  <td>
                    <div className="row" style={{gap: 8}}>
                      <span className="num" style={{fontWeight: 700, minWidth: 36, fontVariantNumeric: "tabular-nums", color: s.coverage >= 0.9 ? "var(--positive)" : s.coverage >= 0.75 ? "var(--info)" : "var(--attention)"}}>
                        {Math.round(s.coverage * 100)}%
                      </span>
                      <div style={{flex: 1, maxWidth: 80, height: 5, background: "var(--bg-soft)", borderRadius: 999, overflow: "hidden"}}>
                        <div style={{width: s.coverage * 100 + "%", height: "100%", background: s.coverage >= 0.9 ? "var(--positive)" : s.coverage >= 0.75 ? "var(--info)" : "var(--attention)", borderRadius: 999}}></div>
                      </div>
                    </div>
                  </td>
                  <td className="num muted">{s.totalRows.toLocaleString()}</td>
                  <td>
                    <span style={{
                      padding: "2px 8px", borderRadius: 4, background: bg, color: c,
                      fontSize: 11.5, fontWeight: 700,
                    }}>{s.health}</span>
                  </td>
                  <td><button className="btn sm">설정</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 개인정보 보호 */}
      <div className="card" style={{
        background: "linear-gradient(180deg, var(--ai-bg), var(--surface))",
        borderColor: "var(--ai-border)",
      }}>
        <div className="card-head">
          <h3 className="card-title" style={{color: "var(--ai-text)"}}>개인정보 보호 처리</h3>
          <span className="tag" style={{background: "var(--ai-bg-strong)", borderColor: "var(--ai-border)", color: "var(--ai-text)"}}>모든 출처 익명화</span>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14}}>
          <PrivacyCard
            label="익명화 처리율"
            value="100%"
            note="학교 외부로 나가는 모든 데이터는 학번·이름 마스킹 후 집계 단위로만 전달됩니다."
          />
          <PrivacyCard
            label="보호자 동의 적용"
            value="93.6%"
            note="미동의 6.4% 학생의 데이터는 학교 내부 운영 외 어떤 곳에도 사용되지 않습니다."
          />
          <PrivacyCard
            label="상담 원문 보호"
            value="비공유"
            note="상담교사의 원문 기록은 교육청·학교 관리자에게도 접근 권한이 부여되지 않습니다."
          />
        </div>
      </div>
    </div>
  );
}

function PrivacyCard({ label, value, note }) {
  return (
    <div style={{padding: 14, background: "var(--surface)", border: "1px solid var(--ai-border)", borderRadius: 10}}>
      <div style={{fontSize: 11, fontWeight: 700, color: "var(--ai-text)", textTransform: "uppercase", letterSpacing: "0.04em"}}>{label}</div>
      <div style={{fontSize: 22, fontWeight: 700, color: "var(--ai-text)", marginTop: 4, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em"}}>{value}</div>
      <div style={{fontSize: 11.5, color: "var(--text-soft)", marginTop: 8, lineHeight: 1.55}}>{note}</div>
    </div>
  );
}


window.SchoolComparison = SchoolComparison;
window.DistrictLocalResources = DistrictLocalResources;
window.PolicyReport = PolicyReport;
window.DataSources = DataSources;
