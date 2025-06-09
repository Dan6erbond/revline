import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
  DatePicker,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  NumberInput,
  Progress,
  Select,
  SelectItem,
} from "@heroui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  DistanceUnit,
  FuelCategory,
  FuelConsumptionUnit,
  FuelUp,
  FuelVolumeUnit,
  OctaneRating,
} from "@/gql/graphql";
import { FileUp, Fuel, MapPin, Percent } from "lucide-react";
import { FragmentType, graphql, useFragment } from "@/gql";
import {
  ZonedDateTime,
  getLocalTimeZone,
  now,
  parseAbsolute,
} from "@internationalized/date";
import { distanceUnits, fuelVolumeUnits } from "@/literals";
import { getDistance, getKilometers } from "@/utils/distance";
import { getFuelVolume, getLiters } from "@/utils/fuel-volume";
import { useApolloClient, useMutation } from "@apollo/client";

import Dropzone from "../dropzone";
import FileIcon from "../file-icon";
import { JSONContent } from "@tiptap/react";
import { MinimalTiptapEditor } from "../minimal-tiptap";
import { formatBytes } from "@/utils/upload-file";
import { getCurrencySymbol } from "@/utils/currency";
import { getQueryParam } from "@/utils/router";
import { useDocumentsUpload } from "@/hooks/use-documents-upload";
import { useRouter } from "next/router";
import { useUnits } from "@/hooks/use-units";
import { withNotification } from "@/utils/with-notification";

export const FuelUpFields = graphql(`
  fragment FuelUpFields on FuelUp {
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
  }
`);

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
        ...FuelUpFields
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
  fuelCategory?: FuelCategory | null;
  octaneRating?: OctaneRating | null;
  odometerKm: number;
  notes?: JSONContent;
  isFullTank: boolean;
  files: File[];
};

const createFuelUp = graphql(`
  mutation CreateFuelUp($input: CreateFuelUpInput!) {
    createFuelUp(input: $input) {
      ...FuelUpFields
    }
  }
`);

const updateFuelUp = graphql(`
  mutation UpdateFuelUp($id: ID!, $input: UpdateFuelUpInput!) {
    updateFuelUp(id: $id, input: $input) {
      ...FuelUpFields
    }
  }
`);

export default function FuelUpModal({
  settings,
  fuelUp,
  ...props
}: {
  settings?: {
    fuelConsumptionUnit?: FuelConsumptionUnit | null;
    currencyCode?: string | null;
    distanceUnit?: DistanceUnit | null;
    fuelVolumeUnit?: FuelVolumeUnit | null;
  } | null;
  fuelUp?: FragmentType<typeof FuelUpFields>;
} & Omit<ModalProps, "children">) {
  const router = useRouter();

  const client = useApolloClient();

  const fu = useFragment(FuelUpFields, fuelUp);

  const { fuelVolumeUnit, distanceUnit, currencyCode } = useUnits(settings);

  const { register, handleSubmit, control, setValue, watch, formState, reset } =
    useForm<Inputs>({
      defaultValues: {
        isFullTank: true,
        files: [],
        ...fu,
        occurredAt: fu?.occurredAt
          ? parseAbsolute(fu.occurredAt, getLocalTimeZone())
          : now(getLocalTimeZone()),
        amount: fu ? getFuelVolume(fu.amountLiters, fuelVolumeUnit) : 0,
        cost: fu?.expense?.amount ?? 0,
        relativeCost:
          fu && fu.amountLiters && fu.expense
            ? fu.expense.amount / getFuelVolume(fu.amountLiters, fuelVolumeUnit)
            : 0,
        odometerKm: fu?.odometerReading
          ? getDistance(fu.odometerReading.readingKm, distanceUnit)
          : 0,
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
      const data = client.readQuery({
        query: getFuelUps,
        variables: { id: getQueryParam(router.query.id) as string },
      });

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

  const [update, { loading: updating }] = useMutation(updateFuelUp);

  const onSubmit: SubmitHandler<Inputs> = withNotification(
    { title: "Saving fuel-up..." },
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
    }) => {
      const input = {
        occurredAt: occurredAt.toDate().toISOString(),
        station,
        amountLiters: getLiters(amount, fuelVolumeUnit),
        fuelCategory: fuelCategory,
        octaneRating: octaneRating || null,
        notes,
        cost,
        isFullTank,
        odometerKm: getKilometers(odometerKm, distanceUnit),
      };

      if (fu) {
        return update({
          variables: {
            id: fu.id,
            input,
          },
        }).then(props.onClose ?? (() => props.onOpenChange?.(false)));
      }

      return mutate({
        variables: {
          input: {
            carID: getQueryParam(router.query.id)!,
            ...input,
          },
        },
      })
        .then(({ data }) => {
          if (!data) return;

          reset();

          const fuelUp = data.createFuelUp;
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const fu = useFragment(FuelUpFields, fuelUp);
          const { expense } = fu;

          return Promise.all(
            files.map((f) =>
              handleFileUpload(f, {
                fuelUpID: fu.id,
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
        .then(props.onClose ?? (() => props.onOpenChange?.(false)));
    }
  );
  return (
    <Modal scrollBehavior="inside" {...props}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{fu ? "Update" : "Enter"} Fuel-up</ModalHeader>
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
                <Controller
                  control={control}
                  name="station"
                  render={({ field: { value, onChange, ...field } }) => (
                    <Autocomplete
                      label="Station"
                      items={[] as { key: string; label: string }[]}
                      allowsCustomValue
                      endContent={<MapPin />}
                      variant="bordered"
                      inputValue={value}
                      onInputChange={onChange}
                      {...field}
                    >
                      {(item) => (
                        <AutocompleteItem key={item.key}>
                          {item.label}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  )}
                />
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
                <Controller
                  control={control}
                  name="notes"
                  render={({ field }) => <MinimalTiptapEditor {...field} />}
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
                isLoading={loading || updating || uploadProgress.length > 0}
              >
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
