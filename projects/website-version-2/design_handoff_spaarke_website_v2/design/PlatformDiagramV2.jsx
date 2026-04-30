// PlatformDiagramV2.jsx — Spaarke Legal IQ Platform → M365 Copilot
// A modern, dynamic riff on the rough concept: soft pill panel with wordmark + module icon grid,
// an animated connector beam, and the Copilot bloom mark with an M365 chip.
function PlatformDiagramV2() {
  const LIGHT = {
    bg: '#0a0a0a',
    surface: '#141414',
    fg: '#ffffff',
    fgMid: 'rgba(255,255,255,0.62)',
    fgLow: 'rgba(255,255,255,0.42)',
    line: 'rgba(255,255,255,0.10)',
    line2: 'rgba(255,255,255,0.18)',
    accent: '#000BFF',
    tileBg: 'rgba(255,255,255,0.04)'
  };

  // 8 module glyphs (drawn as inline SVGs so they scale + recolor cleanly)
  const stroke = LIGHT.fg;
  const MODULES = [
    { label: 'Email', glyph: (
      <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2"/>
        <path d="m3 7 9 6 9-6"/>
      </svg>
    )},
    { label: 'Matter', glyph: (
      <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="14" height="12" rx="2"/>
        <circle cx="14" cy="12" r="2"/>
        <path d="M19 9v6"/>
      </svg>
    )},
    { label: 'Calendar', glyph: (
      <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="16" rx="2"/>
        <path d="M3 10h18M8 3v4M16 3v4"/>
      </svg>
    )},
    { label: 'Workspace', glyph: (
      <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8h16v11H4z"/>
        <path d="M9 8V6a3 3 0 0 1 6 0v2"/>
      </svg>
    )},
    { label: 'Performance', glyph: (
      <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 12 16 8"/>
        <circle cx="12" cy="12" r="1.2" fill={stroke}/>
      </svg>
    )},
    { label: 'Tasks', glyph: (
      <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2"/>
        <path d="m8 12 3 3 5-6"/>
      </svg>
    )},
    { label: 'People', glyph: (
      <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="9" r="3"/>
        <path d="M3 19c0-3 3-5 6-5s6 2 6 5"/>
        <circle cx="17" cy="8" r="2.4"/>
        <path d="M15 19c0-2.4 2-4 4-4"/>
      </svg>
    )},
    { label: 'Document', glyph: (
      <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h9l4 4v14H6z"/>
        <path d="M14 3v5h5M9 13h7M9 17h5"/>
      </svg>
    )}
  ];

  return (
    <section style={{ background: LIGHT.bg, color: LIGHT.fg }}>
      <style>{`
        @keyframes spk-beam {
          0%   { transform: translateX(-30%); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateX(110%); opacity: 0; }
        }
        @keyframes spk-pulse {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50%      { transform: scale(1.08); opacity: 0.8; }
        }
        @keyframes spk-float-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .spk-icon-tile { animation: spk-float-in 600ms cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      <div className="v2-shell" style={{
        paddingTop: 'clamp(80px, 12vh, 140px)',
        paddingBottom: 'clamp(80px, 12vh, 140px)'
      }}>
        {/* Section heading */}
        <div style={{ textAlign: 'center', margin: '0 auto' }}>
          <h2 className="v2-h2" style={{
            color: LIGHT.fg
          }}>
            Introducing<br/><span style={{ whiteSpace: 'nowrap' }}>Legal Operations Intelligence</span>
          </h2>
          <p style={{
            marginTop: '20px',
            color: LIGHT.fgMid,
            fontSize: '17px', lineHeight: 1.55,
            maxWidth: '60ch',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Spaarke is the legal IQ layer that makes Copilot, your AI agents, and your existing systems fluent in legal work. Decisions, workflows, performance, partnership — not just drafting.
          </p>
        </div>

        {/* Diagram */}
        <div style={{
          marginTop: 'clamp(56px, 8vh, 96px)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.45fr) minmax(80px, 0.55fr) minmax(0, 0.7fr)',
          gap: 'clamp(12px, 2vw, 24px)',
          alignItems: 'center'
        }}>
          {/* LEFT — Spaarke platform pill */}
          <div style={{
            position: 'relative',
            background: LIGHT.surface,
            border: `1px solid ${LIGHT.line}`,
            borderRadius: '32px',
            overflow: 'hidden',
            boxShadow:
              '0 1px 0 rgba(255,255,255,0.04),' +
              '0 28px 56px -28px rgba(0,0,0,0.6),' +
              '0 0 0 1px rgba(255,255,255,0.04)'
          }}>
            {/* Soft accent halo behind the panel content */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 0,
              borderRadius: 'inherit',
              background:
                'radial-gradient(80% 60% at 20% 0%, rgba(0,11,255,0.20), transparent 60%),' +
                'radial-gradient(60% 50% at 100% 100%, rgba(0,11,255,0.14), transparent 60%)',
              pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative' }}>
              {/* App chrome bar — full-width header of the pill */}
              <div style={{
                display: 'flex', alignItems: 'center',
                gap: 'clamp(10px, 1.2vw, 16px)',
                background: '#1e1e1e',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                padding: '0 clamp(20px, 2.4vw, 32px)',
                height: '52px'
              }}>
                {/* App-launcher waffle */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="rgba(255,255,255,0.55)" style={{ flexShrink: 0 }}>
                  <rect x="0" y="0" width="3" height="3"/><rect x="5.5" y="0" width="3" height="3"/><rect x="11" y="0" width="3" height="3"/>
                  <rect x="0" y="5.5" width="3" height="3"/><rect x="5.5" y="5.5" width="3" height="3"/><rect x="11" y="5.5" width="3" height="3"/>
                  <rect x="0" y="11" width="3" height="3"/><rect x="5.5" y="11" width="3" height="3"/><rect x="11" y="11" width="3" height="3"/>
                </svg>
                {/* Spaarke wordmark */}
                <img
                  src="../brand/assets/logos/spaarke-logo-white.svg"
                  alt="Spaarke"
                  style={{ height: '20px', width: 'auto', flexShrink: 0 }}
                />
                {/* Workspace label */}
                <div style={{
                  fontFamily: 'var(--v2-body)', fontSize: '13px',
                  color: 'rgba(255,255,255,0.78)',
                  marginLeft: '8px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}>Corporate Counsel</div>
                {/* Search bar (flex-grow) */}
                <div style={{
                  flex: 1,
                  height: '26px',
                  background: '#2a2a2a',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '6px',
                  display: 'flex', alignItems: 'center',
                  padding: '0 10px',
                  gap: '8px',
                  minWidth: '60px'
                }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FF7A45" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="7"/>
                    <line x1="16" y1="16" x2="21" y2="21"/>
                  </svg>
                  <span style={{
                    fontFamily: 'var(--v2-body)', fontSize: '12px',
                    color: 'rgba(255,255,255,0.45)'
                  }}>Search</span>
                </div>
                {/* Right cluster: + bell gear, copilot chip, avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', lineHeight: 1 }}>+</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                    <path d="M10 21a2 2 0 0 0 4 0"/>
                  </svg>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  {/* Copilot mini chip */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: '#2a2a2a',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '6px',
                    padding: '4px 8px'
                  }}>
                    <img src="../brand/assets/substrate/copilot.svg" alt="" style={{ width: '12px', height: '12px' }} />
                    <span style={{ fontFamily: 'var(--v2-body)', fontSize: '11px', color: 'rgba(255,255,255,0.78)' }}>Copilot</span>
                  </div>
                  {/* Avatar dot */}
                  <div style={{
                    width: '20px', height: '20px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6b7280, #374151)',
                    border: '1px solid rgba(255,255,255,0.12)'
                  }} />
                </div>
              </div>

              {/* Module grid body */}
              <div style={{ padding: 'clamp(28px, 3.4vw, 44px)' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: 'clamp(10px, 1.2vw, 16px)'
              }}>
                {MODULES.map((m, i) => (
                  <div key={i} className="spk-icon-tile" style={{
                    animationDelay: `${i * 60}ms`,
                    background: LIGHT.tileBg,
                    border: `1px solid ${LIGHT.line}`,
                    borderRadius: '14px',
                    aspectRatio: '1 / 1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform 200ms cubic-bezier(0.16,1,0.3,1), border-color 200ms, box-shadow 200ms'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = LIGHT.line2;
                    e.currentTarget.style.boxShadow = '0 8px 18px -10px rgba(0,0,0,0.6)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = LIGHT.line;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  title={m.label}>
                    <div style={{ width: '46%', height: '46%' }}>{m.glyph}</div>
                  </div>
                ))}
              </div>
              </div>
            </div>
          </div>

          {/* CENTER — Animated beam connector */}
          <div style={{
            position: 'relative',
            height: '12px',
            display: 'flex', alignItems: 'center'
          }}>
            {/* Static rail */}
            <div style={{
              position: 'absolute', left: 0, right: 0, top: '50%',
              height: '2px',
              transform: 'translateY(-50%)',
              background: `linear-gradient(90deg, ${LIGHT.line2}, ${LIGHT.accent})`,
              borderRadius: '2px',
              opacity: 0.55
            }} />
            {/* Animated photon */}
            <div style={{
              position: 'absolute', left: 0, right: 0, top: '50%',
              transform: 'translateY(-50%)',
              height: '6px',
              overflow: 'hidden',
              borderRadius: '4px'
            }}>
              <div style={{
                width: '40%', height: '100%',
                background: `linear-gradient(90deg, transparent, ${LIGHT.accent}, transparent)`,
                filter: 'blur(0.5px)',
                animation: 'spk-beam 2.4s cubic-bezier(0.5,0,0.3,1) infinite'
              }} />
            </div>
            {/* Arrow tip */}
            <div aria-hidden="true" style={{
              position: 'absolute', right: '-2px', top: '50%',
              transform: 'translateY(-50%)',
              width: 0, height: 0,
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              borderLeft: `12px solid ${LIGHT.accent}`,
              opacity: 0.85
            }} />
          </div>

          {/* RIGHT — Official Copilot badge */}
          <div style={{
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            aspectRatio: '1 / 1'
          }}>
            {/* Pulsing colored halo behind the bloom */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: '-8%',
              borderRadius: '50%',
              background:
                'conic-gradient(from 200deg at 50% 50%, ' +
                'rgba(255,116,40,0.35), rgba(229,42,176,0.35), rgba(126,40,229,0.35), ' +
                'rgba(34,139,255,0.35), rgba(20,189,168,0.35), rgba(255,116,40,0.35))',
              filter: 'blur(36px)',
              animation: 'spk-pulse 4s ease-in-out infinite',
              pointerEvents: 'none'
            }} />
            <img
              src="../brand/assets/substrate/copilot-badge.svg"
              alt="Microsoft 365 Copilot"
              style={{
                position: 'relative',
                width: '59%', height: '59%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 18px 32px rgba(126,40,229,0.22))'
              }}
            />
          </div>
        </div>


      </div>
    </section>
  );
}
window.PlatformDiagramV2 = PlatformDiagramV2;
