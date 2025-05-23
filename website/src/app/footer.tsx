"use client";

import { Button, Link } from "@heroui/react";
import { SiInstagram, SiReddit, SiX } from "@icons-pack/react-simple-icons";

import { ArrowRight } from "lucide-react";
import NextLink from "next/link";
import Wordmark from "./wordmark";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-background to-background via-black/50 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex justify-between gap-6">
            <Link as={NextLink} href="/">
              <Wordmark />
            </Link>
            <Button
              as="a"
              href="https://revline.one/app"
              className="bg-white text-black hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              Go to App <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-4">
            <Link
              href="https://reddit.com/r/revline1"
              isExternal
              className="hover:text-gray-400 transition-colors"
            >
              <SiReddit className="w-5 h-5" />
            </Link>
            <Link
              href="https://twitter.com/revlineone"
              isExternal
              className="hover:text-gray-400 transition-colors"
            >
              <SiX className="w-5 h-5" />
            </Link>
            <Link
              href="https://instagram.com/revline.1"
              isExternal
              className="hover:text-gray-400 transition-colors"
            >
              <SiInstagram className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Revline 1. Crafted with passion.
          </p>
        </div>
      </div>
    </footer>
  );
}
