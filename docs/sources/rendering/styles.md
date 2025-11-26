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

You can see all the defined styles in the source code.

<details>
  <summary>Default styles</summary>

<Code
  url="https://github.com/VolkovLabs/business-text/blob/main/src/components/Text/Text.styles.ts"
  language="js"
/>

</details>

<!-- clean up above -->

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

<details>
  <summary>A11Y light theme</summary>

<Code
  url="https://github.com/highlightjs/highlight.js/blob/main/src/styles/a11y-light.css"
  language="css"
/>

</details>

<!-- clean up above -->