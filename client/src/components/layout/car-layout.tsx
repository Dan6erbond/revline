import { ArrowLeft, Upload } from "lucide-react";
import {
  Button,
  Image,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { ReactNode, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import CarNavbar from "./car-navbar";
import { getQueryParam } from "../../utils/router";
import { graphql } from "@/gql";
import { useRouter } from "next/router";

const getCarBanner = graphql(`
  query GetCarBanner($id: ID!) {
    car(id: $id) {
      id
      name
      bannerImageUrl
    }
  }
`);

const uploadBannerImage = graphql(`
  mutation UploadBannerImage($input: UploadBannerImageInput!) {
    uploadBannerImage(input: $input) {
      id
      bannerImageUrl
    }
  }
`);

export default function CarLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const { data } = useQuery(getCarBanner, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const [mutate] = useMutation(uploadBannerImage);

  const [bannerImage, setBannerImage] = useState<File | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <CarNavbar />
      <div className="h-[30vh] relative">
        <Image
          className="absolute h-full w-full top-0 left-0 rounded-none object-cover"
          removeWrapper
          src={data?.car?.bannerImageUrl ?? "/placeholder.png"}
          alt={data?.car?.name}
        />
      </div>
      <div className="sticky h-18 top-16 -mt-18 w-full z-10 bg-zinc-900/70 backdrop-blur-sm p-2 md:p-4 flex gap-4">
        <Button
          as={Link}
          href={`/cars/${getQueryParam(router.query.id)}`}
          isIconOnly
        >
          <ArrowLeft />
        </Button>
        <h2 className="text-3xl text-white">{data?.car?.name}</h2>
        <Button isIconOnly className="ml-auto" onPress={onOpen}>
          <Upload />
        </Button>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Upload banner image</ModalHeader>
              <ModalBody>
                <Input
                  type="file"
                  label="Picture"
                  onChange={(e) => {
                    setBannerImage((bi) =>
                      e.target.files?.length ? e.target.files[0] : bi
                    );
                  }}
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  onPress={() => {
                    mutate({
                      variables: {
                        input: {
                          carId: getQueryParam(router.query.id) as string,
                          image: bannerImage,
                        },
                      },
                    }).then(() => {
                      onClose();
                    });
                  }}
                >
                  Upload
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <main>{children}</main>
    </>
  );
}
