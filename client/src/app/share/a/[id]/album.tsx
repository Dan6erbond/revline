"use client";

import { Avatar, Card, CardBody, CardHeader, Spinner } from "@heroui/react";

import { FragmentType } from "@/gql";
import { MediaItemFields } from "@/components/media/shared";
import MediaViewer from "@/components/media/viewer";
import ViewerModal from "./modal";
import { getAlbum } from "@/components/album/shared";
import { useIntersectionObserver } from "@heroui/use-intersection-observer";
import { useState } from "react";
import { useSuspenseQuery } from "@apollo/client";

export default function Album({ id }: { id: string }) {
  const { data, fetchMore } = useSuspenseQuery(getAlbum, {
    variables: { id, first: 10 },
  });

  const [loaderRef] = useIntersectionObserver({
    isEnabled: data?.album.media.pageInfo.hasNextPage,
    onChange: (isIntersecting) =>
      isIntersecting &&
      data?.album.media.edges &&
      fetchMore({
        variables: {
          after:
            data.album.media.edges[data.album.media.edges.length - 1]?.cursor,
        },
      }),
  });

  const { car, title, media } = data.album;
  const { name, owner } = car ?? {};
  const { email, profile } = owner ?? {};

  const [openMedia, setOpenMedia] = useState<FragmentType<
    typeof MediaItemFields
  > | null>(null);

  return (
    <div className="p-4 md:p-8">
      <Card className="max-w-5xl mx-auto shadow-lg rounded-2xl bg-background border border-zinc-800">
        <CardHeader className="flex flex-col items-start gap-4">
          <p className="text-primary text-2xl">{title ?? "Shared Media"}</p>
          <div className="flex items-center space-x-4">
            <Avatar
              className="w-10 h-10"
              src={profile?.pictureUrl ?? undefined}
              name={profile?.username ?? undefined}
            />
            <div className="text-content-1-foreground">
              <p className="font-medium">{profile?.username}</p>
              <p className="text-sm text-content-3-foreground">{email}</p>
            </div>
          </div>
        </CardHeader>

        <CardBody className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {media?.edges?.map((e) => (
              <Card
                key={e!.node!.id}
                isPressable
                onPress={() => setOpenMedia(e!.node!)}
                className="h-[250px] md:h-[350px] lg:h-[400px] xl:h-[450px]"
              >
                <MediaViewer item={e!.node!} />
              </Card>
            ))}
          </div>
          {data?.album.media.pageInfo.hasNextPage && (
            <div className="flex w-full justify-center mt-10">
              <Spinner ref={loaderRef} color="white" />
            </div>
          )}

          <div className="flex flex-col gap-2 mt-4">
            <h3 className="text-lg font-semibold text-secondary">Car</h3>
            <p className="text-content2-foreground">{name}</p>
          </div>
        </CardBody>
      </Card>

      <ViewerModal
        isOpen={openMedia !== null}
        onClose={() => setOpenMedia(null)}
        item={openMedia}
      />
    </div>
  );
}
