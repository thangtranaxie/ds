const path = require("path");

const getAdditionalScssData = () => {
  const scssFilePaths = [
    path.resolve(
      __dirname,
      "../../../packages/acme-core/src/styles/_variables.scss"
    ),
    path.resolve(
      __dirname,
      "../../../packages/acme-core/src/styles/_utilities.scss"
    )
  ]

  return scssFilePaths.map(scssFile => `@import "${scssFile}";`).join(`\n`)
}


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
            additionalData: getAdditionalScssData()
          },
        }
      }
    };
  },
};
