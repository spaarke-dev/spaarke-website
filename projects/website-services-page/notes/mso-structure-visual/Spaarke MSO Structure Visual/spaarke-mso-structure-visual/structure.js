/* Spaarke MSO structure visual. Vanilla JS, no dependencies.
   Content (NODES, EDGE_LABELS, CAPTIONS) is separated from layout (WIDE, TALL). */
(function () {
  var NS = 'http://www.w3.org/2000/svg';

  var NODES = {
    clients:  { cls: 'small n-clients', title: 'Clients', sub: 'Engage the firm', items: [] },
    partners: { cls: 'small n-partners', title: 'Firm partners', sub: 'Licensed lawyers', items: [] },
    firm: { cls: 'firm', eyebrow: 'Law firm · 100% lawyer-owned', title: 'Your law firm', sub: 'Keeps the practice of law',
      items: ['Lawyers and legal professionals', 'Clients and matters', 'Legal fees and billing rates', 'Client data and privilege', 'Firm name and brand'] },
    mso: { cls: 'mso', eyebrow: 'Dedicated MSO · Spaarke-owned', title: "Your firm's MSO", sub: 'Your operations, run to your direction',
      items: ['Your same staff, now in the MSO', 'Paralegals, assistants and docketing', 'IT, security and systems', 'Finance, billing and collections', 'HR, facilities and vendors'] },
    spaarke: { cls: 'spaarke', eyebrow: 'MSO operator', title: 'Spaarke', sub: 'Owns and runs your MSO',
      items: ['Legal platform and AI', 'Funds the deployment', 'Migrates legacy systems', 'Operations and upgrades'] },
    network: { cls: 'small n-network', title: 'Other member firms', sub: 'Each with its own MSO', items: [], ghost: true }
  };

  var EDGE_LABELS = {
    fees:     { t: 'money', label: 'Legal fees' },
    ownFirm:  { t: 'own',   label: 'Own 100%' },
    fee:      { t: 'money', label: 'Fixed fee' },
    svc:      { t: 'svc',   also: 'ctrl', label: 'Back-office services' },
    direct:   { t: 'ctrl',  label: 'Directs day-to-day' },
    ownMso:   { t: 'own',   label: 'Owns 100%' },
    lic:      { t: 'money', label: 'Fee + profit' },
    plat:     { t: 'svc',   label: 'Platform + ops' },
    deploy:   { t: 'money', label: 'Funds setup' },
    equity:   { t: 'value', also: 'own', label: 'Spaarke equity to the firm' },
    net:      { t: 'svc',   also: 'value', label: 'Same platform' }
  };
  var SHORT = { svc: 'Services', plat: 'Platform', equity: 'Spaarke equity', direct: 'Directs work', lic: 'Licence' };

  var CAPTIONS = {
    all: [
      ['The practice', 'The law firm stays 100% owned by its lawyers. Clients, legal fees, legal judgment and the firm name do not move.'],
      ['The back office', "Your same staff, systems and operations move into a dedicated MSO owned and run by Spaarke. Your firm directs the day-to-day work."],
      ['The operator', 'Spaarke owns and runs the MSO on its platform, and pays for the deployment. The firm puts in no cash and receives equity in Spaarke.']
    ],
    own: [
      ['Law firm', 'Partners own 100% of the law firm, as they do today. Ownership of the practice does not change.'],
      ['Your MSO', 'Spaarke owns 100% of each firm’s dedicated MSO, as operators and investors do in most legal MSOs. Ownership sits with Spaarke; direction of the work sits with the firm.'],
      ['Spaarke equity', 'Instead of a stake in one MSO, the firm receives equity in Spaarke, which owns every MSO on the network. There is no private equity, no outside investor and no cash in.']
    ],
    ctrl: [
      ['The same people', 'Your staff move to the MSO as employees, but they keep working with the same lawyers, on the same matters, in the same offices.'],
      ['Firm direction', 'The firm sets priorities and directs the day-to-day work. Lawyers supervise staff on client matters, as the professional rules require.'],
      ['Shared governance', 'A joint operating committee, agreed service levels, and firm approval over key staff and any change that affects clients. Spaarke runs the business; the firm directs the work.']
    ],
    money: [
      ['Legal fees stay', 'Clients pay the law firm. Legal fees stay with the firm and are never shared with the MSO or Spaarke.'],
      ['A lower, fixed fee', "The firm pays its MSO a fixed fee, set by a fair-market-value study and priced below today's back-office cost. The savings are the firm's from day one."],
      ['Licence and profit', 'The MSO pays Spaarke a fixed platform licence, and as owner Spaarke receives the MSO’s profit. The firm sees open-book reporting, and Spaarke earns its return by running the MSO well.']
    ],
    value: [
      ['Better margins now', 'A lower operating cost and modern technology lift the firm’s margin and competitiveness straight away.'],
      ['A shared network', 'Every member firm runs on the same Spaarke platform, so improvements and benchmarks are shared across the network.'],
      ['Long-term value', "The firm's Spaarke equity shares in the whole network, not one firm's back office. Liquidity comes at the Spaarke level, on terms members helped build."]
    ]
  };

  /* ---------- layouts ---------- */
  var WIDE = {
    w: 1130, h: 640,
    nodes: {
      clients:  [40, 24, 130, 64],
      partners: [190, 24, 130, 64],
      firm:     [40, 150, 280, 300],
      mso:      [470, 150, 280, 300],
      spaarke:  [860, 150, 230, 250],
      network:  [860, 490, 230, 80]
    },
    brace: { r: [24, 124, 312, 350], lx: 120, ly: 474, label: "What the firm owns" },
    edges: {
      fees:    { d: 'M105 88 V150', p: [105, 119] },
      ownFirm: { d: 'M255 88 V150', p: [255, 119] },
      fee:     { d: 'M320 205 H470', p: [395, 205] },
      svc:     { d: 'M470 255 H320', p: [395, 255] },
      direct:  { d: 'M320 335 H470', p: [395, 335] },
      lic:     { d: 'M750 205 H860', p: [805, 205] },
      plat:    { d: 'M860 255 H750', p: [805, 255] },
      deploy:  { d: 'M860 300 H750', p: [805, 300] },
      ownMso:  { d: 'M860 345 H750', p: [805, 345] },
      equity:  { d: 'M860 380 H818 C806 380 800 388 800 400 V552 C800 562 794 566 784 566 H266 C256 566 250 560 250 550 V452', p: [525, 566] },
      net:     { d: 'M975 490 V400', p: [975, 445], both: true }
    }
  };

  var TALL = {
    w: 372, h: 1330, short: true,
    nodes: {
      clients:  [16, 12, 150, 60],
      partners: [182, 12, 150, 60],
      firm:     [16, 130, 316, 236],
      mso:      [16, 574, 316, 236],
      spaarke:  [16, 974, 316, 212],
      network:  [16, 1244, 316, 70]
    },
    brace: { r: [8, 118, 332, 260], lx: 174, ly: 118, label: "What the firm owns" },
    edges: {
      fees:    { d: 'M91 72 V130',  p: [91, 101] },
      ownFirm: { d: 'M257 72 V130', p: [257, 101] },
      fee:     { d: 'M60 366 V574',  p: [60, 460] },
      svc:     { d: 'M290 574 V366', p: [290, 480] },
      direct:  { d: 'M176 366 V574', p: [176, 440] },
      lic:     { d: 'M56 810 V974',  p: [56, 870] },
      plat:    { d: 'M136 974 V810', p: [136, 920] },
      ownMso:  { d: 'M216 974 V810', p: [216, 870] },
      deploy:  { d: 'M296 974 V810', p: [296, 920] },
      equity:  { d: 'M332 1080 H352 V250 H334', p: [352, 680], rot: true },
      net:     { d: 'M174 1244 V1186', p: [174, 1215], both: true }
    }
  };

  function el(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function txt(parent, x, y, cls, s) { var t = el('text', { x: x, y: y, 'class': cls }, parent); t.textContent = s; return t; }

  function render(container, L, id) {
    var svg = el('svg', { viewBox: '0 0 ' + L.w + ' ' + L.h, role: 'img' });
    var defs = el('defs', {}, svg);
    ['own', 'money', 'svc', 'value', 'ctrl'].forEach(function (t) {
      var m = el('marker', { id: id + '-a-' + t, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, defs);
      el('path', { d: 'M0 0 L10 5 L0 10 z', fill: 'var(--c-' + t + ')' }, m);
    });

    // brace
    var bg = el('g', { 'class': 'brace' }, svg);
    var b = L.brace;
    el('rect', { x: b.r[0], y: b.r[1], width: b.r[2], height: b.r[3], rx: 18 }, bg);
    var bw = b.label.length * 7.6 + 24;
    el('rect', { 'class': 'bpill', x: b.lx - bw / 2, y: b.ly - 11, width: bw, height: 22, rx: 11 }, bg);
    var bt = txt(bg, b.lx, b.ly + 4, '', b.label); bt.setAttribute('text-anchor', 'middle');

    // nodes
    Object.keys(L.nodes).forEach(function (k) {
      var n = NODES[k], r = L.nodes[k];
      var g = el('g', { 'class': 'node ' + n.cls }, svg);
      var x = r[0], y = r[1], w = r[2], h = r[3];
      if (n.ghost) {
        el('rect', { 'class': 'ghost', x: x + 12, y: y + 12, width: w, height: h, rx: 14 }, g);
        el('rect', { 'class': 'ghost', x: x + 6, y: y + 6, width: w, height: h, rx: 14 }, g);
      }
      el('rect', { 'class': 'box', x: x, y: y, width: w, height: h, rx: 14 }, g);
      if (n.cls.indexOf('small') > -1) {
        txt(g, x + 16, y + (h > 62 ? 28 : 26), 'ttl', n.title);
        txt(g, x + 16, y + (h > 62 ? 48 : 45), 'sub', n.sub);
        return;
      }
      txt(g, x + 20, y + 28, 'eyebrow', n.eyebrow);
      txt(g, x + 20, y + 56, 'ttl', n.title);
      txt(g, x + 20, y + 77, 'sub', n.sub);
      el('line', { 'class': 'rule', x1: x + 20, x2: x + w - 20, y1: y + 94, y2: y + 94 }, g);
      n.items.forEach(function (s, i) {
        var yy = y + 120 + i * 24;
        el('circle', { 'class': 'dot', cx: x + 24, cy: yy - 4, r: 2.5 }, g);
        txt(g, x + 36, yy, 'item', s);
      });
    });

    // edges
    Object.keys(L.edges).forEach(function (k) {
      var E = EDGE_LABELS[k], g = L.edges[k];
      var cls = 'edge t-' + E.t + (E.also ? ' also-' + E.also : '');
      var grp = el('g', { 'class': cls }, svg);
      var a = { d: g.d, 'marker-end': 'url(#' + id + '-a-' + E.t + ')' };
      if (g.both) a['marker-start'] = 'url(#' + id + '-a-' + E.t + ')';
      el('path', a, grp);
      var label = (L.short && SHORT[k]) || E.label;
      var w = label.length * 6.4 + 18;
      var lg = el('g', g.rot ? { transform: 'rotate(-90 ' + g.p[0] + ' ' + g.p[1] + ')' } : {}, grp);
      el('rect', { 'class': 'pill', x: g.p[0] - w / 2, y: g.p[1] - 11, width: w, height: 22, rx: 11 }, lg);
      txt(lg, g.p[0], g.p[1] + 0.5, '', label);
    });

    container.appendChild(svg);
  }

  var root = document.getElementById('mso-structure');
  render(root.querySelector('.ms-wide'), WIDE, 'w');
  render(root.querySelector('.ms-tall'), TALL, 't');

  var cap = root.querySelector('.ms-caption');
  function setView(v) {
    root.setAttribute('data-view', v);
    root.querySelectorAll('.ms-tabs button').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.view === v)); });
    cap.innerHTML = CAPTIONS[v].map(function (c) { return '<div class="cap"><h3>' + c[0] + '</h3><p>' + c[1] + '</p></div>'; }).join('');
  }
  root.querySelectorAll('.ms-tabs button').forEach(function (b) {
    b.addEventListener('click', function () { setView(b.dataset.view); });
  });
  setView('all');
})();
