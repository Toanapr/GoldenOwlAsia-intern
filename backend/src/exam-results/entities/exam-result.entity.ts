import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'exam_results' })
export class ExamResult {
  @PrimaryColumn({ name: 'registration_number', type: 'varchar', length: 8 })
  registrationNumber!: string;

  @Column({ type: 'numeric', precision: 4, scale: 2, nullable: true })
  math!: string | null;

  @Column({ type: 'numeric', precision: 4, scale: 2, nullable: true })
  literature!: string | null;

  @Column({
    name: 'foreign_language',
    type: 'numeric',
    precision: 4,
    scale: 2,
    nullable: true,
  })
  foreignLanguage!: string | null;

  @Column({ type: 'numeric', precision: 4, scale: 2, nullable: true })
  physics!: string | null;

  @Column({ type: 'numeric', precision: 4, scale: 2, nullable: true })
  chemistry!: string | null;

  @Column({ type: 'numeric', precision: 4, scale: 2, nullable: true })
  biology!: string | null;

  @Column({ type: 'numeric', precision: 4, scale: 2, nullable: true })
  history!: string | null;

  @Column({ type: 'numeric', precision: 4, scale: 2, nullable: true })
  geography!: string | null;

  @Column({
    name: 'civic_education',
    type: 'numeric',
    precision: 4,
    scale: 2,
    nullable: true,
  })
  civicEducation!: string | null;

  @Column({
    name: 'foreign_language_code',
    type: 'varchar',
    length: 2,
    nullable: true,
  })
  foreignLanguageCode!: string | null;
}
