# Markup Renderer

To add your own markup renderer simply follow this template:

```JavaScript
// Now available as: my-language, MyLanguage, ...
export default ({ MarkupRenderer }) => MarkupRenderer.register(
  
  class MyLanguage extends MarkupRenderer {
    render(input) {
      return input;
    }
  }
  
);
```

## Interfaces

There are a couple of requirements for any instance of `MarkupRenderer`. The functions/fields you'll need to implement can be found in the [`#lib/core/markup/interfaces.ts.`](https://github.com/Tygo-van-den-Hurk/Slyde/blob/main/lib/core/markup/interfaces.ts) file. Depending on the version you have installed these requirements might be different then that the links says. Check both major versions to find out if they are compatible.

## How to use

Now that you've added your own `MarkupRenderer` plugin you can simply render by using it's ID as the value. [See the markup documentation on how to set a renderer](../markup.md).

```XML
<text markup="my-language">
  this is rendered using your new MyLanguage renderer
</text>
```

## Overriding existing Components

Since plugins load after the original `MarkupRenderer`s load you can override existing `MarkupRenderer` names. This is intentional, in case an existing `MarkupRenderer` by that name does not suit your needs, however I do recommend adding it under a different name instead.

There is special behavior related to `MarkupRenderer`s. The default renderer is actually called `DefaultMarkupRenderer`, so by naming your class `DefaultMarkupRenderer`, you can override the default markup renderer for the entire document.
