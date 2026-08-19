import { environment } from "../env";
import type { ApiErrorEnvelope } from "./types";

const REQUEST_TIMEOUT_MS = 10_000;

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: unknown[];

  constructor(
    message: string,
    status: number,
    code: string,
    details: unknown[] = [],
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function isApiErrorEnvelope(value: unknown): value is ApiErrorEnvelope {
  return (
    typeof value === "object" &&
    value !== null &&
    "statusCode" in value &&
    "code" in value &&
    "message" in value
  );
}

export async function apiGet<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  );

  try {
    const response = await fetch(`${environment.apiUrl}${path}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    const body: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      if (isApiErrorEnvelope(body)) {
        throw new ApiError(
          body.message,
          body.statusCode,
          body.code,
          body.details,
        );
      }
      throw new ApiError(
        "Máy chủ trả về phản hồi không hợp lệ.",
        response.status,
        "INVALID_RESPONSE",
      );
    }
    return body as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(
        "Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại.",
        0,
        "TIMEOUT",
      );
    }
    throw new ApiError(
      "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối.",
      0,
      "NETWORK_ERROR",
    );
  } finally {
    window.clearTimeout(timeout);
  }
}
