import type { ContactMessage, FAQ, Testimonial } from "@/types";
import { getDatabase, updateDatabase } from "@/lib/db/store";

export function getFaqs() {
  return getDatabase().faqs;
}

export function getTestimonials() {
  return getDatabase().testimonials;
}

export function getTeamMembers() {
  return getDatabase().teamMembers;
}

export function getBrandStats() {
  return getDatabase().brandStats;
}

export function getContactMessages() {
  return getDatabase().contactMessages.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createContactMessage(data: Omit<ContactMessage, "id" | "createdAt" | "read">) {
  const message: ContactMessage = {
    ...data,
    id: `msg-${Date.now()}`,
    createdAt: new Date().toISOString(),
    read: false,
  };
  updateDatabase((db) => {
    db.contactMessages.unshift(message);
  });
  return message;
}

export function updateFaq(id: string, data: Partial<FAQ>): FAQ | null {
  let updated: FAQ | null = null;
  updateDatabase((db) => {
    const index = db.faqs.findIndex((f) => f.id === id);
    if (index === -1) return;
    db.faqs[index] = { ...db.faqs[index], ...data, id };
    updated = db.faqs[index];
  });
  return updated;
}

export function createFaq(data: Omit<FAQ, "id">): FAQ {
  const faq: FAQ = { ...data, id: `faq-${Date.now()}` };
  updateDatabase((db) => {
    db.faqs.push(faq);
  });
  return faq;
}

export function deleteFaq(id: string): boolean {
  let deleted = false;
  updateDatabase((db) => {
    const before = db.faqs.length;
    db.faqs = db.faqs.filter((f) => f.id !== id);
    deleted = db.faqs.length < before;
  });
  return deleted;
}

export function updateTestimonial(id: string, data: Partial<Testimonial>): Testimonial | null {
  let updated: Testimonial | null = null;
  updateDatabase((db) => {
    const index = db.testimonials.findIndex((t) => t.id === id);
    if (index === -1) return;
    db.testimonials[index] = { ...db.testimonials[index], ...data, id };
    updated = db.testimonials[index];
  });
  return updated;
}

export function getSettings() {
  return getDatabase().settings;
}

export function updateSettings(data: Partial<ReturnType<typeof getSettings>>) {
  updateDatabase((db) => {
    db.settings = { ...db.settings, ...data };
  });
  return getSettings();
}
