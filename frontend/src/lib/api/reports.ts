import { apiGet } from "./client";
import type {
  ApiEnvelope,
  ScoreDistributionData,
  TopGroupAData,
} from "./types";

export function getScoreDistribution() {
  return apiGet<ApiEnvelope<ScoreDistributionData>>(
    "/reports/score-distribution",
  );
}

export function getTopGroupA() {
  return apiGet<ApiEnvelope<TopGroupAData>>("/reports/top-group-a");
}
