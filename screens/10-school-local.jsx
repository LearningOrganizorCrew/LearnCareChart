// Screen 10: 학교 관리자 — 우리 학교 자원 활용 (확장)
// LocalResources(담임용)와 다르게, 우리 학교가 매칭한 자원들과 가용성, 부족한 자원군을 추적한다.

function SchoolLocalResources() {
  const [selectedId, setSelectedId] = React.useState(LC.schoolResources[0].id);
  const [filter, setFilter] = React.useState("전체");
  const cats = ["전체", "상담", "학습지원", "복지", "돌봄", "활동"];
  const list = LC.schoolResources.filter((r) => filter === "전체" || r.category === filter);
  const selected = LC.schoolResources.find((r) => r.id === selectedId) || list[0];

  return (
    <div className="col" style={{gap: 18}}>
      <div className="page-head">
        <div>
          <div className="crumbs">학교 관리자 <span className="sep">›</span> {LC.schoolAdmin.schoolName} <span className="sep">›</span> 우리 학교 자원 활용</div>
          <h1 className="page-title">우리 학교 자원 활용</h1>
          <div className="page-sub">현재 매칭 중인 외부 기관·자원의 가용성과 부족 영역을 봅니다.</div>
        </div>
        <div className="row" style={{gap: 8}}>
          <button className="btn">{Icons.Plus}자원 등록 요청</button>
          <button className="btn">{Icons.Folder}월간 리포트</button>
        </div>
      </div>

      {/* KPI */}
      <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12}}>
        <div className="kpi info">
          <div className="label">연결 중인 자원</div>
          <div className="value">{LC.schoolResources.length}</div>
          <div className="meta">5개 카테고리</div>
        </div>
        <div className="kpi positive">
          <div className="label">매칭된 학생</div>
          <div className="value">{LC.schoolResources.reduce((a, r) => a + r.matched, 0)}</div>
          <div className="meta">정원 {LC.schoolResources.reduce((a, r) => a + r.capacity, 0)}명 중</div>
        </div>
        <div className="kpi attention">
          <div className="label">대기 중</div>
          <div className="value">{LC.schoolResources.filter((r) => r.wait !== "—").length}</div>
          <div className="meta">평균 대기 1.4주</div>
        </div>
        <div className="kpi alert">
          <div className="label">부족 자원군</div>
          <div className="value">{LC.schoolResourceGaps.length}</div>
          <div className="meta">교육청 보고 대상</div>
        </div>
      </div>

      <div className="row" style={{gap: 14, alignItems: "flex-start"}}>
        {/* 좌측 — 자원 리스트 */}
        <div className="card" style={{flex: 1, minWidth: 0}}>
          <div className="row" style={{justifyContent: "space-between", marginBottom: 12}}>
            <h3 className="card-title">연결된 자원</h3>
            <div className="row" style={{gap: 4}}>
              {cats.map((c) => (
                <button key={c} className={"btn sm" + (filter === c ? " primary" : "")} onClick={() => setFilter(c)} style={{padding: "3px 9px", fontSize: 11.5}}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="col" style={{gap: 8}}>
            {list.map((r) => {
              const util = r.matched / r.capacity;
              const tone = util >= 0.9 ? "alert" : util >= 0.7 ? "attention" : "positive";
              const c = tone === "alert" ? "var(--alert)" : tone === "attention" ? "var(--attention)" : "var(--positive)";
              const active = r.id === selectedId;
              return (
                <button key={r.id} onClick={() => setSelectedId(r.id)} style={{
                  width: "100%", textAlign: "left", padding: "12px 14px",
                  background: active ? "var(--primary-soft)" : "var(--surface)",
                  border: "1px solid " + (active ? "var(--primary-soft-border)" : "var(--border)"),
                  borderRadius: 10, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 14,
                }}>
                  <div style={{flex: 1, minWidth: 0}}>
                    <div className="row" style={{gap: 8, marginBottom: 4}}>
                      <span style={{fontSize: 13.5, fontWeight: 700, letterSpacing: "-0.01em"}}>{r.name}</span>
                      <span className="tag muted" style={{fontSize: 10.5}}>{r.category}</span>
                      {r.wait !== "—" && <span className="tag attention" style={{fontSize: 10.5}}>대기 {r.wait}</span>}
                    </div>
                    <div className="muted" style={{fontSize: 11.5}}>거리 {r.distance} · 평점 ★ {r.quality.toFixed(1)} · 활성 케이스 {r.activeCases.length}건</div>
                  </div>
                  <div style={{width: 140, flexShrink: 0}}>
                    <div className="row" style={{justifyContent: "space-between", marginBottom: 4}}>
                      <span style={{fontSize: 12.5, fontWeight: 700, color: c, fontVariantNumeric: "tabular-nums"}}>{r.matched}<span style={{color: "var(--muted)", fontWeight: 500}}>/{r.capacity}</span></span>
                      <span style={{fontSize: 11, color: "var(--muted)", fontVariantNumeric: "tabular-nums"}}>{Math.round(util * 100)}%</span>
                    </div>
                    <div style={{height: 5, background: "var(--bg-soft)", borderRadius: 999, overflow: "hidden"}}>
                      <div style={{width: util * 100 + "%", height: "100%", background: c, borderRadius: 999}}></div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="divider"></div>
          <div className="row" style={{justifyContent: "space-between", marginBottom: 10}}>
            <h3 className="card-title">부족한 자원군</h3>
            <span className="muted" style={{fontSize: 12}}>교육청 자원 확충 요청 대상</span>
          </div>
          <div className="col" style={{gap: 8}}>
            {LC.schoolResourceGaps.map((g) => (
              <div key={g.category} style={{
                padding: "12px 14px", border: "1px solid var(--alert-border)", background: "var(--alert-bg)",
                borderRadius: 10, display: "flex", alignItems: "center", gap: 14,
              }}>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontSize: 13.5, fontWeight: 700, color: "var(--alert)"}}>{g.category}</div>
                  <div style={{fontSize: 11.5, marginTop: 2, color: "var(--text-soft)"}}>{g.need}</div>
                </div>
                <div style={{textAlign: "right"}}>
                  <div style={{fontSize: 11, color: "var(--muted)"}}>가용 / 수요</div>
                  <div style={{fontSize: 15, fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>
                    <span style={{color: "var(--alert)"}}>{g.available}</span>
                    <span className="muted" style={{fontWeight: 500}}> / {g.demand}</span>
                  </div>
                </div>
                <button className="btn sm">교육청 요청</button>
              </div>
            ))}
          </div>
        </div>

        {/* 우측 — 선택한 자원 상세 */}
        <div className="card" style={{width: 360, flexShrink: 0}}>
          {selected && (
            <>
              <div className="card-head">
                <div>
                  <h3 className="card-title">{selected.name}</h3>
                  <div className="muted" style={{fontSize: 11.5, marginTop: 2}}>{selected.category} · {selected.distance}</div>
                </div>
                <button className="btn sm">상세 보기</button>
              </div>
              <div className="col" style={{gap: 12}}>
                <div className="row" style={{gap: 10}}>
                  <ResourceMetric label="평점" value={"★ " + selected.quality.toFixed(1)} />
                  <ResourceMetric label="대기" value={selected.wait} />
                  <ResourceMetric label="활성" value={selected.activeCases.length + "건"} />
                </div>
                <div style={{fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.04em", textTransform: "uppercase"}}>
                  활성 케이스
                </div>
                {selected.activeCases.length === 0 && <div className="muted" style={{fontSize: 12}}>현재 매칭된 학생이 없습니다.</div>}
                {selected.activeCases.map((c, i) => (
                  <div key={i} className="row" style={{
                    padding: "8px 12px", border: "1px solid var(--border)", borderRadius: 8,
                  }}>
                    <span className="mono" style={{fontSize: 12, fontWeight: 700}}>{c.code}</span>
                    <div className="grow"></div>
                    <span className="muted" style={{fontSize: 11.5}}>{c.since}</span>
                    <span className="tag muted" style={{fontSize: 10.5, marginLeft: 6}}>{c.status}</span>
                  </div>
                ))}
                <div className="divider"></div>
                <div className="ai-card" style={{padding: "10px 12px"}}>
                  <div className="ai-label"><span className="ai-dot"></span>운영 메모</div>
                  <div className="ai-body" style={{fontSize: 12.5, lineHeight: 1.55}}>
                    {selected.note}
                  </div>
                </div>
                <div className="row" style={{gap: 6}}>
                  <button className="btn" style={{flex: 1}}>연락처 보기</button>
                  <button className="btn primary" style={{flex: 1}}>매칭 요청</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ResourceMetric({ label, value }) {
  return (
    <div style={{flex: 1, padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 8, background: "var(--surface-2)"}}>
      <div style={{fontSize: 10.5, color: "var(--muted)", fontWeight: 600}}>{label}</div>
      <div style={{fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums", marginTop: 2, letterSpacing: "-0.01em"}}>{value}</div>
    </div>
  );
}

window.SchoolLocalResources = SchoolLocalResources;
