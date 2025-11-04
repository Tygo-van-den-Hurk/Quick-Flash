import * as compiler from '#lib/core/compiler/index';
import * as zod from 'zod';
import { BasePath, Logger, type RequireAll } from '#lib';
import express, { type Request, type Response, Router } from 'express';
import { CompileArgs } from '#src/compile';
import { StatusCodes } from 'http-status-codes';

/**
 * The default callback when none has been defined.
 */
const callback = function callback(
  args: Readonly<RequireAll<ServeArgs>>,
  error?: Readonly<Error>
): void {
  if (error) Logger.error(`Error starting server: ${error.message}`);
  const DROP_FIRST_CHAR = 1;
  Logger.info(
    `server started on port http://${args.host}:${args.port}/${args.basePath.slice(DROP_FIRST_CHAR)}`
  );
};

/**
 * The possible options you can provide to the `serve` function.
 */
export interface ServeArgs extends CompileArgs {
  /**
   * The base path to serve from. Allows you to serve from e.g. the `/presentation` subdirectory.
   * So you'd have to request `https://example.com/presentation` to get the presentation.
   */
  basePath?: BasePath;

  /**
   * The port to listen on.
   */
  port?: number;

  /**
   * The host to respond on.
   */
  host?: string;

  /**
   * The callback to execute when starting the server
   */
  callback?: (args: Readonly<RequireAll<ServeArgs>>, error?: Readonly<Error>) => void;
}

/**
 * The possible options you can provide to the `serve` function.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ServeArgs {
  /**
   * The defaults for the `ServeArgs` options to the `serve` function.
   */
  export const defaults = {
    ...CompileArgs.defaults,
    basePath: BasePath.parse('/'),
    callback,
    host: zod.ipv4().parse('0.0.0.0'),
    port: 8484,
  } satisfies RequireAll<ServeArgs>;

  /**
   * Fills the `ServeArgs` up with the defaults if any properties are missing.
   */
  export const fillUpWithDefaults = function fillUpWithDefaults(
    options: Readonly<ServeArgs> = defaults
  ): RequireAll<ServeArgs> {
    return {
      ...CompileArgs.fillUpWithDefaults(options),
      basePath: options.basePath ?? defaults.basePath,
      callback: options.callback ?? defaults.callback,
      host: options.host ?? defaults.host,
      port: options.port ?? defaults.port,
    } satisfies RequireAll<ServeArgs>;
  };
}

let compiled: string | undefined = '';

/**
 * Serves the responds to the client.
 */
export const serveResult = function serveResult(
  request: Request, // eslint-disable-line @typescript-eslint/prefer-readonly-parameter-types
  response: Response // eslint-disable-line @typescript-eslint/prefer-readonly-parameter-types
): Response {
  Logger.info(`request made for ${request.url} from ${request.ip}`);
  return response.status(StatusCodes.OK).send(compiled);
};

/**
 * Compiles and then serves the result
 */
export const serve = async function serve(
  args: Readonly<ServeArgs> = ServeArgs.defaults
): Promise<void> {
  const options = ServeArgs.fillUpWithDefaults(args);
  compiled = await compiler.compile(options);
  const router = Router(); // eslint-disable-line new-cap
  router.get(/.*/u, serveResult);
  const app = express();
  app.use(options.basePath, router);
  const callbackWrapper = (error?: Readonly<Error>): void => {
    options.callback(options, error);
  };
  app.listen(options.port, options.host, callbackWrapper);
};
