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
            link: [
                {
                    rel: 'icon',
                    type: 'image/x-icon',
                    href: '/favicons/favicon_512.png',
                },
                {
                    rel: 'icon',
                    href: '/favicons/favicon_32.png',
                    sizes: '32x32',
                },
                {
                    rel: 'icon',
                    href: '/favicons/favicon_57.png',
                    sizes: '57x57',
                },
                {
                    rel: 'icon',
                    href: '/favicons/favicon_76.png',
                    sizes: '76x76',
                },
                {
                    rel: 'icon',
                    href: '/favicons/favicon_96.png',
                    sizes: '96x96',
                },
                {
                    rel: 'icon',
                    href: '/favicons/favicon_128.png',
                    sizes: '128x128',
                },
                {
                    rel: 'icon',
                    href: '/favicons/favicon_192.png',
                    sizes: '192x192',
                },
                {
                    rel: 'icon',
                    href: '/favicons/favicon_228.png',
                    sizes: '228x228',
                },
                //Android
                {
                    rel: 'shortcut icon',
                    href: '/favicons/favicon_196.png',
                    sizes: '196x196',
                },

                //IOS
                {
                    rel: 'apple-touch-icon',
                    href: '/favicons/favicon_120.png',
                    sizes: '120',
                },
                {
                    rel: 'apple-touch-icon',
                    href: '/favicons/favicon_152.png',
                    sizes: '152',
                },
                {
                    rel: 'apple-touch-icon',
                    href: '/favicons/favicon_180.png',
                    sizes: '180',
                },
            ],
        },
    },
    modules: ['@pinia/nuxt', '@vueuse/nuxt'],
});
