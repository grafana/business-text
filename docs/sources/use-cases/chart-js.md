---
title: Chart.js
description: Learn how to create interactive charts using the Chart.js library in the Business Text panel.
labels:
  products:
    - cloud
    - enterprise
    - oss
weight: 2
---

# Chart.js

Chart.js is one of the popular open source charting libraries. The Business Text plugin makes using chart.js in Grafana possible!

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/chartjs-examples.png" class="border" alt="Chart.js diagrams displayed using the Business Text panel." >}}

## Example

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/chartjs.png" class="border" alt="Chart.js diagram example." >}}

Use the following external library

```md
https://esm.sh/chart.js
```

## Code to copy

Use the following for the **Content**:

```js
<canvas id="myChart" />
```

## After Content Ready

{{< admonition type="warning" >}}
Plug-in libraries may change their versions and the code in the example may not work or cause an error.
{{< /admonition >}}

Use the following for the **JavaScript > After Content Ready**:

```js
import("https://esm.sh/chart.js").then(({ Chart, registerables }) => {
  Chart.register(...registerables);

  /**
   * Cleanup
   */
  if (this.chartInstance) {
    this.chartInstance.destroy();
  }

  const ctx = document.getElementById("myChart");

  this.chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});
```
