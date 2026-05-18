# Context is only one layer

<!--
slug:           context-is-only-one-layer
proposed type:  linkedin-post (Ralph's personal profile)
follow-up:      Spaarke company-page echo post (separate piece, 1-2 days later)
campaign:       2026-05-spaarke-launch
triggered_by:   NetDocuments "Context Graph for Legal Work" press release, 2026-05-14
-->

## The trigger

NetDocuments announced its "Context Graph for Legal Work" on 2026-05-14. They
position it as the first context graph in legal — a graph that maps connections
across hundreds of millions of records, surfaces matter overviews on open,
supports semantic search across the firm, and lets external AI (Claude, ChatGPT)
work against the firm's institutional knowledge via MCP. Built on AWS, integrates
with M365 via MCP. 25+ year DMS history.

Press release: https://www.netdocuments.com/company-news/netdocuments-unveils-context-graph-legal-platform/

## The argument

A context graph is necessary but not sufficient. What lawyers actually need is
an operating model — and the graph is one layer in it (the Memory layer in the
[Legal IQ Stack](/why-spaarke/the-iq-stack) framing).

Three subtle counter-points to weave in, without naming NetDocuments:

1. **A graph built on a DMS sees documents, parties, and timelines. An operating
   model sees matters, projects, invoices, spend, counsel performance, OCG
   compliance, and outcomes — all on the same record.** Different scope of
   memory; different decisions it can inform.

2. **Integrating *with* Microsoft 365 via MCP is not the same as running *inside*
   it.** Tenant-adjacent (AWS + M365 connectors) versus tenant-inside (Power
   Platform + Dataverse + SharePoint Embedded in the customer's own M365 tenant)
   is a structural difference, not a deployment preference. IT security review
   treats them differently. Data sovereignty model is different.

3. **A firm's graph and a company's graph aren't connected.** A law firm using a
   DMS-based graph and an in-house team using their own still work from separate
   tenants on the same matter. Spaarke's three-stakeholder model means the same
   matter record and operational memory span the engagement boundary.

## Tone

Subtle. Don't name NetDocuments. Agree with the premise (context matters,
institutional knowledge is the prize), broaden the frame (operating model >
graph). Anyone in the field will recognize the response; that's the point.

Founder voice for the personal post. Not corporate. Not defensive. Confident but
not aggressive.

## Asset and CTA

The post should close with a CTA inviting the reader to **see the Spaarke
platform walkthrough** — show, don't tell. The walkthrough is the differentiator
because it makes the operating-model argument visible in 60 seconds rather than
4 paragraphs.

## Tie-ins (links to include in the post or follow-up comment)

Use 2-3 of these, not all:

- [The Legal IQ Stack: Data, Memory, Inference](/why-spaarke/the-iq-stack) —
  primary architectural tie-in; explicitly maps "Memory" as one of three layers
- [Institutional Knowledge Is Walking Out the Door](/why-spaarke/institutional-knowledge) —
  NetDocuments names exactly this problem; we have the existing article
- [What is Legal Operations Intelligence?](/why-spaarke/what-is-legal-operations-intelligence) —
  the category piece, operating-model frame
- [Why We Built on Microsoft](/why-spaarke/why-we-built-on-microsoft) —
  architectural counter on tenant-inside vs tenant-adjacent (use if we want to
  make the architecture point explicitly)
- [Welcome to Spaarke](/blog/welcome-to-spaarke) — the launch article; natural
  primary cross-link since this sits in the launch campaign

My pick: **IQ Stack** (the architecture answer), **Institutional Knowledge**
(the same problem they're naming), and **the platform walkthrough** (the CTA).

## Hook ideas (draft territory — the brief should lock one)

- "Glad to see the field validating context graphs as a category." [pivot to:
  context is one layer; the operating model is the bigger frame]
- "A context graph is necessary but not sufficient." [direct take]
- "Every legal team is about to hear the phrase 'context graph' a lot." [meta
  observation — invites the reader in]

## Audience

Primary: corporate-counsel + legal-operations (the buyers who'll see this PR
and weigh it). Secondary: outside-counsel leadership (firm operations leaders
deciding their next-gen DMS).

## What this should NOT become

- An attack on NetDocuments. We don't name them.
- A laundry list of Spaarke features. The point is the architectural argument,
  not a feature comparison.
- A general "we have AI too" post. The take is specific: context graph is one
  layer, operating model is the frame.
- A long-form blog post. This is a LinkedIn post — punchy, founder voice,
  150-400 words.

## Follow-up: Spaarke company-page echo (1-2 days later)

Separate piece, separate slug (e.g., `legal-iq-is-an-operating-model` or
similar). Spaarke org voice. Lighter framing. Same architectural argument,
different opening — targets the corporate-counsel feed that doesn't follow
Ralph's profile. Decide that one after this one lands.
