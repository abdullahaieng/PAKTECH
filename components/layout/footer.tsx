import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { SITE_CONFIG, MEGA_MENU_CATEGORIES } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0118] via-[#1e1060] to-[#0c2340]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(99,102,241,0.3),transparent_60%)]" />

      <div className="container-custom relative py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-4">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg font-bold text-sm shadow-lg glow-sm">
                PT
              </div>
              <span className="text-xl font-bold gradient-text">PakTech</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Pakistan&apos;s premium destination for tech accessories. Original products, nationwide delivery, and Cash on Delivery.
            </p>
            <div className="flex gap-3 mt-5">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href={Object.values(SITE_CONFIG.social)[i]}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 hover:scale-110 transition-all duration-300 border border-white/10"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-cyan-300">Quick Links</h3>
            <ul className="space-y-2.5 text-sm text-white/60">
              {[
                { label: "Home", href: "/" },
                { label: "Shop All", href: "/shop" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "My Account", href: "/account" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-violet-300">Categories</h3>
            <ul className="space-y-2.5 text-sm text-white/60">
              {MEGA_MENU_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.href}>
                  <Link href={cat.href} className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-indigo-300">Contact Us</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-cyan-400" />
                {SITE_CONFIG.address}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-cyan-400" />
                <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-white transition-colors">{SITE_CONFIG.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-cyan-400" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-white transition-colors">{SITE_CONFIG.email}</a>
              </li>
            </ul>

            <div className="mt-5">
              <p className="text-sm font-medium mb-2 text-white/80">Newsletter</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl focus:border-cyan-400"
                />
                <Button variant="accent" size="sm" className="rounded-xl shrink-0">Join</Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} PakTech. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Return Policy"].map((item) => (
              <Link key={item} href="#" className="hover:text-white transition-colors">{item}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
