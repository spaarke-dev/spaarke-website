// ModuleGridV2.jsx — Section 4 (zigzag, sticky horizontal header, refined frames)
function ModuleGridV2() {
  const LIGHT = {
    bg: '#f6f6f4',
    surface: '#ffffff',
    fg: '#0a0a0a',
    fgMid: 'rgba(10,10,10,0.62)',
    fgLow: 'rgba(10,10,10,0.42)',
    line: 'rgba(10,10,10,0.10)',
    line2: 'rgba(10,10,10,0.16)'
  };

  const MODULES = [
    {
      name: 'Operations',
      body: 'Matters, projects, tasks, and people — the operational backbone for the legal team and the work they own.',
      bullets: ['Daily briefing', 'Smart to-dos', 'Performance tracking'],
      img: '../brand/assets/modules/workspace-v2.png'
    },
    {
      name: 'Documents & Knowledge',
      body: 'Every document, email, and contract — connected, searchable, and AI-aware. Built on SharePoint Embedded with Azure AI semantic search and Find Similar.',
      bullets: ['Matter-aware search', 'SharePoint-native', 'Privilege-safe AI'],
      img: '../brand/assets/modules/document-intelligence.png'
    },
    {
      name: 'Collaboration',
      body: 'Secure shared workspaces for outside counsel, business clients, and anyone working a matter — without sending another email attachment.',
      bullets: ['Shared matters', 'Tasks & invoices', 'Cross-firm access'],
      img: '../brand/assets/modules/outside-counsel.png'
    },
    {
      name: 'Agents & Automation',
      body: 'AI agents, automated workflows, and event-driven rules — the operational intelligence that runs in the background and shows up in Copilot.',
      bullets: ['Copilot-native', 'Azure AI Foundry', 'Context-aware'],
      img: '../brand/assets/modules/ai-workflows.png'
    },
    {
      name: 'Spend & Performance',
      body: 'Invoices, budgets, OCG compliance, and matter outcomes — the financial and operational truth about every matter and every firm.',
      bullets: ['OCG compliance', 'Spend signals', 'Cross-firm view'],
      img: '../brand/assets/modules/performance-intelligence.png'
    }
  ];

  const PILLARS = [
    {
      title: 'One platform for the work,\nthe data, and the AI.',
      body: 'Matters, projects, documents, spend, and AI — connected on one Microsoft 365-native foundation that serves the business, the legal team, and the firms they work with. Replace four point solutions with one system that knows what a matter is.',
      tail: 'No more bolt-ons. No more parallel logins. No more which tool was that in again?'
    },
    {
      title: 'All sides of the engagement,\nfinally aligned.',
      body: 'Business clients, in-house counsel, and outside counsel — working in shared, secure spaces where the matter, the documents, the tasks, and the outcomes live in one record. Ethical walls and matter-level permissions enforced throughout.',
      tail: 'Partnership replaces reconciliation. The business gets answers. The team gets visibility. The firms get clarity.'
    },
    {
      title: 'Every matter, every project,\nevery detail.',
      body: 'The full scope of legal work — matters, projects, documents, emails, invoices, deadlines, outcomes — connected, findable, governable. Nothing slips between systems because nothing lives outside the system.',
      tail: 'The work itself is the record. Visibility and governance built in, not bolted on.'
    }
  ];

  const SUBSTRATE_PILLS = [
    { label: 'Power Platform',   img: '../brand/assets/substrate/power-platform.svg' },
    { label: 'SharePoint',       img: '../brand/assets/substrate/sharepoint.png' },
    { label: 'Microsoft 365',    img: '../brand/assets/substrate/m365-apps.png' },
    { label: 'Teams',            img: '../brand/assets/substrate/teams.png' },
    { label: 'M365 Copilot',     img: '../brand/assets/substrate/copilot.svg' },
    { label: 'Azure AI Foundry', img: '../brand/assets/substrate/azure.png' }
  ];

  const rowRefs = React.useRef([]);
  const imageRefs = React.useRef([]);

  // Subtle vertical parallax on screenshots
  React.useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const vh = window.innerHeight;
        rowRefs.current.forEach((row, i) => {
          if (!row) return;
          const rect = row.getBoundingClientRect();
          const total = rect.height + vh;
          const progress = (vh - rect.top) / total;
          const offset = (progress - 0.5) * 48;
          const img = imageRefs.current[i];
          if (img) img.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        });
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section style={{ background: LIGHT.bg, color: LIGHT.fg, position: 'relative' }}>
      <style>{`
        .mg-img-wrap { will-change: transform; transition: transform 80ms linear; }
        .mg-sticky-header {
          position: sticky;
          top: 0;
          z-index: 5;
          background: ${LIGHT.bg};
          padding-top: clamp(48px, 7vh, 88px);
          padding-bottom: clamp(40px, 6vh, 64px);
        }
      `}</style>

      {/* Sticky-scope wrapper — anchor releases when this div ends (after the last row) */}
      <div style={{ paddingTop: 'clamp(40px, 6vh, 80px)' }}>
        {/* Sticky horizontal section header */}
        <div className="mg-sticky-header">
          <div className="v2-shell" style={{ textAlign: 'center' }}>
            <h2 style={{
              fontFamily: 'var(--v2-display)', fontWeight: 600,
              fontSize: 'clamp(36px, 4vw, 60px)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: LIGHT.fg,
              margin: 0
            }}>
              One platform. All sides. Every matter.
            </h2>
          </div>
        </div>

        <div className="v2-shell">
          {/* Pillar cards (formerly Section 3) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 'clamp(20px, 2.4vw, 32px)'
          }}>
            {PILLARS.map((p, i) => (
              <div key={i} style={{
                background: LIGHT.surface,
                border: `1px solid ${LIGHT.line}`,
                borderRadius: 'var(--v2-radius-lg)',
                padding: 'clamp(28px, 3vw, 40px)',
                boxShadow: '0 1px 0 rgba(10,10,10,0.02), 0 14px 32px -18px rgba(10,10,10,0.18)',
                transition: 'box-shadow 200ms cubic-bezier(0.16,1,0.3,1), border-color 200ms, transform 200ms',
                display: 'flex', flexDirection: 'column'
              }}
              onMouseOver={e => {
                e.currentTarget.style.boxShadow = '0 1px 0 rgba(10,10,10,0.02), 0 28px 56px -22px rgba(10,10,10,0.22)';
                e.currentTarget.style.borderColor = LIGHT.line2;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.boxShadow = '0 1px 0 rgba(10,10,10,0.02), 0 14px 32px -18px rgba(10,10,10,0.18)';
                e.currentTarget.style.borderColor = LIGHT.line;
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <h3 style={{
                  fontFamily: 'var(--v2-display)', fontWeight: 600,
                  fontSize: 'clamp(22px, 1.8vw, 28px)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.01em',
                  color: LIGHT.fg,
                  margin: 0,
                  whiteSpace: 'pre-line'
                }}>{p.title}</h3>
                <p style={{
                  marginTop: '20px',
                  color: LIGHT.fgMid,
                  fontSize: '15px', lineHeight: 1.6
                }}>{p.body}</p>
                <hr style={{
                  margin: '28px 0 20px',
                  border: 0,
                  borderTop: `1px solid ${LIGHT.line}`
                }} />
                <p style={{
                  color: LIGHT.fgMid,
                  fontSize: '14px', lineHeight: 1.55
                }}>{p.tail}</p>
              </div>
            ))}
          </div>

          {/* Zigzag rows */}
          <div style={{
            marginTop: 'clamp(96px, 14vh, 180px)',
            display: 'flex', flexDirection: 'column',
            gap: 'clamp(96px, 14vh, 180px)'
          }}>
            {MODULES.map((m, i) => {
              const imageRight = i % 2 === 0;
              const Copy = (
                <div style={{ alignSelf: 'start' }}>
                  <h3 style={{
                    fontFamily: 'var(--v2-display)',
                    fontWeight: 600,
                    fontSize: 'clamp(28px, 2.6vw, 40px)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    color: LIGHT.fg,
                    margin: 0
                  }}>{m.name}</h3>
                  <p style={{
                    marginTop: '24px',
                    color: LIGHT.fgMid,
                    fontSize: '17px', lineHeight: 1.6,
                    maxWidth: '38ch'
                  }}>{m.body}</p>
                  <div style={{
                    marginTop: '28px',
                    fontFamily: 'var(--v2-mono)',
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: LIGHT.fgLow
                  }}>Key features</div>
                  <ul style={{
                    listStyle: 'none', padding: 0, marginTop: '12px',
                    display: 'flex', flexDirection: 'column', gap: '10px',
                    fontFamily: 'var(--v2-body)',
                    fontSize: '15px', fontWeight: 500, color: LIGHT.fg
                  }}>
                    {m.bullets.map((b, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span aria-hidden="true" style={{
                          width: '5px', height: '5px',
                          borderRadius: '50%',
                          background: LIGHT.fg, flexShrink: 0
                        }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              );

              const Screenshot = (
                <div style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#0a0a0a',
                  aspectRatio: '16 / 10',
                  boxShadow:
                    '0 0 0 1px rgba(10,10,10,0.06),' +
                    '0 24px 48px -28px rgba(10,10,10,0.22),' +
                    '0 8px 18px -12px rgba(10,10,10,0.10)',
                  display: 'flex', flexDirection: 'column'
                }}>
                  <ChromeBar workspaceLabel="Corporate Counsel" />
                  <div style={{
                    flex: 1,
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <img
                      ref={el => imageRefs.current[i] = el}
                      className="mg-img-wrap"
                      src={m.img}
                      alt={m.name}
                      style={{
                        display: 'block',
                        width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: 'top center'
                      }}
                    />
                  </div>
                </div>
              );

              return (
                <article
                  key={i}
                  ref={el => rowRefs.current[i] = el}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)',
                    gap: 'clamp(32px, 5vw, 80px)',
                    alignItems: 'start'
                  }}
                >
                  {imageRight ? (
                    <React.Fragment>{Copy}{Screenshot}</React.Fragment>
                  ) : (
                    <React.Fragment>{Screenshot}{Copy}</React.Fragment>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {/* Substrate panel — outside the sticky scope, so the header releases here */}
      <div className="v2-shell" style={{ paddingBottom: 'clamp(80px, 12vh, 160px)' }}>
        <div style={{
          marginTop: 'clamp(96px, 12vh, 160px)',
          background: LIGHT.surface,
          border: `1px solid ${LIGHT.line}`,
          borderRadius: 'var(--v2-radius-lg)',
          padding: 'clamp(32px, 4vw, 56px)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          gap: 'clamp(32px, 5vw, 80px)',
          alignItems: 'center'
        }}>
          <div>
            <p style={{
              fontFamily: 'var(--v2-mono)', fontSize: '11px',
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: LIGHT.fgLow, margin: 0
            }}>Built on Microsoft</p>
            <h3 style={{
              fontFamily: 'var(--v2-display)', fontWeight: 600,
              marginTop: '16px',
              fontSize: 'clamp(22px, 1.8vw, 28px)',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
              color: LIGHT.fg
            }}>Microsoft, end to end.</h3>
            <p style={{
              marginTop: '16px',
              color: LIGHT.fgMid,
              fontSize: '15px', lineHeight: 1.6
            }}>
              Spaarke runs natively on the Microsoft tools your team already uses, inside the security perimeter your IT team already approved. No new identity, no parallel governance.
            </p>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '14px',
            flexWrap: 'wrap'
          }}>
            {SUBSTRATE_PILLS.map((p, i) => (
              <div key={i} title={p.label} style={{
                width: '52px', height: '52px',
                borderRadius: '12px',
                border: `1px solid ${LIGHT.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: LIGHT.surface,
                boxShadow: '0 1px 0 rgba(10,10,10,0.02), 0 6px 14px -8px rgba(10,10,10,0.16)'
              }}>
                <img
                  src={p.img}
                  alt={p.label}
                  style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
window.ModuleGridV2 = ModuleGridV2;

// Reusable Spaarke chrome bar (mirrors PlatformDiagramV2)
function ChromeBar({ workspaceLabel }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      gap: 'clamp(8px, 1vw, 14px)',
      background: '#1e1e1e',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      padding: '0 clamp(14px, 1.6vw, 20px)',
      height: '40px',
      flexShrink: 0
    }}>
      {/* App-launcher waffle */}
      <svg width="12" height="12" viewBox="0 0 14 14" fill="rgba(255,255,255,0.55)" style={{ flexShrink: 0 }}>
        <rect x="0" y="0" width="3" height="3"/><rect x="5.5" y="0" width="3" height="3"/><rect x="11" y="0" width="3" height="3"/>
        <rect x="0" y="5.5" width="3" height="3"/><rect x="5.5" y="5.5" width="3" height="3"/><rect x="11" y="5.5" width="3" height="3"/>
        <rect x="0" y="11" width="3" height="3"/><rect x="5.5" y="11" width="3" height="3"/><rect x="11" y="11" width="3" height="3"/>
      </svg>
      {/* Spaarke wordmark */}
      <img
        src="../brand/assets/logos/spaarke-logo-white.svg"
        alt="Spaarke"
        style={{ height: '16px', width: 'auto', flexShrink: 0 }}
      />
      {/* Workspace label */}
      <div style={{
        fontFamily: 'var(--v2-body)', fontSize: '12px',
        color: 'rgba(255,255,255,0.78)',
        marginLeft: '6px',
        whiteSpace: 'nowrap',
        flexShrink: 0
      }}>{workspaceLabel}</div>
      {/* Search bar (flex-grow) */}
      <div style={{
        flex: 1,
        height: '22px',
        background: '#2a2a2a',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '5px',
        display: 'flex', alignItems: 'center',
        padding: '0 8px',
        gap: '6px',
        minWidth: '40px'
      }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FF7A45" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7"/>
          <line x1="16" y1="16" x2="21" y2="21"/>
        </svg>
        <span style={{
          fontFamily: 'var(--v2-body)', fontSize: '11px',
          color: 'rgba(255,255,255,0.45)'
        }}>Search</span>
      </div>
      {/* Right cluster */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', lineHeight: 1 }}>+</span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
          <path d="M10 21a2 2 0 0 0 4 0"/>
        </svg>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        {/* Copilot mini chip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          background: '#2a2a2a',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '5px',
          padding: '3px 7px'
        }}>
          <img src="../brand/assets/substrate/copilot.svg" alt="" style={{ width: '10px', height: '10px' }} />
          <span style={{ fontFamily: 'var(--v2-body)', fontSize: '10px', color: 'rgba(255,255,255,0.78)' }}>Copilot</span>
        </div>
        {/* Avatar dot */}
        <div style={{
          width: '17px', height: '17px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6b7280, #374151)',
          border: '1px solid rgba(255,255,255,0.12)'
        }} />
      </div>
    </div>
  );
}
