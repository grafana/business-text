---
title: Business Text
description: Learn how to convert plain text and table data into visually appealing information cards using Markdown, Handlebars, CSS, and JavaScript.
keywords:
  - business text
labels:
  products:
    - cloud
    - enterprise
    - oss
weight: 10
---

# Business Text

The Business Text panel is a Grafana visualization plugin that you can use to convert plain text and table data into visually appealing, easy-to-read information cards. For that, the offered arsenal includes:

- Access to variables (dashboard and global),
- Markdown,
- Handlebars,
- Helpers (predefined and your own),
- CSS styles
- JavaScript.

By working with the Business Text plugin you construct a text visualization template:

- using the above-mentioned features and
- indicating the spots where the fetched data frame elements should be placed.

## Requirements

- Business Text panel 6.X requires **Grafana 11** or **Grafana 12**.
- Business Text panel 5.X requires **Grafana 10** or **Grafana 11**.
- Dynamic Text panel 4.X requires **Grafana 9.2** or **Grafana 10**.
- Dynamic Text panel 2.X and 3.X require **Grafana 8.5** or **Grafana 9**.
- Dynamic Text panel 1.X requires **Grafana 7**.

## Getting started

You can install the Business Text panel from the [Grafana Plugins catalog](https://grafana.com/grafana/plugins/marcusolsson-dynamictext-panel/) or using the Grafana command line tool.

{{< youtube id="1qYzHfPXJF8" >}}

For the latter, please use the following command:

```sh
grafana cli plugins install marcusolsson-dynamictext-panel
```

## Highlights

- Provides an in-panel code editor with automatic JavaScript code formatting. Use it to add your JavaScript code and to [import external JavaScript libraries](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/use-cases/)
- Supports [Markdown](https://commonmark.org/help/) and [Handlebars](https://handlebarsjs.com/guide/expressions.html#basic-usage).
- Renders [markdown-it](https://github.com/markdown-it/markdown-it) into HTML elements.
  - Supports the highlighting of code syntax using A11Y styles.
- Provides code sanitization:
  - HTML inside templates is sanitized using [XSS](https://jsxss.com/en/index.html).
  - Can be disabled in the Grafana configuration through the `disable_sanitize_html` parameter.
- Supports display of nested objects using the `{{json object}}` Handlebars helper.
- Supports display of time global variables (`__to` and `__from`) as seconds, ISO timestamps, or formatted using the `dayjs` library.
- Supports adding the Handlebars helpers and event handlers.
- Supports adding CSS styles with dashboard variables.
- Supports internationalization using custom helpers.

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/screenshot.png" class="border" alt="The Business Text panel for Grafana." >}}

## Tutorial

The video reviews the major latest release including the data flow, predefined helpers and numerous examples of the external JavaScript libraries.

{{< youtube id="UVMysEjouNo" >}}

Review all the other helpful [tutorials related to this plugin](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/tutorials/).

## Documentation

| Section                  | Description                                                   |
| ------------------------ | ------------------------------------------------------------- |
| [Rendering](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/rendering/)     | Explains how to create a visualization template for your data |
| [Features](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/features/)     | Explains the plugin's features                                |
| [Use cases](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/use-cases/)    | Demonstrates interesting Community use cases                  |
| [Tutorials](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/tutorials/)   | Easy to follow tutorials                                      |
| [Release notes](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/release/) | Stay up to date with the latest features and updates          |

## License

Apache License Version 2.0, see [LICENSE](https://github.com/grafana/business-text/blob/main/LICENSE).
