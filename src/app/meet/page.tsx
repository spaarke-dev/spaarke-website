import type { Metadata } from "next";
import Link from "next/link";
import { Button, PageHeader, Shell, Slab } from "@/components/primitives";
import { BookingsNewTabLink } from "@/components/BookingsNewTabLink";
import { getBookingsPageUrl } from "@/lib/bookings";

// Dynamic because the Bookings URL is an app setting read at request time,
// the same way /contact reads its reCAPTCHA key.
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

export default function Meet() {
  const bookingsUrl = getBookingsPageUrl();

  return (
    <Slab tone="light">
      <Shell>
        <div className="mx-auto w-full max-w-5xl">
          <PageHeader
            eyebrow="Book a meeting"
            title="Let’s meet"
            lede={
              bookingsUrl
                ? "Choose a time that works for you. You will receive a calendar invitation with a Microsoft Teams link."
                : "Online booking is not available right now. Send us a note and we will propose times by email."
            }
          />

          {bookingsUrl ? (
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
                <p>
                  Prefer to write first?{" "}
                  <Link href="/contact" className="text-cta-blue underline">
                    Contact us
                  </Link>
                  .
                </p>
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
