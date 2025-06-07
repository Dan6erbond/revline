import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className="container mx-auto p-4 prose dark:prose-invert">{children}</section>;
}
