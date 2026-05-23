// Screen 4: AI 상담 준비 화면

function CounselingPrep({ studentId, onOpenBoard }) {
  const data = LC.kimminsu;
  const student = LC.students.find((s) => s.id === data.id);
  const [copied, setCopied] = React.useState(null);
  const [record, setRecord] = React.useState({
    date: "2026.05.21",
    method: "개별 상담 (대면)",
    confirmed: "",
    difficulty: "",
    judgement: "",
    next: "관찰 1주 후 재면담",
    nextDate: "2026.05.28",
  });

  const copyQ = (q, i) => {
    navigator.clipboard?.writeText(q);
    setCopied(i);
    setTimeout(() => setCopied(null), 1600);
  };

  return (
    <div className="col" style={{gap: 18}}>
      <div className="crumbs">담임교사 <span className="sep">›</span> 상담 준비 <span className="sep">›</span> {data.name}</div>

      {/* 학생 정보 요약 */}
      <div className="card" style={{padding: "16px 20px"}}>
        <div className="row" style={{gap: 14}}>
          <Avatar student={student} />
          <div>
            <div style={{fontWeight: 700, fontSize: 16}}>{data.name} <span className="muted" style={{fontWeight: 500, fontSize: 13}}>· {data.cls}</span></div>
            <div className="row" style={{gap: 8, marginTop: 4}}>
              <StatusPill state={data.state}>{data.status}</StatusPill>
              <span className="muted" style={{fontSize: 12}}>다음 확인일 {data.nextCheck}</span>
            </div>
          </div>
          <div className="grow"></div>
          <div className="muted" style={{fontSize: 11.5, maxWidth: 280, textAlign: "right", lineHeight: 1.5}}>
            AI는 결론을 내리지 않습니다. 변화 흐름과 확인 질문을 정리합니다.
          </div>
        </div>
      </div>

      <div className="row" style={{gap: 18, alignItems: "flex-start"}}>
        {/* 왼쪽: AI 준비 자료 */}
        <div className="col grow" style={{gap: 14}}>
          {/* 변화 요약 */}
          <div className="ai-card">
            <div className="ai-label"><span className="ai-dot"></span>변화 요약</div>
            <div className="ai-body" style={{fontSize: 14}}>
              최근 여러 과목에서 과제 제출과 발표 참여가 함께 줄었습니다.
              특정 과목의 어려움인지, 전반적인 학습 리듬 변화인지 확인이 필요합니다.
            </div>
          </div>

          {/* 확인 필요 포인트 */}
          <div className="card">
            <div className="card-head">
              <h3 className="card-title">확인 필요 포인트</h3>
              <span className="muted" style={{fontSize: 12}}>가능성 — 확정 아님</span>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8}}>
              {data.checkPoints.map((p, i) => (
                <div key={i} className="row" style={{
                  gap: 10, padding: "10px 12px",
                  border: "1px solid var(--border)",
                  borderRadius: 8, background: "var(--surface)",
                  fontSize: 13,
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 999,
                    background: "var(--ai-bg)", color: "var(--ai-accent)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, flexShrink: 0,
                  }}>{i + 1}</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 추천 상담 질문 */}
          <div className="card">
            <div className="card-head">
              <h3 className="card-title">추천 상담 질문</h3>
              <span className="muted" style={{fontSize: 12}}>질문은 복사해서 수정할 수 있습니다.</span>
            </div>
            <div className="col" style={{gap: 8}}>
              {data.questions.map((q, i) => (
                <div key={i} className="row" style={{
                  gap: 12, padding: "12px 14px",
                  border: "1px solid var(--ai-border)",
                  background: "var(--ai-bg)",
                  borderRadius: 10,
                }}>
                  <span className="mono muted" style={{minWidth: 24, color: "var(--ai-accent)"}}>Q{i + 1}</span>
                  <span style={{flex: 1, fontSize: 13.5, lineHeight: 1.55}}>{q}</span>
                  <button className="btn sm ai" onClick={() => copyQ(q, i)}>
                    {copied === i ? "복사됨" : "복사"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 주의할 표현 */}
          <div className="card">
            <div className="card-head">
              <h3 className="card-title">주의할 표현</h3>
              <span className="muted" style={{fontSize: 12}}>상담 시 피하면 좋아요</span>
            </div>
            <div className="col" style={{gap: 10}}>
              {data.cautions.map((c, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10,
                  padding: "10px 12px",
                  background: "var(--bg-soft)",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  alignItems: "center",
                }}>
                  <div>
                    <div className="muted" style={{fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4}}>피하기</div>
                    <div style={{fontSize: 13, color: "var(--alert)", textDecoration: "line-through", textDecorationColor: "oklch(0.7 0.1 25 / 0.5)"}}>
                      "{c.avoid}"
                    </div>
                  </div>
                  <span style={{color: "var(--muted)"}}>→</span>
                  <div>
                    <div className="muted" style={{fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4}}>대신</div>
                    <div style={{fontSize: 13, color: "var(--positive)"}}>
                      "{c.instead}"
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽: 상담 기록 입력 */}
        <div className="card" style={{width: 380, flexShrink: 0, position: "sticky", top: 76}}>
          <div className="card-head">
            <h3 className="card-title">상담 기록 입력</h3>
            <span className="tag info">권한: 담임</span>
          </div>
          <div className="col" style={{gap: 12}}>
            <Field label="상담 날짜">
              <input className="input" style={{width: "100%"}} value={record.date} onChange={(e) => setRecord({...record, date: e.target.value})} />
            </Field>
            <Field label="상담 방식">
              <select className="select input" style={{width: "100%"}} value={record.method} onChange={(e) => setRecord({...record, method: e.target.value})}>
                <option>개별 상담 (대면)</option>
                <option>짧은 면담</option>
                <option>전화</option>
                <option>학부모 동반</option>
              </select>
            </Field>
            <Field label="확인된 내용">
              <textarea className="input" style={{width: "100%"}} placeholder="학생이 말한 어려움이나 확인된 사실을 적어주세요." value={record.confirmed} onChange={(e) => setRecord({...record, confirmed: e.target.value})} />
            </Field>
            <Field label="학생이 말한 어려움">
              <textarea className="input" style={{width: "100%"}} placeholder="가능하면 학생의 표현 그대로." value={record.difficulty} onChange={(e) => setRecord({...record, difficulty: e.target.value})} />
            </Field>
            <Field label="교사 판단">
              <textarea className="input" style={{width: "100%"}} placeholder="추측이 아니라 확인된 변화를 중심으로." value={record.judgement} onChange={(e) => setRecord({...record, judgement: e.target.value})} />
            </Field>
            <Field label="다음 조치">
              <select className="select input" style={{width: "100%"}} value={record.next} onChange={(e) => setRecord({...record, next: e.target.value})}>
                <option>관찰 1주 후 재면담</option>
                <option>관찰 2주 후 재면담</option>
                <option>상담교사 연결</option>
                <option>기초학력 담당 연결</option>
                <option>복지/돌봄 담당 연결</option>
                <option>지역자원 연계 검토</option>
              </select>
            </Field>
            <Field label="다음 확인일">
              <input className="input" style={{width: "100%"}} value={record.nextDate} onChange={(e) => setRecord({...record, nextDate: e.target.value})} />
            </Field>

            <div className="row" style={{gap: 8, marginTop: 4}}>
              <button className="btn grow">임시 저장</button>
              <button className="btn primary grow" onClick={() => onOpenBoard()}>저장하고 연결</button>
            </div>
            <div className="muted" style={{fontSize: 11, lineHeight: 1.5}}>
              상담 기록은 권한자에게만 보이며, 관리자/교육청 집계에는 원문이 노출되지 않습니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="col" style={{gap: 4}}>
      <div style={{fontSize: 11.5, fontWeight: 600, color: "var(--text-soft)", letterSpacing: "0.02em"}}>{label}</div>
      {children}
    </label>
  );
}

window.CounselingPrep = CounselingPrep;
