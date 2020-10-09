//SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

//Margins as an object
var margin = {
  top: 20,
  right: 30,
  bottom: 125,
  left: 100
};

//Dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Select body, append SVG area to it, set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area 
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Load data
d3.csv("../assets/data/data.csv").then(function(censusData){
  console.log(censusData);

//Parse Data
censusData.forEach(function(data){
    data.healthcare = +data.healthcare;
    data.age = +data.age;
  });

//Create scale functions
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.healthcare)-2, d3.max(censusData, d => d.healthcare)+2])
    .range([0, width]);
  
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.age)-2, d3.max(censusData, d => d.age)+2])
    .range([height, 0]);    

//Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

//Append Axis to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")  
    .call(leftAxis);

// Create Cirlces
    var circlesGroup = chartGroup.append("g").selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale(d.age))
    .attr("r", "15")
    .attr("opacity", ".5")
    .attr('class', 'stateCircle');

    chartGroup.append("g").selectAll("text")
    .data(censusData)
    .enter()
    .append('text')
    .attr("x", d => xLinearScale(d.healthcare))
    .attr("y", d => yLinearScale(d.age))
    .text(function(d) {
      return d.abbr;
    })
   

//Initialize tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([70, -60])
    .html(function(d){
      var popup = d.state +'<hr>Healthcare: ' + d.healthcare + '% <br> Median Age: ' + d.age;
      return popup
    });

//Create tooltop in the chart
    chartGroup.call(toolTip);

//Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(data){
      toolTip.show(data, this);
    })

    .on("mouseout", function(data){
      toolTip.hide(data);
    });

    // Create axis labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height /2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Age (Median)");

    chartGroup.append("text")
      .attr("transform", `translate(${width/2}, ${height + margin.top +30})`)
      .attr("class", "axisText")
      .text("Percent with Healthcare")
  }).catch(function(error) {
    console.log(error);
  });