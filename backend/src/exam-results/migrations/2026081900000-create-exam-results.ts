import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExamResults2026081900000 implements MigrationInterface {
  name = 'CreateExamResults2026081900000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "exam_results" (
        "registration_number" varchar(8) NOT NULL,
        "math" numeric(4,2),
        "literature" numeric(4,2),
        "foreign_language" numeric(4,2),
        "physics" numeric(4,2),
        "chemistry" numeric(4,2),
        "biology" numeric(4,2),
        "history" numeric(4,2),
        "geography" numeric(4,2),
        "civic_education" numeric(4,2),
        "foreign_language_code" varchar(2),
        CONSTRAINT "pk_exam_results" PRIMARY KEY ("registration_number"),
        CONSTRAINT "chk_exam_results_registration_number" CHECK ("registration_number" ~ '^[0-9]{8}$'),
        CONSTRAINT "chk_exam_results_math" CHECK ("math" BETWEEN 0 AND 10),
        CONSTRAINT "chk_exam_results_literature" CHECK ("literature" BETWEEN 0 AND 10),
        CONSTRAINT "chk_exam_results_foreign_language" CHECK ("foreign_language" BETWEEN 0 AND 10),
        CONSTRAINT "chk_exam_results_physics" CHECK ("physics" BETWEEN 0 AND 10),
        CONSTRAINT "chk_exam_results_chemistry" CHECK ("chemistry" BETWEEN 0 AND 10),
        CONSTRAINT "chk_exam_results_biology" CHECK ("biology" BETWEEN 0 AND 10),
        CONSTRAINT "chk_exam_results_history" CHECK ("history" BETWEEN 0 AND 10),
        CONSTRAINT "chk_exam_results_geography" CHECK ("geography" BETWEEN 0 AND 10),
        CONSTRAINT "chk_exam_results_civic_education" CHECK ("civic_education" BETWEEN 0 AND 10),
        CONSTRAINT "chk_exam_results_foreign_language_code" CHECK ("foreign_language_code" ~ '^N[1-7]$'),
        CONSTRAINT "chk_exam_results_foreign_language_pair" CHECK (
          ("foreign_language" IS NULL AND "foreign_language_code" IS NULL)
          OR ("foreign_language" IS NOT NULL AND "foreign_language_code" IS NOT NULL)
        )
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_exam_results_group_a_total"
      ON "exam_results" (("math" + "physics" + "chemistry") DESC)
      WHERE "math" IS NOT NULL
        AND "physics" IS NOT NULL
        AND "chemistry" IS NOT NULL
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "idx_exam_results_group_a_total"');
    await queryRunner.query('DROP TABLE "exam_results"');
  }
}
