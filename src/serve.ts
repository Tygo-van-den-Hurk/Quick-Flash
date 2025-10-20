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
   * The prefix to serve from. Allows you to serve from e.g. the `/presentation` subdirectory. So you'd have to
   * request `https://example.com/presentation` to get the presentation.
   */
  root?: string;

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
    root: "/",
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
      root: options.root ?? ServeArgs.defaults.root,
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
export function serve(args: ServeArgs = ServeArgs.defaults): void {
  const options = ServeArgs.fillUpWithDefaults(args);
  const router = express.Router();
  router.get(/.*/, serveResult);
  const app = express();
  app.use(options.root, router);
  const callbackWrapper = (error?: Error) => options.callback(options, error);
  app.listen(options.port, options.host, callbackWrapper);
}
