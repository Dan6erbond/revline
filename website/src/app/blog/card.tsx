"use client";

import { Card, CardBody } from "@heroui/react";

import Link from "next/link";

export default function BlogCard({
  post,
}: {
  post: {
    slug: string;
    metadata: {
      title: string;
      summary: string;
      publishedAt: Date;
    };
  };
}) {
  return (
    <Card
      isPressable
      as={Link}
      href={`/blog/${post.slug}`}
      className="bg-zinc-900 border border-gray-700 text-white rounded-2xl hover:shadow-xl transition-shadow"
    >
      <CardBody className="flex flex-col gap-2 p-4 md:p-6">
        <p className="text-sm text-gray-400">
          {post.metadata.publishedAt.toLocaleDateString()}
        </p>
        <h2 className="text-2xl font-semibold">{post.metadata.title}</h2>
        <p className="text-gray-300">{post.metadata.summary}</p>
      </CardBody>
    </Card>
  );
}
