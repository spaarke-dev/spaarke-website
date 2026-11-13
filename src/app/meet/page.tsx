import type { Metadata } from "next";
import Link from "next/link";
import { Button, PageHeader, Shell, Slab } from "@/components/primitives";
import { BookingsNewTabLink } from "@/components/BookingsNewTabLink";
import { MeetBookingFlow } from "@/components/meet/MeetBookingFlow";
import { getBookingsPageUrl } from "@/lib/bookings";
import { trackException } from "@/lib/logger";
import { getMeetConfig, wantsGraphMode } from "@/lib/meet/config";
import { getOpenSlots } from "@/lib/meet/service";
import { isStorageConfigured } from "@/lib/meet/store";

// Dynamic because the booking mode, the Bookings URL, and the open slots are
// all read at request time.
export const dynamic = "force-dynamic";

const TITLE = "Meet the Spaarke Team";
const DESCRIPTION =
  "Book a meeting with the Spaarke team. Choose a time and receive a calendar invitation with a Microsoft Teams link.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/meet" },
  openGraph: {
    title: `${TITLE} | Spaarke`,
    description: DESCRIPTION,
    url: "/meet",
  },
};

type GraphFlow = { slots: string[]; durationMinutes: number };

/**
 * The Graph booking flow, when MEET_BOOKING_MODE=graph and every setting it
 * needs is present and Graph answers. Null means fall back: to the Bookings
 * embed when its URL is set, otherwise to /contact. The fallback is decided
 * per request, so a Graph outage degrades the page rather than breaking it.
 */
async function loadGraphFlow(): Promise<GraphFlow | null> {
  if (!wantsGraphMode()) return null;
  const config = getMeetConfig();
  if (!config || !isStorageConfigured()) {
    console.warn("[meet] MEET_BOOKING_MODE=graph but Graph or storage settings are missing; falling back.");
    return null;
  }
  try {
    const slots = await getOpenSlots(config);
    return {
      slots: slots.map((s) => new Date(s).toISOString()),
      durationMinutes: config.rules.durationMinutes,
    };
  } catch (err) {
    console.error("[meet] availability failed; falling back:", err);
    trackException(err instanceof Error ? err : new Error(String(err)), { step: "meet.page" });
    return null;
  }
}

const CONTACT_LINE = (
  <p>
    Prefer to write first?{" "}
    <Link href="/contact" className="text-cta-blue underline">
      Contact us
    </Link>
    .
  </p>
);

export default async function Meet() {
  const graph = await loadGraphFlow();
  const bookingsUrl = graph ? null : getBookingsPageUrl();
  const canBook = Boolean(graph || bookingsUrl);

  return (
    <Slab tone="light">
      <Shell>
        <div className="mx-auto w-full max-w-5xl">
          <PageHeader
            eyebrow="Meet the Spaarke team"
            title="Book time with us"
            lede={
              canBook
                ? "Choose a time that works for you. You will receive a calendar invitation with a Microsoft Teams link."
                : "Online booking is not available right now. Send us a note and we will propose times by email."
            }
          />

          {graph ? (
            <>
              <MeetBookingFlow
                initialSlots={graph.slots}
                durationMinutes={graph.durationMinutes}
                recaptchaSiteKey={process.env.RECAPTCHA_SITE_KEY ?? ""}
              />
              <div className="text-fg-low mt-10 space-y-3 text-sm">{CONTACT_LINE}</div>
            </>
          ) : bookingsUrl ? (
            <>
              <div className="border-line mt-12 overflow-hidden rounded-xl border bg-white">
                <iframe
                  src={bookingsUrl}
                  title="Book a meeting with the Spaarke team"
                  // Sized to the Bookings page's full height (about 2,140px
                  // on desktop and 2,230px on phones, November 2026) so the
                  // calendar and form show without a scrollbar inside the frame.
                  className="block h-[2400px] w-full md:h-[2250px]"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
              <div className="text-fg-low mt-6 space-y-3 text-sm">
                <p>
                  Trouble with the calendar above?{" "}
                  <BookingsNewTabLink href={bookingsUrl} />.
                </p>
                {CONTACT_LINE}
              </div>
            </>
          ) : (
            <div className="mt-10">
              <Button variant="primary" href="/contact" arrow>
                Contact us
              </Button>
            </div>
          )}
        </div>
      </Shell>
    </Slab>
  );
}
