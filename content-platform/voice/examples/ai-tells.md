# AI tells: constructions to find and remove

This file is a working reference for the drafting agent. Load it before drafting, so that the constructions are not written in the first place, and load it again before review, so that any that slipped through are removed. The rules themselves are in `../style-guide.md`, section 5 (rules 13 to 27). The positive model is in `consulting-register.md`.

Three notes apply to the file itself. First, every before and after pair in sections 2 to 6 was written for this file in Spaarke's subject area, and the figures in those examples are illustrative. Second, the "before" examples contain the words and constructions under discussion, so `npm run voice:lint` reports warnings on this file by design; it must still report 0 errors. Third, no example in this file prints an em dash. Where an example needs one, the placeholder [EM DASH] marks the position. The single em dash in the file is the workflow marker defined in section 4.1, which is a tool token and has to appear in its literal form so that tools can find it.

The research behind the file is in `content-platform/research/2026-09-loi-series/notes/`: `ai-writing-tells.md`, its fact-check in `ai-writing-tells.verified.md`, and the audit of our own library in `library-audit-local.md`.

---

## 1. Why these patterns matter

Spaarke's readers are general counsel, legal operations directors, and CIOs. Many of them use AI assistants every day, and that experience makes them accurate judges of machine-written prose. In a study presented at ACL 2025, Russell, Karpinska, and Iyyer asked five people who frequently use language models for writing to judge 300 non-fiction articles. The majority vote of the five misclassified one article, while readers without that experience performed close to chance. The experienced readers most often cited vocabulary (in 53.1% of their explanations) and sentence structure (35.9%), followed by grammar and punctuation, originality, quotations, over-explanation, formatting, and formulaic conclusions.

Our working assumption is that a reader who concludes that an article was machine-written stops extending good faith to its claims. Harvard Business Review now tells contributors that their ideas "should not be easily replicable by simply asking a large language model (LLM)" (guidelines for contributors, updated June 10, 2026). A company that asks legal departments to trust it with privileged work is held to the same standard.

The audit of our own library shows how far the published articles are from that standard. Across 19 articles it counted 601 em dashes, 59 instances of negation followed by correction, and 303 bold lead-ins. It also found that the devices cluster: a typical paragraph chained a negation, a fragment, and a short symmetrical closer. The density and the co-occurrence of the devices, more than any single device, produced the machine-written effect.

### The order of importance

The research ranked the tells by how much they matter to expert professional readers. The ranking is a synthesis of the evidence by our researchers and has not been measured directly. Each tell in this file carries its tier.

1. **Tier 1: empty content.** This tier covers inflated significance, vague attribution, participle tails that assert importance, conclusions that restate, and one point diluted across a whole piece. These readers are trained to ask who says so and on what evidence, and an unsupported claim costs credibility whoever wrote it.
2. **Tier 2: manufactured drama.** This tier covers negation followed by correction, the self-answered question, the colon reveal, the one-sentence paragraph, signposting, and the aphoristic closer. These constructions have proved the most durable across model generations, and each one implies that the reader held a naive view that needed correcting. The Atlantic reported on July 12, 2026 that the `not just X but Y` pattern "has shown no signs of abating", and the detection vendor Pangram estimates that it appears three times as often in AI writing as in human writing.
3. **Tier 3: template rhythm.** This tier covers reflexive lists of three, uniform paragraph length, a landing sentence on every paragraph, section announcements and recaps, template headings, and bold labels in place of reasoning. Readers may not name these devices, but the devices produce the feeling that the prose is statistically well behaved.
4. **Tier 4: dashes.** The em dash is weak evidence of authorship, because human writers and the target publications use it. In the ACL study cited above, experienced readers even treated dashes as a sign of human writing. The mark is nonetheless a strong trigger of suspicion among general readers, because a reader sees it before reading a single claim, and it is cheap to remove.
5. **Tier 5: vocabulary.** Word lists matter least and age fastest. Wikipedia's catalog records that `delve` "dropped off sharply in 2025", and a preprint by Yakura and colleagues found the same words entering spontaneous human speech. Cut clusters of these words, and cut the older corporate fillers on plain-style grounds.

The tiers rank how strongly a feature signals machine authorship. They do not rank how much the words matter. Tier 5 covers removal vocabulary: the words to cut. Naming vocabulary is a separate and first-order question, because the terms that name the decision, the actors, and what each produces carry the argument's claims about causation and authority, and a wrong name cannot be fixed by editing. Naming vocabulary is governed by `vocabulary.md`, `stance.md` section 2, and `domain-knowledge.md` section 3, and all three are read before drafting.

### Fix the vagueness as well as the sign

Wikipedia's editors, who maintain a public catalog of these signs, warn against cosmetic repair: "Please do not merely treat these signs as the problems to be fixed; that could just make detection harder." (Wikipedia: Signs of AI writing, as revised on September 21, 2026.)

The warning applies to every entry in this file. Most tells mark the place where a sentence was written without a specific fact to put in it. The repair is to supply the fact (a named source, a number, a case, or a reason) and only then to tidy the surface. An edit that removes the construction and keeps the vagueness has not fixed the sentence, and the "after" examples in this file therefore add information that the "before" examples lacked.

Over-correction has its own signature. Prose that avoids every list of three and every contrast is also unnatural. The test for any device is whether the content called for it: three items when there are three items, and a contrast when a real and attributable view is being answered.

---

## 2. Sentence constructions

### 2.1 Negation followed by correction (tier 2)

The writer uses two sentences, or two clauses, in which the first denies something and the second supplies the supposedly real answer. The forms are `It is not X. It is Y.`, `This is not about X. It is about Y.`, and `Not because X. Because Y.` The denied view is usually one that nobody in the audience holds.

- Before: "Invoice review is not a compliance exercise. It is a pricing conversation."
- After: "Invoice review influences price as well as compliance, because every rejected line item tells the firm how the department will read the next invoice."
- Before: "Departments miss accrual deadlines not because they are careless. They miss them because the data arrives late."
- After: "Departments miss accrual deadlines because firms submit their estimates after the finance calendar has closed, and nobody in the department is assigned to chase them."

When the denied view is real, attribute it and answer it with evidence. For example: "Several panel firms told the department that fixed fees would reduce quality. The department's outcome data for 140 employment matters showed no difference in settlement value between fixed-fee and hourly matters."

### 2.2 The "not just" escalation (tier 2)

The form is `not just X but Y`, or `does not just X. It Ys.` The first half concedes something ordinary so that the second half can sound larger, and the second half is usually an abstraction.

- Before: "A matter taxonomy does not just organize data. It unlocks insight."
- After: "A matter taxonomy with 40 agreed matter types lets the department compare the cost of similar matters across firms, which free-text matter names never allowed."

### 2.3 The tagline contrast (tier 2)

The form is `X, not Y`, in which two nouns or two adjectives stand in for an explanation. Earlier voice documents called it a "two-noun framing". It often appears in bold, as a heading, or as the last line of a paragraph.

- Before: "Intake is a discipline, not a form."
- After: "Intake works when someone has decided who may submit a request, what a request must contain, and who assigns it. The form only records those decisions."

An ordinary contrast inside a sentence that goes on to explain the difference is normal English. The tell is the slogan that replaces the explanation.

A concession is not a slogan. Where the contrast names a fault in the reader's own function, keep the fault and give it a subject and a finite verb.

- Before: "Legal as an enabler, not a roadblock."
- After: "Legal can become an impediment to the business. A business unit that waits in the department's queue for a standard non-disclosure agreement loses time, and a business that routinely waits learns to work around the department."

The test is whether the negative half carries information the argument depends on. Where it does, promote it to a sentence of its own with the offending party as the subject; where it only supplies contrast, cut it.

### 2.4 Verbless fragments and fragment stacks (tier 2)

A fragment is a string of words that is punctuated as a sentence but lacks a subject or a finite verb. Fragments are often stacked in threes, with `No` or `Not` at the front.

- Before: "No intake queue. No assignment rules. No record of who asked for what."
- After: "The department had no intake queue and no assignment rules, so nobody could say which business unit had asked for what."

### 2.5 The clipped aphoristic closer (tier 2)

A paragraph or an article ends on two short symmetrical sentences, and the second mirrors or inverts the first. Earlier voice documents praised the device as "a long claim, a short landing".

- Before: "In the first year the billing rules rejected 3% of invoiced fees. Rules catch errors. Judgment catches waste."
- After: "In the first year the billing rules rejected 3% of invoiced fees, and almost all of the rejections corrected rate and timekeeper errors. None addressed whether a matter had been overstaffed, which is a question the rules cannot ask."

### 2.6 The rhetorical question followed by its answer (tier 2)

The writer poses a question that the reader did not ask and answers it in the next breath. The forms include `The result?`, `So why does this happen?`, and a question that closes one paragraph so that the next can open with `The answer is`.

- Before: "So why do most knowledge management programs stall? The answer is simple: nobody owns them."
- After: "Most knowledge management programs stall because nobody owns them. The precedent library is assigned to a committee, the committee meets quarterly, and the documents go out of date between meetings."

Diagnostic questions that readers can put to their own departments are content, and they remain welcome. A title question is governed by the style guide, section 5, rule 2.

### 2.7 The colon reveal (tier 2)

A colon is used as a drum roll before a word or a short phrase. The forms include `The result:`, `The lesson was clear:`, and `It comes down to one word:`.

- Before: "After a year of panel reviews, the lesson was clear: data wins."
- After: "The departments that brought their own cycle-time and outcome data to the panel review negotiated lower blended rates than the departments that relied on the firms' proposals."

A colon that specifies is correct. "The review identified one cause: no one was responsible for keeping the rate table current" tells the reader what the cause was and stages nothing.

### 2.8 Signposting and throat-clearing (tier 2)

These phrases announce that a point is coming instead of making it. The forms include `Here is the thing`, `Here is why`, `Let us unpack`, `Let us dive in`, and `Now consider`.

- Before: "Here is the thing about outside counsel guidelines. Let us unpack why they fail."
- After: "Outside counsel guidelines fail when the billing system cannot enforce them, because a reviewer cannot check a 40-page document against every line of every invoice."

`Consider, for example, X` is exempt, and so is the bare `Consider X` where X is the hypothetical case itself ("Consider an online marketplace that groups a year of matters by type and cost"). Hypothetical cases are told in the present tense and marked with "Consider" inside the sentence that tells them, never with a disclaimer sentence about the passage. What this entry catches is `Now consider` standing alone as a paragraph opener, where the words announce a point instead of making one.

### 2.9 The list of three used for rhythm (tier 3)

Three adjectives, three verbs, or three parallel clauses are chosen because three sounds complete. The test is whether the writer could defend each item separately.

- Before: "The new intake process is faster, smarter, and more transparent."
- After: "The new intake process cut the median time to assign a request from three days to four hours."

### 2.10 The anaphora run (tier 3)

Three or more consecutive sentences open with the same words, so that repetition supplies the emphasis that the content does not.

- Before: "They wanted visibility. They wanted control. They wanted answers."
- After: "The general counsel asked for one report each month: outside counsel spend by business unit, compared with budget."

A diagnostic list is exempt, and so is deliberate repetition inside reference material. Where each item of a list is a question addressed to "you", the sentence that follows the question may use a repeated frame saying what a "no" would reveal, and the repeated wording is what makes the list scannable (`style-guide.md`, section 5, rules 19 and 22). Leave those runs alone during a sweep. What this entry catches is consecutive sentences in running prose, where the repetition supplies emphasis the content has not earned.

### 2.11 The present-participle tail (tier 1)

A clause that begins with a participle is attached to the end of a sentence in order to claim significance. The forms include `, highlighting the importance of`, `, underscoring the need for`, and `, reflecting a broader shift toward`. Researchers measured present participial clauses in instruction-tuned models at two to five times the human rate (Reinhart and colleagues, PNAS, 2025).

- Before: "The department reduced its panel from 38 firms to 14, underscoring the growing importance of strategic partnerships."
- After: "The department reduced its panel from 38 firms to 14 and used the larger volume per firm to negotiate fixed fees for routine employment matters."

### 2.12 The false range (tier 3)

The sentence uses a `from X to Y` construction in which X and Y are not the ends of any real scale, and it usually doubles the construction for rhythm.

- Before: "From the first request to the final invoice, from the mailroom to the boardroom, legal operations touches everything."
- After: "Legal operations manages four processes in this department: matter intake, outside counsel selection, invoice review, and reporting to the general counsel."

### 2.13 The compressed antithesis (tier 2)

A paragraph's last sentence ends on a constructed contrast between two nouns, so that the shape of the sentence stands in for the claim. It passes every check aimed at the two-sentence version (2.5) and every check aimed at the tagline (2.3).

- Before: "That evidence is the difference between a guardrail the business trusts and a rule the business routes around."
- After: "Business teams are far more likely to follow guardrails they understand and trust."

---

## 3. Paragraph and document structure

### 3.1 The one-sentence dramatic paragraph (tier 2)

A short sentence is set alone between two paragraphs so that white space supplies the emphasis.

- Before: "And then the general counsel retired."
- After: "The arrangement worked while the general counsel who had negotiated it remained in the role. When she retired, the department discovered that the fee terms had never been written into the engagement letters."

A one-sentence paragraph that introduces a list, a quotation, or an exhibit is functional and is not a tell.

### 3.2 A landing sentence on every paragraph (tier 3)

Each paragraph closes with a line that restates its point in compressed form, so that every thought receives a moral. The repair is to let some paragraphs end on their evidence.

- Before: "The firm's estimates were 30% below actual cost on four of six matters. And that is why budgets matter."
- After: "The firm's estimates were 30% below actual cost on four of six matters."

The tell is a sentence that restates the paragraph in compressed form. A sentence saying what the evidence means for the reader's own department is content, and an evidence paragraph is usually better for having one.

- Before: "Fewer than one in five of those departments had pressed their firms to show what their use of AI had saved. The dissatisfaction is therefore largely unspoken, and a firm that has never been asked the question has nothing to answer."
- After: "Fewer than one in five departments had pressed their firms to show what AI had saved. Departments that want to see AI savings will need to ask for them."

The "before" ending is a further observation about the market; it is well made and the reader can do nothing with it. The "after" ending is an instruction.

### 3.3 Uniform paragraph length and rhythm (tier 3)

Every paragraph has the same number of sentences, and every sentence falls in the same narrow range of length. The repair is to let content set the length, and variety is never manufactured with fragments.

- Before: "Five consecutive paragraphs of four sentences each, with every sentence between 18 and 24 words and every paragraph closing on a moral."
- After: "Paragraph length follows the argument: a long paragraph where a case needs room, and a three-sentence paragraph where the point is simple."

### 3.4 The summary closer (tier 1)

A final paragraph or section restates the article. It is often introduced by `In conclusion`, `In summary`, or `This article explored`, and it often ends on a vague and positive forecast.

- Before: "In summary, knowledge management is more important than ever, and departments that invest in people, process, and technology will be well placed for the future."
- After: "In each of the three departments described here, the precedent library had no named owner, and its contents were out of date within a year of launch. A department that plans a knowledge program should name the owner before it chooses the tool."

The four-beat close described in `style-guide.md`, section 3, is exempt. Beat 1 of that close is one short synthesis paragraph naming the changes the article described, and it is followed by the thesis in the words the opening used, by a paragraph of first moves addressed to the reader's role, and by the forward pointer. That paragraph is orientation for a reader who skipped a section, and the beats after it carry the instructions. Leave it in place during a sweep, and leave the heading that reuses the title's key term in place with it. What this entry catches is the final paragraph or section that restates the article and stops there, with no first move after it.

### 3.5 The "despite these challenges" formula (tier 1)

A closing turn acknowledges difficulties in general terms and then reassures the reader.

- Before: "Despite these challenges, the future of legal operations remains bright."
- After: "Delete the sentence, and end on the last substantive point or on a question that the evidence leaves open."

### 3.6 Section announcements, section recaps, and series recaps (tier 3)

Each section announces what it will do, does it, and then says what it did. The series version opens an article by summarizing the previous articles.

- Before: "In this section, we will explore three key considerations for matter intake. As we have seen, intake matters."
- After: "The first consideration is who may submit a request."

This entry covers the recap paragraph. It does not restrict naming our own prior work, which is house form wherever it sits in the piece: "In our earlier article, [From Reactive to Predictive](/why-spaarke/loi-maturity-model), we mapped the frameworks against the maturity question in detail." One such construction may sit in the opening itself, after the thesis, where it credentials the claim just made, and a long-form article in a series normally carries five or six in all (`style-guide.md`, section 5, rule 11). "In our previous article" and "In our earlier articles" are the same construction. Do not remove or reword any of them during a sweep, in the opening or in the body. The tell this entry names is an opening paragraph spent on what the earlier articles said; a sentence that makes Spaarke the actor of its own citation does the opposite, because it tells the reader whose evidence they are reading.

### 3.7 One point diluted across the piece (tier 1)

The same claim returns in every section in fresh words, sometimes as a recycled stock sentence, and the article never moves past it.

- Before: "The claim that fragmented data limits AI appears in the opening and is then restated, in different words, in each of five sections."
- After: "The claim is stated once, in the opening. The remaining sections supply the evidence, a counter-case, the limits of the claim, and what the reader should do about it."

One repetition is correct and is not dilution. Fix a single phrase for the piece's central positioning claim and repeat it almost verbatim at three anchors: the opening thesis, the heading of the section that proves it, and the close. One published article anchors its thesis with "Legal operations is the facilitator and catalyst for that decision", then "Legal operations is the catalyst and manager of the operating model", then "Legal operations is the facilitator, catalyst, and manager of that change" (`content/blog/2026-06-16-managing-legal-operations.mdx`). That is quoted to show the anchoring, and the phrase is that article's own rather than a house formula. Do not paraphrase the phrase chosen for a piece to avoid repetition; the reader should be able to repeat the phrase after one reading. The tell this entry names is the argument returning in fresh words in every section, which leaves nothing fixed in the reader's memory.

---

## 4. Punctuation and formatting

### 4.1 The em dash and its substitutes (tier 4)

The em dash is the long dash, about the width of a capital M (Unicode U+2014). House style never uses it, in any position, in any field. The mark often carries another tell, because it is the usual hinge of negation followed by correction, of the staged reveal, and of the afterthought tail. Removing the glyph without removing the gesture leaves the tell in place, so the first step is always to decide what the dash was doing.

**Job 1: the parenthetical aside (a pair of dashes).** A short aside that is closely tied to the sentence takes a comma pair.

- Before: "The intake form [EM DASH] which most business units still bypass by email [EM DASH] determines the quality of every later report."
- After: "The intake form, which most business units still bypass by email, determines the quality of every later report."

A supplementary detail that has commas of its own, such as a list, takes parentheses.

- Before: "Four of the nine panel firms [EM DASH] the two litigation boutiques, the patent firm, and the regional employment firm [EM DASH] submitted budgets late."
- After: "Four of the nine panel firms (the two litigation boutiques, the patent firm, and the regional employment firm) submitted budgets late."

An aside that is long enough to be a thought of its own becomes a sentence.

- Before: "The knowledge manager [EM DASH] she had built the clause library herself over six years and was the only person who knew how it was organized [EM DASH] left in March."
- After: "The knowledge manager left in March. She had built the clause library herself over six years, and she was the only person who knew how it was organized."

**Job 2: amplification or definition (a single dash that could be read as "namely").** Use a colon, provided that the words before it form a complete clause.

- Before: "Finance asked for a figure the department had never produced [EM DASH] an accrual, meaning the value of work performed but not yet invoiced."
- After: "Finance asked for a figure the department had never produced: an accrual, meaning the value of work performed but not yet invoiced."

Check that the colon specifies and does not stage a reveal (section 2.7).

**Job 3: the list introduction.** Use a colon after a complete clause. For a list in the middle of a sentence, use "such as" and commas, or parentheses.

- Before: "Three systems hold the data [EM DASH] the matter management system, the e-billing platform, and the contract repository."
- After: "Three systems hold the data: the matter management system, the e-billing platform, and the contract repository."
- Before: "Routine requests [EM DASH] NDAs, vendor renewals, marketing reviews [EM DASH] account for most of the intake volume."
- After: "Routine requests, such as NDAs, vendor renewals, and marketing reviews, account for most of the intake volume."

**Job 4: the abrupt turn (a single dash between two clauses, or before a tail).** When both clauses are short and balanced, use a semicolon.

- Before: "The guidelines cap partner time at 20% of hours [EM DASH] the invoices show 35%."
- After: "The guidelines cap partner time at 20% of hours; the invoices show 35%."

When either clause is long, or the second is a new step in the argument, use a full stop and a new sentence.

- Before: "We moved intake to a single queue in January [EM DASH] and by April the median response time had fallen from six days to two, which the sales team noticed before we reported it."
- After: "We moved intake to a single queue in January. By April the median response time had fallen from six days to two, and the sales team noticed the change before we reported it."

A conjunction that names the logic is often better than either mark. The dash allows the writer to avoid deciding what the relation is, and deciding improves the sentence.

- Before: "The department could not forecast litigation spend [EM DASH] matter budgets were never recorded."
- After: "The department could not forecast litigation spend because matter budgets were never recorded."

When the dash sets up a punchline or the second half of a negation, restructure the sentence. A semicolon in the same position keeps the tell.

- Before: "The clause library was not a knowledge system [EM DASH] it was a filing cabinet."
- After: "The clause library stored approved clauses but recorded nothing about when each had been accepted or refused, so negotiators still telephoned the lawyer who remembered."

When the dash introduces an afterthought, give the afterthought real content or delete it.

- Before: "The dashboard shows spend by firm [EM DASH] and that matters."
- After: "The dashboard shows spend by firm, which is the comparison the general counsel needs for the panel review."

**Substitutes that must also go.** A spaced en dash, a double hyphen, and a spaced hyphen are the same gesture in a different glyph. The practitioner catalog tropes.fyi now detects the double hyphen separately, because AI-generated text increasingly uses it in place of the em dash. In the examples that follow, the placeholders [SPACED EN DASH], [DOUBLE HYPHEN], and [SPACED HYPHEN] mark the positions. Numeric ranges are written with "to".

- Before: "The panel review [SPACED EN DASH] long overdue [SPACED EN DASH] began in May."
- After: "The panel review, long overdue, began in May."
- Before: "The pilot ran 2024 [SPACED HYPHEN] 2026 and covered 40 [DOUBLE HYPHEN] 60 matters a quarter."
- After: "The pilot ran from 2024 to 2026 and covered 40 to 60 matters a quarter."

After any replacement, reread the paragraph. If it now carries three colons or three semicolons, the habit has only moved, and the sentences should be rewritten so that words carry the logic.

One em dash is permitted in the repository. The workflow marker **TBD — confirm** is a tool token that flags an unverified fact. It is written exactly that way so that tools can find it, and it must never survive to publication.

### 4.2 Bold labels in place of reasoning (tier 3)

The tell is a bolded phrase followed by an assertion that nothing supports, repeated down the page so that the formatting supplies the structure the argument lacks. The fault sits under the label rather than in it: the bulleted form is house form in the cases set out in `style-guide.md`, section 4, and a one-word label is correct where the item carries its own content.

- Before: "**Visibility.** Spend data arrives in real time. **Control.** Guidelines are enforced automatically. **Insight.** Trends surface without manual work."
- After: "**Visibility.** Invoices post to the matter as they arrive, so the department sees committed spend before the month closes. **Control.** Every line item is tested against the billing guidelines before a reviewer opens the invoice, which is the only point at which a 40-page document can be applied to 4,000 lines. **Insight.** The same records answer the question the guidelines cannot reach, which is whether a matter was staffed at the level the work needed."

The labels are unchanged between the two versions, and that is the point of the pair. What changes is the evidence under each one, and the repair is always to supply the missing fact and keep the list. A bare noun label ("**Cost.**", "**Risk level.**", "**Timing.**") is house form where the item carries its own evidence, its own worked example, or the question it tests. The fuller "Name: what it does" label is the better choice where the label alone has to tell the reader what the item is for, such as a counted framework of capabilities. Both forms are correct, and a sweep does not convert one into the other. Convert to paragraphs only where the items are not parallel, or where an item needs a full paragraph of reasoning to stand up; in that case every item gets a paragraph and each one keeps its bold label.

### 4.3 Mechanical bold in running text (tier 3)

Bold type is scattered across ordinary words in running text in order to add emphasis.

- Before: "The **key** is **alignment** between **legal** and **finance**."
- After: "Legal and finance need to agree on one accrual calendar."

### 4.4 Topic labels and template headings (tier 3)

The headings name a topic or follow a template, and they are often set in title case. The template `What It Is`, `Why It Matters`, `How To Get Started` is the most familiar.

- Before: "Overview. What It Is. Why It Matters. How To Get Started."
- After: "Most intake requests arrive by email. Email intake hides the department's workload. A single queue makes the workload measurable."

Headings inside an article use sentence case and state the point of the section.

### 4.5 Decorative markers (tier 3)

The draft uses emoji, arrows in place of words, or a horizontal rule after every section.

- Before: "A rocket emoji before a heading, an arrow in place of the words 'leads to', and a rule between every pair of sections."
- After: "Plain headings and plain words."

The arrow notation in the name of the Legal IQ stack (Data → Memory → Inference) is a product term and stays.

---

## 5. Vocabulary

### 5.1 AI-era words in clusters (tier 5)

The words most often cited are `delve`, `tapestry`, `testament`, `realm`, `landscape`, `pivotal`, `crucial`, `paramount`, `underscore`, `foster`, `showcase`, `enhance`, `intricate`, `vibrant`, `meticulous`, `interplay`, and `garner`. The older corporate fillers compound with them: `leverage`, `seamless`, `robust`, `unlock`, `harness`, `empower`, `elevate`, `streamline`, `holistic`, `ecosystem`, `journey`, `navigate`, `transform`, `innovative`, and `cutting-edge`. One such word may be a coincidence. Several in a paragraph are among the strongest signs that experienced readers report.

- Before: "In the ever-evolving realm of legal operations, a robust intake process is crucial to unlocking seamless collaboration across the enterprise."
- After: "A single intake queue lets the department count its requests, and the count is the evidence the general counsel needs when asking for headcount."

### 5.2 Copula avoidance (tier 5)

The plain verbs "is" and "are" are replaced by `serves as`, `stands as`, `functions as`, or `represents`.

- Before: "The matter record serves as the department's single source of truth."
- After: "The matter record is where the department looks up budget, status, and assigned counsel."

### 5.3 Intensifiers and magic adverbs (tier 5)

The words include `fundamentally`, `genuinely`, `truly`, `enormously`, `deeply`, `quietly`, `actually` (as an intensifier), `load-bearing`, `stark`, and `staggering`. The audit found `actually` 24 times and `fundamentally` 13 times in the published library.

- Before: "This distinction matters enormously, and it fundamentally changes how departments actually work."
- After: "The distinction changes one decision: whether matter budgets are set by the firm or by the department."

### 5.4 Filler transitions and announcing phrases (tier 5)

The phrases include `It is worth noting that`, `It is important to note`, `Additionally`, `Moreover`, `Furthermore`, `Importantly`, `At the end of the day`, and `When it comes to`. Connectives that carry logic ("however", "because", "as a result", "for example") are welcome and are a different thing.

- Before: "Moreover, it is important to note that matter intake deserves attention."
- After: "Two thirds of intake requests arrived without a named business owner."

If the writer has no finding to state at that point, the sentence should be deleted.

### 5.5 Synonym cycling (tier 5)

One thing is given a new name each time it appears, in order to avoid repetition.

- Before: "The platform stores the matter. The solution then routes it, the tool notifies the team, and the system records the outcome."
- After: "The platform stores the matter, routes it, notifies the team, and records the outcome."

Lawyers read a change of term as a change of meaning, so one noun should be chosen and repeated.

Choose the noun that names the actor, not the shortest abstraction. "The function", "the organization", and "the practice" have no actor and, in a piece that also discusses the legal function and the business's functions, force the reader to resolve the referent on every use. Write "legal operations" or "the department" in full and accept the repetition: the repeated noun is the thing the article is arguing about, and repetition of the subject is not synonym cycling. Keep "function" only where a modifier does real work, as in "a capable legal operations function".

### 5.6 Invented concept labels (tier 3)

A coined name with a definite article, such as "the visibility paradox" or "the intake trap", appears once as decoration.

- Before: "We call this the visibility paradox."
- After: "The department holds five years of invoice data and cannot say what a typical employment matter costs."

Before coining a term, establish that the field has none. Legal operations directors already say "legal service delivery", "the delivery model", "matter intake", "the front door", and "alternative legal service provider", and a house coinage in place of one of those reads as a vendor renaming a thing the reader already owns (`domain-knowledge.md`, section 3). A coinage is justified only when the article names something the field has no word for, defines it in a full sentence, and then uses it to organize the argument. A name invented so that later sections can refer back to an earlier passage ("the sizing question", "the four gaps", "that routing table") is a handle, not a term, and it obliges the reader to hold a definition in order to follow the argument. Introduce a recurring decision by listing its actual options inside the sentence. One published article does it this way: "which work belongs with an in-house lawyer, which with the business under defined guardrails, which with an AI-assisted workflow, and which with an outside provider" (`content/blog/2026-06-16-managing-legal-operations.mdx`). That is quoted to show the technique, and the four options are that article's own. They are not a house set, and another piece names the options its own argument turns on. Spaarke's own product terms (Legal Operations Intelligence, operational memory, the Legal IQ stack) are established coinages and are not affected.

---

## 6. Tone

### 6.1 Inflated significance (tier 1)

An ordinary fact is presented as evidence of a larger movement. The forms include `stands as a testament to`, `plays a pivotal role in`, `marks a shift toward`, and `reflects a broader trend`.

- Before: "The new intake portal stands as a testament to the transformative power of legal operations."
- After: "The intake portal handled 1,900 requests in its first year, and 70% were resolved without a lawyer's involvement."

### 6.2 Vague attribution (tier 1)

A claim is credited to an authority that cannot be checked. The forms include `experts say`, `industry reports suggest`, `observers note`, and `studies show`.

- Before: "Experts agree that legal departments face mounting pressure."
- After: "In [named survey, year], [figure] of chief legal officers reported a mandate to reduce cost."

If no source exists, present the statement as our own observation and say what it rests on.

### 6.3 Stacked hedging (tier 1)

Several qualifiers are applied to one claim, so that the claim cannot be tested.

- Before: "This may potentially suggest that, in some cases, departments could arguably benefit from structured intake."
- After: "Departments that receive more than 50 requests a month benefit from structured intake. Below that volume, a shared mailbox and a weekly review are usually enough."

One calibrated hedge on the verb ("suggests", "tends to") is good practice. The tell is the stack.

### 6.4 Promotional register (tier 1)

The sentence offers benefit language with no object, and it is usually built from the adjectives in section 5.1.

- Before: "A powerful, comprehensive solution that empowers legal teams to do more."
- After: "The product records each matter's budget, documents, and invoices in one place, and it is designed for departments of 10 to 200 legal professionals."

### 6.5 The balanced non-position (tier 1)

The writer credits both sides of a choice and offers no judgment between them.

- Before: "Both approaches have merits, and the right choice depends on your needs."
- After: "We would centralize intake in any department with more than 15 lawyers. Decentralized intake works only where each practice group has its own coordinator."
- Before: "Meeting that expectation or declining it is itself a design decision, and the business tends to work around a department that declines it."
- After: "The better answer is to agree in advance which activities the business can handle and on what terms, with legal still part of the decision."

### 6.6 The patronizing analogy (tier 2)

The writer explains a concept that the reader already knows by comparing it with an everyday object, in the forms `Think of it as` and `It is like`.

- Before: "Think of a matter taxonomy as a filing cabinet for your data."
- After: "A matter taxonomy determines which questions the department can answer from its own records."

This audience already knows what a matter taxonomy is, so the article should go straight to the claim about it.

### 6.7 Homogeneous quotations (tier 1)

Every quoted person speaks in the voice of the article, in complete and polished sentences that contain the article's own vocabulary.

- Before: "As one general counsel put it, 'Operational intelligence is fundamentally reshaping how we deliver value.'"
- After: "Use only real quotations, kept short and in the speaker's own words."

If no real quotation exists, the point should be made in our own voice and attributed to nobody.

---

## 7. Real examples from the published library

The originals are quoted from the audit notes (`library-audit-local.md`), which give the file and the line. Each is followed by a rewrite to the new standard. Where an original contains an em dash, the placeholder stands in for it. The rewrites stay within what the surrounding article says. They are illustrations of the standard, and the published articles have not been changed.

1. Negation followed by correction. `content/blog/2026-01-04-what-is-legal-operations-intelligence.mdx:40`
   Original: "This is not a technology problem. It is an architecture problem. And it has a name."
   Rewrite: "The problem lies in the architecture. Matter, invoice, and contract data sit in separate systems that were never designed to be read together, and better tools on top of those systems do not change that."
2. The "not because" variant. `content/blog/2026-05-21-probabilistic-vs-deterministic.mdx:39`
   Original: "Not because anything is broken. Because that is what sampling from a distribution does."
   Rewrite: "The variation is expected, because the model samples from a probability distribution and a second run draws a different sample."
3. Fragment stack. `content/blog/2026-02-08-tenant-dedicated-deployment.mdx:75`
   Original: "No separate user accounts. No additional identity provider. No parallel permission structure."
   Rewrite: "Users authenticate through the same Microsoft Entra ID directory that the IT team already governs, so the deployment adds no separate user accounts, identity provider, or permission structure."
4. Clipped aphoristic closer. `content/blog/2026-01-11-the-iq-stack.mdx:112`
   Original: "One learns. The other just runs."
   Rewrite: "A connected platform improves as each closed matter adds to what it knows, whereas a collection of separate tools performs the same functions in the same way however many matters pass through it."
5. One-sentence dramatic paragraph. `content/blog/2026-03-14-institutional-knowledge.mdx:26`
   Original: "What disappears is context."
   Rewrite: "When a lawyer leaves, the briefs and contracts remain, but the context that explains them leaves with the lawyer: why a clause was conceded, which arguments the counterparty accepted, and how a particular judge prefers filings."
6. Rhetorical question followed by its answer. `content/blog/2026-03-14-institutional-knowledge.mdx:68` and `:70`
   Original: "If documentation alone cannot solve the knowledge crisis, what can?" followed by "The answer is architectural."
   Rewrite: "Documentation alone cannot solve the problem, because a document records what was decided and omits why. The reasoning has to be captured in the system where the matter is managed, at the time the decision is made."
7. Colon reveal. `content/blog/2026-03-25-legal-ops-is-not-it-for-lawyers.mdx:73`
   Original: "The difference between administrative legal ops and strategic legal ops comes down to one word: intelligence."
   Rewrite: "What separates strategic legal operations from administrative legal operations is organizational intelligence, meaning the ability to analyze, predict, and recommend from the department's own data as well as to process and report."
8. Signposting. `content/blog/2026-01-25-why-we-built-on-microsoft.mdx:30`
   Original: "We chose Microsoft. Here is why."
   Rewrite: "We chose Microsoft because the platform decision determines a department's data boundaries, its AI capabilities, and its cost of ownership, and the sections that follow take each in turn."
9. Em dash reveal. `content/blog/2026-03-01-the-ai-readiness-gap.mdx:59`
   Original: "An AI tool layered on fragmented data gives you fragmented answers [EM DASH] faster."
   Rewrite: "An AI tool layered on fragmented data returns fragmented answers. It returns them more quickly, which means that errors reach decisions sooner."
10. Em dash pair. `content/blog/2026-03-14-institutional-knowledge.mdx:94`
    Original: "It pays [EM DASH] in time, in money, in outcomes [EM DASH] for knowledge it once had and failed to retain."
    Rewrite: "The organization pays again, in time, money, and outcomes, for knowledge it once had and failed to retain."
11. Recycled stock sentence with an intensifier. `content/blog/2026-01-25-why-we-built-on-microsoft.mdx:78` and `content/blog/2026-02-22-ai-without-giving-away-the-keys.mdx:50`
    Original: "Spaarke takes a fundamentally different approach."
    Rewrite: "Spaarke runs inside the customer's Microsoft tenant, so documents and matter data stay within the security boundary that the customer's IT team already governs."
12. Summary closer. `content/blog/2026-03-14-institutional-knowledge.mdx:102`
    Original: "This article explored the organizational risk of institutional knowledge loss and the architectural response"
    Rewrite: "Delete the recap. End the article on its final substantive paragraph, and list any related reading as plain links."
13. AI-era vocabulary. `content/blog/2026-05-11-welcome-to-spaarke.mdx:80`
    Original: "To delve deeper, we recommend reading"
    Rewrite: "In our earlier articles, [Legal Ops Is Not IT for Lawyers](/why-spaarke/legal-ops-is-not-it-for-lawyers) and [The AI Readiness Gap in Legal Departments](/why-spaarke/the-ai-readiness-gap), we developed these points in more detail." The tell in the original is `delve`, not the first person. Keep the actor.

---

## 8. Pre-review checklist

Run this checklist on the complete draft, including the title and the frontmatter. It is ordered so that the mechanical checks come first and the check that matters most comes last.

**Mechanical**

- [ ] `npm run voice:lint -- <file>` reports 0 errors.
- [ ] Every lint warning has been read, and each one has been fixed or accepted for a stated reason.
- [ ] No TBD marker remains.

**Punctuation and formatting**

- [ ] The draft contains no em dash, spaced en dash, double hyphen, or spaced hyphen, in the body, the title, the headings, or the `description`, `summary`, and `keyTakeaways` fields.
- [ ] Numeric ranges are written with "to".
- [ ] No paragraph carries three colons or three semicolons as a result of dash replacement.
- [ ] Every parallel enumeration of three or more one-claim items is rendered as a bulleted or numbered list, each item carries a bold label and a claim the item itself supports, and no bold label stands in place of evidence. Either label form is correct: a bare noun where the item carries its own content, or "Name: what it does" where the label has to say what the item is for. Where genuinely parallel items each need a full paragraph of reasoning, they stay as paragraphs with a bold label on each, worded the same way across the set (`style-guide.md`, section 4).
- [ ] The article carries no more than the number of bold lead-in lists that `style-guide.md`, section 4, allows for its length. Bold-labelled paragraphs are not counted against that ceiling.
- [ ] Headings are in sentence case and state the point of each section. None is a topic label or a template.
- [ ] Running text has no mechanical bold, no emoji, and no decorative arrows.

**Sentences**

- [ ] No `It is not X. It is Y.`, no `not just X but Y`, and no `Not because X. Because Y.`
- [ ] No `X, not Y` tagline used as a heading, a bolded line, or a closer. A heading of the form `X, not only Y` is permitted where the section treats both halves (`style-guide.md`, section 5, rule 15), as is a contrast inside a sentence that goes on to explain the difference.
- [ ] No verbless fragment and no fragment stack.
- [ ] No pair of clipped symmetrical sentences at the end of a paragraph or of the article.
- [ ] No question that the writer answers in the next sentence. The only questions are diagnostic questions for the reader and a title question permitted by the style guide.
- [ ] No colon used as a drum roll.
- [ ] No signposting phrase (`Here is the thing`, `Here is why`, `Let us unpack`, `Now consider`).
- [ ] Every list of three has three real items, and no run of sentences in running prose opens with the same words. A diagnostic list is exempt: each question there may be followed by one sentence in a repeated frame saying what a "no" would reveal, and so is deliberate repetition inside reference material (`style-guide.md`, section 5, rules 19 and 22).
- [ ] No participle tail that claims significance.
- [ ] Sentences are complete, and the lint reports a mean sentence length of roughly 15 to 25 words. A sentence opens with "But" or "Yet" only where the word carries a real turn, never in consecutive sentences, and never to launch a clipped line.

**Paragraphs and structure**

- [ ] The thesis arrives within the first 150 words of a short post or the first 250 words of a long-form article, and never later than the third paragraph.
- [ ] Each paragraph has a topic sentence, development, and evidence, and paragraph length varies with the argument.
- [ ] No one-sentence paragraph is used for effect.
- [ ] Paragraphs do not all end on a landing sentence.
- [ ] No section announces itself or recaps itself, and the opening does not recap the series.
- [ ] The close runs in four beats under a heading that reuses the title's key term (`style-guide.md`, section 3): one short synthesis paragraph naming the changes the article described, the thesis in the words the opening used together with the sentence that discharges the title, a paragraph of first moves addressed to the reader's role as bare imperatives, and the forward pointer. Beat 1 stays; what is out is a closing section that restates the argument in fresh words and stops there.
- [ ] The close carries no "Conclusion" heading, no reassuring forecast, and no pitch, and it leaves the reader with a first move rather than a risk alone.

**Vocabulary and tone**

- [ ] No cluster of the words in section 5.1 or in `vocabulary.md`, section 2, appears, and no single use remains where a plainer word or the specific fact would do.
- [ ] No `serves as` or `stands as` where "is" would do.
- [ ] No intensifier is doing the work of evidence.
- [ ] One term is used for one thing throughout.
- [ ] No claim carries more than one hedge.
- [ ] Every quotation is real.
- [ ] In a sentence about legal judgment, no sentence gives legal operations "owns" or "decides", which belong to the department and the general counsel; legal operations may own an operating responsibility. And no sentence attaches legal risk to the business as something it holds, shares or participates in, though business teams may manage scoped legal-related activities and their risks inside guardrails the department sets (`voice/stance.md`, section 2).
- [ ] No sentence refers to a cause by its ordinal.
- [ ] Every bibliographic first-person reference to our own prior work has been left untouched by the sweep, wherever it sits. That covers "In our earlier article, [title], we discussed", "In our previous article", "In our earlier articles", and the one such construction rule 11 permits in the opening after the thesis. It also covers a bare link where the sentence's subject is the problem rather than our treatment of it (`style-guide.md`, section 1). Where a cross-link matches none of those forms, leave it and raise it with the writer rather than rewriting it.

**Substance**

- [ ] Every statistic names its source, its year, and its sample where that matters, and the text says what the number shows.
- [ ] No claim rests on `experts say` or `industry reports`.
- [ ] The article takes a position and says under what condition the alternative would be right.
- [ ] For every sentence flagged above, the repair added the missing fact (a source, a number, a case, or a reason) and did more than remove the pattern.
- [ ] Every statistic names its source, its year, and its sample size and population on first use; later uses take a short name, unless the first mention was deliberately light so the claim could come first; and no descriptor survives whose only job is to limit how far the finding generalizes.
- [ ] No limitation stands as a sentence of its own at the end of a paragraph, and the piece carries at most two full two-sentence interpretations.
- [ ] The piece states at least one claim from practice, and at least one recommendation where a choice exists.

---

*Created 2026-09-21, see git log for history.*
