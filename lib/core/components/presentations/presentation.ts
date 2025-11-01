import { Component, Registry } from '#lib';

const DEFAULT_DESCRIPTION = 'This is a presentation made with Slyde.' as const;
const DEFAULT_KEYWORDS = 'Slyde, presentation' as const;
const DEFAULT_AUTHOR = process.env.USER ?? process.env.USERNAME ?? 'an unknown author';
const DEFAULT_BACKGROUND = '#FfFfFf';
const DEFAULT_FOREGROUND = '#000000';
const DEFAULT_ACCENT = '#3B82F6';
const DEFAULT_ICON_URL = `data:image/svg+xml;base64,
PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDov
L3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMC4yMDQ0IDYyNS4wMDQ5IDY1Ny45OTk2
IiB3aWR0aD0iNjI1LjAwNXB4IiBoZWlnaHQ9IjY1OHB4Ij4KICA8ZGVmcz4KICAgIDxsaW5lYXJH
cmFkaWVudCBpZD0ibGluZWFyR3JhZGllbnQzOTU3IiB4MT0iMjA1LjM4MTg0IiB5MT0iNDQwLjY3
MjczIiB4Mj0iNTYyLjUwOTA5IiB5Mj0iMTEwLjgxODE4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3Bh
Y2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLjA3NDk3MywgMCwgLTAuNDE5NzQz
LCAxLjA1NzgzOCwgNDcuNjA5MiwgLTEwLjY1NzgwMSkiIGhyZWY9IiNsaW5lYXJHcmFkaWVudDM5
NTYiLz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibGluZWFyR3JhZGllbnQzOTU2Ij4KICAgICAg
PHN0b3Agc3R5bGU9InN0b3AtY29sb3I6I2ZmNzIxODtzdG9wLW9wYWNpdHk6MTsiIG9mZnNldD0i
MCIgaWQ9InN0b3AzOTU2Ii8+CiAgICAgIDxzdG9wIHN0eWxlPSJzdG9wLWNvbG9yOiNmOWMyNjI7
c3RvcC1vcGFjaXR5OjE7IiBvZmZzZXQ9IjEiIGlkPSJzdG9wMzk1NyIvPgogICAgPC9saW5lYXJH
cmFkaWVudD4KICA8L2RlZnM+CiAgPGcgaWQ9ImcxIiBzdHlsZT0iZGlzcGxheTogaW5saW5lOyB0
cmFuc2Zvcm0tb3JpZ2luOiAyODguNjk1cHggMzI5LjkyMnB4OyIgdHJhbnNmb3JtPSJtYXRyaXgo
MS4wMDIzODgsIDAsIDAsIDEuMDAyMzg4LCAxNC4zNDc5NDI2NCwgLTAuNzE3ODA0MDIpIj4KICAg
IDxwYXRoIGQ9Ik0gNTYxLjc4MSAxLjcwNiBMIDUyNy41NjMgOS42NTYgTCA0OTMuMzQ2IDE3LjYw
NiBMIDQwMS4wNSAzOS4xMjkgTCAzMDguNzU3IDYwLjY1MSBMIDMxNC4zMDIgNjEuMzM5IEwgMzE5
Ljg1IDYyLjAyNSBMIDM4MC41MjcgNjIuMDM2IEwgNDQxLjIwNiA2Mi4wNDYgTCA0MzkuNzQxIDYz
LjA4MyBMIDQzOC4yNzMgNjQuMTIgTCAzNDcuOTk2IDg1LjgyNyBMIDI1Ny43MTkgMTA3LjUzMyBM
IDI1NS4xNzggMTA4LjUxOCBMIDI1Mi42MzcgMTA5LjUwNCBMIDMyNy44MDEgMTA5LjU3NiBMIDQw
Mi45NjggMTA5LjY0OSBMIDQwMS41NjIgMTEwLjYxNiBMIDQwMC4xNTggMTExLjU4MyBMIDMwMS43
MDggMTMzLjQ4MyBMIDIwMy4yNTggMTU1LjM4MiBMIDIwMS44NjUgMTU2LjMxOCBMIDIwMC40NzQg
MTU3LjI1MiBMIDI4Mi42MDIgMTU3LjI1MiBMIDM2NC43MyAxNTcuMjUyIEwgMzYzLjMzOSAxNTgu
MTgxIEwgMzYxLjk1IDE1OS4xMTEgTCAyNTYuNzQ4IDE4MS4xODkgTCAxNTEuNTQ3IDIwMy4yNjcg
TCAyMzguNTYyIDIwMy41MzggTCAzMjUuNTc2IDIwMy44MDkgTCAzMjQuNjExIDIwNS4xMjUgTCAz
MjMuNjQ2IDIwNi40NDEgTCAzMDguNTc2IDIwOS40MjIgTCAyOTMuNTA1IDIxMi40MDQgTCAyMTIu
NTA0IDIyOC4yNTUgTCAxMzEuNTAzIDI0NC4xMDggTCAxMTMuNDMgMjQ3LjY2NCBMIDk1LjM1OCAy
NTEuMjE3IEwgMTkxLjI2MyAyNTEuMzA4IEwgMjg3LjE2OSAyNTEuMzk5IEwgMjg2Ljc3OCAyNTIu
Mzg1IEwgMjg2LjM4NiAyNTMuMzcyIEwgMjg0LjE5OCAyNTMuOTggTCAyODIuMDExIDI1NC41ODcg
TCAxOTYuMjA4IDI3MC41MTUgTCAxMTAuNDA2IDI4Ni40NDIgTCA3Ny4zMTggMjkyLjYxOCBMIDQ0
LjIzMSAyOTguNzkzIEwgMTQ2LjU4MSAyOTguODk2IEwgMjQ4LjkzMSAyOTkuMDAyIEwgMjQ4LjUx
OSAzMDAuMDM5IEwgMjQ4LjEwOCAzMDEuMDc2IEwgMjQ1LjQ2OCAzMDEuNjM0IEwgMjQyLjgyOCAz
MDIuMTkgTCAxOTcuMTk2IDMxMC4xODEgTCAxNTEuNTY0IDMxOC4xNzEgTCA5OC40MDIgMzI3LjUz
IEwgNDUuMjM5IDMzNi44OTIgTCAxNS44MDYgMzQyLjAxMiBMIC0xMy42MjYgMzQ3LjEzMyBMIDE0
Ny41NDUgMzQ3LjY2MiBMIDMwOC43MTUgMzQ4LjE5MSBMIDI5MS4xMzUgMzY4LjgxOSBMIDI3My41
NTIgMzg5LjQ0NyBMIDI0OS4yNSA0MTguMDA5IEwgMjI0Ljk0NiA0NDYuNTcgTCAxOTQuMzI1IDQ4
Mi41MzcgTCAxNjMuNzA1IDUxOC41MDMgTCAxMDUuNDk5IDU4Ni43MzQgTCA0Ny4yOTEgNjU0Ljk2
NCBMIDQ2LjA3NiA2NTYuNTUxIEwgNDQuODYzIDY1OC4xMzggTCA0OS4zNDUgNjU0Ljk2NCBMIDUz
LjgyOSA2NTEuNzkxIEwgMTY4LjU5NiA1NjMuOTg4IEwgMjgzLjM2MSA0NzYuMTg4IEwgMzE4Ljc1
NSA0NDkuMjEzIEwgMzU0LjE0NyA0MjIuMjM4IEwgMzYxLjkxNiA0MTYuMzg1IEwgMzY5LjY4NiA0
MTAuNTI5IEwgMzc1LjkxNCA0MDUuODA2IEwgMzgyLjE0NiA0MDEuMDgxIEwgNDUyLjIxMiAzNDcu
NjIzIEwgNTIyLjI4MSAyOTQuMTY1IEwgNTYwLjg4MiAyNjQuNjEgTCA1OTkuNDg0IDIzNS4wNTQg
TCA2MDQuNjg2IDIzMS4wNjEgTCA2MDkuODkgMjI3LjA2NyBMIDUwMC4xODIgMjI3LjA2NyBMIDM5
MC40NzIgMjI3LjA2NyBMIDM5MC4zNSAyMjYuMjczIEwgMzkwLjIyOCAyMjUuNDggTCA0MTkuMjYx
IDE4Ny45MjcgTCA0NDguMjk0IDE1MC4zNzQgTCA0ODEuMjYzIDEwNy41MzEgTCA1MTQuMjMgNjQu
Njg5IEwgNTM4LjI0MyAzMy41OCBMIDU2Mi4yNTQgMi40NyBMIDU2Mi4wMTcgMi4wODggTCA1NjEu
NzgxIDEuNzA2IFoiIHN0eWxlPSJmaWxsOiB1cmwoJnF1b3Q7I2xpbmVhckdyYWRpZW50Mzk1NyZx
dW90Oyk7IHN0cm9rZS13aWR0aDogMS4wNjYzNzsiIGlkPSJwYXRoMzk1NyIvPgogIDwvZz4KPC9z
dmc+Cg==`.replace(/[\s\n]+/gu, '');

/**
 * The encompassing `Presentation` object. Should hold all slides.
 */
@Registry.Component.add
export class Presentation extends Component {
  /** The title of this presentation. */
  public readonly title: string;

  /** The icon of this presentation. */
  public readonly icon: string;

  /** The authors of this presentation. */
  public readonly authors: string;

  /** The description of this presentation. */
  public readonly description: string;

  /** The keywords of this presentation. */
  public readonly keywords: string;

  /** The background color of this presentation. */
  public readonly background: string;

  /** The foreground color of this presentation. */
  public readonly foreground: string;

  /** The foreground color of this presentation. */
  public readonly accent: string;

  // eslint-disable-next-line jsdoc/require-jsdoc
  public constructor(args: Readonly<Component.ConstructorArguments>) {
    super(args);

    this.icon = args.attributes.icon ?? DEFAULT_ICON_URL;
    this.keywords = args.attributes.keywords ?? DEFAULT_KEYWORDS;
    this.description = args.attributes.description ?? args.attributes.alt ?? DEFAULT_DESCRIPTION;
    this.authors = args.attributes.authors ?? args.attributes.by ?? DEFAULT_AUTHOR;
    this.background =
      args.attributes.background ?? args.attributes['background-color'] ?? DEFAULT_BACKGROUND;
    this.foreground =
      args.attributes.foreground ?? args.attributes['foreground-color'] ?? DEFAULT_FOREGROUND;
    this.accent = args.attributes.accent ?? args.attributes['accent-color'] ?? DEFAULT_ACCENT;

    if (typeof args.attributes.title === 'string') {
      this.title = args.attributes.title;
    } else {
      throw new Error(
        `Expected ${Presentation.name} at ${this.path.join('.')} to have attribute "title", ` +
          `but found ${args.attributes.title}.`
      );
    }
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({ children }: Readonly<Component.RenderArguments>): string {
    if (!children) {
      throw new Error(
        `Expected ${Presentation.name} at ${this.path.join('.')} to have children, but found none.`
      );
    }

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `<!DOCTYPE html>
      <html lang="en">
        <head>
          <title>${this.title}</title>
          <!-- Meta -->
          <meta charset="UTF-8">
          <meta name="darkreader-lock">
          <meta property="og:title" content="${this.title}">
          <meta property="og:description" content="${this.description}">
          <meta property="og:image" content="${this.icon}">
          <meta name="keywords" content="${this.keywords}">
          <meta name="description" content="${this.description}">
          <meta name="authors" content="${this.authors}">
          <meta name="msapplication-TileImage" content="${this.icon}" />
          <meta name="msapplication-TileColor" content="${this.background}" />
          <meta name="theme-color" content="${this.accent}" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
          <!-- Links -->
          <link rel="icon" content="${this.icon}">
          <link rel="apple-touch-icon" content="${this.icon}">
          <!-- Style & Script -->
          <style> 
            :root { 
              --background-color: "${this.background}";
              --foreground-color: "${this.foreground}";
              --accent-color: "${this.accent}";
            } * {
              background-color: var(--background-color);
              color: var(--foreground-color); 
            } 
          </style>
        </head>
        <body>
          <main>
            ${children()}
          </main>
        </body>
      </html>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component['hierarchy']> {
    return [1];
  }
}
