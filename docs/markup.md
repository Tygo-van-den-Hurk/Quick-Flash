# Markup

To make it easy to style text Slyde uses it's own [markup language](https://en.wikipedia.org/wiki/Markup_language) (or any you want). Slyde' markup renderer behaves as much as markdown as possible. If you found an example where the 2 behave differently, [please open an issue](https://github.com/Tygo-van-den-Hurk/Slyde/issues/new). There were only a couple changes from markdown.

1. The markers used. Bold and strick through remain the same, but italic. and monospace are different markers.
2. The markers are always 2 symbols right after each other to make it obvious what a marker is.
3. There is an addition to write superscript without having to resort to latex or Unicode.

## Examples

Here is an example:

```XML
<text markup="slyde">
  **This text will be bold**
  __This text will be underlined__
  ~~This text will be struck through~~
  //This text will be italic//
  ^^This text will be in superscript^^
  ``This text will be monospaced``
</text>
```

This markup is rendered automatically in the text of most components unless they opt out of having it's direct text children rendered. The markup attribute is optional, and can will default to `markup="slyde"`. Meaning these two are identical:

```XML
<text markup="slyde">
  **This text will be bold**
</text>
<text>
  **This text will ALSO be bold**
</text>
```

## Renderers

There is support out of the box for replacing the default markup renderer implementation with any of your choice using plugins. The following Markup renders are installed by default:

- Slyde (default)
- Markdown

To select the a different markup renderer for example Markdown, change the markup key:

```XML
<text markup="markdown">
  **This text will be bold**  
  ~~This text will be struck through~~  
  *This text will be italic*  
  `This text will be monospaced`
</text>
```

The text will now be treated as markdown instead of Slyde' markup. But since Slyde' markup supports more styles and is easier for most non-technical people to understand it is the default.

## Quirks

Since we use XML to configure our markup language cannot use HTML/XML elements to render anything as that will confuse the parser with what is text and what is an element to render. That is why markup languages are used.
