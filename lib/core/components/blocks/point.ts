import * as zod from 'zod';
import { Component } from '#lib/core/components/class';

const symbolOptions = [
  'circle',
  'dash',
  'star',
  'arrow',
  'square',
  'diamond',
  'check',
  'cross',
] as const;

const symbolParser = zod.enum(symbolOptions).default('dash');

const symbolMap: Record<zod.infer<typeof symbolParser>, string> = {
  arrow: '&rarr;',
  check: '&#10003;',
  circle: '&bull;',
  cross: '&#10006;',
  dash: '&ndash;',
  diamond: '&#9670;',
  square: '&#9642;',
  star: '&#9733;',
};

/**
 * A component that just shows bullet point.
 */
@Component.register
export class Point extends Component {
  public readonly symbol: zod.infer<typeof symbolParser>;

  // eslint-disable-next-line jsdoc/require-jsdoc
  public constructor(args: Component.ConstructorArguments) {
    super(args);

    const result = symbolParser.safeParse(args.attributes.symbol);
    if (!result.success) {
      throw new Error(
        `Expected property "type" of ${Point.name} at ${this.path.join('.')} to be one` +
          `of "${symbolOptions.join('", "')}", but found: ${args.attributes.type}`
      );
    }

    this.symbol = result.data;
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({ children }: Component.RenderArguments): ReturnType<Component['render']> {
    if (!children) {
      throw new Error(
        `Expected ${Point.name} at ${this.path.join('.')} to have children, but found none.`
      );
    }

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <div class="pt-1 block before:content-['${symbolMap[this.symbol]}'] before:mr-2 before:text-black">
        ${children()}
      </div>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component['hierarchy']> {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return [2, '+'];
  }
}
