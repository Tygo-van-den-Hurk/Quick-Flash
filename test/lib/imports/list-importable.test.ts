import { listImportable, ListImportableFilesArgs } from "#lib";
import { describe, test, expect } from "vitest";
import { fileURLToPath } from "url";
import path from "path";

const pathOfTestFile = fileURLToPath(import.meta.url);
const pathOfThisDir = path.dirname(pathOfTestFile);
const pathOfTestDir = path.join(pathOfThisDir, ".data");

process.chdir(pathOfTestDir);

const GET = "." as const;

describe("interface `listImportableArgs`", () => {
  test("assumptions on `allowedImportExtensions` defaults", () => {
    const defaults = ListImportableFilesArgs.defaults;
    expect(defaults.allowedImportExtensions).to.contain(".js");
    expect(defaults.allowedImportExtensions).to.contain(".ts");
    expect(defaults.allowedImportExtensions).not.to.contain(".yml");
    expect(defaults.allowedImportExtensions).not.to.contain(".txt");
  });

  test("assumptions on `followSymbolicLinks` defaults", () => {
    const defaults = ListImportableFilesArgs.defaults;
    expect(defaults.followSymbolicLinks).toBe(false);
  });

  test("assumptions on `resolveFirst` defaults", () => {
    const defaults = ListImportableFilesArgs.defaults;
    expect(defaults.resolveFirst).toBe(false);
  });

  test("assumptions on `resolveFirst` defaults", () => {
    const defaults = ListImportableFilesArgs.defaults;
    expect(defaults.resolveFirst).toBe(false);
  });

  test("assumptions on `resolveFirst` defaults", () => {
    const defaults = ListImportableFilesArgs.defaults;
    expect(defaults.skipIndexFiles).toBe(true);
  });
});

describe("function `listImportable()`", () => {
  test("default behavior", () => {
    const result = listImportable(GET);
    expect(result.sort()).toStrictEqual(
      [
        path.join("dir", "file.ts"),
        path.join("dir", "file.js"),
        "file.ts",
      ].sort(),
    );
  });

  // test("change `allowedImportExtensions` to js only", () => {
  //   const allowedImportExtensions = ["js"];
  //   const result = listImportable(GET, { allowedImportExtensions });
  //   expect(result.sort()).toStrictEqual([path.join("dir", "file.js")].sort());
  // });

  test("resolve first", () => {
    const resolveFirst = true;
    const result = listImportable(GET, { resolveFirst });
    expect(result.sort()).toStrictEqual(
      [
        path.resolve(path.join("dir", "file.ts")),
        path.resolve(path.join("dir", "file.js")),
        path.resolve("file.ts"),
      ].sort(),
    );
  });

  test("skip index files", () => {
    const skipIndexFiles = false;
    const result = listImportable(GET, { skipIndexFiles });
    expect(result.sort()).toStrictEqual(
      [
        path.join("dir", "file.ts"),
        path.join("dir", "index.ts"),
        path.join("dir", "file.js"),
        "file.ts",
      ].sort(),
    );
  });
});
