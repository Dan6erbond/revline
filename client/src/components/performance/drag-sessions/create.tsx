import { Button, Input, Textarea } from "@heroui/react";
import { SubmitHandler, useForm } from "react-hook-form";

import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";

const createDragSession = graphql(`
  mutation CreateDragSession($input: CreateDragSessionInput!) {
    createDragSession(input: $input) {
      id
      title
      notes
    }
  }
`);

type Inputs = {
  title: string;
  notes: string;
};

export default function Create() {
  const router = useRouter();

  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {},
  });

  const [mutate] = useMutation(createDragSession);

  const onSubmit: SubmitHandler<Inputs> = ({ title, notes }) => {
    mutate({
      variables: {
        input: {
          carID: getQueryParam(router.query.id)!,
          title,
          notes,
        },
      },
    }).then(({ data }) => {
      if (!data?.createDragSession) return;

      router.push(
        `/cars/${router.query.id}/performance/drag-sessions/${data.createDragSession.id}`
      );
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 max-w-screen-xl mx-auto"
    >
      <h2 className="text-2xl">Create a session</h2>
      <Input
        label="Title"
        {...register("title", { required: true })}
        variant="bordered"
      />
      <Textarea label="Notes" {...register("notes")} variant="bordered" />
      <Button type="submit" className="self-end">
        Create
      </Button>
    </form>
  );
}
