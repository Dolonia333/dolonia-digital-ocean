# Dolonia Digital Ocean - Project Structure

This project has been reorganized to separate Frontend, Backend, and Database concerns.

## Quick Start

### Development (Frontend)
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Server
```bash
npm run server       # Start the payment server (backend/server.js)
npm run serve-invoice # Start the invoice preview server
```

## Directory Structure

```
/
├── frontend/          # React + TypeScript application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   ├── index.html    # Entry HTML
│   └── vite.config.ts # Vite configuration
├── backend/           # Server-side code
│   ├── server.js     # Express payment server
│   ├── serve-invoice.js # Invoice preview server
│   └── server/       # Server utilities (email.ts)
├── database/          # SQL migrations and schema
│   ├── migrations/   # Database migration files
│   ├── schema/       # Schema definitions
│   └── seeds/        # Sample data
├── config/            # Configuration files
│   ├── env/          # Environment files (.env, .env.local)
│   └── .vscode/      # VS Code settings
├── deploy/            # Deployment configurations
│   ├── docker/       # Docker setup
│   └── nas/          # NAS deployment package
├── scripts/           # Build and utility scripts
│   ├── build/        # WordPress build scripts
│   ├── powershell/   # PowerShell scripts
│   ├── batch/        # Windows batch files
│   └── shell/        # Shell scripts
├── docs/              # Documentation
│   ├── guides/       # How-to guides
│   ├── deployment/   # Deployment docs
│   ├── debugging/    # Debugging docs
│   └── ...
└── wordpress/         # WordPress theme files
```

## Important Path Changes

### Environment Files
- **OLD**: `.env.local` in root
- **NEW**: `config/env/.env.local`

Backend servers load env from: `../config/env/.env.local`

### Imports
- Frontend code: `@/` maps to `frontend/src/`
- Backend code: Can use `@backend/` to reference `backend/`
- Database: Can use `@database/` to reference `database/`

### Build Output
- Frontend builds to: `frontend/dist/`
- WordPress builds to: `wordpress/dolonia-cloud/`

## Environment Variables

Key variables needed in `config/env/.env.local`:

```
VITE_STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=...
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=587
VITE_SMTP_USER=...
VITE_SMTP_PASS=...
```

## NPM Scripts

### Root package.json
- `npm run dev` - Start frontend dev server
- `npm run build` - Build frontend for production
- `npm run server` - Start payment backend server
- `npm run serve-invoice` - Start invoice preview server
- `npm run build:wordpress` - Build WordPress theme
- `npm run lint` - Run ESLint on frontend
- `npm run typecheck` - Run TypeScript checks

## Notes

- The frontend and backend share the same node_modules at root
- Backend files use ES modules (type: "module" in package.json)
- Environment files are centralized in config/env/
- Documentation is organized by category in docs/

## Collaboration And PR Handoff

- Active collaboration branch: `chore/collab-handoff-docs`
- Primary teammate handoff guide: `docs/project/COLLABORATION_HANDOFF.md`

If you are jumping in to help, start with the handoff guide above. It documents the current feature set, architecture, environment requirements, and a recommended PR split strategy.
