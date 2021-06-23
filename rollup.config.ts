import nodeResolve from '@rollup/plugin-node-resolve';
import bundleSize from 'rollup-plugin-bundle-size';
import {terser} from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

const globals = {
  d3: 'd3',
  'dagre-d3': 'dagreD3',
  'monaco-editor-core': 'monaco',
};

const output = {
  sourcemap: true,
  format: 'umd',
  name: 'relayVis',
  globals,
};

export default {
  input: 'src/index.ts',
  external: Object.keys(globals),
  output: [
    {
      file: pkg.module,
      sourcemap: true,
      format: 'esm',
      // globals
    },
    {...output, file: pkg.main},
    {...output, file: pkg.jsdelivr, plugins: [terser()]},
  ],
  plugins: [
    nodeResolve({browser: true}),
    typescript({tsconfig: 'tsconfig.build.json'}),
    bundleSize(),
  ],
};
