export const ERROR_CODES = {
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  BAD_REQUEST: "BAD_REQUEST",
  CONFLICT: "CONFLICT",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export type ApiErrorBody = {
  code: ErrorCode;
  message: string;
};

export class ApiError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly status: 400 | 401 | 403 | 404 | 409 | 500,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const createError = {
  unauthorized: (message = "Unauthorized") =>
    new ApiError("UNAUTHORIZED", message, 401),
  forbidden: (message = "Forbidden") =>
    new ApiError("FORBIDDEN", message, 403),
  notFound: (message = "Not found") =>
    new ApiError("NOT_FOUND", message, 404),
  badRequest: (message: string) =>
    new ApiError("BAD_REQUEST", message, 400),
  conflict: (message: string) =>
    new ApiError("CONFLICT", message, 409),
  internal: (message = "Internal server error") =>
    new ApiError("INTERNAL_ERROR", message, 500),
};
