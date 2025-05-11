"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import { Button, Image } from "@heroui/react";

import NextImage from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background text-white min-h-[90vh] flex items-center justify-center px-4 sm:px-8">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
            🏁 Revline 1 — Built for DIY Mechanics & Car Enthusiasts
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-md">
            Track your builds. Show off your rides. Stay ahead in your garage
            with the all-in-one app for car lovers.
          </p>
          <div className="flex gap-4">
            <Button
              size="lg"
              as="a"
              href="https://revline.one/app"
              className="bg-white text-black hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              Go to App <ArrowRight className="w-4 h-4" />
            </Button>
            <a
              href="https://www.producthunt.com/posts/revline-1?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-revline&#0045;1"
              target="_blank"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=959506&theme=light&t=1746186614146"
                alt="Revline&#0032;1 - Track&#0032;your&#0032;build&#0044;&#0032;not&#0032;just&#0032;your&#0032;miles&#0046; | Product Hunt"
                style={{ width: 230, height: 48 }}
                width="230"
                height="48"
              />
            </a>
          </div>
        </div>

        {/* Image or App Screenshot */}
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-700">
          <Image
            as={NextImage}
            src="/hero_screenshots.png"
            alt="Revline App UI"
            className="object-cover"
            fill
            priority
            removeWrapper
          />
        </div>
      </div>

      {/* Optional bottom chevron */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown />
      </div>
    </section>
  );
}
