# Article 7: What Attorneys Need to Know About AI Architecture

> **Read `content/EDITORIAL-PLAN.md` first** for voice guidelines, tag taxonomy, template structure, and cross-reference rules.

## Metadata

| Field | Value |
|-------|-------|
| **Published** | 2026-02-15 |
| **Posted** | 2026-04-01 |
| **Phase** | 3 — AI & Strategic Perspective |
| **Word Count** | 1,400–1,600 |
| **Author** | Spaarke Team |

## Tags

```yaml
tags:
  organization: [corporate-legal, law-firm]
  function: [attorney, executive, operations]
  topic: [ai-copilot, compliance, legal-spend]
  theme: [ai-strategy, data-sovereignty, microsoft-ecosystem, thought-leadership]
```

## Purpose

AI literacy piece for legal leaders. This is not about teaching attorneys to code — it is about giving them the framework to evaluate AI tools intelligently. Positions Spaarke's architectural decisions as the informed choices. One of the most important articles for the law-firm audience.

## Card Summary / Why This Matters

> You do not need to understand how large language models work at a technical level. But you absolutely need to understand how your AI tools are architected — because that architecture determines whether your privileged data stays private, whether your AI outputs are grounded in reliable information, and how much you will ultimately pay. Three architectural decisions matter more than any feature list.

## Structure

### 1. Why This Matters (~150 words)
AI is no longer optional for legal departments. But adopting AI without understanding its architecture is like signing a contract without reading the key terms. You do not need to be an engineer — you need to know what questions to ask. Reference the data sovereignty concerns from Article 5 and the platform context from Article 4.

### 2. Decision 1: Where Does the AI Run? (~300 words)
Three models, each with different implications:

**External API** — Your data leaves your environment, is processed on the AI vendor's infrastructure, and returns. Data may cross geographic boundaries. Privilege implications are significant.

**Embedded in your platform** — AI runs within the vendor's application but still on their infrastructure. Better than raw API calls, but your data is still in someone else's environment.

**Within your tenant (Copilot model)** — AI operates inside your Microsoft 365 boundary. Data never crosses your perimeter. Governed by your existing policies. This is Spaarke's approach.

Make this concrete with scenarios:
- Scenario: A litigation team uses an AI tool to analyze privileged strategy documents. Where does that analysis happen?
- Scenario: A contracts team uses AI to compare terms against past negotiations. Where is that historical data processed?

### 3. Decision 2: What Data Trains or Grounds the AI? (~300 words)
Three approaches, each producing fundamentally different output quality:

**Public training data** — The AI knows what the internet knows. Useful for general tasks, unreliable for organization-specific work.

**RAG with your documents** — The AI retrieves your documents at query time. Better, but dependent on document quality and indexing.

**Grounded in structured operational data** — The AI draws on your organization's matter history, precedents, institutional memory, and operational context. This is the Inference layer of the IQ Stack (Article 2).

Key insight: An AI grounded in your organization's own operational memory will produce fundamentally better work than one trained on the internet. The IQ Stack's Memory layer is what makes AI genuinely useful for legal work.

### 4. Decision 3: What Is the True Cost Model? (~300 words)
AI pricing is opaque. Help readers understand the real cost structure:

**Per-seat licensing** — Predictable but may not reflect actual usage
**Per-query / per-token** — Scales with usage but creates anxiety and discourages adoption
**Bundled within existing licensing** — M365 Copilot model; incremental cost within an existing enterprise agreement

Hidden costs to watch for:
- Data egress fees (moving data to external AI services)
- API call charges (especially at scale)
- Storage costs for AI-generated content
- Integration costs for connecting AI to your data sources

Key insight: Usage-based pricing discourages AI adoption. When every query has a cost, teams self-censor. The M365 Copilot model — bundled or incrementally priced within existing licensing — removes this friction.

### 5. The Questions You Should Be Asking (~200 words)
Practical checklist for evaluating any AI-enabled legal tool:
- Where does AI processing occur — your environment or theirs?
- Is your data used to train models that serve other customers?
- What data sources ground the AI's outputs? Public data, your documents, or your structured operational data?
- What is the pricing model, and what are the hidden costs at scale?
- Can you audit AI interactions? Are they logged within your compliance framework?
- What happens to AI-processed data after the query is complete?

Frame as empowerment: "You will be in the room when these decisions are made. These are the questions that separate informed adoption from risky experimentation."

### 6. Where to Go Next
- Back-references: "Your Legal Data Belongs to You" (Article 5) for data sovereignty depth; "The IQ Stack" (Article 2) for the architecture that makes AI grounding work
- Forward tease: "AI Without Giving Away the Keys" (Article 8) for how Spaarke implements this within M365 Copilot

## Cross-References
- **Can reference**: Articles 1, 2, 3, 4, 5, 6
- **Will be referenced by**: Articles 8, 9
- **Forward tease**: Article 8
