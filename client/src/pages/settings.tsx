import RootNavbar from "@/components/layout/root-navbar";
import { Settings } from "lucide-react";
import SettingsForm from "@/components/settings";
import { Skeleton } from "@heroui/react";
import { Suspense } from "react";
import { useRouter } from "next/router";

export default function Profile() {
  const router = useRouter();

  return (
    <>
      <RootNavbar pathname={router.pathname} path={router.asPath} />
      <div className="flex flex-col gap-4 md:gap-8 p-4 md:p-8 container mx-auto">
        <div className="flex gap-4 items-center text-2xl">
          <Settings className="size-8" />
          <h1>Settings</h1>
        </div>
        <Suspense
          fallback={
            <div className="flex flex-col gap-4 p-4 md:p-8 container mx-auto">
              <Skeleton className="h-12 w-64 rounded" />
              <Skeleton className="h-12 w-96 rounded" />
              <Skeleton className="h-12 w-96 rounded" />
              <Skeleton className="h-12 w-96 rounded" />
              <div className="flex justify-end">
                <Skeleton className="h-12 w-48 rounded" />
              </div>
            </div>
          }
        >
          <SettingsForm />
        </Suspense>
      </div>
    </>
  );
}
