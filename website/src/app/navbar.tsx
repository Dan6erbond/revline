"use client";

import {
  Button,
  Navbar as HeroNavbar,
  Link,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";

import { ArrowRight } from "lucide-react";
import NextLink from "next/link";
import Wordmark from "./wordmark";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <HeroNavbar>
      <NavbarContent>
        <NavbarBrand as={NextLink} href="/">
          <Wordmark />
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent>
        <NavbarItem>
          <Link
            as={NextLink}
            aria-current={pathname.startsWith("/blog") ? "page" : false}
            color={pathname.startsWith("/blog") ? "primary" : "foreground"}
            href={"/blog"}
          >
            Blog
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <Button
          as={Link}
          href="https://revline.one/app"
          className="bg-white text-black hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          Go to App <ArrowRight className="w-4 h-4" />
        </Button>
      </NavbarContent>
    </HeroNavbar>
  );
}
