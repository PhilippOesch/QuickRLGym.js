/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './nuxt.config.{js,ts}',
        './app.vue',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Helvetica', 'sans-serif'],
            },
        },
    },
    safelist: [
        'text-amber-500',
        'text-sky-500',
        'text-green-600',
        'text-pink-600',
    ],
    plugins: [],
};
