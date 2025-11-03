const MAX = 600;
const spacing = { };
for (let index = 0; index <= MAX; index +=1) {
  spacing[index] = `calc(var(--unit) * ${index})`;
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './{lib,src}/**/*.{ts,html,js}',
  ],
  theme: {
    spacing,
  },
};
