# The house exemplar

This file names one published article as the model of what Spaarke sounds like, and annotates the passages that carry the voice. The canonical exemplar is `content/blog/2026-06-16-managing-legal-operations.mdx`, rewritten by the writer in September 2026 and approved as house voice.

Read it in full before drafting a long-form article. `style-guide.md` gives the rules, `stance.md` gives the posture, `consulting-register.md` gives the external register we are measured against, `ai-tells.md` gives what to remove, and this file gives the only complete example of all of them applied together by the writer himself.

Where this file and another voice document appear to disagree, raise it with the writer rather than resolving it. The exemplar is evidence that a rule needs revising, and it has already been right twice.

Two notes apply to the file itself. It never prints an em dash, and neither of the two articles it quotes contains one outside its frontmatter. And the "before" side of every pair reproduces the construction under discussion, so `npm run voice:lint` reports warnings on this file by design, as it does on `ai-tells.md`. It must still report 0 errors.

---

## 1. Why this file exists

A draft can satisfy all 27 prohibitions in `style-guide.md`, section 5, return 0 errors and 0 warnings from `npm run voice:lint`, and still have no speaker in it.

In September 2026 the pipeline produced a draft of this article that did exactly that, against the linter as it then stood, and the writer rewrote nearly all of it. The stronger version of the point is what happened to the linter afterwards. The checks added alongside this file, every one of them derived from a change the writer had already made, return 22 warnings on the same text: a statistic in the opening sentence, eleven ordinals used as reference handles, seven terminal caveats, 26 full dates against a ceiling of three per thousand words, no bibliographic "we" against nine links to our own articles, three headings that report a movement, no bold lead-in list in a long-form piece, two key takeaways carrying a statistic or a parenthetical against a ceiling of one, and a close that issues no first moves and does not discharge the title. Reproduce the run:

```
git show e72f68f:content-platform/articles/managing-legal-operations/draft.mdx > before.mdx
npm run voice:lint -- before.mdx
```

Not one of those checks existed while the draft was under review. The writer found the fault by reading, and the checks were written backwards from what he changed. A clean lint is evidence about the checks that exist on the day it runs.

The figures the linter prints still fail to separate the two versions. Mean sentence length is 22.4 words against 21.2, median paragraph 90 words against 103, and both sit inside every target the guide sets. What the figures miss is 1,757 words of body text, 6,691 against 4,934 with the frontmatter excluded, and everything in section 4. The pipeline draft cited eight Spaarke articles as though they were third-party literature, never said "we", never named a primary cause, never conceded anything about the reader's own function, never recommended one course over another, ended every statistic on what the number could not show, and closed on a risk with no first move.

None of that broke a rule. Several of the repairs the writer made broke rules that have since been revised, which is why the caution above matters.

The rules in this repository are stated as removals. This file states the voice as something to reproduce.

The relaxations that followed were made on evidence and not on preference. Six rules were narrowed because the writer's approved text violated them: the ban on the bibliographic first person in a series (rule 11), the reading of rule 12 that made an unsourced practitioner claim unwritable, the intensifier ban (rule 24), the ban on a synthesis paragraph in the close (rule 25), the ban on bold lead-in bullets (rule 26), and the heading rule in section 4. Each was narrowed to the fault the September 2026 revision was written to fix, and none was reversed. The revision exists because readers said the library sounded machine-written and the audit counted 303 bold lead-ins across 19 articles. A rule that ends up permitting a stack of bolded phrases with nothing under them has been misapplied, and the reader who reopens this question should start from the pairs in section 4 rather than from the rule texts.

---

## 2. The eight traits

1. **A speaker on the page.** Spaarke is the actor of its own citations, five times in this article, in one form: "In our earlier article, [title], we discussed X." Four of the five say "earlier" and one says "previous", so a sweep rule written against the exact string will miss one of them. A reader can tell our body of work from the field's research.
2. **A claim before a citation.** The first three sentences state the claim in our own voice; the first attributed statistic arrives in sentence four, as support for a claim the reader has already been given.
3. **One named force, everything else subordinate to it.** AI is the prime mover in the description, the first key takeaway, the first two sentences and the close. Nothing in the piece is a numbered list of coequal causes.
4. **Verdict headings.** Every H2 says what something is, needs, depends on, or is having done to it.
5. **A fixed positioning refrain.** One phrase, repeated almost verbatim at three anchors: the opening thesis, the heading of the section that proves it, and the close.
6. **Limitations subordinated.** The caveat is a clause hinged on "but", and the sentence ends on what the evidence does support.
7. **The hard thing said plainly, and a recommendation where there is a choice.** "legal can become an impediment." "The better answer is to agree in advance which activities the business can handle."
8. **A close in imperatives, addressed to a role.** "Understand... Define... Make... Designate... And put in place..."

Sections 3 onward give the annotated before-and-after pairs, keyed to these traits. The "before" column is the pipeline draft; the "after" column is the published article. Both are real text, not constructed examples, which is what distinguishes this file from `consulting-register.md`, section 6.

---

## 3. How to read the pairs

The "before" side of every pair is the pipeline draft of this same article, at commit `e72f68f`, path `content-platform/articles/managing-legal-operations/draft.mdx`. The "after" side is the published article at `content/blog/2026-06-16-managing-legal-operations.mdx`, which is byte-identical to the current file at that same draft path. Nothing in either column was written for this file.

What generalises is the trait, not the wording. The five practical starting points in the close, the five-channel routing list, the four gaps in the frameworks, and the wording of the claim about AI and precision are this article's own analytical material. They appear here to show a trait working, and they are not house wording. Lifting any of them into another piece produces a series that reads as a product catalogue, which is the failure `stance.md` and `domain-knowledge.md` are written to prevent.

The pairs also carry the rules the linter cannot reach. Eleven judgement calls decide whether a draft has the voice, and no regular expression settles any of them. Each maps to a numbered pair below.

| Judgement call | Pair |
|---|---|
| 1. Whether a counted set is causes or decisions | 4.4 |
| 2. Whether a heading renders a verdict or reports a movement | 4.5, 4.6 |
| 3. Whether an unsourced claim is the writer's own read of the market or a claim that needed a source | 4.17 |
| 4. Whether legal operations has been given a verb that belongs to the department | 4.15 |
| 5. Whether a caveat defends the writer or informs the reader | 4.8, 4.9, 4.10, 4.11 |
| 6. Whether the argument's concession is present and stated as a direct predicate | 4.12 |
| 7. Whether a bold label carries a claim or stands in for one | 4.21 |
| 8. Whether the close's first moves are earned by the argument | 4.14 |
| 9. Whether the business's need is stated as its own claim or as a permission dispensed | 4.16 |
| 10. Whether a coinage names something the field has no word for | 4.22 |
| 11. Whether a section is given to a relationship or to an actor | 4.23 |

---

## 4. The pairs

### 4.1 Spaarke is the actor of its own citation

Trait 1. Rules: `style-guide.md`, section 1 (pronouns) and section 5, rule 11.

Before, the pipeline draft:

> [Legal AI Is Not Deterministic](/why-spaarke/probabilistic-vs-deterministic) sets out why that behavior matters for any workflow expected to produce the same result twice.

After, the published article:

> In our earlier article, [Legal AI Is Not Deterministic](/why-spaarke/probabilistic-vs-deterministic), we explained why that matters for any workflow expected to produce the same result twice.

The pipeline draft carried nine links to Spaarke articles and introduced every one of them in the third person, so that our own library read exactly like the Thomson Reuters index and the ACC survey sitting beside it. The published article carries eight, five of them in this form. The forms are "we discussed", "we explained", "we described", and "we set out". A reader who cannot tell our evidence from the field's cannot credit either.

### 4.2 Where a bare link is correct

Trait 1. Rules: `style-guide.md`, section 1; `vocabulary.md`, section 1.

Before, the pipeline draft:

> [From Reactive to Predictive](/why-spaarke/loi-maturity-model) maps the frameworks against the maturity question in detail, and this article does not walk them again.

After, the published article:

> Our earlier article, [From Reactive to Predictive](/why-spaarke/loi-maturity-model), maps the frameworks against the maturity question in detail.

The bibliographic first person is the normal form and not the only one. Of the eight cross-links in the published article, six carry "our" and five put Spaarke in the subject position with a finite verb. Two do neither: "described in [Institutional Knowledge Is Walking Out the Door](/why-spaarke/institutional-knowledge)", where the sentence is about the problem rather than about our treatment of it, and "Spaarke set out the category-level argument that the series continues in [What Is Legal Operations Intelligence?](/why-spaarke/what-is-legal-operations-intelligence)". A rule written as "always" would flag the writer's own prose on the next pass.

Note the second change in this pair. The clause "and this article does not walk them again" is gone. An article refers to itself once, at the end of the opening, to say what it sets out to establish. It never refers to itself to say what it will not cover or what it does not rely on (`style-guide.md`, section 3).

### 4.3 The opening states the claim, and the statistic credentials it later

Trait 2. Rules: `style-guide.md`, section 3 (openings) and section 5, rule 3.

Before, the pipeline draft:

> In the Thomson Reuters Institute's 2025 Legal Department Operations Index, drawn from a July 2025 survey of 128 US respondents, 82% reported at least one dedicated legal operations role. The report found that "Legal operations work is expanding beyond its origins as primarily a cost-control function to include a focus on systems, processes, and technology."

After, the published article:

> The mandate of legal operations is evolving rapidly. Driven by the AI imperative, general counsel and their departments are reimagining how legal services are delivered. The pressure is universal. In ACC's 2026 Chief Legal Officers Survey, 47% of chief legal officers say technology and AI proficiency is the capability their CEO most wants them to develop, and Harbor's 2026 Legal Department Maturity Index finds AI implemented or under exploration at 98% of departments.

The 82% is not cut. It moves to the third paragraph, where it credentials the subject for a claim the reader has already been given:

> Legal operations is well equipped to meet this moment. In the Thomson Reuters Institute's 2025 Legal Department Operations Index, drawn from a July 2025 survey of 128 US respondents, 82% reported at least one dedicated legal operations role, and the report found the work "expanding beyond its origins as primarily a cost-control function to include a focus on systems, processes, and technology."

A number that opens a piece has to be the number that proves the thesis. A number establishing that the subject exists is one the reader nods at, and an article whose first act is a citation has no speaker in it. The first attributed figure in the published opening arrives in sentence four.

### 4.4 One named force, with the rest subordinate to it

Trait 3. Judgement call 1. Rules: `stance.md`, rule 3; `consulting-register.md`, section 4.4.

Before, the pipeline draft:

> Six drivers push those changes in the same direction. The largest is a new view of the resource requirements of legal and legal operations, driven by AI.

After, the published article:

> Driven by the AI imperative, general counsel and their departments are reimagining how legal services are delivered.

The whole section that followed the pipeline draft's sentence, about 900 words under the heading "Six drivers push the remit in the same direction", is deleted. The causes survive, distributed into the sections that need them.

Count a framework only when its items are things the reader decides, tests, or performs. An article whose spine is a numbered list of causes hands the reader a survey to agree with in place of a thesis to accept or reject, and it then obliges every later section to point back at the numbering. The pipeline draft did so five times, from four later sections: "why the second driver and the third are one story told from two ends", "as the first driver showed", "The alternative provider market described under the fifth driver", "The first driver is what makes the sourcing question live again", and "the fourth, talent, is the one the first driver moved". An ordinal used as a reference handle is the reliable sign that the inventory belonged distributed into the argument.

### 4.5 A heading that reports a movement

Trait 4. Judgement call 2. Rules: `style-guide.md`, section 4 (headings); `consulting-register.md`, section 4.5.

Before, the pipeline draft:

> ## Knowledge curation is settling on legal operations

After, the published article:

> ## Knowledge curation is the foundation AI depends on

Both state a point. Only one renders a verdict. "Is settling on" describes what is happening and leaves the reader to decide what it means; "is the foundation AI depends on" hands them the conclusion. This is the form a lint check can catch, because the progressive verb is visible to a regular expression. The next pair is the form it cannot.

### 4.6 A heading that reports without a progressive verb

Trait 4. Judgement call 2. Rules: `style-guide.md`, section 4 (headings) and section 5, rule 24.

Before, the pipeline draft:

> ## The frameworks describe the function, and practice has moved past their texts

After, the published article:

> ## Legal operations frameworks are due for a fundamental rethink

The pipeline heading is a complete declarative sentence with two finite verbs and no progressive form, and it passes every check that could be written for it. It still only reports. "Are due for a fundamental rethink" says what the frameworks need, and the four bullets under it show where. A reader who reads only the published headings collects the article's judgments and could disagree with them, which is the test.

"Fundamental" here is the adjective stating the scope of a change the section then proves, which rule 24 permits. The banned use is an adverb propping up a claim the sentence does not support.

### 4.7 The positioning refrain at three anchors

Trait 5. Rules: `style-guide.md`, section 3 (thesis formula); `ai-tells.md`, section 3.7.

Before, the pipeline draft, at the three anchors:

> Managing legal operations effectively now means directing the changes under way in the legal department, in the legal function's place in the business, and in the outside counsel relationship.

> ## Legal operations is where the department decides how legal work gets done

> ## Every requirement depends on information the department can act on

After, the published article, at the same three anchors:

> Legal operations is the facilitator and catalyst for that decision, building the processes, tools, and information the department needs to make it well and consistently.

> ## Legal operations is the catalyst and manager of the operating model

> Legal operations is the facilitator, catalyst, and manager of that change: building the processes and tools behind each channel, curating the knowledge every channel draws on, and producing the insight that makes legal's contribution visible to the business.

The pipeline draft states its position three times in three sets of words, and the reader leaves holding none of them. The published article fixes one phrase and repeats it almost unchanged. Do not paraphrase the thesis to avoid repetition. Lawyers read a change of term as a change of meaning, and that applies to the thesis before it applies to anything else. The plan file declares the phrase in its `Thesis formula` field, and the lint counts its occurrences.

### 4.8 The limitation as a subordinate clause

Trait 6. Judgement call 5. Rules: `style-guide.md`, section 1 (Measured) and section 3 (evidence).

Before, the pipeline draft:

> These are statements of expectation rather than records of hiring, so they show what chief legal officers plan and not what their departments did.

After, the published article:

> These are statements of intent rather than hiring records, but they show a clear plan to hold the size of the department and change the work its people do.

The limitation is identical. The terminal position is not. The pipeline sentence ends on what the number cannot do, and the reader is left holding the limitation instead of the finding. The published sentence hinges the limit on "but" and gives the main clause to what the figures support. The pipeline draft carried four sentences of this shape and two more saying what its sources could not show; the published article carries none of either and two subordinated "but" clauses.

### 4.9 A caveat about what the research could not find

Trait 6. Judgement call 5. Rules: `style-guide.md`, section 3 (evidence).

Before, the pipeline draft:

> Both figures are forecasts rather than measurements, and no survey base was given with them, so neither can be checked against an adoption figure that does not exist.

After, the published article:

> Both are forecasts rather than measurements, but they indicate the direction.

The undisclosed sample and the missing adoption figure are facts about the state of the research, not about the reader's decision. Never write a sentence about a statistic the research could not find. Where a gap in the evidence does bear on the decision, it gets one clause and the paragraph moves on. The published section opens on exactly that: "Adoption is visible but not yet well measured."

### 4.10 A fact that needs a disclaimer is cut

Judgement call 5. Rules: `style-guide.md`, section 5, rule 12 (the converse); `research-sources.md`.

Before, the pipeline draft:

> Axiom's survey of 516 general counsel, released on February 17, 2026, found more than 80% planning to move law firm work to internal teams or alternative providers within two years. Axiom is an alternative provider and an interested party in that answer, which is a reason to read the direction of its finding rather than its size.

After, the published article: the source does not appear.

If a fact needs a sentence of disclaimer before a reader can use it, cut the fact. The disclaimer costs the reader more attention than the finding returns, and it defends the writer rather than informing anyone. Provenance hygiene belongs in the brief and the plan, where the reviewer checks it.

Compare the source that survived. The ACC and Everlaw survey is co-sponsored by a vendor, and the published article names that once inside the attribution, with no sentence telling the reader how much to discount it: "ACC and Everlaw surveyed 657 in-house professionals in 30 countries for a report released on October 14, 2025, with Everlaw as a vendor co-sponsor." Provenance tells the reader where a number came from. A discount instruction tells the reader how much to believe it, and deciding that is our job before the sentence is written.

### 4.11 The disclaimer on an illustration

Judgement call 5. Rules: `consulting-register.md`, section 4.9; `ai-tells.md`, section 2.8.

Before, the pipeline draft:

> None of the scenes below names a company, and any figure in them is illustrative rather than a finding.

> A food delivery company operating across several countries sorted its agreement types by the risk each one carried.

After, the published article:

> **Service delivery: deciding who or what performs each type of work.** Consider, for example, a food delivery company that sorts its agreement types by risk.

The tense and the opening word carry the signal at every instance, so no blanket disclaimer is needed, and a disclaimer placed upstream of the scenes it governs never reaches a skimming reader in any case. A sentence telling the reader that the examples are illustrative breaks the frame and withdraws the evidence the paragraph just offered.

Note how the illustration ends. A constructed scene carries no before-and-after figure, because the figure would be invented. The pipeline draft closed its scene on a balanced contrast, "and the guardrails took longer to write than the tooling took to configure". The published article closes on which part of the work was hard: "Most of the effort goes into defining the guardrails; configuring the tools is comparatively quick."

### 4.12 The concession as a direct predicate

Trait 7. Judgement call 6. Rules: `stance.md`, rule 4; `style-guide.md`, section 1 (Direct about the reader's own function) and section 5, rule 15.

Before, the pipeline draft:

> The purpose of the guardrails, the thresholds, the playbooks, the automated and AI-assisted workflows, and the escalation paths is to take legal out of the bottleneck wherever technology can manage the risk. That is what legal operations means by legal as an enabler of the business.

After, the published article:

> Opening the model also addresses a harder acknowledgment: legal can become an impediment. A business unit that waits in the department's queue for a standard non-disclosure agreement loses time, and a business that routinely waits learns to work around the department.

"Bottleneck" describes a queue, implies that the fix is throughput, and leaves the fault unattributed. The concession the argument actually depends on is a direct predicate with the reader's own function as the subject, in short plain words, before the remedy.

Nothing cites it, and nothing needs to. The mechanism in the second sentence is the defense. This is the claim type the brief records under "What we assert from practice", and hedging the verb to cover the absence of a citation would have destroyed it.

The concession is placed three times, and each time in the department's own mouth where that was available: in the opening, "departments increasingly acknowledge that legal review can become an impediment to the business"; in the key takeaways, "Legal can become an impediment to the business"; and in the section above. Conceding it is what earns the right to argue for self-service and delegation to a legal operations reader.

### 4.13 A recommendation where there is a choice

Trait 7. Rules: `stance.md`, rule 8; `ai-tells.md`, section 6.5.

Before, the pipeline draft:

> Meeting that expectation or declining it is itself a design decision, and the business tends to work around a department that declines it.

After, the published article:

> The better answer is to agree in advance which activities the business can handle and on what terms, with legal still part of the decision.

A section that lays out two courses and calls the choice a design decision the reader has to make has analysed where it should have recommended. Name one as the better answer and say what it consists of.

### 4.14 The close in imperatives

Trait 8. Judgement call 8. Rules: `style-guide.md`, section 3 (closings) and section 5, rules 4 and 25.

Before, the pipeline draft:

> The work will still be processed and the matters will still close, and the general counsel will still make the strategic claim in front of a board that has no evidence for it.

After, the published article:

> That is the new mandate. It moves legal operations from administering the department to managing how the department delivers value to the business.

> For legal operations leaders, practical starting points include the following. Understand the department's demand at the front door. Define the guardrails for the low-risk work the business can handle, beginning with non-disclosure agreements and routine contracts. Make a deliberate sourcing decision for each type of work. Designate the authoritative sources of the department's knowledge and who keeps them current. And put in place the information that lets the department read business impact, risk, cost, timing, skills, and capacity before it decides.

The pipeline draft leaves a senior reader holding a risk and no first move. The published close runs in four beats under a heading that reuses the title's key term: the title is "The New Mandate for Legal Operations" and the closing heading is "The new mandate in practice". Beat one is a short synthesis paragraph naming the changes the article described. Beat two is the thesis in the opening's words, followed by the sentence that discharges the title. Beat three is the imperatives. Beat four hands off to the next piece in the series.

The judgement call is whether each imperative is earned, and the test is whether a section argued for it. Each of these five has one: the front door, the guardrails, the sourcing decision, the knowledge sources, and the six signals. The five starting points are this article's, and they are not a house list.

### 4.15 The verb that belongs to the department

Judgement call 4. Rules: `stance.md`, section 2; `style-guide.md`, section 2 (active voice).

Before, the pipeline draft:

> The decision about what the business may complete on its own therefore sits with legal operations.

After, the published article:

> The department sets the terms of that delegation. It decides which work the business may complete on its own, which positions the business may accept, at what threshold a request returns to a lawyer, and who approves a change to any of them. Legal operations builds what makes the delegation workable: the playbooks, the templates and forms, the workflows, the thresholds and escalation paths, and a record of which position the business took and why.

Those two sentences are the house shape. The department decides, owns, sets, approves, and accepts. Legal operations facilitates, catalyses, builds, curates, manages, and enables. Writing that legal operations decides what the business may do overstates the function to the reader who holds it and loses the general counsel reading over their shoulder.

Naming an actor is not the same as assigning authority, and the two errors have opposite costs. A sentence that needs a subject and reaches for legal operations, when the right holder is the department, has removed a passive and introduced an overstatement.

The figure lagged the prose, which is the ordinary way this error survives a rewrite, and the repair is worth reading. The writer's body paragraph already carried the right verb, "Legal operations manages the routing rules and the risk thresholds". The Exhibit 1 figcaption still read "Legal operations owns the routing rules, the risk thresholds, and the data that returns from every channel"; the SVG's own label read "owns"; and the alt text and the SVG description had a third verb, "holds the routing rules and the risk thresholds, and the data returned from every channel comes back to it". He edited prose in the file he had open, and the label sits in `public/articles/managing-legal-operations/exhibit-1.svg`, which rereading the paragraph never reaches. The caption and the SVG label now read "Legal operations manages the routing rules and the risk thresholds, and captures the data that returns from every channel", and the alt text and the SVG description carry the same two verbs, so all four places now give the work to the holder that does it.

That gap is the check to run at the end of a rewrite. A verb handed to legal operations has to survive into every place the piece repeats it, and exhibit text is inside the voice rules for exactly this reason: `style-guide.md`, section 4, requires the caption, the alt text, the section's labels, the closing paragraph and any `keyTakeaway` touching the exhibit to use the same words for the same parts, and the em dash rule in the same section names captions and alt text among the places it covers. An authority boundary that holds in the body and fails in the figure has failed, because a skimming reader takes the figure away.

### 4.16 The business's need stated as its own claim

Judgement call 9. Rules: `stance.md`, rule 5 and section 2.

Before, the pipeline draft, in a key takeaway and a section heading:

> The business is taking a direct part in its legal risk through the front door and self-service, and legal operations decides which work it may complete alone, within which thresholds, and with what escalation path.

> ## The business is becoming a participant in its own legal risk

After, the published article, in the matching key takeaway and in the body:

> Legal can become an impediment to the business. Business teams need the flexibility to manage certain legal-related activities and risks themselves, provided they are clearly understood and scoped, and inside guardrails the department sets.

> The demand does not come from the business alone. Legal departments themselves recognize that certain low-risk legal-related activities can be handled properly by the business directly, or with minimal input from the department.

Two errors are being repaired at once. "Taking a direct part in its legal risk" reads to a general counsel as legal risk leaving the department, which is the opposite of the argument. And a permission dispensed by legal operations is not a claim the business holds; the business's need is legitimate, and the department's control attaches as a proviso.

The permission verbs are not banned. They survive one paragraph later, where they describe the mechanism rather than the frame: "It decides which work the business may complete on its own, which positions the business may accept."

### 4.17 The claim the writer holds from practice

Judgement call 3. Rules: `style-guide.md`, section 5, rule 12; `stance.md`, rules 1 and 9.

Before, the pipeline draft:

> Deciding which answers a system may give without a lawyer is the difficult part of that design, because a generative model returns a different answer to the same question on a second run.

After, the published article:

> AI carries a limitation of its own, and users should know it before they rely on one: probabilistic outputs can be variable, inconsistent, and inaccurate. Legal decisions often require a level of precision that is not well matched to the limitations of today's AI tools.

Neither version carries a citation, and neither needs one. The pipeline draft reduced the claim to the narrowest mechanical fact that would survive a source check, which is what rule 12 produces when it is read as "every claim needs a citation". Read correctly, the rule governs numbers, quoted findings, and claims about what other people have said or done. It does not govern the writer's own read of where the market is going, which may stand in its own sentence provided it is written as a claim about the world and not dressed as a finding. The brief records these under "What we assert from practice", and they are the only unsourced claims a draft may carry.

The wording above belongs to this article. What carries across is the rule in `stance.md`, rule 9: the macro claim about AI and the tool claim about AI are never published one without the other.

### 4.18 The sentence spent on what is newly possible

Rules: `stance.md`, rule 7.

Before, the pipeline draft:

> Closing the distance between those two lines is what a legal operations director is asked to do, and in most departments adding people is no longer among the available methods.

After, the published article:

> Budget pressure is not new, but the options for responding to it are. A department that once could only ration its lawyers' time can now redesign which work requires a lawyer at all, and that redesign changes the roles the department needs.

Both sentences follow the same CLOC quotation about demand outrunning budget. The pipeline version restates the burden and hands it back. The published version concedes that the constraint is familiar and spends the sentence on what has changed. Our readers know their constraints. They are reading us for the new option.

### 4.19 The obligation on both sides of a gap

Rules: `stance.md`, rule 6.

Before, the pipeline draft:

> Thomson Reuters calls the distance between the 86% of general counsel and the 17% of C-suite respondents a visibility gap. Among those C-suite respondents, 42% said that legal contributes "a little" or "not at all". The report's advice to general counsel is to "institute metrics for success that translate to the rest of the business". It also tells them to position efficiency metrics "in the context of larger business goals, rather than in the language of the legal department". Both instructions describe legal operations work: choosing the metrics, producing them on a schedule, and stating them in the business's own terms.

After, the published article:

> Visibility also works in the other direction. Legal is too often brought in after the decisions that shape a risk have been made, when issues it could have identified and addressed early have become harder and costlier to resolve.

The figures survive in the published article, and so does the source's prescription about metrics. What is added is the obligation on the reader's own side. A gap between two parties is not only a reporting problem the reader fixes with better measurement. Report the source's prescription where it is useful, and do not adopt the source's stance as ours.

### 4.20 The compressed antithesis

Rules: `style-guide.md`, section 5, rules 18 and 24; `ai-tells.md`, section 2.13.

Before, the pipeline draft:

> That evidence is the difference between a guardrail the business trusts and a rule the business routes around.

After, the published article:

> Business teams are far more likely to follow guardrails they understand and trust.

A last sentence that ends on a balanced contrast between two nouns puts a shape where a claim should be. It passes every check aimed at the two-sentence negation and every check aimed at the tagline. The repair is a plain claim about what people will do, with one comparative intensifier carrying the emphasis the contrast was carrying. Rule 24 permits the intensifier because the paragraph above it supplies the support.

### 4.21 Ordinal prose that should have been a list

Judgement call 7. Rules: `style-guide.md`, section 4 (lists, bold lead-in bullets) and section 5, rule 26.

Before, the pipeline draft, roughly 190 words across two paragraphs:

> Four gaps between the CLOC and ACC texts and current practice measure how far the function has moved. First, neither text treats request intake or the legal front door as a function of legal operations, and ACC alone names intake and triage, only as maturity markers inside two other functions. Second, the term self-service appears in neither text. The concept appears once in the ACC model, as an Advanced-stage marker under Contract Management, which describes playbooks that "allow extensive contract creation/execution with no legal department involvement". A CLOC-published blog post of March 10, 2020 described "on-demand, self-service legal solutions" for internal customers, "driven by playbooks, AI and legal bots". That language did not carry into the Core 12 text revised on April 7, 2020.

After, the published article, 77 words in four bullets:

> - **Intake and the legal front door.** Neither framework treats request intake as a core function. Where intake and triage appear, they appear as markers of maturity within other functions.
> - **Business self-service.** Self-service is largely absent, surfacing only as an advanced-stage aspiration for contract management.
> - **Knowledge management.** Both frameworks define knowledge management for people searching for documents, not for AI systems drawing on them.
> - **AI.** AI itself appears rarely, and only at the most advanced stage of maturity.

This is the largest reversal the September 2026 audit takes, and the one most easily misread. The audit counted 303 bold lead-ins across 19 articles and named the pattern the library's worst device. The count was not the fault. The fault was bolded phrases carrying assertions that nothing supported, repeated down the page so that the formatting supplied the structure the argument lacked.

Three things make this list house form rather than the defect. Each label names one part in the article's own vocabulary and carries its own finding, so each item could be defended on its own. The labels are bare nouns, worded the same way across the set, which is the grammar `style-guide.md`, section 4, gives for items named after the field's own terms. And the list is one of three in a 4,934-word article, which keeps it inside the ceiling of three per long-form piece.

Note what the conversion also removed: the dated CLOC blog post, the Advanced-stage quotation, and the revision date of the Core 12. The supporting citation detail usually goes with the conversion, because the label carries what the reader needs.

### 4.22 A handle is not a term

Judgement call 10. Rules: `ai-tells.md`, section 5.6; `domain-knowledge.md`, section 3.

Before, the pipeline draft:

> Effective management of the function begins here, with a sizing question. The department has to decide how much legal capability and decision support the business needs, and at which of its decision points.

After, the published article:

> That redesign turns on one decision, made request by request: which work belongs with an in-house lawyer, which with the business under defined guardrails, which with an AI-assisted workflow, and which with an outside provider.

"The sizing question" names nothing the field lacks a word for. It was invented so that three later sections could refer back to an earlier passage, and it obliges the reader to hold a definition in order to follow the argument. The published article introduces the recurring decision by listing its actual options inside the sentence, and never needs a handle for it again. It also drops "sizing", which implies an annual exercise, for "made request by request".

The same test applies to the pipeline draft's "the four gaps" and "that routing table". Before coining a term, establish that the field has none: legal operations directors already say "legal service delivery", "the delivery model", "matter intake", "the front door", and "alternative legal service provider". Spaarke's own product terms are established coinages and are not affected.

### 4.23 A section given to a relationship

Judgement call 11. Rules: `style-guide.md`, section 3 (paragraphs, sections, and the shape of a piece).

Before, the pipeline draft, two consecutive H2 sections:

> ## The business needs more legal judgment at more decision points

> ## The business is becoming a participant in its own legal risk

After, the published article, one:

> ## The opportunity to open the legal service delivery model

The two pipeline sections carry the same pair of actors, the department and the business, described from one side and then from the other. Where that happens, merge them and name the merged section for the mechanism that changes the relationship. The same move folds the pipeline draft's "A strategic general counsel depends on a well-run function" into "Visibility and insight strengthen the partnership between legal and the business".

The published article runs nine H2 sections against the pipeline draft's ten, and 1,757 fewer words. A section running more than twice the budget of the median section is usually holding an inventory, and the inventory belongs distributed into the sections that need it. The plan file sets the per-section budget. There is no house constant, and no reviewer asks for a long-form article to be cut to a number.

The heading is a noun phrase, which the heading rule permits where the phrase names something the reader can act on. It also uses the field's own term, "legal service delivery", rather than a paraphrase.

---

## 5. What this file does not settle

Two questions are open with the writer. Until he rules on them, this file does not treat either as decided.

Both sit here for the same reason. A construction the writer used deliberately and repeatedly is evidence that a rule needs revising, and section 4 carries that kind. A construction that appears once, and that the rewrite might simply have missed, is a question for him rather than a licence, and it stays here until he answers.

- **"Critically important."** The published opening uses the phrase once. Rule 27 and `vocabulary.md`, section 2, rule out `crucial`, `pivotal`, `paramount`, and `vital`, and "critically important" is a near-synonym of the first. One occurrence in one article is not an allowance, and the word stays on the list. This file does not annotate the phrase or offer it as a model.
- **The ceiling on bold lead-in bullets.** At most three such lists in a long-form article is derived from this article's output of three lists across nine sections. An earlier draft of the rule added "at most one per two sections", which this article's own spacing breaks, so the total is what governs. It is not a number the writer stated. It exists so that the reversal in 4.21 has a brake, since the pattern the September 2026 audit found in the old library could return within three articles without one. Confirm the ceiling or replace it before treating it as settled.
