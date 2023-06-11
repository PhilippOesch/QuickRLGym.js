import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default [
    {
        input: 'src/index.ts',
        external: ['path', 'fs/promises', '@tensorflow/tfjs', 'quickrl.core'],
        plugins: [
            typescript(), // so Rollup can convert TypeScript to JavaScript
        ],
        output: [
            { file: 'dist/index.cjs', format: 'cjs', plugins: [terser()] },
            { file: 'dist/index.esm.js', format: 'es', plugins: [terser()] },
        ],
    },
];
