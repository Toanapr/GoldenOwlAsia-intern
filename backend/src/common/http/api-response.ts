export interface ApiSuccessResponse<
  T,
  M extends object = Record<string, never>,
> {
  data: T;
  meta: M;
}

export function apiResponse<T, M extends object = Record<string, never>>(
  data: T,
  meta = {} as M,
): ApiSuccessResponse<T, M> {
  return { data, meta };
}
