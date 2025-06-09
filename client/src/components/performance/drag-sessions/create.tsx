import { Button, Input } from "@heroui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { JSONContent } from "@tiptap/react";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
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
  notes: JSONContent;
};

export default function Create() {
  const router = useRouter();

  const { register, handleSubmit, control } = useForm<Inputs>({
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
      className="flex flex-col gap-4 container mx-auto"
    >
      <h2 className="text-2xl">Create a session</h2>
      <Input
        label="Title"
        {...register("title", { required: true })}
        variant="bordered"
      />
      <Controller
        control={control}
        name="notes"
        render={({ field }) => (
          <MinimalTiptapEditor
            placeholder="Notes"
            throttleDelay={750}
            {...field}
          />
        )}
      />{" "}
      <Button type="submit" className="self-end">
        Create
      </Button>
    </form>
  );
}
