import { Button, Input } from "@heroui/react";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { skipToken, useMutation, useSuspenseQuery } from "@apollo/client";

import { graphql } from "@/gql";
import { useSession } from "next-auth/react";

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
        profilePictureUrl
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
      profilePictureUrl
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

  const [mutateUpdateProfile] = useMutation(updateProfile);
  const [mutateUploadProfilePicture] = useMutation(uploadProfilePicture);

  const onSubmit: SubmitHandler<Inputs> = ({
    username,
    firstName,
    lastName,
  }) => {
    mutateUpdateProfile({
      variables: {
        input: {
          username,
          firstName,
          lastName,
        },
      },
    });
  };

  return (
    <form
      id="fuel-up"
      className="flex flex-col gap-4 p-4 md:p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          type="file"
          className="max-w-52"
          label="Profile picture"
          onChange={(e) => {
            if (e.target.files) {
              mutateUploadProfilePicture({
                variables: {
                  input: {
                    picture: e.target.files[0],
                  },
                },
              });
            }
          }}
          variant="bordered"
        />
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
        <Button color="primary" type="submit" form="fuel-up">
          Action
        </Button>
      </div>
    </form>
  );
}
