import * as z from "zod";

const TagParser = z.object({});

/**
 * A tag that converts things to HTML.
 */
export type Tag = z.infer<typeof TagParser>;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Tag {
  /**
   * The parser to return `Tag`s.
   */
  export const parser = TagParser;
}
