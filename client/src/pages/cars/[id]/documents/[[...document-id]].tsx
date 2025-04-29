import {
  ChangeEvent,
  DragEvent,
  Suspense,
  useCallback,
  useRef,
  useState,
} from "react";
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
import { Eye, ImageUp } from "lucide-react";
import { formatBytes, uploadFile } from "@/utils/upload-file";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";

import { Car } from "@/gql/graphql";
import CarLayout from "@/components/layout/car-layout";
import Details from "../../../../components/documents/details";
import FileIcon from "@/components/file-icon";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
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

const uploadDocument = graphql(`
  mutation UploadDocument($input: CreateDocumentInput!) {
    uploadDocument(input: $input) {
      document {
        id
        name
        tags
        url
      }
      uploadUrl
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

  const client = useApolloClient();

  const { data } = useQuery(getDocuments, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const [mutate] = useMutation(uploadDocument);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<
    {
      id: string;
      file: File;
      progress: number;
      completed: boolean;
      error?: string;
    }[]
  >([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }

    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileUpload = useCallback(
    async (file: File) => {
      const res = await mutate({
        variables: {
          input: {
            carID: getQueryParam(router.query.id) as string,
            name: file.name,
          },
        },
      });

      if (!res.data?.uploadDocument) return;

      setUploadProgress((prev) => [
        ...prev,
        {
          id: res.data!.uploadDocument.document.id,
          file,
          completed: false,
          progress: 0,
        },
      ]);

      await uploadFile(
        file,
        res.data.uploadDocument.uploadUrl,
        "PUT",
        (progress) => {
          setUploadProgress((prev) =>
            prev.map((p) =>
              p.id === res.data!.uploadDocument.document.id
                ? { ...p, progress }
                : p
            )
          );
        }
      );

      setUploadProgress((prev) =>
        prev.filter((p) => p.id !== res.data!.uploadDocument.document.id)
      );

      client.cache.modify<Car>({
        id: client.cache.identify({
          __typename: "Car",
          id: getQueryParam(router.query.id),
        }),
        fields: {
          documents(existingDocRefs, { toReference }) {
            return [
              ...(existingDocRefs ?? []),
              toReference(res.data!.uploadDocument.document),
            ];
          },
        },
      });
    },
    [mutate, router.query.id, client]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      // Don't process files if the input is disabled
      if (inputRef.current?.disabled) {
        return;
      }

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        [...e.dataTransfer.files].forEach(handleFileUpload);
      }
    },
    [handleFileUpload]
  );

  const openFileDialog = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        [...e.target.files].forEach(handleFileUpload);
      }
    },
    [handleFileUpload]
  );

  return (
    <CarLayout>
      <div className="p-4 flex flex-col gap-4">
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
          <div className="relative">
            {/* Drop area */}
            <div
              role="button"
              onClick={openFileDialog}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              data-dragging={isDragging || undefined}
              className="cursor-pointer border-input hover:bg-secondary/20 data-[dragging=true]:bg-secondary/20 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]"
            >
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                className="sr-only"
                aria-label="Upload file"
                ref={inputRef}
              />
              <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                <div
                  className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                  aria-hidden="true"
                >
                  <ImageUp className="size-4 opacity-60" />
                </div>
                <p className="mb-1.5 text-sm font-medium">
                  Drop & drop or click to browse
                </p>
              </div>
            </div>
          </div>

          {/* {errors.length > 0 && (
            <div
              className="text-destructive flex items-center gap-1 text-xs"
              role="alert"
            >
              <AlertCircle className="size-3 shrink-0" />
              <span>{errors[0]}</span>
            </div>
          )} */}

          {/* File list */}
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
