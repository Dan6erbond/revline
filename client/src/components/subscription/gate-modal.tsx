import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@heroui/react";

import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import React from "react";

export default function GateModal(props: Omit<ModalProps, "children">) {
  return (
    <Modal backdrop="blur" {...props}>
      <ModalContent className="max-w-md">
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2 text-lg font-semibold text-content1-foreground">
              <LockKeyhole className="h-5 w-5 text-primary" />
              Upgrade Required
            </ModalHeader>
            <ModalBody className="text-sm text-content3-foreground">
              <p>
                This feature is available on{" "}
                <strong className="text-content1-foreground">
                  higher-tier plans
                </strong>
                .
              </p>
              <p className="pt-2">
                Upgrade your subscription to unlock access and continue using
                this feature.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Not now
              </Button>
              <Button as={Link} color="primary" href="/subscription">
                Upgrade Plan
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
