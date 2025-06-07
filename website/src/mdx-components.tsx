import Image, { ImageProps } from "next/image";

import type { MDXComponents } from "mdx/types";
import MdxLink from "./components/ui/mdx-link";
import React from "react";
import slugify from "slugify";

type TableProps = {
  data: {
    headers: string[];
    rows: React.ReactNode[][];
  };
};

function Table({ data }: TableProps) {
  const headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ));
  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function RoundedImage(props: ImageProps) {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image className="rounded-lg" {...props} />;
}

function createHeading(level: number) {
  const Heading = ({ children }: { children: string }) => {
    const slug = slugify(children, { lower: true });
    return React.createElement(
      `h${level}`,
      { id: slug, className: "scroll-mt-20" },
      [
        React.createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor",
          onClick: () => {
            navigator.clipboard.writeText(
              new URL(
                `${document.location.pathname}#${slug}`,
                document.location.origin
              ).toString()
            );
          },
        }),
      ],
      children
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

const globalComponents: MDXComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: MdxLink,
  /* code: Code, */
  Table,
};

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...globalComponents,
    ...components,
  };
}
