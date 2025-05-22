"use client";

import { HeroUIProvider } from "@heroui/react";
import { MDXProvider } from "next-mdx-remote-client";
import { useMDXComponents } from "@/mdx-components";
import { useRouter } from "next/navigation";

// Only if using TypeScript
declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const components = useMDXComponents();

  return (
    <HeroUIProvider navigate={router.push}>
      <MDXProvider components={components}>{children}</MDXProvider>
    </HeroUIProvider>
  );
}
