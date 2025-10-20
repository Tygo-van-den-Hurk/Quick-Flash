import express from "express";
import { Request, Response } from "express";
import { RequireAll } from "#lib";

/**
 * The possible options you can provide to the `serve` function.
 */
export interface ServeArgs {
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
  callback?: (args: RequireAll<ServeArgs>, error?: Error) => void;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ServeArgs {
  /**
   * the defaults for the `ServeArgs` options to the `serve` function.
   */
  export const defaults = {
    port: 8484,
    host: "0.0.0.0",
    callback: (args: RequireAll<ServeArgs>, error?: Error) => {
      if (error) console.error(`Error starting server: ${error.message}`);
      else
        console.info(`server started on port http://${args.host}:${args.port}`);
    },
  } satisfies ServeArgs;

  /**
   * Fills the `ServeArgs` up with the defaults if any properties are missing.
   */
  export function fillUpWithDefaults(
    options: ServeArgs = ServeArgs.defaults,
  ): RequireAll<ServeArgs> {
    return {
      port: options.port ?? ServeArgs.defaults.port,
      host: options.host ?? ServeArgs.defaults.host,
      callback: options.callback ?? ServeArgs.defaults.callback,
    } satisfies RequireAll<ServeArgs>;
  }
}

/**
 * serves the responds to the client.
 */
export function serveResult(request: Request, response: Response) {
  console.info(`request made for ${request.url} from ${request.ip}`);
  return response.status(200).json({
    message: "success",
    status: 200,
  });
}

/**
 * Compiles and then serves the result
 */
export function serve(options: ServeArgs = ServeArgs.defaults): void {
  const app = express();
  app.get(/.*/, serveResult);
  const resolvedOptions: RequireAll<ServeArgs> =
    ServeArgs.fillUpWithDefaults(options);
  app.listen(resolvedOptions.port, (error?: Error) =>
    resolvedOptions.callback(resolvedOptions, error),
  );
}
