import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberInput,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { getDistance, getKilometers } from "@/utils/distance";
import { useMutation, useQuery } from "@apollo/client";

import { DistanceUnit } from "@/gql/graphql";
import { Plus } from "lucide-react";
import { distanceUnits } from "@/literals";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useRouter } from "next/router";

const getServiceItems = graphql(`
  query GetServiceItems($id: ID!) {
    me {
      id
      profile {
        id
        distanceUnit
      }
    }
    car(id: $id) {
      id
      serviceItems {
        id
        label
        notes
        estimatedDuration
        defaultIntervalKm
        defaultIntervalMonths
        tags
        createdAt
        updatedAt
      }
    }
  }
`);

type Inputs = {
  label: string;
  notes?: string | null;
  estimatedDuration?: number;
  defaultIntervalKm?: number;
  defaultIntervalMonths?: number;
};

const createServiceItem = graphql(`
  mutation CreateServiceItem($input: CreateServiceItemInput!) {
    createServiceItem(input: $input) {
      id
      label
      notes
      estimatedDuration
      defaultIntervalKm
      defaultIntervalMonths
      tags
      createdAt
      updatedAt
    }
  }
`);

const columns = [
  { key: "label", label: "Label" },
  { key: "estimatedDuration", label: "Duration (min)" },
  { key: "defaultInterval", label: "Default interval" },
  { key: "defaultIntervalMonths", label: "Default interval (months)" },
  { key: "tags", label: "Tags" },
  { key: "notes", label: "Notes" },
];

export default function Items() {
  const router = useRouter();

  const { data } = useQuery(getServiceItems, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const distanceUnit = data?.me?.profile?.distanceUnit ?? DistanceUnit.Miles;

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const { register, handleSubmit, control } = useForm<Inputs>({
    defaultValues: {},
  });

  const [mutate] = useMutation(createServiceItem, {
    update: (cache, res) => {
      if (!res.data?.createServiceItem || !data?.car) return;

      cache.writeQuery({
        query: getServiceItems,
        variables: { id: getQueryParam(router.query.id) as string },
        data: {
          ...data,
          car: {
            ...data.car,
            serviceItems: [
              ...data.car.serviceItems,
              res.data.createServiceItem,
            ],
          },
        },
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = ({
    label,
    notes,
    estimatedDuration,
    defaultIntervalKm,
    defaultIntervalMonths,
  }) => {
    mutate({
      variables: {
        input: {
          carId: getQueryParam(router.query.id)!,
          label,
          notes,
          estimatedDuration,
          defaultIntervalKm:
            defaultIntervalKm != null
              ? getKilometers(defaultIntervalKm, distanceUnit)
              : null,
          defaultIntervalMonths,
        },
      },
    }).then(({ data }) => {
      if (!data) return;

      onClose();
    });
  };

  return (
    <>
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="flex justify-between">
          <div></div>
          <div>
            <Button
              onPress={onOpen}
              startContent={<Plus />}
              className="self-end"
            >
              Add
            </Button>
          </div>
        </div>
        <Table isHeaderSticky>
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={data?.car?.serviceItems ?? []}
            emptyContent={"No rows to display."}
          >
            {(si) => (
              <TableRow key={si.id}>
                <TableCell>{si.label}</TableCell>
                <TableCell>{si.estimatedDuration}</TableCell>
                <TableCell>
                  {si.defaultIntervalKm != null &&
                    `${getDistance(si.defaultIntervalKm, distanceUnit)} ${
                      distanceUnits[distanceUnit]
                    }`}
                </TableCell>
                <TableCell>{si.defaultIntervalMonths}</TableCell>
                <TableCell>{si.tags}</TableCell>
                <TableCell>{si.notes}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create service item</ModalHeader>
              <ModalBody>
                <form
                  id="fuel-up"
                  className="flex flex-col gap-4"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Input
                    label="Label"
                    {...register("label")}
                    variant="bordered"
                  />
                  <Controller
                    control={control}
                    name="estimatedDuration"
                    render={({ field: { onChange, ...field } }) => (
                      <NumberInput
                        label="Estimated duration"
                        endContent={"min."}
                        {...field}
                        onValueChange={onChange}
                        variant="bordered"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="defaultIntervalKm"
                    render={({ field: { onChange, ...field } }) => (
                      <NumberInput
                        label="Default interval"
                        endContent={distanceUnits[distanceUnit]}
                        {...field}
                        onValueChange={onChange}
                        variant="bordered"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="defaultIntervalMonths"
                    render={({ field: { onChange, ...field } }) => (
                      <NumberInput
                        label="Default interval"
                        endContent={"months"}
                        {...field}
                        onValueChange={onChange}
                        variant="bordered"
                      />
                    )}
                  />
                  <Textarea
                    label="Notes"
                    {...register("notes")}
                    variant="bordered"
                  />
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit" form="fuel-up">
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
