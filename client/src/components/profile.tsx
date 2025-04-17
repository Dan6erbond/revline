import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { Coins, Fuel, Gauge, Ruler, Thermometer } from "lucide-react";
import {
  DistanceUnit,
  FuelConsumptionUnit,
  FuelVolumeUnit,
  TemperatureUnit,
} from "../gql/graphql";
import { SubmitHandler, useForm } from "react-hook-form";
import { skipToken, useMutation, useSuspenseQuery } from "@apollo/client";

import cc from "currency-codes";
import currencyCodes from "currency-codes/data";
import { graphql } from "@/gql";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

type Inputs = {
  username: string;
  firstName: string;
  lastName: string;
  currencyCode: string;
  fuelVolumeUnit: FuelVolumeUnit;
  distanceUnit: DistanceUnit;
  fuelConsumptionUnit: FuelConsumptionUnit;
  temperatureUnit: TemperatureUnit;
};

const getProfile = graphql(`
  query GetProfile {
    me {
      id
      profile {
        id
        username
        firstName
        lastName
        currencyCode
        fuelVolumeUnit
        distanceUnit
        fuelConsumptionUnit
        temperatureUnit
        profilePictureUrl
      }
    }
  }
`);

const updateProfile = graphql(`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      username
      firstName
      lastName
      currencyCode
      fuelVolumeUnit
      distanceUnit
      fuelConsumptionUnit
      temperatureUnit
    }
  }
`);

const uploadProfilePicture = graphql(`
  mutation UploadProfilePicture($input: UploadProfilePictureInput!) {
    uploadProfilePicture(input: $input) {
      id
      profilePictureUrl
    }
  }
`);

export default function ProfileForm() {
  const { data: session } = useSession();
  const { data } = useSuspenseQuery(
    getProfile,
    session ? undefined : skipToken
  );

  const { register, handleSubmit, reset } = useForm<Inputs>({
    defaultValues: data?.me?.profile as Inputs,
  });

  useEffect(() => {
    if (data?.me?.profile) {
      reset(data.me.profile as Inputs);
    }
  }, [data, reset]);

  const [mutateUpdateProfile] = useMutation(updateProfile);
  const [mutateUploadProfilePicture] = useMutation(uploadProfilePicture);

  const onSubmit: SubmitHandler<Inputs> = ({
    username,
    firstName,
    lastName,
    currencyCode,
    fuelVolumeUnit,
    distanceUnit,
    fuelConsumptionUnit,
    temperatureUnit,
  }) => {
    mutateUpdateProfile({
      variables: {
        input: {
          username,
          firstName,
          lastName,
          currencyCode,
          fuelVolumeUnit,
          distanceUnit,
          fuelConsumptionUnit,
          temperatureUnit,
        },
      },
    });
  };

  const currencyFilter = (textValue: string, inputValue: string) => {
    if (inputValue.length === 0) {
      return true;
    }

    const c = cc.code(textValue)!;

    return `${c.currency} ${c.code} ${c.countries.join(" ")}`
      .toLowerCase()
      .includes(inputValue.toLowerCase());
  };

  return (
    <form
      id="fuel-up"
      className="flex flex-col gap-4 p-4 md:p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          type="file"
          className="max-w-52"
          label="Profile picture"
          onChange={(e) => {
            if (e.target.files) {
              mutateUploadProfilePicture({
                variables: {
                  input: {
                    picture: e.target.files[0],
                  },
                },
              });
            }
          }}
          variant="bordered"
        />
        <Input label="Username" {...register("username")} variant="bordered" />
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <Input
          label="First name"
          {...register("firstName")}
          variant="bordered"
        />
        <Input label="Last name" {...register("lastName")} variant="bordered" />
      </div>
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
      <div className="flex justify-end">
        <Button color="primary" type="submit" form="fuel-up">
          Action
        </Button>
      </div>
    </form>
  );
}
