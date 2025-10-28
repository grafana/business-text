# Business Text for Grafana

[![CI](https://github.com/grafana/business-text/actions/workflows/push.yml/badge.svg)](https://github.com/grafana/business-text/actions/workflows/push.yml)
[![CD](https://github.com/grafana/business-text/actions/workflows/publish.yml/badge.svg)](https://github.com/grafana/business-text/actions/workflows/publish.yml)
[![License](https://img.shields.io/github/license/grafana/business-text)](https://github.com/grafana/business-text/blob/main/LICENSE)

>This project was originally contributed by [Volkov Labs](https://github.com/volkovlabs/business-text) - thanks for all your great work!
>
>We have republished under the same plugin ID, keeping the community signature. This means you can simply update your plugin version. A new ID would have required manual updates to your dashboards. For additional information on the changes, see the [Notices](https://github.com/grafana/business-text/blob/main/NOTICES.md).

The Business Text panel plugin allows you to construct a text visualization template from the values of a dataset returned by a data source query.

## Requirements

- Business Text panel 6.X requires **Grafana 11** or **Grafana 12**.
- Business Text panel 5.X requires **Grafana 10** or **Grafana 11**.
- Dynamic Text panel 4.X requires **Grafana 9.2** or **Grafana 10**.
- Dynamic Text panel 2.X and 3.X require **Grafana 8.5** or **Grafana 9**.
- Dynamic Text panel 1.X requires **Grafana 7**.

## Getting Started

You can install the Business Text panel from the [Grafana Plugins catalog](https://grafana.com/grafana/plugins/marcusolsson-dynamictext-panel/) or use the Grafana command line tool.

For the latter, please use the following command:

```bash
grafana cli plugins install marcusolsson-dynamictext-panel
```

## Highlights

- Uses Monaco Code Editor with automatic JavaScript code formatting.
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

## Documentation

| Section                                                               | Description                                                   |
| --------------------------------------------------------------------- | ------------------------------------------------------------- |
| [Rendering](https://volkovlabs.io/plugins/business-text/content/)     | Explains how to create a visualization template for your data |
| [Recipes](https://volkovlabs.io/plugins/business-text/recipes/)       | Useful snippets that you can use in your templates            |
| [Features](https://volkovlabs.io/plugins/business-text/features/)     | Demonstrates panel features.templates                         |
| [Tutorials](https://volkovlabs.io/plugins/business-text/tutorials/)   | Easy to follow tutorials                                      |
| [Release Notes](https://volkovlabs.io/plugins/business-text/release/) | Stay up to date with the latest features and updates          |


## License

Apache License Version 2.0, see [LICENSE](https://github.com/grafana/business-text/blob/main/LICENSE).
