import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@heroui/react";

import { FragmentType } from "@/gql";
import { ModProductOptionDetails } from "./shared";
import ProductOptionForm from "./form";

export default function ProductOptionModal({
  productOption,
  modId,
  onOpenChange,
  currencyCode,
  ...props
}: {
  productOption?: FragmentType<typeof ModProductOptionDetails>;
  modId: string;
  currencyCode: string;
} & Omit<ModalProps, "children">) {
  return (
    <Modal
      scrollBehavior="inside"
      size="2xl"
      {...props}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {productOption ? "Edit product option" : "Add product option"}
            </ModalHeader>
            <ModalBody>
              <ProductOptionForm
                productOption={productOption}
                onSubmit={() => onOpenChange?.(false)}
                currencyCode={currencyCode}
                modId={modId}
                id="product-option"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" type="submit" form="product-option">
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
