---
title: JavaScript Code
description: Learn how to integrate JavaScript code snippets to add custom Handlebars helpers, event handlers, and dynamic functionality.
keywords:
  - business text
labels:
  products:
    - cloud
    - enterprise
    - oss
weight: 20
---

# JavaScript Code

The Business Text panel supports the integration of JavaScript code snippets that can add Handlebars helpers and event handlers.

{{< youtube id="lJqk5Gobec4" >}}

## Parameters

{{< admonition type="note" >}}
The Business Text panel supports `context` starting from version 4.3.0.
{{< /admonition >}}

Starting from release 4.3.0, you can access the panel data `panelData` and selected data frame `data` by way of a new object `context`.

Start typing the `context` word in the **Before Content Rendering** or **After Content Ready** boxes and see the latest list of all available features.

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/context.png" max-width="70%" class="border" alt="Simplified access to the panel data and selected data frame and some other features." >}}

| Parameter | Description | Before Render | After Render |
| --- | --- | --- | --- |
| [`context.data`](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/javascript-code/context-parameters/#contextdata) | Data from data sources. The display of one or multiple data rows from the selected data frame or from all data frames is determined by the **Render template** option. It can be one of three values: **Every Row**, **All Rows**, and **All data**. | Yes | Yes |
| [`context.dataFrame`](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/javascript-code/context-parameters/#contextdataframe) | Selected Data Frame for **Every Row**, **All Rows** templates. | Yes | Yes |
| [`context.element`](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/javascript-code/context-parameters/#contextelement) | Current html element. | | Yes |
| [`context.grafana.eventBus`](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/javascript-code/context-parameters/#grafanaeventbus) | Publish and subscribe to application events. | Yes | Yes |
| [`context.grafana.getLocale()`](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/javascript-code/context-parameters/#grafanagetlocale) | Returns the user's locale: 'en', 'fr', 'es', and so on. | Yes | Yes |
| [`context.grafana.locationService`](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/javascript-code/context-parameters/#grafanalocationservice) | The `locationService` works with the browser location and history. | Yes | Yes |
| [`context.grafana.notifyError(['Header', 'Message'])`](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/javascript-code/context-parameters/#grafananotifyerrorheader-message) | Displays an error. | Yes | Yes |
| [`context.grafana.notifySuccess(['Header', 'Message'])`](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/javascript-code/context-parameters/#grafananotifysuccessheader-message) | Displays a success notification. | Yes | Yes |
| [`context.grafana.refresh()`](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/javascript-code/context-parameters/#grafanarefresh) | Function to refresh dashboard panels using application events. | Yes | Yes |
| [`context.grafana.replaceVariables()`](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/javascript-code/context-parameters/#grafanareplacevariables) | The `replaceVariables()` function to interpolate variables. | Yes | Yes |
| [`context.grafana.theme`](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/javascript-code/context-parameters/#grafanatheme) | Contains grafana theme object. | Yes | Yes |
| [`context.grafana.timeRange`](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/javascript-code/context-parameters/#grafanatimerange) | Time range of the current dashboard. | Yes | Yes |
| [`context.grafana.timeZone`](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/javascript-code/context-parameters/#grafanatimezone) | Time zone of the current dashboard. | Yes | Yes |
| [`context.panel.handlebars`](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/javascript-code/context-parameters/#panelhandlebars) | Handlebars library. | Yes | Yes |
| [`context.panel.panelData`](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/javascript-code/context-parameters/#panelpaneldata) | Panel data. | Yes | Yes |

## Custom Handlebars helper

You can add a custom Handlebars helper to replace the field's value according to some pattern.

```handlebars
{{replace Test "Pattern" "Replaced"}}
```

{{< admonition type="note" >}}
Handlebars are not available in the After Content Render.
{{< /admonition >}}

Handlebars should be created in the **Before content Render**, because they are used during the rendering process to convert Handlebars > Markdown > HTML.

The **After Content Render** works with already created HTML elements and handlebars are not available at this point.

### JavaScript code

This code snippet registers a function with the `replace` helper that takes three arguments:

1. `context` is an object that contains the data for the template.
2. `pattern` is the text to be searched for.
3. `replacement` is the text to be used to replace the pattern.

Then, this code calls this function and passes the `pattern` and `replacement` arguments to it.

```js
context.handlebars.registerHelper("replace", (context, pattern, replacement) =>
  context.replace(pattern, replacement)
);
```

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/replace.png" class="border" alt="A custom helper to replace data in the returned data." >}}

## Event handler

To respond to a button click, you can add a custom event handler.

```html
<button onclick="myFunc()">{{test}}</button>
```

### JavaScript code

This code snippet defines a function called `myFunc`. The function takes no arguments and returns no value. The body of the function calls the `alert()` function to display the text "Bonjour!" in a dialog box.

```js
myFunc = () => {
  alert("Bonjour!");
};
```

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/event-handler.png" class="border" alt="JavaScript handler for button onclick event." >}}

## Internationalization

Grafana 9 and up offers internationalization, which most of the plugins do not yet have full access to.

Meanwhile, you can use the `getLocale()` method to get a value for the chosen locale and display terms from a defined dictionary.

### Content

This code snippet uses the `translate` helper to translate the text "Hello" to the current language. Text translation will be performed if the `translate` helper is defined, otherwise the text "Hello" will be displayed.

```handlebars
{{translate "Hello"}}
```

### Default content

This code snippet uses the `translate` helper to show the translation of a default message if the query does not return any results.

```handlebars
{{translate "Default"}}
```

### JavaScript code

```js
const messages = {
  Hello: {
    en: "Hello",
    fr: "Salut",
    es: "Hola",
  },
  Default: {
    en: "The query didn't return any results.",
    fr: "La requête n'a renvoyé aucun résultat.",
    es: "La consulta no arrojó ningún resultado.",
  },
};

const locale = getLocale();

context.handlebars.registerHelper(
  "translate",
  (message) => messages[message][locale] ?? messages[message]["en"]
);
```

## Time zone and range

You can display the selected dashboard, browser's time zone, and time ranges in Grafana.

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/time.png" class="border" alt="The Business Text panel allows displaying an updated time zone and time ranges in Grafana." >}}

### Content

Use the following for the **Content**

````html
<h1>Dashboard {{tz}}</h1>
<h2>Browser {{browser}}</h2>

```json
{{{json (range)}}}
```
````

### JavaScript code

Use the following for the **JavaScript > Before Content Rendering**

```js
const dashboardTimeZone = context.panelData.timeZone
const dashboardTimeRange = context.panelData.timeRange

context.handlebars.registerHelper('tz', () => dashboardTimeZone);
context.handlebars.registerHelper('range', () => dashboardTimeRange);
context.handlebars.registerHelper('browser', () => Intl.DateTimeFormat().resolvedOptions().timeZone);
```

## Automatic scrolling

If the table does not fit into the allocated panel area, you can add automatic scrolling using JavaScript with an adjustable interval.

{{< video-embed src="/media/docs/grafana/panels-visualizations/business-text/scroll.mp4" >}}

### Content

Use the following for the **Content**:

```html
<table id="dataTable">
  <tr>
    <th>Title</th>
    <th>Date</th>
    <th>Category</th>
  </tr>
  {{#each data}}
  <tr>
    <td>{{title}}</td>
    <td>{{date pubDate 'MMM, DD YYYY'}}</td>
    <td>{{category}}</td>
  </tr>
  {{/each}}
</table>
```

### JavaScript code

Use the following for the **JavaScript > Before Content Rendering**:

```js
const scrollWindow = () => {
  parentWindow =
    document.getElementById("dataTable").parentElement.parentElement;
  bottomOfWindow = parentWindow.scrollHeight - parentWindow.offsetHeight;

  /**
   * Scroll
   */
  if (parentWindow.scrollTop < bottomOfWindow) {
    parentWindow.scrollBy(0, 1);
    setTimeout(scrollWindow, 50);
    return;
  }

  /**
   * Scroll to the Top
   */
  setTimeout(function () {
    parentWindow.scrollTo({ top: 0, behavior: "smooth" });
  }, 1000);

  /**
   * Start scrolling again
   */
  setTimeout(scrollWindow, 1000);
};

$(() => {
  dataTable = document.getElementById("dataTable");

  /**
   * Avoid scrolling for short tables
   */
  if (
    dataTable.parentElement.scrollHeight <
    dataTable.parentElement.parentElement.offsetHeight
  ) {
    return;
  }

  /**
   * Already set to scroll
   */
  if (dataTable.parentElement.parentElement.getAttribute("listener")) {
    return;
  }

  dataTable.parentElement.parentElement.setAttribute("listener", true);
  scrollWindow();
});
```

## Unique values

You can sort out unique values from the `data` object using the `unique` helper that was implemented by the community member [goncalobsantos](https://community.grafana.com/u/goncalobsantos).

### Content

Use the following for the **Content**:

```html
<div>{{#each (unique data "hostname.keyword")}}{{this}}; {{/each}}</div>
```

### JavaScript code

Use the following for the **JavaScript > Before Content Rendering**:

```js
context.handlebars.registerHelper("unique", (context, key) => {
  return [...new Set(context.map((item) => item[key]))];
});
```

## Dashboard variables

You can use the `context.grafana.replaceVariables` function to replace dashboard variables in the JavaScript code.

```js
const bonjour = context.grafana.replaceVariables("${variable}");
console.log(bonjour.toUpperCase())
```

## REST API

The Business Text plugin submits REST API requests.

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/rest.png" class="border" alt="The Business Text plugin submits REST API request." >}}

### Content

Into the **Content**:

```html
<form id="myForm">
  <input name="firstName" />
  <input name="lastName" />

  <button>submit</button>
</form>
```

### JavaScript code

Into the **JavaScript > After Content Ready**

```js
/**
 * Form Element
 */
const form = document.querySelector("#myForm");

/**
 * Handle Submit
 */
const handleSubmit = (event) => {
  /**
   * Prevent Default submition
   */
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  console.log(data);
  /**
   * Result: { firstName: '', lastName: '' }
   */

  /**
   * Your request to send form
   */
  fetch("url", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

form.addEventListener("submit", handleSubmit);

return () => {
  form.removeEventListener("submit", handleSubmit);
};
```

## JSON parsing

The community member [havedill](https://github.com/havedill) [asked](https://github.com/VolkovLabs/business-text/issues/255) how to parse a JSON data format in the case when the transformation **Convert field type** is not available.

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/json-parsing.png" class="border" alt="." >}}

### JSON example

```json
{ "title": { "text": "Area Chart", "size": 45, "font": "Arial" } }
```

```json
{ "title": { "text": "Bar Chart", "color": "black" } }
```

### Content

```json
{{{json (parse JSON)}}}
```

### JavaScript

```js
context.handlebars.registerHelper("parse", (context) => JSON.parse(context));
```

## Anonymizer

Anonymizer converts real production data into dummy values in order to have your dashboards demo-ready. Anonymizer is another great example of how embedded JavaScript can simplify tedious and repetitive tasks.

You can find all you need in this [blog post](https://volkovlabs.io/blog/anonymizer-20240302/).

If you are a visual style learner, you can watch the video. It covers the same ground.

{{< youtube id="FMSEGGFbJy0" >}}
