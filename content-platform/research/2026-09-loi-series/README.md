# Research library: Legal Operations Intelligence series (September 2026)

Research gathered on 2026-09-21 for the five-article Legal Operations
Intelligence series, the standalone "State of Legal Operations (Fall
2026)" article, and the revision of the voice documents. It is kept
so that later articles and business planning can reuse it.

## How to use it

1. Start with `DIGEST.md`. It merges every finding with the
   fact-checker's verdict and correction, track by track.
2. Read the track's notes file in `notes/` for the full detail, then
   its `.verified.md` file for what the fact-checker saw.
3. Use a finding only if it is marked CONFIRMED, or CORRECTED with
   the correction applied. Anything else is marked
   `**TBD — confirm**` in a brief or draft until someone checks it
   against the primary source.
4. Check the source date against the display date of the article you
   are writing. An article cites nothing published after its own
   display date.
5. `findings.json` holds the same material in structured form
   (claim, detail, quote, URL, date, kind of source, confidence,
   verdict) for filtering or reuse by an agent.

## What is here

| Track (file stem in `notes/`) | Supports | Findings | Fact-check result |
|---|---|---|---|
| `changing-role-of-legal-ops` | Article 1; the State article | 15 | 9 confirmed, 6 corrected |
| `legalops-org-rllb` | Article 1; the State article | 15 | 9 confirmed, 6 corrected |
| `gap-association-definitions-of-legal-ops` | Articles 1, 4, 5 | 22 | checked by the researcher against primary text |
| `gap-intake-and-self-service-named-cases` | Articles 1 and 4 | 17 | checked by the researcher |
| `bi-analytics-stats` | Article 4 | 15 | 12 confirmed, 2 corrected, 1 unverified |
| `gap-bi-technology-state-and-deterministic-role` | Articles 3 and 4 | 28 | checked by the researcher |
| `gap-conference-session-sweep-2026` | Articles 1, 4, 5; the State article | 17 | checked by the researcher |
| `palantir-intelligence-platform-model` | Articles 2 and 3 | 15 | 10 confirmed, 5 corrected |
| `ontology-landscape-and-ai` | Articles 2 and 3 | 15 | 10 confirmed, 5 corrected |
| `open-platforms-api-mcp-build` | Article 3; the State article | 15 | 7 confirmed, 8 corrected |
| `gap-inhouse-demand-for-openness-and-build` | Articles 2 and 3 | 19 | checked by the researcher |
| `knowledge-management-and-ai` | Article 5 | 15 | 9 confirmed, 6 corrected |
| `consulting-voice-and-tone` | Voice documents | 15 | 11 confirmed, 4 corrected |
| `gap-mckinsey-primary-text-for-voice` | Voice documents | 14 | checked by the researcher |
| `ai-writing-tells` | Voice documents; `scripts/voice-lint.mjs` | 15 | 11 confirmed, 4 corrected |
| `library-audit-local` | Voice documents | 14 | local audit of this repository, no web sources |

No finding was refuted. The corrections cluster in quotes and
attributions, which is where a published piece gets caught, so apply
them.

Article numbers follow the sequence the writer set on 2026-09-21
(second round): 1 is `managing-legal-operations` (The New Mandate for
Legal Operations, 2026-06-16), 2 is
`building-the-legal-operations-intelligence-platform` (2026-07-14), 3 is
`legal-operations-ontology` (2026-07-21), 4 is
`business-intelligence-for-legal-operations` (2026-09-01), and 5 is
`the-newfound-importance-of-knowledge-management` (2026-09-15). The
notes files, `DIGEST.md`, and `findings.json` were written under the
earlier numbering (2 was business intelligence, 3 the platform, 4 the
ontology); read their article numbers with that mapping. Round-two
notes (files prefixed `r2-`) use the new numbering.

## Corrections that change what we write

- **RLLB and LegalOps.com.** Running Legal Like a Business is the
  conference of LegalOps.com (https://legalops.com/), founded by
  Connie Brenton and Jeff Franke. "Legal Operators"
  (legaloperators.com) is a different organization. Earlier planning
  files confused the two.
- **The venture capital claim.** No RLLB source was found that cites
  "legal is the second most active investment area after coding."
  The closest published source is CB Insights, State of Venture 2025
  (2026-01-08): among its 25 "Smart Money" investors, coding AI
  agents and copilots drew 22 deals in 2025, legal AI agents and
  copilots 20, and end-to-end software development agents 17. That is
  a deal count among top-performing investors. It is not a statement
  about all venture dollars. The wording still needs to be confirmed
  on the primary page.
- **The published frameworks lag the practice.** Intake is not a
  named function in the CLOC, ACC, or LegalOps.com frameworks,
  self-service is absent from all of them, and both CLOC and ACC
  define knowledge management without mentioning AI.
- **Business intelligence in legal is mature on spend and less
  mature on service and value.** The evidence does not support a
  story in which legal is a laggard.
- **Openness.** The demand that legal vendors provide open
  environments is voiced mainly by vendors, trade press, and
  individual practitioners. No formal CLOC, ACC, or ILTA statement
  was found. Do not describe the iManage or Brightflag connectors as
  read-only without a source, and do not describe any vendor as
  closed.
- **Knowledge management.** No body yet names legal operations as the
  curator of the department's knowledge. An article that says so is
  making the case, not reporting a consensus.
- **Em dashes and authorship.** The em dash is weak evidence that a
  text was machine-written but a strong trigger for readers. McKinsey
  and Harvard Business Review both use em dashes. The house rule
  against them is a choice about how our readers react, and the
  consulting register survives without them (one September 2026 HBR
  article uses none).

## Limits of this research

- The session's web search allowance ran out partway through. Later
  tracks and all fact-checkers worked by fetching known URLs and
  following citations, so negative findings ("no source says X") are
  limited in scope.
- Several sites refused automated access: gartner.com, acc.com HTML
  pages, legalops.com, mckinsey.com, and some OpenAI and Microsoft
  pages. Gartner items rest on trade-press reprints. LegalOps.com
  text came first from its public staging mirror and later from the
  live site. McKinsey text was read from Internet Archive snapshots
  after the live site refused the request, so spot-check a few of
  those quotes in a browser.
- Many pages were read through a summarizing fetch tool. The
  fact-checkers re-read quotes against raw page text where they
  could, and their `.verified.md` files say which quotes were seen
  verbatim.
- Some reports restrict reuse. The ACC and Major, Lindsey & Africa
  benchmarking report requires "Reprinted with permission" wording on
  extracts and prohibits uploading the report into AI tools. Cite its
  published key findings and press release, not the report text.
- Undated documentation pages (Palantir, some Microsoft Learn pages)
  should be cited with an access date of 2026-09-21.

## What is not in this repository

This repository is public. The raw source captures that the research
agents saved (copies of documentation pages, report text extracted
from PDFs, and the fact-checkers' page caches, about 100 MB) are
third-party material and are kept out of it. They are in a private
local archive, together with a second copy of these notes and the
workflow journal:

`C:\code_files\spaarke-research\2026-09-loi-series\`

Internal strategy documents, including the ontology strategy
synopsis, also stay out of this repository.

## Topics covered, for later reuse

- How the legal operations role is changing: intake and the "legal
  front door", self-service, the general counsel's strategic role,
  AI governance, outside counsel expectations, new legal service
  delivery models, and AI-native law firms.
- How CLOC, ACC, and LegalOps.com define and frame legal operations,
  function by function.
- Business intelligence in legal departments: adoption, maturity,
  the widening audience for legal information, and the state of
  conversational and semantic-layer BI technology.
- What an intelligence platform is and how one is built, described
  from the published Palantir model, with a table of proprietary
  terms and neutral equivalents.
- The ontology landscape: Microsoft Fabric IQ, knowledge graphs,
  semantic layers, context graphs, decision intelligence, and legal
  data standards (SALI, LEDES and UTBMS, FIBO, Akoma Ntoso).
- Open platforms in legal technology: the Model Context Protocol,
  vendor connectors, write-back, the frontier model providers' legal
  offerings, and departments building their own tools.
- Knowledge management in the AI era: industry framing, statistics,
  technical reasons, new sources of knowledge, and risks.
- Conference coverage for 2026: CLOC Global Institute, ILTACON,
  RLLB, and the ILTA Technology Survey.
- Strategy-consulting voice (HBR, McKinsey, Bain, Deloitte Insights,
  MIT Sloan Management Review, strategy+business) and the catalog of
  signs that prose is machine-written.

## How it was produced

Two multi-agent workflows on 2026-09-21: ten research tracks, a
fact-checker for each of the nine web tracks, a completeness critic,
and six follow-up tasks (26 agents in all). Earlier in the same
session, single searches established the CLOC and ACC definitions and
the CB Insights source described above.
