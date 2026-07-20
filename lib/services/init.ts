import { initializeCloudinary } from "@/lib/cloudinary/service";
import { initializeFirebase } from "@/lib/firebase/init";
import { logger } from "@/lib/logger";
import { validateRequiredEnvs } from "@/lib/env/validate";

/**
 * Initialize all external services
 * This should be called once at app startup
 */
export async function initializeServices(): Promise<{
  firebase: boolean;
  cloudinary: boolean;
  database: boolean;
}> {
  const status = {
    firebase: false,
    cloudinary: false,
    database: true, // Database is file-based, always available
  };

  try {
    // Validate required environment variables before initializing services
    try {
      validateRequiredEnvs();
    } catch (err) {
      logger.error("init", "Environment validation failed", err as Error);
      // In production we want this to surface; rethrow to stop startup
      if (process.env.NODE_ENV === "production") throw err;
    }
    // Initialize Firebase
    try {
      initializeFirebase();
      status.firebase = true;
      logger.info("init", "Firebase initialized");
    } catch (error) {
      logger.warn("init", "Firebase initialization failed", {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Initialize Cloudinary
    try {
      initializeCloudinary();
      status.cloudinary = true;
      logger.info("init", "Cloudinary initialized");
    } catch (error) {
      logger.warn("init", "Cloudinary initialization failed", {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Log initialization summary
    logger.info("init", "Services initialized", status);
  } catch (error) {
    logger.error("init", "Service initialization error", error as Error);
  }

  return status;
}

// Initialize on module load (for server-side)
if (typeof window === "undefined") {
  initializeServices().catch((error) => {
    logger.error("init", "Failed to initialize services on startup", error);
  });
}
