import { Button, Card, CardBody, CardHeader, Image, Link } from "@heroui/react";

import { Plus } from "lucide-react";
import RootNavbar from "@/components/layout/root-navbar";
import { graphql } from "@/gql";
import { useQuery } from "@apollo/client";

const getGarage = graphql(`
  query GetGarage {
    me {
      cars {
        id
        name
        bannerImageUrl
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
        <div className="flex justify-end mb-4 md:mb-8">
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
            >
              <CardHeader>{car.name}</CardHeader>
              <CardBody className="justify-center items-center">
                <Image
                  src={car.bannerImageUrl ?? "/placeholder.png"}
                  alt={car.name}
                  className="h-[200px] w-full object-cover"
                  removeWrapper
                />
              </CardBody>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
