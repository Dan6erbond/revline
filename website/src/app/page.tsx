"use client";

import {
  Activity,
  ArrowRight,
  Camera,
  Car,
  ChevronDown,
  FileText,
  Gauge,
  Timer,
  Wrench,
} from "lucide-react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Tooltip,
} from "@heroui/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { BentoGrid, BentoGridItem } from "./bento-grid";

import FeaturesSection from "./features";
import NextImage from "next/image";
import Pricing from "./pricing";

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden bg-background text-white min-h-[90vh] flex items-center justify-center px-4 sm:px-8">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              🏁 Revline 1 — Built for DIY Mechanics & Car Enthusiasts
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-md">
              Track your builds. Show off your rides. Stay ahead in your garage
              with the all-in-one app for car lovers.
            </p>
            <div className="flex gap-4">
              <Button
                size="lg"
                as="a"
                href="https://revline.one/app/api/auth/signin"
                className="bg-white text-black hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                Log In <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="bordered">
                Learn More
              </Button>
            </div>
          </div>

          {/* Image or App Screenshot */}
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-700">
            <Image
              as={NextImage}
              src="/hero_screenshots.png"
              alt="Revline App UI"
              className="object-cover"
              fill
              priority
              removeWrapper
            />
          </div>
        </div>

        {/* Optional bottom chevron */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown />
        </div>
      </section>

      <section className="py-16 px-4 sm:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center">
            Built for Your Garage. Ready for the Track.
          </h2>

          <BentoGrid className="max-w-none">
            <BentoGridItem
              title="Fuel Logs"
              description="Track every fill-up, monitor fuel efficiency and cost over time."
              icon={<Gauge className="w-6 h-6 text-primary" />}
              background={
                <Card className="w-full max-w-xs mx-auto">
                  <CardHeader className="text-sm font-medium text-muted-foreground">
                    Fuel Entry
                  </CardHeader>
                  <CardBody>
                    <div className="text-foreground text-lg font-semibold">
                      32.4 L - CHF 54.80
                    </div>
                    <div className="text-sm text-muted-foreground">
                      4.7L / 100km
                    </div>
                  </CardBody>
                  <CardFooter className="text-xs text-muted-foreground">
                    05.04.2025 • Coop Pronto
                  </CardFooter>
                </Card>
              }
            />
            <BentoGridItem
              title="Service & Maintenance"
              description="Log services, manage parts, and get notified when it's time to wrench."
              icon={<Wrench className="w-6 h-6 text-primary" />}
              background={
                <Alert
                  title="Next Service Due"
                  description="Brake pads replacement in 310 miles or 14 days"
                />
              }
            />
            <BentoGridItem
              title="Odometer Tracking"
              description="Track mileage and wear across your builds with historical logs."
              icon={<Car className="w-6 h-6 text-primary" />}
              background={
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { name: "Jan", mileage: 500 },
                      { name: "Feb", mileage: 800 },
                      { name: "Mar", mileage: 1200 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="mileage"
                      stroke="currentColor"
                    />
                  </LineChart>
                </ResponsiveContainer>
              }
            />
            <BentoGridItem
              title="Dyno Sessions"
              description="Store your torque & horsepower curves, graph them by RPM."
              icon={<Activity className="w-6 h-6 text-primary" />}
              className="md:col-span-2"
              background={
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { rpm: 1000, power: 150 },
                      { rpm: 2000, power: 200 },
                      { rpm: 3000, power: 250 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rpm" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="power" fill="currentColor" />
                  </BarChart>
                </ResponsiveContainer>
              }
            />
            <BentoGridItem
              title="Drag Strip Logs"
              description="Log your best times, units, speeds — from 0-60s to full passes."
              icon={<Timer className="w-6 h-6 text-primary" />}
              background={
                <Card className="bg-primary-50/5 border border-primary-100 rounded-xl shadow">
                  <CardHeader className="pb-0">
                    <div className="flex items-center justify-between text-sm text-content4-foreground">
                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-primary-500" />
                        <span>1/4 Mile</span>
                      </div>
                      <span className="text-xs">#3</span>
                    </div>
                  </CardHeader>
                  <CardBody className="flex items-center justify-center py-6">
                    <div className="text-3xl font-semibold text-primary-700 flex items-center gap-2">
                      <Timer className="w-5 h-5" /> 13.42s
                    </div>
                  </CardBody>
                  <CardFooter className="text-xs text-content4-foreground text-right pt-0">
                    Run ID: abc12345
                  </CardFooter>
                </Card>
              }
            />
            <BentoGridItem
              title="Gallery"
              description="Upload photos and videos from builds, track days, or show-offs."
              icon={<Camera className="w-6 h-6 text-primary" />}
              background={
                <Card className="overflow-hidden w-full max-w-xs mx-auto bottom-10">
                  <div className="aspect-video bg-muted rounded-md relative">
                    <Image
                      as={NextImage}
                      className="object-cover"
                      src="/audi_s5.jpg"
                      fill
                      alt="Audi S5"
                      removeWrapper
                    />
                  </div>
                  <CardBody className="text-sm text-content4-foreground">
                    Uploaded: IMG_420.jpg
                  </CardBody>
                </Card>
              }
            />
            <BentoGridItem
              title="Documents"
              description="Keep service receipts, dyno sheets, and build documents in one place."
              icon={<FileText className="w-6 h-6 text-primary" />}
              background={
                <Card className="w-full max-w-xs mx-auto">
                  <CardHeader className="text-sm font-medium text-content4-foreground">
                    New Upload
                  </CardHeader>
                  <CardBody>
                    <div className="text-foreground text-sm">
                      insurance_policy_2025.pdf
                    </div>
                  </CardBody>
                  <CardFooter className="text-xs text-content4-foreground">
                    Uploaded 2 days ago
                  </CardFooter>
                </Card>
              }
            />
          </BentoGrid>
        </div>
      </section>
      <FeaturesSection />

      <Pricing />
    </main>
  );
}
