const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", 600)
  .attr("height", 600);

// create margins and dimensions
const margin = { top: 20, right: 20, bottom: 100, left: 100 };
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;
const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const xAxisGroup = graph
  .append("g")
  .attr("transform", `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append("g");

// scales
// linear scale
const y = d3.scaleLinear().range([graphHeight, 0]);
// band scale
const x = d3.scaleBand().range([0, 500]).paddingInner(0.2).paddingOuter(0.2);

// create the axes
const xAxis = d3.axisBottom(x);
const yAxis = d3
  .axisLeft(y)
  .ticks(3)
  .tickFormat((data) => data + " orders");
// update x axis text
xAxisGroup
  .selectAll("text")
  .attr("text-anchor", "end")
  .attr("transform", "rotate(-40)")
  .attr("fill", "darkorange");

// transition
const customTransition = d3.transition().duration(1500);

// update function
const update = (data) => {
  // 1. update scales (domains)
  y.domain([0, d3.max(data, (data) => data.orders)]);
  x.domain(data.map((item) => item.name));
  // 2. join updated data to elements
  const rects = graph.selectAll("rect").data(data);
  // 3. remove unwanted shapes using the exit selection
  rects.exit().remove();
  // 4. update current shapes in the dom
  rects
    .attr("width", x.bandwidth)
    .attr("fill", "orange")
    .attr("x", (d) => x(d.name));
  // .transition(customTransition)
  // .attr("y", (d) => y(d.orders))
  // .attr("height", (d) => graphHeight - y(d.orders));
  // 5. append the enter selection to the dom
  rects
    .enter()
    .append("rect")
    // .attr("width", 0) // already declared in widthTween
    .attr("height", 0)
    .attr("fill", "orange")
    .attr("x", (d) => x(d.name))
    .attr("y", graphHeight)
    .merge(rects) // merge with current shapes in the DOM to avoid code duplication
    .transition(customTransition)
    .attrTween("width", widthTween)
    .attr("y", (d) => y(d.orders))
    .attr("height", (d) => graphHeight - y(d.orders));
  // call axes
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);
};

let data = [];

// get data from firestore
db.collection("dishes").onSnapshot((res) => {
  res.docChanges().forEach((change) => {
    const doc = { ...change.doc.data(), id: change.doc.id };
    switch (change.type) {
      case "added":
        data.push(doc);
        break;
      case "modified":
        const index = data.findIndex((item) => item.id === doc.id);
        data[index] = doc;
        break;
      case "removed":
        data = data.filter((item) => item.id !== doc.id);
        break;
      default:
        break;
    }
  });
  update(data);
});

// TWEENS

const widthTween = (data) => {
  // define interpolation
  // if 0, return 0
  // if 1, return x.bandwith()
  let interpolation = d3.interpolate(0, x.bandwidth());
  // return a function with a time ticker
  return function (timeTicker) {
    // passing the ticker into the interpolation
    // between 0, start transition and 1, end transition
    return interpolation(timeTicker);
  };
};
