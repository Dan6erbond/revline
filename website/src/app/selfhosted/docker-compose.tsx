"use client";

import { Link } from "@heroui/react";

export default function DockerCompose() {
  return (
    <div className="container mx-auto p-4 md:p-6 mt-8">
      <div className="bg-primary-900/10 text-white rounded-2xl p-6 flex flex-col gap-4 shadow-md">
        <h3 className="text-lg font-bold">
          One-Click Docker Compose Deployment
        </h3>
        <p className="text-sm text-gray-300">
          For a hassle-free setup, you can deploy both the Revline 1 frontend
          and backend together using our official Docker Compose file.
        </p>
        <p className="text-sm text-gray-300">
          Simply grab the <code>docker-compose.yml</code> from our{" "}
          <Link
            href="https://github.com/Dan6erbond/revline/blob/main/sample-docker-compose.yml"
            target="_blank"
            isExternal
          >
            official GitHub repository
          </Link>{" "}
          and run <code>docker-compose up -d</code>. This setup is ideal if you
          want to quickly start self-hosting without manually configuring each
          service.
        </p>
        <p className="text-sm text-gray-300">
          For advanced customization, you can always tweak the compose file or
          split frontend and backend deployment as described above.
        </p>
      </div>
    </div>
  );
}
