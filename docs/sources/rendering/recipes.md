---
title: Recipes
description: Learn how to use helpful code snippets for template usage including iteration, conditional content, and accessing specific data rows.
keywords:
  - business text
labels:
  products:
    - cloud
    - enterprise
    - oss
---

# Recipes

This page includes helpful snippets for usage in your templates.

## Initial context

Displays the initial context in which the template executes.

````handlebars
```json
{{{json @root}}}
```
````

For more information, refer to the [Handlebars variables documentation](https://handlebarsjs.com/api-reference/data-variables.html#root).

## Iterate through all fields in each record

Set the **Render template** toggle to `All rows` in the plugin options.

```handlebars
{{#each data}}
  {{#each this}} {{@key}}: {{this}} {{/each}}
{{/each}}
```

## Conditional content

This snippet shows how to display different content based on specific conditions.

```handlebars
{{#if (eq app "auth")}}
  This is the auth app.
{{else}}
  This is not an auth app.
{{/if}}
```

## Reference a specific row in the data

To reference a specific row in the returned dataset, set the **Render template** toggle to `All rows`.

```handlebars
{{data.4.title}}
```

### Handlebars variables

This snippet demonstrates how to iterate through an array of data and display the title of the third item using the `@index` variable.

```handlebars
{{#each data}}
  {{#if (eq @index 3)}}
    {{title}}
  {{/if}}
{{/each}}
```
