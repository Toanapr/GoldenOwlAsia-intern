# G-Scores

G-Scores is a TypeScript workspace for searching and reporting Vietnam's 2024 national high school exam scores.

## Workspace

```text
backend/    NestJS API
frontend/   React + Vite application
dataset/    Source CSV supplied with the assignment
plans/      Execution plans by phase
```

## Prerequisites

- Node.js 22 or newer
- npm 10 or newer

## Local setup

```bash
cp .env.example .env
npm install
npm run dev
```

The backend runs at `http://localhost:3000`, its health endpoint is `http://localhost:3000/health`, and the frontend runs at `http://localhost:5173`.

## Quality commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Business features, database migrations, and data import are implemented in later phases described under `plans/`.
