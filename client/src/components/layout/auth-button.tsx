"use client";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import {
  BadgeDollarSign,
  DoorOpen,
  HandCoins,
  Settings,
  User,
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { skipToken, useSuspenseQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import { graphql } from "@/gql";
import { useConfig } from "@/contexts/config";

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

export default function AuthButton({ path }: { path?: string | null }) {
  const { data: session } = useSession();
  const { data } = useSuspenseQuery(getMe, session ? {} : skipToken);
  const { basePath } = useConfig();

  const [providers, setProviders] = useState<{
    [key: string]: { id: string };
  }>({});

  useEffect(() => {
    fetch(basePath + "/api/auth/providers")
      .then((res) => res.json())
      .then((providers) => setProviders(providers));
  }, [setProviders, basePath]);

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
        <DropdownItem
          key="profile"
          href={"/profile"}
          startContent={<User className="size-5" />}
        >
          Profile
        </DropdownItem>
        <DropdownItem
          key="subscription"
          href={"/subscription"}
          startContent={<BadgeDollarSign className="size-5" />}
        >
          Manage Subscription
        </DropdownItem>
        <DropdownItem
          key="affiliate"
          href={"/affiliate"}
          startContent={<HandCoins className="size-5" />}
        >
          Affiliate
        </DropdownItem>
        <DropdownItem
          key="settings"
          href={"/settings"}
          startContent={<Settings className="size-5" />}
        >
          Settings
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          startContent={<DoorOpen className="size-5" />}
          onPress={() => signOut()}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ) : (
    <Button
      onPress={() =>
        signIn(
          Object.values(providers).length === 1 &&
            Object.values(providers)[0].id !== "credentials"
            ? Object.values(providers)[0].id
            : undefined,
          {
            redirectTo: path ?? "",
          }
        )
      }
    >
      Sign in
    </Button>
  );
}
