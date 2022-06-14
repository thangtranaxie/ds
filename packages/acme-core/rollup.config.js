/* eslint-disable import/no-anonymous-default-export */
import {
  defineConfig
} from "rollup";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import path from "path";
import copy from 'rollup-plugin-copy'
import sass from 'node-sass'
import fsExtra from 'fs-extra'


function bundleCSS() {
  return {
    name: 'bundle-css',
    writeBundle() {
      try {
        const globalSCSS = fsExtra.readFileSync(path.resolve(__dirname, 'src/styles/_index.scss'))
        const dangoComponentsCSS = fsExtra.readFileSync(path.resolve(__dirname, 'dist/esm/dango.css'))
  
        const allCSSResult = sass.renderSync({
          file: path.resolve(__dirname, './src/styles/_index.scss'),
          outputStyle: 'compressed',
          data: globalSCSS.toString() + dangoComponentsCSS.toString(),
        });
  
        fsExtra.outputFileSync(
          path.resolve(__dirname, 'dist/bundle.css'),
          allCSSResult.css
        )
      
        fsExtra.outputFileSync(
          path.resolve(__dirname, 'dist/styles/css/dango.css'),
          dangoComponentsCSS,
        )

        fsExtra.rmSync(path.resolve(__dirname, 'dist/esm/dango.css'))
        fsExtra.rmSync(path.resolve(__dirname, 'dist/cjs/dango.css'))
      } catch (error) {
        console.error('[bundleCSS]Error_Bundle_CSS', error);
      }
    },
  };
}

const getAdditionalScssData = () => {
  const scssFilePaths = [
    path.resolve(__dirname, "src/styles/_variables.scss"),
    path.resolve(__dirname, "src/styles/_utilities.scss"),
  ];

  return scssFilePaths.map((scssFile) => `@import "${scssFile}";`).join(`\n`);
};

const mainConfig = defineConfig({
  input: [
    "src/index.tsx",
  ],
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

    typescript({
      useTsconfigDeclarationDir: true
    }),
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
      modules: true,
      minimize: true,
      extract: 'dango.css'
    }),
    copy({
      targets: [{
        src: 'src/styles/*',
        dest: 'dist/styles/scss'
      }]
    }),
  ],
})

const cssConfig = defineConfig({
  input: [
    "src/styles/_index.scss",
  ],
  output: {
    file: "dist/bundle.css",
    format: "es",
  },
  plugins: [
    postcss({
      plugins: [autoprefixer()],
      modules: false,
      minimize: true,
      extract: path.resolve(__dirname, "dist/bundle.css"),
    }),
    bundleCSS()
  ],
});

export default defineConfig([mainConfig, cssConfig]);