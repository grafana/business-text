---
title: Status field
description: Learn how to use the status field to dynamically set background or foreground colors based on threshold ranges.
keywords:
  - business text
labels:
  products:
    - cloud
    - enterprise
    - oss
weight: 400
---

# Status field

{{< admonition type="note" >}}
The Business Text panel supports the status field starting from version 4.1.0.
{{< /admonition >}}

You can use the `statusColor` variable to set a background or foreground color of any HTML element.

<Image
  title="Status field allows you to dynamically set a background or foreground color."
  src="/img/plugins/business-text/status.png"
/>

## Threshold

Colors are defined based on the threshold ranges for the selected status field.

## Example

```handlebars
<div style="background-color: {{statusColor}}">
  {{A-series}}
</div>
```
