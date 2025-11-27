---
title: Grafana Events
description: Learn how to subscribe to Grafana application events and respond to user interactions using the event bus.
keywords:
  - business text
  - events
labels:
  products:
    - cloud
    - enterprise
    - oss
weight: 200
---

# Grafana Events

{{< admonition type="note" >}}
The Business Text panel supports the event bus starting from version 4.0.0.
{{< /admonition >}}

Grafana uses an event bus to publish application events to notify different parts of Grafana when the user interacts with it. The Business Text panel can respond to these interactions by subscribing to one or more events.

## Predefined Events

A full list of events is available in our [Grafana Crash Course](https://volkovlabs.io/grafana/developer/eventbus/).

## Subscribe to events

To avoid memory leaks, all events must be unsubscribed.

```js
const subscription = context.grafana.eventBus.subscribe(
  { type: "data-hover" },
  () => {
    console.log("React to Data Hover");
  }
);

return () => {
  subscription.unsubscribe();
  console.log("Unsubscribed");
};
```

## EventBus example

{{< video-embed src="/media/docs/grafana/panels-visualizations/business-text/event-bus.mp4" >}}

Below is the Business Text panel configuration.

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/eb-edit.png" class="border" alt="The Business Text panel in edit mode." >}}

**Content** to copy

```html
<pre id="event"></pre>
```

**Before content rendering** to copy

```js
const subscription = context.grafana.eventBus.subscribe(
  { type: "theme-changed" },
  (event) => {
    document.getElementById("event").innerHTML = JSON.stringify(
      event,
      undefined,
      2
    );
    console.log("React to Theme Changed");
  }
);

function decycle(obj, stack = []) {
  if (!obj || typeof obj !== "object") return obj;

  if (stack.includes(obj)) return null;

  let s = stack.concat([obj]);

  return Array.isArray(obj)
    ? obj.map((x) => decycle(x, s))
    : Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, decycle(v, s)])
      );
}

const subscription2 = context.grafana.eventBus.subscribe(
  { type: "data-hover" },
  (data) => {
    document.getElementById("event").innerHTML = JSON.stringify(
      decycle(data),
      undefined,
      2
    );
    console.log("React to Data Hover", data);
  }
);

return () => {
  subscription.unsubscribe();
  subscription2.unsubscribe();
  console.log("Unsubscribed");
};
```
