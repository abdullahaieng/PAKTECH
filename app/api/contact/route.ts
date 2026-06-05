import { createContactMessage } from "@/lib/services/content-service";
import { ok, fail } from "@/lib/api/response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;
    if (!name || !email || !message) return fail("Required fields missing");
    const msg = createContactMessage({ name, email, phone: phone ?? "", subject: subject ?? "General", message });
    return ok(msg, 201);
  } catch {
    return fail("Invalid request body");
  }
}
