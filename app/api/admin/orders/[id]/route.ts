import { requireAdmin } from "@/lib/auth/admin-auth";
import { getOrderById, updateOrderStatus, deleteOrder, cancelOrder } from "@/lib/services/order-service";
import { ok, fail, unauthorized } from "@/lib/api/response";
import type { OrderStatus } from "@/types";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(request)) return unauthorized();
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) return fail("Order not found", 404);
  return ok(order);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(request)) return unauthorized();
  const { id } = await params;
  const { status } = await request.json() as { status: OrderStatus };

  if (status === "cancelled") {
    const order = cancelOrder(id);
    if (!order) return fail("Order not found", 404);
    return ok(order);
  }

  const order = updateOrderStatus(id, status);
  if (!order) return fail("Order not found", 404);
  return ok(order);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(request)) return unauthorized();
  const { id } = await params;
  if (!deleteOrder(id)) return fail("Order not found", 404);
  return ok({ deleted: true });
}
