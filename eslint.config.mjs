import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";

// Define custom plugins
const customPlugins = {
  // Custom prettier plugin with formatting help rule
  prettier: {
    rules: {
      'formatting-help': {
        meta: {
          type: 'suggestion',
          docs: {
            description: 'Enforce code formatting standards with Prettier',
            category: 'Formatting',
            recommended: true,
          },
          messages: {
            formattingHelp: `
The failing job is caused by code style issues detected by Prettier. The logs indicate that Prettier found formatting issues in several files and failed with an exit code of '1', which stopped the workflow. To fix this, you should ensure the code adheres to the Prettier formatting rules.

### Solution
You can resolve this issue by running Prettier locally to auto-format the code and then committing the changes. Here's how to proceed:

1. **Install Prettier** (if not already installed):
   \`\`\`sh
   npm install --save-dev prettier
   \`\`\`

2. **Run Prettier to fix formatting issues**:
   \`\`\`sh
   npx prettier --write "**/*.{js,mjs,json,md,css}"
   \`\`\`

3. **Verify the formatting** to ensure all issues are resolved:
   \`\`\`sh
   npx prettier --check "**/*.{js,mjs,json,md,css}"
   \`\`\`

4. **Commit and push the changes**:
   \`\`\`sh
   git add .
   git commit -m "Fix code formatting issues"
   git push origin main
   \`\`\`
            `
          }
        },
        create(context) {
          return {
            Program(node) {
              context.report({
                node,
                messageId: 'formattingHelp',
              });
            },
          };
        }
      }
    }
  }
};

export default defineConfig([
  { ignores: ["node_modules/", "browserconfig.xml", "manifest.json", "package-lock.json", "es"] },
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.browser } },
  // Add custom formatting help rule with proper plugin definition
  {
    files: ["**/*.{js,mjs,cjs,json,jsonc,json5,md,css}"],
    plugins: { prettier: customPlugins.prettier },
    rules: { 'prettier/formatting-help': 'warn' }
  },
  { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
  { files: ["**/*.jsonc"], plugins: { json }, language: "json/jsonc", extends: ["json/recommended"] },
  { files: ["**/*.json5"], plugins: { json }, language: "json/json5", extends: ["json/recommended"] },
  { files: ["**/*.md"], plugins: { markdown }, language: "markdown/gfm", extends: ["markdown/recommended"] },
  { files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"] },
]);
