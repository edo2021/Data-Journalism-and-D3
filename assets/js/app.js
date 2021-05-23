console.log("app.js loaded")


// Define svg area 
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 50,
  right: 40,
  bottom: 80,
  left: 100
};

console.log("app.js loaded")


// Define svg area 
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 50,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create svg wrapper 
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//  Paramameters for x and y axis
var chosenXAxis = "age";
var chosenYAxis = "healthcare";

function xScale(csvData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(csvData, d => d[chosenXAxis]) * 0.8,
      d3.max(csvData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// click on axis label to update
function yScale(csvData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(csvData, d => d[chosenYAxis]) * 0.8,
        d3.max(csvData, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  
}

//  click on axis label to update
function renderXAxes(newXScale, xAxis) {
  console.log("Render X Axes function")
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
