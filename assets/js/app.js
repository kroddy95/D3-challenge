//SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

//Margins
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

//Append group to the SVG area 
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Load data
d3.csv("../assets/data/data.csv").then(function(censusData){
  console.log(censusData);

  //Get the healthcare and age data
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

  //Append axis to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")  
    .call(leftAxis);

  //Create cirlces
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale(d.age))
    .attr("r", "15")
    .attr("opacity", "1")
    .attr('class', 'stateCircle');

  //Add the state abbreviations to the circles
  chartGroup.append("g").selectAll("text")
    .data(censusData)
    .enter()
    .append('text')
    .attr('class', 'stateText')
    .attr("x", d => xLinearScale(d.healthcare))
    .attr("y", d => yLinearScale(d.age))
    .text(function(d) {
      return d.abbr;
    })
   
  //Create tool tip
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-5, 0])
    .html(function(d){ 
      return d.state +'<br>Without Healthcare: ' + d.healthcare + '% <br> Median Age: ' + d.age;
    });

  //Get tooltip in the chart
  chartGroup.call(toolTip);

  //Create triggers to show and hide tooltip
  circlesGroup.on("mouseover", function(data){
    toolTip.show(data, this);
  })

  .on("mouseout", function(data){
    toolTip.hide(data);
  });

  //Create axis labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height /2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Median Age");

  chartGroup.append("text")
    .attr("transform", `translate(${width/2}, ${height + margin.top +30})`)
    .attr("class", "axisText")
    .text("Percent without Healthcare")

  //Catch the error
  }).catch(function(error) {
    console.log(error);
  });