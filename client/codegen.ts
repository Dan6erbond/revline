import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema:
    process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql",
  documents: ["src/**/*.{ts,tsx}"],
  generates: {
    "./src/gql/": {
      preset: "client",
    },
  },
};
export default config;
