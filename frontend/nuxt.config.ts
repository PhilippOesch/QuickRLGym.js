// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: true,
    css: ['public/css/main.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    app: {
        head: {
            title: 'QuickRLJS',
            htmlAttrs: {
                lang: 'en',
            },
        },
    },
    modules: ['@pinia/nuxt', '@vueuse/nuxt'],
});
