/**
 * Beam animation via requestAnimationFrame + setAttribute.
 *
 * Each beam rect has data-cx (center X in local coords).
 * As width grows, x shifts so the beam extends in BOTH directions:
 *   x = cx - width/2
 *
 * This makes beams explode outward from their center, past both
 * edges of the frame, then fade out.
 */

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function runBeamAnimations(svg: SVGSVGElement): () => void {
  const rects = svg.querySelectorAll<SVGRectElement>('.ska-beam-rect');
  let cancelled = false;

  const DELAY = 420;
  const EXTEND = 250;
  const HOLD = 400;
  const FADE = 600;
  const PEAK_WIDTH = 5000;
  const start = performance.now();

  // Pre-read each rect's center X
  const centers: number[] = [];
  rects.forEach((r) => {
    centers.push(parseFloat(r.dataset.cx || '0'));
  });

  function setBeams(w: number, opacity: string) {
    rects.forEach((r, i) => {
      const cx = centers[i];
      r.setAttribute('x', String(cx - w / 2));
      r.setAttribute('width', String(w));
      r.setAttribute('opacity', opacity);
    });
  }

  function tick(now: number) {
    if (cancelled) return;
    const elapsed = now - start - DELAY;

    if (elapsed < 0) {
      setBeams(0, '0');
      requestAnimationFrame(tick);
      return;
    }

    if (elapsed < EXTEND) {
      const w = PEAK_WIDTH * easeOutCubic(elapsed / EXTEND);
      setBeams(w, '1');
    } else if (elapsed < EXTEND + HOLD) {
      setBeams(PEAK_WIDTH, '1');
    } else if (elapsed < EXTEND + HOLD + FADE) {
      const opacity = String(1 - (elapsed - EXTEND - HOLD) / FADE);
      setBeams(PEAK_WIDTH, opacity);
    } else {
      setBeams(PEAK_WIDTH, '0');
      return;
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
  return () => { cancelled = true; };
}
