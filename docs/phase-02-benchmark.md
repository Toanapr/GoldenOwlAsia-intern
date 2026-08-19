# Phase 2 Database and Import Benchmark

Benchmark recorded on 2026-08-19 using PostgreSQL 17 Alpine in Docker, Node.js 24, and the supplied `dataset/diem_thi_thpt_2024.csv` file.

## Import results

| Check                                      | Result            |
| ------------------------------------------ | ----------------- |
| CSV data rows processed                    | 1,061,605         |
| Database rows after first import           | 1,061,605         |
| Importer duration, first run               | 26.664 seconds    |
| Command wall time, including build/startup | 28.48 seconds     |
| Peak JavaScript heap reported by importer  | 125,502,072 bytes |
| Database rows after second import          | 1,061,605         |
| Importer duration, second run              | 29.692 seconds    |
| PostgreSQL table and index size            | 251 MB            |

The stable row count after the second run confirms idempotency. Heap samples remained bounded while processing the full file because rows were streamed and released after each 2,000-row batch.

## Data verification

Records `01000001` and `01000002` were queried after import and matched the first two source CSV rows, including leading zeroes, decimal values, nullable subjects, and foreign-language code `N1`.

## Query plans

Primary-key lookup for registration number `01000001` used `pk_exam_results` and completed in approximately 0.009 ms.

The Top A query used `idx_exam_results_group_a_total` for the expression `math + physics + chemistry` and returned the first ten rows in approximately 0.059 ms.
