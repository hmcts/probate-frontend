import { LintingConfig } from "@hmcts/playwright-common";
import tseslint from "typescript-eslint";

LintingConfig.ignored.ignores = LintingConfig.ignored.ignores.concat([
  "**/*.js"
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
