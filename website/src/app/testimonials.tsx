import { Button, cn } from "@heroui/react";

import { ArrowRight } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { ReactNode } from "react";

const reviews = [
  {
    name: "Riccardo Landolfo",
    username: "@shadow_2xx",
    body: "Honestly, I'd pay for this.",
    img: "https://pbs.twimg.com/profile_images/1054089628393897984/8Pv-6oSl_400x400.jpg",
  },
  {
    name: "Samuel Duc",
    username: "@samm_duc",
    body: "@Dan6erbond, absolutely love this concept. data is power for any car enthusiast—can't wait to see more builds.",
    img: "https://pbs.twimg.com/profile_images/1821927517076258816/78kMzL_h_400x400.jpg",
  },
  {
    username: "u/-_-KiD",
    body: "That looks so good!",
    img: "https://styles.redditmedia.com/t5_2pq815/styles/profileIcon_snoode49dfa4-c033-4d9a-b3a7-eb7f0eb0ae64-headshot.png?width=64&height=64&frame=1&auto=webp&crop=&s=cee56f0625dbe8b46f13a7b2a2f15b486fb27bdd",
  },
  {
    username: "u/vier10comma5",
    body: "In theory, I think an app like this is fantastic. My only concern is around data privacy—this is pretty sensitive information.",
    img: "https://styles.redditmedia.com/t5_25b6rb/styles/profileIcon_snoo7e0bca7f-e649-466f-822f-5ecfa0f68cfd-headshot-f.png?width=64&height=64&frame=1&auto=webp&crop=&s=dfdde7f40dd99845d7b74542a373674e440c90e3",
  },
  {
    username: "u/SuspiciousChip7756",
    body: "The website looks damn 🔥. How did you make it?",
    img: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png",
  },
  {
    username: "u/BarnBuiltBeaters",
    body: "Sounds interesting!  I like to fabricate a lot of my own parts. Sometimes I start and get 90% finished. [...] It would be nice to have a % tracker and list things that need to be buttoned up to get it to 100%.  Also what may be great is if you include needed tools/equipment for X task. For example I need to fab a transmission tunnel. I plan on buying an English wheel for it and planishing hammer. Cool stuff!",
    img: "https://styles.redditmedia.com/t5_5g6y1j/styles/profileIcon_snoo2b7b6076-823b-4ec1-89ee-f13c02d19629-headshot.png?width=64&height=64&frame=1&auto=webp&crop=&s=5c05f5e56a15a48f8dfa43bfee8e1847777ec9ec",
  },
  {
    name: "Sparky Bartholomew",
    username: "u/offworldwelding",
    body: "That's pretty interesting. I'm using Trello at this point, but would consider shifting to a purpose built app/service. I'm using it for daily and project car maintenance and mods. Lots of Venn diagram overlap here.",
    img: "https://i.redd.it/snoovatar/avatars/a49eccfe-a0ed-4bf0-a2a4-7e00406d573f.png",
  },
  {
    username: "u/Penmob123",
    body: "This is actually really nice . I dont even know if there is anything like this on the market right now",
    img: "https://styles.redditmedia.com/t5_bxiqz4/styles/profileIcon_wjxvb2qggbye1.jpg?width=64&height=64&frame=1&auto=webp&crop=&s=37ea2dd8af06a7bd40344ce5bfafea534b7aa8e4",
  },
  {
    username: "u/jechaking",
    body: "Hello, I used PC view and yeah - I checked it out. I think it serves car enthusiasts like you said more, but it was pretty cool checking it out. I like what you did, well done 👏🏿.",
    img: "https://styles.redditmedia.com/t5_26e075/styles/profileIcon_snoo904aefcc-b4b8-4fd9-acf8-87de846269d3-headshot-f.png?width=64&height=64&frame=1&auto=webp&crop=&s=c3cfc8820c8a0292b8ce3713c4ba02947c3c953a",
  },
  {
    username: "u/jmacman12",
    body: "Reminds me of Wheel well but in this case it's more streamlined for keeping track of your own modifications and maintenance rather than showing off mods. Will check it out and report back!",
    img: "https://styles.redditmedia.com/t5_3mgj1/styles/profileIcon_snoo760a95ad-561b-4ceb-9d3f-3f4072d82c39-headshot-f.png?width=64&height=64&frame=1&auto=webp&crop=&s=f6178a79eaee178847691bb454ed34d07985c158",
  },
  {
    username: "u/One-Butterscotch4332",
    body: "Pretty cool! The ol phone note maintenence record could use an update. Is the data in a local DB, or is it all hosted somewhere (I'd prefer nothing leaving my device)",
    img: "https://preview.redd.it/snoovatar/avatars/nftv2_bmZ0X2VpcDE1NToxMzdfZWI5NTlhNzE1ZGZmZmU2ZjgyZjQ2MDU1MzM5ODJjNDg1OWNiMTRmZV8zMDgxOTg5OA_rare_867cf1bb-a871-4cdf-aa61-f766dc2bab94-headshot.png?width=64&height=64&auto=webp&s=228af04080c086836b78574a433bd48d0e7c003d",
  },
  {
    username: "u/BillyTheMilli",
    body: "for a feature, being able to scan receipts for fuel-ups/maintenance would be a game changer",
    img: "https://preview.redd.it/snoovatar/avatars/4ae15533-6acd-49b3-8037-ab83749c9c85-headshot.png?width=64&height=64&auto=webp&s=9db74d0a0edf1d669d8eacf97f043b71f5d12bfd",
  },
  {
    username: "u/smokedX",
    body: (
      <>
        <p>the idea is amazing , the UI is killing me though</p>
        <p>
          Pay $20 for a month of v0 premium and make yourself a nice and
          intuitive UI, it goes a long way even in the MVP stage
        </p>
      </>
    ),
    img: "https://preview.redd.it/snoovatar/avatars/8eca6699-bc13-4a4f-bd10-d7b190d93d0b-headshot.png?width=64&height=64&auto=webp&s=4ae74f63e5da9d413714e0b41dd1f0fcaf1f56b6",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name?: string;
  username: string;
  body: ReactNode;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="rounded-full"
          width="32"
          height="32"
          alt={username}
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name ?? username}
          </figcaption>
          {name ? (
            <p className="text-xs font-medium dark:text-white/40">{username}</p>
          ) : null}
        </div>
      </div>
      <blockquote className="mt-2 text-sm dark:text-content4-foreground">
        {body}
      </blockquote>
    </figure>
  );
};

export function Testimonials() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center overflow-hidden py-20">
      <div className="mb-10 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-content4-foreground">
          What Enthusiasts Are Saying
        </h2>
        <p className="mt-2 text-lg text-default-500">
          Early users share their thoughts about Revline 1
        </p>
      </div>
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
      <div className="mt-10">
        <Button
          size="lg"
          as="a"
          href="https://revline.one/app"
          className="bg-white text-black hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          Go to App <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </section>
  );
}
