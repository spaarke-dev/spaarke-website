"use client";

import { useState } from "react";
import {
  ANCHOR_TEXT,
  STEP_ANCHORS,
  STEP_AUDIENCES,
  STEP_DAYS_MAX,
  describeStep,
  type StepAnchor,
  type StepAudience,
} from "@/lib/market/step-text";
import { Badge } from "@/components/admin/Badge";
import { BUTTON, DANGER, FIELD, QUIET, useAdminRequest } from "@/components/admin/useAdminRequest";

export type StepView = {
  id: string;
  name: string;
  days: number;
  anchor: StepAnchor;
  audience: StepAudience;
  group?: string;
  enabled: boolean;
};

const AUDIENCE_LABEL: Record<StepAudience, string> = {
  "no-reply": "No reply yet",
  "engaged-no-meeting": "Engaged, no meeting",
  met: "Met",
  everyone: "Everyone",
};

/** Add or edit one step. */
function StepForm({
  slug,
  groups,
  step,
  onDone,
}: {
  slug: string;
  groups: string[];
  step?: StepView;
  onDone: () => void;
}) {
  const { send, busy, error } = useAdminRequest();
  const [days, setDays] = useState(String(step?.days ?? 7));
  const [anchor, setAnchor] = useState<StepAnchor>(step?.anchor ?? "first-email");
  const [audience, setAudience] = useState<StepAudience>(step?.audience ?? "no-reply");
  const [group, setGroup] = useState(step?.group ?? "");
  const n = Number(days);
  const preview =
    days.trim() && Number.isInteger(n) && n >= 0 && n <= STEP_DAYS_MAX
      ? describeStep({ days: n, anchor, audience, group: group || undefined })
      : null;
  const id = step ? `step-${step.id}` : "step-new";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get("name") ?? "");
    const body = { name, days: n, anchor, audience, group: group || null };
    const r = step
      ? await send(`/api/admin/campaigns/${slug}/steps/${step.id}`, "PATCH", body)
      : await send(`/api/admin/campaigns/${slug}/steps`, "POST", { ...body, group: group || undefined });
    if (r) onDone();
  }

  return (
    <form
      onSubmit={onSubmit}
      aria-label={step ? `Edit step ${step.name}` : "Add a step"}
      className="space-y-3 rounded-lg border border-line bg-surface p-3"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-fg-mid sm:col-span-2">
          Follow-up title
          <input name="name" required maxLength={120} defaultValue={step?.name} className={FIELD} id={`${id}-name`} />
        </label>
        <label className="flex flex-col gap-1 text-xs text-fg-mid">
          Days after
          <input
            name="days"
            type="number"
            inputMode="numeric"
            min={0}
            max={STEP_DAYS_MAX}
            step={1}
            required
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className={FIELD}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-fg-mid">
          Counted from
          <select value={anchor} onChange={(e) => setAnchor(e.target.value as StepAnchor)} className={FIELD}>
            {STEP_ANCHORS.map((a) => (
              <option key={a} value={a}>
                {ANCHOR_TEXT[a].charAt(0).toUpperCase() + ANCHOR_TEXT[a].slice(1)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-fg-mid">
          For members who
          <select value={audience} onChange={(e) => setAudience(e.target.value as StepAudience)} className={FIELD}>
            {STEP_AUDIENCES.map((a) => (
              <option key={a} value={a}>
                {AUDIENCE_LABEL[a]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-fg-mid">
          Group
          <select value={group} onChange={(e) => setGroup(e.target.value)} className={FIELD}>
            <option value="">Every group</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
            {group && !groups.includes(group) ? <option value={group}>{group}</option> : null}
          </select>
        </label>
      </div>
      <p className="text-sm" aria-live="polite">
        {preview ? `Due ${preview}.` : `Days must be a whole number from 0 to ${STEP_DAYS_MAX}.`}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button type="submit" className={BUTTON} disabled={busy || !preview}>
          {busy ? "Saving" : step ? "Save step" : "Add step"}
        </button>
        <button type="button" className={QUIET} onClick={onDone} disabled={busy}>
          Cancel
        </button>
        {error ? (
          <span role="alert" className="text-sm text-[#c42b1c]">
            {error}
          </span>
        ) : null}
      </div>
    </form>
  );
}

/** One step in the list: its sentence, on/off, move, edit and remove. */
function StepRow({
  slug,
  groups,
  step,
  index,
  count,
  move,
  moving,
}: {
  slug: string;
  groups: string[];
  step: StepView;
  index: number;
  count: number;
  move: (from: number, to: number) => void;
  moving: boolean;
}) {
  const { send, busy, error } = useAdminRequest();
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const url = `/api/admin/campaigns/${slug}/steps/${step.id}`;

  if (editing) {
    return (
      <li>
        <StepForm slug={slug} groups={groups} step={step} onDone={() => setEditing(false)} />
      </li>
    );
  }

  return (
    <li className="rounded-lg border border-line bg-surface p-3 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 [overflow-wrap:anywhere]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-fg-mid tabular-nums">{index + 1}.</span>
            <span className="font-medium">{step.name}</span>
            {step.enabled ? null : <Badge>Off</Badge>}
          </div>
          <div className="mt-1 text-fg-mid">{describeStep(step)}</div>
        </div>
        <label className="inline-flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={step.enabled}
            disabled={busy}
            aria-label={`On, ${step.name}`}
            onChange={(e) => void send(url, "PATCH", { enabled: e.target.checked })}
            className="h-4 w-4"
          />
          On
        </label>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={QUIET}
          disabled={moving || index === 0}
          onClick={() => move(index, index - 1)}
          aria-label={`Move ${step.name} up`}
        >
          Up
        </button>
        <button
          type="button"
          className={QUIET}
          disabled={moving || index === count - 1}
          onClick={() => move(index, index + 1)}
          aria-label={`Move ${step.name} down`}
        >
          Down
        </button>
        <button type="button" className={QUIET} onClick={() => setEditing(true)} aria-label={`Edit ${step.name}`}>
          Edit
        </button>
        {confirming ? (
          <>
            <button type="button" className={DANGER} disabled={busy} onClick={() => void send(url, "DELETE")}>
              {busy ? "Removing" : "Remove step"}
            </button>
            <button type="button" className={QUIET} onClick={() => setConfirming(false)} disabled={busy}>
              Keep it
            </button>
          </>
        ) : (
          <button type="button" className={QUIET} onClick={() => setConfirming(true)} aria-label={`Remove ${step.name}`}>
            Remove
          </button>
        )}
      </div>
      {confirming ? (
        <p className="mt-2 text-xs text-fg-mid">Follow-ups this step already made stay on the contacts.</p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-2 text-sm text-[#c42b1c]">
          {error}
        </p>
      ) : null}
    </li>
  );
}

/**
 * The campaign's follow-up steps (phase 2 FR-09): when a follow-up is due
 * and for whom. The daily job makes the follow-ups.
 */
export function CampaignSteps({ slug, steps, groups }: { slug: string; steps: StepView[]; groups: string[] }) {
  const order = useAdminRequest();
  const [adding, setAdding] = useState(false);

  function move(from: number, to: number) {
    const ids = steps.map((s) => s.id);
    const [id] = ids.splice(from, 1);
    ids.splice(to, 0, id);
    void order.send(`/api/admin/campaigns/${slug}/steps/order`, "POST", { ids });
  }

  return (
    <div className="space-y-3">
      {steps.length ? (
        <ol className="space-y-2" aria-label="Follow-up steps">
          {steps.map((s, i) => (
            <StepRow
              key={`${s.id}-${s.name}-${s.days}-${s.anchor}-${s.audience}-${s.group ?? ""}`}
              slug={slug}
              groups={groups}
              step={s}
              index={i}
              count={steps.length}
              move={move}
              moving={order.busy}
            />
          ))}
        </ol>
      ) : (
        <p className="text-sm text-fg-mid">No steps yet. Add one to have the daily job make follow-ups for this campaign.</p>
      )}
      {order.error ? (
        <p role="alert" className="text-sm text-[#c42b1c]">
          {order.error}
        </p>
      ) : null}
      {adding ? (
        <StepForm slug={slug} groups={groups} onDone={() => setAdding(false)} />
      ) : (
        <button type="button" className={QUIET} onClick={() => setAdding(true)}>
          Add a step
        </button>
      )}
    </div>
  );
}
