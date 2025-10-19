import {
  listImportable,
  ListImportableFilesArgs,
} from "#src/lib/imports/list-importable";
import { RequireAll } from "#src/lib/index";

/**
 * The possible options you can provide to the `importFileRecursively` function, and the helper
 * function: `listImportable`.
 */
export interface ImportFileRecursivelyArgs extends ListImportableFilesArgs {}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ImportFileRecursivelyArgs {
  /**
   * the defaults for the `ImportFileRecursivelyArgs` options to `importFileRecursively`.
   */
  export const defaults = {
    ...ListImportableFilesArgs.defaults,
  } satisfies ImportFileRecursivelyArgs;

  /**
   * Fills the `ImportFileRecursivelyArgs` up with the defaults.
   */
  export function fillUpWithDefaults(
    options: ImportFileRecursivelyArgs = {},
  ): RequireAll<ImportFileRecursivelyArgs> {
    return {
      ...ListImportableFilesArgs.fillUpWithDefaults(options),
    } satisfies RequireAll<ImportFileRecursivelyArgs>;
  }
}

/**
 * imports all files as modules from a certain directory recursively, according to the logic of `listImportable`.
 */
export async function importFileRecursively(
  startingPath: string,
  options: ImportFileRecursivelyArgs = {},
): Promise<Record<string, any>[]> {
  const resolvedOptions = ImportFileRecursivelyArgs.fillUpWithDefaults(options);
  const modules = listImportable(startingPath, resolvedOptions);
  return modules.map(async (filePath) => await import(filePath));
}
