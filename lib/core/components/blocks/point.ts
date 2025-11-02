import * as zod from 'zod';
import { Component } from '#lib/core/components/class';

const typeOptions = ['circle', 'dash', 'star'] as const;
const typeParser = zod.enum(typeOptions).default('dash');

/**
 * A component that just shows bullet point.
 */
@Component.register
export class Point extends Component {
  public readonly type: zod.infer<typeof typeParser>;

  // eslint-disable-next-line jsdoc/require-jsdoc
  public constructor(args: Readonly<Component.ConstructorArguments>) {
    super(args);

    const result = typeParser.safeParse(args.attributes.type);
    if (!result.success) {
      throw new Error(
        `Expected property "type" of ${Point.name} at ${this.path.join('.')} to be one` +
          `of "${typeOptions.join('", "')}", but found: ${args.attributes.type}`
      );
    }

    this.type = result.data;
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({ children }: Readonly<Component.RenderArguments>): string {
    if (!children) {
      throw new Error(
        `Expected ${Point.name} at ${this.path.join('.')} to have children, but found none.`
      );
    }

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <!--Point#${this.id}-->
        ${children()}
      <!--/Point#${this.id}-->
    `;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component['hierarchy']> {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return [3, '+'];
  }
}
