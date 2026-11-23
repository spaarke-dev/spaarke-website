// Website view: three inputs, three objectives, details in a dialog. Math lives in model.js.
(function () {
  const { ASSUMPTIONS: A, PRESETS, INPUT_RANGES, revenueBounds, compute } = window.SpaarkeMSO;

  const FIELDS = {
    partners:  { label: 'Equity partners', fmt: v => v.toFixed(0) },
    attorneys: { label: 'Other attorneys and patent agents', fmt: v => v.toFixed(0) },
    revenue:   { label: 'Annual revenue', fmt: v => money(v) },
  };
  let state = { ...PRESETS.mid };
  let chart;

  function money(v, d) {
    const a = Math.abs(v), s = v < 0 ? '-' : '';
    if (a >= 1e6) return s + '$' + (a / 1e6).toFixed(d ?? (a >= 1e7 ? 1 : 2)) + 'M';
    if (a >= 1e3) return s + '$' + Math.round(a / 1e3) + 'k';
    return s + '$' + Math.round(a);
  }
  const pct = (v, d = 0) => (v * 100).toFixed(d) + '%';
  const num = v => Math.round(v / 10) * 10 >= 1000 ? (Math.round(v / 10) * 10).toLocaleString('en-US') : Math.round(v).toString();
  const chg = (a, b) => { const d = (a - b) / b; return (d >= 0 ? '+' : '') + (d * 100).toFixed(0) + '%'; };
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const $ = id => document.getElementById(id);
  const facts = items => items.map(([v, t]) => `<li><b>${v}</b><span>${t}</span></li>`).join('');

  function buildFields() {
    document.querySelectorAll('.field').forEach(el => {
      const k = el.dataset.key, f = FIELDS[k], r = INPUT_RANGES[k];
      el.innerHTML = `<div class="field-top"><label for="in-${k}">${f.label}</label><output id="out-${k}"></output></div>
        <input type="range" id="in-${k}" min="${r.min}" max="${r.max}" step="${r.step}" />`;
      el.querySelector('input').addEventListener('input', e => {
        state[k] = parseFloat(e.target.value);
        document.querySelectorAll('.presets button').forEach(b => b.classList.remove('active'));
        update();
      });
    });
  }

  function renderMain(m) {
    // 1. Efficiency
    $('o1Big').textContent = `${pct(m.margin)} → ${pct(m.margin2)}`;
    $('o1Cap').textContent = 'profit margin';
    $('o1Facts').innerHTML = facts([
      [pct(m.msoCostReduction), 'lower cost to run the back office'],
      [money(m.feeSaving) + ' a year', 'saved on day one through a fixed fee below today\u2019s cost'],
      [chg(m.ppp2, m.ppp), `profit per partner, ${money(m.ppp)} to ${money(m.ppp2)}`],
    ]);
    // 2. Competitiveness
    $('o2Big').textContent = num(m.hoursFreed);
    $('o2Cap').textContent = 'lawyer hours freed a year';
    $('o2Facts').innerHTML = facts([
      [money(m.deploymentFunded), 'AI platform and migration funded by Spaarke, not the firm'],
      [chg(m.revenue2, m.revenue) + ' revenue', `${money(m.revenue2 - m.revenue)} from new matters and new client services`],
      ['Kept current', 'platform upgrades included, with a market-parity commitment'],
    ]);
    // 3. Long-term value
    $('o3Big').textContent = money(m.firmValue);
    $('o3Cap').textContent = 'equity stake in your MSO';
    $('o3Facts').innerHTML = facts([
      [money(m.share) + ' a year', `the firm's ${pct(A.own)} share of MSO profit`],
      ['Up to ' + money(m.firmValuePlatform), `if the stake rolls into the Spaarke platform at ${A.platformMultiple}x`],
      ['$0', 'cash invested by the firm'],
    ]);
    $('summaryLine').innerHTML = `For a firm like this, partner profit rises by about <b>${money(m.profit2 - m.profit)} a year</b>, and the firm builds an equity stake worth about <b>${money(m.firmValue)}</b> without putting in any cash.`;
  }

  function renderDetails(m) {
    const P = state.partners;
    const sm = window.innerWidth < 600;
    const steps = [
      { l: ['Today'], v: m.ppp, t: 'base' },
      { l: sm ? ['Lower', 'fee'] : ['Lower', 'MSO fee'], v: m.feeSaving / P },
      { l: sm ? ['MSO', 'share'] : ['MSO profit', 'share'], v: m.share / P },
      { l: sm ? ['New', 'matters'] : ['New matters', '(freed time)'], v: m.growthProfit / P },
      { l: sm ? ['New', 'services'] : ['New client', 'services'], v: m.svcProfit / P },
      { l: sm ? ['With', 'MSO'] : ['With', 'the MSO'], v: m.ppp2, t: 'total' },
    ];
    let run = 0; const data = [], colors = [];
    steps.forEach(s => {
      if (s.t === 'base') { data.push([0, s.v]); run = s.v; colors.push(css('--c-prof')); }
      else if (s.t === 'total') { data.push([0, s.v]); colors.push(css('--c-profit')); }
      else { data.push([run, run + s.v]); run += s.v; colors.push(css('--c-msoshare')); }
    });
    $('bridgeCaption').textContent = `Annual profit per partner, once the MSO is running. Up ${money(m.ppp2 - m.ppp)} per partner, or ${money(m.profit2 - m.profit)} for the firm.`;
    const yMin = Math.floor(m.ppp * 0.7 / 50000) * 50000;
    if (chart) {
      chart.data.labels = steps.map(s => s.l);
      chart.data.datasets[0].data = data; chart.data.datasets[0].backgroundColor = colors;
      chart.options.scales.y.min = yMin; chart.$steps = steps; chart.update();
    } else if ($('details').open) {
      Chart.defaults.font.family = 'Switzer, sans-serif';
      Chart.defaults.color = css('--color-text-muted');
      chart = new Chart($('bridgeChart'), {
        type: 'bar',
        data: { labels: steps.map(s => s.l), datasets: [{ data, backgroundColor: colors, borderRadius: 4, borderSkipped: false, maxBarThickness: 84 }] },
        options: {
          responsive: true, maintainAspectRatio: false, animation: { duration: 450, easing: 'easeOutQuart' },
          plugins: { legend: { display: false }, tooltip: { callbacks: { title: it => chart.$steps[it[0].dataIndex].l.join(' '), label: c => { const s = chart.$steps[c.dataIndex]; return s.t ? ' ' + money(s.v) : ' +' + money(s.v); } } } },
          scales: {
            x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: false, font: { size: sm ? 10 : 12 } } },
            y: { min: yMin, ticks: { callback: v => money(v, 1) }, grid: { color: css('--color-divider') } },
          },
        },
        plugins: [{
          id: 'labels',
          afterDatasetsDraw(c) {
            const { ctx } = c; ctx.save();
            ctx.font = `700 ${sm ? 10 : 12}px Switzer, sans-serif`; ctx.fillStyle = css('--color-text'); ctx.textAlign = 'center';
            c.getDatasetMeta(0).data.forEach((bar, i) => {
              const s = c.$steps[i]; ctx.fillText(s.t ? money(s.v) : '+' + money(s.v), bar.x, Math.min(bar.y, bar.base) - 6);
            });
            ctx.restore();
          },
        }],
      });
      chart.$steps = steps;
    }

    const row = (l, a, b, cls = '') => `<tr><td>${l}</td><td>${a}</td><td class="mso ${cls}">${b}</td></tr>`;
    const dash = '<span class="muted">-</span>';
    $('compareTable').innerHTML = `
      <thead><tr><th></th><th>Today</th><th class="mso">With MSO</th></tr></thead>
      <tbody>
        ${row('Revenue', money(m.revenue), money(m.revenue2), 'up')}
        ${row('Attorney and agent pay', money(m.comp), money(m.comp))}
        ${row('Operating cost', money(m.opex), money(m.opex2), 'up')}
        ${row('Cost of new work', dash, money(m.newWorkCost))}
        ${row('MSO profit to the firm', dash, money(m.share), 'up')}
        <tr class="total"><td>Partner profit</td><td>${money(m.profit)}</td><td class="mso up">${money(m.profit2)}</td></tr>
        ${row('Profit margin', pct(m.margin), pct(m.margin2), 'up')}
        ${row('Profit per partner', money(m.ppp), money(m.ppp2), 'up')}
        ${row("Firm's equity it can sell", '<span class="muted">Little</span>', money(m.firmValue), 'up')}
      </tbody>`;

    $('step1').textContent = `About ${money(m.scope)} of back office, docketing, IT and finance moves to the MSO. Automation and a shared platform cut its running cost by ${pct(A.efficiency)}, and the firm pays a fixed fee of ${money(m.fee)}, ${pct(A.feeDiscount)} less than today.`;
    $('step2').textContent = `Lawyers get back about ${pct(A.timeFreed)} of their time. Using half of it for new matters, plus new client services, adds about ${money(m.revenue2 - m.revenue)} of revenue.`;
    $('step3').textContent = `The MSO earns about ${money(m.ebitda)} a year. The firm keeps ${pct(A.own)} of it and owns ${pct(A.own)} of an asset worth about ${money(m.value)}, without investing cash.`;
    $('feeArrow').textContent = `Fixed fee ${money(m.fee)}`;
    $('msoOwn').textContent = `Firm owns ${pct(A.own)}. Back office, docketing, IT and finance.`;
    $('spaarkeBox').textContent = `Funds the ${money(m.deploymentFunded)} deployment and runs the technology. Holds ${pct(1 - A.own)} of the MSO.`;
  }

  function renderAssumptions() {
    const items = [
      ['Revenue per lawyer', `Kept between ${money(A.revPerLawyerMin)} and ${money(A.revPerLawyerMax)}; the revenue slider adjusts to the headcount`],
      ['Profit per partner today', `${money(A.ppp)}, adjusted where needed to keep operating cost between ${pct(A.opexMin)} and ${pct(A.opexMax)} of revenue and profit per partner between ${money(A.pppMin)} and ${money(A.pppMax)}`],
      ['Cost per other attorney or patent agent', `${money(A.attyComp)}, including benefits`],
      ['Operating cost', 'Revenue less partner profit and attorney pay. Covers staff, docketing, IT, finance, occupancy and insurance.'],
      ['Moves to the MSO', `${pct(A.msoScope)} of operating cost. Occupancy, insurance and similar costs stay with the firm.`],
      ['MSO efficiency', `${pct(A.efficiency)} lower running cost, plus a Spaarke platform licence of ${pct(A.platform)} of that cost`],
      ['MSO fee', `Fixed, ${pct(A.feeDiscount)} below today's cost, set by a fair-market-value study. Never a share of legal fees.`],
      ['Deployment', `Platform deployment and standard migration worth about ${pct(A.deployment)} of the MSO's cost base, funded by Spaarke in return for its ${pct(1 - A.own)} stake`],
      ['Freed lawyer time', `${pct(A.timeFreed)} of ${num(A.hoursPerLawyer)} hours a year per lawyer, with ${pct(A.redeploy)} used for new matters at ${pct(A.growthFlow)} profit flow-through`],
      ['New client services', `${pct(A.newSvc)} of revenue at a ${pct(A.newSvcMargin)} margin`],
      ['MSO value', `${A.multiple}x annual MSO profit standalone. ${A.platformMultiple}x is an illustrative platform multiple for the roll-up option at exit.`],
    ];
    $('assumeList').innerHTML = items.map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join('');
  }

  function update() {
    const b = revenueBounds(state.partners, state.attorneys);
    const rev = $('in-revenue'); rev.min = b.min; rev.max = b.max;
    state.revenue = Math.min(Math.max(state.revenue, b.min), b.max);
    for (const k in FIELDS) { $('in-' + k).value = state[k]; $('out-' + k).textContent = FIELDS[k].fmt(state[k]); }
    const m = compute(state);
    renderMain(m); renderDetails(m);
  }

  function resetChart() { if (chart) { chart.destroy(); chart = null; } }

  buildFields(); renderAssumptions();
  document.querySelectorAll('.presets button').forEach(b => b.addEventListener('click', () => {
    state = { ...PRESETS[b.dataset.preset] };
    document.querySelectorAll('.presets button').forEach(x => x.classList.toggle('active', x === b));
    update();
  }));
  const dlg = $('details');
  $('detailsBtn').addEventListener('click', () => { dlg.showModal(); resetChart(); update(); });
  $('closeDetails').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  const t = $('themeToggle');
  t.addEventListener('click', () => {
    const r = document.documentElement; r.dataset.theme = r.dataset.theme === 'dark' ? 'light' : 'dark';
    t.setAttribute('aria-label', r.dataset.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    resetChart(); update();
  });
  update();
})();
