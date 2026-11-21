"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  ArrowTrendingDown24Regular,
  Briefcase24Regular,
  Gavel24Regular,
  LockClosed24Regular,
  PeopleTeam24Regular,
  Receipt24Regular,
} from "@fluentui/react-icons";
import { Button, Eyebrow, Heading, Lede, Shell } from "@/components/primitives";
import {
  anchors,
  approach,
  closing,
  ctas,
  disclaimers,
  faq,
  financial,
  hero,
  howItWorks,
  network,
  orderedStats,
  whatIsMlo,
  whyNow,
} from "@/app/services/content";
import { AudienceProvider, Flip, useAudience, type Audience } from "./audience";
import { PageBar } from "./PageBar";
import { StatTile } from "./StatTile";
import { AllocationDiagram, ServiceMenu } from "./AllocationDiagram";
import { NetworkDiagram } from "./NetworkDiagram";
import { Phases } from "./Phases";
import { Calculator } from "./calculator/Calculator";

/**
 * The /services page body. Everything below the site header is client-side
 * because the audience switch flips content in every section; the copy
 * itself is static and comes from src/app/services/content.ts.
 *
 * Section bands follow design.md section 0: hero dark, cream, dark, soft
 * blue, dark, cream, dark, cream, black closing.
 */

const SECTION_Y = "py-[clamp(80px,12vh,150px)]";
const CREAM: CSSProperties = { backgroundColor: "#f6f6f4" };
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

function SectionHead({
  eyebrow,
  title,
  intro,
  center,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-4xl text-center" : "max-w-4xl"}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading level={2} className="mt-5 text-balance">
        {title}
      </Heading>
      {intro ? (
        <div className={center ? "mx-auto mt-6 max-w-3xl" : "mt-6 max-w-3xl"}>
          <Lede>{intro}</Lede>
        </div>
      ) : null}
    </div>
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
      <PageBar anchors={anchors} cta={ctas.conversation} />
      <Hero />
      <WhatIsMlo />
      <WhyNow />
      <HowItWorks />
      <Network />
      <Financial />
      <Approach />
      <Faq />
      <Closing />
    </AudienceProvider>
  );
}

/* 1. Hero ------------------------------------------------------------ */

function Hero() {
  const { audience } = useAudience();
  return (
    <section data-tone="dark" className="bg-bg text-fg relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 20% 40%, rgba(130,165,235,0.14) 0%, rgba(80,120,220,0.05) 40%, rgba(0,0,0,0) 70%)",
        }}
      />
      <Shell className="relative">
        <div className="grid grid-cols-1 items-center gap-12 py-[clamp(56px,9vh,110px)] lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <Eyebrow>{hero.eyebrow}</Eyebrow>
            <h1
              className="font-display text-fg mt-6 font-semibold"
              style={{ fontSize: "clamp(48px, 6.4vw, 100px)", lineHeight: 0.98, letterSpacing: "-0.03em" }}
            >
              {hero.headline[0]}
              <br />
              <span className="text-fg-mid">{hero.headline[1]}</span>
            </h1>
            <Flip className="mt-8 max-w-xl">
              <Lede>{hero.subhead[audience]}</Lede>
            </Flip>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button variant="primary" href={hero.primaryCta[audience].href} arrow>
                {hero.primaryCta[audience].label}
              </Button>
              <Button variant="text" href={hero.secondaryCta.href}>
                {hero.secondaryCta.label}
              </Button>
            </div>
          </div>
          <HeroImage />
        </div>
      </Shell>
    </section>
  );
}

function HeroImage() {
  // Placeholder frame until the commissioned photograph exists (design.md section 8).
  return (
    <div
      role="img"
      aria-label={hero.image.alt}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border sm:aspect-[16/11] lg:aspect-[4/5]"
      style={{
        borderColor: "rgba(255,255,255,0.10)",
        background:
          "linear-gradient(160deg, #2a2724 0%, #1b1a18 45%, #101010 100%), radial-gradient(ellipse at 30% 30%, rgba(255,214,170,0.20), transparent 60%)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 35% 30%, rgba(255,220,180,0.22) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 70% 75%, rgba(130,165,235,0.16) 0%, transparent 70%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="font-mono-display text-[11px] uppercase tracking-[0.16em] text-[rgba(255,255,255,0.6)]">
          Placeholder: hero photograph
        </p>
        <p className="font-body mt-2 max-w-sm text-[14px] leading-relaxed text-[rgba(255,255,255,0.72)]">
          A lawyer and an operations teammate at work together, in natural light, in a real office. Commissioned or
          exclusively licensed.
        </p>
      </div>
    </div>
  );
}

/* 2. What is MLO ----------------------------------------------------- */

const REQUIREMENT_ICONS: Record<string, ReactNode> = {
  independence: <Gavel24Regular />,
  privilege: <LockClosed24Regular />,
  matters: <Briefcase24Regular />,
  fees: <Receipt24Regular />,
  compensation: <PeopleTeam24Regular />,
  billing: <ArrowTrendingDown24Regular />,
};

function WhatIsMlo() {
  const { audience } = useAudience();
  return (
    <Band id={whatIsMlo.id} tone="light" style={CREAM}>
      <Shell>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <SectionHead eyebrow={whatIsMlo.eyebrow} title={whatIsMlo.title} />
            <p className="font-body text-fg mt-8 max-w-2xl text-[clamp(19px,1.5vw,24px)] leading-[1.5]">
              {whatIsMlo.definition}
            </p>
            <p className="text-fg-mid mt-5 max-w-2xl text-[16px] leading-relaxed">{whatIsMlo.msoNote}</p>
          </div>
          <SplitGraphic />
        </div>

        {/* Why legal is different */}
        <div className="mt-24">
          <h3 className="font-display text-fg text-[clamp(24px,2.2vw,34px)] font-medium tracking-[-0.02em]">
            {whatIsMlo.whyLegalIsDifferent.title}
          </h3>
          <p className="text-fg-mid mt-3 max-w-2xl text-[16px] leading-relaxed">{whatIsMlo.whyLegalIsDifferent.intro}</p>
          <ul className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {whatIsMlo.whyLegalIsDifferent.items.map((item) => (
              <li key={item.id} className="border-line-strong flex gap-4 border-t pt-5">
                <span className="mt-0.5 shrink-0 text-[#3F5FD9]" aria-hidden="true">
                  {REQUIREMENT_ICONS[item.id]}
                </span>
                <div>
                  <p className="text-fg text-[17px] font-medium">{item.title}</p>
                  <p className="text-fg-mid mt-1 text-[15px] leading-relaxed">{item.caption}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits (flip) */}
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

        <div className="mt-16">
          <BoundaryLine />
        </div>
      </Shell>
    </Band>
  );
}

function SplitGraphic() {
  const { practice, business, connector } = whatIsMlo.split;
  return (
    <div className="flex flex-col justify-center" aria-label="The practice of law and the business of law, joined by a services agreement" role="group">
      <div className="rounded-3xl border border-[rgba(10,10,10,0.12)] bg-white p-6">
        <p className="font-display text-fg text-[20px] font-medium">{practice.title}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {practice.items.map((i) => (
            <li key={i} className="rounded-full border border-[rgba(10,10,10,0.14)] bg-[#f6f6f4] px-3 py-1.5 text-[14px]">
              {i}
            </li>
          ))}
        </ul>
      </div>
      <div className="relative flex h-16 items-center justify-center" aria-hidden="false">
        <div aria-hidden="true" className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[rgba(10,10,10,0.25)]" />
        <span className="font-mono-display relative rounded-full border border-[rgba(10,10,10,0.18)] bg-[#f6f6f4] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[rgba(10,10,10,0.7)]">
          {connector}
        </span>
      </div>
      <div className="rounded-3xl border p-6" style={{ borderColor: "rgba(80,120,220,0.45)", backgroundColor: "rgba(80,120,220,0.08)" }}>
        <p className="font-display text-fg text-[20px] font-medium">{business.title}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {business.items.map((i) => (
            <li key={i} className="rounded-full bg-[#5078DC] px-3 py-1.5 text-[14px] text-white">
              {i}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* 3. Why now --------------------------------------------------------- */

function WhyNow() {
  const { audience } = useAudience();
  const stats = orderedStats(audience);
  return (
    <Band id={whyNow.id} tone="dark">
      <Shell>
        <SectionHead
          eyebrow={whyNow.eyebrow}
          title={whyNow.title}
          intro={<Flip as="span">{whyNow.intro[audience]}</Flip>}
        />
        <Flip className="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
          {stats.map((s) => (
            <StatTile key={s.id} stat={s} />
          ))}
        </Flip>

        <aside
          className="mt-16 rounded-3xl border p-8 md:p-10"
          style={{ backgroundColor: "#111111", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <p className="font-display text-fg text-[clamp(22px,2vw,30px)] font-medium tracking-[-0.015em]">
            {whyNow.nuance.title}
          </p>
          <p className="text-fg-mid mt-4 max-w-3xl text-[16px] leading-relaxed">{whyNow.nuance.body}</p>
          <p className="font-mono-display text-fg-low mt-5 text-[11px] uppercase tracking-wider">
            Source: {whyNow.nuance.source.name}
          </p>
        </aside>

        <p
          className="font-display text-fg mx-auto mt-20 max-w-4xl text-center font-medium tracking-[-0.02em] text-balance"
          style={{ fontSize: "clamp(26px, 3vw, 44px)", lineHeight: 1.15 }}
        >
          {whyNow.bridge}
        </p>
      </Shell>
    </Band>
  );
}

/* 4. How it works ---------------------------------------------------- */

function HowItWorks() {
  const { audience } = useAudience();
  return (
    <Band id={howItWorks.id} tone="light" style={SOFT_BLUE}>
      <Shell>
        <SectionHead
          eyebrow={howItWorks.eyebrow}
          title={howItWorks.title}
          intro={<Flip as="span">{howItWorks.intro[audience]}</Flip>}
        />
        <Flip className="mt-14">
          <AllocationDiagram />
        </Flip>
        <div className="mt-10">
          <BoundaryLine />
        </div>

        <div className="mt-20 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <h3 className="font-display text-fg text-[clamp(24px,2.2vw,34px)] font-medium tracking-[-0.02em]">
              {howItWorks.tailored.title}
            </h3>
            <p className="text-fg-mid mt-3 max-w-md text-[16px] leading-relaxed">{howItWorks.tailored.body}</p>
            <p className="text-fg mt-6 text-[16px]">
              {howItWorks.operatorNote}{" "}
              <a href={`#${network.id}`} className="font-medium text-[#3F5FD9] underline underline-offset-4">
                How the network works
              </a>
            </p>
          </div>
          <Flip className="rounded-3xl border border-[rgba(10,10,10,0.1)] bg-white p-6">
            <ServiceMenu />
          </Flip>
        </div>
      </Shell>
    </Band>
  );
}

/* 5. Operating company and network ---------------------------------- */

function Network() {
  const { audience } = useAudience();
  return (
    <Band id={network.id} tone="dark">
      <Shell>
        <SectionHead
          eyebrow={network.eyebrow}
          title={network.title}
          intro={<Flip as="span">{network.intro[audience]}</Flip>}
        />
        <Flip className="mt-14">
          <NetworkDiagram />
        </Flip>
        <ul className="mt-16 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {network.blocks.map((b) => (
            <li key={b.title} className="border-line-strong border-t pt-5">
              <p className="text-fg text-[17px] font-medium">{b.title}</p>
              <p className="text-fg-mid mt-2 text-[15px] leading-relaxed">{b.body}</p>
            </li>
          ))}
        </ul>
        {audience === "corporate" ? (
          <Flip className="mt-10 max-w-3xl rounded-2xl border border-[rgba(80,120,220,0.45)] bg-[rgba(80,120,220,0.08)] p-6">
            <p className="text-fg text-[17px] font-medium">{network.corporateBlock.title}</p>
            <p className="text-fg-mid mt-2 text-[15px] leading-relaxed">{network.corporateBlock.body}</p>
          </Flip>
        ) : null}
        <div className="mt-10">
          <Button variant="text" href={network.platformLink.href} arrow>
            {network.platformLink.label}
          </Button>
        </div>
      </Shell>
    </Band>
  );
}

/* 6. Financial opportunity ------------------------------------------ */

function Financial() {
  const { audience } = useAudience();
  return (
    <Band id={financial.id} tone="light" style={CREAM}>
      <Shell>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <div className="max-w-4xl">
            <Eyebrow>{financial.eyebrow}</Eyebrow>
            <Flip>
              <Heading level={2} className="mt-5 text-balance">
                {financial.title[audience]}
              </Heading>
            </Flip>
          </div>
          <Flip>
            <p className="text-fg-mid text-[16px] leading-relaxed">{financial.narrative[audience]}</p>
            <p className="text-fg-mid mt-3 text-[16px] leading-relaxed">{financial.networkValue}</p>
            {audience === "firm" ? (
              <p className="text-fg-low mt-3 text-[14px] leading-relaxed">{financial.capitalNote}</p>
            ) : null}
          </Flip>
        </div>
        <div className="mt-14">
          <Calculator cta={ctas.numbers} />
        </div>
      </Shell>
    </Band>
  );
}

/* 7. Approach -------------------------------------------------------- */

function Approach() {
  return (
    <Band id={approach.id} tone="dark">
      <Shell>
        <SectionHead eyebrow={approach.eyebrow} title={approach.title} />
        <div className="mt-16">
          <Phases />
        </div>
        <div className="mt-14">
          <Button variant="primary" href={ctas.assessment.href} arrow>
            {ctas.assessment.label}
          </Button>
        </div>
      </Shell>
    </Band>
  );
}

/* 8. FAQ, closing, disclaimers -------------------------------------- */

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
      style={{ backgroundColor: "#000000", paddingTop: "clamp(80px, 10vh, 120px)", paddingBottom: "clamp(56px, 8vh, 96px)" }}
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

        <div className="border-line mx-auto mt-24 max-w-5xl border-t pt-8">
          <p className="font-mono-display text-fg-low text-[11px] uppercase tracking-[0.16em]">Important information</p>
          <ul className="text-fg-low mt-4 grid grid-cols-1 gap-x-10 gap-y-2 text-[12px] leading-relaxed md:grid-cols-2">
            {disclaimers.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </Shell>
    </section>
  );
}
