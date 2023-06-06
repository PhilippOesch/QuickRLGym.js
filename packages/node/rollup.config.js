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
    ],
    external: ['@tensorflow/tfjs', 'quickrl.core', 'path', 'fs/promises'],
    plugins: [
        typescript({
            exclude: ['src/testing', 'node_modules'],
        }),
    ],
};
