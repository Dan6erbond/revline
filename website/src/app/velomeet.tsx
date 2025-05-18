"use client";

import { Link } from "@heroui/react";

export default function VeloMeet() {
  return (
    <div className="bg-primary-900/10 text-white rounded-2xl p-6 flex items-center gap-4 shadow-md container mx-auto mt-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://www.velomeet.app/_next/image?url=%2Fvm-logo.png&w=256&q=75"
          alt="VeloMeet Logo"
          className="w-32 h-16 object-contain rounded-md"
        />
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="text-xl font-bold">Looking for car meets near you?</h2>
          <p className="text-sm text-gray-300 mt-1">
            Discover, join, and host car meets with{" "}
            <span className="font-semibold text-white">VeloMeet</span>. Connect
            with local enthusiasts and never miss a car meet again.
          </p>
          <Link href="https://www.velomeet.app" isExternal>
            Explore VeloMeet &rarr;
          </Link>
        </div>
    </div>
  );
}
