import { Button, Input } from "@heroui/react";
import { SubmitHandler, useForm } from "react-hook-form";

import React from "react";
import RootNavbar from "@/components/layout/root-navbar";
import { User } from "../../gql/graphql";
import { graphql } from "@/gql";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";

type Inputs = {
  name: string;
  make?: string | null;
  model?: string | null;
  year?: number | null;
  trim?: string | null;
};

const NewCar = graphql(`
  fragment NewCar on Car {
    id
    owner {
      id
    }
  }
`);

const createCar = graphql(`
  mutation CreateCar($input: CreateCarInput!) {
    createCar(input: $input) {
      id
      ...NewCar
    }
  }
`);

export default function CreateCar() {
  const router = useRouter();

  const { register, handleSubmit } = useForm<Inputs>();

  const [mutate] = useMutation(createCar, {
    update: (cache, { data }) => {
      if (!data?.createCar) return;

      const newCarRef = cache.writeFragment({
        data: data.createCar,
        fragment: NewCar,
        fragmentName: "NewCar",
      });

      cache.modify<User>({
        id: cache.identify(data!.createCar!.owner!),
        fields: {
          cars: (existingCarRefs) => {
            return [...(existingCarRefs ?? []), newCarRef];
          },
        },
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = ({ name, make, model, year }) => {
    mutate({
      variables: {
        input: { name, make, model, year },
      },
    }).then(({ data }) => {
      if (!data) return;

      router.push(`/cars/${data.createCar.id}`);
    });
  };

  return (
    <>
      <RootNavbar pathname={router.pathname} path={router.asPath} />
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl">Create Car</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4"
        >
          <Input
            label="Name"
            variant="bordered"
            {...register("name", { required: true })}
            isRequired
          />
          <div className="flex flex-col md:flex-row gap-4">
            <Input label="Make" variant="bordered" {...register("make")} />
            <Input label="Model" variant="bordered" {...register("model")} />
            <Input
              label="Year"
              type="number"
              variant="bordered"
              {...register("year", { valueAsNumber: true })}
            />
          </div>
          <Input label="Trim" variant="bordered" {...register("trim")} />
          <Button className="self-end" type="submit">
            Create
          </Button>
        </form>
      </div>
    </>
  );
}
