import ProfileForm from "@/components/profile";
import RootNavbar from "@/components/layout/root-navbar";
import { Skeleton } from "@heroui/react";
import { Suspense } from "react";
import { useRouter } from "next/router";

export default function Profile() {
  const router = useRouter();

  return (
    <>
      <RootNavbar pathname={router.pathname} path={router.asPath} />
      <Suspense
        fallback={
          <div className="flex flex-col gap-4 p-4 md:p-8 max-w-screen-xl mx-auto">
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
        <ProfileForm />
      </Suspense>
    </>
  );
}
