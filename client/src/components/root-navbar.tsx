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

import Wordmark from "./wordmark";
import { graphql } from "../gql";
import { useQuery } from "@apollo/client";

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

export default function RootNavbar() {
  const { data } = useQuery(getMe);

  return (
    <Navbar>
      <NavbarBrand>
        <Wordmark />
      </NavbarBrand>
      <NavbarContent>
        <NavbarItem>
          <Link aria-current="page" color="primary" href="/">
            Garage
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Maintenance
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Performance
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
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
