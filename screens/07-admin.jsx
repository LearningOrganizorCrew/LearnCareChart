// Screen 7: 관리자 / 교육청 대시보드

function AdminDashboard() {
  const [region, setRegion] = React.useState("전체");
  const [level, setLevel] = React.useState("전체");
  const [period, setPeriod] = React.useState("이번 학기");
  const [sortBy, setSortBy] = React.useState("gap");

  const schools = React.useMemo(() => {
    const list = LC.schoolsGap.filter((s) =>
      (region === "전체" || s.region === region) &&
      (level === "전체" || s.school.includes(level === "중" ? "중" : level === "고" ? "고" : "초"))
    );
    return [...list].sort((a, b) => {
      if (sortBy === "gap") return b.gap - a.gap;
      if (sortBy === "change") return b.change - a.change;
      return b.students - a.students;
    });
  }, [region, level, sortBy]);

  return (
    <div className="col" style={{gap: 18}}>
      <div className="page-head">
        <div>
          <div className="crumbs">교육청 관리자 <span className="sep">›</span> ○○교육지원청 <span className="sep">›</span> 지원 공백 대시보드</div>
          <h1 className="page-title">지원 공백 대시보드</h1>
          <div className="page-sub">개별 학생이 아니라 지원이 부족한 학교군과 지역을 봅니다. 모든 데이터는 익명·집계 처리됩니다.</div>
        </div>
        <div className="row" style={{gap: 8}}>
          <select className="select input" value={region} onChange={(e) => setRegion(e.target.value)}>
            <option>전체</option><option>○○구</option><option>△△구</option><option>□□구</option><option>◇◇구</option>
          </select>
          <select className="select input" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option>전체</option><option value="초">초등학교</option><option value="중">중학교</option><option value="고">고등학교</option>
          </select>
          <div className="segmented">
            <button className={period === "이번 학기" ? "active" : ""} onClick={() => setPeriod("이번 학기")}>이번 학기</button>
            <button className={period === "최근 4주" ? "active" : ""} onClick={() => setPeriod("최근 4주")}>최근 4주</button>
          </div>
          <button className="btn">{Icons.Folder}정책 리포트</button>
        </div>
      </div>

      {/* KPI */}
      <div style={{display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12}}>
        {LC.adminKpis.map((k) => (
          <div key={k.label} className={"kpi " + k.tone}>
            <div className="label">{k.label}</div>
            <div className="value">{k.value}</div>
            <div className="meta">{k.meta}</div>
          </div>
        ))}
      </div>

      <div className="row" style={{gap: 14, alignItems: "stretch"}}>
        {/* 지도 */}
        <div className="card" style={{flex: 1.1, minWidth: 0}}>
          <div className="card-head">
            <h3 className="card-title">지원 공백 지수 지도</h3>
            <span className="muted" style={{fontSize: 12}}>지역별 평균 공백 지수</span>
          </div>
          <RegionMap regions={LC.regionMap} />
          <div className="row" style={{gap: 10, marginTop: 12, fontSize: 11.5}}>
            <span className="muted">공백 지수</span>
            <GradientLegend />
          </div>
          <div className="muted" style={{fontSize: 11, marginTop: 10, lineHeight: 1.6}}>
            <span className="mono">공백 지수</span> = 학생 변화 신호량 × 지역자원 접근성 부족도 × 미연계율
          </div>
        </div>

        {/* 지역자원 부족 */}
        <div className="card" style={{width: 340, flexShrink: 0}}>
          <div className="card-head">
            <h3 className="card-title">지역자원 부족 분석</h3>
          </div>
          <div className="col" style={{gap: 10}}>
            {LC.regionMap.map((r) => (
              <div key={r.region} style={{padding: "12px", border: "1px solid var(--border)", borderRadius: 10}}>
                <div className="row" style={{justifyContent: "space-between"}}>
                  <span style={{fontWeight: 700, fontSize: 13}}>{r.region}</span>
                  <span className="tag muted">학교 {r.schools} · 자원 {r.resources}</span>
                </div>
                <div className="row" style={{gap: 10, marginTop: 8}}>
                  <span className="num" style={{fontSize: 22, fontWeight: 700, color: gapColor(r.gap)}}>{r.gap}</span>
                  <div style={{flex: 1}}>
                    <div style={{height: 6, background: "var(--bg-soft)", borderRadius: 999, overflow: "hidden"}}>
                      <div style={{height: "100%", width: r.gap + "%", background: gapColor(r.gap), borderRadius: 999}}></div>
                    </div>
                    <div className="row" style={{gap: 4, marginTop: 6}}>
                      {r.shortage.length === 0
                        ? <span className="tag positive">충분</span>
                        : r.shortage.map((s) => <span key={s} className="tag attention" style={{fontSize: 10.5}}>{s} 부족</span>)
                      }
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 학교별 비교 */}
      <div className="card" style={{padding: 0, overflow: "hidden"}}>
        <div className="row" style={{padding: "14px 18px", justifyContent: "space-between", borderBottom: "1px solid var(--border)"}}>
          <div>
            <div style={{fontWeight: 700, fontSize: 14}}>학교별 지원 공백 비교</div>
            <div className="muted" style={{fontSize: 11.5, marginTop: 2}}>지원이 더 필요한 학교군을 한눈에 보여줍니다.</div>
          </div>
          <div className="row" style={{gap: 8}}>
            <span className="muted" style={{fontSize: 12}}>정렬</span>
            <div className="segmented">
              <button className={sortBy === "gap" ? "active" : ""} onClick={() => setSortBy("gap")}>공백 지수</button>
              <button className={sortBy === "change" ? "active" : ""} onClick={() => setSortBy("change")}>변화량</button>
              <button className={sortBy === "students" ? "active" : ""} onClick={() => setSortBy("students")}>학생 수</button>
            </div>
          </div>
        </div>
        <table className="tbl" style={{borderRadius: 0}}>
          <thead>
            <tr>
              <th>학교</th>
              <th>지역</th>
              <th>주요 공백</th>
              <th>필요 자원</th>
              <th>공백 지수</th>
              <th>지난 학기 대비</th>
              <th>학생 수</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {schools.map((s) => (
              <tr key={s.school}>
                <td><b>{s.school}</b></td>
                <td className="muted">{s.region}</td>
                <td><span className="tag muted">{s.primary}</span></td>
                <td style={{fontSize: 12.5}}>{s.need}</td>
                <td>
                  <div className="row" style={{gap: 10}}>
                    <span className="num" style={{fontWeight: 700, minWidth: 30, color: gapColor(s.gap)}}>{s.gap}</span>
                    <div style={{flex: 1, height: 6, background: "var(--bg-soft)", borderRadius: 999, overflow: "hidden", maxWidth: 120}}>
                      <div style={{height: "100%", width: s.gap + "%", background: gapColor(s.gap), borderRadius: 999}}></div>
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{fontWeight: 600, color: s.change > 0 ? "var(--alert)" : s.change < 0 ? "var(--positive)" : "var(--muted)"}}>
                    {s.change > 0 ? "▲ +" : s.change < 0 ? "▼ " : "— "}{Math.abs(s.change)}
                  </span>
                </td>
                <td className="num muted">{s.students.toLocaleString()}</td>
                <td><button className="btn sm">상세 집계</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="muted" style={{fontSize: 11.5, padding: "8px 4px", lineHeight: 1.6}}>
        ⓘ 이 화면에는 개별 학생을 식별할 수 있는 정보가 노출되지 않습니다. 상담 기록 원문, 학생 차트는 권한 제한으로 접근할 수 없습니다.
      </div>
    </div>
  );
}

function gapColor(v) {
  if (v >= 75) return "var(--alert)";
  if (v >= 55) return "var(--attention)";
  if (v >= 40) return "oklch(0.65 0.10 230)";
  return "var(--positive)";
}

function GradientLegend() {
  return (
    <div className="row" style={{gap: 4, alignItems: "center"}}>
      <span className="muted" style={{fontSize: 10}}>낮음</span>
      <div style={{
        width: 140, height: 8, borderRadius: 999,
        background: "linear-gradient(90deg, var(--positive), oklch(0.65 0.10 230), var(--attention), var(--alert))",
      }}></div>
      <span className="muted" style={{fontSize: 10}}>높음</span>
    </div>
  );
}

function RegionMap({ regions }) {
  // 4 abstract regions arranged in 2x2 grid w/ school dots
  const layouts = {
    "○○구": { x: 4, y: 4, w: 46, h: 44 },
    "△△구": { x: 52, y: 4, w: 46, h: 44 },
    "□□구": { x: 4, y: 52, w: 46, h: 44 },
    "◇◇구": { x: 52, y: 52, w: 46, h: 44 },
  };
  return (
    <div style={{position: "relative", width: "100%", height: 320, background: "linear-gradient(180deg, oklch(0.97 0.015 220), oklch(0.95 0.02 200))", borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)"}}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: "absolute", inset: 0, width: "100%", height: "100%"}}>
        {regions.map((r) => {
          const L = layouts[r.region];
          return (
            <g key={r.region}>
              <rect x={L.x} y={L.y} width={L.w} height={L.h} rx="3"
                fill={gapColor(r.gap)} opacity="0.18"
                stroke={gapColor(r.gap)} strokeWidth="0.4" />
            </g>
          );
        })}
      </svg>
      {regions.map((r) => {
        const L = layouts[r.region];
        // sprinkle school markers
        const dots = [];
        for (let i = 0; i < r.schools; i++) {
          const dx = ((i * 17) % (L.w - 8)) + 4;
          const dy = ((Math.floor(i / 5) * 12) + 8) % (L.h - 8);
          dots.push({dx, dy});
        }
        return (
          <div key={r.region} style={{
            position: "absolute",
            left: L.x + "%", top: L.y + "%",
            width: L.w + "%", height: L.h + "%",
          }}>
            <div style={{position: "absolute", top: 10, left: 14, fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em"}}>
              {r.region}
              <div className="muted" style={{fontSize: 10, fontWeight: 500, marginTop: 2}}>
                공백 지수 <span className="num" style={{color: gapColor(r.gap), fontWeight: 700}}>{r.gap}</span>
              </div>
            </div>
            {dots.map((d, i) => (
              <span key={i} style={{
                position: "absolute", left: d.dx + "%", top: d.dy + "%",
                width: 6, height: 6, borderRadius: "50%",
                background: gapColor(r.gap), opacity: 0.7,
              }}></span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

window.AdminDashboard = AdminDashboard;
