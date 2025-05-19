import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Fuel,
  Gauge,
  GaugeCircle,
  Hammer,
  Home,
  ImageUp,
  Images,
  Upload,
  Wrench,
} from "lucide-react";
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
      settings {
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

const MotionLink = motion.create(Link);

export default function CarLayout(props: ComponentProps<"main">) {
  const router = useRouter();
  const href = useHref();

  const menuItems = [
    {
      name: "Garage",
      href: "/",
      active: router.pathname === "/",
      showOnBottomNav: false,
    },
    {
      name: "Home",
      href: `/cars/${router.query.id}`,
      active: ["/cars/[id]", "/cars/[id]/fuelups"].includes(router.pathname),
      icon: <Home className="size-5" />,
      showOnTopNav: false,
    },
    {
      name: "Maintenance",
      href: `/cars/${router.query.id}/maintenance`,
      active: router.pathname.startsWith("/cars/[id]/maintenance"),
      icon: <Wrench className="size-5" />,
    },
    {
      name: "Performance",
      href: `/cars/${router.query.id}/performance`,
      active: router.pathname.startsWith("/cars/[id]/performance"),
      icon: <GaugeCircle className="size-5" />,
    },
    {
      name: "Project",
      href: `/cars/${router.query.id}/project`,
      active: router.pathname.startsWith("/cars/[id]/project"),
      icon: <Hammer className="size-5" />,
    },
    {
      name: "Gallery",
      href: `/cars/${router.query.id}/gallery`,
      active: router.pathname.startsWith("/cars/[id]/gallery"),
      icon: <Images className="size-5" />,
    },
    {
      name: "Documents",
      href: `/cars/${router.query.id}/documents`,
      active: router.pathname.startsWith("/cars/[id]/documents"),
      icon: <FileText className="size-5" />,
    },
  ];

  const { data, refetch } = useQuery(getCarBanner, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const distanceUnit = data?.me?.settings?.distanceUnit ?? DistanceUnit.Miles;
  const fuelConsumptionUnit =
    data?.me?.settings?.fuelConsumptionUnit ?? FuelConsumptionUnit.Mpg;

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
      <CarNavbar car={data?.car} menuItems={menuItems} />
      <div className="h-[30vh] relative">
        <Image
          className="absolute h-full w-full top-0 left-0 rounded-none object-cover"
          removeWrapper
          src={data?.car?.bannerImageUrl ?? href("/placeholder.png")}
          alt={data?.car?.name}
        />
      </div>
      <Button
        isIconOnly
        className="ml-auto flex md:hidden absolute top-20 right-4 z-20"
        onPress={onOpen}
      >
        <Upload />
      </Button>
      <div className="hidden md:flex sticky h-18 top-16 -mt-18 w-full z-20 bg-zinc-900/70 backdrop-blur-sm p-4 gap-4">
        <div className="flex gap-4 sticky md:relative top-14 md:top-0">
          <Button
            as={Link}
            href={`/cars/${getQueryParam(router.query.id)}`}
            isIconOnly
          >
            <ArrowLeft />
          </Button>
          <h2 className="text-3xl text-white">{data?.car?.name}</h2>
        </div>
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
                ).toLocaleString()}{" "}
                {fuelConsumptionUnitsShort[fuelConsumptionUnit]}
              </span>
            </div>
          )}
          {/* <div className="flex items-center gap-1">
            <Wrench className="w-4 h-4" />
            <span>Jan 15, 2025</span>
          </div> */}
        </div>
        <Button isIconOnly className="ml-auto hidden md:flex" onPress={onOpen}>
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
      <div className="h-16 block md:hidden"></div>
      <motion.div
        className="md:hidden fixed bottom-0 left-0 w-full z-30 h-16 overflow-x-auto px-0"
        transition={{ layout: { duration: 0.4, ease: "easeInOut" } }}
      >
        <div className="flex justify-center items-center gap-3 min-w-fit h-full px-4">
          {menuItems
            .filter(({ showOnBottomNav }) => showOnBottomNav !== false)
            .map(({ name, href, icon, active }) => (
              <MotionLink
                key={name}
                href={href}
                layoutId={name}
                /* onMouseEnter={() => setSelectedTab(tab.id)}
        onMouseLeave={() => setSelectedTab(null)} */
                animate={{
                  width: active ? "auto" : 40,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-[#232829] rounded-2xl px-2 py-2 text-[#d6dbdc] flex shrink-0 items-center gap-2 border border-[#3b4345] overflow-hidden"
              >
                <motion.div layout="position">{icon}</motion.div>
                <AnimatePresence>
                  {active && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap"
                    >
                      {name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </MotionLink>
            ))}
        </div>
      </motion.div>
    </>
  );
}
