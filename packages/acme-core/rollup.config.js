/* eslint-disable import/no-anonymous-default-export */
import { defineConfig } from "rollup";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import path from "path";
import copy from 'rollup-plugin-copy'

const getAdditionalScssData = () => {
  const scssFilePaths = [
    path.resolve(__dirname, "src/styles/_variables.scss"),
    path.resolve(__dirname, "src/styles/_utilities.scss"),
  ];

  return scssFilePaths.map((scssFile) => `@import "${scssFile}";`).join(`\n`);
};

const mainConfig = defineConfig({
  input: "src/index.tsx",
  output: [
    {
      file: "dist/cjs/index.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/esm/index.js",
      format: "esm",
      sourcemap: true,
    },
  ],
  external: ["react-dom", "react", "react/jsx-runtime"],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),

    typescript({ useTsconfigDeclarationDir: true }),
    postcss({
      plugins: [
        autoprefixer(),
      ],
      use: [
        [
          "sass",
          {
            data: getAdditionalScssData(),
          },
        ],
      ],
      inject: (cssVariableName, fileId) => {
        if (fileId.includes('_root.scss')) {
          return ''
        }
        return `import styleInject from 'style-inject';\nstyleInject(${cssVariableName});`;
      },
      modules: true,
      minimize: true,
    }),
    copy({
      targets: [
        { src: 'src/styles/**', dest: 'dist/styles/scss' }
      ]
    })
  ],
})

const cssConfig = defineConfig({
  input: "src/styles/_index.scss",
  output: {
    file: "dist/styles/css/index.css",
    format: "es",
  },
  plugins: [
    postcss({
      plugins: [autoprefixer()],
      modules: true,
      extract: true,
    }),
  ],
});

export default defineConfig([mainConfig, cssConfig]);
