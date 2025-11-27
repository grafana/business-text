---
title: Helpers
description: Learn how to use Handlebars helpers to perform text transformations including date formatting, comparisons, and JSON manipulation.
keywords:
  - business text
labels:
  products:
    - cloud
    - enterprise
    - oss
weight: 100
---

# Helpers

Helpers (also called handlebars) are functions that let you perform basic text transformations within your template.

In the **JavaScript > before rendering content** option, you can register [custom handlebars](https://grafana.com/docs/plugins/marcusolsson-dynamictext-panel/<PLUGINS_VERSION>/javascript-code/#custom-handlebars-helper).

The Business Text panel includes many predefined handlebars that are registered automatically and ready to use:

| Handlebar                              | Description                                                           |
| -------------------------------------- | --------------------------------------------------------------------- |
| [contains](#contains)                  | Checks if a given value exists within an array                        |
| [date](#date)                          | Formats the timestamp in a given field using a date format            |
| [eq](#eq)                              | Checks two strings for equality                                       |
| [join](#join)                          | Joins all elements of an array into a string using a given separator  |
| [json](#json)                          | Presents an object (JSON) or an array as a formatted string           |
| [split](#split)                        | Splits a string into an array using a given separator                 |
| [toFixed](#tofixed)                    | Formats the given number using a fixed-point notation                 |
| [startsWith](#startswith)              | Returns true if the variable starts with a specified value            |
| [endsWith](#endswith)                  | Returns true if the variable ends with a specified value              |
| [match](#match)                        | Returns true if the variable matches with a specified value           |
| [variable](#helper-variable)           | This helper works only with one format of Grafana dashboard variables |
| [variableValue](#helper-variablevalue) | This helper works with all Grafana variable formats                   |

## `{{contains}}`

Checks if a given value exists within an array.

```handlebars
<!-- array: ['a', 'b', 'c'] -->

{{#if (contains array "a")}}
  Success!
{{else}}
  Not Found!
{{/if}}

<!-- result: 'Success!'  -->
```

## `{{date}}`

Formats the timestamp in a given field using a date format. Uses the [helper-date](https://github.com/helpers/helper-date) library.

The field value must be a Unix timestamp or any format supported by the [date.js library](https://date.js.org/).

```handlebars
<!-- Time: 1598791377556 -->

{{date Time "YYYY-MM-DD"}}

<!-- result: '2020-08-30'  -->
```

## `{{eq}}`

Checks two strings for equality.

```handlebars
<!-- app: foo -->

{{#if (eq app "auth")}}
  This is the auth app.
{{else}}
  This is not an auth app.
{{/if}}

<!-- result: 'Success!'  -->
```

## `{{join}}`

Joins all elements of an array into a string using a given separator.

```handlebars
<!-- array: ['a', 'b', 'c'] -->

{{join array "-"}}

<!-- result: 'a-b-c'  -->
```

## `{{json}}`

Presents an object (JSON) or an array as a formatted string. Markdown supports the syntax highlighting.

````handlebars
<!-- object or array -->

```json
{{json obj}}
```

<!-- result: as string  -->
````

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/json.png" class="border" alt="Visualize a formatted JSON object." >}}

### Transformation

The `JSON` helper expects an object or an array to display as a formatted string. If the data source returns a string, transform it to a JSON object using the `Convert field type` transformation.

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/json-transformation.png" class="border" alt="Transform a JSON string into an object." >}}

## `{{split}}`

Splits a string into an array using a given separator.

```handlebars
<!-- string: 'a,b,c,d' -->

{{split str ","}}

<!-- result: ['a','b','c']  -->
```

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/split.png" class="border" alt="Examples of splitting a string into an array." >}}

## `{{toFixed}}`

Formats the given number using a fixed-point notation.

```handlebars
<!-- Value: 1.1234 -->

{{toFixed Value 2}}

<!-- result: '1.12' -->
```

## `{{startsWith}}`

{{< admonition type="note" >}}
The Business Text panel supports this starting from version 4.2.0.
{{< /admonition >}}

Returns `true` if the variable starts with a specified value.

Example:

```md
|Name| My Value| |---|---|
{{#each @root}}
{{#if (startsWith @key "My_")}}
| {{@key}} | {{this}} |
{{/if}}
{{/each}}
```

## `{{endsWith}}`

{{< admonition type="note" >}}
The Business Text panel supports this starting from version 4.2.0.
{{< /admonition >}}

Returns `true` if the variable ends with a specified value.

Example:

```md
|Name| My Keys| |---|---|
{{#each @root}}
{{#if (endsWith @key "_key")}}
| {{@key}} | {{this}} |
{{/if}}
{{/each}}=
```

## `{{match}}`

{{< admonition type="note" >}}
The Business Text panel supports this starting from version 4.2.0.
{{< /admonition >}}

Returns `true` if the variable matches a specified value.

Example:

```md
|Key| Value| |---|---|
{{#each @root}}
{{#if (match @key "^(Country|Street|Post)")}}
| {{@key}} | {{this}} |
{{/if}}
{{/each}}
```

## Helper `{{variable}}`

This helper works only with one format of Grafana dashboard variables: array.

It returns a string array that includes the currently selected values for a specified variable.

```handlebars
{{variable "hostname"}}
```

If `hostname = ["server1", "server2", "server3"]`, then the result is `["server1", "server2", "server3"]`.

## Helper `{{variableValue}}`

{{< admonition type="note" >}}
The Business Text panel supports this starting from version 4.3.0.
{{< /admonition >}}

This helper works with all [Grafana variable formats](https://grafana.com/docs/grafana/latest/dashboards/variables/variable-syntax/).

The following example demonstrates the `queryparam` type.

```handlebars
<a href="/d/abc?{{variableValue '${example:queryparam}'}}">Link</a>
```

If `example` equals `["value1", "value2"]`, then the result is:

```html
<a href="/d/abc?var-example=value1&var-example=value2">Link</a>
```
