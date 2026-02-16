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

<script src="https://bacilo.github.io/strava-widgets/geo-stats-widget.iife.js"></script>

<strava-geo-stats

  data-url="https://bacilo.github.io/strava-widgets/data/geo/countries.json"

  data-secondary-url="https://bacilo.github.io/strava-widgets/data/geo/cities.json"

  data-metadata-url="https://bacilo.github.io/strava-widgets/data/geo/geo-metadata.json"

  data-title="Where I've Run"

  data-show-export="true">

</strava-geo-stats>


<script src="https://bacilo.github.io/strava-widgets/geo-table-widget.iife.js"></script>

<strava-geo-table
  data-url="https://bacilo.github.io/strava-widgets/data/geo/countries.json"
  data-dataset="countries"
  data-title="Countries I've Run In"
  data-rows-per-page="20"
  data-default-sort="distance"
  data-default-sort-direction="desc">
</strava-geo-table>
