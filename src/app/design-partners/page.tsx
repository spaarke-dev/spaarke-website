import type { Metadata } from "next";
import Link from "next/link";
import {
  Button,
  Eyebrow,
  Heading,
  Lede,
  Shell,
  Slab,
} from "@/components/primitives";
import DesignPartnerForm from "@/components/DesignPartnerForm";
import { OverviewDownload } from "@/components/OverviewDownload";
import { SlideStrip } from "@/components/SlideStrip";

// Dynamic for the same reason as /access-request: the reCAPTCHA site key is an
// app setting read at request time, not a build-time value.
export const dynamic = "force-dynamic";

const TITLE = "Design Partner Program";
const DESCRIPTION =
  "Spaarke design partners are legal operations leaders in law departments and law firms who shape the product while we build it, with early access and free use of Spaarke.";
const OG_IMAGE = {
  url: "/design-partners/og.png",
  width: 1200,
  height: 630,
  alt: "Legal runs on decisions. Spaarke makes them intelligent.",
};

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/design-partners" },
  openGraph: {
    title: `${TITLE} | Spaarke`,
    description: DESCRIPTION,
    url: "/design-partners",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE.url],
  },
};

// Spaarke spectral palette, as under the /contact and /access-request headlines.
const SPECTRAL_GRADIENT =
  "linear-gradient(90deg, #000BFF 0%, #00F7FF 14%, #1AFF00 28%, #8CFF00 42%, #DBFF00 56%, #FFD200 70%, #FF9400 85%, #FF4600 100%)";

const CONTRIBUTE = [
  "Product direction: which decisions matter most to your legal operation, and which to address first.",
  "Functional requirements: how the work runs today, the rules it follows, and what a useful answer looks like.",
  "Feedback from the people who will use the platform, as each capability is built.",
];

const RECEIVE = [
  "A direct say in the direction of the product.",
  "Early access to new capabilities, before general release.",
  "Free access to Spaarke.",
];

export default function DesignPartners() {
  return (
    <>
      {/* Hero */}
      <Slab tone="dark" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 75% 60% at 30% 50%, rgba(130,165,235,0.18) 0%, rgba(80,120,220,0.08) 35%, rgba(130,165,235,0.03) 60%, transparent 78%)",
          }}
        />
        <Shell>
          <div className="relative mx-auto w-full max-w-6xl">
            <Eyebrow>Spaarke Design Partner Program</Eyebrow>
            <Heading level={1} className="mt-6 max-w-4xl">
              Legal runs on decisions. Help us make them intelligent.
            </Heading>
            <div
              aria-hidden="true"
              className="mt-8 h-[2px] w-72 max-w-full"
              style={{ background: SPECTRAL_GRADIENT }}
            />
            <Lede className="mt-8 max-w-3xl">
              Spaarke design partners are legal operations leaders in law
              departments and law firms who work with our product team while
              we build. Partners shape what Spaarke does next, get early access
              to new capabilities, and use Spaarke free of charge.
            </Lede>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button variant="primary" href="#apply" arrow>
                Apply to become a design partner
              </Button>
              <OverviewDownload location="hero" />
            </div>
          </div>
        </Shell>
      </Slab>

      {/* What partners contribute and receive */}
      <Slab tone="light">
        <Shell>
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-14 md:grid-cols-2 md:gap-20">
            {[
              { title: "Partners contribute", items: CONTRIBUTE },
              { title: "Partners receive", items: RECEIVE },
            ].map((col) => (
              <div key={col.title}>
                <Heading level={3}>{col.title}</Heading>
                <ul className="border-line mt-6 border-t">
                  {col.items.map((item) => (
                    <li
                      key={item}
                      className="border-line text-fg-mid border-b py-5 text-base leading-relaxed md:text-[17px]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Shell>
      </Slab>

      {/* The overview */}
      <Slab tone="light" className="pt-0">
        <Shell>
          <div className="mx-auto w-full max-w-6xl">
            <Eyebrow>The overview</Eyebrow>
            <Heading level={2} className="mt-4">
              Spaarke in nine slides
            </Heading>
            <p className="text-fg-mid mt-5 max-w-2xl text-base leading-relaxed md:text-[17px]">
              An intelligence layer across your systems of record, invoice
              review as a worked example, and the Spaarke Method for delivering
              it. Swipe through, or download the PDF.
            </p>
            <div className="mt-10">
              <SlideStrip />
            </div>
            <div className="mt-8">
              <OverviewDownload location="strip" />
            </div>
          </div>
        </Shell>
      </Slab>

      {/* The application */}
      <Slab tone="dark" className="relative overflow-hidden">
        <Shell>
          <div
            id="apply"
            className="relative mx-auto flex w-full max-w-6xl scroll-mt-32 flex-col gap-14 md:flex-row md:items-start md:gap-20 lg:gap-28"
          >
            <div className="md:flex-1">
              <Heading level={2}>Apply to become a design partner</Heading>
              <div className="text-fg-mid mt-8 max-w-md space-y-5 text-base leading-relaxed md:text-[17px]">
                <p>
                  The Spaarke team reads every application and replies by
                  email.
                </p>
                <p>
                  Tell us the decision you would start with. It is the
                  question the overview ends on, and the one every engagement
                  begins from.
                </p>
              </div>
              <div className="text-fg-low mt-12 space-y-3 text-sm">
                <p>
                  How an engagement runs:{" "}
                  <Link
                    href="/why-spaarke/the-spaarke-method"
                    className="text-cta-blue underline"
                  >
                    The Spaarke Method
                  </Link>
                </p>
                <p>
                  Have a question first?{" "}
                  <Link href="/contact" className="text-cta-blue underline">
                    Contact us
                  </Link>{" "}
                  instead.
                </p>
              </div>
            </div>
            <div className="md:flex-1 md:pt-2">
              <DesignPartnerForm
                recaptchaSiteKey={process.env.RECAPTCHA_SITE_KEY ?? ""}
              />
            </div>
          </div>
        </Shell>
      </Slab>
    </>
  );
}
