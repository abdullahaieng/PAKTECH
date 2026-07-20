import { v2 as cloudinary } from "cloudinary";
import { CircuitBreaker } from "@/lib/utils/retry";
import { logger } from "@/lib/logger";

export class CloudinaryServiceError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "CloudinaryServiceError";
  }
}

const uploadCircuitBreaker = new CircuitBreaker(5, 60000);
let cloudinaryInitialized = false;

const CLOUDINARY_ERROR_MAP: Record<string, { message: string; statusCode: number; recoverable: boolean }> = {
  INVALID_SIGNED_REQUEST: { message: "Invalid request signature", statusCode: 400, recoverable: false },
  INVALID_PARAMS: { message: "Invalid parameters", statusCode: 400, recoverable: false },
  BAD_REQUEST: { message: "Bad request", statusCode: 400, recoverable: false },
  DUPLICATE: { message: "Resource already exists", statusCode: 409, recoverable: false },
  NOT_FOUND: { message: "Resource not found", statusCode: 404, recoverable: false },
  NOT_IMPLEMENTED: { message: "Operation not supported", statusCode: 501, recoverable: false },
  FORBIDDEN: { message: "Access denied", statusCode: 403, recoverable: false },
  UNAUTHORIZED: { message: "Authentication failed", statusCode: 401, recoverable: false },
  RATE_LIMITED: { message: "Rate limit exceeded", statusCode: 429, recoverable: true },
  TIMEOUT: { message: "Request timeout", statusCode: 408, recoverable: true },
  REQUEST_TIMEOUT: { message: "Request timeout", statusCode: 408, recoverable: true },
  SERVICE_UNAVAILABLE: { message: "Service unavailable", statusCode: 503, recoverable: true },
};

function validateCloudinaryConfig(): boolean {
  if (!cloudinaryInitialized) initializeCloudinary();

  const { cloud_name, api_key, api_secret } = cloudinary.config();

  if (!cloud_name || !api_key || !api_secret) {
    logger.warn(
      "cloudinary",
      "Cloudinary not fully configured",
      {
        cloud_name: !!cloud_name,
        api_key: !!api_key,
        api_secret: !!api_secret,
      }
    );
    return false;
  }

  return true;
}

export function initializeCloudinary(): void {
  try {
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    cloudinaryInitialized = true;

    const { cloud_name, api_key, api_secret } = cloudinary.config();
    if (cloud_name && api_key && api_secret) {
      logger.info("cloudinary", "Cloudinary initialized successfully");
    }
  } catch (error) {
    logger.error("cloudinary", "Failed to initialize Cloudinary", error as Error);
  }
}

export async function uploadToCloudinary(
  file: string,
  options?: Record<string, unknown>
) {
  try {
    if (!validateCloudinaryConfig()) {
      throw new CloudinaryServiceError(
        "NOT_CONFIGURED",
        "Cloudinary is not configured",
        503
      );
    }

    // Check circuit breaker
    if (uploadCircuitBreaker.getState() === "open") {
      throw new CloudinaryServiceError(
        "SERVICE_UNAVAILABLE",
        "Cloudinary service temporarily unavailable",
        503,
        { recoverable: true }
      );
    }

    const result = await uploadCircuitBreaker.execute(() =>
      cloudinary.uploader.upload(file, {
        folder: "paktech/products",
        resource_type: "auto",
        quality: "auto:good",
        fetch_format: "auto",
        timeout: 30000,
        ...options,
      })
    );

    if (!result.secure_url) {
      throw new CloudinaryServiceError(
        "INVALID_RESPONSE",
        "Upload succeeded but no URL returned",
        500
      );
    }

    logger.info("cloudinary", "File uploaded successfully", {
      public_id: result.public_id,
      size: result.bytes,
    });

    return result;
  } catch (error) {
    return handleCloudinaryError(error);
  }
}

export function handleCloudinaryError(error: unknown): never {
  if (error instanceof CloudinaryServiceError) {
    throw error;
  }

  if (error instanceof Error) {
    const message = error.message.toUpperCase();
    let errorCode = "UNKNOWN";
    let recoverable = false;

    for (const [key, value] of Object.entries(CLOUDINARY_ERROR_MAP)) {
      if (message.includes(key)) {
        errorCode = key;
        recoverable = value.recoverable;
        break;
      }
    }

    const errorInfo = CLOUDINARY_ERROR_MAP[errorCode] || {
      message: error.message,
      statusCode: 500,
      recoverable: false,
    };

    logger.error("cloudinary", `Cloudinary error: ${errorCode}`, error, {
      recoverable,
    });

    throw new CloudinaryServiceError(
      errorCode,
      errorInfo.message,
      errorInfo.statusCode,
      { recoverable }
    );
  }

  logger.error("cloudinary", "Unknown Cloudinary error", new Error(String(error)));
  throw new CloudinaryServiceError(
    "UNKNOWN",
    "An unexpected error occurred",
    500
  );
}

export function isCloudinaryRecoverable(error: unknown): boolean {
  if (error instanceof CloudinaryServiceError) {
    return error.details?.recoverable === true;
  }
  return false;
}

export function isCloudinaryConfigured(): boolean {
  return validateCloudinaryConfig();
}
