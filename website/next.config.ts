import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "standalone",
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [/* ["remark-gfm"] */],
    rehypePlugins: [
      /* [
        "rehype-pretty-code",
        {
          theme: "tokyo-night",
          transformers: [transformerCopyButton()],
        },
      ], */
    ],
  },
});

export default withMDX(nextConfig);
