const path = require("path");

const scssVariablesFilePath = path.resolve(
  __dirname,
  "../../../packages/acme-core/src/styles/_variables.scss"
)
const scssUtilsFilePath = path.resolve(
  __dirname,
  "../../../packages/acme-core/src/styles/_utilities.scss"
)

console.log(scssVariablesFilePath);

module.exports = {
  stories: ["../stories/**/*.stories.mdx", "../stories/**/*.stories.tsx"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials" , "storybook-addon-sass-postcss"],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
  },
  async viteFinal(config, { configType }) {
    // customize the Vite config here
    return {
      ...config,
      resolve: {
        alias: [
          {
            find: "@acme/core",
            replacement: path.resolve(
              __dirname,
              "../../../packages/acme-core/"
            ),
          },
        ],
      },
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `
              @import "${scssVariablesFilePath}";
              @import "${scssUtilsFilePath}";
            `
          },
        }
      }
    };
  },
};
