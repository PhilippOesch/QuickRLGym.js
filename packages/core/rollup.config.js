import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.cjs.js',
            format: 'cjs',
            plugins: [terser()],
        },
        {
            file: 'dist/index.es.js',
            format: 'es',
            plugins: [terser()],
        },
    ],
    external: ['seedrandom', '@tensorflow/tfjs'],
    plugins: [
        typescript({
            exclude: ['src/testing', 'node_modules'],
        }),
    ],
};
