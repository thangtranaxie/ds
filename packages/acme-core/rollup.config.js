import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";

export default {
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
      plugins: [autoprefixer()],
      use: [
        [
          "sass",
          {
            data: `
            @import \'src/styles/_variables.scss\';
            @import \'src/styles/_utilities.scss\';
          `,
          },
        ],
      ],
      modules: true,
      minimize: true,
    }),
  ],
};
