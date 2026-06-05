"use client";

import { ThemeProvider } from "next-themes";
import { NotificationProvider } from "@/components/providers/notification-provider";
import { RehydrateStores } from "@/components/providers/rehydrate-stores";
import { AuthProvider } from "@/components/providers/auth-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <RehydrateStores />
      <AuthProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
