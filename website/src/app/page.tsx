import FAQ from "./faq";
import FeatureTabs from "./feature-tabs";
import FeaturesGrid from "./features-grid";
import FeaturesSection from "./features";
import Hero from "./hero";
import Link from "next/link";
import Pricing from "./pricing";
import { Server } from "lucide-react";
import { Testimonials } from "./testimonials";
import VeloMeet from "./velomeet";

export default function Home() {
  return (
    <main>
      <Hero />

      <FeaturesGrid />

      <Testimonials />

      <FeatureTabs />

      <FeaturesSection />

      <VeloMeet />

      <Pricing />

      <div className="container mx-auto p-4 md:p-6">
        <div className="bg-primary-900/10 text-white rounded-2xl p-4 md:p-6 flex items-center gap-4 shadow-md container mx-auto mt-8">
          <Server className="w-20 h-20 text-primary shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <h2 className="text-xl font-bold">
              Take full control with Revline Self-Hosted
            </h2>
            <p className="text-sm text-gray-300 mt-1 max-w-prose">
              Run your own Revline 1 server and keep 100% ownership of your
              data. Self-hosting gives you complete control over privacy,
              customization, and uptime—perfect for DIY mechanics and
              enthusiasts who want more.
            </p>
            <Link
              href="/selfhosted"
              className="font-semibold text-primary hover:underline mt-1 inline-block"
            >
              Learn more &rarr;
            </Link>
          </div>
        </div>
      </div>

      <FAQ />
    </main>
  );
}
