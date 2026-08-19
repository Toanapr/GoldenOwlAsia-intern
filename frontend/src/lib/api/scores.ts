import { apiGet } from "./client";
import type { ApiEnvelope, ScoreLookupData } from "./types";

export function getScore(registrationNumber: string) {
  return apiGet<ApiEnvelope<ScoreLookupData>>(`/scores/${registrationNumber}`);
}
