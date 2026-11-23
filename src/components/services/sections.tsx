"use client";

import { Fragment, type CSSProperties, type ReactNode } from "react";
import { Button, Eyebrow, Heading, Lede, SectionHead, Shell } from "@/components/primitives";
import {
  approach,
  closing,
  ctas,
  definitions,
  deptEstimate,
  disclaimers,
  estimate,
  faq,
  financial,
  hero,
  network,
  orderedStats,
  structure,
  whatIsMlo,
  whyNow,
} from "@/app/services/content";
import { AudienceProvider, AudienceSwitch, Flip, useAudience, type Audience } from "./audience";
import { HeroMedia } from "./HeroMedia";
import { StatTile } from "./StatTile";
import { StructureDiagram } from "./StructureDiagram";
import { OperatorNetwork } from "./OperatorNetwork";
import { Phases } from "./Phases";
import { EstimateCalculator } from "./estimate/EstimateCalculator";
import { useEstimateInputs } from "./estimate/state";
import { deptEstimateHref, estimateHref } from "./estimate/query";
import { DeptCalculator } from "./estimate/DeptCalculator";

/**
 * The /services page body. Everything below the site header is client-side
 * because the audience switch flips content in every section; the copy
 * itself is static and comes from src/app/services/content.ts.
 *
 * Section order and bands after review round 3 (2026-11-21): hero dark, why
 * now white, MSO and MLO definitions soft blue, what is MLO dark, financial
 * cream, network dark, approach tinted (raised cards and a dark panel, process
 * change list 2026-11-22), black closing.
 */

const SECTION_Y = "py-[clamp(80px,12vh,150px)]";
const CREAM: CSSProperties = { backgroundColor: "#f6f6f4" };
const WHITE: CSSProperties = { backgroundColor: "#ffffff" };
/** The site's dark glow (contact, design partners). */
const GLOW =
  "radial-gradient(ellipse 75% 60% at 30% 50%, rgba(130,165,235,0.18) 0%, rgba(80,120,220,0.08) 35%, rgba(130,165,235,0.03) 60%, transparent 78%)";

/**
 * Hidden in review round 2 until the owner decides where they go (task 060).
 * The content stays in content.ts.
 */
const SHOW_BENEFITS = false;
const SHOW_FAQ = false;
/**
 * Owner, 2026-11-22: the "Important information" block under the closing is
 * removed from the page. The text stays in content.ts (disclaimers) for
 * counsel to place elsewhere; the estimate keeps its own disclaimer.
 */
const SHOW_DISCLAIMERS = false;
/** Approach: a cool tint so the raised phase cards read as lifted. */
const TINT: CSSProperties = {
  backgroundColor: "#f3f5fa",
  backgroundImage:
    "radial-gradient(ellipse 70% 55% at 80% 0%, rgba(130,165,235,0.16) 0%, transparent 70%), linear-gradient(180deg, #f6f7fb 0%, #eef1f8 100%)",
};
const SOFT_BLUE: CSSProperties = {
  backgroundColor: "#ebf2ff",
  backgroundImage:
    "radial-gradient(ellipse 80% 70% at 50% 100%, rgba(80,120,220,0.18) 0%, rgba(130,165,235,0.08) 35%, transparent 70%), linear-gradient(135deg, #f0f5ff 0%, #ebf2ff 45%, #d2e1ff 100%)",
};

function Band({
  id,
  tone,
  style,
  className,
  children,
}: {
  id?: string;
  tone: "dark" | "light";
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-tone={tone}
      data-services-section={id ? "" : undefined}
      className={["bg-bg text-fg relative overflow-hidden", SECTION_Y, className].filter(Boolean).join(" ")}
      style={style}
    >
      {children}
    </section>
  );
}

function BoundaryLine({ dark }: { dark?: boolean }) {
  return (
    <p
      className="font-body max-w-3xl border-l-2 py-1 pl-5 text-[15px] leading-relaxed"
      style={{
        borderColor: "#5078DC",
        color: dark ? "rgba(255,255,255,0.78)" : "rgba(10,10,10,0.72)",
      }}
    >
      {whatIsMlo.boundaryLine}
    </p>
  );
}

/* ------------------------------------------------------------------ */

export function ServicesPage({ initialAudience, fromUrl }: { initialAudience: Audience; fromUrl: boolean }) {
  return (
    <AudienceProvider initial={initialAudience} fromUrl={fromUrl}>
      <Hero />
      <WhyNow />
      <Definitions />
      <WhatIsMlo />
      <Financial />
      <Network />
      <Approach />
      {SHOW_FAQ ? <Faq /> : null}
      <Closing />
    </AudienceProvider>
  );
}

/* 1. Hero ------------------------------------------------------------ */

function Hero() {
  const { audience } = useAudience();
  return (
    <section
      data-tone="dark"
      className="bg-bg text-fg relative isolate overflow-hidden"
      style={{ minHeight: "92vh" }}
    >
      {/* Backdrop: video on the right, washed into the dark page with the
          site's blue glow, like the Platform hero's backdrop. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <HeroMedia />
        {/* Phones and tablets: the video sits behind the text, so dim it evenly. */}
        <div className="absolute inset-0 bg-[rgba(10,10,10,0.72)] lg:hidden" />
        {/* Desktop: dissolve the video's left edge into the page. */}
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(90deg, #0a0a0a 0%, rgba(10,10,10,0.96) 32%, rgba(10,10,10,0.72) 46%, rgba(10,10,10,0.38) 62%, rgba(10,10,10,0.22) 80%, rgba(10,10,10,0.22) 100%)",
          }}
        />
        {/* Top and bottom fades so the hero meets the header and the next band softly. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0) 18%, rgba(10,10,10,0) 70%, #0a0a0a 100%)",
          }}
        />
        <div className="absolute inset-0" style={{ background: GLOW }} />
      </div>

      <div
        className="relative z-10 mx-auto flex max-w-[1440px] items-center px-[var(--spacing-shell-x)]"
        style={{ minHeight: "inherit" }}
      >
        <div className="max-w-3xl py-[clamp(56px,9vh,110px)]">
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          {/* Title type matches the Platform hero; the subhead uses the home hero's Lede. */}
          <h1
            className="font-display text-fg mt-6"
            style={{ fontSize: "clamp(56px, 7vw, 112px)", lineHeight: 0.98, letterSpacing: "-0.025em", fontWeight: 600 }}
          >
            {hero.headline[0]}
            <br />
            <span className="text-fg-mid">{hero.headline[1]}</span>
          </h1>
          <Flip className="mt-8 max-w-xl">
            <Lede>{hero.subhead[audience]}</Lede>
          </Flip>
          <AudienceSwitch className="mt-10" />
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Button variant="text" href={hero.primaryCta[audience].href} arrow>
              {hero.primaryCta[audience].label}
            </Button>
            <Button variant="text" href={hero.secondaryCta.href}>
              {hero.secondaryCta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 2. Why now --------------------------------------------------------- */

function WhyNow() {
  const { audience } = useAudience();
  const stats = orderedStats(audience);
  return (
    <Band id={whyNow.id} tone="light" style={WHITE}>
      <Shell>
        <SectionHead
          center
          eyebrow={whyNow.eyebrow}
          title={whyNow.title}
          intro={<Flip as="span">{whyNow.intro[audience]}</Flip>}
        />
        {/* Two by two, four stats per audience (review round 3). */}
        <Flip className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2">
          {stats.map((s) => (
            <StatTile key={s.id} stat={s} tone="light" />
          ))}
        </Flip>
      </Shell>
    </Band>
  );
}

/* 3. Definitions: MSO and MLO --------------------------------------- */

/** Review round 3 (2026-11-21): replaces the profit-pool highlight band (owner mockup). */
function Definitions() {
  const { audience } = useAudience();
  const terms = [definitions.mso, definitions.mlo];
  return (
    <section
      id={definitions.id}
      data-tone="light"
      data-services-section=""
      className="bg-bg text-fg relative overflow-hidden py-[clamp(64px,9vh,110px)]"
      style={SOFT_BLUE}
    >
      <Shell>
        <h2 className="sr-only">{definitions.title}</h2>
        <Flip>
          <dl className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-14">
            {terms.map((t, i) => (
              <Fragment key={t.abbr}>
                {i === 1 ? (
                  <div aria-hidden="true" className="hidden w-px self-stretch bg-[rgba(63,95,217,0.45)] lg:block" />
                ) : null}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                  <span
                    aria-hidden="true"
                    className="font-display text-fg flex h-[120px] w-[120px] shrink-0 items-center justify-center rounded-3xl border border-[rgba(10,10,10,0.12)] bg-white text-[40px] font-semibold tracking-[-0.02em] shadow-[0_8px_30px_rgba(63,95,217,0.10)] md:h-[148px] md:w-[148px] md:text-[48px]"
                  >
                    {t.abbr}
                  </span>
                  <div>
                    <dt className="font-display text-fg text-[clamp(20px,1.6vw,24px)] font-medium tracking-[-0.01em]">
                      {t.term} <span className="sr-only">({t.abbr})</span>
                    </dt>
                    <dd className="text-fg-mid mt-3 text-[16px] leading-relaxed">{t.body[audience]}</dd>
                  </div>
                </div>
              </Fragment>
            ))}
          </dl>
        </Flip>
      </Shell>
    </section>
  );
}

/* 4. What is MLO (with how it works) --------------------------------- */

function WhatIsMlo() {
  const { audience } = useAudience();
  return (
    <Band id={whatIsMlo.id} tone="dark">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: GLOW }} />
      <Shell className="relative">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHead eyebrow={whatIsMlo.eyebrow} title={<Flip as="span">{structure.title[audience]}</Flip>} />
          <div className="lg:pt-12">
            <Flip>
              <Lede>{structure.lede[audience]}</Lede>
            </Flip>
            <div className="mt-8">
              <BoundaryLine dark />
            </div>
          </div>
        </div>
        {/* The MSO structure visual (handoff 2026-11-22) replaces the allocation diagram. */}
        <Flip className="mt-14">
          <StructureDiagram title={structure.diagramTitle} />
        </Flip>

        {SHOW_BENEFITS ? <Benefits /> : null}
      </Shell>
    </Band>
  );
}

/** "What firms gain" / "What legal departments gain" with the "Why Spaarke" list. Hidden (task 060). */
function Benefits() {
  const { audience } = useAudience();
  return (
    <div className="mt-24 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
      <div>
        <Flip>
          <h3 className="font-display text-fg text-[clamp(24px,2.2vw,34px)] font-medium tracking-[-0.02em]">
            {whatIsMlo.benefitsTitle[audience]}
          </h3>
        </Flip>
        <p className="font-mono-display text-fg-low mt-8 text-[11px] uppercase tracking-[0.16em]">Why Spaarke</p>
        <ul className="text-fg-mid mt-3 space-y-2 text-[14px] leading-relaxed">
          {whatIsMlo.differentiators.map((d) => (
            <li key={d} className="flex gap-3">
              <span aria-hidden="true" className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#5078DC]" />
              {d}
            </li>
          ))}
        </ul>
      </div>
      <Flip>
        <ul className="grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2">
          {whatIsMlo.benefits[audience].map((b) => (
            <li key={b.title}>
              <p className="text-fg text-[17px] font-medium">{b.title}</p>
              <p className="text-fg-mid mt-1 text-[15px] leading-relaxed">{b.body}</p>
            </li>
          ))}
        </ul>
      </Flip>
    </div>
  );
}

/* 6. Operating company and network ---------------------------------- */

function Network() {
  const { audience } = useAudience();
  return (
    <Band id={network.id} tone="dark">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: GLOW }} />
      <Shell className="relative">
        <SectionHead
          eyebrow={network.eyebrow}
          title={network.title}
          intro={<Flip as="span">{network.intro[audience]}</Flip>}
        />
        {/* The operator network (handoff 2026-11-22), converted to the dark band. */}
        <Flip className="mt-14">
          <OperatorNetwork />
        </Flip>
      </Shell>
    </Band>
  );
}

/* 5. Financial opportunity ------------------------------------------ */

function Financial() {
  const { audience } = useAudience();
  return (
    <Band id={financial.id} tone="light" style={CREAM}>
      <Shell>{audience === "firm" ? <FirmEstimate /> : <DeptEstimate />}</Shell>
    </Band>
  );
}

/**
 * Law firm view (task 070, 2026-11-22): the MSO value estimate. "See the
 * details" opens /services/estimate as a modal over this page.
 */
function FirmEstimate() {
  const { firm, setFirm } = useEstimateInputs();
  return (
    <>
      <div className="max-w-4xl">
        <Eyebrow>{financial.eyebrow}</Eyebrow>
        <Flip>
          <Heading level={2} className="mt-5 text-balance">
            {estimate.title}
          </Heading>
          <div className="mt-6 max-w-3xl">
            <Lede>{estimate.lede}</Lede>
          </div>
        </Flip>
      </div>
      <div className="mt-14">
        <EstimateCalculator
          inputs={firm}
          onChange={setFirm}
          detailsHref={estimateHref(firm)}
          detailsScroll={false}
        />
      </div>
    </>
  );
}

/**
 * Legal department view (task 071, 2026-11-22): the department equivalent of
 * the MSO value estimate. No equity figures. "See the details" opens
 * /services/estimate?audience=corporate as a modal over this page.
 */
function DeptEstimate() {
  const { dept, setDept } = useEstimateInputs();
  return (
    <>
      <div className="max-w-4xl">
        <Eyebrow>{financial.eyebrow}</Eyebrow>
        <Flip>
          <Heading level={2} className="mt-5 text-balance">
            {deptEstimate.title}
          </Heading>
          <div className="mt-6 max-w-3xl">
            <Lede>{deptEstimate.lede}</Lede>
          </div>
        </Flip>
      </div>
      <div className="mt-14">
        <DeptCalculator inputs={dept} onChange={setDept} detailsHref={deptEstimateHref(dept)} detailsScroll={false} />
      </div>
    </>
  );
}

/* 7. Approach -------------------------------------------------------- */

function Approach() {
  return (
    <Band id={approach.id} tone="light" style={TINT}>
      <Shell>
        <SectionHead
          eyebrowClassName="text-[rgba(10,10,10,0.72)]!"
          eyebrow={approach.eyebrow}
          title={approach.title.split(". ").map((t, i, all) => (
            <span key={t} className="block">
              {i < all.length - 1 ? `${t}.` : t}
            </span>
          ))}
        />
        <div className="mt-16">
          <Phases />
        </div>
        <div className="mt-12 max-w-2xl">
          <p className="text-[16px] leading-relaxed text-[rgba(10,10,10,0.78)]">{approach.method.text}</p>
          <div className="mt-3">
            <Button variant="text" href={approach.method.link.href} arrow>
              {approach.method.link.label}
            </Button>
          </div>
        </div>
        {/* Owner, 2026-11-22: no assessment button here; the closing section carries the calls to action. */}
      </Shell>
    </Band>
  );
}

/* 8. FAQ (hidden), closing, disclaimers -------------------------------------- */

function Faq() {
  return (
    <Band id={faq.id} tone="light" style={CREAM}>
      <Shell>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <Eyebrow>{faq.eyebrow}</Eyebrow>
            <h2 className="font-display text-fg mt-5 text-[clamp(30px,3.2vw,48px)] font-medium leading-[1.05] tracking-[-0.025em]">
              {faq.title}
            </h2>
          </div>
          <div className="border-line-strong border-t">
            {faq.items.map((item) => (
              <details key={item.q} className="group border-line-strong border-b">
                <summary className="font-display text-fg flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[19px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5078DC] [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span aria-hidden="true" className="text-[22px] font-light text-[#3F5FD9] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="text-fg-mid max-w-3xl pb-6 text-[16px] leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Shell>
    </Band>
  );
}

function Closing() {
  const { audience } = useAudience();
  return (
    <section
      data-tone="dark"
      className="relative overflow-hidden"
      style={{ backgroundColor: "#000000", paddingTop: "clamp(80px, 10vh, 120px)", paddingBottom: "clamp(80px, 10vh, 120px)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 75% 55% at 50% 35%, rgba(130,165,235,0.18) 0%, rgba(80,120,220,0.08) 35%, rgba(130,165,235,0.03) 60%, transparent 78%)",
        }}
      />
      <Shell className="relative">
        <div className="mx-auto max-w-4xl text-center">
          <h2
            className="font-display text-fg font-medium tracking-[-0.03em] text-balance"
            style={{ fontSize: "clamp(36px, 5.4vw, 76px)", lineHeight: 1.02 }}
          >
            {closing.title}
          </h2>
          <Flip className="mt-6">
            <Lede>{closing.body[audience]}</Lede>
          </Flip>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="primary" href={ctas.conversation.href} arrow>
              {ctas.conversation.label}
            </Button>
            <Button variant="text" href={ctas.assessment.href} arrow>
              {ctas.assessment.label}
            </Button>
          </div>
        </div>

        {SHOW_DISCLAIMERS ? (
          <div className="border-line mx-auto mt-24 max-w-5xl border-t pt-8">
            <p className="font-mono-display text-fg-low text-[11px] uppercase tracking-[0.16em]">Important information</p>
            <ul className="text-fg-low mt-4 grid grid-cols-1 gap-x-10 gap-y-2 text-[12px] leading-relaxed md:grid-cols-2">
              {disclaimers.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </Shell>
    </section>
  );
}
