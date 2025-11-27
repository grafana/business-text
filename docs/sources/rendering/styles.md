---
title: Styles
description: Learn how to apply CSS styling using inline, internal, or external methods with support for dashboard variables and syntax highlighting.
keywords:
  - business text
labels:
  products:
    - cloud
    - enterprise
    - oss
---

# Styles

## Methods to include CSS

You can impose style using one, all, or any combination of the following:

- Inline. Specify CSS commands right in the **Content**.
- Internal. Specify CSS in the **Style editor** with convenient CSS syntax highlighting.
- External. Import an external CSS file. To prevent the loading of third-party URLs, you can store CSS files in the public folder on your Grafana instance:
  - On any external Grafana instance `https://GRAFANA-URL/public/grafanaCSS.css`
  - Or on local Grafana instance `/public/grafanaCSS.css`

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/style-methods.png" class="border" alt="The Business Text panel supports all usual styling methods." >}}

## Dashboard variables

Dashboard variables are replaced automatically in all CSS style methods.

{{< admonition type="note" >}}
The Business Text panel supports dashboard variables starting from version 3.0.0 and dashboard variables in CSS styles starting from version 4.0.0.
{{< /admonition >}}

## Internal method example 1

You can define your styles and use them in a template (**Content**, **Default Content**).

Code for a template:

```html
<td class="name">
  <p><b class="name">{{first_name}} {{last_name}}</b></p>
</td>
```

Code for the **Styles editor**:

```css
td.name {
  border: 0;
  background-color: #5d3fc4;
  color: white;
}

b.name {
  font-family: silom;
  font-size: 20px;
}
```

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/styles.png" class="border" alt="Using internal CSS for bold text in a table." >}}

## Internal method example 2

Here I have a simple, yet amazing styling approach. For instance, you can display the status of your devices/servers as green or red dots in a table.

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/dots.png" class="border" alt="Simple, yet stylish way to display unit status." >}}

To have this on your dashboard, copy the **Content** and **CSS Styles** parameters from below.

#### Content

```html
<table>
  <tbody>
    <tr>
      <td style="width: 10%;" colspan="10" class="header">
        SPC (last 10 samples)
      </td>
    </tr>
    <tr>
      <td style="width: 10%;"><span class="dot_niO"></span></td>
      <td style="width: 10%;"><span class="dot_iO"></span></td>
      <td style="width: 10%;"><span class="dot_iO"></span></td>
      <td style="width: 10%;"><span class="dot_iO"></span></td>
      <td style="width: 10%;"><span class="dot_iO"></span></td>
      <td style="width: 10%;"><span class="dot_iO"></span></td>
      <td style="width: 10%;"><span class="dot_niO"></span></td>
      <td style="width: 10%;"><span class="dot_iO"></span></td>
      <td style="width: 10%;"><span class="dot_iO"></span></td>
      <td style="width: 10%;"><span class="dot_iO"></span></td>
    </tr>
    <tr>
      <td style="text-align: left;" colspan="5">last</td>
      <td style="text-align: right;" colspan="5">10th</td>
    </tr>
    <tr>
      <td style="width: 10%;" colspan="5" class="down">
        Control interval: every 50 pcs
      </td>
      <td style="text-align: right;" colspan="5"></td>
    </tr>
  </tbody>
</table>
```

#### CSS Styles

```css
.dot_iO {
  height: 45px;
  width: 45px;
  background-color: #56ff56;
  border-radius: 50%;
  border: 2px solid black;
  display: inline-block;
}

.dot_niO {
  height: 45px;
  width: 45px;
  background-color: #ff5656;
  border-radius: 50%;
  border: 2px solid black;
  display: inline-block;
}

table {
  border-style: unset !important;
}

tr td {
  border-style: unset !important;
}
```

## External method example

For the external method example, refer to the [Leaflet.js interactive maps](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/use-cases/leaflet-js/).

## Override

You can see all the defined default styles in the source code.

```ts
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

import { HIGHLIGHT_DARK, HIGHLIGHT_LIGHT } from '../../constants';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
  /**
   * Frame
   */
  const frame = css`
    border-bottom: 1px solid ${theme.colors.border.medium};
    margin-bottom: ${theme.spacing(2)};
    padding: ${theme.spacing(1)};

    &:last-child {
      margin-bottom: 0;
      border-bottom: 0;
    }

    img {
      max-width: 100%;
    }

    li {
      margin-left: ${theme.spacing(2)};
    }

    a {
      color: ${theme.colors.text.link};
    }

    table {
      border-collapse: collapse;

      th,
      td {
        padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
        border-top: 1px solid ${theme.colors.border.medium};
        border-left: 1px solid ${theme.colors.border.medium};
      }

      th {
        font-weight: ${theme.typography.fontWeightMedium};
        background: ${theme.colors.background.secondary};
      }

      border-bottom: 1px solid ${theme.colors.border.medium};
      border-right: 1px solid ${theme.colors.border.medium};
    }

    blockquote {
      margin: ${theme.spacing(2)} 0;
      border-left: 5px solid ${theme.colors.border.strong};
      padding: ${theme.spacing(1)};
      padding-left: ${theme.spacing(2)};

      p {
        font-size: ${theme.typography.body.fontSize};
        color: ${theme.colors.text.secondary};
      }
    }
  `;

  /**
   * Loading Bar
   */
  const loadingBar = css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
  `;
  /**
   * Highlight
   */
  const highlight = theme.isDark ? HIGHLIGHT_DARK : HIGHLIGHT_LIGHT;

  return {
    frame,
    highlight,
    loadingBar,
  };
};
```

### Padding and margins

To display content without padding and margins, you need to override the parent CSS style.

```css
& {
  padding: 0;
  margin: 0;
}
```

## Code Syntax Highlight

The code syntax highlighting is based on the `highlight.js` library, which supports key programming languages.

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/json.png" class="border" alt="Random Walk data displayed with the highlighting and without margins or paddings." >}}

### Styling

We included the Accessibility (A11Y) syntax highlighting style for light and dark themes. You can override it in the styles editor by copying one of the styles from the [project source files](https://github.com/highlightjs/highlight.js/tree/main/src/styles).

```css

/*!
  Theme: a11y-light
  Author: @ericwbailey
  Maintainer: @ericwbailey

  Based on the Tomorrow Night Eighties theme: https://github.com/isagalaev/highlight.js/blob/master/src/styles/tomorrow-night-eighties.css
*/

.hljs {
  background: #fefefe;
  color: #545454;
}

/* Comment */
.hljs-comment,
.hljs-quote {
  color: #696969;
}

/* Red */
.hljs-variable,
.hljs-template-variable,
.hljs-tag,
.hljs-name,
.hljs-selector-id,
.hljs-selector-class,
.hljs-regexp,
.hljs-deletion {
  color: #d91e18;
}

/* Orange */
.hljs-number,
.hljs-built_in,
.hljs-literal,
.hljs-type,
.hljs-params,
.hljs-meta,
.hljs-link {
  color: #aa5d00;
}

/* Yellow */
.hljs-attribute {
  color: #aa5d00;
}

/* Green */
.hljs-string,
.hljs-symbol,
.hljs-bullet,
.hljs-addition {
  color: #008000;
}

/* Blue */
.hljs-title,
.hljs-section {
  color: #007faa;
}

/* Purple */
.hljs-keyword,
.hljs-selector-tag {
  color: #7928a1;
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
}

@media screen and (-ms-high-contrast: active) {
  .hljs-addition,
  .hljs-attribute,
  .hljs-built_in,
  .hljs-bullet,
  .hljs-comment,
  .hljs-link,
  .hljs-literal,
  .hljs-meta,
  .hljs-number,
  .hljs-params,
  .hljs-string,
  .hljs-symbol,
  .hljs-type,
  .hljs-quote {
        color: highlight;
    }

    .hljs-keyword,
    .hljs-selector-tag {
        font-weight: bold;
    }
}
```
