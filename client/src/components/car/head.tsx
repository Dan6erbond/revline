import Head from "next/head";

export default function CarHead({
  car,
  baseUrl,
  basePath,
  page = "overview",
}: {
  car: {
    __typename?: "Car";
    id: string;
    name: string;
    make?: string | null;
    model?: string | null;
    trim?: string | null;
    year?: number | null;
    bannerImage?: {
      __typename?: "Media";
      id: string;
      url: string;
    } | null;
    owner?: {
      __typename?: "User";
      id: string;
      email: string;
      profile?: {
        __typename?: "Profile";
        id: string;
        username?: string | null;
      } | null;
    } | null;
  };
  baseUrl: string;
  basePath: string;
  page?: "overview" | "mods" | "build-log";
}) {
  const { name, make, model, trim, year, owner, id } = car;
  const username = owner?.profile?.username || "a Revline 1 user";
  const fallbackTitleParts = [year, make, model, trim].filter(Boolean);
  const carTitle = name || fallbackTitleParts.join(" ");

  let titleSuffix = "";
  let description = "";
  const imageUrl = new URL(
    basePath + `/cars/${id}/opengraph-image`,
    baseUrl
  ).toString();

  switch (page) {
    case "mods":
      titleSuffix = "Modifications Showcase";
      description = `Browse custom mods, upgrades, and tweaks made to ${carTitle}, shared by ${username} on Revline 1.`;
      break;
    case "build-log":
      titleSuffix = "Build Logs";
      description = `Explore detailed build logs and progress notes for ${carTitle}, contributed by ${username} on Revline 1.`;
      break;
    case "overview":
    default:
      titleSuffix = "Overview";
      description = name
        ? `Explore ${name}, a custom build by ${username}. Discover specs, history, and more.`
        : `Discover details of ${fallbackTitleParts.join(
            " "
          )}, owned by ${username}, on Revline 1.`;
      break;
  }

  const title = `${carTitle} | ${titleSuffix} | Revline 1`;
  const canonicalUrl = new URL(basePath + `/cars/${id}`, baseUrl).toString();

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Revline" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  );
}
