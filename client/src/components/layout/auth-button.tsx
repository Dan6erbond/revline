import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { signIn, signOut } from "next-auth/react";

import { graphql } from "@/gql";
import { useQuery } from "@apollo/client";

const getMe = graphql(`
  query GetMeNavbar {
    me {
      id
      email
      profile {
        id
        username
        profilePictureUrl
      }
    }
  }
`);

export default function AuthButton() {
  const { data } = useQuery(getMe);

  return data?.me ? (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="secondary"
          name={data.me.profile?.username ?? undefined}
          size="sm"
          src={data.me.profile?.profilePictureUrl ?? undefined}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{data.me.email}</p>
        </DropdownItem>
        <DropdownItem key="profile" href="/profile">
          Profile
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onPress={() => signOut()}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ) : (
    <Button onPress={() => signIn("zitadel")}>Sign in</Button>
  );
}
