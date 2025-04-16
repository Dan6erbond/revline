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
import { DollarSign, Fuel, MapPin, Percent, Plus } from "lucide-react";
import { FuelCategory, OctaneRating } from "@/gql/graphql";
import { ZonedDateTime, getLocalTimeZone, now } from "@internationalized/date";
import { useMutation, useQuery } from "@apollo/client";

import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useRouter } from "next/router";

const getFuelUps = graphql(`
  query GetFuelUps($id: ID!) {
    car(id: $id) {
      id
      fuelUps {
        id
        occurredAt
        station
        amountLiters
        cost
        fuelCategory
        octane
        odometerReading {
          id
          readingKm
        }
        notes
        isFullTank
        locationLat
        locationLng
      }
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
  octane: OctaneRating;
  odometerKm: number;
  notes: string;
  isFullTank: boolean;
  locationLat: number;
  locationLng: number;
};

const createFuelUp = graphql(`
  mutation CreateFuelUp($input: CreateFuelUpInput!) {
    createFuelUp(input: $input) {
      id
      occurredAt
      station
      amountLiters
      cost
      fuelCategory
      octane
      odometerReading {
        id
        readingKm
      }
      notes
      isFullTank
      locationLat
      locationLng
    }
  }
`);

const columns = [
  { key: "occurredAt", label: "Occurred At" },
  { key: "station", label: "Station" },
  { key: "amount", label: "Amount" },
  { key: "cost", label: "Cost" },
  { key: "fuelCategory", label: "Fuel Category" },
  { key: "odometerKm", label: "Odometer (km)" },
  { key: "notes", label: "Notes" },
  { key: "fullTank", label: "Full Tank" },
];

export default function FuelUps() {
  const router = useRouter();

  const { data } = useQuery(getFuelUps, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const { register, handleSubmit, control, setValue, watch, formState } =
    useForm<Inputs>({
      defaultValues: {
        occurredAt: now(getLocalTimeZone()),
      },
    });

  const [amount, cost, relativeCost, fuelCategory] = watch([
    "amount",
    "cost",
    "relativeCost",
    "fuelCategory",
  ]);

  const [mutate] = useMutation(createFuelUp, {
    update: (cache, res) => {
      if (!res.data?.createFuelUp || !data?.car) return;

      cache.writeQuery({
        query: getFuelUps,
        variables: { id: getQueryParam(router.query.id) as string },
        data: {
          ...data,
          car: {
            ...data.car,
            fuelUps: [...data.car.fuelUps, res.data.createFuelUp],
          },
        },
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = ({
    occurredAt,
    station,
    amount,
    cost,
    fuelCategory,
    octane,
    odometerKm,
    notes,
    isFullTank,
    locationLat,
    locationLng,
  }) => {
    mutate({
      variables: {
        input: {
          carId: getQueryParam(router.query.id)!,
          occurredAt: occurredAt.toDate().toISOString(),
          station,
          amountLiters: amount,
          cost,
          fuelCategory,
          octane,
          odometerKm,
          notes,
          isFullTank,
          locationLat,
          locationLng,
        },
      },
    }).then(({ data }) => {
      if (!data) return;

      onClose();
    });
  };

  return (
    <>
      <div className="flex flex-col gap-4 md:gap-8 pt-4 md:pt-8">
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
        <div className="h-[250] md:h-[350] lg:h-[450] bg-primary-50/30 backdrop-blur-2xl rounded-lg px-4 md:px-8 py-8 md:py-12 light">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data?.car?.fuelUps.map((fu) => ({
                ...fu,
                occurredAt: new Date(fu.occurredAt).toLocaleDateString(),
                relativeCost: fu.cost / fu.amountLiters,
              }))}
            >
              <XAxis
                dataKey="occurredAt"
                tick={{ fill: "hsl(var(--heroui-foreground))" }}
                stroke="hsl(var(--heroui-foreground))"
              />
              <YAxis
                yAxisId="amount"
                type="number"
                dataKey="amountLiters"
                unit="l"
                tick={{ fill: "hsl(var(--heroui-foreground))" }}
                stroke="hsl(var(--heroui-foreground))"
              />
              <YAxis
                yAxisId="cost"
                orientation="right"
                type="number"
                dataKey="relativeCost"
                unit="$"
                tick={{ fill: "hsl(var(--heroui-foreground))" }}
                stroke="hsl(var(--heroui-foreground))"
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--heroui-background))",
                  color: "hsl(var(--heroui-foreground))",
                }}
              />
              <Legend />
              <Bar
                type="monotone"
                dataKey="amountLiters"
                fill="hsl(var(--heroui-secondary-400))"
                yAxisId="amount"
                unit="l"
                name="Amount"
              />
              <Line
                type="monotone"
                dataKey="relativeCost"
                stroke="hsl(var(--heroui-primary-400))"
                dot={{ r: 5, strokeWidth: 3 }}
                strokeWidth={3}
                yAxisId="cost"
                unit="$"
                name="Relative cost"
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
                <TableCell>{fu.amountLiters}</TableCell>
                <TableCell>{fu.cost}</TableCell>
                <TableCell>{`${fu.fuelCategory}${
                  fu.fuelCategory === FuelCategory.Petrol
                    ? " (" + fu.octane + ")"
                    : ""
                }`}</TableCell>
                <TableCell>{fu.odometerReading?.readingKm}</TableCell>
                <TableCell>{fu.notes}</TableCell>
                <TableCell>{fu.isFullTank}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
                  <div className="flex gap-4">
                    <Controller
                      control={control}
                      name="amount"
                      render={({ field: { onChange, ...field } }) => (
                        <NumberInput
                          label="Amount"
                          endContent={"l"}
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
                          endContent={<DollarSign />}
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
                          label="Cost per l"
                          endContent={"$/l"}
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
                      {...register("octane")}
                      variant="bordered"
                    >
                      {Object.entries(OctaneRating).map(([label, octane]) => (
                        <SelectItem key={octane}>{label}</SelectItem>
                      ))}
                    </Select>
                  )}
                  <Controller
                    control={control}
                    name="odometerKm"
                    render={({ field }) => (
                      <NumberInput
                        label="Odometer"
                        endContent={"km"}
                        {...field}
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
