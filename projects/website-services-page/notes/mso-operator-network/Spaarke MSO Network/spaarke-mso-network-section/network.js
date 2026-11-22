/* Spaarke member network: hub-and-spoke visual (light section). Vanilla JS. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var HUB_ITEMS = ['Technology platform', 'AI capabilities', 'Business transformation', 'Shared services', 'Employment services (PEO)', 'Best practices and playbooks', 'Vendor and partner agreements'];
  // Reveal order: index 0 is "your firm".
  var MEMBERS = [
    { kind: 'firm', name: 'Your law firm', you: true }, { kind: 'firm', name: 'Law firm' }, { kind: 'dept', name: 'Legal department' },
    { kind: 'firm', name: 'Law firm' }, { kind: 'firm', name: 'Law firm' }, { kind: 'dept', name: 'Legal department' },
    { kind: 'firm', name: 'Law firm' }, { kind: 'firm', name: 'Law firm' }
  ];
  var STEPS = {
    1: { cap: 'On day one, your firm runs on a platform and operating team built for a much larger firm.',
         eq: 'Your firm receives equity in Spaarke when it signs. It is a share of an early-stage operator.', r: 46, pct: 0.30 },
    3: { cap: 'As members join, shared teams and proven playbooks give your firm capabilities it could not build alone.',
         eq: 'Each new member adds operator revenue and platform value. Your share is a smaller slice of a larger company.', r: 88, pct: 0.14 },
    8: { cap: 'At network scale, your firm gets buying power and peer benchmarks, so it can compete for work that goes to larger firms.',
         eq: "Your stake is a share of the whole network, valued as a platform rather than as one firm's back office.", r: 132, pct: 0.09 }
  };

  function el(n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function tx(p, x, y, c, s) { var t = el('text', { x: x, y: y, 'class': c }, p); t.textContent = s; return t; }

  var CAPS = [['Technology', 'platform'], ['AI', 'capabilities'], ['Shared', 'services'], ['Employment', 'services (PEO)'], ['Playbooks and', 'transformation'], ['Vendor and', 'partner deals']];

  function arc(cx, cy, r0, r1, a0, a1) {
    function pt(r, a) { return (cx + r * Math.cos(a)).toFixed(2) + ' ' + (cy + r * Math.sin(a)).toFixed(2); }
    var big = a1 - a0 > Math.PI ? 1 : 0;
    return 'M' + pt(r1, a0) + ' A' + r1 + ' ' + r1 + ' 0 ' + big + ' 1 ' + pt(r1, a1) + ' L' + pt(r0, a1) + ' A' + r0 + ' ' + r0 + ' 0 ' + big + ' 0 ' + pt(r0, a0) + ' Z';
  }

  function build(container, cfg) {
    var svg = el('svg', { viewBox: '0 0 ' + cfg.w + ' ' + cfg.h });
    var cx = cfg.w / 2, cy = cfg.cy;
    el('circle', { 'class': 'hub-ring', cx: cx, cy: cy, r: cfg.r1 + 18 }, svg);

    var spokes = el('g', {}, svg);
    cfg.angles.forEach(function (deg, i) {
      var m = MEMBERS[i], a = deg * Math.PI / 180;
      var px = cx + cfg.rx * Math.cos(a), py = cy + cfg.ry * Math.sin(a);
      var qx = cx + (cfg.r1 + 44) * Math.cos(a), qy = cy + (cfg.r1 + 44) * Math.sin(a);
      if (cfg.inline) { qx = px; qy = py; }
      var hx = cx + cfg.r1 * Math.cos(a), hy = cy + cfg.r1 * Math.sin(a);
      var g = el('g', { 'class': 'member ' + m.kind + (m.you ? ' you' : ''), 'data-i': i }, spokes);
      var seat = el('g', { 'class': 'seat' }, g);
      el('line', { 'class': 'seat-sp', x1: hx, y1: hy, x2: px, y2: py }, seat);
      el('rect', { 'class': 'seat-box', x: px - cfg.bw / 2, y: py - cfg.bh / 2, width: cfg.bw, height: cfg.bh, rx: 10, fill: '#f5f6f9' }, seat);
      tx(seat, px, py, 'seat-t', 'Next member');
      var live = el('g', { 'class': 'live' }, g);
      el('line', { 'class': 'sp-op', x1: hx, y1: hy, x2: qx, y2: qy }, live);
      if (!cfg.inline) {
        el('line', { 'class': 'sp-link', x1: qx, y1: qy, x2: px, y2: py }, live);
        var pulse = el('circle', { 'class': 'pulse', r: 3.5, cx: 0, cy: 0 }, live);
        el('animateMotion', { dur: (2.4 + i * 0.17) + 's', repeatCount: 'indefinite', path: 'M' + hx + ' ' + hy + ' L' + qx + ' ' + qy }, pulse);
      }
      el('rect', { 'class': 'm-box', x: px - cfg.bw / 2, y: py - cfg.bh / 2, width: cfg.bw, height: cfg.bh, rx: 10 }, live);
      if (cfg.inline) {
        tx(live, px, py - 10, 'm-name', m.name);
        el('rect', { 'class': 'm-mso', x: px - cfg.mw / 2, y: py + 3, width: cfg.mw, height: 18, rx: 5 }, live);
        tx(live, px, py + 12.5, 'm-msot', 'MSO');
      } else {
        tx(live, px, py - 8, 'm-kind', m.you ? 'YOU' : (m.kind === 'firm' ? 'MEMBER FIRM' : 'MEMBER'));
        tx(live, px, py + 8, 'm-name', m.name);
        el('rect', { 'class': 'm-mso', x: qx - cfg.mw / 2, y: qy - 13, width: cfg.mw, height: 26, rx: 7 }, live);
        tx(live, qx, qy, 'm-msot', 'MSO');
      }
    });

    // capability ring: six segments, starting at the top
    var n = CAPS.length, gap = 0.0;
    CAPS.forEach(function (c, i) {
      var a0 = -Math.PI / 2 - Math.PI / n + i * 2 * Math.PI / n, a1 = a0 + 2 * Math.PI / n;
      var g = el('g', { 'class': 'cap-g', 'data-c': i }, svg);
      el('path', { 'class': 'cap-seg' + (i % 2 ? ' alt' : ''), d: arc(cx, cy, cfg.r0, cfg.r1, a0 + gap, a1 - gap) }, g);
      var am = (a0 + a1) / 2, lr = (cfg.r0 + cfg.r1) / 2, lx = cx + lr * Math.cos(am), ly = cy + lr * Math.sin(am);
      if (cfg.inline) { tx(g, lx, ly + 4, 'cap-n', String(i + 1).padStart(2, '0')); return; }
      tx(g, lx, ly - 13, 'cap-n', String(i + 1).padStart(2, '0'));
      tx(g, lx, ly + 3, 'cap-l', c[0]);
      tx(g, lx, ly + 18, 'cap-l', c[1]);
    });

    el('circle', { 'class': 'hub-core', cx: cx, cy: cy, r: cfg.r0 - 6 }, svg);
    var t0 = cy - (cfg.inline ? 12 : 22);
    tx(svg, cx, t0, 'hub-t', 'Spaarke');
    tx(svg, cx, t0 + 22, 'hub-e', 'MSO OPERATOR');
    if (!cfg.inline) {
      tx(svg, cx, t0 + 46, 'hub-s', 'Owns and runs');
      tx(svg, cx, t0 + 63, 'hub-s', "every member's MSO");
    }
    container.appendChild(svg);
  }

  var root = document.getElementById('mso-network');
  build(root.querySelector('.nw-wide'), { w: 1130, h: 700, cy: 350, r0: 112, r1: 212, rx: 470, ry: 300, bw: 160, bh: 48, mw: 64,
    angles: [-90, 0, 180, -42, -138, 42, 138, 90] });
  build(root.querySelector('.nw-tall'), { w: 372, h: 600, cy: 300, r0: 66, r1: 112, rx: 128, ry: 262, q: 1, bw: 124, bh: 52, mw: 44, inline: true,
    angles: [-90, -22, 202, 22, 158, 90] });

  // link ring segments and capability cards
  var cards = root.querySelectorAll('.nw-capgrid li');
  root.querySelectorAll('.cap-g').forEach(function (g) {
    var i = +g.dataset.c;
    g.addEventListener('mouseenter', function () { cards[i].classList.add('hot'); });
    g.addEventListener('mouseleave', function () { cards[i].classList.remove('hot'); });
  });
  cards.forEach(function (li, i) {
    li.addEventListener('mouseenter', function () { root.querySelectorAll('.cap-g[data-c="' + i + '"]').forEach(function (g) { g.classList.add('hot'); }); });
    li.addEventListener('mouseleave', function () { root.querySelectorAll('.cap-g[data-c="' + i + '"]').forEach(function (g) { g.classList.remove('hot'); }); });
  });

  var pie = root.querySelector('.pie-all'), you = root.querySelector('.pie-you');
  var cur = { r: 46, pct: 0.30 }, raf;
  function slice(r, pct) {
    var a0 = -Math.PI / 2, a1 = a0 + pct * 2 * Math.PI;
    var x1 = 150 + r * Math.cos(a1), y1 = 150 + r * Math.sin(a1);
    return 'M150 150 L150 ' + (150 - r) + ' A' + r + ' ' + r + ' 0 ' + (pct > 0.5 ? 1 : 0) + ' 1 ' + x1.toFixed(2) + ' ' + y1.toFixed(2) + ' Z';
  }
  function drawPie(r, pct) { pie.setAttribute('r', r); you.setAttribute('d', slice(r, pct)); }
  function tweenPie(to) {
    cancelAnimationFrame(raf);
    var from = { r: cur.r, pct: cur.pct }, t0 = null, reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { cur = to; drawPie(to.r, to.pct); return; }
    function step(ts) {
      if (!t0) t0 = ts;
      var k = Math.min(1, (ts - t0) / 600), e = 1 - Math.pow(1 - k, 3);
      cur = { r: from.r + (to.r - from.r) * e, pct: from.pct + (to.pct - from.pct) * e };
      drawPie(cur.r, cur.pct);
      if (k < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }

  function setSize(n) {
    root.setAttribute('data-size', n);
    root.querySelectorAll('.nw-steps button').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.size === String(n))); });
    root.querySelectorAll('.member').forEach(function (m) { m.classList.toggle('off', +m.dataset.i >= n); });
    root.querySelectorAll('.nw-caps li').forEach(function (li) {
      var on = +li.dataset.at <= n, was = li.classList.contains('on');
      li.classList.toggle('on', on); li.classList.toggle('off', !on);
      li.classList.toggle('new', on && !was);
    });
    root.querySelector('[data-k="cap"]').textContent = STEPS[n].cap;
    root.querySelector('[data-k="eq"]').textContent = STEPS[n].eq;
    tweenPie(STEPS[n]);
    var v = STEPS[n].r * STEPS[n].r * STEPS[n].pct, max = 132 * 132 * 0.09;
    root.querySelector('.nw-grow-bar b').style.width = Math.round(v / max * 100) + '%';
  }
  root.querySelectorAll('.nw-steps button').forEach(function (b) { b.addEventListener('click', function () { setSize(+b.dataset.size); }); });
  drawPie(46, 0.30);
  setSize(1);
})();
