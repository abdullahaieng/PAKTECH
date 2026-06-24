export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const ErrorCodes = {
  // Validation
  INVALID_INPUT: "INVALID_INPUT",
  MISSING_FIELD: "MISSING_FIELD",
  INVALID_TYPE: "INVALID_TYPE",

  // Auth
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INVALID_TOKEN: "INVALID_TOKEN",

  // Resources
  NOT_FOUND: "NOT_FOUND",
  ALREADY_EXISTS: "ALREADY_EXISTS",
  CONFLICT: "CONFLICT",

  // Business Logic
  OUT_OF_STOCK: "OUT_OF_STOCK",
  INVALID_OPERATION: "INVALID_OPERATION",

  // External Services
  UPLOAD_FAILED: "UPLOAD_FAILED",
  UPLOAD_TIMEOUT: "UPLOAD_TIMEOUT",
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",

  // Database
  DB_ERROR: "DB_ERROR",
  DB_CORRUPTED: "DB_CORRUPTED",

  // System
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
};

export function createError(
  code: string,
  message: string,
  statusCode: number = 500,
  details?: Record<string, unknown>
): AppError {
  return new AppError(code, message, statusCode, details);
}

export function getErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    [ErrorCodes.INVALID_INPUT]: "Invalid input provided",
    [ErrorCodes.UNAUTHORIZED]: "You are not authorized",
    [ErrorCodes.NOT_FOUND]: "Resource not found",
    [ErrorCodes.OUT_OF_STOCK]: "Product out of stock",
    [ErrorCodes.UPLOAD_FAILED]: "Image upload failed",
    [ErrorCodes.UPLOAD_TIMEOUT]: "Image upload took too long",
    [ErrorCodes.DB_ERROR]: "Database error occurred",
    [ErrorCodes.INTERNAL_ERROR]: "An internal error occurred",
  };
  return messages[code] || "An error occurred";
}
