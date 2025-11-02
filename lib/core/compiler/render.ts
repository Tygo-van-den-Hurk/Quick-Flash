import type {
  XmlParserCommentNode,
  XmlParserElementNode,
  XmlParserProcessingInstructionNode,
  XmlParserResult,
  XmlParserTextNode,
} from 'xml-parser-xo';
import { Component } from '#lib/core/components/class';
import { Logger } from '#lib/logger';
import { MarkupRenderer } from '#lib/core/markup/interfaces';
import pkg from '#package' with { type: 'json' };

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Types ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

/** Is used to keep count of how many components we've rendered thus far. */
class Counter {
  private count = 0;
  public increment = (): void => {
    this.count += 1;
  };
  public get = (): number => this.count;
}

/** The general rendering state. */
interface State {
  path: readonly string[];
  level: number;
  counter: Counter;
  markup: MarkupRenderer;
}

interface Attribute {
  name: string;
  value: string;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Helper Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

/**
 * Gets the attribute value pairs from an XML like string. For example `attr="3" x attr2="b"` becomes:
 *
 * ```JSON
 * [ { "name": "attr", "value": "3" }, { "name": "attr2", "value": "b" } ]
 * ```
 */
export const getAttributes = function getAttributes(str: string): Attribute[] {
  const stripQuotes = function stripQuotes(val: string): string {
    return val.replace(/^['"]|['"]$/giu, '');
  };

  const regex = /(?<name>[^\s=]+)\s*=\s*(?<value>"[^"]*"|'[^']*'|[^\s>]+)\s*/giu;
  const results: Attribute[] = [];

  let match; // eslint-disable-line @typescript-eslint/init-declarations
  while ((match = regex.exec(str)) !== null) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const { name, value } = match.groups as unknown as Attribute;
    results.push({ name: name.trim(), value: stripQuotes(value.trim()) });
  }

  return results;
};

/** Get a `MarkupRenderer` by name or throw if it does not exist. */
export const getMarkupRenderer = function getMarkupRenderer(name: string): MarkupRenderer {
  const MarkupRendererInstance = MarkupRenderer.retrieve(name);
  if (MarkupRendererInstance) return new MarkupRendererInstance();
  throw new Error(
    `A markup language "${name}" was requested, but no such renderer was installed.` +
      '(Did you load the plugin?)'
  );
};

/** Creates a component instance from an `XmlParserElementNode` by name and attributes. */
export const createComponentInstance = function createComponentInstance(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  element: XmlParserElementNode,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  state: State
): Component {
  const ComponentInstance = Component.retrieve(element.name);
  if (!ComponentInstance) throw new Error(`No such ${Component.name}: ${element.name}`);

  const instance = new ComponentInstance({
    attributes: { ...element.attributes },
    focusMode: 'default',
    id: state.counter.get().toString(),
    level: state.level,
    path: [...state.path],
  });

  const hierarchy = instance.hierarchy();
  if (hierarchy === '*') return instance;
  if (hierarchy.includes(state.level)) return instance;
  
  const hasPlus = hierarchy[hierarchy.length - 1] === '+';
  // eslint-disable-next-line no-ternary, @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/no-magic-numbers
  const numbers = hasPlus ? hierarchy.slice(0, -1) as number[] : hierarchy as unknown as number[];
  const highestNumber = Math.max(...numbers);
  if (hasPlus && highestNumber < state.level) return instance;

  throw new Error(
    `${Component.name} "${element.name}" cannot be at level ${state.level}. Only at levels: ${hierarchy.toString()}`
  );
};

/** Renders an XML comment element by looking up the current markup renderer, and then. */
export const useProcessingInstruction = function useProcessingInstruction(
  element: Readonly<XmlParserProcessingInstructionNode>,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  state: State
): State {
  const attributes = getAttributes(element.content);
  for (const attribute of attributes) {
    if (attribute.name === 'markup') state.markup = getMarkupRenderer(attribute.value);
    else
      Logger.warn(
        `Ignoring unknown Processing instruction '${attribute.name}="${attribute.value}"' at ${state.path.join('.')}.`
      );
  }

  return state;
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Render Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

/** Renders an XML text element by looking up the current markup renderer, and then. */
export const renderText = function renderText(
  element: Readonly<XmlParserTextNode>,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  state: State
): string {
  Logger.debug(`Rendering ${element.type} at ${state.path.join('.')}`)
  return state.markup.render(element.content);
};

/** Renders an XML comment element by looking up the current markup renderer, and then. */
export const renderComment = function renderComment(
  element: Readonly<XmlParserCommentNode>,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  state: State
): string {
  Logger.debug(`Rendering ${element.type} at ${state.path.join('.')}`)
  return state.markup.render(element.content);
};

/** Renders an XML element by looking up the component by name, and then rendering it. */
// eslint-disable-next-line max-lines-per-function, max-statements
export const renderElement = function renderElement(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  element: XmlParserElementNode,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  state: State
): string {
  const instance = createComponentInstance(element, state);
  if (element.attributes.markup) {
    state.markup = getMarkupRenderer(element.attributes.markup);
  }

  const renderFunctions: (() => string)[] = [];
  for (const [index, child] of Array.from(element.children ?? []).entries()) {
    
    if (child.type === 'CDATA') renderFunctions.push(() => child.content);
    else if (child.type === 'ProcessingInstruction') {
      const path = [...state.path, `[${index}]-XML-PROCESSING-INSTRUCTION`].join('.');
      Logger.info(`Received new ProcessingInstruction at ${path}: ${child.content}`);
      if (element.name === pkg.name) {
        state = useProcessingInstruction(child, state); // eslint-disable-line no-param-reassign
        continue;
      } else {
        Logger.warn(
          `Processing instruction ${path} seems to be for ${child.name}, not ${pkg.name}. Ignoring instruction.`
        );
      }
    } else if (child.type === 'Element') {
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      renderFunctions.push(() =>
        renderElement(child, {
          counter: state.counter,
          level: state.level + 1,
          markup: state.markup,
          path: [...state.path, `[${index}]-${child.name}`],
        })
      );
    } else if (child.type === 'Comment') {
      // Comments should not be rendered as they are comments.
      //// renderFunctions.push(
      ////   () => renderComment(child, { // eslint-disable-line @typescript-eslint/no-loop-func
      ////     counter: state.counter,
      ////     level: state.level + 1,
      ////     markup: state.markup,
      ////     path: [...state.path, `[${index}]-XML-COMMENT`],
      ////   })
      //// );
    } else {
      // If (child.type === 'Text')
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      renderFunctions.push(() =>
        renderText(child, {
          counter: state.counter,
          level: state.level + 1,
          markup: state.markup,
          path: [...state.path, `[${index}]-XML-TEXT`],
        })
      );
    }
  }

  let executed = false;
  let children: undefined | (() => string) = undefined; // eslint-disable-line no-undef-init, no-undefined
  if (renderFunctions.length === 0) executed = true;
  else {
    // eslint-disable-next-line func-name-matching
    children = function renderChildren(): string {
      executed = true;
      return renderFunctions.map((fn) => fn()).join('\n');
    };
  }

  Logger.debug(`Rendering ${element.name} at ${state.path.join('.')}`)
  const result = instance.render({ children });
  if (!executed)
    Logger.warn(`${Component.name} ${element.name} did not call to render it's children.`);

  return result;
};

/**
 * Given an XML parser result, returns the rendered HTML.
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const render = function render(tree: XmlParserResult): string {
  const level = 0;
  const counter = new Counter();
  const path = [`[0]-${tree.root.name}`];
  const markup = getMarkupRenderer('default');
  let state: State = { counter, level, markup, path };
  for (const child of tree.children) {
    if (child.type === 'DocumentType' && !child.content.includes(pkg.name)) {
      Logger.warn(
        `The DocumentType ${child.content} does not seem to include ${pkg.name}.` +
          `Are you sure this document is ment for me?`
      );
    } else if (child.type === 'ProcessingInstruction') {
      state = useProcessingInstruction(child, state);
    } else if (child.type === 'Element') {
      const result = renderElement(tree.root, state);
      Logger.info('Finished rendering');
      return result;
    }
  }

  throw new Error(
    `Did not find a single Element, only, Comments, Text, and pProcessing instructions, what is going on?` +
      'The XML parser should not have let you come this far without there being a single root element...?'
  );
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
