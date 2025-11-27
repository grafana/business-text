---
title: Flowchart
description: Learn how to draw SVG flowchart diagrams from textual representations using the Flowchart.js library in the Business Text panel.
labels:
  products:
    - cloud
    - enterprise
    - oss
weight: 4
---

# Flowchart

Thank you to [Josiah Solomon](https://github.com/yosiasz) for exploring an epic [Flowchart](https://flowchart.js.org) return to Grafana!

The following sections describe how to implement Flowchart libraries using the Business Text plugin.

Import two external libraries and then write your code to address the Flowchart libraries directly.

## Example

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/flow.png" class="border" alt="Delivering Flowchart libraries to a Grafana dashboard using the Business Text plugin." >}}

Use the following external library

```text
https://esm.sh/flowchart.js
https://esm.sh/raphael
```

## Content to copy

```html
<div id="flowchart" />
```

## After Content Ready

{{< admonition type="warning" >}}
Plug-in libraries may change their versions and the code in the example may not work or cause an error.
{{< /admonition >}}

Use the following for the **JavaScript > After Content Ready**:

```js
import("https://esm.sh/flowchart.js").then(async (flowchart) => {
  await import("https://esm.sh/raphael");

  /**
   * Cleanup
   */
  document.getElementById("flowchart").innerHTML = "";

  const flow = `
st=>start: Start:>http://www.google.com[blank]
e=>end:>http://www.google.com
op1=>operation: My Operation
sub1=>subroutine: My Subroutine
cond=>condition: Yes
or No?:>http://www.google.com
io=>inputoutput: catch something...
para=>parallel: parallel tasks
in=>input: some in
out=>output: some out

st->op1->cond
cond(yes)->io->e
cond(no)->para
para(path1, bottom)->sub1(right)->op1
para(path2, top)->op1
para(path3, right)->in->out->e`;

  const diagram = flowchart.parse(flow);
  diagram.drawSVG("flowchart");
});
```
