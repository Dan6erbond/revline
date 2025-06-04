import {
  Button,
  ButtonProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@heroui/react";

import { ReactNode } from "react";

export interface ConfirmModalProps
  extends Omit<ModalProps, "children" | "title"> {
  title?: ReactNode;
  message?: ReactNode;
  confirmLabel?: ReactNode;
  confirmProps?: ButtonProps;
  cancelLabel?: ReactNode;
  cancelProps?: ButtonProps;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export default function ConfirmModal({
  title = "Are you absolutely sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  confirmProps,
  onCancel,
  cancelProps,
  ...props
}: ConfirmModalProps) {
  return (
    <Modal {...props}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
              <p className="text-sm text-muted-foreground">{message}</p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                color="default"
                onPress={() => {
                  (onCancel ?? onClose)();
                }}
                {...cancelProps}
              >
                {cancelLabel}
              </Button>
              <Button
                color="primary"
                onPress={() => onConfirm()}
                {...confirmProps}
              >
                {confirmLabel}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
