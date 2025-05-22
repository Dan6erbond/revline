import Article from "./article";
import { getBlogPosts } from "@/app/blog/utils";
import { notFound } from "next/navigation";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { serialize } from "next-mdx-remote-client/serialize";

export async function generateStaticParams() {
  const posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug);
  if (!post) {
    return;
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    /* image, */
  } = post.metadata;
  /* const ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`; */

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      /* url: `${baseUrl}/blog/${post.slug}`, */
      /* images: [
        {
          url: ogImage,
        },
      ], */
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      /* images: [ogImage], */
    },
  };
}

export default async function Blog({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  /* const Content = await import(`@/app/blog/posts/${slug}.mdx`); */

  return (
    <main>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            /* image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`, */
            author: {
              "@type": "Person",
              name: "RaviAnand Mohabir",
            },
          }),
        }}
      />
      <section className="container mx-auto p-4 md:p-6 text-foreground">
        <h1 className="title font-semibold text-2xl tracking-tighter">
          {post.metadata.title}
        </h1>
        <div className="flex justify-between items-center mt-2 mb-8 text-sm">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {new Date(post.metadata.publishedAt).toLocaleDateString()}
          </p>
        </div>
        {/* <Content /> */}
        <Article
          source={await serialize({
            source: post.strippedSource,
            options: {
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  [
                    rehypePrettyCode,
                    {
                      theme: "tokyo-night",
                      /* transformers: [transformerCopyButton()], */
                    },
                  ],
                ],
              },
            },
          })}
        />
      </section>
    </main>
  );
}
