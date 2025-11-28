import type { MarkupRendererInterface } from '#lib/core/markup/interfaces';
import { Registry } from '#lib/core/registry';

/** The `MarkupRenderer` base class before the registry is injected. */
abstract class MarkupRenderer implements MarkupRendererInterface {
  public abstract render(input: string): string;
}

/**
 * The base class for any `MarkupRenderer`. A `MarkupRenderer` is responsible for rendering it's specific
 * [markup languages](https://en.wikipedia.org/wiki/Markup_language) into HTML. Examples of this are: 
 * [Markdown](https://en.wikipedia.org/wiki/Markdown), [XML](https://en.wikipedia.org/wiki/XML), and of 
 * course [HTML](https://en.wikipedia.org/wiki/HTML).
 */
const MarkupRendererWithRegistry = Registry.inject.with({
  extensiveAliases: true,
  name: MarkupRenderer.name,
  substrings: ['MarkupRenderer', 'Markup', 'MarkupLanguage', 'Renderer'],
})(MarkupRenderer);

// eslint-disable-next-line jsdoc/require-jsdoc
export { MarkupRendererWithRegistry as MarkupRenderer };
