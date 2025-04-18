import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
} from "@heroui/react";

import { Check } from "lucide-react";
import RootNavbar from "@/components/layout/root-navbar";

export default function Subscription() {
  return (
    <>
      <RootNavbar />
      <main className="p-4 flex flex-col gap-4 relative">
        <h1 className="text-2xl text-center mb-4">Manage your Subscription</h1>
        <div className="flex flex-wrap justify-center gap-8 md:gap-4">
          <Card className="w-[400px] px-2 py-6 gap-4" isBlurred>
            <CardHeader className="flex-col gap-2">
              <p className="text-2xl">Free</p>
              <p>
                Keep your car&apos;s history in check with essentials for
                maintenance and fuel tracking.
              </p>
            </CardHeader>
            <Divider />
            <CardBody>
              <ul className="flex flex-col gap-2">
                <li className="flex gap-2 items-center">
                  <Check /> Manage 1 vehicle
                </li>
                <li className="flex gap-2 items-center">
                  <Check /> Fuel & maintenance tracking
                </li>
                <li className="flex gap-2 items-center">
                  <Check /> Service logs & odometer readings
                </li>
              </ul>
            </CardBody>
          </Card>
          <Card
            className="w-[400px] px-2 py-6 gap-4 border-primary-400 border-2 relative overflow-visible"
            isBlurred
          >
            <div className="absolute -top-4 z-20 w-full flex">
              <Chip
                variant="dot"
                color="primary"
                className="mx-auto bg-background"
              >
                Recommended
              </Chip>
            </div>
            <CardHeader className="flex-col gap-2">
              <p className="text-2xl">Enthusiast</p>
              <p>
                <b>Built for track rats, tuners, and data nerds.</b>
                <br />
                Unlock the full garage and start logging performance like a pro.
              </p>
            </CardHeader>
            <Divider />
            <CardBody>
              <p className="text-2xl text-default-600 mb-6">
                <span className="text-default-400">$</span>2
                <span className="text-medium"> monthly</span>
              </p>
              <ul className="flex flex-col gap-2">
                <li className="flex gap-2 items-center">
                  <Check /> Everything in free
                </li>
                <li className="flex gap-2 items-center">
                  <Check /> Manage <b>unlimited</b> vehicles
                </li>
                <li className="flex gap-2 items-center">
                  <Check /> Gallery - upload photos and videos of your car
                </li>
                <li className="flex gap-2 items-center">
                  <Check /> Performance tracking (0-60 times, 1/4 mile, lap
                  times, etc.)
                </li>
                <li className="flex gap-2 items-center">
                  <Check /> Early access to new features
                </li>
              </ul>
            </CardBody>
            <Divider />
            <CardFooter className="justify-center">
              <Button color="primary" className="bg-gradient-to-r from-teal-500 to-teal-700">Subscribe</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  );
}
