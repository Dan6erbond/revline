import { defineConfig, globalIgnores } from "eslint/config";

import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";
import graphqlPlugin from "@graphql-eslint/eslint-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  globalIgnores("src/gql/"),
  {
    files: ["**/*.js"],
    processor: graphqlPlugin.processor,
  },
]);

export default eslintConfig;
