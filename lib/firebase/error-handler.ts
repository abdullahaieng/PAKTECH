import { FirebaseError } from "firebase/app";
import { logger } from "@/lib/logger";

export class FirebaseServiceError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public originalError?: Error
  ) {
    super(message);
    this.name = "FirebaseServiceError";
  }
}

const FIREBASE_ERROR_MAP: Record<string, { message: string; statusCode: number }> = {
  // Auth errors
  "auth/user-not-found": { message: "User not found", statusCode: 404 },
  "auth/wrong-password": { message: "Invalid password", statusCode: 401 },
  "auth/user-disabled": { message: "User account disabled", statusCode: 403 },
  "auth/invalid-email": { message: "Invalid email address", statusCode: 400 },
  "auth/email-already-in-use": { message: "Email already registered", statusCode: 409 },
  "auth/weak-password": { message: "Password is too weak", statusCode: 400 },
  "auth/operation-not-allowed": { message: "Operation not allowed", statusCode: 403 },
  "auth/too-many-requests": { message: "Too many attempts, try again later", statusCode: 429 },

  // Firestore errors
  "permission-denied": { message: "Access denied", statusCode: 403 },
  "not-found": { message: "Document not found", statusCode: 404 },
  "already-exists": { message: "Document already exists", statusCode: 409 },
  "invalid-argument": { message: "Invalid argument", statusCode: 400 },
  "unavailable": { message: "Service temporarily unavailable", statusCode: 503 },
  "internal": { message: "Internal server error", statusCode: 500 },
  "unauthenticated": { message: "Authentication required", statusCode: 401 },

  // Storage errors
  "storage/object-not-found": { message: "File not found", statusCode: 404 },
  "storage/bucket-not-found": { message: "Storage bucket not found", statusCode: 404 },
  "storage/project-not-found": { message: "Project not found", statusCode: 404 },
  "storage/quota-exceeded": { message: "Storage quota exceeded", statusCode: 429 },
  "storage/unauthenticated": { message: "Authentication required", statusCode: 401 },
  "storage/unauthorized": { message: "Access denied", statusCode: 403 },
};

export function handleFirebaseError(error: unknown): FirebaseServiceError {
  if (error instanceof FirebaseError) {
    const errorInfo = FIREBASE_ERROR_MAP[error.code] || {
      message: error.message,
      statusCode: 500,
    };

    logger.warn("firebase", `Firebase error: ${error.code}`, {
      code: error.code,
      message: error.message,
    });

    return new FirebaseServiceError(
      error.code,
      errorInfo.message,
      errorInfo.statusCode,
      error
    );
  }

  if (error instanceof Error) {
    logger.error("firebase", "Unknown Firebase error", error);
    return new FirebaseServiceError(
      "unknown",
      "An error occurred with Firebase service",
      500,
      error
    );
  }

  logger.error("firebase", "Unknown error", new Error(String(error)));
  return new FirebaseServiceError(
    "unknown",
    "An unexpected error occurred",
    500
  );
}

export function isAuthError(error: unknown): error is FirebaseError {
  return error instanceof FirebaseError && error.code?.startsWith("auth/");
}

export function isFirestoreError(error: unknown): error is FirebaseError {
  return (
    error instanceof FirebaseError &&
    ["permission-denied", "not-found", "already-exists", "invalid-argument", "unavailable", "internal", "unauthenticated"].includes(
      error.code
    )
  );
}

export function isRecoverableError(error: unknown): boolean {
  if (!(error instanceof FirebaseError)) return false;

  const recoverableCodes = [
    "auth/too-many-requests",
    "storage/quota-exceeded",
    "unavailable",
    "internal",
  ];

  return recoverableCodes.includes(error.code);
}
