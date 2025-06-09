import { Button, Image, Input, cn } from "@heroui/react";
import {
  ChangeEvent,
  DragEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { skipToken, useMutation, useSuspenseQuery } from "@apollo/client";

import { CircleUserRound } from "lucide-react";
import { graphql } from "@/gql";
import { useSession } from "next-auth/react";
import { withNotification } from "@/utils/with-notification";

type Inputs = {
  username: string;
  firstName: string;
  lastName: string;
};

const getProfile = graphql(`
  query GetProfile {
    me {
      id
      profile {
        id
        username
        firstName
        lastName
        pictureUrl
      }
    }
  }
`);

const updateProfile = graphql(`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      username
      firstName
      lastName
    }
  }
`);

const uploadProfilePicture = graphql(`
  mutation UploadProfilePicture($input: UploadProfilePictureInput!) {
    uploadProfilePicture(input: $input) {
      id
      pictureUrl
    }
  }
`);

export default function ProfileForm() {
  const { data: session } = useSession();
  const { data } = useSuspenseQuery(
    getProfile,
    session ? undefined : skipToken
  );

  const { register, handleSubmit, reset } = useForm<Inputs>({
    defaultValues: data?.me?.profile as Inputs,
  });

  useEffect(() => {
    if (data?.me?.profile) {
      reset(data.me.profile as Inputs);
    }
  }, [data, reset]);

  const [mutateUpdateProfile, { loading: isUpdating }] =
    useMutation(updateProfile);
  const [mutateUploadProfilePicture] = useMutation(uploadProfilePicture);

  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    (file: File) => {
      mutateUploadProfilePicture({
        variables: {
          input: {
            picture: file,
          },
        },
      });
    },
    [mutateUploadProfilePicture]
  );

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
        handleFileUpload(e.dataTransfer.files[0]);
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
        handleFileUpload(e.target.files[0]);
      }
    },
    [handleFileUpload]
  );

  const onSubmit: SubmitHandler<Inputs> = withNotification(
    {},
    ({ username, firstName, lastName }: Inputs) =>
      mutateUpdateProfile({
        variables: {
          input: {
            username,
            firstName,
            lastName,
          },
        },
      })
  );

  return (
    <form
      className="flex flex-col gap-4 p-4 md:p-8 container mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className="relative inline-flex">
            {/* Drop area */}
            <div
              className={cn(
                "cursor-pointer",
                "group",
                "border-background",
                "has-[input:focus]:border-ring",
                "has-[input:focus]:ring-ring/50",
                "relative",
                "flex",
                "size-16",
                "items-center",
                "justify-center",
                "overflow-hidden",
                "rounded-full",
                "border",
                "border-dashed",
                "has-disabled:pointer-events-none",
                "has-disabled:opacity-50",
                "has-[img]:border-none",
                "has-[input:focus]:ring-[3px]"
              )}
              role="button"
              onClick={openFileDialog}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              data-dragging={isDragging || undefined}
              aria-label={
                data?.me?.profile?.pictureUrl ? "Change image" : "Upload image"
              }
            >
              {data?.me?.profile?.pictureUrl && (
                <Image
                  className="size-full object-cover"
                  src={data.me.profile.pictureUrl ?? undefined}
                  alt={data.me.profile.username ?? undefined}
                  removeWrapper
                />
              )}
              <div
                className={cn(
                  "absolute",
                  "h-full",
                  "w-full",
                  "items-center",
                  "justify-center",
                  "z-20",
                  "transition-colors",
                  data?.me?.profile?.pictureUrl
                    ? [
                        "hidden",
                        "group-data-[dragging=true]:flex",
                        "group-data-[dragging=true]:bg-secondary/20",
                        "group-data-[dragging=true]:flex",
                      ]
                    : ["bg-secondary/20", "flex"],
                  "group-hover:flex",
                  "group-hover:bg-secondary/20"
                )}
              >
                <div aria-hidden="true" className="text-black">
                  <CircleUserRound className="size-4 opacity-60" />
                </div>
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              multiple
              className="sr-only"
              aria-label="Upload file"
              ref={inputRef}
            />
          </div>
        </div>
        <Input label="Username" {...register("username")} variant="bordered" />
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <Input
          label="First name"
          {...register("firstName")}
          variant="bordered"
        />
        <Input label="Last name" {...register("lastName")} variant="bordered" />
      </div>
      <div className="flex justify-end">
        <Button color="primary" type="submit" isLoading={isUpdating}>
          Save
        </Button>
      </div>
    </form>
  );
}
