import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default [
    // browser-friendly UMD build
    {
        input: 'src/index.ts',
        plugins: [
            resolve(), // so Rollup can find `ms`
            commonjs(), // so Rollup can convert `ms` to an ES module
            typescript(), // so Rollup can convert TypeScript to JavaScript
            terser(),
        ],
        external: ['@tensorflow/tfjs'],
        output: {
            name: 'quickrl.core',
            globals: { '@tensorflow/tfjs': 'tf' },
            file: 'dist/index.umd.js',
            format: 'umd',
        },
    },
    {
        input: 'src/index.ts',
        external: ['@tensorflow/tfjs', 'seedrandom'],
        plugins: [
            typescript(), // so Rollup can convert TypeScript to JavaScript
        ],
        output: [
            { file: 'dist/index.cjs', format: 'cjs', plugins: [terser()] },
            { file: 'dist/index.esm.js', format: 'es', plugins: [terser()] },
        ],
    },
];
