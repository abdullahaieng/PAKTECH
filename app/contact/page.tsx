"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollAnimation } from "@/components/shared/scroll-animation";
import { useToast } from "@/components/providers/notification-provider";
import { SITE_CONFIG } from "@/lib/constants";

const contactSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(11, "Valid phone required"),
  subject: z.string().min(3, "Subject required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactForm) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) {
        toast(json.error ?? "Failed to send", "error");
        return;
      }
      toast("Message sent! Hum jald respond karenge.", "success");
      reset();
    } catch {
      toast("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container-custom">
          <Breadcrumbs items={[{ label: "Contact" }]} className="mb-6 [&_*]:text-primary-foreground/70 [&_span:last-child]:text-white" />
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-primary-foreground/70">Get in touch — we&apos;re here to help!</p>
        </div>
      </section>

      <div className="container-custom py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <ScrollAnimation>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...register("name")} className="mt-1" />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} className="mt-1" />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} className="mt-1" />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" {...register("subject")} className="mt-1" />
                {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject.message}</p>}
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  {...register("message")}
                  rows={5}
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
              </div>
              <Button type="submit" variant="accent" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </ScrollAnimation>

          <ScrollAnimation>
            <div className="space-y-6">
              <div className="rounded-xl border p-6 space-y-4">
                <h3 className="font-semibold text-lg">Contact Information</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">{SITE_CONFIG.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-accent shrink-0" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href={`tel:${SITE_CONFIG.phone}`} className="text-sm text-muted-foreground hover:text-accent">{SITE_CONFIG.phone}</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-accent shrink-0" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href={`mailto:${SITE_CONFIG.email}`} className="text-sm text-muted-foreground hover:text-accent">{SITE_CONFIG.email}</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-accent shrink-0" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-sm text-muted-foreground">Mon - Sat: 10AM - 8PM</p>
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent("Assalam o Alaikum! I have a question.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-4 text-white font-medium hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
              </a>

              <div className="rounded-xl border overflow-hidden">
                <div className="bg-secondary h-64 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Google Maps</p>
                    <p className="text-xs">Gulberg III, Lahore, Pakistan</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </div>
  );
}
