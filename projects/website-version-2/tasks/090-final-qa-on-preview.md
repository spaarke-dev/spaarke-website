# Task 090: Final QA on SWA preview URL

**Phase:** 5 — Cutover
**Status:** not-started (stub — to be expanded when Phase 5 begins)
**Estimated:** 2 hours
**Dependencies:** 043
**Tags:** qa, review

## Context

Final pre-merge review on the SWA preview URL. The PR has been a draft since Task 001; convert to "ready for review" and walk every page.

Checklist:
- [ ] Every route renders without console errors
- [ ] All forms submit successfully (test contact + access-request end-to-end with throwaway data)
- [ ] All footer links resolve (no 404s)
- [ ] Notification bar dismiss persists
- [ ] Hero CTAs go to correct pages
- [ ] Closing CTA goes to /why-spaarke (stub)
- [ ] OG images preview correctly in Twitter/LinkedIn debuggers
- [ ] Sitemap.xml includes all routes (including renamed `/insights`)
- [ ] RSS feed validates and uses `/insights` paths
- [ ] Mobile flow tested on real iOS + Android device
- [ ] Reduce-motion flow tested

Document any deferred polish items as follow-up issues.

## Acceptance (will expand when Phase 5 begins)

- [ ] All checklist items pass
- [ ] No P0 bugs open
- [ ] User has signed off on the preview URL
