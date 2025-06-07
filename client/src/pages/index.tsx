import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  useDisclosure,
} from "@heroui/react";
import { ChevronRight, Flame, Gauge, Plus, Settings } from "lucide-react";

import GateModal from "../components/subscription/gate-modal";
import Link from "next/link";
import RootNavbar from "@/components/layout/root-navbar";
import { SubscriptionTier } from "../gql/graphql";
import { graphql } from "@/gql";
import { useHref } from "@/utils/use-href";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const getGarage = graphql(`
  query GetGarage {
    me {
      id
      subscription {
        id
        tier
      }
      settings {
        id
      }
      cars {
        id
        name
        make
        model
        year
        bannerImageUrl
        averageConsumptionLitersPerKm
        dragSessions {
          id
        }
        upcomingServices {
          schedule {
            id
          }
        }
      }
    }
  }
`);

export default function Home() {
  const router = useRouter();
  const href = useHref();

  const { data } = useQuery(getGarage);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <RootNavbar pathname={router.pathname} path={router.asPath} />
      <main className="flex flex-col gap-4 md:gap-8 p-4 md:p-8 container mx-auto">
        {data?.me?.settings == null && (
          <Alert
            color="warning"
            variant="faded"
            title="Unit settings incomplete"
            description="To get accurate results, please set your preferred units for torque, power, and other measurements."
            endContent={
              <Button
                as={Link}
                href="/settings"
                color="warning"
                size="sm"
                variant="flat"
                startContent={<Settings className="size-4" />}
              >
                Configure now
              </Button>
            }
          />
        )}
        <div className="flex justify-end">
          <Button
            startContent={<Plus />}
            onPress={() => {
              if (
                !data?.me?.cars ||
                data.me.cars?.length < 1 ||
                (data?.me?.subscription?.tier &&
                  [
                    (SubscriptionTier.Diy, SubscriptionTier.Enthusiast),
                  ].includes(data?.me?.subscription?.tier))
              ) {
                router.push("/cars/create");
              } else {
                onOpen();
              }
            }}
            aria-label="Add Car"
          >
            Add Car
          </Button>
        </div>

        <GateModal isOpen={isOpen} onOpenChange={onOpenChange} />

        <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {data?.me?.cars?.map((car) => (
            <Card
              key={car.id}
              isPressable
              as={Link}
              href={`/cars/${car.id}`}
              className="overflow-hidden bg-primary-50/5 backdrop-blur hover:shadow-lg transition-shadow rounded-xl group"
            >
              <CardHeader className="relative h-[200px] w-full p-0 overflow-hidden">
                <Image
                  src={car.bannerImageUrl ?? href("/placeholder.png")}
                  alt={car.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-none"
                  removeWrapper
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-20" />
                <div className="absolute bottom-2 left-4 text-white z-30">
                  <h3 className="text-lg font-semibold drop-shadow">
                    {car.name}
                  </h3>
                  <p className="text-sm text-white/80">
                    {car.make} {car.model} {car.year}
                  </p>
                </div>
              </CardHeader>

              <CardBody className="text-sm text-muted-foreground grid grid-cols-2 gap-2 px-4 pt-3">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-primary" />
                  <span>{car.dragSessions?.length ?? 0} Drag Sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-primary" />
                  <span>
                    {car.averageConsumptionLitersPerKm
                      ? `${(car.averageConsumptionLitersPerKm * 100).toFixed(
                          1
                        )} L/100km`
                      : "No data"}
                  </span>
                </div>
              </CardBody>

              <CardFooter className="px-4 pb-4 pt-2 text-xs text-muted-foreground flex justify-between items-center">
                <span>
                  {car.upcomingServices?.length ?? 0} upcoming services
                </span>
                <ChevronRight className="w-4 h-4 text-muted group-hover:translate-x-1 transition-transform" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
