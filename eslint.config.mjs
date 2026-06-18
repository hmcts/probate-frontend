import { LintingConfig } from "@hmcts/playwright-common";
import tseslint from "typescript-eslint";

LintingConfig.ignored.ignores = LintingConfig.ignored.ignores.concat([
  "*.js",
  "**/*.js",
  "node_modules/*",
  "govuk/*",
  "public/*",
  "server/*",
  "app/*",
  "coverage",
  "**/*.min.js",
  "target/*",
  "build/*",
  "functional-output/*",
  "test/component/*",
  "test/accessibility/*.js",
  "test/contract/**",
  "test/unit/**",
  "test/util/**",
  "test/smoke/**",
  "test/*.js",
  "test/*/*.js",
  "**/test/end-to-end/*",
  "mochawesome-report/*/*.js",
  "output/assets/*.js"
]);
LintingConfig.tseslintRecommended.files = ["test/playwrightTest/**/*.ts"];
LintingConfig.tseslintPlugin.files = ["test/playwrightTest/**/*.ts"];
LintingConfig.playwright.files = ["test/playwrightTest/**/*.ts"];

export default tseslint.config(
  LintingConfig.ignored,
  LintingConfig.tseslintRecommended,
  LintingConfig.tseslintPlugin,
  LintingConfig.playwright
);
