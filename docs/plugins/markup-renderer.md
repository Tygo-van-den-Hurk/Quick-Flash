# Markup Renderer

To add your own component simply follow this template:

```JavaScript
export default function({ MarkupRenderer, Logger, ... }) {
  
  class MyLanguage {
    render(input) {
      return "THIS IS AN EXAMPLE"
    }
  }

  MarkupRenderer.register(MyLanguage); // Now available as: my-language, language, ...
  Logger.debug("Added the best language!!!");
}
```

## Interfaces

There are a couple of requirements for any instance of `MarkupRenderer`. The functions/fields you'll need to implement can be found in the [`#lib/core/markup/interfaces.ts.`](https://github.com/Tygo-van-den-Hurk/Slyde/blob/main/lib/core/markup/interfaces.ts) file. Depending on the version you have installed these requirements might be different then that the links says. Check both major versions to find out if they are compatible.

## How to use

Now that you've added your own `MarkupRenderer` plugin you can simply render by using it's ID as the value. [See the markup documentation on how to set a renderer](../markup.md).