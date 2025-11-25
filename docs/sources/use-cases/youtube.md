---
title: Youtube video
description: Learn how to embed and display YouTube videos on your Grafana dashboard using the Business Text panel.
labels:
  products:
    - cloud
    - enterprise
    - oss
weight: 12
---

# Youtube video

This idea comes from the [GitHub issue](https://github.com/VolkovLabs/business-text/issues/261) opened by [Raphealtony](https://github.com/Raphealtony). The Business Text plugin can be used to display YouTube videos on your Grafana dashboard.

{{< figure src="/media/docs/grafana/panels-visualizations/business-text/yt-edit.png" class="border" alt="How to configure the Business Text plugin to display a YouTube video." >}}

Use the following external library

```
https://youtube.com/iframe_api
```

## Content to copy

```html
<h1>Volkov Labs Latest videos</h1>
<div id="player"></div>
```

## After Content Ready

:::warning Version mismatch

Plug-in libraries may change their versions and the code in the example may not work or cause an error.

:::

Use the following for the **JavaScript**->**After Content Ready**:

```js
import("https://esm.sh/youtube-player").then(({ default: YouTubePlayer }) => {
  const player = YouTubePlayer("player");

  const videoList = ["AcQi-6GCrNU", "1ogv2jstrlI", "vky-7-DfvXE"];

  const randomVideoId = videoList[Math.floor(Math.random() * videoList.length)];

  player.loadVideoById(randomVideoId);
});
```
