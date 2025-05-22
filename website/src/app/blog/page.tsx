import BlogCard from "./card";
import { getBlogPosts } from "./utils";

export default function Blog() {
  const posts = getBlogPosts();

  return (
    <main>
      <section className="relative overflow-hidden bg-background text-white min-h-[90vh] px-4 sm:px-8 py-24">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              📚 The Revline Blog
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Tips, tools, and stories from the garage. Stay in the loop with
              the Revline community.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
