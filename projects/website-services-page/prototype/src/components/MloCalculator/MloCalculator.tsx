import { useMemo, useState, type ReactNode } from 'react';
import { useAudience } from '../../audience/AudienceContext';
import {
  CORP_DEFAULTS,
  CORP_LABELS,
  FIRM_DEFAULTS,
  FIRM_LABELS,
  ILLUSTRATIVE_NOTE,
} from './defaults';
import {
  CORP_FUNCTIONS,
  FIRM_FUNCTIONS,
  computeCorporate,
  computeFirm,
  type CorpInputs,
  type FirmInputs,
} from './model';
import { Sankey, money } from './Sankey';
import { corporateSankey, firmSankey } from './sankeyData';
import './MloCalculator.css';

const pct = (v: number, d = 0) => `${(v * 100).toFixed(d)}%`;
const signed = (v: number) => `${v >= 0 ? '+' : '-'}${money(Math.abs(v))}`;

function Slider(props: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div className="calc-field">
      <label htmlFor={props.id}>
        <span>{props.label}</span>
        <output htmlFor={props.id}>{props.display}</output>
      </label>
      <input
        id={props.id}
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
      />
      {props.hint ? <small>{props.hint}</small> : null}
    </div>
  );
}

function Kpi(props: { label: string; value: string; was?: string; delta?: string; good?: boolean | null }) {
  return (
    <div className="kpi">
      <span className="kpi-label">{props.label}</span>
      <strong className="kpi-value">{props.value}</strong>
      {props.was ? <span className="kpi-was">Today: {props.was}</span> : null}
      {props.delta ? (
        <span className={`kpi-delta ${props.good === true ? 'good' : props.good === false ? 'bad' : ''}`}>{props.delta}</span>
      ) : null}
    </div>
  );
}

function FirmCalculator() {
  const [inp, setInp] = useState<FirmInputs>(FIRM_DEFAULTS);
  const r = useMemo(() => computeFirm(inp), [inp]);
  const data = useMemo(() => firmSankey(r), [r]);
  const set = <K extends keyof FirmInputs>(k: K, v: FirmInputs[K]) => setInp((p) => ({ ...p, [k]: v }));

  return (
    <Layout
      controls={
        <>
          <Slider id="f-rev" label="Annual revenue" value={inp.revenue} min={5_000_000} max={100_000_000} step={1_000_000} display={money(inp.revenue)} onChange={(v) => set('revenue', v)} />
          <Slider id="f-adv" label="MLO unit price below your internal cost" value={inp.priceAdvantage} min={0} max={0.4} step={0.01} display={pct(inp.priceAdvantage)} onChange={(v) => set('priceAdvantage', v)} hint="Placeholder range." />
          <Slider id="f-press" label="Fee pressure scenario" value={inp.feePressure} min={0} max={0.2} step={0.01} display={inp.feePressure === 0 ? 'None' : `-${pct(inp.feePressure)} revenue`} onChange={(v) => set('feePressure', v)} hint="Applied equally with and without the MLO." />
          <fieldset className="calc-moves">
            <legend>Functions delivered by the MLO</legend>
            {FIRM_FUNCTIONS.map((f) => (
              <label key={f} className={`chip ${inp.moved[f] ? 'on' : ''}`}>
                <input type="checkbox" checked={inp.moved[f]} onChange={(e) => set('moved', { ...inp.moved, [f]: e.target.checked })} />
                {FIRM_LABELS[f]}
              </label>
            ))}
          </fieldset>
        </>
      }
      sankey={<Sankey data={data} ariaLabel="Where revenue goes, with the selected functions delivered by an MLO" />}
      kpis={
        <>
          <Kpi label="Revenue" value={money(r.withMlo.revenue)} />
          <Kpi label="Operating expense" value={money(r.withMlo.opex)} was={money(r.baseline.opex)} delta={signed(r.delta.opex)} good={r.delta.opex <= 0} />
          <Kpi label="Capital spend" value={money(r.withMlo.capex)} was={money(r.baseline.capex)} delta={signed(r.delta.capex)} good={r.delta.capex <= 0} />
          <Kpi label="Distributable profit" value={money(r.withMlo.profit)} was={money(r.baseline.profit)} delta={`${signed(r.delta.profit)} (${pct(r.delta.profitPct)})`} good={r.delta.profit >= 0} />
          <Kpi label="Profit margin" value={pct(r.withMlo.margin, 1)} was={pct(r.baseline.margin, 1)} />
        </>
      }
      note={
        <>
          {r.underwater ? <p className="calc-warn">In this scenario costs exceed revenue. Profit shown as zero in the diagram.</p> : null}
          <p>
            Technology moves from a capital project to a predictable operating cost. One-time transition cost: {money(r.transitionCost)}; year-one profit after
            transition: {money(r.yearOneProfit)}.
          </p>
        </>
      }
    />
  );
}

function CorporateCalculator() {
  const [inp, setInp] = useState<CorpInputs>(CORP_DEFAULTS);
  const r = useMemo(() => computeCorporate(inp), [inp]);
  const data = useMemo(() => corporateSankey(r), [r]);
  const set = <K extends keyof CorpInputs>(k: K, v: CorpInputs[K]) => setInp((p) => ({ ...p, [k]: v }));

  return (
    <Layout
      controls={
        <>
          <Slider id="c-budget" label="Annual legal operating budget" value={inp.budget} min={2_000_000} max={150_000_000} step={1_000_000} display={money(inp.budget)} onChange={(v) => set('budget', v)} />
          <Slider id="c-shift" label="Routine outside counsel work the MLO can handle" value={inp.shiftedShare} min={0} max={0.3} step={0.01} display={pct(inp.shiftedShare)} onChange={(v) => set('shiftedShare', v)} />
          <Slider id="c-adv" label="MLO unit price below your internal cost" value={inp.priceAdvantage} min={0} max={0.4} step={0.01} display={pct(inp.priceAdvantage)} onChange={(v) => set('priceAdvantage', v)} hint="Placeholder range." />
          <Slider id="c-matters" label="Matters per year" value={inp.matterCount} min={100} max={10000} step={100} display={inp.matterCount.toLocaleString()} onChange={(v) => set('matterCount', v)} />
          <fieldset className="calc-moves">
            <legend>Functions delivered by the MLO</legend>
            {CORP_FUNCTIONS.map((f) => (
              <label key={f} className={`chip ${inp.moved[f] ? 'on' : ''}`}>
                <input type="checkbox" checked={inp.moved[f]} onChange={(e) => set('moved', { ...inp.moved, [f]: e.target.checked })} />
                {CORP_LABELS[f]}
              </label>
            ))}
          </fieldset>
        </>
      }
      sankey={<Sankey data={data} ariaLabel="Where the legal budget goes, with the selected functions delivered by an MLO" />}
      kpis={
        <>
          <Kpi label="Total cost of legal" value={money(r.withMloTotal)} was={money(r.baselineTotal)} delta={`${signed(-r.savings)} (${pct(-r.savingsPct, 1)})`} good={r.savings >= 0} />
          <Kpi label="Outside counsel spend" value={money(r.outsideWithMlo)} was={money(r.outsideBaseline)} delta={signed(r.outsideWithMlo - r.outsideBaseline)} good />
          <Kpi label="Capital spend" value={money(r.capexWithMlo)} was={money(r.capexBaseline)} delta={signed(r.capexWithMlo - r.capexBaseline)} good={r.capexWithMlo <= r.capexBaseline} />
          <Kpi label="Cost per matter" value={money(r.costPerMatterWithMlo)} was={money(r.costPerMatterBaseline)} />
        </>
      }
      note={<p>Savings are the part of today’s spend that is no longer needed. Corporate arrangements have no ownership or equity element.</p>}
    />
  );
}

function Layout(props: { controls: ReactNode; sankey: ReactNode; kpis: ReactNode; note: ReactNode }) {
  return (
    <div className="calc">
      <div className="calc-controls">{props.controls}</div>
      <div className="calc-main">
        {props.sankey}
        <div className="calc-kpis">{props.kpis}</div>
        <div className="calc-note">{props.note}</div>
      </div>
    </div>
  );
}

/** Law firm and corporate calculators share one component and flip with the site-wide audience toggle. */
export function MloCalculator() {
  const { audience } = useAudience();
  return (
    <section className="calc-section" id="financial-opportunity" aria-labelledby="calc-title">
      <h2 id="calc-title">{audience === 'firm' ? 'See how the economics change' : 'See how the cost of legal changes'}</h2>
      {audience === 'firm' ? <FirmCalculator key="firm" /> : <CorporateCalculator key="corporate" />}
      <p className="calc-disclaimer">{ILLUSTRATIVE_NOTE}</p>
    </section>
  );
}
