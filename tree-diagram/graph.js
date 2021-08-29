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

// update function
const update = (data) => {
  // get updated root node data
  const rootNode = stratify(data);

  // get x and y positions for each node
  const treeData = tree(rootNode);

  // get nodes and join data
  const nodes = graph.selectAll(".node").data(treeData.descendants());

  // create enter node groups
  const enterNodes = nodes
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (data) => `translate(${data.x}, ${data.y})`);

  // append rects to enter nodes
  enterNodes
    .append("rect")
    .attr("fill", "#aaa")
    .attr("stroke", "#555")
    .attr("stroke-width", 2)
    .attr("height", 50)
    .attr("width", (data) => data.data.name.length * 20);

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
