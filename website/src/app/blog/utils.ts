import fs from "fs";
import { getFrontmatter } from "next-mdx-remote-client/utils";
import path from "path";

export type Metadata = {
  title: string;
  publishedAt: Date;
  summary: string;
  image?: string;
  author?: string;
};

function parseFrontmatter(fileContent: string) {
  const { frontmatter: data, strippedSource } =
    getFrontmatter<Metadata>(fileContent);

  return {
    metadata: {
      ...data,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
    } as Metadata,
    content: fileContent,
    strippedSource,
  };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content,strippedSource } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
      strippedSource,
    };
  });
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), "src", "app", "blog", "posts"));
}
