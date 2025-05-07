import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql",
    "./schema.graphql",
  ],
  documents: ["src/**/*.{ts,tsx}"],
  generates: {
    "./src/gql/": {
      preset: "client",
    },
    "src/gql/apollo-helpers.ts": {
      plugins: ["typescript-apollo-client-helpers"],
    },
    "src/gql/possibleTypes.json": {
      plugins: ["fragment-matcher"],
      config: {
        useExplicitTyping: true,
      },
    },
  },
};
export default config;
