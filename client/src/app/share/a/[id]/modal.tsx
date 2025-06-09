import { FragmentType, useFragment } from "@/gql";
import {
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

import { MediaItemFields } from "@/components/media/shared";
import React from "react";

export default function ViewerModal({
  item,
  isOpen,
  onClose,
}: {
  item: FragmentType<typeof MediaItemFields> | null;
  isOpen?: boolean;
  onClose(): void;
}) {
  const m = useFragment(MediaItemFields, item);
  const isVideo = m?.metadata?.contentType.startsWith("video/");

  return (
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
              <p>{m?.title}</p>
            </ModalHeader>
            <ModalBody>
              {isVideo ? (
                <video className="h-full w-full object-cover" controls>
                  <source src={m?.url} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={m?.url}
                  alt={`Shared media ${m?.id}`}
                  className="object-cover h-full w-full"
                  removeWrapper
                />
              )}
            </ModalBody>
            <ModalFooter className="items-center justify-between">
              <p>{m?.description}</p>
              <p className="dark:text-white">
                Shared on Revline 1
              </p>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
