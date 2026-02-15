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
  window.StatsCard.init('strava-stats', {
    dataUrl: 'https://bacilo.github.io/strava-widgets/data/stats/all-time-totals.json',
    options: {
      showTitle: true,
      secondaryDataUrl: 'https://bacilo.github.io/strava-widgets/data/stats/year-over-year.json'
    }
  });
</script>
