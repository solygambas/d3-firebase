# Build Data Visualizations with D3.js & Firebase

This repo is made of 4 projects:

1. [**Bar Chart**](#barchart): A simple bar graph to understand D3.js basics using Firebase.
2. [**Pie Chart**](#piechart): A budget planner displaying a donut chart.

## <a name="barchart"></a>1) Bar Chart

A simple bar graph to understand D3.js basics using Firebase.

[See bar-chart folder](https://github.com/solygambas/d3-firebase/tree/main/bar-chart)

<p align="center">
    <a href="https://github.com/solygambas/d3-firebase/tree/main/bar-chart">
        <img src="bar-chart/screenshot.png">
    </a>
</p>

### Features

- creating simple SVG shapes and appending them to the DOM with D3.js.
- changing attributes with .attr() and grouping elements together.
- joining JSON data to elements and adding virtual elements to the DOM.
- using linear and band scales with min, max and extent.
- creating a bar chart: centering a graph, adding axes and formatting ticks.
- creating a Firestore database, setting up the Firebase config and getting data from Firestore.
- understanding the D3 update pattern and using Firestore realtime data updates.
- adding D3 transitions and custom tweens.

## <a name="piechart"></a>2) Pie Chart

A budget planner displaying a donut chart with Materialize.

[See pie-chart folder](https://github.com/solygambas/d3-firebase/tree/main/pie-chart)

<!-- <p align="center">
    <a href="https://github.com/solygambas/d3-firebase/tree/main/pie-chart">
        <img src="pie-chart/screenshot.png">
    </a>
</p> -->

### Features

- creating an HTML template with Materialize.
- handling a form and adding data to Firestore.
- setting up a pie chart and generating arc paths with D3.
- generating colors with ordinal scales.
- customizing arc tween and adding legends with d3-legend.
- handling events: mouseOver, mouseOut and click.

Based on [Build Data Visualizations with D3.js & Firebase](https://www.udemy.com/course/build-data-uis-with-d3-firebase/) by Shaun Pelling - The Net Ninja (2019)
