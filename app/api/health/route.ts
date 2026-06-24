import { ensureDatabaseIntegrity } from "@/lib/db/backup";
import { ok, fail } from "@/lib/api/response";
import { isFirebaseConfigured } from "@/lib/firebase/init";
import { isCloudinaryConfigured } from "@/lib/cloudinary/service";

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  database: {
    status: "ok" | "error";
    message?: string;
  };
  firebase: {
    status: "ok" | "not-configured";
    message?: string;
  };
  cloudinary: {
    status: "ok" | "not-configured";
    message?: string;
  };
  uptime: number;
}

const startTime = Date.now();

export async function GET(): Promise<Response> {
  try {
    const health: HealthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: { status: "ok" },
      firebase: { status: "ok" },
      cloudinary: { status: "ok" },
      uptime: Date.now() - startTime,
    };

    // Check database
    try {
      const isHealthy = await ensureDatabaseIntegrity();
      if (!isHealthy) {
        health.status = "degraded";
        health.database = {
          status: "error",
          message: "Database integrity check failed",
        };
      }
    } catch (error) {
      health.status = "degraded";
      health.database = {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }

    // Check Firebase
    if (!isFirebaseConfigured()) {
      health.firebase = {
        status: "not-configured",
        message: "Firebase credentials missing",
      };
      health.status = "degraded";
    }

    // Check Cloudinary
    if (!isCloudinaryConfigured()) {
      health.cloudinary = {
        status: "not-configured",
        message: "Cloudinary credentials missing",
      };
      health.status = "degraded";
    }

    const statusCode = health.status === "unhealthy" ? 503 : 200;
    return ok(health, statusCode);
  } catch (error) {
    console.error("[health] check failed:", error);
    return fail("Health check failed", 503);
  }
}
