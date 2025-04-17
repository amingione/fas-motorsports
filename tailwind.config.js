/ ** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
        './src/app/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
        './src/pages/**/*.{js,ts,jsx,tsx}',
        './src/layouts/**/*.{js,ts,jsx,tsx}',
        './src/**/*.{js,ts,jsx,tsx,astro,css}', // <-- add astro/css if you use them
      ],
    safelist: [
        'bg-primary',
        'bg-secondary',
        'bg-accent',
        'bg-graylight',
        'bg-background',
    ],
    theme: {
      extend: {
        colors: {
          primary: 'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          accent: 'var(--color-accent)',
          graylight: 'var(--color-graylight)',
          background: 'var(--color-background)',
        }
      }
    }
}
