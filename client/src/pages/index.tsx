import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from "@heroui/react";

import { Plus } from "lucide-react";
import RootNavbar from "@/components/layout/root-navbar";
import { graphql } from "@/gql";
import { useQuery } from "@apollo/client";

const getGarage = graphql(`
  query GetGarage {
    cars {
      id
      name
      make
      model
      year
    }
  }
`);

export default function Home() {
  const { data } = useQuery(getGarage);

  return (
    <>
      <RootNavbar />
      <main className="p-8">
        <div className="flex justify-end mb-4 md:mb-8">
          <Button as={Link} href="/cars/create" startContent={<Plus />}>
            Add Car
          </Button>
        </div>
        <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {data?.cars.map((car) => (
            <Card key={car.id} isPressable as={Link} href={`/cars/${car.id}`}>
              <CardHeader>{car.name}</CardHeader>
              <CardBody>5000 HP</CardBody>
              <CardFooter>Sold</CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
