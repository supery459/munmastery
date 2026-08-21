import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { FirstConferenceMode } from "@/components/first-conference-mode";
import { InteractivePreview } from "@/components/interactive-preview";
import { Features } from "@/components/features";
import { Testimonials } from "@/components/testimonials";
import { Faq } from "@/components/faq";
import { CtaBanner } from "@/components/cta-banner";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FirstConferenceMode />
        <InteractivePreview />
        <Features />
        <Testimonials />
        <Faq />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
