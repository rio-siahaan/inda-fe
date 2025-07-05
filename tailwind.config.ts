import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/app/**/*.{js,ts,jsx,tsx}',
        './src/component/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                "dark-blue": "#063573",
                "black": "#000000",
                "white": '#ffffff',
                "white-2": '#f2f2f2',
                "cyan": '#04BF7B',
                "orange": '#D9601A',
                "dark-orange": '#BF5315',
            },
        },
    },
};

export default config;
