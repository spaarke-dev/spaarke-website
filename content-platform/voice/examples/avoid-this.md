# Avoid this: negative examples

This file is the final-pass sweep. It lists the failure modes that a draft can fall into, and each entry pairs a passage that we would not publish with a better version. Sections 1 to 7 cover marketing copy and generic filler. Sections 8 to 19 cover the constructions that readers identify as machine-written, which the 2026-09-21 revision of `../style-guide.md` prohibits in section 5, rules 13 to 27.

The entries in sections 8 to 19 are short on purpose. The full taxonomy of machine-written constructions, with a before and an after for every variant and a pre-review checklist, is in `ai-tells.md`. The positive model (what to write toward) is in `consulting-register.md`.

Three notes apply to the file itself. First, the "Do not write" passages in sections 1 to 7 are constructed. Those in sections 8 to 19 are quoted from the published library, unless an entry says that a passage is constructed, and each carries the file and the line recorded in `content-platform/research/2026-09-loi-series/notes/library-audit-local.md`. The published articles have not been changed. Second, the "Better" passages are no longer verbatim extracts. Earlier versions of this file quoted the library directly, and several of those quotations modeled constructions that are now prohibited. Each "Better" passage is now either adapted from the named article and edited to the September 2026 standard, or written for this file. Third, the "Do not write" passages contain the words and constructions under discussion, so `npm run voice:lint` reports warnings on this file by design; it must still report 0 errors. This file never prints an em dash. Where a quoted original contains one, the placeholder [EM DASH] marks the position.

---

## 1. AI-tell openers

### Do not write

> In today's fast-paced legal landscape, artificial intelligence is rapidly transforming how legal departments operate.

**Why this fails**:

- The phrase `In today's fast-paced legal landscape` is the stock machine-written opener, and it commits to nothing.
- `Rapidly transforming` stacks abstractions, and the sentence offers no concrete noun that the reader can verify.

### Better: write (adapted from `what-is-legal-operations-intelligence`)

> Consider the legal department of a Fortune 500 company. It employs some of the most analytically rigorous professionals in the enterprise, manages outside counsel relationships worth tens of millions of dollars annually, and oversees risk that can alter the trajectory of the business. Its matter data lives in one system, its invoices flow through another, and its contracts sit in a third.

The passage gives specific scale and function before any term is named. The published original set the three facts as three sentences that each opened with "It", and the edited version joins them because the content is one list of three items. In a new article, a scene of this kind must be short enough for the thesis to arrive within the first 150 words.

---

## 2. Vague abstractions and "AI-powered" filler

### Do not write

> Spaarke leverages cutting-edge AI to revolutionize how legal departments operate. Our AI-powered platform empowers teams to unlock new levels of productivity.

**Why this fails**:

- `AI-powered` is on the do-not-claim list (`tasks/00-inputs.md`, section 4, and `vocabulary.md`, section 2). By 2026 the term is generic, and it says nothing about what the AI does.
- `Leverages cutting-edge AI to revolutionize` stacks three empty intensifiers in one verb phrase.

### Better: write (adapted from `the-iq-stack`)

> Generic AI tools can summarize a contract or answer a question about case law, and those capabilities are useful. They draw on general knowledge, however, so they cannot take account of how this department has handled similar matters. A system that reasons over the department's own matter and spend records can produce recommendations that reflect how the organization operates.

The passage credits the generic capability and then names the specific operational difference.

---

## 3. Empty closes and "next level" calls to action

### Do not write

> Now is the time to take your legal operations to the next level. Schedule a demo today.

**Why this fails**:

- `Take your legal operations to the next level` is a stock SaaS close, and it gives no information about what follows for the reader.
- `Schedule a demo` breaks the style guide, section 5, rule 4. The close ends on consequence, and related reading may follow as a plain list of links.

### Better: write (adapted from the closing section of `the-iq-stack`)

> The three layers reinforce one another over time. Richer data gives the memory layer more patterns to record, deeper memory makes inference more accurate, and better inference shows which data the department should capture next. A department that buys separate tools gets none of this effect, because each tool improves its own function and contributes nothing to the others. The choice between a connected platform and a collection of tools therefore determines whether the department's systems are worth more in their second year than in their first.

The close states what follows from the argument for the reader, and then it stops. Earlier versions of this file offered the clipped pair `One learns. The other just runs.` as the better close. That pair is now an example of the clipped aphoristic closer (section 13).

---

## 4. Hedging

### Do not write

> It is important to note that legal operations may potentially benefit from operational intelligence in certain circumstances.

**Why this fails**:

- `It is important to note` is a filler hedge that exists only to soften what follows.
- `May potentially benefit` stacks two hedges on one verb, and `in certain circumstances` protects the claim against any test.

### Better: write (adapted from `the-ai-readiness-gap`)

> An AI tool that reads fragmented matter data tends to return fragmented answers, and it returns them quickly enough that an error can reach a decision before anyone has checked the inputs.

The claim carries one hedge, placed on the verb ("tends to"), and the rest of the sentence commits. Earlier versions of this file offered `The tool is not the bottleneck. The data architecture is.` as the better version. That pair is negation followed by correction (section 9).

---

## 5. Self-congratulation

### Do not write

> Our innovative, industry-leading platform sets a new standard for legal operations excellence. We are uniquely positioned to deliver unprecedented value.

**Why this fails**:

- `Innovative`, `industry-leading`, `uniquely positioned`, and `unprecedented value` are superlatives stacked without evidence.
- The register is that of a startup outsider. The do-not-claim list (`tasks/00-inputs.md`, section 4) exists to protect the voice of a credible operational platform.

### Better: write (adapted from `why-we-built-on-microsoft`)

> Building on Microsoft means inheriting a security posture that buyers in financial services, healthcare, government, and defense have already validated. When Spaarke operates within a customer's Microsoft environment, it introduces no new security perimeter for the customer's IT team to evaluate.

The passage names the proof and shows the mechanism, so the claim needs no adjective.

---

## 6. Rhetorical-question and "Imagine if" openers

### Do not write

> What if your legal department could anticipate every challenge before it happened? Imagine a world where AI handles the routine work and your team is finally free.

**Why this fails**:

- The style guide rules out `Imagine if` openers (section 5, rule 3) and teaser questions (rules 2 and 19), and both appear here.
- `AI handles the routine work` follows the "AI replaces lawyers" pattern that the do-not-claim list prohibits. Our story is AI-directed and human-controlled.

### Better: write (written for this file, with a statistic from `research-sources.md`)

> Among in-house lawyers who report high stress, 24% say that they plan to leave within the next year, according to the Association of Corporate Counsel's December 2025 report on stress among in-house legal professionals, which draws on a survey of more than 1,600 in-house lawyers and legal operations professionals in the United States. The figure measures intent, so it signals turnover risk and should not be read as a departure rate. Each departure that does occur removes knowledge that the department cannot recover from its files, because the documents stay and the reasoning behind them leaves with the lawyer.

The opening states a sourced number, says what the number can and cannot show, and then makes the claim. Earlier versions of this file quoted the opening of `institutional-knowledge`. That opening relied on a 20% annual turnover figure that `research-sources.md` has since retired, and it set off a list with an em dash. Verify the statistic again before reuse.

---

## 7. Recap-opener boilerplate

### Do not write

> Throughout this series, we have explored a wide variety of important topics. Building on this rich foundation, today we turn our attention to…

**Why this fails**:

- The paragraph contains no information that the existence of the article does not already imply.
- `Wide variety of important topics` and `rich foundation` are filler. If they are cut, nothing remains.

### Better: write (written for this file, on the subject of `the-iq-stack`)

> Point solutions divide a legal department's information. Billing data sits in one tool, contract terms sit in a second, and matter status sits in a third, so each new matter begins without the lessons of the last one. The Legal IQ stack is the architecture that we propose in response. It has three layers (data, memory, and inference), and the argument of this article is that each layer becomes more useful as the other two improve. The category that the stack supports is defined in our earlier article on Legal Operations Intelligence.

The opening spends its first sentences on the argument of the present piece, and the connection to the earlier article arrives afterward, inside the body. Earlier versions of this file offered the published opening of `the-iq-stack` as the better version. That opening begins with `In our previous article, we introduced`, which the style guide now names in section 5, rule 11, and it ends on a question that the article then answers (rule 19).

---

## 8. Em dashes and dash substitutes

- Rule: style guide, section 4 and section 5, rule 13.
- Full entry: `ai-tells.md`, section 4.1.
- Sources of the passages: `content/blog/2026-01-04-what-is-legal-operations-intelligence.mdx:30` and `content/blog/2026-02-22-ai-without-giving-away-the-keys.mdx:89`.

### Do not write

> Institutional knowledge [EM DASH] the rationale behind a settlement strategy, the context for choosing one firm over another, the precedent that should inform a new dispute [EM DASH] lives in the heads of senior practitioners.
>
> The intelligence belongs to you [EM DASH] and it stays with you.

**Why this fails**:

- Readers treat the mark as the most visible sign of machine-written text, and they see it before they read a single claim. The audit counted 601 em dashes in 19 published articles.
- A spaced en dash, a double hyphen, and a spaced hyphen are the same gesture in a different glyph, and they are not substitutes.
- In the second passage the dash introduces an afterthought that carries emphasis and no information.

### Better: write

> Institutional knowledge (the rationale behind a settlement strategy, the context for choosing one firm over another, and the precedent that should inform a new dispute) lives in the heads of senior practitioners.
>
> The intelligence that accumulates belongs to the organization, because it is stored inside the organization's own tenant and governed by the organization's own policies.

Decide what the dash was doing, and then choose the replacement from the table in the style guide, section 4. A list inside an aside takes parentheses, and an afterthought either receives real content or is deleted.

---

## 9. Negation followed by correction

- Rule: style guide, section 5, rule 14.
- Full entries: `ai-tells.md`, sections 2.1 and 2.2.
- Sources of the passages: `content/blog/2026-03-07-the-20b-blind-spot.mdx:84` and `content/blog/2026-03-14-institutional-knowledge.mdx:84`.

### Do not write

> The difference is not better software. It is better architecture.
>
> An organization that retains operational memory does not just avoid loss. It gets smarter.

**Why this fails**:

- The first sentence of each pair denies a view that nobody in the audience holds, so that the second sentence can sound like a discovery.
- The construction is the best-known tic of machine-written prose. The audit counted 59 two-sentence instances and 52 uses of `not just` in 19 published articles.
- The second sentence of each pair is an abstraction, so the reader still does not know what the difference is.

### Better: write

> The difference lies in the architecture. Reporting requires data, whereas intelligence requires data, memory, and inference working together, so that every invoice processed and every matter closed makes the next forecast more accurate.
>
> An organization that retains operational memory avoids the loss, and it also improves over time, because each closed matter adds to the record that the next decision draws on.

Each rewrite states the positive claim and gives the reason. When a real view has to be rebutted, name who holds it and answer it with evidence, in full sentences.

---

## 10. Tagline contrasts

- Rule: style guide, section 5, rule 15.
- Full entry: `ai-tells.md`, section 2.3.
- Source of the passage: `content/blog/2026-03-21-breaking-the-silo.mdx:60`.

### Do not write

> Board reporting becomes a query, not a project.

**Why this fails**:

- Two nouns stand where an explanation should be. Earlier voice documents called the device a "two-noun framing" and praised it.
- The audit recorded 85 hits for the `, not` pattern in the published library, and several of them appear in bold or as the last line of a paragraph.

### Better: write

> Board reporting on legal risk can be run as a query against a single view of litigation exposure, contract risk, regulatory status, and vendor performance. Previously the same report had to be assembled by hand from four departments.

An ordinary contrast inside a sentence that goes on to explain the difference is normal English. The failure is the slogan that replaces the explanation.

---

## 11. Verbless fragments and fragment stacks

- Rule: style guide, section 5, rule 16.
- Full entry: `ai-tells.md`, section 2.4.
- Source of the passage: `content/blog/2026-02-22-ai-without-giving-away-the-keys.mdx:67`.

### Do not write

> No governance framework. No audit trail. No data boundary.

**Why this fails**:

- None of the three strings has a subject or a verb, and the stack performs an emphasis that the content has not earned.
- The reader is not told who lacks these controls or what follows from the lack.

### Better: write

> When individual lawyers use consumer AI tools with client data, the department has no governance framework, no audit trail, and no data boundary for that work, and it cannot see what information is being shared or which outputs are being relied upon.

The sentence has a subject and a verb, and it names the situation in which the three controls are missing.

---

## 12. One-sentence dramatic paragraphs

- Rule: style guide, section 3 and section 5, rule 17.
- Full entry: `ai-tells.md`, section 3.1.
- Source of the passage: `content/blog/2026-03-01-the-ai-readiness-gap.mdx:27`, where the sentence stands alone as a paragraph.

### Do not write

> For most legal departments, the honest answer is no.

**Why this fails**:

- White space around a short sentence claims an importance that the argument should demonstrate.
- The sentence answers a question that the writer posed one line earlier, so it also belongs to section 14.

### Better: write

> In our assessment, most legal departments are not yet ready for AI. On the five-level maturity model described in an earlier article, the majority still operate at Level 1 or Level 2, with point solutions in place and data scattered across systems.

The short sentence becomes the topic sentence of the paragraph that supports it. A one-sentence paragraph is acceptable only as a lead-in to a list, a block quotation, or an exhibit.

---

## 13. Clipped aphoristic closers

- Rule: style guide, section 2 and section 5, rule 18.
- Full entries: `ai-tells.md`, sections 2.5 and 3.2.
- Source of the passage: `content/blog/2026-03-07-the-20b-blind-spot.mdx:58`.

### Do not write

> Dashboards visualize. Intelligence reasons.

**Why this fails**:

- A pair of short symmetrical sentences at the end of a paragraph is a recognized template, and it restates what the paragraph has already shown.
- Earlier voice documents praised the device as "a long claim, a short landing" and quoted `One learns. The other just runs.` as a model. That advice is withdrawn.

### Better: write

> Dashboards show what is in the data. The questions that a general counsel faces at a quarterly review, such as whether a matter's cost is reasonable and what the next quarter will look like, require the data to be combined with the department's history and reasoned over.

A paragraph ends when its evidence or reasoning is complete, and it does not need a landing line.

---

## 14. Rhetorical question followed by its own answer

- Rule: style guide, section 5, rule 19.
- Full entry: `ai-tells.md`, section 2.6.
- Source of the passage: `content/blog/2026-02-01-your-legal-data-belongs-to-you.mdx:40`.

### Do not write

> That iPaaS platform connecting your matter management system to your e-billing tool? Your data passes through their servers on every sync.

**Why this fails**:

- The writer poses a question that the reader did not ask and answers it in the next sentence, which stages a discovery that the writer has already made.
- The question is also a verbless fragment (section 11).

### Better: write

> An integration platform that connects the matter management system to the e-billing tool passes the department's data through the integration vendor's servers on every sync.

Diagnostic questions that readers can put to their own departments remain welcome, as does a title question that the style guide permits under section 5, rule 2.

---

## 15. Colon reveals and signposting

- Rule: style guide, section 5, rules 20 and 21.
- Full entries: `ai-tells.md`, sections 2.7 and 2.8.
- Sources of the passages: `content/blog/2026-02-01-your-legal-data-belongs-to-you.mdx:80` and `content/blog/2026-03-01-the-ai-readiness-gap.mdx:47`.

### Do not write

> There is an architectural answer to this problem, and it starts with a simple principle: your legal data should never leave your environment.
>
> Now consider what happens when you point an AI tool at this landscape.

**Why this fails**:

- The colon in the first passage works as a drum roll, and the words before it announce that a point is coming without making it.
- `Now consider` tells the reader that a point is on its way. The sentence can be deleted without any loss of content.

### Better: write

> The architectural answer starts from the principle that legal data should never leave the department's own environment.
>
> An AI tool that reads data in this condition produces confident-sounding answers from incomplete and inconsistent inputs.

A colon that introduces a list, a definition, or a specification after a complete clause remains correct.

---

## 16. Lists of three used for rhythm, and anaphora runs

- Rule: style guide, section 5, rule 22.
- Full entries: `ai-tells.md`, sections 2.9 and 2.10.
- Sources of the passages: `content/blog/2026-03-21-breaking-the-silo.mdx:58` and `content/blog/2026-01-25-why-we-built-on-microsoft.mdx:76`.

### Do not write

> Fewer surprises. Faster decisions. Less rework.
>
> You trust the vendor to maintain those boundaries. You trust the vendor's security team. You trust the vendor's compliance posture.

**Why this fails**:

- The first passage has three items because three sounds complete, and the writer could not defend each item separately. It is also a fragment stack.
- In the second passage the repeated opening words supply an emphasis that the content does not.

### Better: write

> Operating teams that learn of a regulatory constraint before they decide can plan around it, which spares them the rework that follows a late discovery.
>
> In a multi-tenant model, the customer depends on the vendor for three things: the partitions between customers, the competence of the security team, and the compliance posture.

Three items are right when the content has three items, as it does in the second rewrite.

---

## 17. Participle tails and intensifiers

- Rule: style guide, section 5, rules 23 and 24.
- Full entries: `ai-tells.md`, sections 2.11, 5.3, and 6.1.
- Sources of the passages: the first passage is constructed, and the second is from `content/blog/2026-01-11-the-iq-stack.mdx:78`.

### Do not write

> The department adopted e-billing in 2024, highlighting its commitment to financial discipline.
>
> This distinction matters enormously.

**Why this fails**:

- The participle clause asserts significance without a subject or evidence.
- `Enormously` claims importance instead of showing it. The audit found `actually` 24 times and `fundamentally` 13 times in the published library.

### Better: write

> The department adopted e-billing in 2024, and the system now applies the billing guidelines to every invoice before a reviewer sees it.
>
> The distinction determines what the tool can answer. A generic model can report an industry cost range, whereas a model grounded in the department's own records can forecast the cost of a particular matter.

Each rewrite replaces the claim of importance with the fact that makes the point important.

---

## 18. Summary closers

- Rule: style guide, section 3 and section 5, rules 4 and 25.
- Full entries: `ai-tells.md`, sections 3.4 and 3.5.
- Source of the passage: `content/blog/2026-03-07-the-20b-blind-spot.mdx:110`.

### Do not write

> This article examined what happens when Legal Operations Intelligence is applied to the specific problem of legal spend visibility.

**Why this fails**:

- The sentence restates the article, and it gives the reader nothing new.
- Fifteen of the 19 published articles end with a `Where to Go Next` section, and most of those sections open in this way.

### Better: write (adapted from the same article)

> A general counsel who receives the forecast in the first quarter can adjust budgets, revisit staffing, or engage alternative counsel for overflow before the spend materializes. Without the forecast, the same information arrives as an annual total, when the only remaining task is to explain the variance.

The article ends on its last substantive paragraph, which states the consequence for the reader. Related reading may follow as a plain list of links, without a recap.

---

## 19. Bold lead-in bullets that carry the argument

- Rule: style guide, section 4 and section 5, rule 26.
- Full entry: `ai-tells.md`, section 4.2.
- Source of the passage: `content/blog/2026-02-22-ai-without-giving-away-the-keys.mdx:36` to `:38`, shortened to the first sentence of each bullet.

### Do not write

> - **Trust.** Microsoft's enterprise security infrastructure has been vetted by the most demanding organizations on earth.
> - **Integration.** Copilot operates natively within Word, Outlook, Teams, and SharePoint.
> - **Data boundaries.** Copilot operates within the Microsoft 365 tenant.

**Why this fails**:

- A stack of bolded phrases with short explanations fragments reasoning that should be connected, and the reader cannot tell how the three reasons relate.
- The audit counted 303 bold lead-ins in the published library, which made the pattern the most frequent device of all.

### Better: write

> Legal departments bring AI into Microsoft 365 for three connected reasons. The corporate security team has usually evaluated the platform already, so the enterprise agreement and the risk assessment are in place. Copilot works inside Word, Outlook, Teams, and SharePoint, where legal work is done, so lawyers have no second interface to learn. Because Copilot operates within the Microsoft 365 tenant, data does not leave the organizational boundary for AI processing, and departments that handle privileged communications treat that boundary as a requirement.

The pattern remains acceptable in reference material, such as glossaries, specifications, and step lists, in which each item is a separate entry that a reader looks up.

---

## Vocabulary

Sections 1, 2, and 5 show the marketing vocabulary in use. The working list of AI-era words (style guide, section 5, rule 27) is in `ai-tells.md`, section 5.1, and the older do-not-say list is in `vocabulary.md`, section 2. Sweep the draft against both lists, and then run `npm run voice:lint -- <file>`.

---

*Revised 2026-09-21 (aligned with the revised style guide, no em dashes), see git log for history.*
