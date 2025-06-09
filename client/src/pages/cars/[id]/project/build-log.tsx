import {
  BuildLogOrderField,
  OrderDirection,
  SubscriptionTier,
} from "@/gql/graphql";
import {
  Button,
  Card,
  CardBody,
  DatePicker,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  Spinner,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { JSONContent, generateHTML } from "@tiptap/react";
import { KanbanIcon, Lightbulb, Plus, WrenchIcon } from "lucide-react";
import MediaItem, { SelectableMediaItem } from "@/components/media/item";
import { ZonedDateTime, getLocalTimeZone, now } from "@internationalized/date";
import { useMutation, useQuery } from "@apollo/client";

import CarLayout from "@/components/layout/car-layout";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import ModChip from "@/mods/chip";
import ModsPicker from "@/mods/picker";
import SubscriptionOverlay from "@/components/subscription-overlay";
import { createExtensions } from "@/components/minimal-tiptap/hooks/use-minimal-tiptap";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useIntersectionObserver } from "@heroui/use-intersection-observer";
import { useRouter } from "next/router";
import { withNotification } from "@/utils/with-notification";

type Inputs = {
  logTime: ZonedDateTime;
  title: string;
  notes?: JSONContent;
  mediaIds: string[];
  modIds: string[];
};

const getBuildLogs = graphql(`
  query GetBuildLogs(
    $id: ID!
    $where: BuildLogWhereInput
    $first: Int
    $after: Cursor
    $orderBy: [BuildLogOrder!]
  ) {
    car(id: $id) {
      id
      buildLogs(
        where: $where
        first: $first
        after: $after
        orderBy: $orderBy
      ) {
        edges {
          node {
            id
            title
            notes
            media {
              id
              ...MediaItem
            }
            mods {
              id
              title
              category
              status
              description
              stage
            }
            logTime
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        totalCount
      }
    }
  }
`);

const getGallery = graphql(`
  query GetGallery(
    $id: ID!
    $where: MediaWhereInput
    $first: Int
    $after: Cursor
    $orderBy: [MediaOrder!]
  ) {
    car(id: $id) {
      id
      media(where: $where, first: $first, after: $after, orderBy: $orderBy) {
        edges {
          node {
            id
            ...MediaItem
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        totalCount
      }
    }
  }
`);

const createBuildLog = graphql(`
  mutation CreateBuildLog($input: CreateBuildLogInput!) {
    createBuildLog(input: $input) {
      id
      title
      notes
      media {
        id
        ...MediaItem
      }
      mods {
        id
        title
        category
        status
        description
        stage
      }
      logTime
    }
  }
`);

export default function BuildLog() {
  const router = useRouter();

  const { data, fetchMore } = useQuery(getBuildLogs, {
    variables: {
      id: getQueryParam(router.query.id) as string,
      first: 10,
      orderBy: [
        { field: BuildLogOrderField.LogTime, direction: OrderDirection.Desc },
      ],
    },
    skip: !getQueryParam(router.query.id),
  });

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const {
    data: galleryData,
    loading: loadingGallery,
    fetchMore: fetchMoreMedia,
  } = useQuery(getGallery, {
    variables: { id: getQueryParam(router.query.id) as string, first: 10 },
    skip: !getQueryParam(router.query.id),
  });

  const [mediaLoaderRef] = useIntersectionObserver({
    isEnabled: galleryData?.car.media.pageInfo.hasNextPage && !loadingGallery,
    onChange: (isIntersecting) =>
      isIntersecting &&
      galleryData?.car.media.edges &&
      fetchMoreMedia({
        variables: {
          after:
            galleryData.car.media.edges[galleryData.car.media.edges.length - 1]
              ?.cursor,
        },
      }),
  });

  const [mutate, { loading }] = useMutation(createBuildLog, {
    refetchQueries: [getBuildLogs],
  });

  const { register, handleSubmit, control } = useForm<Inputs>({
    defaultValues: {
      logTime: now(getLocalTimeZone()),
      mediaIds: [],
    },
  });

  const onSubmit = withNotification(
    { title: "Saving build log..." },
    ({ title, mediaIds, notes, modIds, logTime }: Inputs) =>
      mutate({
        variables: {
          input: {
            carID: getQueryParam(router.query.id)!,
            title,
            notes,
            logTime: logTime.toDate().toISOString(),
            mediumIDs: mediaIds,
            modIDs: modIds,
          },
        },
      }).then(onClose)
  );

  const [loaderRef] = useIntersectionObserver({
    isEnabled: data?.car.buildLogs.pageInfo.hasNextPage && !loading,
    onChange: (isIntersecting) =>
      isIntersecting &&
      data?.car.buildLogs.edges &&
      fetchMore({
        variables: {
          after:
            data.car.buildLogs.edges[data.car.buildLogs.edges.length - 1]
              ?.cursor,
        },
      }),
  });

  return (
    <CarLayout
      className="p-4 md:p-8 flex flex-col gap-2 relative"
      style={{
        minHeight: "calc(70vh - 4rem)",
        maxHeight: "calc(100vh - 4rem)",
      }}
    >
      <SubscriptionOverlay requiredTiers={[SubscriptionTier.Enthusiast]} />

      <Tabs variant="underlined" selectedKey="build-log">
        <Tab
          key="kanban"
          title={
            <div className="flex items-center space-x-2">
              <KanbanIcon />
              <span>Kanban</span>
            </div>
          }
          href={`/cars/${router.query.id}/project`}
          className="flex-1 flex flex-col gap-4"
        />
        <Tab
          key="mods"
          title={
            <div className="flex items-center space-x-2">
              <Lightbulb />
              <span>Mods</span>
            </div>
          }
          href={`/cars/${router.query.id}/project/mods`}
        />
        <Tab
          key="build-log"
          title={
            <div className="flex items-center space-x-2">
              <WrenchIcon />
              <span>Build Log</span>
            </div>
          }
          href={`/cars/${router.query.id}/project/build-log`}
          className="flex-1 flex flex-col gap-4"
        >
          <section className="container mx-auto p-4 md:p-6">
            <div className="flex justify-between">
              <h1 className="mb-10 text-2xl font-bold tracking-tighter text-foreground sm:text-3xl">
                Build Log
              </h1>

              <Button
                startContent={<Plus />}
                onPress={onOpen}
                color="primary"
                variant="flat"
              >
                Add
              </Button>
            </div>
            <div className="relative mx-auto max-w-4xl">
              <Divider
                orientation="vertical"
                className="absolute top-4 left-2 bg-content4"
              />
              {data?.car?.buildLogs?.edges
                ?.map((e) => e?.node)
                .filter((n) => !!n)
                .map((log) => (
                  <div key={log.id} className="relative mb-10 pl-8">
                    <div className="absolute top-3.5 left-0 flex size-4 items-center justify-center rounded-full bg-foreground" />

                    <h4 className="rounded-xl py-2 text-xl font-bold tracking-tight xl:mb-4 xl:px-3">
                      {log.title}
                    </h4>

                    <h5 className="text-md top-3 -left-34 rounded-xl tracking-tight text-muted-foreground xl:absolute">
                      {log.logTime
                        ? new Date(log.logTime).toLocaleDateString()
                        : ""}
                    </h5>

                    <Card className="my-5 border-none shadow-none">
                      <CardBody className="flex flex-col gap-4">
                        <div
                          className="prose text-foreground"
                          dangerouslySetInnerHTML={{
                            __html: generateHTML(
                              log.notes,
                              createExtensions("")
                            ),
                          }}
                        />

                        {log.media && log.media.length > 0 && (
                          <div className="flex flex-nowrap gap-4 overflow-x-auto p-2">
                            {log.media?.map((m) => (
                              <MediaItem
                                item={m}
                                key={m.id}
                                className="aspect-square shrink-0"
                              />
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {log.mods?.map((mod) => (
                            <ModChip
                              key={mod.id}
                              href={`/cars/${router.query.id}/project/mods/${mod.id}`}
                              variant="faded"
                              mod={mod}
                            />
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                ))}

              {!loading && data?.car.buildLogs.pageInfo.hasNextPage && (
                <div className="flex w-full justify-center mt-10">
                  <Spinner ref={loaderRef} color="white" />
                </div>
              )}
            </div>
          </section>

          <Modal
            scrollBehavior="inside"
            size="2xl"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader>Enter build log</ModalHeader>
                  <ModalBody>
                    <form
                      className="flex flex-col gap-4"
                      onSubmit={handleSubmit(onSubmit)}
                      id="build-log"
                    >
                      <Input
                        label="Title"
                        variant="bordered"
                        {...register("title")}
                      />

                      <Controller
                        name="logTime"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            hideTimeZone
                            showMonthAndYearPickers
                            label="Date"
                            {...field}
                            variant="bordered"
                          />
                        )}
                      />

                      <Controller
                        control={control}
                        name="notes"
                        render={({ field }) => (
                          <MinimalTiptapEditor placeholder="Notes" {...field} />
                        )}
                      />

                      <Controller
                        control={control}
                        name="mediaIds"
                        render={({ field: { value, onChange } }) => (
                          <fieldset className="space-y-2">
                            <legend>Media</legend>
                            <div className="max-h-[250px] sm:max-h-[300px] md:max-h-[350px] lg:max-h-[400px] overflow-y-auto">
                              <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
                                {galleryData?.car.media?.edges?.map((e) => (
                                  <SelectableMediaItem
                                    item={e!.node!}
                                    key={e!.node!.id}
                                    selected={value.includes(e!.node!.id)}
                                    onSelect={() =>
                                      onChange([...value, e!.node!.id])
                                    }
                                  />
                                ))}
                                {loadingGallery &&
                                  Array(10)
                                    .fill(null)
                                    .map((_, i) => (
                                      <Skeleton
                                        key={i}
                                        className="rounded-xl h-[150px] md:h-[200px] lg:h-[250px]"
                                      />
                                    ))}
                              </div>
                              {!loadingGallery &&
                                galleryData?.car.media.pageInfo.hasNextPage && (
                                  <div className="flex w-full justify-center mt-10">
                                    <Spinner
                                      ref={mediaLoaderRef}
                                      color="white"
                                    />
                                  </div>
                                )}
                            </div>
                          </fieldset>
                        )}
                      />

                      <Controller
                        control={control}
                        name="modIds"
                        render={({ field: { value, onChange } }) => (
                          <fieldset className="space-y-2">
                            <legend>Mods</legend>

                            <ModsPicker value={value} onChange={onChange} />
                          </fieldset>
                        )}
                      />
                    </form>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      color="primary"
                      type="submit"
                      form="build-log"
                      isLoading={loading}
                    >
                      Save
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </Tab>
      </Tabs>
    </CarLayout>
  );
}
