// Screen 6: 지역자원 추천 화면

function LocalResources({ onOpenBoard }) {
  const [scope, setScope] = React.useState("student"); // student | school
  const [types, setTypes] = React.useState(new Set(["상담", "학습", "복지", "돌봄", "활동", "진로"]));
  const [radius, setRadius] = React.useState(5);
  const [selected, setSelected] = React.useState(null);

  const toggleType = (t) => {
    setTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t); else next.add(t);
      return next;
    });
  };

  const resources = LC.resources.filter((r) => types.has(r.type) && r.distance <= radius);

  return (
    <div className="col" style={{gap: 18}}>
      <div className="page-head">
        <div>
          <div className="crumbs">담임/상담/복지 <span className="sep">›</span> 지역자원 추천</div>
          <h1 className="page-title">지역자원 추천</h1>
          <div className="page-sub">공공데이터 기반으로 학교 근처 지원 자원을 추천합니다. 자동 연결이 아닌 연계 후보입니다.</div>
        </div>
        <div className="row" style={{gap: 8}}>
          <div className="segmented">
            <button className={scope === "student" ? "active" : ""} onClick={() => setScope("student")}>학생 기준</button>
            <button className={scope === "school" ? "active" : ""} onClick={() => setScope("school")}>학교 기준</button>
          </div>
        </div>
      </div>

      {/* 필터 바 */}
      <div className="card" style={{padding: "12px 16px"}}>
        <div className="row" style={{gap: 14, flexWrap: "wrap"}}>
          <div className="row" style={{gap: 6}}>
            <span className="muted" style={{fontSize: 12, marginRight: 4}}>대상</span>
            <span className="tag info">김민수 · 2-3</span>
          </div>
          <div style={{height: 20, width: 1, background: "var(--border)"}}></div>
          <div className="row" style={{gap: 6}}>
            <span className="muted" style={{fontSize: 12, marginRight: 4}}>지원 유형</span>
            {["상담", "학습", "복지", "돌봄", "활동", "진로"].map((t) => {
              const on = types.has(t);
              return (
                <button key={t} onClick={() => toggleType(t)}
                  className={"tag " + (on ? "" : "muted")}
                  style={{
                    cursor: "pointer", fontWeight: 600,
                    background: on ? "var(--surface)" : "var(--bg-soft)",
                    color: on ? LC.resourceTypeColor[t] : "var(--muted)",
                    borderColor: on ? "currentColor" : "var(--border)",
                    opacity: on ? 1 : 0.6,
                  }}>
                  <span className="dot" style={{background: on ? "currentColor" : "var(--muted)"}}></span>
                  {t}
                </button>
              );
            })}
          </div>
          <div style={{height: 20, width: 1, background: "var(--border)"}}></div>
          <div className="row" style={{gap: 6}}>
            <span className="muted" style={{fontSize: 12, marginRight: 4}}>거리</span>
            <div className="segmented">
              {[1, 3, 5].map((r) => (
                <button key={r} className={radius === r ? "active" : ""} onClick={() => setRadius(r)}>{r}km</button>
              ))}
            </div>
          </div>
          <div className="grow"></div>
          <div className="muted" style={{fontSize: 11.5}}>추천 자원 <b style={{color: "var(--text)"}}>{resources.length}</b>개</div>
        </div>
      </div>

      <div className="row" style={{gap: 16, alignItems: "flex-start"}}>
        {/* 좌: 자원 카드 */}
        <div className="col" style={{flex: 1.1, gap: 10, minWidth: 0}}>
          {resources.map((r) => {
            const color = LC.resourceTypeColor[r.type];
            const sel = selected?.id === r.id;
            return (
              <div key={r.id} className="card"
                onClick={() => setSelected(r)}
                style={{
                  padding: 16, cursor: "pointer",
                  borderColor: sel ? color : "var(--border)",
                  boxShadow: sel ? "0 0 0 3px " + color + "20" : "none",
                }}>
                <div className="row" style={{justifyContent: "space-between", alignItems: "flex-start", gap: 12}}>
                  <div style={{flex: 1, minWidth: 0}}>
                    <div className="row" style={{gap: 8, marginBottom: 6}}>
                      <span className="tag" style={{background: "transparent", borderColor: color, color: color}}>
                        <span className="dot" style={{background: color}}></span>
                        {r.type} · {r.subtype}
                      </span>
                      <span className="muted" style={{fontSize: 11.5}}>거리 {r.distance}km</span>
                      <span className="muted" style={{fontSize: 11.5}}>운영 {r.hours}</span>
                    </div>
                    <div style={{fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em"}}>{r.name}</div>
                    <div className="row" style={{
                      gap: 8, marginTop: 8, padding: "8px 10px",
                      background: "var(--ai-bg)", borderRadius: 8, border: "1px solid var(--ai-border)",
                    }}>
                      <span className="ai-label" style={{margin: 0, fontSize: 10}}><span className="ai-dot"></span>추천 이유</span>
                      <span style={{fontSize: 12.5}}>{r.reason}</span>
                    </div>
                    <div className="muted" style={{fontSize: 11, marginTop: 8}}>
                      <span className="mono">데이터 출처: {r.source}</span>
                    </div>
                  </div>
                  <div className="col" style={{gap: 6, flexShrink: 0}}>
                    <button className="btn sm">상세</button>
                    <button className="btn sm primary" onClick={(e) => { e.stopPropagation(); onOpenBoard(); }}>연계 검토</button>
                  </div>
                </div>
              </div>
            );
          })}
          {resources.length === 0 && (
            <div className="card" style={{textAlign: "center", padding: 32, color: "var(--muted)"}}>
              필터에 맞는 자원이 없습니다.
            </div>
          )}
        </div>

        {/* 우: 지도 */}
        <div className="col" style={{width: 460, flexShrink: 0, gap: 12, position: "sticky", top: 76}}>
          <div className="card" style={{padding: 0, overflow: "hidden"}}>
            <div className="row" style={{padding: "12px 16px", justifyContent: "space-between", borderBottom: "1px solid var(--border)"}}>
              <span style={{fontWeight: 700, fontSize: 13}}>학교 주변 지도</span>
              <div className="row" style={{gap: 6}}>
                <span className="tag muted">반경 {radius}km</span>
              </div>
            </div>
            <ResourceMap resources={resources} selected={selected} onSelect={setSelected} radius={radius} />
            <div style={{padding: "10px 14px", borderTop: "1px solid var(--border)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6}}>
              {Object.entries(LC.resourceTypeColor).map(([t, color]) => (
                <div key={t} className="row" style={{gap: 6, fontSize: 11}}>
                  <span style={{width: 8, height: 8, borderRadius: 999, background: color}}></span>
                  <span className="muted">{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{padding: 14}}>
            <div className="row" style={{justifyContent: "space-between", marginBottom: 8}}>
              <span style={{fontWeight: 700, fontSize: 13}}>접근성 분석</span>
            </div>
            <div className="col" style={{gap: 6}}>
              <AccessRow label="1km 이내" count={LC.resources.filter(r => r.distance <= 1).length} max={3} />
              <AccessRow label="3km 이내" count={LC.resources.filter(r => r.distance <= 3).length} max={6} />
              <AccessRow label="5km 이내" count={LC.resources.filter(r => r.distance <= 5).length} max={8} />
            </div>
            <div className="muted" style={{fontSize: 11, marginTop: 10, lineHeight: 1.5}}>
              상담·돌봄 자원은 3km 이내 충분하지만, 진로 체험 자원은 5km 이상 거리에 분포해 있어요.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccessRow({ label, count, max }) {
  return (
    <div className="row" style={{gap: 10, fontSize: 12.5}}>
      <span style={{width: 64, color: "var(--muted)"}}>{label}</span>
      <div style={{flex: 1, height: 8, background: "var(--bg-soft)", borderRadius: 999, overflow: "hidden"}}>
        <div style={{height: "100%", width: `${(count / max) * 100}%`, background: "var(--primary)", borderRadius: 999}}></div>
      </div>
      <span className="num" style={{fontWeight: 700, minWidth: 32, textAlign: "right"}}>{count}개</span>
    </div>
  );
}

function ResourceMap({ resources, selected, onSelect, radius }) {
  // 학교 위치 = (50, 50). resources have x/y in 0..100 (percent)
  return (
    <div className="map" style={{height: 360}}>
      {/* simulated streets */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: "absolute", inset: 0, width: "100%", height: "100%"}}>
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="oklch(0.92 0.01 220)" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        {/* roads */}
        <path d="M 0 50 L 100 50" stroke="oklch(0.92 0.01 220)" strokeWidth="3" />
        <path d="M 50 0 L 50 100" stroke="oklch(0.92 0.01 220)" strokeWidth="3" />
        <path d="M 0 30 L 100 30" stroke="oklch(0.94 0.005 220)" strokeWidth="1.5" />
        <path d="M 0 70 L 100 70" stroke="oklch(0.94 0.005 220)" strokeWidth="1.5" />
        <path d="M 30 0 L 30 100" stroke="oklch(0.94 0.005 220)" strokeWidth="1.5" />
        <path d="M 70 0 L 70 100" stroke="oklch(0.94 0.005 220)" strokeWidth="1.5" />
        {/* radius rings */}
        {[5, 3, 1].map((r, i) => {
          const rPct = (r / 5) * 38;
          return (
            <circle key={r} cx="50" cy="50" r={rPct}
              fill="none"
              stroke={r === radius ? "var(--primary)" : "oklch(0.7 0.02 250)"}
              strokeOpacity={r === radius ? 0.45 : 0.18}
              strokeWidth={r === radius ? 0.6 : 0.4}
              strokeDasharray={r === radius ? "" : "1 1.5"}
            />
          );
        })}
      </svg>
      {/* school marker */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: "var(--primary)", color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, boxShadow: "var(--shadow)",
        }}>학교</div>
        <div style={{fontSize: 10, color: "var(--text)", background: "var(--surface)", padding: "1px 6px", borderRadius: 4, border: "1px solid var(--border)"}}>
          ○○중학교
        </div>
      </div>
      {/* resource pins */}
      {resources.map((r) => {
        const color = LC.resourceTypeColor[r.type];
        const sel = selected?.id === r.id;
        return (
          <button key={r.id}
            onClick={() => onSelect(r)}
            style={{
              position: "absolute", left: r.x + "%", top: r.y + "%",
              transform: "translate(-50%, -100%)",
              border: "none", background: "transparent", cursor: "pointer",
              padding: 0,
            }}>
            <div style={{
              width: sel ? 26 : 18, height: sel ? 26 : 18,
              borderRadius: "50% 50% 50% 0",
              transform: "rotate(-45deg)",
              background: color,
              border: "2px solid white",
              boxShadow: sel ? "0 4px 14px " + color + "60" : "0 2px 6px oklch(0.2 0.02 250 / 0.2)",
              transition: "all 0.15s",
            }}></div>
            {sel && (
              <div style={{
                position: "absolute", top: "100%", left: "50%",
                transform: "translateX(-50%)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 6, padding: "4px 8px",
                fontSize: 10.5, whiteSpace: "nowrap",
                marginTop: 4,
                boxShadow: "var(--shadow)",
              }}>
                {r.name}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

window.LocalResources = LocalResources;
