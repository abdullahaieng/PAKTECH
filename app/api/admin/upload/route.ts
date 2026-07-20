import { requireAdmin } from "@/lib/auth/admin-auth";
import { ok, unauthorized, fail } from "@/lib/api/response";
import { retry, withTimeout } from "@/lib/utils/retry";
import { AppError } from "@/lib/errors/app-error";
import { uploadToCloudinary, CloudinaryServiceError, isCloudinaryRecoverable } from "@/lib/cloudinary/service";
import { logger } from "@/lib/logger";

const UPLOAD_TIMEOUT = 30000; // 30 seconds
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    if (!requireAdmin(request)) return unauthorized();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return fail("No file provided", 400);
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      logger.warn("upload", "File too large", { size: file.size });
      return fail("File too large (max 5MB)", 413);
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      logger.warn("upload", "Invalid file type", { type: file.type });
      return fail("Only image files allowed", 400);
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;

    logger.info("upload", "Starting file upload", {
      fileName: file.name,
      size: file.size,
      type: file.type,
    });

    // Upload with retry and timeout
    const result = await retry(
      async () => {
        try {
          return await withTimeout(
            uploadToCloudinary(dataURI),
            UPLOAD_TIMEOUT,
            new Error("Upload timeout - taking too long")
          );
        } catch (error) {
          if (error instanceof CloudinaryServiceError) {
            throw error;
          }
          throw error;
        }
      },
      {
        maxAttempts: 3,
        delayMs: 2000,
        shouldRetry: (error) => {
          // Retry on recoverable errors
          if (error instanceof CloudinaryServiceError) {
            return isCloudinaryRecoverable(error);
          }
          // Retry on timeout and network errors
          return (
            error.message.includes("timeout") ||
            error.message.includes("network") ||
            error.message.includes("ECONNREFUSED")
          );
        },
        onRetry: (attempt) => {
          logger.warn("upload", `Upload retry attempt ${attempt}`);
        },
      }
    );

    logger.info("upload", "File uploaded successfully", {
      public_id: result.public_id,
      url: result.secure_url,
    });

    return ok({ url: result.secure_url });
  } catch (error) {
    if (error instanceof CloudinaryServiceError) {
      logger.error("upload", "Cloudinary service error", error, {
        code: error.code,
        recoverable: isCloudinaryRecoverable(error),
      });
      const message = error.details?.recoverable
        ? `Upload failed: ${error.message}. Please try again.`
        : `Upload failed: ${error.message}`;
      return fail(message, error.statusCode);
    }

    if (error instanceof AppError) {
      logger.error("upload", "Application error", error);
      return fail(error.message, error.statusCode);
    }

    if (error instanceof Error) {
      logger.error("upload", "Unexpected error", error);
      if (error.message.includes("timeout")) {
        return fail("Upload timeout - please try again", 408);
      }
      if (error.message.includes("network")) {
        return fail("Network error - please check your connection", 503);
      }
      return fail(error.message, 500);
    }

    logger.error("upload", "Unknown error", new Error(String(error)));
    return fail("Upload failed", 500);
  }
}
