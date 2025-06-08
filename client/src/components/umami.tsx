"use client";

import Script, { ScriptProps } from "next/script";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Umami({
  websiteId,
  ...props
}: { websiteId: string } & ScriptProps) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      const {
        user: { id, ...user },
      } = session;
      umami.identify(id, user);
    }
  }, [session?.user?.id]);

  return (
    <Script
      defer
      src="https://cloud.umami.is/script.js"
      data-website-id={websiteId}
      {...props}
    />
  );
}
