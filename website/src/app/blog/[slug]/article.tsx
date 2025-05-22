"use client";

import { MDXClient, type SerializeResult } from "next-mdx-remote-client";

export default function Article({ source }: { source: SerializeResult }) {
  if ("error" in source) {
    return "Error";
  }

  return (
    <article className="prose dark:prose-invert">
      <MDXClient {...source} />
    </article>
  );
}
