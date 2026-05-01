# Collaboration Handoff Guide

## Purpose

This document is the teammate handoff for the Dolonia project. It explains:
- what features exist
- how the system is wired together
- what environment variables are required
- how to run and debug locally
- how to safely continue development for PRs

## Collaboration Branch

Current handoff branch:
- chore/collab-handoff-docs

Base branch at creation time:
- organized-set-up

## High-Level Architecture

The app is a monorepo with separate frontend, backend, and database folders.

- Frontend: React + TypeScript + Vite in frontend/
- Backend: Express utility servers in backend/
- Database: Supabase SQL + migration assets in database/
- Environment: centralized in config/env/

### Runtime topology (local)

- Frontend web app: http://localhost:8080
- Payment backend: http://localhost:3001
- Invoice preview backend: http://localhost:3000
- Supabase (local, if used): http://127.0.0.1:54321

## What Features Exist

### Public pages
Defined in frontend/src/App.tsx routes:
- Home, Services, Solutions, Security, About, Contact, Pricing, Service Menu, Blog
- Legal pages: Privacy Policy, Terms of Service, Cookie Policy
- NotFound fallback route

### Auth and account area
- Login and Sign-up page (Supabase auth)
- Account dashboard with role-based behavior
- Roles referenced in dashboard logic: admin, team_member, client, user
- Realtime profile updates with polling fallback when websocket subscription is unavailable

### Intake and lead capture
- Contact form and Intake form flows
- Intake captures project/business details and writes to Supabase-backed tables
- Admin dashboard surfaces leads and intake activity

### Support tickets
- Ticket submission page for users
- Ticket visibility and updates in account dashboard
- Ticket response flow supported through Supabase tables

### Calendar and bookings
- Dedicated calendar page and appointment booking component
- Room booking and client appointment features are represented in components/services

### Invoicing and billing
- Invoice creation/view components in frontend
- Payment tracking dashboard component in frontend

### Stripe payments
- Frontend Stripe helper and payment form component
- Payment intent endpoint provided by backend/server.js
- Vite also contains a dev middleware endpoint at /api/create-payment-intent

### Search, SEO, and UX helpers
- SEO component and route-level metadata usage
- Site search component
- Live chat and interaction helpers
- Error boundary and loading components

## Key Directories and Responsibilities

- frontend/src/pages: route-level pages and major feature screens
- frontend/src/components: reusable UI and feature components
- frontend/src/integrations/supabase: Supabase client and generated types
- frontend/src/lib: shared helpers (including Stripe browser loader)
- backend/server.js: payment intent API server
- backend/serve-invoice.js: invoice preview static server
- backend/server: server-side utility modules
- database: SQL and migration assets
- config/env: environment files actually loaded by Vite and backend scripts
- docs: deployment, testing, project notes

## Environment Variables

Primary env file location in this repo layout:
- config/env/.env.local

Important variables used by core flows:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_STRIPE_PUBLISHABLE_KEY
- VITE_STRIPE_SECRET_KEY
- VITE_SMTP_HOST
- VITE_SMTP_PORT
- VITE_SMTP_USER
- VITE_SMTP_PASS

Notes:
- frontend/vite.config.ts uses envDir set to ../config/env, so config/env/.env.local is the active source.
- backend/server.js explicitly loads ../config/env/.env.local.

## Scripts You Will Use Most

From repository root package.json:

- npm run dev
  - starts Vite frontend at frontend/ with host enabled

- npm run server
  - starts backend/server.js payment server

- npm run serve-invoice
  - starts backend/serve-invoice.js static invoice preview

- npm run build
  - builds frontend for production

- npm run lint
  - runs ESLint against frontend code

- npm run typecheck
  - TypeScript type check for frontend

## How Core Flows Work

### 1) Login / Sign-up

- UI in frontend/src/pages/Login.tsx
- Uses Supabase auth methods:
  - signUp
  - signInWithPassword
- On success, user is redirected to /account.
- Auth errors are surfaced via toasts.

### 2) Supabase client initialization

- Client defined in frontend/src/integrations/supabase/client.ts
- Uses VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
- Includes a dev URL host resolution helper so loopback URLs can adapt to current browser host when needed.

### 3) Payments

Two local dev options exist:
- backend/server.js endpoint: POST /create-payment-intent on port 3001
- Vite middleware endpoint: POST /api/create-payment-intent on port 8080

The frontend Stripe browser loader:
- frontend/src/lib/stripe.ts
- returns null if publishable key is missing or protocol is non-HTTPS

### 4) Dashboard data and role behavior

- Major logic in frontend/src/pages/Account.tsx
- Loads profile and role-dependent data from Supabase tables
- Subscribes to profile changes through Supabase realtime
- Falls back to polling if subscription fails

## Current Risk Notes for Teammates

- Working tree is large and includes substantial in-progress changes.
- There are many deployment-related and asset changes; review diffs carefully before splitting PRs.
- Keep feature PRs scoped by area (auth, dashboard, infra scripts, docs) to make review easier.

## Recommended PR Strategy

1. Open a prep PR with docs-only updates from this branch.
2. Open follow-up PRs per feature area:
   - auth and account
   - payments and stripe
   - calendar and booking
   - deploy scripts and NAS assets
3. For each PR include:
   - affected routes/components
   - env var changes
   - manual test checklist

## Exact Push And PR Commands

Run from repo root:

1) Push this collaboration branch

git push -u origin chore/collab-handoff-docs

2) (Optional) Commit docs-only first if you want a clean prep PR

git add README.md docs/README.md docs/project/COLLABORATION_HANDOFF.md .github/pull_request_template.md
git commit -m "docs: add collaboration handoff and PR template"
git push

3) Open PR in GitHub

- Base: organized-set-up
- Compare: chore/collab-handoff-docs
- Title suggestion: docs: collaboration handoff and PR workflow

4) For follow-up feature PRs

- Create feature branches from organized-set-up
- Keep each PR focused on one domain area (auth, payments, calendar, deploy)

## Quick Onboarding Checklist for New Contributors

1. Pull the collaboration branch.
2. Verify config/env/.env.local values exist.
3. Run npm install at repo root.
4. Run npm run dev and open /login and /account.
5. Run npm run server if validating Stripe payment intent flow.
6. Confirm Supabase local or remote endpoint health matches env settings.
7. Review docs/project and docs/deployment before changing infra files.
