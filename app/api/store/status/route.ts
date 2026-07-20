import { NextResponse } from "next/server";
import { isFirestoreEnabled } from "@/lib/db/store";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      firestore: isFirestoreEnabled(),
      storage: isFirestoreEnabled() ? "firestore" : "file",
    },
  });
}
