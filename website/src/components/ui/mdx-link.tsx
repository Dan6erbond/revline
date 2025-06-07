"use client";

import { Link, LinkProps } from "@heroui/react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";

function MdxLink(props: LinkProps | NextLinkProps) {
  const href = props.href as string;

  if (href!.startsWith("/")) {
    return <NextLink {...(props as NextLinkProps)} />;
  }

  if (href!.startsWith("#")) {
    return <Link {...(props as LinkProps)} />;
  }

  return <Link isExternal {...(props as LinkProps)} />;
}

export default MdxLink;
