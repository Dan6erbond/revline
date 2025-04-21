import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Image,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  ChangeEvent,
  DragEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  CircleUserRound,
  Coins,
  Fuel,
  Gauge,
  Ruler,
  Thermometer,
} from "lucide-react";
import {
  DistanceUnit,
  FuelConsumptionUnit,
  FuelVolumeUnit,
  TemperatureUnit,
} from "@/gql/graphql";
import { SubmitHandler, useForm } from "react-hook-form";
import { skipToken, useMutation, useSuspenseQuery } from "@apollo/client";

import cc from "currency-codes";
import currencyCodes from "currency-codes/data";
import { graphql } from "@/gql";
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

  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    (file: File) => {
      mutateUploadProfilePicture({
        variables: {
          input: {
            picture: file,
          },
        },
      });
    },
    [mutateUploadProfilePicture]
  );

  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }

    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      // Don't process files if the input is disabled
      if (inputRef.current?.disabled) {
        return;
      }

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileUpload(e.dataTransfer.files[0]);
      }
    },
    [handleFileUpload]
  );

  const openFileDialog = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
      }
    },
    [handleFileUpload]
  );

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
        <div className="flex flex-col items-center gap-2">
          <div className="relative inline-flex">
            {/* Drop area */}
            <div
              className="cursor-pointer group border-background has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex size-16 items-center justify-center overflow-hidden rounded-full border border-dashed has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]"
              role="button"
              onClick={openFileDialog}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              data-dragging={isDragging || undefined}
              aria-label={
                data?.me?.profile?.profilePictureUrl
                  ? "Change image"
                  : "Upload image"
              }
            >
              <Image
                className="size-full object-cover"
                src={data?.me?.profile?.profilePictureUrl ?? undefined}
                alt={data?.me?.profile?.username ?? undefined}
                removeWrapper
              />
              <div className="absolute h-full w-full items-center justify-center z-20 hidden group-data-[dragging=true]:flex group-hover:flex group-hover:bg-secondary/20 group-data-[dragging=true]:bg-secondary/20 transition-colors">
                <div aria-hidden="true" className="text-black">
                  <CircleUserRound className="size-4 opacity-60" />
                </div>
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              multiple
              className="sr-only"
              aria-label="Upload file"
              ref={inputRef}
            />
          </div>
        </div>
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
