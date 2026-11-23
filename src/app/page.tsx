import { Nav } from "@/components/layout/Nav";
import { Marquee } from "@/components/layout/Marquee";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ShowreelExperience } from "@/components/sections/ShowreelExperience";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaCard } from "@/components/sections/CtaCard";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <ShowreelExperience />
        <CaseStudies />
        <Services />
        <About />
        <Testimonials />
        <CtaCard />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
