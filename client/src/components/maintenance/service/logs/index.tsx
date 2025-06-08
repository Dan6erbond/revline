import {
  Button,
  Chip,
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
  Progress,
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
import { FileUp, Plus, Trash } from "lucide-react";
import { ZonedDateTime, getLocalTimeZone, now } from "@internationalized/date";
import { getDistance, getKilometers } from "@/utils/distance";
import {
  getServiceItems,
  getServiceLogs,
  getServiceSchedules,
} from "../shared";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";

import DocumentChip from "@/components/documents/chip";
import Dropzone from "@/components/dropzone";
import FileIcon from "@/components/file-icon";
import { ServiceLog } from "@/gql/graphql";
import TagsInput from "@/components/ui/tags-input";
import { distanceUnits } from "@/literals";
import { formatBytes } from "@/utils/upload-file";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useDocumentsUpload } from "@/hooks/use-documents-upload";
import { useMemo } from "react";
import { useRouter } from "next/router";
import { useUnits } from "@/hooks/use-units";
import { withNotification } from "@/utils/with-notification";

type Inputs = {
  datePerformed: ZonedDateTime;
  odometerKm: number;
  notes: string;
  performedBy?: string | null;
  scheduleId?: string | null;
  serviceItemIds: string[];
  files: File[];
  tags: string[];
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
      }
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
      schedule {
        id
        title
        notes
        repeatEveryKm
        repeatEveryMonths
        startsAtKm
        startsAtMonths
        archived
      }
      performedBy
      expense {
        id
      }
      tags
    }
  }
`);

const columns = [
  { key: "datePerformed", label: "Date performed" },
  { key: "odometer", label: "Odometer" },
  { key: "items", label: "Items" },
  { key: "schedule", label: "Schedule" },
  { key: "tags", label: "Tags" },
  { key: "notes", label: "Notes" },
  { key: "performedBy", label: "Performed by" },
  { key: "documents", label: "Documents" },
];

export default function Logs() {
  const router = useRouter();

  const client = useApolloClient();

  const { data } = useQuery(getServiceLogs, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const { distanceUnit } = useUnits(data?.me?.settings);

  const { data: serviceItems } = useQuery(getServiceItems, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const { data: serviceSchedules } = useQuery(getServiceSchedules, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const { register, handleSubmit, control, watch, setValue, reset } =
    useForm<Inputs>({
      defaultValues: {
        datePerformed: now(getLocalTimeZone()),
        serviceItemIds: [],
        files: [],
      },
    });

  const [serviceItemIds, scheduleId] = watch(["serviceItemIds", "scheduleId"]);

  const selectedSchedule = useMemo(
    () =>
      serviceSchedules?.car?.serviceSchedules?.find((s) => s.id === scheduleId),
    [serviceSchedules, scheduleId]
  );

  const [handleFileUpload, { uploadProgress }] = useDocumentsUpload();

  const [mutate, { loading }] = useMutation(createServiceLog, {
    update: (cache, res) => {
      if (!res.data?.createServiceLog || !data?.car) return;

      cache.writeQuery({
        query: getServiceLogs,
        variables: { id: getQueryParam(router.query.id) as string },
        data: {
          ...data,
          car: {
            ...data.car,
            serviceLogs: [
              ...(data.car.serviceLogs ?? []),
              { ...res.data.createServiceLog, documents: [] },
            ],
          },
        },
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = withNotification(
    {},
    ({
      datePerformed,
      odometerKm,
      performedBy,
      notes,
      serviceItemIds,
      scheduleId,
      files,
      tags,
    }) =>
      mutate({
        variables: {
          input: {
            carID: getQueryParam(router.query.id)!,
            datePerformed: datePerformed.toDate().toISOString(),
            odometerKm: getKilometers(odometerKm, distanceUnit),
            performedBy,
            notes,
            itemIDs: serviceItemIds,
            scheduleID: scheduleId || null,
            tags,
          },
        },
      })
        .then(({ data }) => {
          if (!data) return;

          reset();

          const log = data.createServiceLog;
          const { expense } = log;

          return Promise.all(
            files.map((f) =>
              handleFileUpload(f, {
                expenseID: expense?.id,
                serviceLogID: log.id,
              }).then(({ data }) => {
                if (!data?.uploadDocument) return;

                client.cache.modify<ServiceLog>({
                  id: client.cache.identify(log),
                  fields: {
                    documents(existingDocRefs, { toReference, readField }) {
                      return [
                        ...(existingDocRefs ?? []).filter(
                          (doc) =>
                            readField({ from: doc, fieldName: "id" }) !==
                            data!.uploadDocument.document.id
                        ),
                        toReference(data!.uploadDocument.document),
                      ];
                    },
                  },
                });
              })
            )
          );
        })
        .then(onClose)
  );

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
                <TableCell>
                  {sl.items?.map((i) => i.label).join(", ")}
                </TableCell>
                <TableCell>{sl.schedule?.title}</TableCell>
                <TableCell>
                  {sl.tags.map((tag, index) => (
                    <Chip className="flex p-2 mb-1">{tag}</Chip>
                  ))}
                </TableCell>
                <TableCell>{sl.notes}</TableCell>
                <TableCell>{sl.performedBy}</TableCell>
                <TableCell className="flex gap-2 flex-wrap">
                  {sl.documents?.map((doc) => (
                    <DocumentChip document={doc} key={doc.id} />
                  ))}
                </TableCell>
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
              <ModalHeader>Create service log</ModalHeader>
              <ModalBody>
                <form
                  id="log"
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
                  <Controller
                    control={control}
                    name="tags"
                    render={({ field: { onChange, ...field } }) => (
                      <TagsInput
                        onTagsChange={onChange}
                        label="Tags"
                        {...field}
                      />
                    )}
                  />
                  <Select
                    items={serviceSchedules?.car?.serviceSchedules ?? []}
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
                        {selectedSchedule.items?.map(({ id, label, notes }) => (
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
                  <Controller
                    control={control}
                    name="files"
                    render={({ field: { value, onChange } }) => (
                      <Dropzone
                        value={value}
                        onChange={onChange}
                        multiple
                        label="Drag & drop files or click to browse"
                        icon={<FileUp className="size-4 opacity-60" />}
                      />
                    )}
                  />
                  {uploadProgress.length > 0 && (
                    <div className="space-y-2">
                      {uploadProgress.map(({ file, id, progress }) => (
                        <div
                          key={id}
                          className="bg-background flex flex-col gap-2"
                        >
                          <Progress value={progress} size="sm" />
                          <div className="flex items-center justify-between gap-2 rounded-lg border p-2 pe-3">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                                <FileIcon file={file} />
                              </div>
                              <div className="flex min-w-0 flex-col gap-0.5">
                                <p className="truncate text-[13px] font-medium">
                                  {file.name}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {formatBytes(file.size)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  form="log"
                  isLoading={loading || uploadProgress.length > 0}
                >
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
