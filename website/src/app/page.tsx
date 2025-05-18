import FAQ from "./faq";
import FeatureTabs from "./feature-tabs";
import FeaturesGrid from "./features-grid";
import FeaturesSection from "./features";
import Hero from "./hero";
import Pricing from "./pricing";
import { Testimonials } from "./testimonials";

export default function Home() {
  return (
    <main>
      <Hero />

      <FeaturesGrid />

      <Testimonials />

      <FeatureTabs />

      <FeaturesSection />

      <Pricing />

      <FAQ />
    </main>
  );
}
