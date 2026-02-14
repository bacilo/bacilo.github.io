---
title: Strava Widget
excerpt: ''
image: ''
collection: portfolio
repoUrl: ''
demoUrl: ''
description: ''
playgroundUrl: ''
---

<div id="strava-stats"></div>
<script src="https://bacilo.github.io/strava-widgets/stats-card.iife.js"></script>
<script>
  new StravaStatsCard('#strava-stats', {
    dataUrl: 'https://bacilo.github.io/strava-widgets/weekly-stats.json',
    secondaryDataUrl: 'https://bacilo.github.io/strava-widgets/your-repo/advanced-stats.json'
  });
</script>
