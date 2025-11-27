---
title: Variables
description: Learn how to use Grafana dashboard variables in templates, JavaScript code, and CSS styles with dedicated helpers.
keywords:
  - business text
  - variables
labels:
  products:
    - cloud
    - enterprise
    - oss
weight: 500
---

# Variables

The Business Text panel provides [helpers](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/features/helpers/#helper-variablevalue) to support variables. You can use variables in JavaScript code and CSS styles.

The [Grafana Crash Course](https://volkovlabs.io/grafana/variables/) provides a thorough explanation of these three variable types.

## Check whether a user is an admin

To access nested variables, use curly brackets.

```Handlebars
{{#if (contains (variable "{__user.login}") "admin")}}
  User is an admin
{{else}}
  User is not an admin
{{/if}}
```

## Markdown list from a variable

Create a list from a multi-select variable.

```Handlebars
{{#each (variable "hostname")}}
  - {{this}}
{{/each}}
```

## Dynamic templates using dashboard variables

Use the `lookup` helper to create dynamic templates based on dashboard variables.

The following template creates a key-value pair from each selected value in the `props` dashboard variable.

```Handlebars
book:
{{#each (variable "props")}}
  {{this}}: {{lookup @root this}}
{{/each}}
```

## JavaScript code

### Get a variable value

Use the `context.grafana.replaceVariables()` function to replace dashboard variables in the JavaScript code.

```js
const bonjour = context.grafana.replaceVariables("${variable}");
console.log(bonjour.toUpperCase());
```

### Set a variable value

The `var-` prefix is required to set a dashboard variable.

```js
context.grafana.locationService.partial({ "var-variableName": ".*" });
```

Set the time range values `from` and `to` as follows:

```js
context.grafana.locationService.partial({ from: start, to: end });
```

## CSS styles

Dashboard variables are replaced automatically in the CSS styles.
