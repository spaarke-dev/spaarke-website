"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/primitives";
import { MeetBookingFlow } from "@/components/meet/MeetBookingFlow";
import { track } from "@/lib/analytics";

type Contact = { name?: string; email: string };

type Props = {
  /** Where the panel sits, recorded when it is opened (for example "tltf-2026"). */
  src: string;
  recaptchaSiteKey: string;
  contact: Contact;
  /** Opens the panel on arrival when the address ends with this hash (for example "meet"). */
  openOnHash?: string;
};

type Availability =
  | { state: "idle" | "loading" }
  | { state: "ready"; slots: string[]; durationMinutes: number }
  | { state: "unavailable" };

/**
 * "Let's meet": the booking flow in a side panel, for any page that wants a
 * meeting as its next step without giving the whole page to the calendar.
 *
 * On a wide screen it is a card in the page's right-hand rail (the page puts
 * it in a sticky column) that expands in place. Below the `lg` breakpoint the
 * card is hidden and a bar pinned to the bottom of the screen opens the same
 * flow as a full-screen sheet; most visitors from a QR code arrive on a phone.
 *
 * Open times load only when the panel is first opened, so a page can carry the
 * panel without becoming dependent on Graph. When booking is not available
 * (the embed mode, or Graph failing), it links to /meet instead.
 */
export function LetsMeetPanel({ src, recaptchaSiteKey, contact, openOnHash }: Props) {
  const [openIn, setOpenIn] = useState<"rail" | "sheet" | null>(null);
  const [availability, setAvailability] = useState<Availability>({ state: "idle" });

  const load = useCallback(async () => {
    setAvailability({ state: "loading" });
    try {
      const res = await fetch("/api/meet/availability", { cache: "no-store" });
      const data = (await res.json()) as { ok?: boolean; slots?: string[]; durationMinutes?: number };
      if (res.ok && data.ok && data.slots && data.durationMinutes) {
        setAvailability({ state: "ready", slots: data.slots, durationMinutes: data.durationMinutes });
      } else {
        setAvailability({ state: "unavailable" });
      }
    } catch {
      setAvailability({ state: "unavailable" });
    }
  }, []);

  const open = (where: "rail" | "sheet") => {
    setOpenIn(where);
    track("Lets Meet Opened", { src, where });
    if (availability.state === "idle" || availability.state === "unavailable") void load();
  };

  // Room under the page for the bar pinned to the bottom on small screens, so
  // it never covers the end of the footer. (Class names written out in full
  // so Tailwind generates them.)
  useEffect(() => {
    const pad = ["pb-[76px]", "lg:pb-0"];
    document.body.classList.add(...pad);
    return () => document.body.classList.remove(...pad);
  }, []);

  // A link such as /tltf-2026#meet (from an email) opens the panel straight away.
  useEffect(() => {
    if (!openOnHash || window.location.hash !== `#${openOnHash}`) return;
    open(window.matchMedia("(min-width: 1024px)").matches ? "rail" : "sheet");
    // Runs once, on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const body = (
    <PanelBody availability={availability} recaptchaSiteKey={recaptchaSiteKey} contact={contact} />
  );

  return (
    <>
      {/* Wide screens: a card in the page's rail. */}
      <div className="border-line bg-bg hidden rounded-xl border p-6 lg:block">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-fg text-2xl font-medium tracking-tight">Let’s meet</h2>
          {openIn === "rail" && (
            <button
              type="button"
              onClick={() => setOpenIn(null)}
              className="text-cta-blue text-sm underline underline-offset-2"
            >
              Close
            </button>
          )}
        </div>
        {openIn === "rail" ? (
          body
        ) : (
          <Collapsed contact={contact} onOpen={() => open("rail")} />
        )}
      </div>

      {/* Phones and tablets: a bar pinned to the bottom of the screen. */}
      <div className="border-line bg-bg fixed inset-x-0 bottom-0 z-40 border-t px-4 py-3 lg:hidden" data-tone="light">
        <button
          type="button"
          onClick={() => open("sheet")}
          className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white"
          style={{ backgroundColor: "#5078DC" }}
        >
          Let’s meet <span aria-hidden="true">→</span>
        </button>
      </div>
      {openIn === "sheet" && <Sheet onClose={() => setOpenIn(null)}>{body}</Sheet>}
    </>
  );
}

function Collapsed({ contact, onOpen }: { contact: Contact; onOpen: () => void }) {
  return (
    <>
      <p className="text-fg-mid mt-3 text-base leading-relaxed">
        Book 30 minutes with the Spaarke team. You will receive a calendar invitation with a Microsoft Teams
        link.
      </p>
      <div className="mt-6">
        <Button variant="primary" arrow onClick={onOpen}>
          Let’s meet
        </Button>
      </div>
      <ContactLines contact={contact} />
    </>
  );
}

function PanelBody({
  availability,
  recaptchaSiteKey,
  contact,
}: {
  availability: Availability;
  recaptchaSiteKey: string;
  contact: Contact;
}) {
  return (
    <>
      {availability.state === "ready" ? (
        <MeetBookingFlow
          initialSlots={availability.slots}
          durationMinutes={availability.durationMinutes}
          recaptchaSiteKey={recaptchaSiteKey}
          compact
          idPrefix="panel-meet"
        />
      ) : availability.state === "unavailable" ? (
        <div className="mt-6">
          <p className="text-fg-mid text-base">Choose a time on our booking page.</p>
          <div className="mt-5">
            <Button variant="primary" href="/meet" arrow>
              Book a meeting
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-fg-low mt-6 text-sm">Loading available times…</p>
      )}
      <ContactLines contact={contact} />
    </>
  );
}

function ContactLines({ contact }: { contact: Contact }) {
  return (
    <div className="border-line text-fg-mid mt-8 space-y-1 border-t pt-5 text-sm">
      <p className="text-fg-low font-mono text-[11px] uppercase tracking-[0.18em]">Or get in touch</p>
      {contact.name && <p className="text-fg pt-1">{contact.name}</p>}
      <p>
        <a href={`mailto:${contact.email}`} className="text-cta-blue underline underline-offset-2">
          {contact.email}
        </a>
      </p>
    </div>
  );
}

function Sheet({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lets-meet-sheet-title"
      data-tone="light"
      className="bg-bg text-fg fixed inset-0 z-50 overflow-y-auto lg:hidden"
    >
      <div className="border-line bg-bg sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3">
        <h2 id="lets-meet-sheet-title" className="font-display text-fg text-xl font-medium tracking-tight">
          Let’s meet
        </h2>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="text-fg-mid hover:text-fg rounded-full px-3 py-1.5 text-sm"
          aria-label="Close"
        >
          Close
        </button>
      </div>
      <div className="px-4 pb-12">{children}</div>
    </div>
  );
}
