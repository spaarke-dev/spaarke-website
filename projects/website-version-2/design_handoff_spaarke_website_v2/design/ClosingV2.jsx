// ClosingV2.jsx — Section 8 (final CTA, spotlight)
function ClosingV2() {
  return (
    <section style={{
      position: 'relative',
      background: 'var(--v2-bg)',
      borderTop: '1px solid var(--v2-line)',
      overflow: 'hidden',
      paddingTop: 'clamp(140px, 22vh, 260px)',
      paddingBottom: 'clamp(160px, 24vh, 300px)',
      textAlign: 'center'
    }}>
      {/* Glow rising from bottom — uses the same hero-glow asset, flipped */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        left: '50%',
        bottom: '-30%',
        transform: 'translateX(-50%) scaleY(-1)',
        width: '160%', height: '120%',
        backgroundImage: 'url(../brand/assets/hero/hero-glow-bg.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '100% 100%',
        opacity: 1.1,
        mixBlendMode: 'screen',
        pointerEvents: 'none'
      }} />
      <div className="v2-shell" style={{ position: 'relative' }}>
        <h2 className="v2-h1" style={{
          margin: '0 auto',
          fontSize: 'clamp(48px, 6.5vw, 96px)',
          whiteSpace: 'nowrap'
        }}>
          See all sides of every matter.
        </h2>
        <p className="v2-lede" style={{
          marginTop: '40px', maxWidth: '40ch', marginLeft: 'auto', marginRight: 'auto'
        }}>
          Now accepting early access partners.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '40px' }}>
          <a href="#" className="v2-btn v2-btn-primary">Get access</a>
          <a href="#" className="v2-btn v2-btn-text">Read why <span className="arrow">→</span></a>
        </div>
      </div>
    </section>
  );
}
window.ClosingV2 = ClosingV2;
