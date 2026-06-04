# Context Lens — Agent Memory

## What this is
A tool that parses a TypeScript codebase and uses Claude to generate plain-English
explanations of each function, while tracking token usage and cost per function.

## Stack & layout
- Next.js (App Router) + TypeScript, **pnpm** (not npm)
- `ts-morph` for AST parsing / function extraction
- `@anthropic-ai/sdk` for explanations
- Key code: `src/`

## Run / build / test
- `pnpm install`
- `pnpm dev` — dev server on http://localhost:3000
- Requires `.env.local` with `ANTHROPIC_API_KEY` (never commit)

## Decisions
- Prompt instructs "2–3 sentences" to keep output tokens low — output is 5× input cost.

## Learnings
- See `learnings/WEEK1_LEARNINGS.md` for the original token/cost analysis (Feb 28, 2026):
  analyzing ~1000 functions costs ~$7.73; output tokens dominate cost.
  → New cost/usage findings should go in `## Learnings` here going forward.
