import type { Metadata } from "next";
import Image from "next/image";
import { getBrandStats, getTeamMembers } from "@/lib/services/content-service";
import { ensureStoreReady } from "@/lib/db/store";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ScrollAnimation, StaggerContainer, StaggerItem } from "@/components/shared/scroll-animation";
import { generateMetadata as genMeta } from "@/lib/seo";

export const metadata: Metadata = genMeta({
  title: "About Us",
  description: "Learn about PakTech — Pakistan's premium tech accessories brand. Our mission, vision, and team.",
  url: "https://paktech.pk/about",
});

export default async function AboutPage() {
  await ensureStoreReady();
  const brandStats = getBrandStats();
  const teamMembers = getTeamMembers();

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container-custom">
          <Breadcrumbs items={[{ label: "About" }]} className="mb-6 [&_*]:text-primary-foreground/70 [&_span:last-child]:text-white" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About PakTech</h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl">
            Pakistan&apos;s trusted destination for premium tech accessories since 2020.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-custom grid lg:grid-cols-2 gap-12 items-center">
          <ScrollAnimation>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                PakTech started in 2020 in Lahore with a simple idea: make premium tech accessories accessible and trustworthy across Pakistan.
              </p>
              <p>
                We noticed how hard it was to find genuine products locally, and how much trust was missing in online shopping. So we built PakTech — where every product is 100% original, delivery is reliable, and customer service is exceptional.
              </p>
              <p>
                Today we&apos;ve served 50,000+ happy customers and deliver to 150+ cities. Our mission remains the same: provide Pakistan with the best tech accessories.
              </p>
            </div>
          </ScrollAnimation>
          <ScrollAnimation>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop"
                alt="PakTech team"
                fill
                className="object-cover"
              />
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container-custom grid md:grid-cols-2 gap-8">
          <ScrollAnimation className="rounded-xl border bg-card p-8">
            <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To provide every Pakistani with premium, original tech accessories — at affordable prices, with reliable delivery and exceptional customer service.
            </p>
          </ScrollAnimation>
          <ScrollAnimation className="rounded-xl border bg-card p-8">
            <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To become Pakistan&apos;s #1 trusted tech accessories brand — where quality, authenticity, and customer satisfaction come first.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-custom">
          <ScrollAnimation className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">PakTech by Numbers</h2>
          </ScrollAnimation>
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {brandStats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center rounded-xl border p-6">
                  <p className="text-3xl md:text-4xl font-bold text-accent">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="container-custom">
          <ScrollAnimation className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Meet Our Team</h2>
            <p className="text-muted-foreground">The people behind PakTech</p>
          </ScrollAnimation>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <StaggerItem key={member.id}>
                <div className="rounded-xl border bg-card overflow-hidden text-center">
                  <div className="relative aspect-square">
                    <Image src={member.image} alt={member.name} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-accent">{member.role}</p>
                    <p className="text-xs text-muted-foreground mt-2">{member.bio}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
