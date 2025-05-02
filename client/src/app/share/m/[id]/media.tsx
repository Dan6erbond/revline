"use client";

import { Avatar, Card, CardBody, CardHeader, Image } from "@heroui/react";

import { getMedia } from "./query";
import { useSuspenseQuery } from "@apollo/client";

export default function Media({ id }: { id: string }) {
  const { data } = useSuspenseQuery(getMedia, { variables: { id } });

  const { url, car } = data.media;
  const { name, owner } = car ?? {};
  const { email, profile } = owner ?? {};

  return (
    <div className="p-4 md:p-8">
      <Card className="max-w-xl mx-auto shadow-lg rounded-2xl bg-background border border-zinc-800">
        <CardHeader className="flex flex-col items-start space-y-2">
          <p className="text-primary text-xl">Shared Media</p>
          <div className="flex items-center space-x-4">
            <Avatar
              className="w-10 h-10"
              src={profile?.pictureUrl ?? undefined}
              name={profile?.username ?? undefined}
            />
            <div className="text-content-1-foreground">
              <p className="font-medium">{profile?.username}</p>
              <p className="text-sm text-content-3-foreground">{email}</p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <Image
            src={url}
            alt={`Car media for ${name}`}
            className="w-full h-auto rounded-xl border border-zinc-800"
          />
          <div>
            <h3 className="text-lg font-semibold text-secondary">Car</h3>
            <p className="text-content-2-foreground">{name}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
