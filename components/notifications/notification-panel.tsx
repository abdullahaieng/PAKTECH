"use client";

import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Trash2,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Package,
  Sparkles,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/ui-store";
import { useNotificationStore } from "@/store/notification-store";
import { useStoresHydrated } from "@/hooks/use-stores-hydrated";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/types";

const typeIcons: Record<NotificationType, typeof Info> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
  order: Package,
  promo: Sparkles,
};

const typeStyles: Record<NotificationType, string> = {
  success: "text-cyan-500 bg-cyan-500/10",
  error: "text-red-500 bg-red-500/10",
  info: "text-primary bg-primary/10",
  warning: "text-amber-500 bg-amber-500/10",
  order: "text-cyan-500 bg-cyan-500/10",
  promo: "text-violet-500 bg-violet-500/10",
};

export function NotificationPanel() {
  const isOpen = useUIStore((s) => s.isNotificationsOpen);
  const closeNotifications = useUIStore((s) => s.closeNotifications);
  const storesHydrated = useStoresHydrated();
  const items = useNotificationStore((s) => s.items);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const remove = useNotificationStore((s) => s.remove);
  const clearAll = useNotificationStore((s) => s.clearAll);

  const unreadCount = storesHydrated ? items.filter((n) => !n.read).length : 0;

  const handleOpenChange = (open: boolean) => {
    if (!open) closeNotifications();
  };

  const handleItemClick = (id: string) => {
    markAsRead(id);
    closeNotifications();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
            {unreadCount > 0 && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length > 0 && (
          <div className="flex gap-2 py-3 border-b">
            <Button variant="outline" size="sm" className="flex-1" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
            <Button variant="outline" size="sm" onClick={clearAll}>
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto -mx-6 px-6 py-2">
          {!storesHydrated ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <Bell className="h-10 w-10 mb-3 opacity-30 animate-pulse" />
              <p className="text-sm">Loading notifications...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <Bell className="h-10 w-10 mb-3 opacity-30" />
              <p className="font-medium">No notifications</p>
              <p className="text-sm mt-1">Orders and offers will appear here</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {items.map((notification) => {
                const Icon = typeIcons[notification.type];
                const content = (
                  <div
                    className={cn(
                      "flex gap-3 rounded-xl border p-3 transition-colors",
                      notification.read
                        ? "border-border/50 bg-muted/30 opacity-70"
                        : "border-primary/20 bg-primary/5"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        typeStyles[notification.type]
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold leading-tight">{notification.title}</p>
                        {!notification.read && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-accent mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-[11px] text-muted-foreground/70 mt-1.5">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        remove(notification.id);
                      }}
                      className="shrink-0 rounded-lg p-1 opacity-40 hover:opacity-100 hover:bg-muted transition-colors"
                      aria-label="Remove notification"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );

                return (
                  <li key={notification.id}>
                    {notification.href ? (
                      <Link
                        href={notification.href}
                        onClick={() => handleItemClick(notification.id)}
                        className="block hover:opacity-90"
                      >
                        {content}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markAsRead(notification.id)}
                        className="w-full text-left"
                      >
                        {content}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
