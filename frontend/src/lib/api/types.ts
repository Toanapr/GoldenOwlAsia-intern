export interface ApiEnvelope<T, M extends object = Record<string, never>> {
  data: T;
  meta: M;
}

export interface ApiErrorEnvelope {
  statusCode: number;
  code: string;
  message: string;
  details: unknown[];
  path: string;
  timestamp: string;
}

export type SubjectCode =
  | "math"
  | "literature"
  | "foreign_language"
  | "physics"
  | "chemistry"
  | "biology"
  | "history"
  | "geography"
  | "civic_education";

export interface SubjectScore {
  subjectCode: SubjectCode;
  subjectName: string;
  score: number | null;
}

export interface ScoreLookupData {
  registrationNumber: string;
  foreignLanguageCode: string | null;
  scores: SubjectScore[];
}

export type DistributionBandKey =
  "gte_8" | "gte_6_lt_8" | "gte_4_lt_6" | "lt_4";

export interface DistributionBand {
  key: DistributionBandKey;
  label: string;
  count: number;
}

export interface SubjectDistribution {
  subjectCode: SubjectCode;
  subjectName: string;
  totalWithScore: number;
  bands: DistributionBand[];
}

export interface ScoreDistributionData {
  subjects: SubjectDistribution[];
}

export interface GroupAStudent {
  position: number;
  registrationNumber: string;
  math: number;
  physics: number;
  chemistry: number;
  total: number;
}

export interface TopGroupAData {
  group: { code: string; subjects: SubjectCode[] };
  students: GroupAStudent[];
}
