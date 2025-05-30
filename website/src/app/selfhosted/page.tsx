import { CopyButton } from "./copy-button";
import DockerCompose from "./docker-compose";
import FAQ from "./faq";
import type { Metadata } from "next";
import React from "react";
import Script from "next/script";
import { createHighlighter } from "shiki";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Self-Host Revline 1 – Full Control Over Your Car Data",
    description:
      "Run your own Revline 1 server and take full ownership of your data. Perfect for car enthusiasts and DIY mechanics who want privacy, customization, and total control over maintenance logs and upgrades.",
    openGraph: {
      title: "Self-Host Revline 1 – Full Control Over Your Car Data",
      description:
        "Run your own Revline 1 server and take full ownership of your data. Perfect for car enthusiasts and DIY mechanics who want privacy, customization, and total control over maintenance logs and upgrades.",
      url: "/selfhosted",
      siteName: "Revline 1",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Self-Host Revline 1 – Full Control Over Your Car Data",
      description:
        "Run your own Revline 1 server and take full ownership of your data. Perfect for car enthusiasts and DIY mechanics who want privacy, customization, and total control over maintenance logs and upgrades.",
      creator: "@dan6erbond",
    },
  };
}

export default async function Selfhosted() {
  const highlighter = await createHighlighter({
    themes: ["tokyo-night"],
    langs: ["bash", "json", "yaml"],
  });

  const frontendCodeRaw = `docker run -d \\
  --name revline-client \\
  -p 3000:3000 \\
  --env AUTH_SECRET=your_secure_random_string_here_32_characters_min \\
  --env AUTH_TRUST_HOST=true \\
  --env S3_URL=https://s3.yourdomain.com \\
  --env SERVER_URL=https://api.yourdomain.com \\
  --env AUTH_PROVIDERS='$AUTH_PROVIDERS' \\
  ghcr.io/dan6erbond/revline-client:main`;

  const frontendCode = await highlighter.codeToHtml(frontendCodeRaw, {
    lang: "bash",
    theme: "tokyo-night",
  });

  const authProvidersRaw = `[
    {
      "id": "oidc",
      "issuer": "https://auth.yourdomain.com/",
      "name": "My OIDC Provider",
      "clientId": "your-client-id",
      "clientSecret": "your-client-secret"
    }
  ]`;

  const authProvidersCode = await highlighter.codeToHtml(authProvidersRaw, {
    lang: "json",
    theme: "tokyo-night",
  });

  const backendCodeRaw = `docker run -d \\
  --name revline-server \\
  -p 4000:4000 \\
  -v "$(pwd)/config.yaml:/revline/config.yaml" \\
  ghcr.io/dan6erbond/revline-server:main`;

  const backendCode = await highlighter.codeToHtml(backendCodeRaw, {
    lang: "bash",
    theme: "tokyo-night",
  });

  const configYamlRaw = `environment: development
  databaseUrl: postgresql://postgres:postgres@localhost:5432/revline
  auth:
    providers:
      - name: oidc
        type: oidc
        issuerUrl: https://auth.yourdomain.com
        emailClaim: email
  s3:
    endpoint: https://s3.yourdomain.com
    bucket: revline
    accessKey: <your-minio-access-key>
    secretAccessKey: <your-minio-secret-key>
    useSsl: false
    region: local
  server:
    publicUrl: https://api.revline.yourdomain.com
  publicUrl: https://revline.yourdomain.com
  licenseKey: <your-license-jwt>`;

  const configYamlCode = await highlighter.codeToHtml(configYamlRaw, {
    lang: "yaml",
    theme: "tokyo-night",
  });

  return (
    <div className="container mx-auto py-16 px-4 text-content4-foreground">
      <h1 className="text-3xl font-bold mb-4">Revline 1 Self-Hosted</h1>
      <p className="mb-6 text-lg text-gray-200">
        Run Revline 1 on your own infrastructure with no limitations. One
        license gives all users of your instance access to the features of the
        selected tier. Whether you&apos;re a weekend wrench or a track junkie,
        Revline 1 self-hosted gives you total control.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Frontend (Client)</h2>
      <p className="text-gray-400 mb-4">
        This container serves the web interface and connects to your Revline API
        backend. Make sure you configure the environment variables correctly:
      </p>
      <ul className="list-disc list-inside text-gray-400 mb-6">
        <li>
          <code className="text-white">AUTH_SECRET</code>: A cryptographically
          secure string with at least 32 characters. You can generate one with{" "}
          <code className="text-white">openssl rand -base64 32</code>.
        </li>
        <li>
          <code className="text-white">AUTH_TRUST_HOST</code>: Should be set to{" "}
          <code className="text-white">true</code> in most self-hosted
          environments unless you&apos;re proxying differently.
        </li>
        <li>
          <code className="text-white">S3_URL</code>: The endpoint of your MinIO
          or S3-compatible object storage instance (e.g.{" "}
          <code className="text-white">https://s3.yourdomain.com</code>).
        </li>
        <li>
          <code className="text-white">SERVER_URL</code>: The full base URL to
          your Revline backend (e.g.{" "}
          <code className="text-white">https://api.revline.yourdomain.com</code>
          ).
        </li>
        <li>
          <code className="text-white">INTERNAL_SERVER_URL</code>: Used in
          environments without a reverse proxy. This should point to the backend
          service’s internal hostname and port (e.g.,{" "}
          <code className="text-white">http://server:4000</code>) so the
          frontend can communicate with the backend directly within the same
          Docker network.
        </li>
        <li>
          <code className="text-white">AUTH_PROVIDERS</code>: A JSON array
          defining one or more OAuth providers. For example:
          <div className="relative mt-2 mb-4">
            <pre className="overflow-x-auto p-4 bg-[#1a1b26] rounded-md text-sm">
              <code dangerouslySetInnerHTML={{ __html: authProvidersCode }} />
            </pre>
            <CopyButton
              className="absolute top-2 right-2"
              code={authProvidersRaw}
            />
          </div>
        </li>
      </ul>
      <div className="relative">
        <pre className="overflow-x-auto p-4 bg-[#1a1b26] rounded-md">
          <code dangerouslySetInnerHTML={{ __html: frontendCode }} />
        </pre>
        <CopyButton className="absolute top-2 right-2" code={frontendCodeRaw} />
      </div>
      <h3 className="text-xl font-semibold mt-12 mb-2">
        Hosting Under a Subpath
      </h3>
      <p className="mb-4 text-gray-400">
        If you want to host the frontend under a subpath (e.g.{" "}
        <code className="text-white">/revline</code>), you can do so by setting
        the <code className="text-white">BASE_PATH</code> environment variable.
        Note that if your app is behind a reverse proxy, it{" "}
        <strong>must not</strong> strip the base path. The frontend expects to
        receive requests like <code className="text-white">/revline/...</code>,
        not <code className="text-white">/...</code>.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Backend (Server)</h2>
      <p className="text-gray-400 mb-4">
        This container runs the core Revline API and handles data persistence.
        It expects a YAML configuration file at{" "}
        <code className="text-white">/revline/config.yaml</code>.
      </p>
      <div className="relative">
        <pre className="overflow-x-auto p-4 bg-[#1a1b26] rounded-md">
          <code dangerouslySetInnerHTML={{ __html: backendCode }} />
        </pre>
        <CopyButton className="absolute top-2 right-2" code={backendCodeRaw} />
      </div>
      <h3 className="text-xl font-semibold mt-8 mb-2">Sample Configuration</h3>
      <p className="text-gray-400 mb-4">
        The server uses a <code className="text-white">config.yaml</code> file
        to configure its environment, including database, auth providers, S3
        integration, and license key:
      </p>
      <div className="relative">
        <pre className="overflow-x-auto p-4 bg-[#1a1b26] rounded-md">
          <code dangerouslySetInnerHTML={{ __html: configYamlCode }} />
        </pre>
        <CopyButton className="absolute top-2 right-2" code={configYamlRaw} />
      </div>

      <DockerCompose />

      <h2 className="text-2xl font-semibold mt-6 mb-2">Pricing</h2>
      <p className="mb-4 text-gray-400">
        Choose your tier and unlock access for all users on your instance:
      </p>

      <Script async src="https://js.stripe.com/v3/pricing-table.js" />

      <stripe-pricing-table
        pricing-table-id="prctbl_1RUQtfB1tKvZvQUHgcSy5eLi"
        publishable-key="pk_live_51RGIJlB1tKvZvQUH1GlRYzRc0eCrviXQjo0P0eVuaeZBtc3AOYkPSZdV4LiNg8CDFDFOnuoG7KdsnOGX8vjVfMuJ004EkrJx1W"
      />

      <FAQ />
    </div>
  );
}
