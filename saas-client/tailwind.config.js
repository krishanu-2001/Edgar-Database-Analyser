const baseConfig = {
    darkMode: 'class',
    theme: {
        extend: {
            dropShadow: {
                'lg': '0 10px 10px rgba(0, 0, 0, 0.25)',
                '2xl': [
                    '0 35px 35px rgba(0, 0, 0, 0.25)',
                    '0 45px 45px rgba(0, 0, 0, 0.15)'
                ]
            },
            boxShadow: {
                sm: '0 1px 2px 0 rgba(0, 3, 15, 0.05)',
                DEFAULT:
                    'none',
                md: '0 4px 6px -1px rgba(0, 3, 15, 0.1), 0 2px 4px -1px rgba(0,3,15, 0.06)',
                lg: '0 10px 15px -3px rgba(0, 3, 15, 0.1), 0 4px 6px -2px rgba(0,3,15, 0.05)',
                xl: '0 20px 25px -5px rgba(0, 3, 15, 0.1), 0 10px 10px -5px rgba(0,3,15, 0.04)',
                '2xl': '0 25px 50px -12px rgba(0, 3, 15, 0.25)',
                '3xl': '0 35px 60px -15px rgba(0, 3, 15, 0.3)',
                inner: 'inset 0 2px 4px 0 rgba(0, 3, 15, 0.06)',
                none: 'none',
            },
            borderRadius: {
                large: '2rem'
            },
            fontSize: {
                'base-lg': '1.065rem',
                'sm-base': '0.935rem',
            },
            colors: {
                'saas-primary': "var(--primary)",
                'saas-secondary': "var(--secondary)",
                'saas-accent': "var(--accent)",
                'saas-background': "var(--background)",
                'saas-main': "var(--main)",
                'saas-header': "var(--header)"
            },
            fontFamily: {
                sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                mono: '"SF Mono", SFMono-Regular, ui-monospace, "DejaVu Sans Mono", Menlo, Consolas, monospace',
                lab: "'Lab Grotesque', system-ui",
                extra: ['Oswald'],
                searchbar: ['Cinzel']
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('tailwind-scrollbar'),
    ],
}

module.exports = {
    presets: [baseConfig],
    content: ['./index.html', './src/**/*.{vue,js,jsx,tsx}'],
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        extend: {
            backgroundImage: {
                main: `url(@/assets/img/main-background.svg)`,
            },
            zIndex: {
                '-1': '-1',
            },
            flexGrow: {
                5: '5',
            },
            maxHeight: {
                'screen-menu': 'calc(100vh - 3.5rem)',
                modal: 'calc(100vh - 160px)',
            },
            transitionProperty: {
                position: 'right, left, top, bottom, margin, padding',
                textColor: 'color',
            },
            keyframes: {
                fadeOut: {
                    from: { opacity: '1' },
                    to: { opacity: '0' },
                },
                fadeIn: {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
            },
            animation: {
                fadeOut: 'fadeOut 250ms ease-in-out',
                fadeIn: 'fadeIn 250ms ease-in-out',
            },
        },
    }
}
