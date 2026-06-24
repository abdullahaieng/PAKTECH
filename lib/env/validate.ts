import { logger } from "@/lib/logger";

export function validateRequiredEnvs() {
  // Enforce admin secrets in production
  const isProd = process.env.NODE_ENV === "production";
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminSecret = process.env.ADMIN_SECRET;

  if (isProd) {
    const missing: string[] = [];
    if (!adminEmail) missing.push("ADMIN_EMAIL");
    if (!adminPassword) missing.push("ADMIN_PASSWORD");
    if (!adminSecret) missing.push("ADMIN_SECRET");
    if (missing.length > 0) {
      const msg = `Missing required env vars in production: ${missing.join(", ")}`;
      logger.error("env", msg);
      throw new Error(msg);
    }
  } else {
    if (!adminEmail || !adminPassword || !adminSecret) {
      logger.warn("env", "Admin credentials not fully configured — admin features disabled until set in environment");
    }
  }

  // Warn about SMTP not configured (optional)
  const smtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);
  if (!smtpConfigured) {
    logger.info("env", "SMTP not configured — email will operate in dev-mode (logged). Set SMTP_HOST/PORT/USER/PASS to enable real email delivery.");
  }

  // Recommend Redis for rate limiting if REDIS_URL missing in production
  if (isProd && !process.env.REDIS_URL) {
    logger.info("env", "No REDIS_URL detected — consider configuring Redis for distributed rate limiting in production.");
  }
}
