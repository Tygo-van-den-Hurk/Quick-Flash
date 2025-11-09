/** All properties that a Slyde HTML document requires. */
export interface SlydeHtmlDocumentCssProperties {
  /** The background color of the document */
  readonly background: string;
  /** The color of the text. */
  readonly foreground: string;
  /** The primary accent color of the text. */
  readonly primary: string;
  /** The secondary accent color of the text. */
  readonly secondary: string;
  /** The dimensions of the document in `--unit`. Dictates the aspect ratio as well. */
  readonly size: {
    /** The hight of the document in `--unit`. */
    readonly height: number;
    /** The width of the document in `--unit`. */
    readonly width: number;
  };
}

/** The config for tailwind in the browser. */
export const tailwindConfig = function tailwindConfig({
  background,
  foreground,
  secondary,
  primary,
}: SlydeHtmlDocumentCssProperties): { theme: Record<string, Record<string, unknown>> } {
  return {
    theme: {
      /**
       * Allow **only** these colors.
       */
      colors: { background, foreground, primary, secondary },

      /**
       * Extend the tailwind config with these options.
       */
      extend: {},

      /** The sizes of fonts */
      fontSize: {
        '2xl': 'calc(var(--font-size) * 1.75)',
        '2xs': 'calc(var(--font-size) * 0.25)',
        '3xl': 'calc(var(--font-size) * 2.00)',
        base: 'calc(var(--font-size) * 1.00)',
        lg: 'calc(var(--font-size) * 1.25)',
        sm: 'calc(var(--font-size) * 0.75)',
        xl: 'calc(var(--font-size) * 1.50)',
        xs: 'calc(var(--font-size) * 0.50)',
      },

      /**
       * Allow **only** the scale of `--unit` which is the unit of measurement in a slyde HTML document as it changes
       * based on the size of the document. All other measurements don't.
       */
      spacing: Object.fromEntries(
        Array.from({ length: 1000 }, (_ignore, amount) => [amount, `calc(${amount} * var(--unit))`])
      ),
    },
  };
};

/** Returns a base Tailwind CSS style block that sets default styles. */
export const baseTailwind = function baseTailwind(): string {
  // eslint-disable-next-line no-inline-comments
  return /*HTML*/ `
    <style type="text/tailwindcss">
      @layer base {
        a { @apply text-secondary; }
        a:hover { @apply underline; }
      }
    </style>
  `;
};

// eslint-disable-next-line no-inline-comments
const htmlConfig = /*CSS*/ `
  html {
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
    font-family: "DejaVu Sans", sans-serif !important;
  }
`;

// eslint-disable-next-line no-inline-comments
const nothingSelectable = /*CSS*/ `
  * {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
`;

/** The only part of the CSS that cannot be done using TailWindCss. */
export const baseCSS = function baseCSS({
  background,
  foreground,
  size,
}: Readonly<SlydeHtmlDocumentCssProperties>): string {
  // eslint-disable-next-line no-inline-comments
  return /*CSS*/ `
    head, style, script { display: none !important; }
    ${htmlConfig} ${nothingSelectable}

    body {
      background-color: ${background};
      aspect-ratio: ${size.width} / ${size.height};
      width: min(100vw, calc(100vh * ${size.width} / ${size.height}));
      height: min(100vh, calc(100vw * ${size.height} / ${size.width}));
      position: relative;
      overflow: hidden;
      container-name: document;
      container-type: size;
      --unit: 1cqh !important;
      color: ${foreground};
      /* This is not perfect, it needs some more min-max-math-ing */
      --font-size: min(2vw*(100/${size.width}),100vh*(2/${size.height})) !important;
      font-size: var(--font-size);
    }

    mjx-container { 
      display: inline-block;
      vertical-align: middle;
    }

    ${Array.from(
      { length: 10 },
      // eslint-disable-next-line no-inline-comments
      (_ignore, index) => /*CSS*/ `
          slyde-component[level="${index}"] {
            font-size: calc((${
              // eslint-disable-next-line @typescript-eslint/no-magic-numbers
              (93 / 100) ** index
            }) * var(--font-size));
          }
        `
    ).join('\n\n')}
  `;
};
