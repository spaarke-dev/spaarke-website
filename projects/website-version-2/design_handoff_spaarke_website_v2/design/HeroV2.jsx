// HeroV2.jsx — Section 1
function HeroV2() {
  return (
    <section className="v2-shell" style={{
      paddingTop: 'clamp(80px, 14vh, 180px)',
      paddingBottom: 'clamp(40px, 6vh, 80px)',
      textAlign: 'center'
    }}>
      <h1 className="v2-h1" style={{ maxWidth: '18ch', margin: '0 auto' }}>
        See all sides of<br/>every&nbsp;matter.
      </h1>
      <p className="v2-lede" style={{ marginTop: '28px', maxWidth: 'none', whiteSpace: 'nowrap', marginLeft: 'auto', marginRight: 'auto' }}>
        The shared system of record for legal departments, business stakeholders, and outside counsel.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '40px' }}>
        <a href="#" className="v2-btn v2-btn-outline">
          <span style={{ display: 'inline-flex', width: '14px', height: '14px', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><path d="M0 0L10 6L0 12V0Z" fill="currentColor"/></svg>
          </span>
          Watch demo
        </a>
        <a href="#" className="v2-btn v2-btn-primary">Get access</a>
      </div>

      <div style={{
        position: 'relative',
        marginTop: '120px',
        marginLeft: 'calc(50% - 50vw)',
        width: '100vw',
        overflow: 'hidden',
        borderBottom: '1px solid var(--v2-line)',
        paddingTop: '40px',
        paddingBottom: '120px'
      }}>
        <div style={{
          position: 'relative',
          maxWidth: '1400px',
          margin: '0 auto',
          paddingLeft: 'var(--v2-pad-x)',
          paddingRight: 'var(--v2-pad-x)'
        }}>
          {/* Linear-style glow — single PNG background, wider than screenshot, centered */}
          <div aria-hidden="true" style={{
            position: 'absolute',
            left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '200%', height: '180%',
            backgroundImage: 'url(../brand/assets/hero/hero-glow-bg.png)',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            mixBlendMode: 'screen',
            opacity: 1.4,
            pointerEvents: 'none', zIndex: 0
          }} />
          <img
            src="../brand/assets/hero/hero-workspace-dark-v2.png"
            alt="Spaarke workspace"
            style={{
              position: 'relative', zIndex: 1,
              display: 'block', width: '100%', maxWidth: '1280px', margin: '0 auto',
              borderRadius: 'var(--v2-radius-lg)',
              boxShadow:
                '0 0 0 1px rgba(255,255,255,0.08),' +
                '0 40px 80px -20px rgba(0,0,0,0.75),' +
                '0 120px 200px -40px rgba(0,0,0,0.9)'
            }}
          />
        </div>
      </div>
    </section>
  );
}
window.HeroV2 = HeroV2;
