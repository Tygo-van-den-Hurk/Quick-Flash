/* eslint-disable */

import type { DeepReadonly } from '#lib/types/index';
import { MarkupRenderer } from '#lib/core/markup/interfaces';

interface Marker {
  marker: string;
  htmlOpen: string;
  htmlClose: string;
  position: number;
}

/**
 * A `MarkupRenderer` for Slyde's custom markup language.
 */
@MarkupRenderer.register
export class SlydeMarkupRenderer implements MarkupRenderer {
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

  public render(input: string): string {
    const stack: Marker[] = [];
    let output = '';
    let index = 0;

    while (index < input.length) {
      // Handle escaped characters
      if (input[index] === '\\' && index + 1 < input.length) {
        output += input[index];
        index += 1;
        output += input[index + 1];
        index += 1;
        continue;
      }

      // Detect marker
      const foundMarker = Object.keys(this.MARKERS).find(
        (marker) => input.slice(index, index + marker.length) === marker
      );

      if (foundMarker) {
        // Try to close an open marker
        const openIndex = stack.map((m) => m.marker).lastIndexOf(foundMarker);
        if (openIndex !== -1) {
          // Check if this is the top of the stack (properly nested)
          if (openIndex === stack.length - 1) {
            // Properly nested - close it
            const closed = stack.pop()!;
            output += closed.htmlClose;
            index += foundMarker.length;
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
            index += foundMarker.length;
            continue;
          }
        }

        // Try to open marker
        if (this.canOpenMarker(foundMarker, stack)) {
          stack.push({
            marker: foundMarker,
            ...this.MARKERS[foundMarker],
            position: index,
          });
          output += this.MARKERS[foundMarker].htmlOpen;
        } else {
          // Not allowed --> treat as literal
          output += foundMarker;
        }

        index += foundMarker.length;
        continue;
      }

      // Regular character
      output += input[index];
      index++;
    }

    // Unclosed markers → revert
    while (stack.length) {
      const unclosed = stack.pop();
      if (!unclosed) throw new Error();
      output = output.replace(unclosed.htmlOpen, unclosed.marker);
    }

    return output;
  }

  private canOpenMarker(marker: string, stack: DeepReadonly<Marker[]>): boolean {
    if (!stack.length) return true;
    const topMarker = stack[stack.length - 1];

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
}

/**
 * The default `MarkupRenderer`, just a copy of `SlydeMarkupRenderer`.
 */
@MarkupRenderer.register
export class DefaultMarkupRenderer extends SlydeMarkupRenderer {}
