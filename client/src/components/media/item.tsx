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

import { CollectionElement } from "@react-types/shared";
import { MediaItemFields } from "./shared";
import NextImage from "next/image";
import { useConfig } from "@/contexts/config";
import useDebounce from "@/hooks/use-debounce";
import { useHref } from "@/utils/use-href";
import { useMutation } from "@apollo/client";

const updateMedia = graphql(`
  mutation UpdateMedia($id: ID!, $input: UpdateMediaInput!) {
    updateMedia(id: $id, input: $input) {
      ...MediaItem
    }
  }
`);

function Preview({ item }: { item: FragmentType<typeof MediaItemFields> }) {
  const config = useConfig();

  const m = useFragment(MediaItemFields, item);
  const isVideo = m.metadata?.contentType.startsWith("video/");

  return isVideo ? (
    <video className="h-full w-full object-cover">
      <source src={m.url} type={m.metadata?.contentType ?? "video/mp4"} />
    </video>
  ) : (
    <NextImage
      src={new URL(`/media/${m.id}`, config.serverUrl).toString()}
      alt={`Shared media ${m.id}`}
      className="object-cover h-full w-full"
      sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
      fill
    />
  );
}

export default function MediaItem({
  item,
  dropdownMenuChildren,
  onAction: onActionParent,
}: {
  item: FragmentType<typeof MediaItemFields>;
  dropdownMenuChildren?:
    | CollectionElement<object>
    | CollectionElement<object>[];
  onAction?(key: Key): void;
}) {
  const href = useHref();

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
          href(`/share/m/${m.id}`),
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
      default:
        onActionParent?.(key);
    }
  };

  const dropdownItems = [
    <DropdownItem key="copy" startContent={<Copy />}>
      Copy Share Link
    </DropdownItem>,
  ];

  return (
    <>
      <Card
        className="relative h-[150px] md:h-[200px] lg:h-[250px]"
        isPressable
        onPress={onOpen}
      >
        <div className="absolute top-6 right-6 z-20">
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
              {Array.isArray(dropdownMenuChildren)
                ? [...dropdownItems, ...dropdownMenuChildren]
                : dropdownMenuChildren
                ? [...dropdownItems, dropdownMenuChildren]
                : dropdownItems}
            </DropdownMenu>
          </Dropdown>
        </div>

        <Preview item={item} />
      </Card>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        classNames={{ base: "bg-transparent shadow-none" }}
        size="5xl"
        scrollBehavior="inside"
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
                    <source
                      src={m.url}
                      type={m.metadata?.contentType ?? "video/mp4"}
                    />
                  </video>
                ) : (
                  <Image
                    src={m.url}
                    alt={`Shared media ${m.id}`}
                    className="object-contain h-full w-full"
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

export function SelectableMediaItem({
  item,
  selected,
  onSelect,
}: {
  item: FragmentType<typeof MediaItemFields>;
  selected: boolean;
  onSelect(id: string): void;
}) {
  const m = useFragment(MediaItemFields, item);

  return (
    <label
      className={`relative h-[150px] md:h-[200px] lg:h-[250px] cursor-pointer rounded-xl overflow-hidden border-2 transition duration-200 ${
        selected
          ? "border-primary-600 ring-2 ring-primary-400"
          : "border-transparent"
      }`}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onSelect(m.id)}
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        aria-label={`Select media ${m.id}`}
      />

      <div className="absolute top-2 right-2 z-10">
        <div
          className={`w-5 h-5 rounded-full border border-white flex items-center justify-center text-xs font-semibold ${
            selected ? "bg-primary-50 text-primary" : "bg-white text-white"
          }`}
          aria-hidden="true"
        >
          ✓
        </div>
      </div>

      <Preview item={item} />
    </label>
  );
}
