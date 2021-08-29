const dimensions = { height: 500, width: 1100 };

const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", dimensions.width + 100)
  .attr("height", dimensions.height + 100);

const graph = svg.append("g").attr("transform", "translate(50, 50)");

// create data structure
const stratify = d3
  .stratify()
  .id((data) => data.name)
  .parentId((data) => data.parent);

const tree = d3.tree().size([dimensions.width, dimensions.height]);

// create ordinal scale
const color = d3.scaleOrdinal(["#7480a3", "#29314a", "#2e2e2e", "#060608"]);

// update function
const update = (data) => {
  // remove current nodes and links (full re-render on each update)
  graph.selectAll(".node").remove();
  graph.selectAll(".link").remove();

  // update ordinal scale domain
  color.domain(data.map((item) => item.department));

  // get updated root node data
  const rootNode = stratify(data);

  // get x and y positions for each node
  const treeData = tree(rootNode);

  // get nodes and join data
  const nodes = graph.selectAll(".node").data(treeData.descendants());

  // get link selection and join data
  const links = graph.selectAll(".link").data(treeData.links());

  // create enter new links
  links
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("fill", "none")
    .attr("stroke", "#aaa")
    .attr("stroke-width", 2)
    .attr(
      "d",
      d3
        .linkVertical()
        .x((data) => data.x)
        .y((data) => data.y)
    );

  // create enter node groups
  const enterNodes = nodes
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (data) => `translate(${data.x}, ${data.y})`);

  // append rects to enter nodes
  enterNodes
    .append("rect")
    .attr("fill", (data) => color(data.data.department))
    .attr("stroke", "#555")
    .attr("stroke-width", 2)
    .attr("height", 50)
    .attr("width", (data) => data.data.name.length * 20)
    .attr("transform", (data) => {
      let x = data.data.name.length * 10;
      return `translate(${-x}, -32)`;
    });

  // append name text
  enterNodes
    .append("text")
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .text((data) => data.data.name);
};

// handle firestore data
let data = [];

db.collection("employees").onSnapshot((res) => {
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
