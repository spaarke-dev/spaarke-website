// GapStatsV2.jsx — Section 2
function GapStatsV2() {
  const STATS = [
    {
      v: '77%',
      l: 'of in-house teams face increasing workload',
      d: '— while business clients seek greater visibility and quicker turnaround',
      src: 'Axiom 2026 Global In-House Legal Study'
    },
    {
      v: '60%',
      l: 'lack outside counsel guidelines',
      d: '—and where they exist, 87% report enforcement is light',
      src: 'LegalBillReview / In-House Connect, 2025'
    },
    {
      v: '79%',
      l: 'are pressured to cut outside counsel spend',
      d: '—but 57% can\u2019t quantify the savings they achieve',
      src: 'LegalBillReview / In-House Connect, 2025'
    },
    {
      v: '1 in 5',
      l: 'legal departments has reached AI maturity',
      d: '— even as 75% have raised AI budgets and 66% are accelerating adoption.',
      src: 'Axiom 2025 Legal AI Report'
    }
  ];
  return (
    <section className="v2-shell" style={{ borderTop: '1px solid var(--v2-line)', paddingTop: 'clamp(48px, 6vh, 80px)', paddingBottom: 'clamp(80px, 12vh, 160px)' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.6fr)',
        gap: 'clamp(48px, 6vw, 96px)',
        alignItems: 'start'
      }}>
        <div>
          <h2 className="v2-h2">
            Demand is rising.<br/>Visibility isn&rsquo;t.
          </h2>
          <p style={{
            marginTop: '32px',
            fontFamily: 'var(--v2-display)',
            color: 'var(--v2-fg)',
            fontSize: '20px',
            fontWeight: 400,
            lineHeight: 1.6,
            letterSpacing: '-0.01em',
            maxWidth: '32ch'
          }}>
            Legal departments and their outside counsel are working harder than ever&mdash;and operating with less of the data they need to do it well.
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          rowGap: 'clamp(40px, 5vw, 64px)',
          columnGap: 'clamp(32px, 4vw, 56px)'
        }}>
          {STATS.map((s, i) => (
            <div key={i}>
              <div style={{
                fontFamily: 'var(--v2-display)',
                fontWeight: 500,
                fontSize: 'clamp(40px, 4.4vw, 60px)',
                lineHeight: 1.0,
                letterSpacing: '-0.025em',
                color: 'var(--v2-fg)'
              }}>{s.v}</div>
              <p style={{
                marginTop: '14px',
                fontFamily: 'var(--v2-display)',
                fontWeight: 500,
                fontSize: '17px',
                lineHeight: 1.35,
                color: 'var(--v2-fg)',
                letterSpacing: '-0.005em'
              }}>{s.l}</p>
              <p style={{
                marginTop: '8px',
                color: 'var(--v2-fg-mid)',
                fontSize: '14px',
                lineHeight: 1.45
              }}>{s.d}</p>
              {s.src && (
                <p style={{
                  marginTop: '12px',
                  fontFamily: 'var(--v2-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.04em',
                  color: 'var(--v2-fg-low)',
                  fontStyle: 'italic'
                }}>{s.src}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
window.GapStatsV2 = GapStatsV2;
