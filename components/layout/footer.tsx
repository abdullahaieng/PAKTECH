import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { SITE_CONFIG, MEGA_MENU_CATEGORIES } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export function Footer() {
  return (
    <footer className="relative border-t border-zinc-900 bg-[#08080a] text-zinc-400">
      {/* Top subtle border glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
 
      <div className="container-custom relative py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Logo & Brand description */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 shadow-lg ring-1 ring-white/10">
              <Logo className="h-8 w-8" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">PakTech</span>
          </div>
            <p className="text-sm leading-relaxed text-zinc-500 max-w-sm">
              Pakistan&apos;s premier destination for high-end tech accessories. Original products, nationwide delivery, and trusted support.
            </p>
            <div className="flex gap-2.5 pt-2">
              {[
                { Icon: Facebook, href: SITE_CONFIG.social.facebook, label: "Facebook" },
                { Icon: Instagram, href: SITE_CONFIG.social.instagram, label: "Instagram" },
                { Icon: Twitter, href: SITE_CONFIG.social.twitter, label: "Twitter" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800/80 hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>
 
          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-200 mb-5">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "Shop All", href: "/shop" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "My Account", href: "/account" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300 text-zinc-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
 
          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-200 mb-5">Categories</h3>
            <ul className="space-y-3 text-sm">
              {MEGA_MENU_CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.href}>
                  <Link href={cat.href} className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300 text-zinc-400">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
 
          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-200 mb-5">Contact Us</h3>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-zinc-400" />
                  <span className="leading-relaxed text-zinc-400">{SITE_CONFIG.address}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-zinc-400" />
                  <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-white transition-colors text-zinc-400">{SITE_CONFIG.phone}</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-zinc-400" />
                  <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-white transition-colors text-zinc-400">{SITE_CONFIG.email}</a>
                </li>
              </ul>
            </div>
 
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-200 mb-3">Newsletter</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Your email address"
                  className="bg-zinc-900/60 border-zinc-800/80 text-white placeholder:text-zinc-600 rounded-xl focus:border-zinc-700 focus:bg-zinc-900 transition-all duration-300 h-10 text-sm"
                />
                <Button variant="accent" size="sm" className="rounded-xl shrink-0 h-10 px-4">Join</Button>
              </div>
            </div>
          </div>
        </div>
 
        <Separator className="bg-zinc-900/80 my-12" />
 
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <p>&copy; {new Date().getFullYear()} PakTech. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Return Policy"].map((item) => (
              <Link key={item} href="#" className="hover:text-zinc-400 transition-colors">{item}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
