---
slug: welcome-to-spaarke
type: blog-post
publish_date: 2026-05-11
channels: [website, linkedin]
status: draft
priority: high
audience: corporate-counsel        # primary; reads for legal-ops-director and legal-tech-cio too
length_target: 1500
byline: spaarke

# --- MDX frontmatter shape (per src/lib/blog.ts). Used when the draft is moved into content/blog/. ---
title: Welcome to Spaarke
description: Spaarke is a Legal Operations Intelligence platform that runs inside your Microsoft tenant — AI-directed, human-controlled, built where legal work actually happens.
summary: Most legal-AI pitches are tools dressed up as operating models. Spaarke is the operating model — a Microsoft-native system of record where matters, documents, spend, and AI run together inside the tenant the customer already governs. AI-directed, human-controlled. This is the first piece written under the new voice constitution.
date: 2026-05-11
author: spaarke
tags:
  organization: [corporate-legal, law-firm]
  function: [executive, operations, attorney, it]
  topic: [matter-management, ai-copilot, legal-spend, compliance]
  theme: [legal-operations-intelligence, platform, microsoft-ecosystem, iq-stack, thought-leadership]
heroImage: /images/blog/welcome-to-spaarke.jpg
heroImagePosition: center
draft: true
keyTakeaways:
  - Spaarke is a Legal Operations Intelligence platform — a Microsoft-native system of record where matters, documents, spend, and AI run together across every side of the engagement.
  - The platform philosophy is AI-directed, human-controlled. Agents take bounded actions in the platform; judgment, privilege, and accountability stay with the lawyer.
  - Spaarke runs inside the customer's own Microsoft tenant. Identity, governance, and the security perimeter are the ones IT already approved.
  - Legal AI is moving from tools to operating models. Drafting and review tools improve specific tasks; an operating model changes how the work runs.
  - The writing on this site is built around that thesis — operational intelligence over productivity, embedded over bolted-on, grounded over generic.
order: 1
featured: true
featuredOrder: 1
---

# Topic
Introducing the Spaarke platform under the new voice constitution. What we are, what we believe, and what the writing on this site is going to argue. Replaces the previous services-firm "Welcome to Spaarke" announcement at the same slug.

# Angle / Point of view
This is not a launch announcement. It is a statement of conviction. The legal-AI market is saturated with productivity promises — drafting assistants, review accelerators, "Copilot for lawyers." Useful, narrow, and not what the next decade requires. We believe the next generation of legal systems will be operating models, not productivity tools, and that the operating model has to live inside the customer's Microsoft estate, with AI directing and humans controlling. The piece argues that thesis specifically, in plainspoken terms a senior reader can repeat back.

# Why now
Spaarke launched in 2026; the platform is in early access (CTA "Get access" on `/` and `/platform`). This is the first piece written under the voice constitution that was drafted in T01–T11 and is now in revision. The previous welcome article was the single ⚠ entry in the library audit and reads as services-firm marketing — it has to come off the shelf. The reader who clicks through from the home page or from a LinkedIn announcement should land on a piece that makes the thesis legible in fifteen hundred words.

# Must include
- The Legal Operations Intelligence positioning, defined plainly in one sentence the reader can carry away.
- The "AI-directed, human-controlled" philosophy — verbatim and used structurally, not name-checked.
- That Spaarke runs inside the customer's own Microsoft tenant. Frame as a structural choice, not a deployment preference. Identity, DLP, sensitivity labels, audit are the ones IT already approved.
- The shift from tools to operating models. Drafting, review, summarization improve a single task. An operating model changes how work runs across matters, spend, documents, and counsel.
- A short preview of the writing topic families — operational intelligence, embedded AI, document intelligence, billing-compliance intelligence, AI-directed workflows, why-Microsoft-is-becoming-the-operating-layer-for-legal.
- One pointer each to `/platform`, `/why-spaarke`, `/why-spaarke/what-is-legal-operations-intelligence`, and `/why-spaarke/why-we-built-on-microsoft`.

# Must NOT include
- "Welcome to Spaarke!" as an opener, or any breathless launch language. No "Hello," "Greetings," or "We're thrilled."
- Founder-letter "I'm thrilled to" / "we're excited to" voice (style-guide §5.8).
- "AI-powered." Use specific layer names (Foundry IQ for grounding and operational memory, Microsoft Agent Framework for orchestration and execution, Power Platform + M365 for the user experience) when AI is named at all.
- "Replace lawyers," "10x productivity," "transform," "disrupt," "revolutionary," "ChatGPT for legal," "Copilot for lawyers."
- Generic "the future of legal" framing. We don't predict trajectories we can't defend.
- Demo CTA. The close points to substance (`/platform`, `/why-spaarke/what-is-legal-operations-intelligence`).
- Stock SaaS adjectives — powerful, robust, seamless, innovative, cutting-edge, best-in-class.

# References
- `/platform` — capability modules and deployment models.
- `/why-spaarke` — positioning hub.
- `/why-spaarke/what-is-legal-operations-intelligence` — category-definition piece.
- `/why-spaarke/why-we-built-on-microsoft` — Microsoft-foundation piece.
- `/why-spaarke/the-iq-stack` — architecture reference (used as cadence model for the opening).
- External, optional: Microsoft 2026 Work Trend Index figures (15M paid M365 Copilot seats; 420M MAU) — only if a number is genuinely earning its place. Don't pad.

# Voice notes
Organizational byline. The writing should still feel like a person wrote it — authoritative, plainspoken, occasionally wry. Read the openings of `the-iq-stack` and `the-20b-blind-spot` for cadence; the "Don't write" entries in `voice/examples/avoid-this.md` for the failure mode this piece is most at risk of (founder-letter voice, vague abstractions, "AI-powered" filler).

The opening must make a specific observation, not a generic claim. No "Hello." No "Welcome." No "Imagine." The reader is a senior corporate-counsel or legal-ops director who clicked through wondering what we actually think — write to that reader.

A note on the hero image: a hero prompt for this piece is captured in the `# Hero graphic` section below, drafted against the locked `voice/visual-identity.md`. Generate the image, drop it at the output path, and the `heroImage` placeholder resolves.

# Hero graphic

**Prompt** (paste-ready for Midjourney/DALL-E/Firefly — see `voice/visual-identity.md`):

> Minimalist geometric vector illustration, deep navy background (#0A0A0A fading radially to #2D1F5E in the lower-third), single confident electric-blue accent (#000BFF) with a faint soft-purple glow halo (#7B5BFF at 15% opacity). An abstract emblem of nested containment: three concentric square frames of varying line weight, each rotated a few degrees off the next, with a small solid Spaarke-blue cube held precisely at center — a system held inside a boundary held inside a boundary. Centered focal point, 16:9 landscape, generous negative space on all sides, flat 2.5D vector, editorial illustration in the McKinsey Quarterly / Harvard Business Review house style. No text, no people, no UI panels, no neural network mesh, no robotic hands, no futuristic HUD, no data particles, no glowing brain, no Microsoft logos, no gavels or scales, no photo-real 3D renders, no clip-art.

**Style preset**: minimalist geometric, deep-navy + electric-blue accent, soft purple glow, 2.5D.

**Aspect ratio**: 16:9 (default — matches `ArticleHeader.tsx`).

**Alt text**: Three concentric square frames on a deep navy field, with a single Spaarke-blue cube held at center, suggesting a system held inside a tenant boundary.

**Generator notes**: Midjourney v6.1+ default — append `--ar 16:9 --style raw --s 50`. Lower stylize keeps decoration restrained; pin `--seed` once a candidate frame is found, then iterate variations. For commercial-safe re-use (white paper, LinkedIn carousel) prefer Adobe Firefly with the "Art" content-type and "Vector look" preset. See `tasks/hero-regeneration-prompts.md` for per-tool flag detail and the rest of the seven-piece batch.

**Output path**: `/public/images/blog/welcome-to-spaarke.jpg` (replaces the existing placeholder; `heroImage` frontmatter already references this path).
