import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  DatePicker,
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
import {
  Bar,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  DistanceUnit,
  FuelCategory,
  FuelConsumptionUnit,
  FuelUp,
  FuelVolumeUnit,
  OctaneRating,
} from "@/gql/graphql";
import { FileUp, Fuel, MapPin, Percent, Plus } from "lucide-react";
import { ZonedDateTime, getLocalTimeZone, now } from "@internationalized/date";
import {
  distanceUnits,
  fuelConsumptionUnitsShort,
  fuelVolumeUnits,
} from "@/literals";
import { getDistance, getKilometers } from "@/utils/distance";
import { getFuelVolume, getLiters } from "@/utils/fuel-volume";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";

import DocumentChip from "../documents/chip";
import Dropzone from "../dropzone";
import FileIcon from "../file-icon";
import { formatBytes } from "@/utils/upload-file";
import { getCurrencySymbol } from "@/utils/currency";
import { getFuelConsumption } from "@/utils/fuel-consumption";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useDocumentsUpload } from "@/hooks/use-documents-upload";
import { useRouter } from "next/router";
import { withNotification } from "@/utils/with-notification";

const getFuelUps = graphql(`
  query GetFuelUps($id: ID!) {
    me {
      id
      settings {
        id
        fuelConsumptionUnit
        currencyCode
        distanceUnit
        fuelVolumeUnit
      }
    }
    car(id: $id) {
      id
      fuelUps {
        id
        occurredAt
        station
        amountLiters
        expense {
          id
          amount
        }
        fuelCategory
        octaneRating
        odometerReading {
          id
          readingKm
        }
        notes
        isFullTank
        documents {
          id
          name
          tags
          metadata {
            contentType
          }
        }
      }
      averageConsumptionLitersPerKm
    }
  }
`);

type Inputs = {
  occurredAt: ZonedDateTime;
  station: string;
  amount: number;
  cost: number;
  relativeCost: number;
  fuelCategory: FuelCategory;
  octaneRating: OctaneRating;
  odometerKm: number;
  notes: string;
  isFullTank: boolean;
  files: File[];
};

const createFuelUp = graphql(`
  mutation CreateFuelUp($input: CreateFuelUpInput!) {
    createFuelUp(input: $input) {
      id
      occurredAt
      station
      amountLiters
      expense {
        id
        amount
      }
      fuelCategory
      octaneRating
      odometerReading {
        id
        readingKm
      }
      notes
      isFullTank
      expense {
        id
      }
    }
  }
`);

const columns = [
  { key: "occurredAt", label: "Occurred At" },
  { key: "station", label: "Station" },
  { key: "amount", label: "Amount" },
  { key: "cost", label: "Cost" },
  { key: "fuelCategory", label: "Fuel Category" },
  { key: "odometer", label: "Odometer" },
  { key: "notes", label: "Notes" },
  { key: "fullTank", label: "Full Tank" },
  { key: "documents", label: "Documents" },
];

export default function FuelUps() {
  const router = useRouter();

  const client = useApolloClient();

  const { data } = useQuery(getFuelUps, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const fuelVolumeUnit =
    data?.me?.settings?.fuelVolumeUnit ?? FuelVolumeUnit.Gallon;
  const distanceUnit = data?.me?.settings?.distanceUnit ?? DistanceUnit.Miles;
  const currencyCode = data?.me?.settings?.currencyCode ?? "USD";
  const fuelConsumptionUnit =
    data?.me?.settings?.fuelConsumptionUnit ?? FuelConsumptionUnit.Mpg;

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const { register, handleSubmit, control, setValue, watch, formState, reset } =
    useForm<Inputs>({
      defaultValues: {
        occurredAt: now(getLocalTimeZone()),
        isFullTank: true,
        files: [],
      },
    });

  const [amount, cost, relativeCost, fuelCategory] = watch([
    "amount",
    "cost",
    "relativeCost",
    "fuelCategory",
  ]);

  const [handleFileUpload, { uploadProgress }] = useDocumentsUpload();

  const [mutate, { loading }] = useMutation(createFuelUp, {
    update: (cache, res) => {
      if (!res.data?.createFuelUp || !data?.car) return;

      cache.writeQuery({
        query: getFuelUps,
        variables: { id: getQueryParam(router.query.id) as string },
        data: {
          ...data,
          car: {
            ...data.car,
            fuelUps: [...(data.car.fuelUps ?? []), res.data.createFuelUp],
          },
        },
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = withNotification(
    {},
    ({
      occurredAt,
      station,
      amount,
      cost,
      fuelCategory,
      octaneRating,
      odometerKm,
      notes,
      isFullTank,
      files,
    }) =>
      mutate({
        variables: {
          input: {
            carID: getQueryParam(router.query.id)!,
            occurredAt: occurredAt.toDate().toISOString(),
            station,
            amountLiters: getLiters(amount, fuelVolumeUnit),
            cost,
            fuelCategory,
            octaneRating: octaneRating || null,
            odometerKm: getKilometers(odometerKm, distanceUnit),
            notes,
            isFullTank,
          },
        },
      })
        .then(({ data }) => {
          if (!data) return;

          reset();

          const fuelUp = data.createFuelUp;
          const { expense } = fuelUp;

          return Promise.all(
            files.map((f) =>
              handleFileUpload(f, {
                fuelUpID: fuelUp.id,
                expenseID: expense?.id,
              }).then(({ data }) => {
                if (!data?.uploadDocument) return;

                client.cache.modify<FuelUp>({
                  id: client.cache.identify(fuelUp),
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
      <div className="flex flex-col gap-4 md:gap-8 pt-4 md:pt-8 container mx-auto">
        <div className="flex justify-between">
          <div>
            {data?.car.averageConsumptionLitersPerKm && (
              <Card className="bg-primary-50/5 border border-border rounded-xl shadow-sm">
                <CardHeader className="flex items-center gap-3 pb-1">
                  <Fuel className="text-primary w-5 h-5" />
                  <h4 className="text-md font-medium">Average Consumption</h4>
                </CardHeader>
                <CardBody className="pt-1 text-2xl font-semibold text-foreground">
                  {getFuelConsumption(
                    data.car.averageConsumptionLitersPerKm,
                    fuelConsumptionUnit
                  ).toLocaleString()}{" "}
                  <span className="text-muted-foreground text-base font-normal">
                    {fuelConsumptionUnitsShort[fuelConsumptionUnit]}
                  </span>
                </CardBody>
              </Card>
            )}
          </div>
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
        <div className="aspect-video min-h-[300px] rounded-2xl bg-primary/5 backdrop-blur-xl px-6 md:px-10 py-8 md:py-12 border border-primary/10 shadow-sm">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data?.car.fuelUps?.map((fu) => ({
                ...fu,
                occurredAt: new Date(fu.occurredAt).toLocaleDateString(),
                relativeCost: fu.expense?.amount
                  ? fu.expense.amount / fu.amountLiters
                  : 0,
                amount: getFuelVolume(fu.amountLiters, fuelVolumeUnit),
              }))}
            >
              <XAxis
                dataKey="occurredAt"
                tick={{ fill: "hsl(var(--heroui-foreground))", fontSize: 12 }}
                stroke="hsl(var(--heroui-foreground))"
              />
              <YAxis
                yAxisId="amount"
                dataKey="amount"
                unit={fuelVolumeUnits[fuelVolumeUnit]}
                tick={{ fill: "hsl(var(--heroui-foreground))", fontSize: 12 }}
                stroke="hsl(var(--heroui-foreground))"
              />
              <YAxis
                yAxisId="cost"
                orientation="right"
                dataKey="relativeCost"
                unit={getCurrencySymbol(currencyCode)}
                tick={{ fill: "hsl(var(--heroui-foreground))", fontSize: 12 }}
                stroke="hsl(var(--heroui-foreground))"
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--heroui-background))",
                  color: "hsl(var(--heroui-foreground))",
                  borderRadius: "0.5rem",
                  border: "1px solid hsl(var(--heroui-default))",
                }}
                labelStyle={{ color: "hsl(var(--heroui-foreground))" }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: 16,
                  color: "hsl(var(--heroui-foreground))",
                }}
              />
              <Bar
                yAxisId="amount"
                dataKey="amount"
                fill="hsl(var(--heroui-secondary-400))"
                name={`Amount (${fuelVolumeUnits[fuelVolumeUnit]})`}
              />
              <Line
                yAxisId="cost"
                type="monotone"
                dataKey="relativeCost"
                stroke="hsl(var(--heroui-primary))"
                strokeWidth={2.5}
                dot={{
                  r: 4,
                  strokeWidth: 2,
                  stroke: "hsl(var(--heroui-primary))",
                  fill: "white",
                }}
                name={`Cost (${getCurrencySymbol(currencyCode)}/L)`}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <Table isHeaderSticky>
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={data?.car?.fuelUps ?? []}
            emptyContent={"No rows to display."}
          >
            {(fu) => (
              <TableRow key={fu.id}>
                <TableCell>
                  {new Date(fu.occurredAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{fu.station}</TableCell>
                <TableCell>
                  {getFuelVolume(fu.amountLiters, fuelVolumeUnit)}{" "}
                  {fuelVolumeUnits[fuelVolumeUnit]}
                </TableCell>
                <TableCell>
                  {fu.expense?.amount.toLocaleString([], {
                    style: "currency",
                    currency: currencyCode,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell>{`${fu.fuelCategory}${
                  fu.fuelCategory === FuelCategory.Petrol
                    ? " (" + fu.octaneRating + ")"
                    : ""
                }`}</TableCell>
                <TableCell>
                  {fu.odometerReading?.readingKm &&
                    `${getDistance(
                      fu.odometerReading?.readingKm,
                      distanceUnit
                    ).toLocaleString()} ${distanceUnits[distanceUnit]}`}
                </TableCell>
                <TableCell>{fu.notes}</TableCell>
                <TableCell>
                  <Checkbox isSelected={fu.isFullTank} isReadOnly />
                </TableCell>
                <TableCell className="flex gap-2 flex-wrap">
                  {fu.documents?.map((doc) => (
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
              <ModalHeader>Enter Fuel-up</ModalHeader>
              <ModalBody>
                <form
                  id="fuel-up"
                  className="flex flex-col gap-4"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Controller
                    name="occurredAt"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        hideTimeZone
                        showMonthAndYearPickers
                        label="Date"
                        {...field}
                        variant="bordered"
                      />
                    )}
                  />
                  <Autocomplete
                    label="Station"
                    items={[] as { key: string; label: string }[]}
                    allowsCustomValue
                    endContent={<MapPin />}
                    {...register("station")}
                    variant="bordered"
                  >
                    {(item) => (
                      <AutocompleteItem key={item.key}>
                        {item.label}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                  <div className="flex flex-wrap gap-4">
                    <Controller
                      control={control}
                      name="amount"
                      render={({ field: { onChange, ...field } }) => (
                        <NumberInput
                          label="Amount"
                          className="min-w-36"
                          endContent={fuelVolumeUnits[fuelVolumeUnit]}
                          {...field}
                          onValueChange={(value) => {
                            onChange(value);
                            if (formState.touchedFields.relativeCost) {
                              setValue("relativeCost", cost / value);
                            } else if (formState.touchedFields.cost) {
                              setValue("cost", relativeCost * value);
                            }
                          }}
                          variant="bordered"
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="cost"
                      render={({ field: { onChange, ...field } }) => (
                        <NumberInput
                          label="Cost"
                          className="min-w-36"
                          endContent={getCurrencySymbol(currencyCode)}
                          {...field}
                          onValueChange={(value) => {
                            onChange(value);
                            if (formState.touchedFields.amount) {
                              setValue("relativeCost", value / amount);
                            } else if (formState.touchedFields.relativeCost) {
                              setValue("amount", value / relativeCost);
                            }
                          }}
                          variant="bordered"
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="relativeCost"
                      render={({ field: { onChange, ...field } }) => (
                        <NumberInput
                          label={`Cost per ${fuelVolumeUnits[fuelVolumeUnit]}`}
                          className="min-w-36"
                          endContent={`${getCurrencySymbol(currencyCode)}/${
                            fuelVolumeUnits[fuelVolumeUnit]
                          }`}
                          {...field}
                          onValueChange={(value) => {
                            onChange(value);
                            if (formState.touchedFields.amount) {
                              setValue("cost", value * amount);
                            } else if (formState.touchedFields.cost) {
                              setValue("amount", cost / value);
                            }
                          }}
                          variant="bordered"
                        />
                      )}
                    />
                  </div>
                  <Select
                    label="Fuel category"
                    endContent={<Fuel />}
                    {...register("fuelCategory")}
                    variant="bordered"
                  >
                    {Object.entries(FuelCategory).map(([label, category]) => (
                      <SelectItem key={category}>{label}</SelectItem>
                    ))}
                  </Select>
                  {fuelCategory === FuelCategory.Petrol && (
                    <Select
                      label="Octane rating"
                      endContent={<Percent />}
                      {...register("octaneRating")}
                      variant="bordered"
                    >
                      {Object.entries(OctaneRating).map(
                        ([label, octaneRating]) => (
                          <SelectItem key={octaneRating}>{label}</SelectItem>
                        )
                      )}
                    </Select>
                  )}
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
                  <Textarea
                    label="Notes"
                    {...register("notes")}
                    variant="bordered"
                  />
                  <Checkbox {...register("isFullTank")}>Tank full</Checkbox>
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
                  form="fuel-up"
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
