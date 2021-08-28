const dims = { height: 300, width: 300, radius: 150 };
const cent = { x: dims.width / 2 + 5, y: dims.height / 2 + 5 };

const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", dims.width + 150)
  .attr("height", dims.height + 150);

const graph = svg
  .append("g")
  .attr("transform", `translate(${cent.x}, ${cent.y})`);

const pie = d3
  .pie()
  .sort(null)
  .value((data) => data.cost);

const arcPath = d3
  .arc()
  .outerRadius(dims.radius)
  .innerRadius(dims.radius / 2);

const color = d3.scaleOrdinal(d3["schemePaired"]);

// update function
const update = (data) => {
  // update color scale domain
  color.domain(data.map((data) => data.name));

  // join enhanced (pie) data to path elements
  const paths = graph.selectAll("path").data(pie(data));

  // handle the exit selection
  paths.exit().remove();

  // handle the current DOM path updates
  paths.attr("d", (data) => arcPath(data));

  // append the enter selection to the dom
  paths
    .enter()
    .append("path")
    .attr("class", "arc")
    .attr("d", (data) => arcPath(data))
    .attr("stroke", "#fff")
    .attr("stroke-width", 3)
    .attr("fill", (data) => color(data.data.name));
};

// handle firestore data
let data = [];

db.collection("expenses").onSnapshot((res) => {
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
