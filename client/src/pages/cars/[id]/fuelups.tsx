import { Coins, Fuel } from "lucide-react";
import { Tab, Tabs } from "@heroui/react";

import CarLayout from "@/components/layout/car-layout";
import FuelUps from "@/components/fuelups";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

export default function Fuelups() {
  const router = useRouter();

  return (
    <CarLayout>
      <Tabs variant="underlined" selectedKey="fuelups" className="mt-2">
        <Tab
          as={Link}
          key="expenses"
          title={
            <div className="flex items-center gap-2">
              <Coins />
              <span>Expenses</span>
            </div>
          }
          href={`/cars/${router.query.id}`}
        />
        <Tab
          as={Link}
          key="fuelups"
          title={
            <div className="flex items-center gap-2">
              <Fuel />
              <span>Fuel-ups</span>
            </div>
          }
          href={`/cars/${router.query.id}/fuelups`}
        >
          <FuelUps />
        </Tab>
      </Tabs>
    </CarLayout>
  );
}
