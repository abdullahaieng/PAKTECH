"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import type { NotificationType } from "@/types";
import { useNotificationStore } from "@/store/notification-store";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
  href?: string;
}

export interface ToastOptions {
  title?: string;
  persist?: boolean;
  href?: string;
}

export interface NotifyInput {
  title: string;
  message: string;
  type?: NotificationType;
  href?: string;
}

interface NotificationContextValue {
  toast: (message: string, type?: ToastType, options?: ToastOptions) => void;
  notify: (input: NotifyInput) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useToast() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useToast must be used within NotificationProvider");
  return ctx;
}

export function useNotify() {
  return useToast();
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const toastStyles: Record<ToastType, string> = {
  success: "border-cyan-500/30 bg-cyan-500/5",
  error: "border-red-500/30 bg-red-500/5",
  info: "border-primary/30 bg-primary/5",
  warning: "border-amber-500/30 bg-amber-500/5",
};

const toastIconStyles: Record<ToastType, string> = {
  success: "text-cyan-500",
  error: "text-red-500",
  info: "text-primary",
  warning: "text-amber-500",
};

const defaultTitles: Record<ToastType, string> = {
  success: "Success",
  error: "Error",
  info: "Info",
  warning: "Warning",
};

const TOAST_DURATION = 4500;
const MAX_TOASTS = 4;

function ToastCard({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const Icon = toastIcons[toast.type];
  const content = (
    <>
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          toast.type === "success" && "bg-cyan-500/15",
          toast.type === "error" && "bg-red-500/15",
          toast.type === "info" && "bg-primary/15",
          toast.type === "warning" && "bg-amber-500/15"
        )}
      >
        <Icon className={cn("h-5 w-5", toastIconStyles[toast.type])} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight">{toast.title ?? defaultTitles[toast.type]}</p>
        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
        className="shrink-0 rounded-lg p-1 opacity-60 hover:opacity-100 hover:bg-muted transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </>
  );

  const className = cn(
    "flex items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-xl backdrop-blur-xl bg-background/95 min-w-[300px] max-w-[400px] pointer-events-auto",
    toastStyles[toast.type]
  );

  if (toast.href) {
    return (
      <Link href={toast.href} onClick={onClose} className={cn(className, "hover:border-primary/40 transition-colors")}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const addNotification = useNotificationStore((s) => s.add);

  const removeToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "success", options?: ToastOptions) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const title = options?.title ?? defaultTitles[type];

      setToasts((prev) => [{ id, title, message, type, href: options?.href }, ...prev].slice(0, MAX_TOASTS));

      if (options?.persist) {
        addNotification({
          title,
          message,
          type: type === "warning" ? "info" : type,
          href: options.href,
        });
      }

      const timer = setTimeout(() => removeToast(id), TOAST_DURATION);
      timersRef.current.set(id, timer);
    },
    [addNotification, removeToast]
  );

  const notify = useCallback(
    (input: NotifyInput) => {
      const toastType: ToastType =
        input.type === "error"
          ? "error"
          : input.type === "warning"
            ? "warning"
            : input.type === "success" || input.type === "order"
              ? "success"
              : "info";

      toast(input.message, toastType, {
        title: input.title,
        persist: true,
        href: input.href,
      });
    },
    [toast]
  );

  return (
    <NotificationContext.Provider value={{ toast, notify }}>
      {children}
      <div
        className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none sm:top-24"
        aria-live="polite"
        aria-label="Notifications"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <ToastCard toast={t} onClose={() => removeToast(t.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}
