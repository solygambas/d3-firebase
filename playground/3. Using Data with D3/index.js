const svg = d3.select("svg");

const data = [
  { width: 200, height: 100, fill: "purple" },
  { width: 100, height: 60, fill: "pink" },
  { width: 50, height: 30, fill: "red" },
];

const rects = svg
  .selectAll("rect")
  .data(data)
  // add attrs to rect already in the DOM
  .attr("width", (data, index, name) => {
    // console.log(index); // 0 (first rectangle in the svg container array)
    // console.log(name); // rect,
    console.log(name[index]); // useful with arrow functions since we loose "this" context
    return data.width;
  })
  .attr("height", (data) => data.height)
  .attr("fill", (data) => data.fill);

// append the enter selection (virtual elements) to the DOM
rects
  .enter()
  .append("rect")
  .attr("width", (data) => data.width)
  .attr("height", (data) => data.height)
  .attr("fill", (data) => data.fill);
