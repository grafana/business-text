---
title: Use cases
description: Learn how to import and use external JavaScript libraries like Bootstrap, Chart.js, D3, Mermaid, and others in the Business Text panel.
keywords:
  - business text
labels:
  products:
    - cloud
    - enterprise
    - oss
weight: 50
---

# Use cases

{{< admonition type="note" >}}
In Grafana 11, the functionality of external JavaScript resources is deprecated, and the **External Resource > Scripts** parameter has been removed. You can import JavaScript libraries directly in the code.

The Business Text panel supports JavaScript library imports in **Before content rendering** starting from version 5.3.0.
{{< /admonition >}}

You can import external JavaScript libraries in both the **Before content rendering** and **After content ready** parameters.

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/before.png" class="border" alt="Use import in the Before content rendering option." >}}

The Business Text panel enables the loading of additional JavaScript using external URLs like CDN (Content Delivery Network). Use that functionality to execute JavaScript functions in the [JavaScript Code](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/javascript-code/) editor.

## Public folder

To prevent loading third-party URLs, store CSS and JavaScript files in the public folder on a Grafana instance.

- To load from an external Grafana instance, use `https://GRAFANA-URL/public/grafanaCSS.css`.
- To load from a local Grafana instance, use `/public/grafanaCSS.css`.

## External JavaScript resources

Below, you can find a collection of breathtaking use cases, the perfect examples of using external JavaScript libraries in the Business Text plugin.

{{< admonition type="note" >}}
Use the **All rows** or **All data** template to execute the template only once. With **Every row**, the **Content** applies to every row of retrieved data. Even though the data frames of the specified data source are not used, the plugin runs the code for each retrieved row.
{{< /admonition >}}

| Solution                                                 | Description                                                                                   |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [Bootstrap](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/use-cases/bootstrap/)   | The most popular HTML, CSS, and JS library in the world                                       |
| [Chart.js](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/use-cases/chart-js/)     | Chart.js is one of the popular open source charting libraries                                 |
| [D3](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/use-cases/d3/)                 | D3 is a free, open-source JavaScript library for visualizing data                             |
| [Flowchart](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/use-cases/flowchart/)   | Draws simple SVG flow chart diagrams from textual representation of the diagram               |
| [Leaflet.js](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/use-cases/leaflet-js/)    | A JavaScript library for interactive maps                                                     |
| [MapBox GL](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/use-cases/mapbox-gl/)   | JavaScript library for building web maps and applications with Mapbox's mapping technology    |
| [Mermaid](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/use-cases/mermaid/)       | JavaScript-based diagramming and charting tool that dynamically creates and modifies diagrams |
| [Plotly](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/use-cases/plotly/)         | Open Source Graphing Libraries                                                                |
| [Tailwind CSS](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/use-cases/tailwind/) | A utility-first CSS framework                                                                 |
| [TensorFlow](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/use-cases/tensorflow/) | Library for machine learning in JavaScript                                                    |
| [Youtube Video](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/use-cases/youtube/) | YouTube player component                                                                      |
