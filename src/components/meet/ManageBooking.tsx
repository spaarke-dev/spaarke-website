"use client";

import { useRef, useState } from "react";
import InlineAlert from "@/components/InlineAlert";
import { Button } from "@/components/primitives";
import { GuestList } from "@/components/meet/GuestList";
import { SlotPicker } from "@/components/meet/SlotPicker";
import { MEET_ERRORS, formatMeeting, inputBase, inputBorder, labelClass, useVisitorTimeZone } from "@/components/meet/shared";
import { track } from "@/lib/analytics";

type Mode = "view" | "reschedule" | "cancel" | "moved" | "cancelled";

/** Reschedule, cancel, or change the guests of one booking, from its signed link. */
export function ManageBooking({
  token,
  start,
  durationMinutes,
  initialSlots,
  initialGuests,
  ownEmail,
}: {
  token: string;
  start: string;
  durationMinutes: number;
  initialSlots: string[];
  initialGuests: string[];
  ownEmail: string;
}) {
  const [timeZone, setTimeZone] = useVisitorTimeZone();
  const [current, setCurrent] = useState(start);
  const [slots, setSlots] = useState(initialSlots);
  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("view");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [savedGuests, setSavedGuests] = useState(initialGuests);
  const [guests, setGuests] = useState(initialGuests);
  const [guestError, setGuestError] = useState("");
  const [guestNotice, setGuestNotice] = useState("");
  const statusRef = useRef<HTMLHeadingElement>(null);

  async function refreshSlots() {
    try {
      const res = await fetch(`/api/meet/availability?t=${encodeURIComponent(token)}`, { cache: "no-store" });
      const data = (await res.json()) as { ok?: boolean; slots?: string[] };
      if (data.ok && data.slots) setSlots(data.slots);
    } catch {
      // Keep the current list.
    }
  }

  async function post(path: string, body: Record<string, unknown>) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ...body }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        start?: string;
        guests?: string[];
        fields?: { guests?: string };
      };
      if (!res.ok || !data.ok) {
        if (data.fields?.guests) {
          setGuestError(data.fields.guests);
          return null;
        }
        if (data.error === "SLOT_TAKEN") {
          setSelected(null);
          await refreshSlots();
        }
        setError(MEET_ERRORS[data.error ?? ""] ?? MEET_ERRORS.UNAVAILABLE);
        return null;
      }
      return data;
    } catch {
      setError(MEET_ERRORS.NETWORK);
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function reschedule() {
    if (!selected) return;
    const data = await post("/api/meet/reschedule", { start: selected });
    if (data) {
      track("Meeting Rescheduled");
      setCurrent(data.start ?? selected);
      setMode("moved");
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  }

  async function cancel() {
    const data = await post("/api/meet/cancel", { note: note.trim() });
    if (data) {
      track("Meeting Cancelled");
      setMode("cancelled");
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  }

  const guestsChanged =
    guests.length !== savedGuests.length || guests.some((g, i) => g.toLowerCase() !== savedGuests[i]?.toLowerCase());

  async function saveGuests() {
    setGuestNotice("");
    const added = guests.filter((g) => !savedGuests.some((s) => s.toLowerCase() === g.toLowerCase()));
    const data = await post("/api/meet/guests", { guests });
    if (data) {
      track("Meeting Guests Updated", { count: String(guests.length) });
      const next = data.guests ?? guests;
      setSavedGuests(next);
      setGuests(next);
      setGuestNotice(
        added.length > 0
          ? `Saved. We sent the invitation to ${added.join(", ")}.`
          : "Saved. We sent a cancellation to anyone you removed.",
      );
    }
  }

  if (!timeZone) return <div className="text-fg-low mt-12 text-sm">Loading your meeting…</div>;

  const heading = {
    view: "Your meeting",
    reschedule: "Your meeting",
    cancel: "Your meeting",
    moved: "Your meeting has moved",
    cancelled: "Your meeting is cancelled",
  }[mode];

  return (
    <div className="mt-12">
      <div className="border-line rounded-xl border p-6 md:p-8">
        <h2
          ref={statusRef}
          tabIndex={-1}
          className="font-mono text-fg-low text-[11px] uppercase tracking-[0.18em] focus:outline-none"
        >
          {heading}
        </h2>
        <p className={`text-fg mt-3 text-base md:text-[17px] ${mode === "cancelled" ? "line-through opacity-60" : ""}`}>
          {formatMeeting(current, durationMinutes, timeZone)}
        </p>
        {mode === "moved" && (
          <p className="text-fg-mid mt-3 text-base">
            We sent an updated invitation, and the Microsoft Teams link stays the same.
          </p>
        )}
        {mode === "cancelled" && (
          <p className="text-fg-mid mt-3 text-base">
            We sent the cancellation to your calendar. You are welcome to{" "}
            <a href="/meet" className="text-cta-blue underline underline-offset-2">
              book another time
            </a>
            .
          </p>
        )}
        {mode === "view" && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => setMode("reschedule")}>
              Choose a new time
            </Button>
            <Button variant="outline" onClick={() => setMode("cancel")}>
              Cancel meeting
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-8">
          <InlineAlert variant="error" message={error} />
        </div>
      )}

      {(mode === "view" || mode === "moved") && (
        <div className="border-line mt-8 max-w-2xl rounded-xl border p-6 md:p-8">
          <GuestList
            guests={guests}
            onChange={(next) => {
              setGuests(next);
              setGuestError("");
              setGuestNotice("");
            }}
            ownEmail={ownEmail}
            error={guestError}
            label="Guests"
            hint="Invite colleagues to this meeting. They get the invitation with the Teams link and the reminders; only you can move or cancel it. Up to 5."
          />
          {guestsChanged && (
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="text"
                onClick={() => {
                  setGuests(savedGuests);
                  setGuestError("");
                }}
              >
                Undo
              </Button>
              <Button variant="primary" disabled={busy} onClick={saveGuests}>
                {busy ? "Saving…" : "Save guests"}
              </Button>
            </div>
          )}
          {guestNotice && (
            <p className="text-fg-mid mt-4 text-sm" role="status">
              {guestNotice}
            </p>
          )}
        </div>
      )}

      {mode === "reschedule" && (
        <div className="mt-12">
          {slots.filter((s) => s !== current).length === 0 ? (
            <p className="text-fg-mid text-base">There are no other open times in the next few weeks.</p>
          ) : (
            <SlotPicker
              // The meeting's own time is not a new time to offer.
              slots={slots.filter((s) => s !== current)}
              timeZone={timeZone}
              onTimeZoneChange={setTimeZone}
              selected={selected}
              onSelect={setSelected}
              durationMinutes={durationMinutes}
              dayHeading="Choose a new day"
            />
          )}
          <div className="border-line mt-10 flex flex-col items-start gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-fg-mid text-sm" aria-live="polite">
              {selected ? `New time: ${formatMeeting(selected, durationMinutes, timeZone)}` : "Choose a new time."}
            </p>
            <div className="flex gap-3">
              <Button variant="text" onClick={() => setMode("view")}>
                Back
              </Button>
              <Button variant="primary" disabled={!selected || busy} onClick={reschedule} arrow={!busy}>
                {busy ? "Moving…" : "Move meeting"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {mode === "cancel" && (
        <div className="mt-12 max-w-2xl">
          <label htmlFor="meet-cancel-note" className={labelClass}>
            Anything we should know? (optional)
          </label>
          <textarea
            id="meet-cancel-note"
            rows={3}
            maxLength={500}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={`${inputBase} ${inputBorder(false)} resize-y`}
          />
          <div className="mt-8 flex justify-end gap-3">
            <Button variant="text" onClick={() => setMode("view")}>
              Keep meeting
            </Button>
            <Button variant="primary" disabled={busy} onClick={cancel}>
              {busy ? "Cancelling…" : "Cancel meeting"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
