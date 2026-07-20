import { getOrderById } from "@/lib/services/order-service";
import { ok, fail } from "@/lib/api/response";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) return fail("Order not found", 404);
  return ok(order);
}
