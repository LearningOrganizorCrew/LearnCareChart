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

const LC_REAL_SCHOOL = {
  name: "서울고등학교",
  type: "고등학교",
  found: "공립",
  addr: "서울특별시 서초구 효령로 197",
  lat: 37.4842931,
  lng: 127.0049019,
};

const LC_REAL_RESOURCE_COLORS = {
  "청소년": "oklch(0.55 0.16 295)",
  "유아": "oklch(0.55 0.12 230)",
  "다문화": "oklch(0.55 0.10 155)",
};

const LC_REAL_FACILITIES = [
  { id: "real-95", name: "서초6호점 우리동네키움센터", addr: "서울특별시 서초구 반포대로5길 14", kind: "우리동네키움센터", type: "청소년", subtype: "초등돌봄", lat: 37.48195, lng: 127.01087, distance: 0.59, hours: "방과후 운영", source: "공공데이터포털", reason: "학교와 가장 가까운 방과후 돌봄 자원" },
  { id: "real-317", name: "서초구 가족센터", addr: "서울특별시 서초구 방배로10길 10-20", kind: "건강가정지원센터", type: "청소년", subtype: "가족상담", lat: 37.4802969, lng: 126.999037, distance: 0.68, hours: "평일 운영", source: "공공데이터포털", reason: "가정 연계 상담과 사례관리 연결 가능" },
  { id: "real-814", name: "서초구 가족센터 영유아 지원", addr: "서울특별시 서초구 방배로10길 10-20", kind: "건강가정지원센터", type: "유아", subtype: "가족지원", lat: 37.4802969, lng: 126.999037, distance: 0.68, hours: "평일 운영", source: "공공데이터포털", reason: "형제자매 돌봄 이슈가 있는 가정 지원에 활용" },
  { id: "real-959", name: "서초구 가족센터 다문화 지원", addr: "서울특별시 서초구 방배로10길 10-20", kind: "건강가정지원센터", type: "다문화", subtype: "통합지원", lat: 37.4802969, lng: 126.999037, distance: 0.68, hours: "평일 운영", source: "공공데이터포털", reason: "다문화 가정 통역·상담 연계 가능" },
  { id: "real-298", name: "서초구 학교밖청소년지원센터", addr: "서울특별시 서초구 방배로 5길 11 2층", kind: "학교밖청소년지원센터", type: "청소년", subtype: "위기지원", lat: 37.478286, lng: 126.9990556, distance: 0.84, hours: "평일 운영", source: "공공데이터포털", reason: "출결·학교 적응 위험 신호 학생 상담 후보" },
  { id: "real-691", name: "큰사랑공부방", addr: "서울특별시 서초구 방배로13길 29", kind: "지역아동센터", type: "청소년", subtype: "학습지원", lat: 37.48256, lng: 126.99501, distance: 0.89, hours: "방과후 운영", source: "공공데이터포털", reason: "기초학습 보강과 방과후 돌봄 동시 연계" },
  { id: "real-92", name: "서초5호점 우리동네키움센터", addr: "서울특별시 서초구 서초대로24길 48", kind: "우리동네키움센터", type: "청소년", subtype: "초등돌봄", lat: 37.48536, lng: 126.99406, distance: 0.96, hours: "방과후 운영", source: "공공데이터포털", reason: "1km 이내 추가 돌봄 후보" },
  { id: "real-686", name: "구립 방배동 지역아동센터", addr: "서울특별시 서초구 서초대로 59", kind: "지역아동센터", type: "청소년", subtype: "복지·학습", lat: 37.4865, lng: 126.98881, distance: 1.44, hours: "방과후 운영", source: "공공데이터포털", reason: "정기 학습과 생활지원 연계 가능" },
  { id: "real-689", name: "여의칸지역아동센터", addr: "서울특별시 서초구 서초대로 53", kind: "지역아동센터", type: "청소년", subtype: "복지·학습", lat: 37.48635, lng: 126.98823, distance: 1.49, hours: "방과후 운영", source: "공공데이터포털", reason: "방배권역 지역아동센터 후보" },
  { id: "real-344", name: "하나복지지역아동센터", addr: "서울특별시 서초구 방배천로18길 20", kind: "지역아동센터", type: "청소년", subtype: "복지·학습", lat: 37.48262, lng: 126.98381, distance: 1.87, hours: "방과후 운영", source: "공공데이터포털", reason: "2km 내 학습·돌봄 연계 가능" },
  { id: "real-343", name: "서초지역아동센터", addr: "서울특별시 서초구 방배천로2안길 58", kind: "지역아동센터", type: "청소년", subtype: "복지·학습", lat: 37.47952, lng: 126.98413, distance: 1.91, hours: "방과후 운영", source: "공공데이터포털", reason: "방과후 보호와 학습 지원 후보" },
  { id: "real-750", name: "파란나라어린이집", addr: "서울특별시 서초구 서초대로1길 30", kind: "시간연장형, 휴일보육", type: "유아", subtype: "시간연장 보육", lat: 37.4892329, lng: 126.9836143, distance: 1.96, hours: "시간연장·휴일보육", source: "공공데이터포털", reason: "보호자 돌봄 공백 가정에 안내 가능" },
  { id: "real-134", name: "동작7호점 우리동네키움센터", addr: "서울특별시 동작구 동작대로29가길 30", kind: "우리동네키움센터", type: "청소년", subtype: "초등돌봄", lat: 37.4893088, lng: 126.981754, distance: 2.12, hours: "방과후 운영", source: "공공데이터포털", reason: "인접 권역 돌봄 대안" },
  { id: "real-787", name: "서초구 공동육아나눔터", addr: "서울시 서초구 사평대로 205 파미에스테이션 2층", kind: "공동육아나눔터", type: "유아", subtype: "공동육아", lat: 37.5044921, lng: 127.0078453, distance: 2.26, hours: "평일 운영", source: "공공데이터포털", reason: "가족 돌봄 네트워크 안내 가능" },
  { id: "real-489", name: "좋은친구들지역아동센터", addr: "서울특별시 동작구 동작대로13길 34", kind: "지역아동센터", type: "청소년", subtype: "복지·학습", lat: 37.48195, lng: 126.97806, distance: 2.38, hours: "방과후 운영", source: "공공데이터포털", reason: "3km 내 생활지원 자원 후보" },
  { id: "real-8", name: "동작18호점 우리동네키움센터", addr: "서울특별시 동작구 동작대로29길 63-26", kind: "우리동네키움센터", type: "청소년", subtype: "초등돌봄", lat: 37.48838, lng: 126.97758, distance: 2.45, hours: "방과후 운영", source: "공공데이터포털", reason: "사당권역 돌봄 자원" },
  { id: "real-307", name: "동작구건강가정지원센터", addr: "서울특별시 동작구 동작대로29길 63-26", kind: "건강가정지원센터", type: "청소년", subtype: "가족상담", lat: 37.4883866, lng: 126.9775464, distance: 2.46, hours: "평일 운영", source: "공공데이터포털", reason: "가정환경 이슈 상담 연계 가능" },
  { id: "real-687", name: "구립 우면동 지역아동센터", addr: "서울특별시 서초구 바우뫼로4길 6", kind: "지역아동센터", type: "청소년", subtype: "복지·학습", lat: 37.46942, lng: 127.02552, distance: 2.46, hours: "방과후 운영", source: "공공데이터포털", reason: "우면권역 학습·돌봄 자원" },
];

const LC_REAL_RESOURCE_TYPES = Object.keys(LC_REAL_RESOURCE_COLORS);

function lcResourceColor(type) {
  return LC_REAL_RESOURCE_COLORS[type] || "var(--primary)";
}

function lcMarkerIcon(color, label) {
  if (!window.L) return null;
  return L.divIcon({
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -24],
    html: `<div style="width:24px;height:24px;background:${color};border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,.24)"><span style="display:block;transform:rotate(45deg);font:700 9px/18px system-ui;color:white;text-align:center">${label || ""}</span></div>`,
  });
}

function EnhancedLocalResources({ onOpenBoard }) {
  const [scope, setScope] = React.useState("student");
  const [types, setTypes] = React.useState(() => new Set(LC_REAL_RESOURCE_TYPES));
  const [radius, setRadius] = React.useState(3);
  const [selected, setSelected] = React.useState(null);

  const toggleType = (type) => {
    setTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const resources = LC_REAL_FACILITIES.filter((resource) => {
    return resource.distance <= radius && types.has(resource.type);
  });

  const byType = LC_REAL_RESOURCE_TYPES.map((type) => ({
    type,
    count: resources.filter((resource) => resource.type === type).length,
  }));

  return (
    <div className="col" style={{gap: 18}}>
      <div className="page-head">
        <div>
          <div className="crumbs">담임/상담/복지 <span className="sep">›</span> 지역자원 추천</div>
          <h1 className="page-title">지역자원 추천</h1>
          <div className="page-sub">서울고등학교 주변 공공데이터 시설을 실제 지도 좌표로 확인하고, 반경과 분류 기준으로 연계 후보를 좁힙니다.</div>
        </div>
        <div className="row" style={{gap: 8}}>
          <div className="segmented">
            <button className={scope === "student" ? "active" : ""} onClick={() => setScope("student")}>학생 기준</button>
            <button className={scope === "school" ? "active" : ""} onClick={() => setScope("school")}>학교 기준</button>
          </div>
        </div>
      </div>

      <div className="card" style={{padding: "12px 16px"}}>
        <div className="row" style={{gap: 14, flexWrap: "wrap"}}>
          <div className="row" style={{gap: 6}}>
            <span className="muted" style={{fontSize: 12, marginRight: 4}}>기준 학교</span>
            <span className="tag info">{LC_REAL_SCHOOL.name}</span>
          </div>
          <div style={{height: 20, width: 1, background: "var(--border)"}}></div>
          <div className="row" style={{gap: 6}}>
            <span className="muted" style={{fontSize: 12, marginRight: 4}}>지원 유형</span>
            {LC_REAL_RESOURCE_TYPES.map((type) => {
              const on = types.has(type);
              const color = lcResourceColor(type);
              return (
                <button key={type} onClick={() => toggleType(type)}
                  className={"tag " + (on ? "" : "muted")}
                  style={{
                    cursor: "pointer",
                    fontWeight: 600,
                    background: on ? "var(--surface)" : "var(--bg-soft)",
                    color: on ? color : "var(--muted)",
                    borderColor: on ? color : "var(--border)",
                    opacity: on ? 1 : 0.6,
                  }}>
                  <span className="dot" style={{background: on ? color : "var(--muted)"}}></span>
                  {type}
                </button>
              );
            })}
          </div>
          <div style={{height: 20, width: 1, background: "var(--border)"}}></div>
          <div className="row" style={{gap: 6}}>
            <span className="muted" style={{fontSize: 12, marginRight: 4}}>거리</span>
            <div className="segmented">
              {[1, 3, 5].map((km) => (
                <button key={km} className={radius === km ? "active" : ""} onClick={() => setRadius(km)}>{km}km</button>
              ))}
            </div>
          </div>
          <div className="grow"></div>
          <div className="muted" style={{fontSize: 11.5}}>표시 자원 <b style={{color: "var(--text)"}}>{resources.length}</b>개</div>
        </div>
      </div>

      <div className="row" style={{gap: 16, alignItems: "flex-start"}}>
        <div className="col" style={{flex: 1.1, gap: 10, minWidth: 0}}>
          {resources.map((resource) => {
            const color = lcResourceColor(resource.type);
            const active = selected?.id === resource.id;
            return (
              <div key={resource.id} className="card"
                onClick={() => setSelected(resource)}
                style={{
                  padding: 16,
                  cursor: "pointer",
                  borderColor: active ? color : "var(--border)",
                  boxShadow: active ? "0 0 0 3px " + color + "20" : "none",
                }}>
                <div className="row" style={{justifyContent: "space-between", alignItems: "flex-start", gap: 12}}>
                  <div style={{flex: 1, minWidth: 0}}>
                    <div className="row" style={{gap: 8, marginBottom: 6, flexWrap: "wrap"}}>
                      <span className="tag" style={{background: "transparent", borderColor: color, color}}>
                        <span className="dot" style={{background: color}}></span>
                        {resource.type} · {resource.subtype}
                      </span>
                      <span className="muted" style={{fontSize: 11.5}}>거리 {resource.distance}km</span>
                      <span className="muted" style={{fontSize: 11.5}}>{resource.hours}</span>
                    </div>
                    <div style={{fontWeight: 700, fontSize: 15}}>{resource.name}</div>
                    <div className="muted" style={{fontSize: 12, marginTop: 5}}>{resource.addr}</div>
                    <div className="row" style={{
                      gap: 8, marginTop: 8, padding: "8px 10px",
                      background: "var(--ai-bg)", borderRadius: 8, border: "1px solid var(--ai-border)",
                    }}>
                      <span className="ai-label" style={{margin: 0, fontSize: 10}}><span className="ai-dot"></span>추천 이유</span>
                      <span style={{fontSize: 12.5}}>{resource.reason}</span>
                    </div>
                    <div className="muted" style={{fontSize: 11, marginTop: 8}}>
                      <span className="mono">데이터 출처: {resource.source}</span>
                    </div>
                  </div>
                  <div className="col" style={{gap: 6, flexShrink: 0}}>
                    <button className="btn sm" onClick={(event) => { event.stopPropagation(); setSelected(resource); }}>지도</button>
                    <button className="btn sm primary" onClick={(event) => { event.stopPropagation(); onOpenBoard(); }}>연계 검토</button>
                  </div>
                </div>
              </div>
            );
          })}
          {resources.length === 0 && (
            <div className="card" style={{textAlign: "center", padding: 32, color: "var(--muted)"}}>
              선택한 조건에 맞는 공공데이터 자원이 없습니다.
            </div>
          )}
        </div>

        <div className="col" style={{width: 480, flexShrink: 0, gap: 12, position: "sticky", top: 76}}>
          <div className="card" style={{padding: 0, overflow: "hidden"}}>
            <div className="row" style={{padding: "12px 16px", justifyContent: "space-between", borderBottom: "1px solid var(--border)"}}>
              <span style={{fontWeight: 700, fontSize: 13}}>학교 주변 실제 지도</span>
              <div className="row" style={{gap: 6}}>
                <span className="tag muted">반경 {radius}km</span>
              </div>
            </div>
            <ResourceMap resources={resources} selected={selected} onSelect={setSelected} radius={radius} />
            <div style={{padding: "10px 14px", borderTop: "1px solid var(--border)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6}}>
              {byType.map(({type, count}) => (
                <div key={type} className="row" style={{gap: 6, fontSize: 11}}>
                  <span style={{width: 8, height: 8, borderRadius: 999, background: lcResourceColor(type)}}></span>
                  <span className="muted">{type} {count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{padding: 14}}>
            <div className="row" style={{justifyContent: "space-between", marginBottom: 8}}>
              <span style={{fontWeight: 700, fontSize: 13}}>접근성 분석</span>
              <span className="muted" style={{fontSize: 11}}>기준: {LC_REAL_SCHOOL.addr}</span>
            </div>
            <div className="col" style={{gap: 6}}>
              <AccessRow label="1km 이내" count={LC_REAL_FACILITIES.filter(r => r.distance <= 1).length} max={8} />
              <AccessRow label="3km 이내" count={LC_REAL_FACILITIES.filter(r => r.distance <= 3).length} max={18} />
              <AccessRow label="5km 이내" count={LC_REAL_FACILITIES.filter(r => r.distance <= 5).length} max={18} />
            </div>
            <div className="muted" style={{fontSize: 11, marginTop: 10, lineHeight: 1.5}}>
              1km 안에는 돌봄·가족지원 자원이 집중되어 있고, 2km 이후부터 지역아동센터와 인접 권역 자원이 보강됩니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ResourceMap = function RealResourceMap({ resources, selected, onSelect, radius }) {
  const mapRef = React.useRef(null);
  const nodeRef = React.useRef(null);
  const layersRef = React.useRef({ markers: null, circle: null });

  React.useEffect(() => {
    if (!nodeRef.current || !window.L || mapRef.current) return;

    const map = L.map(nodeRef.current, {
      scrollWheelZoom: true,
      zoomControl: true,
    }).setView([LC_REAL_SCHOOL.lat, LC_REAL_SCHOOL.lng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const schoolIcon = lcMarkerIcon("var(--primary)", "S");
    L.marker([LC_REAL_SCHOOL.lat, LC_REAL_SCHOOL.lng], schoolIcon ? { icon: schoolIcon } : {})
      .addTo(map)
      .bindPopup(`<b>${LC_REAL_SCHOOL.name}</b><br />${LC_REAL_SCHOOL.addr}`);

    layersRef.current.markers = L.layerGroup().addTo(map);
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 150);

    return () => {
      map.remove();
      mapRef.current = null;
      layersRef.current = { markers: null, circle: null };
    };
  }, []);

  React.useEffect(() => {
    const map = mapRef.current;
    const markerLayer = layersRef.current.markers;
    if (!map || !markerLayer || !window.L) return;

    markerLayer.clearLayers();
    if (layersRef.current.circle) {
      map.removeLayer(layersRef.current.circle);
      layersRef.current.circle = null;
    }

    layersRef.current.circle = L.circle([LC_REAL_SCHOOL.lat, LC_REAL_SCHOOL.lng], {
      radius: radius * 1000,
      color: "var(--primary)",
      weight: 2,
      fillColor: "var(--primary)",
      fillOpacity: 0.06,
    }).addTo(map);

    const bounds = L.latLngBounds([[LC_REAL_SCHOOL.lat, LC_REAL_SCHOOL.lng]]);

    const coordSeen = {};
    resources.forEach((resource, index) => {
      const coordKey = `${resource.lat.toFixed(6)},${resource.lng.toFixed(6)}`;
      const dupIndex = coordSeen[coordKey] || 0;
      coordSeen[coordKey] = dupIndex + 1;
      let lat = resource.lat;
      let lng = resource.lng;
      if (dupIndex > 0) {
        const angle = dupIndex * 55 * Math.PI / 180;
        const offset = 0.000055 * Math.ceil(dupIndex / 8);
        lat += Math.sin(angle) * offset;
        lng += Math.cos(angle) * offset;
      }
      const markerColor = lcResourceColor(resource.type);
      const realIcon = lcMarkerIcon(markerColor, String(index + 1));
      const marker = L.marker([lat, lng], realIcon ? { icon: realIcon, title: resource.name } : { title: resource.name })
        .bindPopup(`<b>${resource.name}</b><br />${resource.type || ""} · ${resource.kind || resource.subtype || ""}<br />${resource.addr}<br />${resource.distance}km · ${resource.source}`);
      marker.on("click", () => onSelect(resource));
      markerLayer.addLayer(marker);
      bounds.extend([lat, lng]);
      if (selected && selected.id === resource.id) marker.openPopup();
    });

    if (resources.length > 0) {
      map.fitBounds(bounds.pad(0.25), { maxZoom: 14 });
    } else {
      map.setView([LC_REAL_SCHOOL.lat, LC_REAL_SCHOOL.lng], 13);
    }
  }, [resources, selected, onSelect, radius]);

  return (
    <div className="map real-map" style={{height: 360}}>
      {!window.L && (
        <div className="muted" style={{padding: 16, fontSize: 12}}>
          Loading map...
        </div>
      )}
      <div ref={nodeRef} style={{position: "absolute", inset: 0}} />
    </div>
  );
};

LocalResources = EnhancedLocalResources;
window.LocalResources = LocalResources;
