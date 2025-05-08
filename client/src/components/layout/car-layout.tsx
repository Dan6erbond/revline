import { ArrowLeft, Fuel, Gauge, ImageUp, Upload } from "lucide-react";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { ComponentProps, useCallback, useState } from "react";
import { DistanceUnit, FuelConsumptionUnit } from "@/gql/graphql";
import { distanceUnits, fuelConsumptionUnitsShort } from "@/literals";
import { useMutation, useQuery } from "@apollo/client";

import CarNavbar from "./car-navbar";
import Dropzone from "../dropzone";
import Link from "next/link";
import { getDistance } from "@/utils/distance";
import { getFuelConsumption } from "@/utils/fuel-consumption";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { uploadFile } from "@/utils/upload-file";
import { useHref } from "@/utils/use-href";
import { useRouter } from "next/router";

const getCarBanner = graphql(`
  query GetCarBanner($id: ID!) {
    me {
      id
      profile {
        id
        distanceUnit
        fuelConsumptionUnit
      }
    }
    car(id: $id) {
      id
      name
      bannerImageUrl
      averageConsumptionLitersPerKm
      odometerKm
    }
  }
`);

const uploadBannerImage = graphql(`
  mutation UploadBannerImage($input: CreateMediaInput!) {
    uploadBannerImage(input: $input) {
      media {
        id
      }
      uploadUrl
    }
  }
`);

export default function CarLayout(props: ComponentProps<"main">) {
  const router = useRouter();
  const href = useHref();

  const { data, refetch } = useQuery(getCarBanner, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const distanceUnit = data?.me?.profile?.distanceUnit ?? DistanceUnit.Miles;
  const fuelConsumptionUnit =
    data?.me?.profile?.fuelConsumptionUnit ?? FuelConsumptionUnit.Mpg;

  const [mutate] = useMutation(uploadBannerImage);

  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleFileUpload = useCallback(async () => {
    if (!bannerImage) return;

    mutate({
      variables: {
        input: {
          carID: getQueryParam(router.query.id) as string,
        },
      },
    }).then(async ({ data }) => {
      if (!data?.uploadBannerImage) {
        onClose();
        return;
      }

      await uploadFile(bannerImage, data.uploadBannerImage.uploadUrl, "PUT");

      refetch();
      onClose();
    });
  }, [mutate, bannerImage, router.query.id, onClose, refetch]);

  const handleChange = useCallback((file: File | null) => {
    setBannerImage(file);
    setPreviewUrl(file && URL.createObjectURL(file));
  }, []);

  return (
    <>
      <CarNavbar />
      <div className="h-[30vh] relative">
        <Image
          className="absolute h-full w-full top-0 left-0 rounded-none object-cover"
          removeWrapper
          src={data?.car?.bannerImageUrl ?? href("/placeholder.png")}
          alt={data?.car?.name}
        />
      </div>
      <div className="sticky h-14 md:h-18 top-16 -mt-14 md:-mt-18 w-full z-20 bg-zinc-900/70 backdrop-blur-sm p-2 md:p-4 flex gap-4">
        <Button
          as={Link}
          href={`/cars/${getQueryParam(router.query.id)}`}
          isIconOnly
        >
          <ArrowLeft />
        </Button>
        <h2 className="text-3xl text-white">{data?.car?.name}</h2>
        <div className="hidden md:flex gap-4 items-center text-sm text-white/80 pl-2 pr-4">
          {data?.car.odometerKm != null && (
            <div className="flex items-center gap-1">
              <Gauge className="w-4 h-4" />
              <span>
                {getDistance(
                  data.car.odometerKm,
                  distanceUnit
                ).toLocaleString()}{" "}
                {distanceUnits[distanceUnit]}
              </span>
            </div>
          )}
          {data?.car.averageConsumptionLitersPerKm != null && (
            <div className="flex items-center gap-1">
              <Fuel className="w-4 h-4" />
              <span>
                {getFuelConsumption(
                  data.car.averageConsumptionLitersPerKm,
                  fuelConsumptionUnit
                )}{" "}
                {fuelConsumptionUnitsShort[fuelConsumptionUnit]}
              </span>
            </div>
          )}
          {/* <div className="flex items-center gap-1">
            <Wrench className="w-4 h-4" />
            <span>Jan 15, 2025</span>
          </div> */}
        </div>
        <Button isIconOnly className="ml-auto" onPress={onOpen}>
          <Upload />
        </Button>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Upload banner image</ModalHeader>
              <ModalBody>
                <Dropzone
                  onChange={handleChange}
                  accept="image/*"
                  previewUrl={previewUrl}
                  label="Drop your image here or click to browse"
                  icon={<ImageUp className="size-4 opacity-60" />}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleFileUpload}>
                  Upload
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <main {...props} />
    </>
  );
}
