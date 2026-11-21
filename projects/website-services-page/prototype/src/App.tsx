/**
 * PROTOTYPE page shell. Renders sections 1-3 copy and the calculator so the pieces can be reviewed together.
 * In the real site repo, lift each section into the site's own layout and swap in brand tokens;
 * keep content/mlo.content.ts and components/MloCalculator as they are.
 * Sections 4, 5 and 7 (diagrams, timeline) are specified in design.md and not built here.
 */
import { useAudience } from './audience/AudienceContext';
import { AudienceToggle } from './components/AudienceToggle';
import { MloCalculator } from './components/MloCalculator/MloCalculator';
import { hero, orderedStats, whatIsMlo, whyNow } from './content/mlo.content';

export function App() {
  const { audience } = useAudience();
  const stats = orderedStats(audience);

  return (
    <>
      <header className="site-header">
        <span className="logo">Spaarke</span>
        <nav>
          <a href="#what-is-mlo">What is MLO</a>
          <a href="#why-now">Why now</a>
          <a href="#financial-opportunity">Economics</a>
        </nav>
        <AudienceToggle />
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1>{hero.headline}</h1>
            <p className="lede">{hero.subhead[audience]}</p>
            <p className="ctas">
              <a className="btn primary" href={hero.primaryCta.href}>{hero.primaryCta.label}</a>
              <a className="btn" href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
            </p>
          </div>
          <div className="hero-image" role="img" aria-label={hero.image.alt}>
            <span>Hero image placeholder</span>
          </div>
        </section>

        <section id={whatIsMlo.id} className="block">
          <p className="eyebrow">{whatIsMlo.eyebrow}</p>
          <h2>{whatIsMlo.title}</h2>
          <p className="lede">{whatIsMlo.definition}</p>
          <p>{whatIsMlo.msoNote}</p>
          <h3>{whatIsMlo.whyLegalIsDifferent.title}</h3>
          <ul className="grid six">
            {whatIsMlo.whyLegalIsDifferent.items.map((i) => (
              <li key={i.id}><strong>{i.title}</strong><span>{i.caption}</span></li>
            ))}
          </ul>
          <h3>{whatIsMlo.benefitsTitle[audience]}</h3>
          <ul className="grid">
            {whatIsMlo.benefits[audience].map((b) => (
              <li key={b.title}><strong>{b.title}</strong><span>{b.body}</span></li>
            ))}
          </ul>
          <p className="boundary">{whatIsMlo.boundaryLine}</p>
        </section>

        <section id={whyNow.id} className="block">
          <p className="eyebrow">{whyNow.eyebrow}</p>
          <h2>{whyNow.title}</h2>
          <p className="lede">{whyNow.intro[audience]}</p>
          <ul className="grid stats">
            {stats.map((s) => (
              <li key={s.id} className="stat">
                <span className="stat-theme">{s.theme}</span>
                <strong className="stat-figure">{s.figure}</strong>
                <span className="stat-title">{s.title}</span>
                <span>{s.caption}</span>
                <a className="stat-source" href={s.source.url} target="_blank" rel="noreferrer">
                  {s.source.name}{s.verification === 'secondary-verify' ? ' (verify primary)' : ''}
                </a>
              </li>
            ))}
          </ul>
          <aside className="nuance">
            <strong>{whyNow.nuance.title}</strong>
            <span>{whyNow.nuance.body}</span>
          </aside>
          <p className="bridge">{whyNow.bridge}</p>
        </section>

        <section className="block">
          <MloCalculator />
        </section>
      </main>
    </>
  );
}
