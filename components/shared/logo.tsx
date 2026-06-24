import React from "react";
import { cn } from "@/lib/utils";
 
interface LogoProps extends React.ComponentProps<"svg"> {
  theme?: "default" | "light" | "dark";
}
 
export function Logo({ className, theme = "default", ...props }: LogoProps) {
  // We use currentColor for the navy elements so it can adapt to text colors (dark/light themes)
  // Or we can force light/dark via the theme prop.
  const navyColorClass = 
    theme === "light" 
      ? "text-[#0A1B33]" 
      : theme === "dark" 
        ? "text-white" 
        : "text-[#0A1B33] dark:text-white";
 
  const logoUrl = process.env.NEXT_PUBLIC_SITE_LOGO_URL ?? "/logo.svg";

  if (logoUrl) {
    const imgProps = props as unknown as React.ImgHTMLAttributes<HTMLImageElement>;
    return (
      // prefer an external/static logo when available
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logoUrl} alt="PakTech logo" className={cn(className)} {...imgProps} />
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className, navyColorClass)}
      {...props}
    >
      {/* Outer Navy Blue Loop & Stems of the "P" */}
      <path
        d="M48,10 H65 A25,25 0 0,1 90,35 A25,25 0 0,1 65,60 H60 V90 H71 V60 H65 A14,14 0 0,0 79,35 A14,14 0 0,0 65,21 H48 Z"
        fill="currentColor"
      />
      
      {/* Top Navy Stem Section */}
      <rect x="37" y="10" width="11" height="22" fill="currentColor" />
      
      {/* Bottom Navy Stem Section */}
      <rect x="37" y="72" width="11" height="18" fill="currentColor" />
      
      {/* Electric Blue Vertical Middle Stem segment */}
      <rect x="37" y="32" width="11" height="40" fill="#0066FF" />
      
      {/* Electric Blue Horizontal Fold (T bar) */}
      <path d="M37,32 H72 L61,43 H37 Z" fill="#0066FF" />
      
      {/* Royal Blue Under-Fold Shadow */}
      <path d="M37,43 H48 L37,54 Z" fill="#0044CC" />
    </svg>
  );
}
