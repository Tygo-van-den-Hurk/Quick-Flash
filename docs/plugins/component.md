# Component

To add your own component simply follow this template:

```JavaScript
// Now available as: my-component, MyComponent, ...
export default ({ Component }) => Component.register(
  
  class MyComponent extends Component {
    hierarchy = () => '*'; // Allow all levels
    render({ children }) {
      return "THIS IS AN EXAMPLE"
    }
  }

);
```

## Interfaces

There are a couple of requirements for any instance of `Component`. The functions/fields you'll need to implement can be found in the [`#lib/core/components/interfaces.ts.`](https://github.com/Tygo-van-den-Hurk/Slyde/blob/main/lib/core/components/interfaces.ts) file. Depending on the version you have installed these requirements might be different then that the links says. Check both major versions to find out if they are compatible.

## How to use

Now that you've added your own `Component` plugin you can simply use it using its's ID as the element name. Like so:

```XML
<presentation>
  <slide>
    <my-component />
  </slide>
</presentation>
```

## Overriding existing Components

Since plugins load after the original `Component`s load you can override existing `Component` names. This is intentional, in case an existing `Component` by that name does not suit your needs, however I do recommend adding it under a different name instead.
