import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";

import AuthButton from "./auth-button";
import Wordmark from "../wordmark";

export default function RootNavbar() {
  return (
    <Navbar>
      <NavbarBrand as={Link} href="/">
        <Wordmark />
      </NavbarBrand>
      <NavbarContent>
        <NavbarItem>
          <Link aria-current="page" color="primary" href="/">
            Garage
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent as="div" justify="end">
        <AuthButton />
      </NavbarContent>
    </Navbar>
  );
}
