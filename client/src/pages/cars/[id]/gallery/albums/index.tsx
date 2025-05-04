import { Album, ImageIcon, Images, Plus } from "lucide-react";
import { Button, Card, CardBody, Image, Tab, Tabs } from "@heroui/react";

import CarLayout from "@/components/layout/car-layout";
import Link from "next/link";
import SubscriptionOverlay from "@/components/subscription-overlay";
import { SubscriptionTier } from "@/gql/graphql";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const getAlbums = graphql(`
  query GetAlbums($id: ID!) {
    car(id: $id) {
      id
      albums {
        id
        title
        media {
          id
          url
          createTime
        }
      }
    }
  }
`);

export default function Albums() {
  const router = useRouter();

  const { data } = useQuery(getAlbums, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  return (
    <CarLayout>
      <div className="p-4 flex flex-col gap-4 max-w-screen-xl mx-auto relative min-h-[300px]">
        <SubscriptionOverlay requiredTiers={[SubscriptionTier.Enthusiast]} />

        <div className="flex justify-between">
          <h1 className="text-3xl">Gallery</h1>

          <Button
            startContent={<Plus />}
            as={Link}
            href={`/cars/${router.query.id}/gallery/albums/create`}
          >
            Create
          </Button>
        </div>

        <Tabs
          variant="underlined"
          selectedKey={
            router.pathname.includes("/albums") ? "albums" : "pictures"
          }
          placement="top"
        >
          <Tab
            key="pictures"
            title={
              <div className="flex items-center space-x-2">
                <Images />
                <span>Pictures</span>
              </div>
            }
            href={`/cars/${router.query.id}/gallery`}
          />
          <Tab
            key="albums"
            title={
              <div className="flex items-center space-x-2">
                <Album />
                <span>Albums</span>
              </div>
            }
            href={`/cars/${router.query.id}/gallery/albums`}
          >
            <div className="flex flex-col items-stretch p-4 md:p-8 gap-4">
              {data?.car.albums?.map((album) => {
                const cover = album.media?.[0];
                return (
                  <Card key={album.id} className="shadow-sm">
                    <div className="bg-secondary">
                      {cover ? (
                        <Image
                          src={cover.url}
                          alt={album.title}
                          className="object-cover h-48 md:h-56 lg:h-64 xl:h-96 w-full rounded-none"
                          removeWrapper
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-content1-foreground p-4 md:p-8">
                          <ImageIcon className="h-12 w-12 opacity-50" />
                        </div>
                      )}
                    </div>
                    <CardBody className="p-4">
                      <h3 className="text-lg font-semibold text-content1-foreground truncate">
                        {album.title}
                      </h3>
                      <Button
                        as={Link}
                        href={`/cars/${router.query.id}/gallery/albums/${album.id}`}
                        className="mt-2 w-full text-primary border-primary hover:bg-primary/10"
                        variant="bordered"
                      >
                        View Album
                      </Button>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </Tab>
        </Tabs>
      </div>
    </CarLayout>
  );
}
