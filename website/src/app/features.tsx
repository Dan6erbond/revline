import {
  BarChart,
  Bell,
  Boxes,
  CalendarCheck,
  ClipboardList,
  FileText,
  Fuel,
  Gauge,
  ImageIcon,
  LucideIcon,
  MessagesSquare,
  ScanLine,
  UserCircle,
  Users,
  Wrench,
} from "lucide-react";

interface FeatureItem {
  icon?: LucideIcon;
  title: string;
  description: string;
  isRoadmap?: boolean;
}

const currentFeatures: FeatureItem[] = [
  {
    icon: Fuel,
    title: "Detailed Fuel Logging",
    description:
      "Track every fill-up including cost, amount, and station. Visualize consumption trends and average cost per gallon/liter.",
  },
  {
    icon: Gauge,
    title: "Integrated Odometer Tracking",
    description:
      "Log odometer readings with fuel entries to automatically calculate fuel efficiency (MPG/L/100km).",
  },
  {
    icon: Wrench,
    title: "Comprehensive Service Logs",
    description:
      "Keep a detailed history of all maintenance and repairs performed on your vehicle, including parts used and costs.",
  },
  {
    icon: CalendarCheck,
    title: "Proactive Service Schedules",
    description:
      "Set up maintenance schedules based on time or mileage. Get reminders for upcoming service needs.",
  },
  {
    icon: ImageIcon,
    title: "Build Showcase Gallery",
    description:
      "Upload photos and videos of your car to document its progress and share your build with others (integration with social features coming soon!).",
  },
  {
    icon: FileText,
    title: "Secure Document Storage",
    description:
      "Safely store important documents like receipts, titles, insurance cards, and registration papers.",
  },
  {
    icon: BarChart,
    title: "Performance Tracking",
    description:
      "Log results from dynamometer sessions and drag strip times to quantify performance gains.",
  },
];

const roadmapFeatures: FeatureItem[] = [
  {
    icon: UserCircle,
    title: "Enhanced Car Profiles & Sharing",
    description:
      "Create detailed public or private profiles for your vehicles, showcasing mods, specs, gallery, and logs. Share them easily with friends or the community.",
    isRoadmap: true,
  },
  {
    icon: Users,
    title: "Community Car Meets",
    description:
      "Organize, discover, and RSVP to local car meets and events directly within the app.",
    isRoadmap: true,
  },
  {
    icon: Boxes,
    title: "Parts & Inventory Management",
    description:
      "Keep track of your spare parts, tools, and supplies. Know what you have on hand for your next project.",
    isRoadmap: true,
  },
  {
    icon: Bell,
    title: "Customizable Notifications",
    description:
      "Get timely reminders for scheduled maintenance or community events via email, SMS, or push notifications.",
    isRoadmap: true,
  },
  {
    icon: ScanLine,
    title: "Automatic Receipt Scanning",
    description:
      "Use your phone camera to scan receipts and automatically link them to fuel or service logs (integrating with Document Storage).",
    isRoadmap: true,
  },
  {
    icon: ClipboardList,
    title: "Modification Wishlist & Planner",
    description:
      "Plan future upgrades for your build, track potential parts, costs, and prioritize your modification journey.",
    isRoadmap: true,
  },
  {
    icon: MessagesSquare,
    title: "Community Forum/Groups",
    description:
      "Connect with other Revline users, ask questions, share knowledge, and discuss specific car models or modification types.",
    isRoadmap: true,
  },
];

function Feature({ title, description, icon: Icon }: FeatureItem) {
  return (
    <div
      key={title}
      className="flex items-start space-x-4 p-4 bg-primary-50/10 rounded-lg shadow-sm transition hover:shadow-md"
    >
      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full flex items-center justify-center">
        {Icon && <Icon className="w-5 h-5" strokeWidth={2} />}
      </div>
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
          {title}
        </h4>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      </div>
    </div>
  );
}

function RoadmapItem({ title, description, icon: Icon }: FeatureItem) {
  return (
    <div
      key={title}
      className="flex items-start space-x-4 p-4 bg-primary-50/5 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg opacity-80 hover:opacity-100 transition"
    >
      <div className="flex-shrink-0 w-8 h-8 bg-secondary-100 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-300 rounded-full flex items-center justify-center">
        {Icon && <Icon className="w-5 h-5" strokeWidth={2} />}
      </div>
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
          {title}
        </h4>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need, And More To Come
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Revline provides powerful tools to manage your vehicles today, with
            exciting community and advanced features planned for the future.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Current Features Column */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 border-l-4 border-primary-500 pl-3">
              Available Now
            </h3>
            <div className="space-y-6">
              {currentFeatures.map((feature) => (
                <Feature
                  key={feature.title}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                />
              ))}
            </div>
          </div>

          {/* Roadmap Column */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 border-l-4 border-secondary-500 pl-3">
              Coming Soon
            </h3>
            <div className="space-y-6">
              {roadmapFeatures.map((feature) => (
                <RoadmapItem
                  key={feature.title}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                />
              ))}
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 pt-4">
                Roadmap features and timelines are subject to change based on
                development progress and user feedback.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
