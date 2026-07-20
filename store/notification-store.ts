"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppNotification, NotificationType } from "@/types";
import { DEFAULT_NOTIFICATIONS } from "@/data/notification-seeds";

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface AddNotificationInput {
  title: string;
  message: string;
  type?: NotificationType;
  href?: string;
}

interface NotificationStore {
  items: AppNotification[];
  seeded: boolean;
  add: (input: AddNotificationInput) => AppNotification;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  remove: (id: string) => void;
  clearAll: () => void;
  getUnreadCount: () => number;
  seedDefaults: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      items: [],
      seeded: false,

      add: (input) => {
        const notification: AppNotification = {
          id: createId(),
          title: input.title,
          message: input.message,
          type: input.type ?? "info",
          href: input.href,
          read: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          items: [notification, ...state.items].slice(0, 50),
        }));
        return notification;
      },

      markAsRead: (id) => {
        set((state) => ({
          items: state.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          items: state.items.map((n) => ({ ...n, read: true })),
        }));
      },

      remove: (id) => {
        set((state) => ({
          items: state.items.filter((n) => n.id !== id),
        }));
      },

      clearAll: () => set({ items: [] }),

      getUnreadCount: () => get().items.filter((n) => !n.read).length,

      seedDefaults: () => {
        if (get().seeded || get().items.length > 0) return;
        const now = Date.now();
        const seededItems: AppNotification[] = DEFAULT_NOTIFICATIONS.map((n, i) => ({
          ...n,
          id: `seed-${i}`,
          read: i > 1,
          createdAt: new Date(now - (DEFAULT_NOTIFICATIONS.length - i) * 3600000).toISOString(),
        }));
        set({ items: seededItems, seeded: true });
      },
    }),
    {
      name: "paktech-notifications",
      skipHydration: true,
      partialize: (state) => ({ items: state.items, seeded: state.seeded }),
    }
  )
);
