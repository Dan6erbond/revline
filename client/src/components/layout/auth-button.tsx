"use client";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { skipToken, useSuspenseQuery } from "@apollo/client";

import { graphql } from "@/gql";
import { providerMap } from "@/auth/providers";

const getMe = graphql(`
  query GetMeNavbar {
    me {
      id
      email
      profile {
        id
        username
        pictureUrl
      }
    }
  }
`);

export default function AuthButton() {
  const { data: session } = useSession();
  const { data } = useSuspenseQuery(getMe, session ? {} : skipToken);

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
          src={data.me.profile?.pictureUrl ?? undefined}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{data.me.email}</p>
        </DropdownItem>
        <DropdownItem key="profile" href={"/profile"}>
          Profile
        </DropdownItem>
        <DropdownItem key="subscription" href={"/subscription"}>
          Manage Subscription
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onPress={() => signOut()}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ) : (
    <Button
      onPress={() =>
        signIn(
          Object.values(providerMap).length > 0
            ? Object.values(providerMap)[0].id
            : undefined,
          {
            redirectTo: callbackUrl ?? "",
          }
        )
      }
    >
      Sign in
    </Button>
  );
}
