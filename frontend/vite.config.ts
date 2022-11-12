import { defineConfig } from "vite";

// vite.config.ts
// export default {
//     //base: "https://PhilippOesch.github.io/TsTaxiRL/",
//     // server: {
//     //     fs: {
//     //         // Allow serving files from one level up to the project root
//     //         allow: ["../shared", "./"],
//     //     },
//     // },
//     // build: {
//     //     fs: {
//     //         // Allow serving files from one level up to the project root
//     //         allow: ["../shared", "./"],
//     //     },
//     // },
// };

export default defineConfig(({ command, mode, ssrBuild }) => {
    if (command === "build") {
        return {
            base: "https://PhilippOesch.github.io/TsTaxiRL/",
        };
    } else {
        return {};
    }
});
