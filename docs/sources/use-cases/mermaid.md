---
title: Mermaid
description: Learn how to create dynamic diagrams and charts using Markdown-defined text with the Mermaid library in the Business Text panel.
labels:
  products:
    - cloud
    - enterprise
    - oss
weight: 8
---

# Mermaid

Mermaid is a popular JavaScript-based diagramming and charting tool that dynamically creates and modifies diagrams using Markdown-defined text definitions.

{{< admonition type="note" >}}
Previously there were two Business text (old name Dynamic Text) plugin builds being maintained. One with embedded Mermaid Library and the other without.

The main reason being the Mermaid Library size. After the addition of the External Resources feature, the need to maintain two builds has vanished. Now, anyone who needs the Mermaid library can simply import it as an external resource.
{{< /admonition >}}

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/diagram.png" class="border" alt="Mermaid diagrams displayed using the Business Text panel." >}}

## Example

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/mer.png" class="border" alt="Mermaid diagrams example." >}}

Use the following external library

```md
https://esm.sh/mermaid
```

## Code to copy

Use the following for the **Content** (when your data source is set to return something) or in the **Default Content** (when your data source returns nothing):

```diagram
<pre class="mermaid">
    graph LR
    A --- B
    B-->C[fa:fa-ban {{data.0.test}}]
    B-->D(fa:fa-spinner);
</pre>
```

## After Content Ready

{{< admonition type="warning" >}}
Plug-in libraries may change their versions and the code in the example may not work or cause an error.
{{< /admonition >}}

Use the following for the **JavaScript > After Content Ready**:

```js
import("https://esm.sh/mermaid").then(({ default: mermaid }) => {
  mermaid.initialize({ startOnLoad: true });

  mermaid.run({
    querySelector: ".mermaid",
    suppressErrors: false,
  });
});
```
