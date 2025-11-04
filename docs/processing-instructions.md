# Processing Instructions

Processing instructions are a special way to tell the compiler things. They do not show up in your presentation, or notes. They can change the way the compiler works, and what state you are in. 

## Examples

An example is the processing instructions to change the [markup renderer](markup.md) to something else from here on out for all next elements and their descendants.

```XML
<text>
  **This text will be bold**
</text>
<?slyde markup="plain"?>
<text>
  **This text will NOT be bold**
</text>
```

## Possible Instructions

Here follows a list off all possible instructions:

### Change Markup Renderer

You can change the markup render to `XYZ` using:

```XML
<?slyde markup="XYZ"?>
```
