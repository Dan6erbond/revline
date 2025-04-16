import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";

import AuthButton from "./auth-button";
import Wordmark from "../wordmark";
import { useRouter } from "next/router";

export default function CarNavbar() {
  const router = useRouter();

  return (
    <Navbar>
      <NavbarBrand as={Link} href="/">
        <Wordmark />
      </NavbarBrand>
      <NavbarContent>
        <NavbarItem>
          <Link
            aria-current={router.pathname === "/" ? "page" : false}
            color={router.pathname === "/" ? "primary" : "foreground"}
            href="/"
          >
            Garage
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            aria-current={
              router.pathname.startsWith("/cars/[id]/maintenance")
                ? "page"
                : false
            }
            color={
              router.pathname.startsWith("/cars/[id]/maintenance")
                ? "primary"
                : "foreground"
            }
            href={`/cars/${router.query.id}/maintenance`}
          >
            Maintenance
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            aria-current={
              router.pathname.startsWith("/cars/[id]/performance")
                ? "page"
                : false
            }
            color={
              router.pathname.startsWith("/cars/[id]/performance")
                ? "primary"
                : "foreground"
            }
            href={`/cars/${router.query.id}/performance`}
          >
            Performance
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            aria-current={
              router.pathname.startsWith("/cars/[id]/gallery") ? "page" : false
            }
            color={
              router.pathname.startsWith("/cars/[id]/gallery")
                ? "primary"
                : "foreground"
            }
            href={`/cars/${router.query.id}/gallery`}
          >
            Gallery
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent as="div" justify="end">
        <AuthButton />
      </NavbarContent>
    </Navbar>
  );
}
