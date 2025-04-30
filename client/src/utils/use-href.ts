import { useRouter } from "next/router";

export const useHref = () => {
  const router = useRouter();

  return (href: string) => router.basePath + href;
};
