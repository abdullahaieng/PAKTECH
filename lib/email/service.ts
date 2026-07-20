import nodemailer from "nodemailer";
import { logger } from "@/lib/logger";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;
  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    return transporter;
  }
  return null;
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function sendWithRetry(sendFn: () => Promise<unknown>, attempts = 3) {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await sendFn();
    } catch (err: unknown) {
      lastErr = err;
      const backoff = Math.pow(2, i) * 250;
      // swallows transient errors and retries
      await sleep(backoff);
    }
  }
  throw lastErr;
}

export async function sendPasswordReset(to: string, resetUrl: string) {
  const t = getTransporter();
  const from = process.env.EMAIL_FROM ?? `noreply@${process.env.NEXT_PUBLIC_APP_DOMAIN ?? "localhost"}`;
  const subject = "Password reset request";
  const text = `Click the link to reset your password: ${resetUrl}`;
  const html = `<p>Click the link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`;

  if (!t) {
    logger.info("email", "SMTP not configured; printing reset URL to logs", { to, resetUrl });
    return { success: true, info: "dev-mode" };
  }

  try {
    const info = (await sendWithRetry(() => t.sendMail({ from, to, subject, text, html }))) as { messageId?: string } | undefined;
    logger.info("email", "Password reset sent", { to, messageId: info?.messageId });
    return { success: true, info };
  } catch (err) {
    logger.error("email", "Failed to send password reset", err as Error, { to });
    return { success: false, error: (err as Error).message };
  }
}

export async function sendOrderConfirmation(to: string, orderId: string, htmlBody: string) {
  const t = getTransporter();
  const from = process.env.EMAIL_FROM ?? `noreply@${process.env.NEXT_PUBLIC_APP_DOMAIN ?? "localhost"}`;
  const subject = `Order confirmation #${orderId}`;

  if (!t) {
    logger.info("email", "SMTP not configured; printing order confirmation to logs", { to, orderId });
    return { success: true, info: "dev-mode" };
  }

  try {
    const info = (await sendWithRetry(() => t.sendMail({ from, to, subject, html: htmlBody }))) as { messageId?: string } | undefined;
    logger.info("email", "Order confirmation sent", { to, orderId, messageId: info?.messageId });
    return { success: true, info };
  } catch (err) {
    logger.error("email", "Failed to send order confirmation", err as Error, { to, orderId });
    return { success: false, error: (err as Error).message };
  }
}
