import {
  Drawer,
  DrawerContent,
  Link,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Eye, FileUp } from "lucide-react";

import CarLayout from "@/components/layout/car-layout";
import Details from "@/components/documents/details";
import Dropzone from "@/components/dropzone";
import FileIcon from "@/components/file-icon";
import SubscriptionOverlay from "@/components/subscription-overlay";
import { SubscriptionTier } from "@/gql/graphql";
import { Suspense } from "react";
import { formatBytes } from "@/utils/upload-file";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useDocumentsUpload } from "@/hooks/use-documents-upload";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const getDocuments = graphql(`
  query GetDocuments($id: ID!) {
    car(id: $id) {
      id
      documents {
        id
        name
        tags
        url
        metadata {
          contentType
          size
        }
      }
    }
  }
`);

const columns = [
  { key: "type", label: "" },
  { key: "name", label: "Name" },
  { key: "tags", label: "Tags" },
  { key: "details", label: "" },
];

export default function Documents() {
  const router = useRouter();

  const { data } = useQuery(getDocuments, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const [handleFileUpload, { uploadProgress }] = useDocumentsUpload();

  return (
    <CarLayout
      className="relative"
      style={{
        minHeight: "calc(70vh - 4rem)",
      }}
    >
      <SubscriptionOverlay
        requiredTiers={[SubscriptionTier.Diy, SubscriptionTier.Enthusiast]}
      />

      <div className="p-4 flex flex-col gap-8 container mx-auto">
        <h1 className="text-3xl">Documents</h1>
        <Table isHeaderSticky>
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={data?.car?.documents ?? []}
            emptyContent={"No rows to display."}
          >
            {(doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <FileIcon
                    contentType={doc.metadata?.contentType}
                    name={doc.name}
                    className="size-4 opacity-60"
                  />
                </TableCell>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.tags.join(", ")}</TableCell>
                <TableCell>
                  <Link href={`/cars/${router.query.id}/documents/${doc.id}`}>
                    <Eye />
                  </Link>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex flex-col gap-2">
          <Dropzone
            multiple
            value={[]}
            onChange={(files) => files.forEach((f) => handleFileUpload(f))}
            label="Drag & drop or click to browse"
            icon={<FileUp className="size-4 opacity-60" />}
          />

          {uploadProgress.length > 0 && (
            <div className="space-y-2">
              {uploadProgress.map(({ file, id, progress }) => (
                <div key={id} className="bg-background flex flex-col gap-2">
                  <Progress value={progress} size="sm" />
                  <div className="flex items-center justify-between gap-2 rounded-lg border p-2 pe-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                        <FileIcon file={file} />
                      </div>
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <p className="truncate text-[13px] font-medium">
                          {file.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {formatBytes(file.size)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Drawer
        isOpen={!!router.query["document-id"]}
        size="xl"
        onClose={() => router.push(`/cars/${router.query.id}/documents`)}
      >
        <DrawerContent>
          {(onClose) => (
            <Suspense fallback="Loading...">
              <Details
                onClose={onClose}
                id={getQueryParam(router.query["document-id"])!}
              />
            </Suspense>
          )}
        </DrawerContent>
      </Drawer>
    </CarLayout>
  );
}
