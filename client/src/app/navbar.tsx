"use client";

import RootNavbar from "@/components/layout/root-navbar";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return <RootNavbar pathname={pathname} />;
}
