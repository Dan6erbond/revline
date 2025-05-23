"use client";

import { Image, Link } from "@heroui/react";

import NextImage from "next/image";

export default function VeloMeet() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="bg-primary-900/10 text-white rounded-2xl p-4 md:p-6 flex items-center gap-4 shadow-md container mx-auto mt-8">
        <Image
          as={NextImage}
          src="/vm-transparent.png"
          alt="VeloMeet Logo"
          width={128}
          height={64}
          className="object-contain"
        />
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="text-xl font-bold">Looking for car meets near you?</h2>
          <p className="text-sm text-gray-300 mt-1">
            Discover, join, and host car meets with{" "}
            <span className="font-semibold text-white">VeloMeet</span>. Connect
            with local enthusiasts and never miss a car meet again.
          </p>
          <Link href="https://www.velomeet.app" target="_blank" rel="noopener">
            Explore VeloMeet &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
