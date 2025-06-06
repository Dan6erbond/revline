import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
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
import { Plus, Trash } from "lucide-react";
import { getDistance, getKilometers } from "@/utils/distance";
import { useMutation, useQuery } from "@apollo/client";

import { distanceUnits } from "@/literals";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useRouter } from "next/router";
import { useUnits } from "@/hooks/use-units";

const getServiceSchedules = graphql(`
  query GetServiceSchedules($id: ID!) {
    me {
      id
      settings {
        id
        distanceUnit
      }
    }
    car(id: $id) {
      id
      serviceSchedules {
        id
        title
        notes
        items {
          id
          label
          notes
          estimatedMinutes
          defaultIntervalKm
          defaultIntervalMonths
          tags
        }
        repeatEveryKm
        repeatEveryMonths
        startsAtKm
        startsAtMonths
        archived
      }
    }
  }
`);

const getServiceItems = graphql(`
  query GetServiceItems($id: ID!) {
    me {
      id
      settings {
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
        estimatedMinutes
        defaultIntervalKm
        defaultIntervalMonths
        tags
      }
    }
  }
`);

type Inputs = {
  title: string;
  notes: string;
  repeatEveryKm?: number;
  repeatEveryMonths?: number;
  startsAtKm?: number;
  startsAtMonths?: number;
  serviceItemIds: string[];
};

const createServiceSchedule = graphql(`
  mutation CreateServiceSchedule($input: CreateServiceScheduleInput!) {
    createServiceSchedule(input: $input) {
      id
      title
      notes
      items {
        id
        label
        notes
        estimatedMinutes
        defaultIntervalKm
        defaultIntervalMonths
        tags
      }
      repeatEveryKm
      repeatEveryMonths
      startsAtKm
      startsAtMonths
      archived
    }
  }
`);

const columns = [
  { key: "title", label: "Title" },
  { key: "notes", label: "Notes" },
  { key: "repeatEvery", label: "Repeat every" },
  { key: "repeatEveryMonths", label: "Repeat every" },
  { key: "startsAtKm", label: "Starts at" },
  { key: "startsAtMonths", label: "Starts at" },
  { key: "serviceItemIds", label: "Items" },
  { key: "archived", label: "Archived" },
];

export default function Schedules() {
  const router = useRouter();

  const { data } = useQuery(getServiceSchedules, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const { distanceUnit } = useUnits(data?.me?.settings);

  const { data: serviceItems } = useQuery(getServiceItems, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const { register, handleSubmit, control, watch, setValue } = useForm<Inputs>({
    defaultValues: {
      serviceItemIds: [],
    },
  });

  const serviceItemIds = watch("serviceItemIds");

  const [mutate] = useMutation(createServiceSchedule, {
    update: (cache, res) => {
      if (!res.data?.createServiceSchedule || !data?.car) return;

      cache.writeQuery({
        query: getServiceSchedules,
        variables: { id: getQueryParam(router.query.id) as string },
        data: {
          ...data,
          car: {
            ...data.car,
            serviceSchedules: [
              ...(data.car.serviceSchedules ?? []),
              res.data.createServiceSchedule,
            ],
          },
        },
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = ({
    title,
    notes,
    repeatEveryKm,
    repeatEveryMonths,
    startsAtKm,
    startsAtMonths,
    serviceItemIds,
  }) => {
    mutate({
      variables: {
        input: {
          carID: getQueryParam(router.query.id)!,
          title,
          notes,
          repeatEveryKm:
            repeatEveryKm != null
              ? getKilometers(repeatEveryKm, distanceUnit)
              : null,
          repeatEveryMonths,
          startsAtKm:
            startsAtKm != null ? getKilometers(startsAtKm, distanceUnit) : null,
          startsAtMonths,
          itemIDs: serviceItemIds,
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
            items={data?.car?.serviceSchedules ?? []}
            emptyContent={"No rows to display."}
          >
            {(sl) => (
              <TableRow key={sl.id}>
                <TableCell>{sl.title}</TableCell>
                <TableCell>{sl.notes}</TableCell>
                <TableCell>
                  {sl.repeatEveryKm &&
                    `${getDistance(
                      sl.repeatEveryKm,
                      distanceUnit
                    ).toLocaleString()} ${distanceUnits[distanceUnit]}`}
                </TableCell>
                <TableCell>
                  {sl.repeatEveryMonths && `${sl.repeatEveryMonths} months`}
                </TableCell>
                <TableCell>
                  {sl.startsAtKm &&
                    `${getDistance(
                      sl.startsAtKm,
                      distanceUnit
                    ).toLocaleString()} ${distanceUnits[distanceUnit]}`}
                </TableCell>
                <TableCell>{sl.startsAtMonths}</TableCell>
                <TableCell>
                  {sl.items?.map((i) => i.label).join(", ")}
                </TableCell>
                <TableCell>{sl.archived}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create service schedule</ModalHeader>
              <ModalBody>
                <form
                  id="schedule"
                  className="flex flex-col gap-4"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Input
                    label="Title"
                    {...register("title", { required: true })}
                    variant="bordered"
                  />
                  <div className="flex flex-col gap-2">
                    <p>Items</p>
                    <ul>
                      {serviceItemIds.map((id) => (
                        <li key={id} className="flex justify-between">
                          <div>
                            <p className="text-sm text-default-700">
                              {
                                serviceItems?.car?.serviceItems?.find(
                                  (si) => si.id === id
                                )?.label
                              }
                            </p>
                            <p className="text-xs text-default-400">
                              {
                                serviceItems?.car?.serviceItems?.find(
                                  (si) => si.id === id
                                )?.notes
                              }
                            </p>
                          </div>
                          <Button
                            variant="bordered"
                            color="danger"
                            size="sm"
                            isIconOnly
                            onPress={() =>
                              setValue(
                                "serviceItemIds",
                                serviceItemIds.filter((i) => id !== i)
                              )
                            }
                          >
                            <Trash size={16} />
                          </Button>
                        </li>
                      ))}
                    </ul>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          variant="bordered"
                          endContent={<Plus />}
                          className="self-end"
                        >
                          Add Item
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        items={serviceItems?.car?.serviceItems?.filter(
                          (si) => !serviceItemIds.includes(si.id)
                        )}
                      >
                        {(item) => (
                          <DropdownItem
                            key={item.id}
                            description={item.notes}
                            onPress={() =>
                              setValue("serviceItemIds", [
                                ...serviceItemIds,
                                item.id,
                              ])
                            }
                          >
                            {item.label}
                          </DropdownItem>
                        )}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <Textarea
                    label="Notes"
                    {...register("notes")}
                    variant="bordered"
                  />
                  <Controller
                    control={control}
                    name="repeatEveryKm"
                    render={({ field: { onChange, ...field } }) => (
                      <NumberInput
                        label="Repeat every"
                        endContent={distanceUnits[distanceUnit]}
                        {...field}
                        onValueChange={onChange}
                        variant="bordered"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="repeatEveryMonths"
                    render={({ field: { onChange, ...field } }) => (
                      <NumberInput
                        label="Repeat every"
                        endContent={"months"}
                        {...field}
                        onValueChange={onChange}
                        variant="bordered"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="startsAtKm"
                    render={({ field: { onChange, ...field } }) => (
                      <NumberInput
                        label="Starts at"
                        endContent={distanceUnits[distanceUnit]}
                        {...field}
                        onValueChange={onChange}
                        variant="bordered"
                      />
                    )}
                  />
                  <Controller
                    name="startsAtMonths"
                    control={control}
                    render={({ field: { onChange, ...field } }) => (
                      <NumberInput
                        label="Starts at"
                        endContent={"months"}
                        {...field}
                        onValueChange={onChange}
                        variant="bordered"
                      />
                    )}
                  />
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit" form="schedule">
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
