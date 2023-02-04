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
            colors: {
                darkPurple: {
                    900: '#181528',
                    800: '#252236',
                    700: '#383450',
                    600: '#4c4864',
                },
                themeBlue: {
                    light: '#48abd5',
                    default: '#247ba0',
                },
            },
        },
    },
    safelist: [
        'text-amber-500',
        'text-sky-500',
        'text-green-500',
        'text-pink-500',
        'bg-amber-700',
        'bg-green-700',
        'bg-sky-700',
        'bg-pink-700',
        'bg-darkPurple-800',
    ],
    plugins: [],
};
