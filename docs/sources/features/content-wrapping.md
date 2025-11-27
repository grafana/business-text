---
title: Content wrapping
description: Learn how the content wrapping option controls whether rows are automatically wrapped in paragraph tags.
keywords:
  - business text
labels:
  products:
    - cloud
    - enterprise
    - oss
weight: 600
---

# Content wrapping

The **Content > Wrap automatically in paragraphs** option:

- If enabled, every row of the content will be wrapped into paragraph `<p>` tags.
- If disabled, every row will NOT be wrapped into paragraph `<p>` tags.

The example below shows the **Content** that does not contain any spaces. In that event, the **Content > Wrap automatically in paragraphs** parameter is irrelevant and both **Enabled** and **Disabled** modes generate the same output.

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/no-empty-lines.png" class="border" alt="No spaces in the Content, the wrap parameter is irrelevant. The dashboard looks as expected for both, Enabled and Disabled, modes." >}}

The example below shows the **Content** that contains one empty line and how the form is interpreted with **Enabled** and **Dispaled** modes.

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/yes-empty-lines.png" class="border" alt="The wrap option effect on the Content with space in it." >}}

The code used in the examples above:

```html
<figure>
  <ul>
    <li>In Progress : 34</li>
    <li>Completed : 5</li>
  </ul>
</figure>
```
