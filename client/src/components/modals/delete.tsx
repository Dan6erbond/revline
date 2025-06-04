import ConfirmModal, { ConfirmModalProps } from "./confirm";

import { Trash2 } from "lucide-react";

export default function DeleteModal({
  onDelete,
  titleMessage,
  ...props
}: {
  onDelete: () => void | Promise<void>;
  titleMessage?: string;
} & Omit<ConfirmModalProps, "onConfirm">) {
  return (
    <ConfirmModal
      title={
        <span className="flex items-center gap-2 text-danger">
          <Trash2 className="size-5" />
          {titleMessage ?? "Are you sure you want to delete?"}
        </span>
      }
      message="This action cannot be undone."
      confirmLabel="Delete"
      confirmProps={{ variant: "flat", color: "danger" }}
      cancelLabel="Cancel"
      onConfirm={onDelete}
      {...props}
    />
  );
}
