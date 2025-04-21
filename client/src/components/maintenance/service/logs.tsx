import {
  Button,
  DatePicker,
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
  Select,
  SelectItem,
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
import { ZonedDateTime, getLocalTimeZone, now } from "@internationalized/date";
import { getDistance, getKilometers } from "@/utils/distance";
import { useMutation, useQuery } from "@apollo/client";

import { DistanceUnit } from "@/gql/graphql";
import { distanceUnits } from "@/literals";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useMemo } from "react";
import { useRouter } from "next/router";

const getServiceLogs = graphql(`
  query GetServiceLogs($id: ID!) {
    me {
      id
      profile {
        id
        distanceUnit
      }
    }
    car(id: $id) {
      id
      serviceLogs {
        id
        datePerformed
        odometerReading {
          id
          readingKm
          notes
          createdAt
          updatedAt
        }
        notes
        items {
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
        schedule {
          id
          title
          notes
          repeatEveryKm
          repeatEveryMonths
          startsAtKm
          startsAtDate
          archived
          createdAt
          updatedAt
        }
        performedBy
        createdAt
        updatedAt
      }
    }
  }
`);

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

const getServiceSchedules = graphql(`
  query GetServiceSchedules($id: ID!) {
    me {
      id
      profile {
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
          estimatedDuration
          defaultIntervalKm
          defaultIntervalMonths
          tags
          createdAt
          updatedAt
        }
        repeatEveryKm
        repeatEveryMonths
        startsAtKm
        startsAtDate
        archived
        createdAt
        updatedAt
      }
    }
  }
`);

type Inputs = {
  datePerformed: ZonedDateTime;
  odometerKm: number;
  notes: string;
  performedBy?: string | null;
  scheduleId?: string | null;
  serviceItemIds: string[];
};

const createServiceLog = graphql(`
  mutation CreateServiceLog($input: CreateServiceLogInput!) {
    createServiceLog(input: $input) {
      id
      datePerformed
      odometerReading {
        id
        readingKm
        notes
        createdAt
        updatedAt
      }
      notes
      items {
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
      schedule {
        id
        title
        notes
        repeatEveryKm
        repeatEveryMonths
        startsAtKm
        startsAtDate
        archived
        createdAt
        updatedAt
      }
      performedBy
      createdAt
      updatedAt
    }
  }
`);

const columns = [
  { key: "datePerformed", label: "Date performed" },
  { key: "odometer", label: "Odometer" },
  { key: "items", label: "Items" },
  { key: "schedule", label: "Schedule" },
  { key: "notes", label: "Notes" },
  { key: "performedBy", label: "Performed by" },
];

export default function Logs() {
  const router = useRouter();

  const { data } = useQuery(getServiceLogs, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const distanceUnit = data?.me?.profile?.distanceUnit ?? DistanceUnit.Miles;

  const { data: serviceItems } = useQuery(getServiceItems, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const { data: serviceSchedules } = useQuery(getServiceSchedules, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const { register, handleSubmit, control, watch, setValue } = useForm<Inputs>({
    defaultValues: {
      datePerformed: now(getLocalTimeZone()),
      serviceItemIds: [],
    },
  });

  const [serviceItemIds, scheduleId] = watch(["serviceItemIds", "scheduleId"]);

  const selectedSchedule = useMemo(
    () =>
      serviceSchedules?.car?.serviceSchedules.find((s) => s.id === scheduleId),
    [serviceSchedules, scheduleId]
  );

  const [mutate] = useMutation(createServiceLog, {
    update: (cache, res) => {
      if (!res.data?.createServiceLog || !data?.car) return;

      cache.writeQuery({
        query: getServiceLogs,
        variables: { id: getQueryParam(router.query.id) as string },
        data: {
          ...data,
          car: {
            ...data.car,
            serviceLogs: [...data.car.serviceLogs, res.data.createServiceLog],
          },
        },
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = ({
    datePerformed,
    odometerKm,
    performedBy,
    notes,
    serviceItemIds,
    scheduleId,
  }) => {
    mutate({
      variables: {
        input: {
          carId: getQueryParam(router.query.id)!,
          datePerformed: datePerformed.toDate().toISOString(),
          odometerKm: getKilometers(odometerKm, distanceUnit),
          performedBy,
          notes,
          serviceItemIds,
          scheduleId,
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
            items={data?.car?.serviceLogs ?? []}
            emptyContent={"No rows to display."}
          >
            {(sl) => (
              <TableRow key={sl.id}>
                <TableCell>
                  {new Date(sl.datePerformed).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {sl.odometerReading?.readingKm &&
                    getDistance(
                      sl.odometerReading?.readingKm,
                      distanceUnit
                    ).toLocaleString()}
                </TableCell>
                <TableCell>{sl.items.map((i) => i.label).join(", ")}</TableCell>
                <TableCell>{sl.schedule?.title}</TableCell>
                <TableCell>{sl.notes}</TableCell>
                <TableCell>{sl.performedBy}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create service log</ModalHeader>
              <ModalBody>
                <form
                  id="fuel-up"
                  className="flex flex-col gap-4"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Controller
                    name="datePerformed"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        hideTimeZone
                        showMonthAndYearPickers
                        label="Date performed"
                        {...field}
                        variant="bordered"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="odometerKm"
                    render={({ field: { onChange, ...field } }) => (
                      <NumberInput
                        label="Odometer"
                        endContent={distanceUnits[distanceUnit]}
                        {...field}
                        onValueChange={onChange}
                        variant="bordered"
                      />
                    )}
                  />
                  <Select
                    items={serviceSchedules?.car?.serviceSchedules}
                    label="Schedule"
                    {...register("scheduleId")}
                    variant="bordered"
                    renderValue={(items) =>
                      items.map(({ data: schedule }) => (
                        <div key={schedule?.id} className="flex flex-col">
                          <span className="text-small">{schedule?.title}</span>
                        </div>
                      ))
                    }
                  >
                    {(schedule) => (
                      <SelectItem key={schedule.id}>
                        <div className="flex flex-col">
                          <span className="text-small">{schedule.title}</span>
                        </div>
                      </SelectItem>
                    )}
                  </Select>
                  {selectedSchedule ? (
                    <div className="flex flex-col gap-2">
                      <p>Notes</p>
                      <span className="text-sm text-default-400">
                        {selectedSchedule.notes}
                      </span>
                      <p>Items</p>
                      <ul>
                        {selectedSchedule.items.map(({ id, label, notes }) => (
                          <li key={id} className="flex justify-between">
                            <div>
                              <p className="text-sm text-default-700">
                                {label}
                              </p>
                              <p className="text-xs text-default-400">
                                {notes}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <p>Items</p>
                      <ul>
                        {serviceItemIds.map((id) => (
                          <li key={id} className="flex justify-between">
                            <div>
                              <p className="text-sm text-default-700">
                                {
                                  serviceItems?.car?.serviceItems.find(
                                    (si) => si.id === id
                                  )?.label
                                }
                              </p>
                              <p className="text-xs text-default-400">
                                {
                                  serviceItems?.car?.serviceItems.find(
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
                          items={serviceItems?.car?.serviceItems.filter(
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
                  )}
                  <Textarea
                    label="Notes"
                    {...register("notes")}
                    variant="bordered"
                  />
                  <Input
                    label="Performed by"
                    {...register("performedBy")}
                    variant="bordered"
                    description="Leave empty if done by yourself"
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
