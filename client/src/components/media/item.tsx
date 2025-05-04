import {
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Tooltip,
  addToast,
  useDisclosure,
} from "@heroui/react";
import { Copy, Link, MoreHorizontal } from "lucide-react";
import { FragmentType, graphql, useFragment } from "@/gql";
import { Key, useState } from "react";

import useDebounce from "../../hooks/use-debounce";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";

export const MediaItemFields = graphql(`
  fragment MediaItem on Media {
    id
    url
    title
    description
    metadata {
      contentType
    }
  }
`);

const updateMedia = graphql(`
  mutation UpdateMedia($id: ID!, $input: UpdateMediaInput!) {
    updateMedia(id: $id, input: $input) {
      ...MediaItem
    }
  }
`);

export default function MediaItem({
  item,
}: {
  item: FragmentType<typeof MediaItemFields>;
}) {
  const router = useRouter();

  const [mutate, { loading }] = useMutation(updateMedia);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const m = useFragment(MediaItemFields, item);

  const isVideo = m.metadata?.contentType.startsWith("video/");

  const [title, setTitle] = useState(m.title);

  const handleTitleChange = useDebounce({
    handle: (val: string) => {
      mutate({
        variables: {
          id: m.id,
          input: { title: val },
        },
        optimisticResponse: {
          __typename: "Mutation",
          updateMedia: {
            ...m,
            title: val,
          },
        },
      });

      setTitle(val);
    },
  });

  const [description, setDescription] = useState(m.description);

  const handleDescriptionChange = useDebounce({
    handle: (val: string) => {
      mutate({
        variables: {
          id: m.id,
          input: { description: val },
        },
        optimisticResponse: {
          __typename: "Mutation",
          updateMedia: {
            ...m,
            description: val,
          },
        },
      });

      setDescription(val);
    },
    delay: 1000,
  });

  const onAction = (key: Key) => {
    switch (key) {
      case "copy":
        const shareUrl = new URL(
          `${router.basePath}/share/m/${m.id}`,
          window.location.origin
        );

        navigator.clipboard.writeText(shareUrl.toString()).then(() => {
          addToast({
            title: "Link copied",
            description: "The share link is now in your clipboard.",
            color: "success",
          });
        });

        break;
    }
  };

  return (
    <>
      <Card className="relative group h-[400px]" isPressable onPress={onOpen}>
        <div className="absolute top-6 right-6 z-20 hidden group-hover:block">
          <Dropdown onClick={(e) => e.stopPropagation()}>
            <DropdownTrigger asChild>
              <Button
                size="sm"
                isIconOnly
                className="text-content-3-foreground hover:text-primary"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu className="w-48" onAction={onAction}>
              <DropdownItem key="copy" startContent={<Copy />}>
                Copy Share Link
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {isVideo ? (
          <video className="h-full w-full object-cover">
            <source src={m.url} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={m.url}
            alt={`Shared media ${m.id}`}
            className="object-cover h-full w-full"
            removeWrapper
          />
        )}
      </Card>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        classNames={{ base: "bg-transparent shadow-none" }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        size={"" as any}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="items-center">
                <Input
                  label="Title"
                  variant="underlined"
                  className="border-b mr-10"
                  value={title ?? undefined}
                  onValueChange={handleTitleChange}
                  size="lg"
                  endContent={loading && <Spinner />}
                />
              </ModalHeader>
              <ModalBody>
                {isVideo ? (
                  <video className="h-full w-full object-cover" controls>
                    <source src={m.url} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={m.url}
                    alt={`Shared media ${m.id}`}
                    className="object-cover h-full w-full"
                    removeWrapper
                  />
                )}
              </ModalBody>
              <ModalFooter className="items-center">
                <Input
                  label="Description"
                  variant="bordered"
                  value={description ?? undefined}
                  onValueChange={handleDescriptionChange}
                  size="lg"
                  endContent={loading && <Spinner />}
                />
                <Tooltip content="Copy share link">
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => onAction("copy")}
                  >
                    <Link />
                  </Button>
                </Tooltip>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
