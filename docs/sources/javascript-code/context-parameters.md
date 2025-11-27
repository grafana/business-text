---
title: Context parameters
description: Learn about the context parameters available in JavaScript code for accessing panel data, Grafana services, and user preferences.
keywords:
  - business text
labels:
  products:
    - cloud
    - enterprise
    - oss
---

# Context parameters

## `context.data`

Provides access to data from data sources. The display of one or multiple data rows from the selected data frame or from all data frames is determined by the **Render template** option, which can have one of three values: **Every Row**, **All Rows**, or **All data**.

### Usage

```javascript
context.data;
```

### Example

```javascript
const data = context.data;
```

## `context.dataFrame`

Provides access to the selected data frame for **Every Row** and **All Rows** templates.

### Usage

```javascript
context.dataFrame;
```

### Example

```javascript
const frame = context.dataFrame;
```

## `context.element`

Provides access to the current HTML element.

### Usage

```javascript
context.element;
```

### Example

```javascript
const element = context.element;
```

## Grafana

### `grafana.eventBus`

Enables publishing and subscribing to application events.

#### Usage

```javascript
context.grafana.eventBus;
```

#### Example

```javascript
const subscriber = eventBus.getStream(RefreshEvent).subscribe(() => {
  // to do
});
```

### `grafana.getLocale()`

Returns the user's locale: 'en', 'fr', 'es', and so on.

#### Usage

```javascript
context.grafana.getLocale();
```

#### Example

```javascript
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

### `grafana.getUserPreference(key)`

Gets the user preference value by key.

#### Usage

```javascript
context.grafana.getUserPreference("key");
```

#### Example

```HTML
<button onclick="myFuncGetValue()">Get Value and show message</button>
```

Before Content Rendering

```javascript
myFuncGetValue = () => {
  context.grafana.getUserPreference("testKey").then((value) => {
    context.grafana.notifySuccess(["USER STORAGE: ", JSON.stringify(value)]);
  });
};
```

#### Arguments

- `key` _string_.

### `grafana.locationService`

Provides access to the `locationService`, which works with the browser location and history.

#### Usage

```javascript
context.grafana.locationService;
```

#### Example

```javascript
context.grafana.locationService.reload();

const history = context.grafana.locationService.history;
```

### `grafana.notifyError([header, message])`

Displays an error notification.

#### Usage

```javascript
context.grafana.notifyError([header, message]);
```

#### Example

```javascript
context.grafana.notifyError(["Error Title", `Show error message`]);
```

#### Arguments

- `header` (string): Error title.
- `message` (string): Error message.

### `grafana.notifySuccess([header, message])`

Displays a success notification.

#### Usage

```javascript
context.grafana.notifySuccess([header, message]);
```

#### Example

```javascript
context.grafana.notifySuccess(["Success Title", `Success message`]);
```

#### Arguments

- `header` (string): Success title.
- `message` (string): Success message.

### `grafana.refresh()`

Refreshes dashboard panels using application events.

_Added in: v5.7.0_

#### Usage

```javascript
context.grafana.refresh();
```

### `grafana.replaceVariables()`

Interpolates variables using the `replaceVariables()` function.

#### Usage

```javascript
context.grafana.replaceVariables();
```

#### Example

```javascript
const bonjour = context.grafana.replaceVariables("${variable}");
console.log(bonjour.toUpperCase());
```

### `grafana.setUserPreference(key,data)`

Sets the user preference value by key.

#### Usage

```javascript
context.grafana.setUserPreference("key", {});
```

#### Example

```html
<button onclick="myFuncSetValue()">Set default Value and show message</button>
```

Before Content Rendering

```javascript
myFuncSetValue = () => {
  context.grafana
    .setUserPreference("testKey", { defaultData: "test message" })
    .then(() => {
      context.grafana.notifySuccess(["Data Added ", "Check Data"]);
      context.grafana.refresh();
    });
};
```

#### Arguments

- `key` (string): The preference key.
- `data` (unknown): The preference data.

### `grafana.theme`

Contains the Grafana theme object.

#### Usage

```javascript
context.grafana.theme;
```

#### Example

```javascript
const theme = context.grafana.theme;
console.log(theme);
```

### `grafana.timeRange`

Returns the time range of the current dashboard.

#### Usage

```javascript
context.grafana.timeRange;
```

#### Example

```javascript
const timeRange = context.grafana.timeRange;
console.log(timeRange);
```

### `grafana.timeZone`

Returns the time zone of the current dashboard.

#### Usage

```javascript
context.grafana.timeZone;
```

#### Example

```javascript
const timeZone = context.grafana.timeZone;
console.log(timeZone);
```

## Panel

### `panel.handlebars`

Provides access to the Handlebars library.

#### Usage

```javascript
context.handlebars;
```

#### Example

```javascript
context.handlebars.registerHelper("unique", (context, key) => {
  return [...new Set(context.map((item) => item[key]))];
});
```

### `panel.panelData`

Provides access to panel data.

#### Usage

```javascript
context.panelData;
```

#### Example

```javascript
const dashboardTimeZone = context.panelData.timeZone;
const dashboardTimeRange = context.panelData.timeRange;

context.handlebars.registerHelper("tz", () => dashboardTimeZone);
context.handlebars.registerHelper("range", () => dashboardTimeRange);
context.handlebars.registerHelper(
  "browser",
  () => Intl.DateTimeFormat().resolvedOptions().timeZone
);
```
