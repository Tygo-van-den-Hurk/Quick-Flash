# Component

To add your own component simply follow this template:

```JavaScript
export default function({ Component, Logger, ... }) {
  
  class MyComponent extends Component {
    hierarchy = () => '*'; // Allow all levels
    render({ children }) {
      return "THIS IS AN EXAMPLE"
    }
  }

  Component.register(MyComponent); // Now available as: my-component, MyComponent, ...
  Logger.debug("Added the best component!!!");
}
```

## Interfaces

There are a couple of requirements for any instance of `Component`. The functions/fields you'll need to implement can be found in the [`#lib/core/components/interfaces.ts.`](https://github.com/Tygo-van-den-Hurk/Slyde/blob/main/lib/core/components/interfaces.ts) file. Depending on the version you have installed these requirements might be different then that the links says. Check both major versions to find out if they are compatible.
