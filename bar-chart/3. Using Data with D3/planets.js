const svg = d3.select("svg");

d3.json("planets.json").then((data) => {
  // join the data to circles
  const circles = svg.selectAll("circle").data(data);

  // add attributes if circles are already in the DOM
  circles
    .attr("cy", 200)
    .attr("cx", (data) => data.distance)
    .attr("r", (data) => data.radius)
    .attr("fill", (data) => data.fill);

  // append the enter selection to the DOM
  circles
    .enter()
    .append("circle")
    .attr("cy", 200)
    .attr("cx", (data) => data.distance)
    .attr("r", (data) => data.radius)
    .attr("fill", (data) => data.fill);
});
