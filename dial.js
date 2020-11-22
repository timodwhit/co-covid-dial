/**
 * Setup
 */
var screenWidth = window.innerWidth;

var margin = {left: 40, top: 20, right: 60, bottom: 20},
  width = Math.min(screenWidth, 500) - margin.left - margin.right,
  height = Math.min(screenWidth, 500) - margin.top - margin.bottom;

var svg = d3.select("#dial").append("svg")
  .attr("width", (width + margin.left + margin.right))
  .attr("height", 250)
  .attr("id", "dial-graphic")
  .append("g").attr("class", "wrapper")
  .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

var dialData = [
  { riskLevel: "Protect our Neighbors", name: "Green", level: "green", value: 1, color: "#D9EAD3" },
  { riskLevel: "Caution", name: "Blue", level: "blue", value: 1, color: "#CFE2F3" },
  { riskLevel: "Concern", name: "Yellow", level: "yellow", value: 1, color: "#FFF2CC"},
  { riskLevel: "High Risk", name: "Orange", level: "orange", value: 1, color: "#FCE5CD"},
  { riskLevel: "Severe Risk", name: "Red", level: "red", value: 1, color: "#E06666"},
  { riskLevel: "Extreme Risk", name: "Purple", level: "purple", value: 1, color: "#D8BFD8"},
];

//Create a color scale
const colorScale = d3.scale.ordinal().range(dialData.map(({color}) => color));

//Create an arc function
const arc = d3.svg.arc()
  .innerRadius(width * 0.75 / 2)
  .outerRadius(width * 0.75 / 2 + 50);

var anglesRange = 0.5 * Math.PI;
var pie = d3.layout.pie()
  .startAngle(anglesRange * -1 )
  .endAngle(anglesRange)
  .value(({value}) => value)
  .padAngle(.05)
  .sort(null);

const labelArc = (i) => 'dialLabelArc' + i;

//Create the donut slices and also the invisible arcs for the text
svg.selectAll(".donutArcSlices")
  .data(pie(dialData))
  .enter().append("path")
  .attr("class", "donutArcSlices dial--option")
  .attr("data-level",(d) => d.data.level)
  .attr("d", arc)
  .style("fill", (d, i) => colorScale(i))
  .each(function (d, i) {

    const firstArcSection = /(^.+?)L/;

    //Grab everything up to the first Line statement
    //The [1] gives back the expression between the () (thus not the L as well) which is exactly the arc statement
    const newArc = firstArcSection.exec(d3.select(this).attr("d"))[1];

    //Create a new invisible arc that the text can flow along
    svg.append("path")
      .attr("id", labelArc(i))
      .attr("d", newArc)
      .style("fill", "none");
  });

//Append the label names on the outside
svg.selectAll(".dial--option--text")
  .data(dialData)
  .enter().append("text")
  .attr("class", ".dial--option--text")
  .attr("data-level", (d) => d.level)
  .attr("dy", -13)
  .append("textPath")
  .attr("startOffset", "50%")
  .style("text-anchor", "middle")
  .attr("xlink:href", (d, i) => "#" + labelArc(i))
  .text((d) => d.name);

// Add the click handler to show/hide columns.
const buttons = document.querySelectorAll('.dial--option');
const table = document.getElementById('dial-table');
const addActiveColor = (color) => table.dataset.level = color;
const addClickEvent = (element) => element.addEventListener('click', () => {
  console.log(element.dataset.level);
  addActiveColor(element.dataset.level);
  buttons.forEach(button => button.classList.remove('active'));
  element.classList.add('active');
});
buttons.forEach(addClickEvent);
