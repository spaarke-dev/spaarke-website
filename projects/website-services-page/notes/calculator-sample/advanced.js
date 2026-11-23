// Spaarke MSO value calculator: traditional firm vs firm + firm-owned MSO
(function () {
  const FIELDS = {
    attorneys:     { label: 'Lawyers and agents', min: 2, max: 60, step: 1, fmt: v => v.toFixed(0) },
    revPerAtty:    { label: 'Revenue per lawyer', min: 300000, max: 1500000, step: 25000, fmt: v => money(v) },
    profPct:       { label: 'Professional pay (% of revenue)', min: 20, max: 60, step: 1, fmt: v => v + '%', hint: 'Associates, agents, paralegals. Excludes equity partners.' },
    backOffice:    { label: 'Back-office and technology cost', min: 100000, max: 6000000, step: 25000, fmt: v => money(v), hint: 'Docketing, IT, systems, finance, billing, HR, records. Moves to the MSO.' },
    otherOH:       { label: 'Other overhead (stays with firm)', min: 0, max: 3000000, step: 25000, fmt: v => money(v), hint: 'Occupancy, insurance, marketing.' },
    pricePressure: { label: 'Change in fee levels', min: -30, max: 5, step: 1, fmt: v => (v > 0 ? '+' : '') + v + '%', hint: 'AI-driven repricing of flat fees, applied to both future scenarios.' },
    efficiency:    { label: 'Back-office cost reduction in MSO', min: 0, max: 60, step: 1, fmt: v => v + '%', hint: 'Automation, shared platform, retired legacy systems.' },
    platformFee:   { label: 'Spaarke platform fee (per year)', min: 0, max: 1000000, step: 10000, fmt: v => money(v) },
    feeSaving:     { label: 'MSO fee below current cost', min: 0, max: 30, step: 1, fmt: v => v + '%', hint: 'Fixed fee set by an FMV study. Never a % of legal fees.' },
    ownership:     { label: "Firm's ownership of its MSO", min: 50, max: 100, step: 5, fmt: v => v + '%', hint: 'Spaarke holds the rest in return for funding deployment.' },
    capacityFreed: { label: 'Professional time freed by AI', min: 0, max: 40, step: 1, fmt: v => v + '%' },
    redeploy:      { label: 'Freed time redeployed to new work', min: 0, max: 100, step: 5, fmt: v => v + '%', hint: 'The rest is taken as lower staffing cost through attrition.' },
    newServices:   { label: 'New client services revenue', min: 0, max: 3000000, step: 25000, fmt: v => money(v), hint: 'Portfolio reporting, annuity and subscription offers. 60% margin.' },
    thirdParty:    { label: 'MSO revenue from third parties', min: 0, max: 3000000, step: 25000, fmt: v => money(v), hint: 'Services sold to corporate IP teams or other firms. 30% margin.' },
    multiple:      { label: 'Valuation multiple on MSO EBITDA', min: 3, max: 20, step: 0.5, fmt: v => v.toFixed(1) + 'x', hint: 'About 6x standalone. Platform multiples are higher.' },
  };

  const PRESETS = {
    small: { attorneys: 5, revPerAtty: 650000, profPct: 34, backOffice: 700000, otherOH: 250000, pricePressure: -8, efficiency: 30, platformFee: 90000, feeSaving: 10, ownership: 75, capacityFreed: 10, redeploy: 60, newServices: 75000, thirdParty: 0, multiple: 6 },
    mid:   { attorneys: 12, revPerAtty: 750000, profPct: 38, backOffice: 1500000, otherOH: 600000, pricePressure: -8, efficiency: 33, platformFee: 180000, feeSaving: 10, ownership: 75, capacityFreed: 10, redeploy: 60, newServices: 200000, thirdParty: 250000, multiple: 6 },
    large: { attorneys: 30, revPerAtty: 850000, profPct: 40, backOffice: 4000000, otherOH: 1600000, pricePressure: -8, efficiency: 35, platformFee: 420000, feeSaving: 10, ownership: 75, capacityFreed: 12, redeploy: 60, newServices: 600000, thirdParty: 750000, multiple: 6 },
  };

  const NEW_SVC_MARGIN = 0.6;
  const THIRD_PARTY_MARGIN = 0.3;

  let state = { ...PRESETS.mid };
  let currentPreset = 'mid';
  let stackChart, bridgeChart;

  function money(v, digits) {
    const a = Math.abs(v), s = v < 0 ? '-' : '';
    if (a >= 1e6) return s + '$' + (a / 1e6).toFixed(digits ?? (a >= 1e7 ? 1 : 2)) + 'M';
    if (a >= 1e3) return s + '$' + Math.round(a / 1e3) + 'k';
    return s + '$' + Math.round(a);
  }
  const pct = (v, d = 0) => (v * 100).toFixed(d) + '%';
  const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  // ---------- Build input controls ----------
  function buildFields() {
    document.querySelectorAll('.field').forEach(el => {
      const key = el.dataset.key, f = FIELDS[key];
      const id = 'in-' + key;
      el.innerHTML = `
        <div class="field-top"><label for="${id}">${f.label}</label><output id="out-${key}" for="${id}"></output></div>
        <input type="range" id="${id}" min="${f.min}" max="${f.max}" step="${f.step}" />
        ${f.hint ? `<div class="hint">${f.hint}</div>` : ''}`;
      el.querySelector('input').addEventListener('input', e => {
        state[key] = parseFloat(e.target.value);
        update();
      });
    });
  }
  function syncFields() {
    for (const key in FIELDS) {
      const input = document.getElementById('in-' + key);
      if (!input) continue;
      input.value = state[key];
      document.getElementById('out-' + key).textContent = FIELDS[key].fmt(state[key]);
    }
  }

  // ---------- Model ----------
  function compute(s) {
    const R0 = s.attorneys * s.revPerAtty;
    const P0 = R0 * s.profPct / 100;
    const B0 = s.backOffice;
    const O0 = s.otherOH;
    const today = { revenue: R0, prof: P0, back: B0, other: O0 };
    today.profit = R0 - P0 - B0 - O0;
    today.msoShare = 0;
    today.total = today.profit;

    const p = s.pricePressure / 100;
    const R1 = R0 * (1 + p);
    const future = { revenue: R1, prof: P0, back: B0, other: O0 };
    future.profit = R1 - P0 - B0 - O0;
    future.msoShare = 0;
    future.total = future.profit;

    const f = s.capacityFreed / 100, r = s.redeploy / 100;
    const growth = R1 * f * r;
    const compSaving = P0 * f * (1 - r);
    const N = s.newServices, Ncost = N * (1 - NEW_SVC_MARGIN);
    const fee = B0 * (1 - s.feeSaving / 100);
    const R2 = R1 + growth + N;
    const P2 = P0 - compSaving;
    const O2 = O0 + Ncost;
    const msoOps = B0 * (1 - s.efficiency / 100);
    const msoCost = msoOps + s.platformFee;
    const T = s.thirdParty, Tprofit = T * THIRD_PARTY_MARGIN;
    const msoEbitda = fee - msoCost + Tprofit;
    const own = s.ownership / 100;
    const mso = { revenue: R2, prof: P2, back: fee, other: O2 };
    mso.profit = R2 - P2 - fee - O2;
    mso.msoShare = msoEbitda * own;
    mso.total = mso.profit + mso.msoShare;

    const value = msoEbitda * s.multiple;
    return {
      today, future, mso,
      parts: { growth, compSaving, N, Nnet: N - Ncost, fee, feeSave: B0 - fee, msoOps, msoCost, T, Tprofit, msoEbitda, own, value, firmValue: value * own, spaarkeValue: value * (1 - own), spaarkeShare: msoEbitda * (1 - own), platformFee: s.platformFee, B0 },
    };
  }

  // ---------- Render ----------
  function delta(a, b) {
    if (!b) return '';
    const d = (a - b) / Math.abs(b);
    const cls = d >= 0 ? 'up' : 'down';
    return `<span class="${cls}">${d >= 0 ? '+' : ''}${(d * 100).toFixed(0)}%</span>`;
  }

  function renderKpis(m) {
    const { today, future, mso, parts } = m;
    document.getElementById('kBackOffice').textContent = money(parts.msoCost);
    document.getElementById('kBackOfficeSub').innerHTML = `MSO total cost, vs ${money(parts.B0)} in-house ${delta(parts.msoCost, parts.B0)}`;
    document.getElementById('kProfit').textContent = money(mso.profit);
    document.getElementById('kProfitSub').innerHTML = `vs ${money(future.profit)} future unchanged ${delta(mso.profit, future.profit)}`;
    document.getElementById('kTotal').textContent = money(mso.total);
    document.getElementById('kTotalSub').innerHTML = `Profit plus MSO share. ${delta(mso.total, future.total)} vs unchanged, ${delta(mso.total, today.total)} vs today`;
    document.getElementById('kValue').textContent = money(parts.firmValue);
    document.getElementById('kValueSub').innerHTML = `${pct(parts.own)} of ${money(parts.value)} MSO value. The traditional firm has little value it can sell.`;
  }

  function chartDefaults() {
    Chart.defaults.font.family = css('--font-body') || 'Switzer, sans-serif';
    Chart.defaults.font.size = 12;
    Chart.defaults.color = css('--color-text-muted');
    Chart.defaults.borderColor = css('--color-divider');
  }

  function renderStack(m) {
    const labels = ['Today', ['Future,', 'unchanged'], ['Firm', '+ MSO']];
    const S = [m.today, m.future, m.mso];
    const ds = [
      { label: 'Professional pay', data: S.map(x => x.prof), backgroundColor: css('--c-prof') },
      { label: 'Back office / MSO fee', data: S.map(x => x.back), backgroundColor: css('--c-back') },
      { label: 'Other overhead', data: S.map(x => x.other), backgroundColor: css('--c-other') },
      { label: 'Partner profit', data: S.map(x => Math.max(0, x.profit)), backgroundColor: css('--c-profit') },
      { label: 'MSO profit share (firm)', data: S.map(x => x.msoShare), backgroundColor: css('--c-msoshare') },
    ];
    ds.forEach(d => { d.borderRadius = 3; d.borderSkipped = false; d.maxBarThickness = 96; d.borderWidth = 0; });
    const opts = {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 500, easing: 'easeOutQuart' },
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, boxHeight: 12, padding: 14 } },
        tooltip: {
          callbacks: {
            label: c => ` ${c.dataset.label}: ${money(c.raw)}`,
            footer: items => {
              const i = items[0].dataIndex;
              return `Revenue ${money(S[i].revenue)}  |  Firm total ${money(S[i].total)}`;
            },
          },
        },
      },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { maxRotation: 0 } },
        y: { stacked: true, ticks: { callback: v => money(v, 0) }, grid: { color: css('--color-divider') } },
      },
    };
    if (stackChart) { stackChart.data.datasets.forEach((d, i) => { d.data = ds[i].data; d.backgroundColor = ds[i].backgroundColor; }); stackChart.update(); }
    else stackChart = new Chart(document.getElementById('stackChart'), { type: 'bar', data: { labels, datasets: ds }, options: opts });
  }

  function renderBridge(m) {
    const p = m.parts;
    const steps = [
      { label: ['Unchanged'], v: m.future.total, type: 'base' },
      { label: ['Fee', 'saving'], v: p.feeSave },
      { label: ['Staffing'], v: p.compSaving },
      { label: ['New', 'matters'], v: p.growth },
      { label: ['New', 'services'], v: p.Nnet },
      { label: ['MSO', 'share'], v: p.msoEbitda * p.own },
      { label: ['Firm', '+ MSO'], v: m.mso.total, type: 'total' },
    ];
    let run = 0; const data = [], colors = [];
    steps.forEach(s => {
      if (s.type === 'base') { data.push([0, s.v]); run = s.v; colors.push(css('--c-prof')); }
      else if (s.type === 'total') { data.push([0, s.v]); colors.push(css('--c-profit')); }
      else { data.push([run, run + s.v]); run += s.v; colors.push(s.v >= 0 ? css('--c-msoshare') : css('--color-neg')); }
    });
    const minV = Math.min(...data.map(d => Math.min(d[0], d[1])));
    const opts = {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 500, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { title: it => steps[it[0].dataIndex].label.join(' '), label: c => { const s = steps[c.dataIndex]; return s.type ? ` ${money(s.v)}` : ` ${s.v >= 0 ? '+' : ''}${money(s.v)}`; } } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: window.innerWidth < 480 ? 10 : 11 }, maxRotation: 0, autoSkip: false } },
        y: { min: Math.max(0, Math.floor(minV * 0.85 / 1e5) * 1e5), ticks: { callback: v => money(v, 1) }, grid: { color: css('--color-divider') } },
      },
    };
    const labels = steps.map(s => s.label);
    if (bridgeChart) {
      bridgeChart.data.datasets[0].data = data; bridgeChart.data.datasets[0].backgroundColor = colors;
      bridgeChart.options.scales.y.min = opts.scales.y.min; bridgeChart.update();
    } else {
      bridgeChart = new Chart(document.getElementById('bridgeChart'), {
        type: 'bar', data: { labels, datasets: [{ data, backgroundColor: colors, borderRadius: 3, borderSkipped: false, maxBarThickness: 56 }] }, options: opts,
      });
    }
  }

  function renderFlow(m) {
    const p = m.parts;
    const W = 460, H = 350;
    const node = (x, y, w, h, cls, title, sub) => `
      <g class="node ${cls}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/>
      <text class="n-title" x="${x + w / 2}" y="${y + 24}" text-anchor="middle">${title}</text>
      <text class="n-sub" x="${x + w / 2}" y="${y + 42}" text-anchor="middle">${sub}</text></g>`;
    const svg = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Diagram of fees and equity between clients, law firm, firm MSO and Spaarke">
      <defs>
        <marker id="arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${css('--color-warn')}"/></marker>
        <marker id="arwq" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${css('--color-primary')}"/></marker>
      </defs>
      ${node(16, 16, 170, 58, '', 'Clients', 'Legal fees')}
      ${node(16, 140, 170, 58, 'firm', 'Law firm', 'Lawyer-owned, 100%')}
      ${node(274, 140, 170, 58, 'mso', 'Firm-MSO', 'Back office and tech')}
      ${node(274, 262, 170, 58, 'spaarke', 'Spaarke', 'Platform and AI')}

      <path class="edge money" d="M101 74 L101 136" marker-end="url(#arw)"/>
      <text class="e-amt" x="112" y="102">${money(m.mso.revenue)}</text>
      <text class="e-label" x="112" y="120">revenue</text>

      <path class="edge money" d="M186 160 L270 160" marker-end="url(#arw)"/>
      <text class="e-amt" x="229" y="151" text-anchor="middle">${money(p.fee)}</text>
      <text class="e-label" x="229" y="180" text-anchor="middle">FMV fee</text>

      <path class="edge money" d="M340 198 L340 258" marker-end="url(#arw)"/>
      <text class="e-amt" x="350" y="224">${money(p.platformFee)}</text>
      <text class="e-label" x="350" y="241">platform fee</text>

      <path class="edge equity" d="M101 198 C101 240, 200 230, 270 186" marker-end="url(#arwq)"/>
      <text class="e-label" x="16" y="262">Firm owns ${pct(p.own)} of MSO</text>
      <text class="e-amt" x="16" y="280">${money(p.msoEbitda * p.own)} / yr to firm</text>

      <path class="edge equity" d="M420 258 L420 202" marker-end="url(#arwq)"/>
      <text class="e-label" x="428" y="236">${pct(1 - p.own)}</text>

      <text class="e-label" x="16" y="${H - 26}">MSO EBITDA ${money(p.msoEbitda)} · value ${money(p.value)}</text>
      <text class="e-label" x="16" y="${H - 8}">Deployment funded by Spaarke. No cash from the firm.</text>
    </svg>
    <div class="flow-legend"><span>Fees (cash)</span><span class="eq">Equity and profit share</span></div>`;
    document.getElementById('flow').innerHTML = svg;
  }

  function renderTable(m) {
    const { today, future, mso, parts } = m;
    const row = (label, a, b, c, cls = '') => `<tr class="${cls}"><td>${label}</td><td>${a}</td><td>${b}</td><td class="mso">${c}</td></tr>`;
    const dash = '<span class="muted">-</span>';
    const margin = x => pct(x.profit / x.revenue, 1);
    const rpl = x => money(x.revenue / state.attorneys);
    document.getElementById('detailTable').innerHTML = `
      <thead><tr><th>Line</th><th>Today</th><th>Future, unchanged</th><th class="mso">Firm + MSO</th></tr></thead>
      <tbody>
        <tr class="section"><td colspan="4">Law firm</td></tr>
        ${row('Revenue', money(today.revenue), money(future.revenue), money(mso.revenue))}
        ${row('Revenue per lawyer', rpl(today), rpl(future), rpl(mso))}
        ${row('Professional pay', money(today.prof), money(future.prof), money(mso.prof))}
        ${row('Back office (in-house) / MSO fee', money(today.back), money(future.back), money(mso.back))}
        ${row('Other overhead', money(today.other), money(future.other), money(mso.other))}
        ${row('Partner profit', money(today.profit), money(future.profit), money(mso.profit), 'total')}
        ${row('Profit margin', margin(today), margin(future), margin(mso))}
        <tr class="section"><td colspan="4">Firm-MSO</td></tr>
        ${row('Fee from law firm', dash, dash, money(parts.fee))}
        ${row('Third-party revenue', dash, dash, money(parts.T))}
        ${row('Operating cost after automation', dash, dash, money(parts.msoOps))}
        ${row('Spaarke platform fee', dash, dash, money(parts.platformFee))}
        ${row('MSO EBITDA', dash, dash, money(parts.msoEbitda), 'total')}
        ${row(`Firm's share (${pct(parts.own)})`, dash, dash, money(parts.msoEbitda * parts.own))}
        ${row(`Spaarke's share (${pct(1 - parts.own)})`, dash, dash, money(parts.spaarkeShare))}
        <tr class="section"><td colspan="4">Firm owners</td></tr>
        ${row('Total annual benefit', money(today.total), money(future.total), money(mso.total), 'grand')}
        ${row(`Sellable equity value (${state.multiple.toFixed(1)}x)`, '<span class="muted">Limited</span>', '<span class="muted">Limited</span>', money(parts.firmValue))}
      </tbody>`;
  }

  function renderDrivers(m) {
    const p = m.parts;
    const li = (name, val, desc) => `<li><span class="d-name">${name}</span><span class="d-val">${val}</span><span class="d-desc">${desc}</span></li>`;
    document.getElementById('directList').innerHTML = [
      li('Lower operating cost', money(p.B0 - p.msoOps), `Back-office cost falls from ${money(p.B0)} to ${money(p.msoOps)} through automation, a shared platform and retired legacy systems. Deployment is funded by Spaarke, so the firm puts in no cash.`),
      li('Lower fee to the firm', money(p.feeSave) + ' / yr', `The firm pays a fixed FMV fee of ${money(p.fee)}, below its current cost.`),
      li('MSO profit back to the firm', money(p.msoEbitda * p.own) + ' / yr', `${pct(p.own)} of MSO EBITDA of ${money(p.msoEbitda)}, including third-party revenue.`),
      li('Predictable cost base', 'Fixed fee', 'Back-office spend becomes a contracted fee with a falling price path, instead of lumpy hiring and system upgrades.'),
    ].join('');
    document.getElementById('indirectList').innerHTML = [
      li('Capacity redeployed to new matters', money(p.growth) + ' / yr', `${state.capacityFreed}% of professional time freed, ${state.redeploy}% of it used for more work at current fee levels.`),
      li('Staffing efficiency', money(p.compSaving) + ' / yr', 'The rest of the freed time is taken as lower staffing cost through attrition and slower hiring.'),
      li('New client services', money(p.Nnet) + ' / yr', `${money(p.N)} of new revenue (portfolio reporting, annuity and subscription offers) at a 60% margin.`),
      li('Sellable enterprise value', money(p.firmValue), `The firm's ${pct(p.own)} of a ${money(p.value)} MSO valued at ${state.multiple.toFixed(1)}x. A traditional partnership has little value it can sell.`),
      li('Protection against fee pressure', delta(m.mso.total, m.future.total) + ' vs unchanged', `With fee levels at ${state.pricePressure}%, the traditional model loses ${money(m.today.total - m.future.total)} a year in profit.`),
    ].join('');
  }

  function update() {
    syncFields();
    const m = compute(state);
    renderKpis(m); renderStack(m); renderBridge(m); renderFlow(m); renderTable(m); renderDrivers(m);
  }

  function applyPreset(name) {
    currentPreset = name;
    state = { ...PRESETS[name] };
    document.querySelectorAll('.presets button').forEach(b => b.classList.toggle('active', b.dataset.preset === name));
    update();
  }

  function rebuildCharts() {
    chartDefaults();
    if (stackChart) { stackChart.destroy(); stackChart = null; }
    if (bridgeChart) { bridgeChart.destroy(); bridgeChart = null; }
    update();
  }

  // ---------- Init ----------
  buildFields();
  chartDefaults();
  document.querySelectorAll('.presets button').forEach(b => b.addEventListener('click', () => applyPreset(b.dataset.preset)));
  document.getElementById('resetBtn').addEventListener('click', () => applyPreset(currentPreset));
  const toggle = document.getElementById('themeToggle');
  toggle.addEventListener('click', () => {
    const root = document.documentElement;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    toggle.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    rebuildCharts();
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => rebuildCharts());
  update();
})();
