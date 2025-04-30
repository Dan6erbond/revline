"use client";

import {
  Button,
  Navbar as HeroNavbar,
  Link,
  NavbarBrand,
  NavbarContent,
} from "@heroui/react";

import { ArrowRight } from "lucide-react";
import Wordmark from "./wordmark";

export default function Navbar() {
  return (
    <HeroNavbar>
      <NavbarContent>
        <NavbarBrand as={Link} href="/">
          <Wordmark />
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <Button
          as="a"
          href="https://revline.one/app/api/auth/signin"
          className="bg-white text-black hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          Log In <ArrowRight className="w-4 h-4" />
        </Button>
      </NavbarContent>
    </HeroNavbar>
  );
}
