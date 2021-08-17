const svg = d3.select("svg");

const data = [{ width: 200, height: 100, fill: "purple" }];

svg
  .select("rect")
  .data(data)
  .attr("width", (data, index, name) => {
    console.log(index); // 0 (first rectangle in the svg container array)
    console.log(name); // rect,
    console.log(name[index]); // useful with arrow functions since we loose "this" context
    return data.width;
  })
  .attr("height", (data) => data.height)
  .attr("fill", (data) => data.fill);
