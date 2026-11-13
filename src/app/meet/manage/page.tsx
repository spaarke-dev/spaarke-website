import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Button, PageHeader, Shell, Slab } from "@/components/primitives";
import { ManageBooking } from "@/components/meet/ManageBooking";
import { getMeetConfig } from "@/lib/meet/config";
import { lookupManagedBooking } from "@/lib/meet/routes";
import { getOpenSlots } from "@/lib/meet/service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Your Meeting",
  robots: { index: false, follow: false },
};

const MESSAGES: Record<string, string> = {
  invalid: "This link is not valid. Please use the link in your calendar invitation.",
  expired: "This link has expired. Book a new time, or reply to the invitation and we will sort it out.",
  cancelled: "This meeting has been cancelled.",
  past: "This meeting has already taken place.",
  unavailable: "We could not find this meeting. Reply to the invitation and we will sort it out.",
  error: "We could not load your meeting just now. Please try again in a few minutes.",
};

/**
 * Reschedule or cancel a meeting booked on /meet. Reached only through the
 * signed link in the invitation. It works whenever the Graph settings are
 * present, even if /meet has been switched back to the Bookings embed, so
 * links already sent keep working through a rollback.
 */
export default async function ManageMeeting({
  searchParams,
}: {
  searchParams: Promise<{ t?: string | string[] }>;
}) {
  const { t } = await searchParams;
  const token = typeof t === "string" ? t : "";
  const config = getMeetConfig();

  let content: ReactNode;
  if (!config || !token) {
    content = <Notice text={MESSAGES.invalid} />;
  } else {
    try {
      const found = await lookupManagedBooking(config, token);
      if (!found.ok) {
        content = <Notice text={MESSAGES[found.reason]} />;
      } else {
        const { event } = found.value;
        const slots = await getOpenSlots(config, { exclude: { start: event.start, end: event.end } });
        content = (
          <ManageBooking
            token={token}
            start={new Date(event.start).toISOString()}
            durationMinutes={config.rules.durationMinutes}
            initialSlots={slots.map((s) => new Date(s).toISOString())}
          />
        );
      }
    } catch (err) {
      console.error("[meet] manage page failed:", err);
      content = <Notice text={MESSAGES.error} />;
    }
  }

  return (
    <Slab tone="light">
      <Shell>
        <div className="mx-auto w-full max-w-5xl">
          <PageHeader eyebrow="Meet the Spaarke team" title="Manage your meeting" />
          {content}
        </div>
      </Shell>
    </Slab>
  );
}

function Notice({ text }: { text: string }) {
  return (
    <div className="mt-12">
      <p className="text-fg-mid text-base md:text-[17px]">{text}</p>
      <div className="mt-8">
        <Button variant="primary" href="/meet" arrow>
          Book a time
        </Button>
      </div>
    </div>
  );
}
