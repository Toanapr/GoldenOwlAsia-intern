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

## Backend API

Interactive Swagger documentation is available at `http://localhost:3000/docs`.

```text
GET /api/v1/scores/:registrationNumber
GET /api/v1/reports/score-distribution
GET /api/v1/reports/top-group-a
GET /health
GET /docs
```

Successful core API responses use a `{ data, meta }` envelope. Errors include `statusCode`, a stable application `code`, `message`, `details`, `path`, and an ISO timestamp.

Group A includes candidates with all three Math, Physics and Chemistry scores. Results are ordered by total descending, then Math, Physics and Chemistry descending, and finally registration number ascending. This deterministic tie-break always returns at most ten candidates.

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

Measured full-dataset results are recorded in:

- [`docs/phase-02-benchmark.md`](docs/phase-02-benchmark.md)
- [`docs/phase-03-api-benchmark.md`](docs/phase-03-api-benchmark.md)
