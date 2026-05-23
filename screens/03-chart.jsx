// Screen 3: 학생 지원 차트 (Student Support Chart)

function StudentChart({ studentId, onOpenPrep, onOpenBoard }) {
  const data = LC.kimminsu; // demo focused on 김민수
  const student = LC.students.find((s) => s.id === data.id);

  return (
    <div className="col" style={{gap: 18}}>
      <div className="crumbs">담임교사 <span className="sep">›</span> 주간 브리핑 <span className="sep">›</span> 학생 지원 차트</div>

      {/* 프로필 */}
      <div className="card" style={{padding: "20px 22px"}}>
        <div className="row" style={{justifyContent: "space-between", alignItems: "flex-start", gap: 20}}>
          <div className="row" style={{gap: 16}}>
            <Avatar student={student} size="lg" />
            <div>
              <div style={{fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em"}}>
                {data.name} <span className="muted" style={{fontSize: 15, fontWeight: 500}}> · {data.cls}</span>
              </div>
              <div className="row" style={{gap: 8, marginTop: 8}}>
                <StatusPill state={data.state}>{data.status}</StatusPill>
                <span className="muted" style={{fontSize: 12.5}}>담임: {data.homeroom} 교사</span>
                <span className="muted" style={{fontSize: 12.5}}>· 마지막 업데이트 {data.lastUpdate}</span>
              </div>
              <div className="muted" style={{fontSize: 11.5, marginTop: 8, lineHeight: 1.5}}>
                담임 / 상담 / 복지 / 기초학력 담당이 볼 수 있는 화면입니다. 민감 메모는 별도 권한이 필요합니다.
              </div>
            </div>
          </div>
          <div className="row" style={{gap: 8}}>
            <button className="btn">기록 추가</button>
            <button className="btn">공유 요청</button>
            <button className="btn ai" onClick={() => onOpenPrep(data.id)}>{Icons.Sparkles}상담 준비</button>
            <button className="btn primary" onClick={() => onOpenBoard()}>지원 연결</button>
          </div>
        </div>
      </div>

      {/* AI 요약 */}
      <div className="ai-card">
        <div className="row" style={{justifyContent: "space-between", alignItems: "flex-start"}}>
          <div style={{flex: 1, paddingRight: 18}}>
            <div className="ai-label"><span className="ai-dot"></span>AI 변화 요약</div>
            <div className="ai-body" style={{fontSize: 14}}>{data.aiSummary}</div>
            <div className="ai-disclaimer">AI는 가능성을 요약합니다. 확정 표현이 아니며, 담임 확인이 우선합니다.</div>
          </div>
          <div className="row" style={{gap: 8}}>
            <button className="btn sm ai">요약 복사</button>
          </div>
        </div>
      </div>

      {/* 6주 트렌드 */}
      <div className="card">
        <div className="card-head">
          <h3 className="card-title">최근 6주 트렌드</h3>
          <div className="row" style={{gap: 10, fontSize: 12, color: "var(--muted)"}}>
            <Legend color="var(--primary)" label="참여" />
            <Legend color="oklch(0.55 0.12 60)" label="제출" />
            <Legend color="oklch(0.55 0.10 155)" label="출결" />
            <Legend color="oklch(0.55 0.16 295)" label="성취도" />
          </div>
        </div>
        <TrendChart trend={data.trend} />
        <div className="muted" style={{fontSize: 11.5, marginTop: 10, lineHeight: 1.5}}>
          반 전체 순위가 아닌, 학생 본인 baseline 대비 흐름을 보여줍니다.
        </div>
      </div>

      <div className="row" style={{gap: 18, alignItems: "flex-start"}}>
        {/* 이벤트 타임라인 */}
        <div className="card grow">
          <div className="card-head">
            <h3 className="card-title">이벤트 타임라인</h3>
            <span className="muted" style={{fontSize: 12}}>최근 3주</span>
          </div>
          <table className="tbl" style={{borderRadius: 8, overflow: "hidden"}}>
            <thead>
              <tr>
                <th style={{width: 64}}>날짜</th>
                <th style={{width: 80}}>과목</th>
                <th>원 기록</th>
                <th>학생 지원 신호</th>
              </tr>
            </thead>
            <tbody>
              {data.events.map((ev, i) => (
                <tr key={i}>
                  <td className="num muted" style={{fontSize: 12}}>{ev.date}</td>
                  <td><span className="tag muted">{ev.subject}</span></td>
                  <td style={{fontSize: 12.5}}>{ev.record}</td>
                  <td>
                    <span className={"tag " + ev.tone}>{ev.signal}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 지원 이력 */}
        <div className="card" style={{width: 360, flexShrink: 0}}>
          <div className="card-head">
            <h3 className="card-title">지원 이력</h3>
            <span className="tag info">{data.supportHistory.length}건</span>
          </div>
          <div className="col" style={{gap: 12}}>
            {data.supportHistory.map((h, i) => (
              <div key={i} style={{borderLeft: "2px solid var(--border)", paddingLeft: 12}}>
                <div className="row" style={{justifyContent: "space-between"}}>
                  <span style={{fontSize: 12.5, fontWeight: 600}}>{h.kind}</span>
                  <span className="muted num" style={{fontSize: 11.5}}>{h.date}</span>
                </div>
                <div className="muted" style={{fontSize: 12, marginTop: 2}}>{h.who}</div>
                <div style={{fontSize: 12.5, marginTop: 6, lineHeight: 1.5}}>{h.note}</div>
              </div>
            ))}
          </div>
          <div className="divider"></div>
          <div className="muted" style={{fontSize: 11, marginBottom: 8, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase"}}>다음 조치</div>
          <div className="col" style={{gap: 8}}>
            <div className="row" style={{justifyContent: "space-between", padding: "10px 12px", background: "var(--bg-soft)", borderRadius: 8}}>
              <span style={{fontSize: 12.5}}>다음 확인일</span>
              <span style={{fontWeight: 700, fontSize: 13}} className="num">{data.nextCheck}</span>
            </div>
            <button className="btn" style={{justifyContent: "center"}}>다음 확인일 변경</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <span className="row" style={{gap: 6}}>
      <span style={{width: 10, height: 10, borderRadius: 999, background: color}}></span>
      {label}
    </span>
  );
}

function TrendChart({ trend }) {
  const w = 720, h = 220, padL = 36, padR = 12, padT = 16, padB = 30;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const weeks = trend.weeks;
  const series = [
    { name: "참여",   color: "var(--primary)",            values: trend.participation },
    { name: "제출",   color: "oklch(0.62 0.12 60)",       values: trend.submission },
    { name: "출결",   color: "oklch(0.58 0.10 155)",      values: trend.attendance },
    { name: "성취도", color: "oklch(0.55 0.16 295)",      values: trend.achievement },
  ];

  const xFor = (i) => padL + (i / (weeks.length - 1)) * innerW;
  const yFor = (v) => padT + (1 - v / 100) * innerH;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{width: "100%", height: "auto"}}>
      {/* y grid */}
      {[0, 25, 50, 75, 100].map((g, i) => (
        <g key={i}>
          <line x1={padL} y1={yFor(g)} x2={w - padR} y2={yFor(g)} stroke="var(--border)" strokeDasharray={g === 0 ? "" : "2 4"} />
          <text x={padL - 8} y={yFor(g) + 4} fontSize="10" fill="var(--muted)" textAnchor="end" fontVariantNumeric="tabular-nums">{g}</text>
        </g>
      ))}
      {/* x labels */}
      {weeks.map((wlbl, i) => (
        <text key={i} x={xFor(i)} y={h - 10} fontSize="11" fill="var(--muted)" textAnchor="middle">{wlbl}</text>
      ))}
      {/* lines */}
      {series.map((s, si) => {
        const path = s.values.map((v, i) => (i === 0 ? `M${xFor(i)},${yFor(v)}` : `L${xFor(i)},${yFor(v)}`)).join(" ");
        return (
          <g key={si}>
            <path d={path} fill="none" stroke={s.color} strokeWidth="2" />
            {s.values.map((v, i) => (
              <circle key={i} cx={xFor(i)} cy={yFor(v)} r={i === s.values.length - 1 ? 4 : 2.6} fill={s.color} stroke="white" strokeWidth="1.5" />
            ))}
            {/* last point label */}
            <text x={xFor(s.values.length - 1) + 8} y={yFor(s.values[s.values.length - 1]) + 4}
              fontSize="11" fill={s.color} fontWeight="700">{s.name}</text>
          </g>
        );
      })}
    </svg>
  );
}

window.StudentChart = StudentChart;
