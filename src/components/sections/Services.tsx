import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ServiceCard } from "@/components/sections/services/ServiceCard";
import { services } from "@/lib/data";

export function Services() {
  return (
    <section id="services" className="bg-bg px-6 py-24 md:px-0">
      <div className="mx-auto w-full max-w-[1760px] md:w-4/5">
        <FadeIn>
          <SectionLabel>What I do</SectionLabel>
          <SectionHeading>Services</SectionHeading>
        </FadeIn>

        {/* Hover motifs float wider than their card by design; narrow cards make
            them bleed into neighbours. Keep 5 columns for full-screen widths, then
            step down to 3/2/1 through the mid-range where the overflow would collide. */}
        <div className="mt-12 grid grid-cols-1 gap-4 min-[640px]:grid-cols-2 min-[1024px]:grid-cols-3 min-[1024px]:gap-5 min-[1440px]:grid-cols-5">
          {services.map((service, i) => (
            <FadeIn key={service.title} delay={(i % 5) * 0.06}>
              <ServiceCard service={service} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
