import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";

import AuthButton from "./auth-button";
import NextLink from "next/link";
import Wordmark from "../wordmark";
import { useRouter } from "next/router";
import { useState } from "react";

export default function CarNavbar() {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    {
      name: "Garage",
      href: "/",
      active: router.pathname === "/",
    },
    {
      name: "Maintenance",
      href: `/cars/${router.query.id}/maintenance`,
      active: router.pathname.startsWith("/cars/[id]/maintenance"),
    },
    {
      name: "Performance",
      href: `/cars/${router.query.id}/performance`,
      active: router.pathname.startsWith("/cars/[id]/performance"),
    },
    {
      name: "Gallery",
      href: `/cars/${router.query.id}/gallery`,
      active: router.pathname.startsWith("/cars/[id]/gallery"),
    },
    {
      name: "Documents",
      href: `/cars/${router.query.id}/documents`,
      active: router.pathname.startsWith("/cars/[id]/documents"),
    },
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand as={NextLink} href="/">
          <Wordmark />
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex">
        {menuItems.map(({ name, href, active }) => (
          <NavbarItem key={name}>
            <NextLink
              aria-current={active ? "page" : false}
              color={active ? "primary" : "foreground"}
              href={href}
            >
              {name}
            </NextLink>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent as="div" justify="end">
        <AuthButton />
      </NavbarContent>

      <NavbarMenu className="pt-4">
        {menuItems.map(({ name, active, href }) => (
          <NavbarMenuItem key={name}>
            <Link
              as={NextLink}
              className="w-full"
              color={active ? "primary" : "foreground"}
              href={href}
              size="lg"
            >
              {name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
