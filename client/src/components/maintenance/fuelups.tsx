import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { DollarSign, Fuel, MapPin, Percent, Plus } from "lucide-react";
import { FuelCategory, OctaneRating } from "../../gql/graphql";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ZonedDateTime, getLocalTimeZone, now } from "@internationalized/date";
import { useMutation, useQuery } from "@apollo/client";

import React from "react";
import { getQueryParam } from "../../utils/router";
import { graphql } from "../../gql";
import { useRouter } from "next/router";

const getFuelUps = graphql(`
  query GetFuelUps($id: ID!) {
    car(id: $id) {
      id
      fuelUps {
        id
        occurredAt
        station
        amount
        cost
        fuelCategory
        octane
        odometerKm
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
      amount
      cost
      fuelCategory
      octane
      odometerKm
      notes
      isFullTank
      locationLat
      locationLng
    }
  }
`);

export default function FuelUps() {
  const router = useRouter();

  const { data } = useQuery(getFuelUps, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const { register, handleSubmit, control } = useForm<Inputs>({
    defaultValues: {
      occurredAt: now(getLocalTimeZone()),
    },
  });

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
          amount,
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
      <div className="flex flex-col gap-4">
        <Button onPress={onOpen} startContent={<Plus />} className="self-end">
          Add
        </Button>
        <div className="h-[250] md:h-[350] lg:h-[450]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data?.car?.fuelUps.map((fu) => ({
                ...fu,
                occurredAt: new Date(fu.occurredAt).toLocaleDateString(),
              }))}
            >
              <XAxis dataKey="occurredAt" />
              <YAxis />
              <Tooltip contentStyle={{ background: "transparent" }} />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" />
              <Line type="monotone" dataKey="cost" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {data?.car?.fuelUps.map((fu) => (
          <Card key={fu.id}>
            <CardHeader>{fu.station}</CardHeader>
            <CardBody>{fu.amount}</CardBody>
            <CardFooter>{fu.cost}</CardFooter>
          </Card>
        ))}
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
                      />
                    )}
                  />
                  <Autocomplete
                    label="Station"
                    items={[] as { key: string; label: string }[]}
                    allowsCustomValue
                    endContent={<MapPin />}
                    {...register("station")}
                  >
                    {(item) => (
                      <AutocompleteItem key={item.key}>
                        {item.label}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                  <div className="flex gap-4">
                    <Input
                      type="number"
                      label="Amount"
                      endContent={"l"}
                      {...register("amount", { valueAsNumber: true })}
                    />
                    <Input
                      type="number"
                      label="Cost"
                      endContent={<DollarSign />}
                      {...register("cost", { valueAsNumber: true })}
                    />
                    <Input
                      type="number"
                      label="Cost per l"
                      endContent={"$/l"}
                      // {...register("amount", { valueAsNumber: true })}
                    />
                  </div>
                  <Select
                    label="Fuel category"
                    endContent={<Fuel />}
                    {...register("fuelCategory")}
                  >
                    {Object.entries(FuelCategory).map(([label, category]) => (
                      <SelectItem key={category}>{label}</SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Octane rating"
                    endContent={<Percent />}
                    {...register("octane")}
                  >
                    {Object.entries(OctaneRating).map(([label, octane]) => (
                      <SelectItem key={octane}>{label}</SelectItem>
                    ))}
                  </Select>
                  <Input
                    type="number"
                    label="Odometer"
                    endContent={"km"}
                    {...register("odometerKm", { valueAsNumber: true })}
                  />
                  <Textarea label="Notes" {...register("notes")} />
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
