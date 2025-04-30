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
import Wordmark from "../wordmark";
import { useHref } from "@/utils/use-href";
import { useRouter } from "next/router";
import { useState } from "react";

export default function RootNavbar() {
  const router = useRouter();
  const getHref = useHref();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    {
      name: "Garage",
      href: "/",
      active: router.pathname === "/",
    },
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand as={Link} href={getHref("/")}>
          <Wordmark />
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex">
        {menuItems.map(({ name, href, active }) => (
          <NavbarItem key={name}>
            <Link
              aria-current={active ? "page" : false}
              color={active ? "primary" : "foreground"}
              href={getHref(href)}
            >
              {name}
            </Link>
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
              className="w-full"
              color={active ? "primary" : "foreground"}
              href={getHref(href)}
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
