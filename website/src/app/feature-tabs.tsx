import {
  ArrowRight,
  FuelIcon,
  GaugeIcon,
  ImageIcon,
  KanbanSquareIcon,
  WrenchIcon,
} from "lucide-react";
import { Button, Image, Tab, Tabs } from "@heroui/react";

import NextImage from "next/image";

export default function FeatureTabs() {
  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-4 text-center flex flex-col gap-4 items-center">
        <h2 className="text-4xl font-bold mb-4 text-foreground">
          Built for Enthusiasts Who Want It All
        </h2>
        <p className="text-lg text-default-500 mb-10">
          Revline keeps your builds, data, and memories in one place. Explore
          what makes it the all-in-one garage companion.
        </p>

        <Tabs
          aria-label="Feature Tabs"
          color="primary"
          variant="bordered"
          className="w-full flex flex-col items-center"
          classNames={{ tabList: "max-w-full" }}
        >
          <Tab
            key="kanban"
            title={
              <div className="flex items-center space-x-2">
                <KanbanSquareIcon className="w-5 h-5" />
                <span>Project Kanban</span>
              </div>
            }
          >
            <div className="mt-4 space-y-4">
              <p className="text-default-700">
                Plan and organize your builds with an intuitive Kanban board
                made for wrenching workflows.
              </p>
              <video autoPlay className="w-full rounded-lg shadow">
                <source src="/videos/kanban.mp4" type="video/mp4" />
              </video>
            </div>
          </Tab>

          <Tab
            key="dyno"
            title={
              <div className="flex items-center space-x-2">
                <GaugeIcon className="w-5 h-5" />
                <span>Dyno Sessions</span>
              </div>
            }
          >
            <div className="mt-4 space-y-4">
              <p className="text-default-700">
                Import and manage all your dyno results, compare sessions, and
                track performance over time.
              </p>
              <video autoPlay className="w-full rounded-lg shadow">
                <source src="/videos/dyno.mp4" type="video/mp4" />
              </video>
            </div>
          </Tab>

          <Tab
            key="fuel"
            title={
              <div className="flex items-center space-x-2">
                <FuelIcon className="w-5 h-5" />
                <span>Fuel-Ups</span>
              </div>
            }
          >
            <div className="mt-4 space-y-4">
              <p className="text-default-700">
                Track every fuel stop, calculate mileage, and monitor fuel
                efficiency trends.
              </p>
              <video autoPlay className="w-full rounded-lg shadow">
                <source src="/videos/fuelups.mp4" type="video/mp4" />
              </video>
            </div>
          </Tab>

          <Tab
            key="service"
            title={
              <div className="flex items-center space-x-2">
                <WrenchIcon className="w-5 h-5" />
                <span>Service Logs</span>
              </div>
            }
            className="self-stretch aspect-video flex flex-col gap-4"
          >
            <p className="text-default-700">
              Log every oil change, tire swap, and scheduled service with
              reminders and timelines.
            </p>
            <Image
              as={NextImage}
              src="/images/servicing.png"
              alt="Service Log"
              classNames={{
                wrapper: "w-full !max-w-full flex-1",
                img: "object-contain",
              }}
              fill
            />
          </Tab>

          <Tab
            key="gallery"
            title={
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5" />
                <span>Gallery</span>
              </div>
            }
            className="self-stretch aspect-video flex flex-col gap-4"
          >
            <p className="text-default-700">
              Upload and share albums from meets, builds, and personal projects.
              Easily organize and showcase your car story.
            </p>
            <Image
              as={NextImage}
              src="/images/gallery-preview.png"
              alt="Gallery Preview"
              classNames={{
                wrapper: "w-full !max-w-full flex-1",
                img: "object-contain",
              }}
              fill
            />
          </Tab>
        </Tabs>

        <Button
          size="lg"
          as="a"
          href="https://revline.one/app"
          className="bg-white text-black hover:bg-gray-200 transition-colors flex items-center gap-2 self-center"
        >
          Go to App <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </section>
  );
}
