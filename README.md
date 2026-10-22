# ProofDesk — Web App

Frontend for ProofDesk, a testimonial-collection and review tool: a submission form for customers, a review queue for moderators, and a public testimonials wall.

**Stack:** Next.js (App Router) · TypeScript · TanStack Query · React Hook Form + Zod · shadcn/ui · Tailwind CSS · Sonner

API: [proofdesk-backend](https://github.com/Arpitpatidar00/proofdesk-backend)

## Pages

| Route | What it does |
| :-- | :-- |
| `/submit` | Testimonial form with schema validation (React Hook Form + Zod) |
| `/review` | Review queue — search, sort, pagination, bulk approve / reject |
| `/testimonials` | Public wall of approved testimonials |

A **role switcher** in the header flips between viewer and reviewer to demo role-gated views.

## Structure

```
src/
  app/                   routes + providers (TanStack Query, theme)
  features/review-queue/ queue, bulk action bar, search, sort, pagination
  components/shared/     app header, role switcher
  components/ui/         shadcn/ui primitives
```

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

Point it at a running ProofDesk API (see the backend README).
