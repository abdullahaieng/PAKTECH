import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-custom py-24 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        This page doesn&apos;t exist. The URL may be incorrect or the page may have moved.
      </p>
      <Button asChild variant="accent" size="lg">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
