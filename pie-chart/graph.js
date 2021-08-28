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

// legend setup
const legendGroup = svg
  .append("g")
  .attr("transform", `translate(${dims.width + 40}, 10)`);

const legend = d3.legendColor().shape("circle").shapePadding(10).scale(color);

// tooltip setup
const tip = d3
  .tip()
  .attr("class", "tip card")
  .html(function (data) {
    return `
    <div class="name">${data.data.name}</div>
    <div class="cost">€${data.data.cost}</div>
    <div class="delete">Click slice to delete</div>
    `;
  });

graph.call(tip);

// update function
const update = (data) => {
  // update color scale domain
  color.domain(data.map((data) => data.name));

  // update and call legend
  legendGroup.call(legend);
  legendGroup.selectAll("text").attr("class", "legend").attr("fill", "white");

  // join enhanced (pie) data to path elements
  const paths = graph.selectAll("path").data(pie(data));

  // handle the exit selection
  paths.exit().transition().duration(750).attrTween("d", arcTweenExit).remove();

  // handle the current DOM path updates
  paths.transition().duration(750).attrTween("d", arcTweenUpdate);

  // append the enter selection to the dom
  paths
    .enter()
    .append("path")
    .attr("class", "arc")
    .attr("stroke", "#fff")
    .attr("stroke-width", 3)
    .attr("fill", (data) => color(data.data.name))
    .each(function (data) {
      this._current = data; // save entering data in a new property
    })
    .transition()
    .duration(750)
    .attrTween("d", arcTweenEnter);

  // add events
  graph
    .selectAll("path")
    .on("mouseover", (event, data) => {
      tip.show(data, event.currentTarget);
      handleMouseOver(event, data);
    })
    .on("mouseout", (event, data) => {
      tip.hide();
      handleMouseOut(event, data);
    })
    .on("click", handleClick);
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

const arcTweenEnter = (data) => {
  let interpolation = d3.interpolate(data.endAngle, data.startAngle);
  return function (ticker) {
    data.startAngle = interpolation(ticker);
    return arcPath(data);
  };
};

const arcTweenExit = (data) => {
  let interpolation = d3.interpolate(data.startAngle, data.endAngle);
  return function (ticker) {
    data.startAngle = interpolation(ticker);
    return arcPath(data);
  };
};

function arcTweenUpdate(data) {
  let interpolation = d3.interpolate(this._current, data);
  this._current = interpolation(1); // = data
  return function (ticker) {
    return arcPath(interpolation(ticker));
  };
}

// event handlers
const handleMouseOver = (event, data) => {
  d3.select(event.currentTarget)
    .transition("changeSliceFill") // give a name to avoid render issues with custom tween
    .duration(300)
    .attr("fill", "white");
};

const handleMouseOut = (event, data) => {
  d3.select(event.currentTarget)
    .transition("changeSliceFill")
    .duration(300)
    .attr("fill", color(data.data.name));
};

const handleClick = (event, data) => {
  const id = data.data.id;
  db.collection("expenses").doc(id).delete();
};
