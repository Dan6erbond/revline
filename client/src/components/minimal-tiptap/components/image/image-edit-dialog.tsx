import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  VariantProps,
  useDisclosure,
} from "@heroui/react";

import type { Editor } from "@tiptap/react";
import { Image } from "lucide-react";
import { ImageEditBlock } from "./image-edit-block";
import { ToolbarButton } from "../toolbar-button";
import type { toggleVariants } from "@/components/ui/toggle";

interface ImageEditDialogProps extends VariantProps<typeof toggleVariants> {
  editor: Editor;
}

const ImageEditDialog = ({ editor, size, variant }: ImageEditDialogProps) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <ToolbarButton
        isActive={editor.isActive("image")}
        tooltip="Image"
        aria-label="Image"
        size={size}
        variant={variant}
        onClick={onOpen}
      >
        <Image className="size-5" />
      </ToolbarButton>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="sm:max-w-lg">
          <ModalHeader>Select image</ModalHeader>
          <ModalBody>
            <p className="sr-only">Upload an image from your computer</p>
            <ImageEditBlock editor={editor} close={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export { ImageEditDialog };
