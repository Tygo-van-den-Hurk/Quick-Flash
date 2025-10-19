import { RequireAll } from "#src/lib/index";
import fs from "fs";
import path from "path";

/**
 * The possible options you can provide to the `findFilesInDirectoryRecursively` function.
 */
export interface ListImportableFilesArgs {
  /**
   * The file extensions allowed to import code from.
   */
  allowedImportExtensions?: string[];

  /**
   * Whether or not to skip files labeled `index.*`.
   */
  skipIndexFiles?: boolean;

  /**
   * Whether or not to follow symbolic links. Only applies to directories.
   */
  followSymbolicLinks?: boolean;

  /**
   * Whether or not to resolve the path first, before starting the search process.
   * This settings turns: `./some/path` to `/pwd/some/path`. (Makes a path absolute.)
   */
  resolveFirst?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ListImportableFilesArgs {
  /**
   * the defaults for the `ListImportableFilesArgs` options to `listImportable`.
   */
  export const defaults = {
    allowedImportExtensions: [".js", ".cjs", ".mjs", ".ts"],
    skipIndexFiles: true,
    followSymbolicLinks: false,
    resolveFirst: false,
  } satisfies ListImportableFilesArgs;

  /**
   * Fills the `ListImportableFilesArgs` up with the defaults.
   */
  export function fillUpWithDefaults(
    options: ListImportableFilesArgs = {},
  ): RequireAll<ListImportableFilesArgs> {
    return {
      allowedImportExtensions:
        options.allowedImportExtensions ??
        ListImportableFilesArgs.defaults.allowedImportExtensions,
      skipIndexFiles:
        options.skipIndexFiles ??
        ListImportableFilesArgs.defaults.skipIndexFiles,
      followSymbolicLinks:
        options.followSymbolicLinks ??
        ListImportableFilesArgs.defaults.followSymbolicLinks,
      resolveFirst:
        options.resolveFirst ?? ListImportableFilesArgs.defaults.resolveFirst,
    } satisfies RequireAll<ListImportableFilesArgs>;
  }
}

/**
 * Helps `listImportable` do the real work.
 */
function helper(
  startingPath: string,
  options: RequireAll<ListImportableFilesArgs>,
): string[] {
  const stats = fs.statSync(startingPath);

  /* Dealing with files */ {
    if (stats.isFile()) {
      const name = path.basename(startingPath, path.extname(startingPath));
      if (name === "index" && options.skipIndexFiles) return [];
      const allowedFileExtensions = options.allowedImportExtensions;
      const fileExtension = path.extname(startingPath);
      if (!allowedFileExtensions.includes(fileExtension)) return [];
      else return [startingPath];
    }
  }

  /* dealing with symbolic links*/ {
    if (stats.isSymbolicLink()) {
      if (!options.followSymbolicLinks) {
        return [
          // don't follow symbolic links
        ];
      }
    }
  }

  let results: string[] = [];
  /* dealing with directories */ {
    const entries = fs.readdirSync(startingPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(startingPath, entry.name);
      results = [...results, ...helper(fullPath, options)];
    }
  }

  return results;
}

/**
 * Find paths in a directory that we can import according to the `allowedImportExtensions` variable. Allows you to
 * override this in the options.
 */
export function listImportable(
  startingPath: string,
  options: ListImportableFilesArgs = {},
): string[] {
  if (!fs.existsSync(startingPath)) {
    throw new Error(
      `file path ${startingPath} does not exist, or lack permissions`,
    );
  }

  const resolvedOptions = ListImportableFilesArgs.fillUpWithDefaults(options);

  if (resolvedOptions.resolveFirst) startingPath = path.resolve(startingPath);

  return helper(startingPath, resolvedOptions);
}
