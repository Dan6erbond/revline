import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
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
import { ZonedDateTime, getLocalTimeZone, now } from "@internationalized/date";
import { useMutation, useQuery } from "@apollo/client";

import { Plus } from "lucide-react";
import { getQueryParam } from "../../../utils/router";
import { graphql } from "../../../gql";
import { useRouter } from "next/router";

const getServiceLogs = graphql(`
  query GetServiceLogs($id: ID!) {
    car(id: $id) {
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

type Inputs = {
  datePerformed: ZonedDateTime;
  odometerKm: number;
  notes: string;
  performedBy?: string | null;
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
  { key: "odometerKm", label: "Odometer (km)" },
  { key: "notes", label: "Notes" },
  { key: "performedBy", label: "Performed by" },
];

export default function Logs() {
  const router = useRouter();

  const { data } = useQuery(getServiceLogs, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const { register, handleSubmit, control } = useForm<Inputs>({
    defaultValues: {
      datePerformed: now(getLocalTimeZone()),
    },
  });

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
  }) => {
    mutate({
      variables: {
        input: {
          carId: getQueryParam(router.query.id)!,
          datePerformed: datePerformed.toDate().toISOString(),
          odometerKm,
          performedBy,
          notes,
          serviceItemIds: [],
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
            {(fu) => (
              <TableRow key={fu.id}>
                <TableCell>
                  {new Date(fu.datePerformed).toLocaleDateString()}
                </TableCell>
                <TableCell>{fu.odometerReading?.readingKm}</TableCell>
                <TableCell>{fu.notes}</TableCell>
                <TableCell>{fu.performedBy}</TableCell>
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
                  <Input
                    type="number"
                    label="Odometer"
                    endContent={"km"}
                    {...register("odometerKm", { valueAsNumber: true })}
                    variant="bordered"
                  />
                  <Textarea
                    label="Notes"
                    {...register("notes")}
                    variant="bordered"
                  />
                  <Input
                    label="Performed by"
                    {...register("performedBy")}
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
