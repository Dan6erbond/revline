import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { signIn, signOut } from "next-auth/react";

import Wordmark from "../wordmark";
import { graphql } from "../../gql";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const getMe = graphql(`
  query GetMeNavbar {
    me {
      id
      email
      profile {
        id
        username
      }
    }
  }
`);

export default function CarNavbar() {
  const router = useRouter();

  const { data } = useQuery(getMe);

  return (
    <Navbar>
      <NavbarBrand>
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
        {data?.me ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{data.me.email}</p>
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onPress={() => signOut()}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Button onPress={() => signIn("zitadel")}>Sign in</Button>
        )}
      </NavbarContent>
    </Navbar>
  );
}
