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

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
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
