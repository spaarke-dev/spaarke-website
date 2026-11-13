import type { Metadata } from "next";
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

type Loaded =
  | { kind: "notice"; text: string }
  | { kind: "manage"; start: string; durationMinutes: number; slots: string[] };

async function load(token: string): Promise<Loaded> {
  const config = getMeetConfig();
  if (!config || !token) return { kind: "notice", text: MESSAGES.invalid };
  try {
    const found = await lookupManagedBooking(config, token);
    if (!found.ok) return { kind: "notice", text: MESSAGES[found.reason] };
    const { event } = found.value;
    const slots = await getOpenSlots(config, { exclude: { start: event.start, end: event.end } });
    return {
      kind: "manage",
      start: new Date(event.start).toISOString(),
      durationMinutes: config.rules.durationMinutes,
      slots: slots.map((s) => new Date(s).toISOString()),
    };
  } catch (err) {
    console.error("[meet] manage page failed:", err);
    return { kind: "notice", text: MESSAGES.error };
  }
}

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
  const loaded = await load(token);

  return (
    <Slab tone="light">
      <Shell>
        <div className="mx-auto w-full max-w-5xl">
          <PageHeader eyebrow="Book a meeting" title="Manage your meeting" />
          {loaded.kind === "manage" ? (
            <ManageBooking
              token={token}
              start={loaded.start}
              durationMinutes={loaded.durationMinutes}
              initialSlots={loaded.slots}
            />
          ) : (
            <Notice text={loaded.text} />
          )}
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
