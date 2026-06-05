import { requireAdmin } from "@/lib/auth/admin-auth";
import { getFaqs, getTestimonials, getContactMessages, getSettings } from "@/lib/services/content-service";
import { ok, unauthorized } from "@/lib/api/response";

export async function GET(request: Request) {
  if (!requireAdmin(request)) return unauthorized();
  return ok({
    faqs: getFaqs(),
    testimonials: getTestimonials(),
    contactMessages: getContactMessages(),
    settings: getSettings(),
  });
}
