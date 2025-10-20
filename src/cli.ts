#!/usr/bin/env node

import { Logger } from "#lib";
import { LogLevel } from "#lib";
import pkg from "#package" with { type: "json" };
import { serve as startServer } from "#src/serve";
import { compile as compileFile } from "#src/compile";
import { Command } from "commander";
import FastGlob from "fast-glob";
import path from "path";
import fs from "fs";
import net from "net";

/**
 * Merges the options of the subcommand, and the main command, and then executes the function given.
 */
function mergeArgsAndExec(command: Command, func: Function) {
  const options = {
    ...(command.parent!.opts()),
    ...(command.opts()),
  };

  const resolvedLogLevel =
    (options.verbose as number) + LogLevel.toNumber(options.logLevel);
  Logger.logLevel = LogLevel.fromNumber(resolvedLogLevel);
  Logger.debug(`Set LogLevel to: ${Logger.logLevel}`);

  Logger.debug("options:", options);

  const resolvedImports = FastGlob.sync(options.includeImport, {
    ignore: options.ignoreInIncludeImport,
    caseSensitiveMatch: true,
    followSymbolicLinks: true,
    braceExpansion: true,
    onlyFiles: true,
    globstar: true,
    extglob: true,
    unique: true,
    dot: true,
  });

  Logger.debug("resolved:", { resolvedLogLevel, resolvedImports });

  try {
    return func(options);
  } catch (error: any) {
    if (error instanceof Error) Logger.critical(error.message);
    else Logger.critical(error);
  }
}

// Declare CLI options

const program = new Command();

/* Setting options for how the CLI should behave */ {
  program.name(pkg.name);
  program.allowUnknownOption(false);
  program.allowExcessArguments(false);
  program.exitOverride();
  program.version(
    pkg.version,
    "-v, --version",
    "print program version and then exit",
  );
}

/** Adding the import these files option */ {
  program.option(
    "-i, --include-import <glob>",
    "a directory or file to import and use as custom tags",
    (value, previous) => {
      previous.push(value);
      return previous;
    },
    [] as string[],
  );
}

/** Adding the do not import these files option */ {
  program.option(
    "-I, --ignore-in-include-import <glob>",
    "a directory or file to not import and use as custom tags",
    (value, previous) => {
      previous.push(value);
      return previous;
    },
    [] as string[],
  );
}

/* Adding the 'log-level' option to the CLI */ {
  program.option(
    "-l, --log-level <level>",
    `To log level to use when running. Must be one of: ${LogLevel.options}`,
    (value) => LogLevel.parser.parse(value),
    Logger.DEFAULT_LOG_LEVEL,
  );
}

/* Adding the 'watch' option to the CLI */ {
  program.option(
    "-w, --watch <level>",
    `watch the specified files, and rerun if they change.`,
    (value) => Boolean(value),
    false,
  );
}

/* adding the verbose flag/option */ {
  program.option(
    "-V, --verbose",
    "wether to be more talkative. Raises log level by one per flag.",
    (_, previous) => previous + 1,
    0,
  );
}

/* Adding the config option to the CLI */ {
  program.option(
    "-c, --config <path>",
    "the config file to parse and generate from",
    (value) => {
      const file = path.resolve(value);

      const fileExtension =
        path.extname(file).toLowerCase() || "no file extension";
      if (fileExtension !== ".yaml" && fileExtension !== ".yml")
        throw new Error(`Expected a YAML file, but got ${fileExtension}.`);

      if (!fs.existsSync(file))
        throw new Error(`file does not exist: ${file}.`);

      if (!fs.statSync(file).isDirectory())
        throw new Error(`not a file: ${file}.`);

      return file;
    },
    "./slides.yaml",
  );
}

const compile = program
  .command("compile")
  .description("compile and then write the changes")
  .action((_, command) => mergeArgsAndExec(command, compileFile));

/* Adding the 'port' option to the serve command */ {
  compile.option(
    "-o, --output <path>",
    "serve on this port",
    (value) => path.resolve(value),
    "./slides.html",
  );
}

const serve = program
  .command("serve")
  .description("compile and then serve on a webserver")
  .action((_, command) => mergeArgsAndExec(command, startServer));

/* Adding the 'host' option to the serve command */ {
  serve.option("-H, --host <ip-address>", "serve on this port", (value) => {
    if (!net.isIP(value)) throw new Error(`${value} is not a valid IP address`);
    else return value;
  });
}

/* Adding the 'port' option to the serve command */ {
  serve.option("-p, --port <int>", "serve on this port", (value) =>
    Number(value),
  );
}

/* Adding the 'port' option to the serve command */ {
  serve.option(
    "-r, --root <prefix>",
    "The root prefix the serve on. If specified serve from that subdirectory.",
    "/",
  );
}

/* Try parsing the arguments */ {
  try {
    program.parse(process.argv, { from: "node" });
  } catch (error: any) {
    if (error.code === "commander.unknownOption") process.exit(3);
    if (error.code === "commander.missingArgument") process.exit(4);
    if (error.code === "commander.invalidArgument") process.exit(5);
    if (error.code === "commander.optionMissingArgument") process.exit(6);
    if (error.code === "commander.helpDisplayed") process.exit(0);
    if (error.code === "commander.version") process.exit(0);
    process.exit(1);
  }
}

// /* Adding watchers to all files included if needed */ {
//   // if (options.watch) options.forEach(file => {

//   // });
//     fs.watch("./some-file.txt", (eventType, filename) => {
//     console.log(`${filename} changed: ${eventType}`);
//   });
// }

// if (!options.config) {
//   console.error("The config is required");
//   process.exit(1);
// }

// import yaml from 'yaml';

// if (!process.argv[2]) {
//   console.error(`Usage: ${process.argv[0]} ${process.argv[1]} <file.yml> <file.js> [export]`)
//   process.exit(1);
// }

// process.argv[0] = path.resolve(process.argv[0]);
// process.argv[1] = path.resolve(process.argv[1]);
// process.argv[2] = path.resolve(process.argv[2]);
// process.argv[3] = path.resolve(process.argv[3]);

// console.debug("-", process.argv.join("\n- "));

// const module = process.argv[3];
// const result = await import(module);
// const tag = result[process.argv[4] ?? "default"];
// const input = process.argv[2];
// const file = fs.readFileSync(input, "utf8");
// const doc = yaml.parseDocument(file, { customTags: [tag] });

// console.log("doc:", doc.toJSON());
