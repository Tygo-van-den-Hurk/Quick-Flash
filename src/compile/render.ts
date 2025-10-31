import { LogLevel, Logger } from '#lib';
import ora, { type Ora } from 'ora';
import type { XmlParserElementChildNode } from 'xml-parser-xo';
import chalk from 'chalk';

interface Counter {
  readonly total: number;
  current: number;
}

class CounterClass implements Counter {
  public readonly total: number;
  public current: number;

  public constructor({ total, current }: Readonly<Counter>) {
    this.total = total;
    this.current = current;
  }
}

const countElements = function countElements(
  node: XmlParserElementChildNode // eslint-disable-line @typescript-eslint/prefer-readonly-parameter-types
): number {
  if (node.type !== 'Element') return 1;
  const children = node.children ?? [];
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  return 1 + children.reduce((total: number, child): number => total + countElements(child), 0);
};

// eslint-disable-next-line max-lines-per-function, max-statements
const recurse = async function recurse(
  node: XmlParserElementChildNode, // eslint-disable-line @typescript-eslint/prefer-readonly-parameter-types
  counter: Counter, // eslint-disable-line @typescript-eslint/prefer-readonly-parameter-types
  spinner: Ora // eslint-disable-line @typescript-eslint/prefer-readonly-parameter-types
): Promise<string> {
  counter.current += 1;

  if (node.type === 'CDATA') {
    spinner.text = `Converted ${counter.current} out of ${counter.total} components to HTML...`;
    return '';
  }

  if (node.type === 'Comment') {
    spinner.text = `Converted ${counter.current} out of ${counter.total} components to HTML...`;
    return node.content
      .trim()
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .join('\n');
  }

  if (node.type === 'ProcessingInstruction') {
    spinner.text = `Converted ${counter.current} out of ${counter.total} components to HTML...`;
    return '';
  }

  if (node.type === 'Text') {
    spinner.text = `Converted ${counter.current} out of ${counter.total} components to HTML...`;
    return node.content
      .trim()
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .join('\n');
  }

  const attrs = Object.keys(node.attributes)
    .map((key) => `${key}="${node.attributes[key]}"`)
    .join(' ');

  if (!node.children)
    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
    <${node.name} ${attrs}>
  `;

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const children = await Promise.all(
    node.children.map(async (child) => recurse(child, counter, spinner))
  );
  counter.current += 1;

  // eslint-disable-next-line no-inline-comments
  return /*HTML*/ `
    <slyde-component id="${counter.current}">
      <${node.name}>
        ${children.join('\n')}
      </${node.name}>
    </slyde-component>`;
};

/**
 * Converts `XmlParserResult` to an HTML string.
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const toHTML = async function toHTML(node: XmlParserElementChildNode): Promise<string> {
  const total = countElements(node);
  const counter = new CounterClass({ current: 0, total });

  const spinner = ora({
    isSilent: LogLevel.of(Logger.logLevel).isLessVerboseThen(LogLevel.INFO),
    prefixText: chalk.cyan(LogLevel.INFO.toUpperCase()),
  }).start(`Converted ${counter.current} out of ${counter.total} components to HTML...`);

  const result = recurse(node, counter, spinner);

  spinner.succeed(
    `${chalk.green('Success')}: Converted ${counter.current} out of ${counter.total} components to HTML!`
  );

  return result;
};
