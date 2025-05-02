import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Spinner,
} from "@heroui/react";
import { Suspense, useState } from "react";

import AuthButton from "./auth-button";
import Wordmark from "../wordmark";

export default function RootNavbar({
  pathname,
  path,
}: {
  pathname: string | null;
  path?: string;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    {
      name: "Garage",
      href: "/",
      active: pathname === "/",
    },
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand as={Link} href={"/"}>
          <Wordmark />
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex">
        {menuItems.map(({ name, href, active }) => (
          <NavbarItem key={name}>
            <Link
              aria-current={active ? "page" : false}
              color={active ? "primary" : "foreground"}
              href={href}
            >
              {name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent as="div" justify="end">
        <Suspense fallback={<Spinner />}>
          <AuthButton path={path ?? pathname} />
        </Suspense>
      </NavbarContent>

      <NavbarMenu className="pt-4">
        {menuItems.map(({ name, active, href }) => (
          <NavbarMenuItem key={name}>
            <Link
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
