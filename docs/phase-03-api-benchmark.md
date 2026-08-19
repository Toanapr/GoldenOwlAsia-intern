# Phase 3 API Benchmark

Benchmark recorded on 2026-08-19 against PostgreSQL 17 in Docker with all 1,061,605 exam-result records loaded.

## HTTP smoke test

| Endpoint                                 | Status | Observed response time |
| ---------------------------------------- | ------ | ---------------------- |
| `GET /health`                            | 200    | 22.6 ms                |
| `GET /api/v1/scores/01000001`            | 200    | 9.0 ms                 |
| `GET /api/v1/reports/score-distribution` | 200    | 326.2 ms               |
| `GET /api/v1/reports/top-group-a`        | 200    | 2.6 ms                 |
| `GET /docs/`                             | 200    | 0.7 ms                 |

These are local development measurements and are intended to detect major regressions, not to represent production latency.

## PostgreSQL query plans

### Registration-number lookup

PostgreSQL used `pk_exam_results` with an index scan and `LIMIT 1`. Measured SQL execution time was approximately 0.039 ms.

### Score distribution

All nine subjects and four bands were aggregated in one SQL statement. PostgreSQL used a parallel sequential scan over the table and did not create a nine-times-row intermediate result. Measured SQL execution time was approximately 418 ms on a cold-to-mixed cache run.

### Top Group A

PostgreSQL used `idx_exam_results_group_a_total`, followed by a small incremental sort for the deterministic Math, Physics, Chemistry and registration-number tie-breaks. Only 18 index rows were read to return ten students. Measured SQL execution time was approximately 0.267 ms.
