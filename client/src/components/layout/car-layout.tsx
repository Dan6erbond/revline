import { ArrowLeft, ImageUp, Upload, X } from "lucide-react";
import {
  Button,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import {
  ChangeEvent,
  DragEvent,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";
import { useMutation, useQuery } from "@apollo/client";

import CarNavbar from "./car-navbar";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { uploadFile } from "@/utils/upload-file";
import { useRouter } from "next/router";

const getCarBanner = graphql(`
  query GetCarBanner($id: ID!) {
    car(id: $id) {
      id
      name
      bannerImageUrl
    }
  }
`);

const uploadBannerImage = graphql(`
  mutation UploadBannerImage($input: UploadMediaInput!) {
    uploadBannerImage(input: $input) {
      media {
        id
      }
      uploadUrl
    }
  }
`);

export default function CarLayout({ children }: { children?: ReactNode }) {
  const router = useRouter();

  const { data, refetch } = useQuery(getCarBanner, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const [mutate] = useMutation(uploadBannerImage);

  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

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

  const handleFileUpload = useCallback(async () => {
    if (!bannerImage) return;

    mutate({
      variables: {
        input: {
          carId: getQueryParam(router.query.id) as string,
        },
      },
    }).then(async ({ data }) => {
      if (!data?.uploadBannerImage) {
        onClose();
        return;
      }

      await uploadFile(bannerImage, data.uploadBannerImage.uploadUrl, "PUT");

      refetch();
      onClose();
    });
  }, [mutate, bannerImage, router.query.id, onClose, refetch]);

  const handleChange = useCallback((file: File | null) => {
    setBannerImage(file);
    setPreviewUrl(file && URL.createObjectURL(file));
  }, []);

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
        handleChange(e.dataTransfer.files[0]);
      }
    },
    [handleChange]
  );

  const openFileDialog = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleChange(e.target.files[0]);
      }
    },
    [handleChange]
  );

  return (
    <>
      <CarNavbar />
      <div className="h-[30vh] relative">
        <Image
          className="absolute h-full w-full top-0 left-0 rounded-none object-cover"
          removeWrapper
          src={data?.car?.bannerImageUrl ?? "/placeholder.png"}
          alt={data?.car?.name}
        />
      </div>
      <div className="sticky h-18 top-16 -mt-18 w-full z-20 bg-zinc-900/70 backdrop-blur-sm p-2 md:p-4 flex gap-4">
        <Button
          as={Link}
          href={`/cars/${getQueryParam(router.query.id)}`}
          isIconOnly
        >
          <ArrowLeft />
        </Button>
        <h2 className="text-3xl text-white">{data?.car?.name}</h2>
        <Button isIconOnly className="ml-auto" onPress={onOpen}>
          <Upload />
        </Button>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Upload banner image</ModalHeader>
              <ModalBody>
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
                        accept="image/*"
                        onChange={handleFileChange}
                        multiple
                        className="sr-only"
                        aria-label="Upload file"
                        ref={inputRef}
                      />
                      {previewUrl ? (
                        <div className="absolute inset-0">
                          <Image
                            src={previewUrl}
                            alt={"Uploaded image"}
                            className="size-full object-cover object-center"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                          <div
                            className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                            aria-hidden="true"
                          >
                            <ImageUp className="size-4 opacity-60" />
                          </div>
                          <p className="mb-1.5 text-sm font-medium">
                            Drop your image here or click to browse
                          </p>
                        </div>
                      )}
                    </div>
                    {previewUrl && (
                      <div className="absolute top-4 right-4">
                        <button
                          type="button"
                          className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
                          onClick={() => handleChange(null)}
                          aria-label="Remove image"
                        >
                          <X className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* errors.length > 0 && (
                    <div
                      className="text-destructive flex items-center gap-1 text-xs"
                      role="alert"
                    >
                      <AlertCircleIcon className="size-3 shrink-0" />
                      <span>{errors[0]}</span>
                    </div>
                  ) */}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleFileUpload}>
                  Upload
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <main>{children}</main>
    </>
  );
}
