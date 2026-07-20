import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth-guard";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "PakTech Admin",
  description: "PakTech store management dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
