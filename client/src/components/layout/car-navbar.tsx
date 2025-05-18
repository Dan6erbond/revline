import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Spinner,
} from "@heroui/react";

import AuthButton from "./auth-button";
import { Home } from "lucide-react";
import NextLink from "next/link";
import { Suspense } from "react";
import Wordmark from "../wordmark";
import { getQueryParam } from "@/utils/router";
import { useRouter } from "next/router";

export default function CarNavbar({
  car,
  menuItems,
}: {
  car?: {
    name: string;
  };
  menuItems: {
    name: string;
    href: string;
    active: boolean;
    showOnTopNav?: boolean;
  }[];
}) {
  const router = useRouter();

  return (
    <Navbar>
      <NavbarContent>
        <NavbarBrand as={NextLink} href="/" className="hidden md:flex">
          <Wordmark />
        </NavbarBrand>
        <Button
          as={NextLink}
          href="/"
          isIconOnly
          variant="light"
          className="md:hidden px-0 min-w-0 w-6"
        >
          <Home />
        </Button>
        <NavbarBrand
          as={NextLink}
          href={`/cars/${getQueryParam(router.query.id)}`}
          className="md:hidden text-2xl"
        >
          {car?.name}
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex">
        {menuItems
          .filter(({ showOnTopNav }) => showOnTopNav !== false)
          .map(({ name, href, active }) => (
            <NavbarItem key={name}>
              <Link
                as={NextLink}
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
          <AuthButton path={router.asPath} />
        </Suspense>
      </NavbarContent>
    </Navbar>
  );
}
