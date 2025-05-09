import { Chip, ChipProps } from "@heroui/react";

import FileIcon from "../file-icon";
import { FileMetadata } from "@/gql/graphql";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

export default function DocumentChip({
  document: doc,
  ...props
}: {
  document: {
    id: string;
    name: string;
    metadata?: Partial<FileMetadata> | null;
  };
} & ChipProps) {
  const router = useRouter();

  return (
    <Chip
      as={Link}
      href={`/cars/${router.query.id}/documents/${doc.id}`}
      startContent={
        <FileIcon
          name={doc.name}
          contentType={doc.metadata?.contentType}
          className="size-4 ml-2"
        />
      }
      {...props}
    >
      <span className="max-w-32 overflow-hidden text-ellipsis block">
        {doc.name}
      </span>
    </Chip>
  );
}
