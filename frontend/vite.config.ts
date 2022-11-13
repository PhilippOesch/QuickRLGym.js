import { defineConfig } from 'vite';

export default defineConfig(({ command, mode, ssrBuild }) => {
    if (command === 'build') {
        return {
            base: 'https://PhilippOesch.github.io/TsTaxiRL/',
        };
    } else {
        return {};
    }
});
