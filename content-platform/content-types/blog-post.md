# Content type: blog post

Calibration for everything that publishes to `content/blog/`, which now covers two formats: the long-form article and the short post. Read this file alongside `voice/style-guide.md` (the universal voice), `voice/examples/consulting-register.md` (the positive model), `voice/examples/ai-tells.md` (the removal guide), and `voice/brand-positioning.md` (the argument). Where this file and the style guide disagree, the style guide governs.

Both formats use `type: blog-post` in the brief, the same workspace templates, and the same frontmatter. The brief's `length_target` field tells them apart (section 2).

---

## 1. Purpose

Articles published to the blog carry most of the publication calendar. Long-form articles are the primary format for thought leadership. They are where Spaarke develops a position in full, with the evidence and the reasoning that general counsel, legal operations directors, and CIOs expect from the publications they already read. Short posts handle commentary, announcements, and single-point arguments. Both formats bring in unfamiliar readers through search, and both supply the material that LinkedIn posts, tweets, and white papers adapt.

Each piece has three jobs, in order of priority:

1. Establish one specific argument that the reader can repeat in their own words.
2. Give the reader a reason to read further, through a related article, a `/platform` section, or a `/why-spaarke/<slug>` page.
3. Be findable, with a title, headings, and frontmatter that work for search without sacrificing voice.

A draft that does the first two jobs well and the third only adequately should be published. A draft that does the third job well and the first weakly should be withdrawn, because search traffic to an article without an argument does nothing for credibility.

## 2. Length and structure

The brief sets the format through its `length_target` field:

- `length_target: open` marks a long-form article. There is no length cap.
- `length_target: <number>` with a number chosen for the topic also marks a long-form article when the number is above 1,800. The number is a planning estimate for the writer and the reviewer, and it does not cap the piece.
- `length_target: <number>` with a number from 1,000 to 1,800 marks a short post.

### 2.1 Long-form articles

A long-form article has no length cap: the length is whatever the topic requires. The argument and the evidence set the length, every section must advance the argument, and padding is cut at any length. An article of 3,000 or 5,000 words is acceptable when each section adds evidence or a step in the reasoning, and an article of 2,000 words is too long if two of its sections make the same point.

The structure has six parts:

1. **Opening.** Open with the claim. The first sentence states the change, the second names the single force causing it, and the evidence follows. Raise the stakes with at most two secondary shifts, enumerated inline, then credential the subject and close the opening with one sentence naming what the article sets out to show. State the thesis within the first 250 words and no later than the third paragraph, in one sentence that the reader could repeat. The situation, complication, answer sequence is the alternative, reserved for a piece that overturns a position the reader holds; `voice/style-guide.md`, section 3, governs the choice. The openers ruled out by `style-guide.md`, section 5, rule 3, remain ruled out. Two model openings are in `consulting-register.md`, section 6, and the house opening is annotated in `voice/examples/house-exemplar.md`.
2. **Sections.** Use as many H2 sections as the argument needs. Each H2 heading renders a verdict, in sentence case and typically in 4 to 12 words: what something is, what it needs, what it depends on, or what is being done to it. A heading that reports a movement without judging it does not qualify, even though it states a point. The test is that a reader who reads only the headings collects the article's judgments and could disagree with them. The verdict test governs the content of the heading and leaves its form open: a noun or gerund phrase qualifies where it names something the reader can act on ("The opportunity to open the legal service delivery model", "Managing ahead of events, not only in response to them"), the heading of the section that proves the thesis repeats the thesis formula, and the heading of the close reuses the key term from the title (`voice/style-guide.md`, section 4). Each section opens with a sentence or two that connect it to what the previous section established, and it neither announces itself nor recaps itself. H3 subheadings are allowed where a section has distinct parts, and they follow the same rule. Where the opening previews a counted framework, it counts decisions, capabilities, or channels and never causes, the reader can hold the set after one reading, each item carries its own evidence, worked example, or diagnostic question, and the same labels return in the same order (`voice/examples/consulting-register.md`, section 4.4). A counted framework of capabilities is delivered as a list inside the single section that proves the thesis, not distributed across a run of H2 headings. No sentence uses an ordinal as a cross-section reference handle for a counted cause ("as the third driver showed", "the market described under the fifth driver"); an ordinal pointing at an item named in the same sentence is ordinary English and stays ("when it cannot answer the second of those questions").
3. **Evidence paragraphs.** Each paragraph opens with a topic sentence, develops the point, and supports it with evidence. Statistics are attributed in the sentence that carries them (source, instrument, year, and sample where it matters), reported as what respondents said, and then interpreted.
4. **Exhibits.** Refer to each exhibit in parentheses at the end of the sentence that states the finding, in the form "(Exhibit 1)". The exhibit's own title states the finding as a full sentence, and the text never says that a chart "below" shows something. Where an exhibit carries the structure of its section rather than confirming one finding, state the structure in a single sentence, place the exhibit immediately after it, and then unpack its parts in the exhibit's own order under bold labels whose wording repeats the caption ("**Before the event: proactive readiness.**"). The caption, the alt text, the section's labels, the closing paragraph, and any `keyTakeaway` touching the exhibit all use the same words for the same parts, so the reader meets one named set rather than five variants of it.
5. **Close.** Closings run in four beats, under a heading that reuses the key term from the title.

   1. One short synthesis paragraph naming the changes the article described, and nothing else. This is the only place in a piece where a synthesis paragraph is permitted, and it is there to set up the instructions rather than to stand in for them.
   2. The thesis, in the words the opening used, followed by the sentence that discharges the title. Where the title names something (a mandate, a blind spot, a gap), one plain sentence says what it is and what it changes: "That is the new mandate. It moves legal operations from administering the department to managing how the department delivers value to the business."
   3. One paragraph of first moves addressed to the reader's role, built from bare imperatives, one per decision the article has argued for: "For legal operations leaders, practical starting points include the following. Understand the department's demand at the front door. Define the guardrails for the low-risk work the business can handle, beginning with non-disclosure agreements and routine contracts." Five is a workable number.
   4. Where the piece sits in a series, one or two sentences handing off to the next piece; otherwise the question the evidence leaves open.

   What is forbidden is a closing section that re-argues the piece in fresh words. Naming each change in a clause is orientation, and the reader who skipped a section needs it. A close that leaves a senior reader holding a risk and no first move has not finished the job, and an article that never issues an imperative has analysed a problem for a reader it never addressed. The close carries no "Conclusion" heading and does not pitch (`style-guide.md`, section 5, rules 4 and 25). Related reading may follow as a plain list of links (section 5).
6. **Closing contact line.** Where the brief calls for one, a closing contact line follows the final paragraph and any related-reading links, outside the argument. The convention and the current wording are in `voice/bylines.md`, section 6.

### 2.2 Short posts

The guidance of 1,000 to 1,800 words applies to short posts only, and it is not a cap on long-form work. A short post typically runs 1,000 to 1,800 words, and about 1,400 words suits most single-point arguments. A piece shorter than 1,000 words usually reads as a LinkedIn post that has been moved to the blog. A piece that needs more than 1,800 words is a long-form article and should be briefed as one. It should not be cut to fit the range, and it does not need to become a white paper or a pair of posts.

The standard structure of a short post has four parts:

1. **Opening (paragraphs 1 to 2).** Open with a specific observation, a named scene, a sourced number, or a direct claim, and state the thesis within the first 150 words.
2. **Three to five H2 sections.** Each section has its own sub-claim and at least one piece of named evidence (a number, a framework, or a concrete scenario). Headings render a verdict in sentence case, under the same test and with the same form permissions as a long-form article (section 2.1, item 2). Question headings are governed by `style-guide.md`, section 5, rule 2.
3. **Close.** Two or three paragraphs that end on consequence, under the same rules as a long-form close.
4. **Related reading.** One short paragraph, a single line, or a plain list that points to the next read (section 5).

H3 subheadings are rare in a short post. A short post that seems to need them is probably a long-form article. Code blocks are also rare, and they are reserved for technical pieces aimed at `legal-tech-cio`.

## 3. Voice calibration

The register is the one that `voice/style-guide.md` defines, and it is the same for long-form articles and short posts. The points that writers most often need to check are the following:

- **Byline**: organizational by default, following the convention in `voice/bylines.md`. First person is allowed when the brief specifies it, typically for practitioner-experience pieces in which the lived experience is the argument.
- **Pronouns**: "we" for Spaarke's evidence and positions ("we recommend", "we found"), readers described by role in analysis, and "you" for direct advice, checklists, and diagnostic questions. The CEO-letter register flagged in `style-guide.md`, section 5, rule 8, remains out of bounds.
- **Sentences**: complete sentences that average roughly 15 to 25 words, with subordinate clauses, semicolons, and logical connectives ("because", "however", "as a result") wherever the reasoning calls for them. Short declarative sentences are used only when they carry content, such as a topic sentence, a finding, or a definition. Verbless fragments are not used. Common contractions are acceptable when used sparingly, and they are not used in passages that report research.
- **Paragraphs**: a topic sentence, development, and evidence, typically in 50 to 110 words. One-sentence paragraphs are functional only (a lead-in to a list, a block quotation, or an exhibit).
- **Punctuation**: no em dashes and no dash substitutes anywhere, including the title, the headings, the alt text, and the `description`, `summary`, and `keyTakeaways` fields. Ranges are written with "to".
- **Constructions**: none of the constructions in `style-guide.md`, section 5, rules 13 to 27. Each has a worked before and after in `voice/examples/ai-tells.md`.

When the brief sets `byline: <person>` and the piece is written in the first person, sustain the persona throughout. A drift into the organizational voice in the middle of a piece reads as a second author.

## 4. Image treatment

- **One or two supporting images per short post.** A long-form article carries as many exhibits as its findings need. A supporting image is required for any piece whose argument is visual (architecture, flow, dashboard, or comparison).
- **Acceptable**: product screenshots, original diagrams (from the existing asset library), and licensed photography. Stock photographs of handshakes are not acceptable, and neither are AI-generated illustrations that read as AI-generated.
- **Hero image**: every piece sets `heroImage` in frontmatter. Heroes are custom-generated for each piece and are no longer picked from a vector library. Hero treatment follows `voice/visual-identity.md`, and the brief's `# Hero graphic` section records the prompt and the generator settings that the team used. A diagram may be reused; stock imagery may not.
- **Alt text** is a real sentence, such as "Diagram of the Legal IQ stack with Data, Memory, and Inference layers." The single word "diagram" is not alt text. The Polish gate enforces this, and alt text never contains an em dash.
- **Exhibit titles** state the finding as a full sentence (section 2.1).
- **Pull quotes** are optional, with a maximum of one per piece.

## 5. After the close: related reading and the contact line

The article ends in four beats, under a heading that reuses the key term from the title: one short synthesis paragraph, the thesis in the words the opening used followed by the sentence that discharges the title, a paragraph of first moves addressed to the reader's role, and the forward pointer (section 2.1, item 5, and `style-guide.md`, section 3). The close carries no "Conclusion" heading and does not pitch (`style-guide.md`, section 5, rules 4 and 25). Two elements may follow it, and both sit outside the argument.

The first element is related reading. It takes the form of a plain list of links or a single sentence, without a recap paragraph and without a `Where to Go Next` section that restates the article. The brief specifies the targets, and the defaults by topic family are the following:

- **Architecture, deployment, and security** (the `legal-tech-cio` audience): a `/why-spaarke/<slug>` page on tenant deployment or Microsoft-native architecture, or a related article that goes deeper.
- **Operational pieces** (the `legal-ops-director` audience): the relevant `/platform/<module>` page, or the companion article on a related slug.
- **Strategic and category pieces** (the `corporate-counsel` audience): a related article in the library.
- **Practitioner-experience pieces** (first-person bylines): usually no links, because an open question in the final paragraph does the same work.

The second element is the closing contact line. Where the brief calls for one, it names a person whom readers can reach about the argument of the article, and it carries no offer. The convention, the person named for the current series, and the contact mechanism that is still to be confirmed are recorded in `voice/bylines.md`, section 6.

An article never ends with `Schedule a demo`, `Talk to sales`, or `Talk to our team`. Earlier versions of this file offered the last of these as a default for strategic pieces, and that default is withdrawn because it conflicts with the style guide.

## 6. Frontmatter

The canonical shape is defined in `src/lib/blog.ts`. The required fields, which are validated at build, are the following:

```yaml
---
title: <Title case; a statement by default (style-guide.md section 5, rule 2); no em dash>
description: <SEO meta description, ~155 chars; full sentence; no em dash>
summary: <2 to 3 sentences shown on the /why-spaarke index card and the article-page hero; max ~300 chars; no em dash>
date: 2026-05-12                      # ISO date; publication date
author: "Spaarke Team"                # the string the site prints; see voice/bylines.md section 2
tags:
  organization: []                    # e.g., spaarke, microsoft
  function: []                        # e.g., legal-operations, in-house, law-firm
  topic: []                           # e.g., spend-management, ocg, ai-readiness
  theme: []                           # e.g., loi, microsoft-native, system-of-record
heroImage: /images/blog/<slug>.jpg
heroImagePosition: center             # optional; CSS object-position
draft: false
---
```

The loader also supports these optional fields: `posted` (separate from `date` when a piece is backdated), `keyTakeaways` (a bullet list shown at the top of the article), `order` (the sort order of homepage cards), and `featured` with `featuredOrder` (for the `/why-spaarke` carousel).

**`summary`**: two to three sentences, with a target of 150 to 280 characters and a maximum of about 300. It renders as the article preview on the `/why-spaarke` index card and on the article-page hero. It should be distinct from `description` (the SEO meta description): it is written as narrative and is not stuffed with keywords. The `keyTakeaways` carry the article's positions, and the job of `summary` is to give the reader a reason to open the article.

**`keyTakeaways`**: an array of 3 to 6 strings of 18 to 35 words each, drafted in Spaarke voice. Each is a position the reader can repeat after closing the tab, not a finding they would have to cite. At most one takeaway carries a statistic, and it is the figure the article's thesis rests on, given with its source and no further apparatus ("Chief legal officers plan to hold headcount and change the work. In ACC's 2026 survey, 63% expect stable headcount as roles evolve around AI"). A takeaway built around a parenthetical attribution is a summary of the research; rewrite it as the position the research supports. They appear in the "Key takeaways" card above the body.

Every entry is quoted. An unquoted entry that contains a colon followed by a space parses as a YAML map rather than a string, and the takeaway is then dropped silently from the rendered page, with no build error. Two articles in this series lost a takeaway that way, and the loss was found only by reading the rendered page. Write `- "Knowledge curation: the foundation AI depends on."`, never the same line without the quotation marks.

The `title`, `description`, `summary`, and `keyTakeaways` fields are reader-visible, so every rule in the style guide applies to them, including the ban on em dashes. `npm run voice:lint` checks the frontmatter as well as the body.

Tag categories must align with `voice/taxonomy.md`. Do not invent new tag values in the middle of a draft.

## 7. Cross-linking

Every piece links to **at least one** of the following:

- A related article in `content/blog/` (the natural prerequisite or follow-on).
- A `/platform/<section>` page, when the topic touches a capability module.
- A `/why-spaarke/<slug>` page, when the topic touches a positioning theme.

Two or three internal links suit a short post. A long-form article may carry more, provided that each link supports a point in the text. Links added only for search ranking read as SEO posturing. External links to cited sources are separate from this rule, and they should be present whenever a number or a framework is named (see the style guide, section 5, rule 12).

A link to a Spaarke article is normally introduced in the bibliographic first person, with Spaarke as the actor: "In our earlier article, [title], we discussed X." The exception is a sentence whose subject is the problem rather than our treatment of it, where a bare link is correct ("an old problem, described in [Institutional Knowledge Is Walking Out the Door]"); a possessive frame that makes the article the actor and a third-person frame that makes Spaarke the actor are also house form, and none of the three is rewritten in a sweep (`voice/style-guide.md`, section 1). A link to a `/platform/<section>` page takes the ordinary form, because a capability page is not an authored argument. Note that `/why-spaarke/<slug>` is the route our articles publish to, so a link of that shape is a link to one of our articles and takes the bibliographic form. The distinction is how a reader tells our body of work from the field's research, and a long-form article in a series should read as the next instalment of a position we have been developing rather than as a survey of other people's findings.

The brief's "References" section names the links that the draft must include. Link text never reproduces an em dash from a published title; the style guide, section 4, gives the short titles to use.

## 8. Common pitfalls

- **The dual hook.** A short post that opens with both a statistic and a scene spends 200 words before the argument starts. Choose one. A long-form opening has room for both only if the thesis still arrives within 250 words.
- **The establishing statistic.** An article whose first sentence is a citation has no speaker in it. A statistic that only establishes that the subject exists, such as how many departments have a legal operations role, is not a hook; it belongs in the third paragraph, where it credentials the article's subject for the claim already made (`style-guide.md`, section 5, rule 3).
- **The neutral survey.** An article whose spine is a numbered list of drivers gives the reader a survey to agree with in place of a thesis to accept or reject. Name one driving force in the thesis and make the rest grammatically subordinate to it, and where a section lays out two courses of action, name one as the better answer and say what it consists of (`voice/stance.md`, rules 3 and 8).
- **Sections that do not advance the argument.** The argument sets the number of sections. Five H2 sections of 200 words each usually mean that the outline was published in place of the article. If two sections need only a paragraph each, fold them into their neighbors. The test applies at any length.
- **Cutting a long-form article to a word count.** When `length_target` is `open`, no reviewer should ask for the piece to be shortened to a number. The right question is whether each section adds evidence or a step in the reasoning.
- **Padding a long-form article.** Having no cap does not make length a goal. Restating the thesis in each section, in fresh words, is the most common form of padding (`ai-tells.md`, section 3.7). Repeating the piece's thesis formula almost verbatim at its three anchors, the opening thesis, the heading of the section that proves it, and the close, is not padding, and it should not be paraphrased to avoid the repetition.
- **The marketing close.** A close that begins `If you are ready to transform your legal department` breaks `style-guide.md`, section 5, rules 4 and 6.
- **The close with no first move.** A close that states a consequence and stops leaves a senior reader holding a risk and nothing to do about it. The close runs in four beats (`style-guide.md`, section 3).
- **Adopting LinkedIn voice.** First person, a line break after every sentence, and an opening built as bait belong on LinkedIn. In an article they read as though the author posted to the wrong surface.
- **Using the older library as a model.** The articles published before September 2026 contain constructions that the style guide now prohibits. Match a draft against the model passages in `consulting-register.md`, section 6.

## 9. Worked examples

**A short post.** Both briefs in this section are hypothetical. The first is dated 2026-05-19 and titled "Where Matter Management Ends and Operational Intelligence Begins", with `length_target: 1400`. The primary audience is `legal-ops-director` and the secondary audience is `corporate-counsel`. The angle is that matter management records which matters are open and what they have cost, whereas operational intelligence uses the same records to recommend what the department should do next. The opening is a scene in which a director arrives at a quarterly business review with a 47-tab status report, and the thesis follows in the second paragraph. Three sections carry the argument: what matter management was built to answer (with a CLOC reference as evidence), the questions it cannot answer (with a concrete failure scenario), and what operational intelligence adds (with the Legal IQ stack organizing the section). The close states what the director should change before the next review, and a single line of related reading points to `/platform/spend-performance`.

**A long-form article.** The second brief sets `length_target: open` for a piece that argues that managing legal operations now means managing the department's shared matter data as a single asset. The opening follows the model in `consulting-register.md`, section 6.1: the situation is the recognized scope of the legal operations function, the complication is a CFO's question that three separate systems cannot answer together, and the answer is the thesis, stated at about word 130 with a preview of three decisions. Each decision becomes an H2 heading that states its point, such as "One owner for the matter taxonomy ends conflicting reports", and the second decision uses H3 subheadings for its two options. A benchmarking finding is cited with its source, year, and sample, and the sentence that states it ends with "(Exhibit 1)". The close tells general counsel which of the three decisions to take first and why, and the closing contact line follows it. The draft runs to the length that the three decisions need, and the reviewer checks each section against the argument and checks nothing against a word count.

---

*Revised 2026-09-21 (long-form articles, consulting register, no em dashes), see git log for history.*
