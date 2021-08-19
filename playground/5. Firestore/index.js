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

db.collection("dishes")
  .get()
  .then((res) => {
    const data = [];
    res.docs.forEach((doc) => {
      data.push(doc.data());
    });

    // min, max, extent
    const min = d3.min(data, (data) => data.orders); // 200
    const max = d3.max(data, (data) => data.orders); // 900
    const extent = d3.extent(data, (data) => data.orders); // [200, 900]
    // linear scale
    const y = d3.scaleLinear().domain([0, max]).range([graphHeight, 0]);
    // band scale
    const x = d3
      .scaleBand()
      .domain(data.map((item) => item.name))
      .range([0, 500])
      .paddingInner(0.2)
      .paddingOuter(0.2);
    // join the data to rects
    const rects = graph.selectAll("rect").data(data);
    rects
      .attr("width", x.bandwidth)
      .attr("height", (d) => graphHeight - y(d.orders))
      .attr("fill", "orange")
      .attr("x", (d) => x(d.name))
      .attr("y", (d) => y(d.orders));
    // append the enter selection to the DOM
    rects
      .enter()
      .append("rect")
      .attr("width", x.bandwidth)
      .attr("height", (d) => graphHeight - y(d.orders))
      .attr("fill", "orange")
      .attr("x", (d) => x(d.name))
      .attr("y", (d) => y(d.orders));
    // create and call the axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3
      .axisLeft(y)
      .ticks(3)
      .tickFormat((data) => data + " orders");
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);
    xAxisGroup
      .selectAll("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)")
      .attr("fill", "darkorange");
  });