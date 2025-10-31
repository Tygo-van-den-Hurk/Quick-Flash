import { LogLevel, Logger, Result } from '#lib';
import parseXML, {
  type XmlParserNode,
  type XmlParserNodeType,
  type XmlParserResult,
} from 'xml-parser-xo';
import chalk from 'chalk';
import ora from 'ora';

/**
 * Parses the input given and returns the resulting `XmlParserResult` as a `Result`.
 */
export const parseInputContent = function parseInputContent(
  content: string
): Result<XmlParserResult> {
  const spinner = ora({
    isSilent: LogLevel.of(Logger.logLevel).isLessVerboseThen(LogLevel.INFO),
    prefixText: chalk.cyan(LogLevel.INFO.toUpperCase()),
  }).start(`Attempting to parse input...`);

  try {
    const desired: XmlParserNodeType[] = ['Element', 'Text'] as const;
    const filter = (node: Readonly<XmlParserNode>): boolean => desired.includes(node.type);
    const strictMode = true;
    const result = parseXML(content, { filter, strictMode });
    spinner.succeed(`${chalk.green('Success')}: parsed input!`);
    return Result.ok(result);
  } catch (error) {
    if (error instanceof Error) {
      spinner.fail(`${chalk.red(LogLevel.ERROR.toUpperCase())}: ${error.message}`);
      return Result.error(error);
    }

    spinner.fail(
      `${chalk.red(LogLevel.ERROR.toUpperCase())}: an error occurred while parsing the input.`
    );
    return Result.error(new Error(`Could not parse input file.`));
  }
};

/**
 * Parses the input given and returns the resulting `XmlParserResult` as a `Result`.
 */
export default parseInputContent;
