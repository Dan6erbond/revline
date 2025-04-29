import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Link,
} from "@heroui/react";
import { ChevronRight, Flame, Gauge, Plus } from "lucide-react";

import RootNavbar from "@/components/layout/root-navbar";
import { graphql } from "@/gql";
import { useQuery } from "@apollo/client";

const getGarage = graphql(`
  query GetGarage {
    me {
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
  const { data } = useQuery(getGarage);

  return (
    <>
      <RootNavbar />
      <main className="p-8 max-w-screen-xl mx-auto">
        <div className="flex justify-end mb-8">
          <Button as={Link} href="/cars/create" startContent={<Plus />}>
            Add Car
          </Button>
        </div>
        <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {data?.me.cars?.map((car) => (
            <Card
              key={car.id}
              isPressable
              as={Link}
              href={`/cars/${car.id}/maintenance`}
              className="overflow-hidden bg-primary-50/5 backdrop-blur hover:shadow-lg transition-shadow rounded-xl group"
            >
              <div className="relative h-[200px] w-full">
                <Image
                  src={car.bannerImageUrl ?? "/placeholder.png"}
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
              </div>

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
