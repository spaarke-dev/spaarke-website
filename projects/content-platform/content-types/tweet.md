# Content type: tweet (X)

Calibration for tweets and threads. Read alongside `voice/style-guide.md`. The shortest format Spaarke ships, with the highest density per word.

---

## 1. Purpose

Tweets are punchier than LinkedIn. Higher density per character, no preview-cutoff to engineer around — every tweet is the hook. Audience skews toward `legal-tech-cio` and analyst types, with sharper share-velocity when a thread lands.

Two jobs: sharp positioning (a single tweet compressing Microsoft-native or operational-intelligence into 280 characters), and argument distribution (a 3–8-tweet thread adapting a blog post). Cadence 3–5 per week. A forgettable tweet is worse than no tweet.

## 2. Variants

- **Single tweet** — one self-contained idea, ≤ 280 characters. Best for sharp observations, positioning claims, industry comments.
- **Thread** — 3–8 tweets typical. Builds an argument across tweets, each one earning the next. Threads beyond 8 should probably be a blog post.

A hero image is generally **not** included in a tweet — the words carry the hook, and X penalizes link-laden / image-heavy posts in the algorithm. When a single tweet or thread does use an image (a positioning post, a thread anchored on a chart), hero treatment follows `voice/visual-identity.md` the same way blog posts do; the brief's `# Hero graphic` section captures the prompt.

## 3. Construction rules

- **280 characters per tweet, hard.** Draft to 270 for polish room. URLs auto-shorten to ~23 chars; spaces and handles count.
- **One idea per tweet.** Two claims dilute each other.
- **Threads earn each next tweet.** Each stands alone *and* leaves the reader wanting tweet n+1.
- **No links in early thread tweets** — X penalizes outbound links. Link goes in the last tweet only, or in bio.
- **First tweet is the hook** — same discipline as a LinkedIn opener.
- **Numbering optional.** Use "1/", "2/" for threads of 5+.

## 4. Voice calibration

Defer to `voice/style-guide.md`. Tweet-specific calibration:

- **Idiomatic for X.** Sentence fragments OK. Em-dashes work hard. End-of-tweet periods optional.
- **Less formal than blog or LinkedIn**, strong opinions rewarded — but "less formal" is not "marketing-speak." §5 forbidden phrases still apply.
- **Byline**: usually the organizational account. Named-team-member tweets happen on personal accounts.

## 5. CTA convention

- **Link in the last tweet of a thread** — when previewing a long-form piece. One link per thread, last tweet, on its own line.
- **Link in bio** — when the tweet stands alone but discoverability matters. Bio carries `spaarke.com` permanently.
- **No CTA** — when the goal is engagement (replies, quotes, reposts). Often the right move; X is not a conversion channel.

Never "DM me for…" or "Comment 'INFO'…" — both signal low-rent marketing. X is harsher about this than LinkedIn.

## 6. Frontmatter

Tweet briefs add the following fields on top of the universal frontmatter (see `spec.md` §6):

```yaml
---
type: tweet
format: thread                       # single | thread
tweet_count: 5                       # 1 for single; n for thread (3-8 typical)
link_target: <url-or-slug>           # only when there's a link in the last tweet
audience: legal-ops-director         # persona slug; see voice/audience-personas.md
companion_piece:                     # if this thread adapts a longer piece
  blog: <slug>
---
```

T10 builds the brief template from these fields. The brief body for a thread typically lists tweets 1..n with character counts beside each.

## 7. Common pitfalls

- **Padded threads.** A 5-tweet thread that should have been 3. Cut tweets that recap or transition.
- **Buried hook.** Tweet 1 is the whole pitch — open with the claim.
- **Link in tweet 1.** Algorithm penalty. Last tweet only.
- **LinkedIn voice on X.** Long-form first-person reflection reads out of place.

## 8. Worked example

**Brief sketch** (hypothetical): *2026-05-09 — 5-tweet thread adapting the OCG enforcement blog post.* Audience `legal-ops-director`; companion piece blog `where-ocg-enforcement-actually-fails`; link in tweet 5 only.

The five tweets, sketched:

1. *Hook.* "Most legal departments don't have an OCG problem. They have an OCG-enforcement-timing problem. The clauses are right — they just don't fire until after the invoice's already been approved."
2. *Mechanism.* E-billing was built to process invoices, not to enforce policy. Every OCG check is a post-hoc audit.
3. *Cost.* 4–8% of outside-counsel spend leaks through OCG gaps. On a $20M panel that's $800K–$1.6M/year recovered through disputes instead of prevented.
4. *Fix.* Enforcement intelligence catches violations at intake and on the invoice line, before approval. Same terms, different point in the workflow.
5. *CTA + link.* "Wrote up the four enforcement-failure modes. Full piece: spaarke.com/blog/where-ocg-enforcement-actually-fails"

Each tweet works alone and earns the next. Link sits in tweet 5 only.
