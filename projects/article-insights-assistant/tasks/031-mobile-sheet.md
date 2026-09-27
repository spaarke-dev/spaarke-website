# Task 031: Mobile bottom sheet

**Phase:** 3 (The interface)
**Status:** complete
**Estimated:** 3 hours
**Dependencies:** 030
**Tags:** react, tailwind, responsive, accessibility

## Goal

On viewports without a right rail, a floating button opens the same console
as a bottom sheet over the article.

## Context

The series is promoted on LinkedIn, where a large share of traffic is
mobile. Shipping desktop only would miss the readers the promotion brings.

The button persists as the reader scrolls, because a 6,000-word article is
a long way to scroll back to an entry point that sits at the top.

## Steps

1. Add a floating button, visible below the rail breakpoint, persistent
   through scroll, positioned clear of any other fixed element.
2. Open the console from task 030 in a bottom sheet. Reuse the component
   rather than forking it.
3. Keep the article mounted behind the sheet so scroll position survives
   close.
4. Size the sheet so the input stays visible above the on-screen keyboard.
5. Trap focus while open, restore it on close, and close on escape and on
   backdrop tap.
6. Confirm the disclaimer is visible in the sheet, not just in the rail.
7. Test at 375px one-handed: reachable button, usable input, readable
   citations.
8. Verify acceptance criteria are met.
9. Update TASK-INDEX.md: mark this task complete.

## Expected Outputs

- `src/components/ArticleInsights/MobileSheet.tsx`
- `src/components/ArticleInsights/FloatingButton.tsx`
- `src/components/ArticleInsights/ConsoleBody.tsx`, the console both surfaces share
- `src/components/ArticleInsights/InsightsProvider.tsx`, one conversation for all
  three surfaces
- `src/components/ArticleInsights/RailEntry.tsx`

## The restructure this needed

**The rail lives inside `<aside className="hidden lg:block">`, and a
`display: none` ancestor hides a fixed child too.** So the floating button could
not live where the rest of the console lived. Two separate components would have
meant two conversations, two captcha widgets, and eventually two implementations
that disagree, which is the thing this task explicitly forbids.

The fix is a provider around the article grid. The rail entry point, the desktop
panel and the mobile sheet all read one state. `ConsoleBody` holds the entry card,
the transcript, the composer and the disclaimer, and the two surfaces are frames
around it.

## Acceptance Criteria

- [x] Button visible and reachable one-handed at 375px. Fixed bottom right, clear
      of the home indicator, in the first paint rather than after an interaction.
      **Its reachability at 375px is a claim about a thumb and has not been tested
      on a device.**
- [x] Sheet opens the same console, not a reduced variant. Asserted at the source
      level, which is the right kind of check here: the failure guarded against is
      somebody answering a mobile bug by copying the panel.
- [x] Article stays mounted; scroll position survives close. The sheet is an
      overlay and the body gets `overflow: hidden`, which holds the scroll position
      rather than resetting it the way a fixed body would.
- [x] Input remains visible with the keyboard open. `max-h-[85dvh]`, and the check
      fails if anyone changes it to `vh`. The dynamic viewport unit shrinks with
      the keyboard; `vh` does not, which is exactly how the composer ends up
      underneath it.
- [x] Focus trapped while open and restored on close. Tab cycles inside the sheet,
      and the provider hands focus back to whichever trigger opened it.
- [x] Escape and backdrop tap both close.
- [x] Disclaimer visible in the sheet. It is in `ConsoleBody`, so both surfaces
      carry it and neither can lose it separately.

## Why the sheet traps focus and the panel does not

This looks like an inconsistency and is not. Beside an article the console is one
of two things on screen and the reader moves between them, so a trap would make the
article unreachable to exactly the readers who most need it reachable. Over an
article it is the only thing on screen, nothing behind it is usable, and letting
Tab wander into a covered page is the bug.

## Notes

The on-screen keyboard is the detail that gets missed. A sheet sized to the
viewport height puts the input under the keyboard on iOS, where the reader
types blind.

Do not fork the console for mobile. Two implementations diverge, and the
mobile one always falls behind.

**Not verified, and it is the part that matters most here.** Nobody has opened
this on a phone. There is no browser automation and no device in this loop, so the
keyboard behaviour, the thumb reach, the scroll restore and the focus trap are all
implemented and argued rather than observed. The desktop console is in the same
position. Both want a person before launch.

See spec FR-12, FR-10, NFR-05, and `notes/console.md`.
