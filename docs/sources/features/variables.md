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

The Business Text panel provides [helpers](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/features/helpers/#helper-variablevalue) to support variables. You can use variables in the JavaScript code and CSS styles.

The [Grafana Crash Course](https://volkovlabs.io/grafana/variables/) thoroughly explains these three types of variable.

## Check if a user is an admin

To access nested variables, use curly brackets.

```Handlebars
{{#if (contains (variable "{__user.login}") "admin")}}
  User is an admin
{{else}}
  User is not an admin
{{/if}}
```

## Markdown list from variable

Create a list from the multi select variable.

```Handlebars
{{#each (variable "hostname")}}
  - {{this}}
{{/each}}
```

## Dynamic templates using dashboard variables

Use the `lookup` helper to create dynamic templates based on dashboard variables.

The following template creates a key-value pair from every selected value in the `props` dashboard variable.

```Handlebars
book:
{{#each (variable "props")}}
  {{this}}: {{lookup @root this}}
{{/each}}
```

## JavaScript code

### Get variable value

Use the `context.grafana.replaceVariables()` function to replace dashboard variables in the JavaScript Code.

```js
const bonjour = context.grafana.replaceVariables("${variable}");
console.log(bonjour.toUpperCase());
```

### Set variable value

Prefix `var-` is required to set dashboard variable.

```js
context.grafana.locationService.partial({ "var-variableName": ".*" });
```

Time range values `from` and `to` should be set as is.

```js
context.grafana.locationService.partial({ from: start, to: end });
```

## CSS styles

Dashboard variables are replaced automatically in the CSS styles.
