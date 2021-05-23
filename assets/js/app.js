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


//  yAxis 
function renderYAxes(newYScale, yAxis) {
    console.log("Render Y Axes function")
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
}

// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    console.log("Render Circles function")
    
    circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// circle state labels
function renderLabels(circleLabels, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circleLabels.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]))
        .attr("text-anchor", "middle");

    return circleLabels;
}

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circleLabels) {
    console.log("UpdateToolTip function")

    if (chosenXAxis === "age") {
      var xlabel = "Average Age";
    }
    else {
      xlabel = "% Experiencing Poverty";
    }

    if (chosenYAxis === "healthcare") {
    var ylabel = "% Lacking Healthcare";
    }
    else {
    ylabel = "% Who Smoke";
    }

    // toolTip
    var toolTip = d3.tip()
    .attr("class", "tooltip d3-tip")
    .offset([90, 90])
    .html(function(d) {
    
    return (`<strong>${d.state}</strong><br>${xlabel}: ${d[chosenXAxis]}<br>${ylabel}: ${d[chosenYAxis]}`);
    });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      
      .on("mouseout", function(data, index) {
        toolTip.hide(data, this);
      });
    //  Event Listeners 

    circleLabels.call(toolTip);
    circleLabels.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });
    return circlesGroup; 
   

}

// Load the csv data using d3.csv
d3.csv("assets/data/data.csv").then(csvData => {
    console.log("csv data has been loaded");
    console.log(csvData);

    csvData.forEach(function(csvData) {
        csvData.poverty = +csvData.poverty;
        csvData.age = +csvData.age;
        csvData.income = +csvData.income;
        csvData.healthcare = +csvData.healthcare;
        csvData.obesity = +csvData.obesity;
        csvData.smokes = +csvData.smokes;
    });

    var xLinearScale = xScale(csvData, chosenXAxis);

    var yLinearScale = yScale(csvData, chosenYAxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    // Append y axis
    var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(csvData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "green")
    .attr("opacity", ".35");

    
    var circleLabels = chartGroup.selectAll(null)
    .data(csvData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .text(d => d.abbr)
    .attr("font-family", "sans-serif")
    .attr("font-size", "14px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");

    var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "age") 
    .classed("active", true)
    .text("Age");

    var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "poverty")
     // value to grab for event listener
    .classed("inactive", true)
    .text("Experiencing Poverty");

    var ylabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(-25, ${height / 20})`);

    var healthcareLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 25 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "healthcare") 

    // value to grab for event listener
    .classed("axis-text", true)
    .classed("active", true)
    .text("Lacking Health Care");

    var smokesLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 55 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "smokes")
    
    // value to grab for event listener
    .classed("axis-text", true)
    .classed("inactive", true)
    .text("Smokers");

    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circleLabels);

    // x axis labels event listener
    xlabelsGroup.selectAll("text")
    .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
            chosenXAxis = value;
    
            
            xLinearScale = xScale(csvData, chosenXAxis);
    
            xAxis = renderXAxes(xLinearScale, xAxis);
    
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
    
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circleLabels);

            circleLabels = renderLabels(circleLabels, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
    
            if (chosenXAxis === "age") {
            ageLabel
                .classed("active", true)
                .classed("inactive", false);
            povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else {
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            povertyLabel
                .classed("active", true)
                .classed("inactive", false);
            } 
        } 
    });

    ylabelsGroup.selectAll("text")
    .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
            chosenYAxis = value;
    
            
            yLinearScale = yScale(csvData, chosenYAxis);
    
            // Updates x axis with transition
            yAxis = renderYAxes(yLinearScale, yAxis);
    
            // Updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
    
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circleLabels);

            circleLabels = renderLabels(circleLabels, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
    
            if (chosenYAxis === "healthcare") {
            healthcareLabel
                .classed("active", true)
                .classed("inactive", false);
            smokesLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else {
            healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
            smokesLabel
                .classed("active", true)
                .classed("inactive", false);
            } 
        } 
    });

});