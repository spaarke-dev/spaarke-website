# Style guide

Spaarke writes for general counsel, legal ops directors, and CIOs who have heard the AI pitch a hundred times. They read McKinsey, HBR, Stripe, and Microsoft WorkLab. They roll their eyes at "transformation." They trust prose that earns its claims.

This is the rulebook for how every piece sounds. Read at the start of every writing session.

---

## 1. Voice — what we sound like

We sound like an operator explaining a system to another operator. Not a vendor pitching, not an analyst lecturing. Authoritative and plainspoken, with a quiet point of view.

Five contrasts:

> **Authoritative, not breathless.**
> We say: "Outside legal spend in the United States alone exceeds $20 billion annually. That makes it one of the largest discretionary spend categories in the enterprise."
> We don't say: "AI is completely transforming legal operations as we know it!"

> **Specific, not abstract.**
> We say: "When she retired, her replacement inherited the case files but not the playbook. Settlements that she would have pushed harder on were accepted too early."
> We don't say: "Knowledge loss has a major impact on operational outcomes."

> **Plainspoken, not corporate.**
> We say: "Documents capture outcomes. Memory captures the negotiation dynamics — what was conceded, what leverage worked, what the fallback position was."
> We don't say: "Our solution leverages enterprise-grade memory architecture to drive transformative collaboration outcomes."

> **Operator-grade, not academic.**
> We say: "The tool is not the bottleneck. The data architecture is."
> We don't say: "A theoretical framework for considering the relative contribution of tooling and infrastructure."

> **Direct, not evangelical.**
> We say: "An AI tool layered on fragmented data gives you fragmented answers — faster."
> We don't say: "The future of legal is here, and it is more powerful than ever before."

Closer to McKinsey, HBR, and Stripe than to startup marketing. If a sentence could appear on a CMO deck slide, it probably should not appear in our writing.

---

## 2. Sentence rhythm

Mix short and medium sentences. Short for emphasis, medium for development, long sparingly.

The library does this naturally. From `the-ai-readiness-gap`: "The tool is not the bottleneck. The data architecture is." From `institutional-knowledge`: "The cost is invisible on any single day. Over a decade, it is enormous." A long claim, a short landing.

- Active voice in roughly 80% of sentences. Passive only when the actor is genuinely unimportant.
- One-sentence paragraphs are allowed but only after a longer build, and only for emphasis. Decorative use kills their force.
- Avoid long compound sentences with two semicolons or three commas of subordinate clauses. If a sentence needs that much scaffolding, it is two sentences.
- Read it aloud. If you run out of breath, cut it.

---

## 3. Paragraph structure

Three to five sentences per paragraph as the default. Lead with the claim, then defend it. Don't bury.

The pattern across the strongest articles: a claim sentence, a sentence or two of evidence, and a sentence that lands the point or sets up the next one. From `the-20b-blind-spot`: "Outside legal spend in the United States alone exceeds $20 billion annually. That makes it one of the largest discretionary spend categories in the enterprise. And in most organizations, it operates with less financial visibility than the office supply budget." Claim, scale, landing.

Transition phrases are usually unnecessary. "Furthermore," "moreover," "in addition to this" — cut them and let paragraph order carry the argument.

When introducing a new term, build to it patiently. `what-is-legal-operations-intelligence` waits eight paragraphs before naming the category. The setup earns the term.

---

## 4. Formatting conventions

- **Headings**: sentence case ("How matter management actually works"), no periods, no questions.
- **Numbers**: numerals for 10 and above ("12 attorneys," "200 similar matters"); spelled out below 10 ("three workstreams") except in lists or technical contexts. Always numerals for money and percentages.
- **Em-dashes**: yes — for parenthetical asides and emphasis. Don't replace every comma with one; they earn their weight by being rare.
- **Semicolons**: sparingly. A period almost always works.
- **Lists**: bullets for parallel concepts; numbered lists when order matters or the prose refers back ("the three forces").
- **Bolded lead-in phrases on lists.** The library's signature pattern: bolded phrase, then plain explanation. From `the-20b-blind-spot`: "**Fragmented billing.** Invoices arrive in different formats from different firms…" Turns a feature list into small arguments.
- **Bold inside prose**: rare. Reserve for genuinely scannable terms or named concepts on first use. No more than three per 1,000 words of body prose.
- **Italics**: technical terms on first introduction, or single-word emphasis ("It is *plausible* bad output").

---

## 5. Things we don't do

1. **No exclamation points.** They read as breathless. Even in social posts, reserve them for genuine surprise, not enthusiasm for our own product.

2. **No rhetorical questions in titles.** "Is your matter management ready for AI?" reads like a webinar invite. Make a claim. The strongest titles in our library are statements: "The $20B Blind Spot," "Institutional Knowledge Is Walking Out the Door."

3. **No "Imagine if…" or "In today's world…" openers.** AI-tells, empty calories. Open with a specific observation, a named scene, or a direct claim.

4. **No demo-CTA closes.** Don't end with "Schedule a demo" or "Talk to sales." The library closes with "Where to Go Next" pointing to more substance. Conversion comes from credibility, not from a button at the bottom of an article.

5. **No marketing-filler adjectives.** "Powerful," "robust," "seamless," "innovative," "cutting-edge," "best-in-class." If a feature is genuinely powerful, the example proves it; the adjective adds nothing.

6. **No "transform your legal department," "disrupting legal," or "AI-powered everything."** Empty consulting and vendor language. Show the operational change instead.

7. **No "replace lawyers," "10x productivity," or "autonomous legal AI."** Inconsistent with human-in-the-loop and unverifiable. Our story is AI-directed, human-controlled.

8. **No CEO-letter first-person plural.** "We are excited to announce…" and "We believe the future is bright…" are not the registers we are in. Frame in observations, not collective enthusiasm.

9. **No stacked superlatives.** "Categorically different," "fundamentally transformative," "completely revolutionary" in the same paragraph slides the writing into the breathless register. One earned superlative per piece is plenty; zero is usually better.

10. **No reciting "Data → Memory → Inference" without using it structurally.** When the Legal IQ stack appears, it should organize the argument, not be name-checked. Mid-paragraph creed-recitation is a library habit we should drop.

11. **No "Throughout this series, we…" recap-openers.** They flatten the first paragraph. Weave the connective tissue into the body; spend the opening on the hook of *this* piece.

12. **No claims without a defense.** Every category claim is paired with named evidence — CLOC Core 12, the ACC Maturity Model, the Center for American Progress 100–213% replacement-cost figure, "200 similar matters your department has handled." If a sentence asserts something the reader could challenge, the next sentence answers it.

---

## 6. Calibration by content type

Voice scales across formats. Detail lives in `content-types/<type>.md`:

- **White papers**: more formal cadence, citations footnoted, longer setup, more headings. Still operator-grade — never academic for academic's sake.
- **Blog posts**: the default register above. 1,000–1,800 words. Hook in the first two paragraphs.
- **LinkedIn posts**: looser, often first-person from a named byline, shorter sentences, hook in line 1–2 (mobile preview cuts off around line 3). Hashtags minimal, at the bottom.
- **Tweets**: maximum density, idiomatic for X. One idea per tweet. Threads only when each tweet earns the next.

---

## 7. Quick checklist

Before sending a draft for review, run this. If any answer is "no," fix it.

1. Does the opening make a specific observation, name a scene, or land a direct claim — not a generic AI-tell?
2. Does every category claim have a named source, a concrete number, or an explicit comparison defending it?
3. Are sentence rhythms varied — short for emphasis, medium for development, no long compound sentences carrying the load?
4. Are headings statements (not questions) in sentence case?
5. Does the piece avoid the §5 words and phrases — "transform," "powerful," "seamless," "AI-powered," "10x," demo CTAs, exclamation points?
6. If the Legal IQ stack or LOI is invoked, is it organizing the argument or just name-checked?
7. Are paragraphs 3–5 sentences by default, with one-sentence paragraphs reserved for emphasis after a longer build?
8. Does the close advance the argument or point to substance — not summarize, not pitch?

---

*Locked 2026-05-07 — see git log for history.*
