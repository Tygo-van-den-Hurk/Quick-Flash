import type { DeepReadonly } from '#lib/types/index';
import type { MarkupRenderer } from '#lib/core/markup/index';
import { Registry } from '#lib/core/registry';

interface Marker {
  marker: string;
  htmlOpen: string;
  htmlClose: string;
  position: number;
}

/**
 * A `MarkupRenderer` for Slyde's custom markup language.
 */
@Registry.MarkupRenderer.add
export class SlydeMarkupRenderer implements MarkupRenderer {
  public readonly registerKeys = () => [ "slyde" ];

  public readonly MARKERS: Record<string, { htmlOpen: string; htmlClose: string }> = {
    '**': { htmlClose: '</b>', htmlOpen: '<b>' },
    '//': { htmlClose: '</i>', htmlOpen: '<i>' },
    '^^': { htmlClose: '</sup>', htmlOpen: '<sup>' },
    __: { htmlClose: '</u>', htmlOpen: '<u>' },
    '``': { htmlClose: '</code>', htmlOpen: '<code>' },
    '~~': { htmlClose: '</s>', htmlOpen: '<s>' },
  };

  public readonly IGNORE_MARKERS_INSIDE = ['``'];
  public readonly NON_NESTABLE_MARKERS = Object.keys(this.MARKERS);

  private canOpenMarker(marker: string, stack: DeepReadonly<Marker[]>): boolean {
    if (!stack.length) return true;
    const topMarker = stack[stack.length - 1];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
    if (!topMarker) return true;
    const top = topMarker.marker;

    // Markers inside code or other ignored markers
    if (this.IGNORE_MARKERS_INSIDE.includes(top) && !this.IGNORE_MARKERS_INSIDE.includes(marker)) {
      return false;
    }

    // Non-nestable markers cannot open inside themselves
    if (
      this.NON_NESTABLE_MARKERS.includes(marker) &&
      stack.some((mark) => mark.marker === marker)
    ) {
      return false;
    }

    return true;
  }

  public render(input: string): string {
    const stack: Marker[] = [];
    let output = '';
    let i = 0;

    while (i < input.length) {
      // Handle escaped characters
      if (input[i] === '\\' && i + 1 < input.length) {
        output += input[i] + input[i + 1];
        i += 2;
        continue;
      }

      // Detect marker
      const foundMarker = Object.keys(this.MARKERS).find((m) => input.slice(i, i + m.length) === m);

      if (foundMarker) {
        // Try to close an open marker
        const openIndex = stack.map((m) => m.marker).lastIndexOf(foundMarker);
        if (openIndex !== -1) {
          // Check if this is the top of the stack (properly nested)
          if (openIndex === stack.length - 1) {
            // Properly nested - close it
            const closed = stack.pop()!;
            output += closed.htmlClose;
            i += foundMarker.length;
            continue;
          } else {
            // Improperly nested - close the marker and revert everything after it
            const markersToRevert: Marker[] = [];
            while (stack.length > openIndex + 1) {
              markersToRevert.unshift(stack.pop()!);
            }
            const closed = stack.pop()!;

            // Revert the markers that were opened after the one we're closing
            for (const m of markersToRevert) {
              output = output.replace(m.htmlOpen, m.marker);
            }

            output += closed.htmlClose;
            i += foundMarker.length;
            continue;
          }
        }

        // Try to open marker
        if (this.canOpenMarker(foundMarker, stack)) {
          stack.push({
            marker: foundMarker,
            ...this.MARKERS[foundMarker],
            position: i,
          });
          output += this.MARKERS[foundMarker].htmlOpen;
        } else {
          // Not allowed → treat as literal
          output += foundMarker;
        }

        i += foundMarker.length;
        continue;
      }

      // Regular character
      output += input[i];
      i++;
    }

    // Unclosed markers → revert
    while (stack.length) {
      const unclosed = stack.pop()!;
      output = output.replace(unclosed.htmlOpen, unclosed.marker);
    }

    return output;
  }
}
