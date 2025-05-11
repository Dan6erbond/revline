import {
  ActivitySquare,
  Coins,
  Fuel,
  Gauge,
  Ruler,
  Thermometer,
  Zap,
} from "lucide-react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  DistanceUnit,
  FuelConsumptionUnit,
  FuelVolumeUnit,
  PowerUnit,
  TemperatureUnit,
  TorqueUnit,
} from "@/gql/graphql";
import { SubmitHandler, useForm } from "react-hook-form";
import { code, data as currencyCodes } from "currency-codes";
import { skipToken, useMutation, useSuspenseQuery } from "@apollo/client";

import { graphql } from "@/gql";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { withNotification } from "@/utils/with-notification";

type Inputs = {
  currencyCode: string;
  fuelVolumeUnit: FuelVolumeUnit;
  distanceUnit: DistanceUnit;
  fuelConsumptionUnit: FuelConsumptionUnit;
  temperatureUnit: TemperatureUnit;
  powerUnit: PowerUnit;
  torqueUnit: TorqueUnit;
};

const getSettings = graphql(`
  query GetSettings {
    me {
      id
      settings {
        id
        currencyCode
        fuelVolumeUnit
        distanceUnit
        fuelConsumptionUnit
        temperatureUnit
        powerUnit
        torqueUnit
      }
    }
  }
`);

const updateSettings = graphql(`
  mutation UpdateSettings($input: UpdateUserSettingsInput!) {
    updateSettings(input: $input) {
      id
      currencyCode
      fuelVolumeUnit
      distanceUnit
      fuelConsumptionUnit
      temperatureUnit
      powerUnit
      torqueUnit
    }
  }
`);

export default function SettingsForm() {
  const { data: session } = useSession();
  const { data } = useSuspenseQuery(
    getSettings,
    session ? undefined : skipToken
  );

  const { register, handleSubmit, reset } = useForm<Inputs>({
    defaultValues: data?.me?.settings as Inputs,
  });

  useEffect(() => {
    if (data?.me?.settings) {
      reset(data.me.settings as Inputs);
    }
  }, [data, reset]);

  const [mutateUpdateSettings, { loading: isUpdating }] =
    useMutation(updateSettings);

  const onSubmit: SubmitHandler<Inputs> = withNotification(
    {},
    ({
      currencyCode,
      fuelVolumeUnit,
      distanceUnit,
      fuelConsumptionUnit,
      temperatureUnit,
      powerUnit,
      torqueUnit,
    }: Inputs) =>
      mutateUpdateSettings({
        variables: {
          input: {
            currencyCode,
            fuelVolumeUnit,
            distanceUnit,
            fuelConsumptionUnit,
            temperatureUnit,
            powerUnit,
            torqueUnit,
          },
        },
      })
  );

  const currencyFilter = (textValue: string, inputValue: string) => {
    if (inputValue.length === 0) {
      return true;
    }

    const c = code(textValue)!;

    return `${c.currency} ${c.code} ${c.countries.join(" ")}`
      .toLowerCase()
      .includes(inputValue.toLowerCase());
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p>Units</p>
      <Autocomplete
        defaultItems={currencyCodes}
        defaultFilter={currencyFilter}
        label="Currency"
        endContent={<Coins />}
        {...register("currencyCode")}
        variant="bordered"
      >
        {(c) => (
          <AutocompleteItem key={c.code} textValue={c.code}>
            <div className="flex items-center gap-2">
              <span className="text-small">{c.currency}</span>
              <span className="text-tiny text-default-400">({c.code})</span>
            </div>
          </AutocompleteItem>
        )}
      </Autocomplete>
      <Select
        label="Fuel volume unit"
        endContent={<Fuel />}
        {...register("fuelVolumeUnit")}
        variant="bordered"
      >
        {Object.entries(FuelVolumeUnit).map(([label, unit]) => (
          <SelectItem key={unit}>{label}</SelectItem>
        ))}
      </Select>
      <Select
        label="Distance unit"
        endContent={<Ruler />}
        {...register("distanceUnit")}
        variant="bordered"
      >
        {Object.entries(DistanceUnit).map(([label, unit]) => (
          <SelectItem key={unit}>{label}</SelectItem>
        ))}
      </Select>
      <Select
        label="Fuel consumption unit"
        endContent={<Gauge />}
        {...register("fuelConsumptionUnit")}
        variant="bordered"
      >
        {Object.entries(FuelConsumptionUnit).map(([label, unit]) => (
          <SelectItem key={unit}>{label}</SelectItem>
        ))}
      </Select>
      <Select
        label="Temperature unit"
        endContent={<Thermometer />}
        {...register("temperatureUnit")}
        variant="bordered"
      >
        {Object.entries(TemperatureUnit).map(([label, unit]) => (
          <SelectItem key={unit}>{label}</SelectItem>
        ))}
      </Select>
      <Select
        label="Power unit"
        endContent={<Zap />}
        {...register("powerUnit")}
        variant="bordered"
      >
        {Object.entries(PowerUnit).map(([label, unit]) => (
          <SelectItem key={unit}>{label}</SelectItem>
        ))}
      </Select>
      <Select
        label="Torque unit"
        endContent={<ActivitySquare />}
        {...register("torqueUnit")}
        variant="bordered"
      >
        {Object.entries(TorqueUnit).map(([label, unit]) => (
          <SelectItem key={unit}>{label}</SelectItem>
        ))}
      </Select>
      <div className="flex justify-end">
        <Button color="primary" type="submit" isLoading={isUpdating}>
          Save
        </Button>
      </div>
    </form>
  );
}
