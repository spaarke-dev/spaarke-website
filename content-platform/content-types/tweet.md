# Content type: tweet (X)

This document calibrates the house voice for tweets and threads. Read it alongside `voice/style-guide.md` and `voice/examples/ai-tells.md`. The tweet is the shortest format Spaarke ships, and it has the highest density per word.

---

## 1. Purpose

Tweets are punchier than LinkedIn posts and carry more per character. There is no preview cutoff to write around, so every tweet is its own hook. The audience skews toward `legal-tech-cio` and analyst types, and share velocity is higher when a thread works.

Tweets do two jobs. The first is sharp positioning: a single tweet that compresses the Microsoft-native or operational-intelligence position into 280 characters. The second is argument distribution: a thread of three to eight tweets that adapts a blog post. The cadence is three to five tweets per week. A forgettable tweet is worse than no tweet.

## 2. Variants

- **Single tweet**: one self-contained idea in 280 characters or fewer. It is best for sharp observations, positioning claims, and comments on industry news.
- **Thread**: typically three to eight tweets. A thread builds an argument across tweets, and each tweet earns the next. A thread that needs more than eight tweets should probably be a blog post.

A hero image is generally **not** included in a tweet, because the words carry the hook and the X algorithm penalizes posts that are heavy with links or images. When a single tweet or a thread does use an image (a positioning post, or a thread anchored on a chart), hero treatment follows `voice/visual-identity.md` in the same way that blog posts do, and the brief's `# Hero graphic` section captures the prompt.

## 3. Construction rules

- **The limit of 280 characters per tweet is hard.** Draft to 270 to leave room for polish. URLs shorten automatically to about 23 characters, and spaces and handles count.
- **One idea per tweet.** Two claims dilute each other.
- **Threads earn each next tweet.** Each tweet stands alone *and* leaves the reader wanting tweet n+1.
- **No links in early thread tweets.** X penalizes outbound links, so the link goes in the last tweet only, or in the bio.
- **The first tweet is the hook.** It requires the same discipline as a LinkedIn opener.
- **Numbering is optional.** Use "1/", "2/" for threads of five or more tweets.

## 4. Voice calibration

Defer to `voice/style-guide.md` for the baseline. Sections 4 and 5 of that guide apply to tweets in full, including the ban on em dashes and dash substitutes and the ban on the constructions listed in `voice/examples/ai-tells.md`. The tweet-specific calibration is as follows:

- **Idiomatic for X.** Short sentences suit the medium, and contractions are acceptable. Each sentence still has a subject and a verb, so verbless fragments and stacks of fragments are not used (`style-guide.md` §5, rule 16). End-of-tweet periods are optional.
- **No em dashes.** Earlier versions of this file said that em dashes work hard in tweets, and that advice is withdrawn. A tweet uses a comma, a colon, parentheses, or a second sentence, and it never uses a spaced hyphen or a double hyphen as a stand-in.
- **Compression without the tells.** The character limit invites negation followed by correction (`It is not X. It is Y.`), `not just X but Y`, a question answered in the next sentence, a colon reveal such as `The result:`, and a closing pair of clipped symmetrical sentences. State the claim positively and give the reason or the number.
- **Less formal than a blog post or a LinkedIn post.** Strong opinions are rewarded. Informality is no excuse for marketing-speak, and the forbidden phrases in style-guide §5 still apply.
- **Byline**: usually the organizational account. Tweets from named team members happen on their personal accounts.

## 5. CTA convention

- **Link in the last tweet of a thread**, when the thread previews a long-form piece. Use one link per thread, in the last tweet, on its own line.
- **Link in bio**, when the tweet stands alone but discoverability matters. The bio carries `spaarke.com` permanently.
- **No CTA**, when the goal is engagement (replies, quotes, reposts). This is often the right choice, because X is a poor conversion channel.

Never write "DM me for…" or "Comment 'INFO'…", because both signal low-rent marketing. Readers on X are harsher about this than readers on LinkedIn.

## 6. Frontmatter

Tweet briefs add the following fields on top of the universal frontmatter (see `spec.md` §6):

```yaml
---
type: tweet
format: thread                       # single | thread
tweet_count: 5                       # 1 for single; n for thread (3 to 8 typical)
link_target: <url-or-slug>           # only when there's a link in the last tweet
audience: legal-ops-director         # persona slug; see voice/audience-personas.md
companion_piece:                     # if this thread adapts a longer piece
  blog: <slug>
---
```

T10 builds the brief template from these fields. The brief body for a thread typically lists tweets 1..n with character counts beside each.

## 7. Common pitfalls

- **Padded threads.** A five-tweet thread that should have been three tweets is padded. Cut the tweets that recap or transition.
- **Buried hook.** Tweet 1 is the whole pitch, so open with the claim.
- **Link in tweet 1.** The algorithm penalizes it. The link belongs in the last tweet only.
- **LinkedIn voice on X.** Long-form first-person reflection reads as out of place.
- **Dashes and fragments for speed.** An em dash or a verbless fragment saves a few characters and marks the tweet as machine-written. Rewrite the sentence.

## 8. Worked example

**Brief sketch** (hypothetical, with illustrative figures): *2026-05-09, five-tweet thread adapting the OCG enforcement blog post.* The audience is `legal-ops-director`, the companion piece is the blog post `where-ocg-enforcement-actually-fails`, and the link appears in tweet 5 only.

The five tweets, sketched:

1. *Hook.* "Most legal departments enforce their OCGs after the invoice has already been approved. The clauses are right, but they fire too late to stop the spend."
2. *Mechanism.* E-billing systems were built to process invoices, so every OCG check they run is a post-hoc audit.
3. *Cost.* Between 4% and 8% of outside-counsel spend leaks through OCG gaps. On a $20M panel that's $800K to $1.6M a year recovered through disputes instead of prevented.
4. *Fix.* Enforcement intelligence catches violations at intake and on the invoice line, before approval. The terms stay the same, and the check moves earlier in the workflow.
5. *CTA + link.* "We wrote up the four enforcement-failure modes here: spaarke.com/blog/where-ocg-enforcement-actually-fails"

Each tweet works alone and earns the next, and each states its claim positively in complete sentences. The link sits in tweet 5 only.

---

*Revised 2026-09-21 (no em dashes, AI-tells ban applied to short formats), see git log for history.*
