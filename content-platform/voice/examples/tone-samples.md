# Tone samples: short passages

This file holds short passages that model single voice traits. They are drawn from sections of the published library (`content/blog/`) that `good-articles.md` does not use, and the "Use this when" line under each passage says when the trait is useful. The file is a secondary reference. The primary positive model is `consulting-register.md`, which should be read first, and the constructions to avoid are catalogued in `ai-tells.md`.

**The passages have been edited to the September 2026 standard and are no longer verbatim.** Earlier versions of this file quoted the published articles exactly, and several of the notes praised devices that the 2026-09-21 revision of `../style-guide.md` prohibits: verbless fragments, two-noun framings, negation followed by correction, bold lead-in bullets, and em dashes. Each passage that remains has been re-punctuated and lightly edited, and it still names its source article. A line headed "What was edited" records the changes. The published articles have not been changed, so a passage will not match the text on the site.

Passage numbers are unchanged from the earlier version, so that existing references remain valid. Passages 3 and 7 have been removed, and the last section of the file explains why.

---

## Passage 1: `why-we-built-on-microsoft`, 2026-01-25

> When a member of the legal team drafts a document in Word, reviews an invoice in Outlook, or collaborates on a matter in Teams, Spaarke is already there, and it captures that work as it happens. This is what we mean when we say that Spaarke works where your people already work. The platform operates inside Microsoft 365, so the legal team has no second environment to log in to and no data to copy between systems.

**Why included**: A specific scene, with three named applications in which legal work is done, comes before the claim. The claim is then stated as a mechanism that the reader can check.

**Use this when**: A brief asks how Spaarke differs from a typical SaaS product, and the distinction has to be made without dismissing the alternative.

**What was edited**: The published version ended its first sentence on an em dash and a run of three participles, and it made the distinction in two verbless fragments (`Not integration with Microsoft. Operation within Microsoft.`). The edited version states the mechanism in a complete sentence.

---

## Passage 2: `tenant-dedicated-deployment`, 2026-02-08

> For years, enterprise legal departments had two deployment models to choose from. On-premises deployments offer full control over data, access, and compliance, but they carry high infrastructure costs, slow update cycles, and a growing maintenance burden. Multi-tenant SaaS platforms deliver speed and simplicity, but they require the customer to trust another company's infrastructure with its most sensitive information.

**Why included**: The passage states both sides of an industry tradeoff in operational terms, and it credits each option with its real advantage before naming its cost. The status quo receives a fair description before the article argues for a third option.

**Use this when**: A brief introduces a third option that resolves a tradeoff on which the audience already holds opinions.

**What was edited**: The published version staged the two options with "On one side:" and "On the other:", used two em dashes, and compressed the tradeoff into two verbless fragments built on two-noun pairs. The edited version uses three complete sentences and replaces the intensifier before "infrastructure costs" with "high".

---

## Passage 4: `legal-ops-is-not-it-for-lawyers`, 2026-03-25

> Ask a general counsel what legal operations does, and you will likely hear something about managing vendors, running the e-billing system, and pulling together quarterly spend reports. A CFO tends to give a shorter answer, which is that legal operations handles the invoices. Both answers are accurate, because legal operations teams do manage these things. However, defining legal operations by its administrative tasks is like defining the CFO's office by its accounts payable function. The description captures the minimum that the function does and treats it as the whole.

**Why included**: The common view of the function is quoted in the voice of the people who hold it, and the view is attributed to named roles. The passage concedes that the view is accurate before it answers it, and the comparison with accounts payable is one that a CFO can verify from experience.

**Use this when**: A brief has to change how a function or a role is perceived, especially when the existing perception is widely shared and politely held. Because the view is real and attributed, answering it is permitted under the style guide, section 5, rule 14.

**What was edited**: The published version conceded the point in a short negative sentence, opened the next sentence with "But", and closed on a compressed metaphor that the earlier note called a "two-noun anchor". The edited version concedes the point positively, uses "however", and ends on a sentence that states the meaning of the comparison in plain terms.

---

## Passage 5: `legal-ops-is-not-it-for-lawyers`, 2026-03-25 (metrics)

> A director who reports, "We identified $2.1 million in billing anomalies that would have been approved without structured review," opens a different conversation with finance than one who reports, "We processed 4,000 invoices last quarter." The same is true of forecasting. "Our spend forecasts were within 5% of actual for the first half of the year" demonstrates a capability that finance teams respect, because it mirrors their own standards.

**Why included**: The quoted sentences sound like statements that a legal operations director would make in a budget meeting, and each contains a number. The first two quotations form a pair, so the reader sees the difference between reporting activity and reporting results.

**Use this when**: A section has to show what a capability looks like in practice, particularly when the writing must survive a reading by a CFO.

**What was edited**: The published version was a pair of bold lead-in bullets. The first headline used a `not just` contrast, and its sentence relied on an intensifier. The edited version is a paragraph in which the quotations carry the point.

---

## Passage 6: `breaking-the-silo`, 2026-03-21 (point integrations)

> The instinctive response to the silo problem is integration: connect system A to system B with an API, build a middleware layer, and map fields from legal's taxonomy to finance's taxonomy. This approach creates brittle connections that are expensive to maintain, because every API mapping is a promise that both systems will keep their data structures consistent, and every sync job is a window during which data is stale.

**Why included**: The passage describes the obvious response fairly and specifically before it explains the cost. The explanation is operational. An API mapping is described as a promise and a sync job as a window of stale data, and an IT reader can confirm both descriptions from experience.

**Use this when**: A brief addresses a partial fix that the reader is likely to consider.

**What was edited**: The published version listed the three integration steps as three clipped imperative sentences and gave the two reasons as separate short sentences. The edited version introduces the steps with a colon after a complete clause and joins the reasons to the claim with "because".

---

## Passages removed in this revision

Two passages were dropped because their only value was a device that the style guide now prohibits.

- Passage 3 (`breaking-the-silo`, opening) was included for a "direct provocation" in its first sentence. The provocation was negation followed by correction, and the earlier note recommended it for reframing arguments (style guide, section 5, rule 14).
- Passage 7 (`the-20b-blind-spot`, CFO conversation) was included for a two-sentence close that layered two two-noun contrasts (rules 15 and 18).

For model openings, an evidence paragraph, a transition, and a close, use `consulting-register.md`, section 6.

---

*Revised 2026-09-21 (passages edited to the September 2026 standard, no em dashes), see git log for history.*
