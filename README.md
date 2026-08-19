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
- Docker with Docker Compose

## Local setup

```bash
cp .env.example .env
npm install
npm run db:up
npm run migration:run
npm run dev
```

The backend runs at `http://localhost:3000`, its health endpoint is `http://localhost:3000/health`, and the frontend runs at `http://localhost:5173`.

## Database and data import

PostgreSQL runs in Docker on port `5432`. After applying migrations, import the supplied dataset with:

```bash
npm run data:import -- --file=dataset/diem_thi_thpt_2024.csv
```

The importer streams the CSV, validates every row and upserts batches of 2,000 records. Running the command again is safe: existing registration numbers are updated without creating duplicates.

Useful database commands:

```bash
npm run db:up
npm run db:logs
npm run db:down
npm run migration:run
npm run migration:revert
```

## Quality commands

```bash
npm run lint
npm run typecheck
npm test
npm run test:integration -w backend
npm run build
```

The measured full-dataset import and query-plan results are recorded in [`docs/phase-02-benchmark.md`](docs/phase-02-benchmark.md).
