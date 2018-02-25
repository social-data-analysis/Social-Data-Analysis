function convertToMinutes(strTime) {
  var arrayTime = strTime.split(":");
  var hours = parseInt(arrayTime[0]);
  var minutes = parseInt(arrayTime[1]);
  var seconds = parseInt(arrayTime[2]);
  return hours * 60 + minutes + seconds/60
}

var margin = {top: 20, right: 20, bottom: 50, left: 70},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svgChart = d3.select("body").select(".chartManWoman").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

console.log(convertToMinutes("2:55:10"))

//Square symbol to show men
var symbol = d3.symbol()
  .type(d3.symbolSquare)
  .size(30);

var minMenYear, maxMenYear, minMenTime, maxMenTime;
var minWomenYear, maxWomenYear, minWomenTime, maxWomenTime;

function calculateWomenEdges(data) {
  minWomenYear = d3.min(data, function(d) {return d.Year;});
  maxWomenYear = d3.max(data, function(d) { return d.Year; })

  minWomenTime = d3.min(data, function(d) {return d.Time;});
  maxWomenTime = d3.max(data, function(d) { return d.Time; })
}

function calculateMenEdges(data) {
  minMenYear = d3.min(data, function(d) {return d.Year;});
  maxMenYear = d3.max(data, function(d) { return d.Year; })

  minMenTime = d3.min(data, function(d) {return d.Time;});
  maxMenTime = d3.max(data, function(d) {return d.Time;});
}

var tooltip = d3.select("body").select(".chartManWoman").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// tooltip mouseover event handler
var tipMouseover = function(d) {
  var html  = "Year: " + d.Year + "<br />" + "Time: " + d.Time;
  tooltip.html(html)
    .style("left", (d3.event.pageX - 80) + "px")
    .style("top", (d3.event.pageY - 60) + "px")
  .transition()
    .duration(1)
    .style("opacity", .9)
};
// tooltip mouseout event handler
var tipMouseout = function(d) {
  tooltip.transition()
    .duration(1)
    .style("opacity", 0);
};

//This function is called as default (at the beginning) and than on click on button
//"All"
function createGraphAll() {
  d3.csv("MenOpen.csv", function(error1, menOpenData) {
    d3.csv("WomenOpen.csv", function(error2, womenOpenData) {

      menOpenData.forEach(function(d) {
        d.Time = convertToMinutes(d.Time)
        d.Year = d.Year
      })

      womenOpenData.forEach(function(d) {
        d.Time = convertToMinutes(d.Time)
        d.Year = d.Year
      })

      calculateMenEdges(menOpenData);
      calculateWomenEdges(womenOpenData);

      var xScale = d3.scaleLinear()
        .domain([minMenYear, maxMenYear])
        .range([0, width])

      var yScale = d3.scaleLinear()
        .domain([minMenTime, maxWomenTime])
        .range([height, 0])

      var xAxis = d3.axisBottom(xScale).ticks(6),
          yAxis = d3.axisLeft(yScale);

      //Remove axis to assign new axis when press on button "All"
      //we should change this to update instead of removing but idk how
      svgChart.select(".x.axis")
        .remove()

      svgChart.select(".y.axis")
        .remove()

      svgChart.selectAll(".women")
        .remove()

      svgChart.selectAll(".men")
        .remove()

      //Transition should work as update but it'd not working :(
      var xAxisSvg = svgChart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")");

      xAxisSvg.transition()
        .duration(1000)
        .call(xAxis);

      xAxisSvg.append("text")
        .attr("class", "label")
        .attr("x", width) // x-offset from the xAxis, move label all the way to the right
        .attr("y", -6)    // y-offset from the xAxis, moves text UPWARD!
        .style("text-anchor", "end") // right-justify text
        .text("Year");

      svgChart.append("text")             
        .attr("transform", "translate(450, 480)")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("font-size", "15px")
        .text("Year");
        
      svgChart.append("text")
        .attr("transform", "rotate(-90), translate(30, -60)")
        .attr("y", 0)
        .attr("x" ,0 - (h / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("font-size", "15px")
        .text("Minutes"); 

      svgChart.append("g")
        .attr("class", "y axis")
        .transition()
        .duration(1000)
        .call(yAxis);

      //Path is required to use symbols
      var dotsMen = svgChart.selectAll(".men.dot")
        .data(menOpenData)
        .enter().append("path")
        .attr("class", "dot men")
        .style("stroke", "#515151")
        .style("fill", "white");

      dotsMen.transition()
        .duration(1000)
        .attr("transform", function(d) { return "translate(" + xScale(d.Year) + "," + yScale(d.Time) + ")"; })
        .attr("d", symbol);

      dotsMen.on("mouseover", tipMouseover)
        .on("mouseout", tipMouseout);

      var dotsWomen = svgChart.selectAll(".women.dot")
        .data(womenOpenData)
        .enter().append("circle")
        .attr("class", "dot women")
        .style("stroke", "#515151")
        .style("fill", "white");

      dotsWomen.transition()
        .duration(1000)
        .attr("r", 2)
        .attr("cx", function(d) {
          return xScale(d.Year);
        })
        .attr("cy", function(d) {
          return yScale(d.Time);
        })

      dotsWomen.on("mouseover", tipMouseover)
      .on("mouseout", tipMouseout);


      //Connect the dots with line
      var valueline = d3.line()
        .x(function(d) { return xScale(d.Year); })
        .y(function(d) { return yScale(d.Time); });

      // svgChart.append("path")
      //   .datum(womenOpenData)
      //   .attr("class", "line")
      //   .attr("d", valueline);


      console.log(menOpenData[0])

    });
  });
}

//on enter create default graph for both datasets
createGraphAll()


function createPlot(whichAxisX, whichAxisY, whichScaleX, whichScaleY, whichData, whichToHide) {
  svgChart.select(".x.axis")
    .transition()
    .duration(1000)
    .call(whichAxisX);

  svgChart.select(".y.axis")
    .transition()
    .duration(1000)
    .call(whichAxisY);

  if (whichToHide === ".men") {
    svgChart.selectAll(".women")
      .remove()

    svgChart.selectAll(whichToHide)
      .remove()


    var womenDots = svgChart.selectAll("circle")
      .data(whichData)
      .enter().append("circle")
      .attr("class", "dot women")
      .style("stroke", "#515151")
      .style("fill", "white");

    womenDots.transition()
    .duration(1000)
    .attr("r", 2)
    .attr("cx", function(d) {
      return whichScaleX(d.Year);
    })
    .attr("cy", function(d) {
      return whichScaleY(d.Time);
    });

    womenDots.on("mouseover", tipMouseover).on("mouseout", tipMouseout);
  }

  if (whichToHide === ".women") {

    svgChart.selectAll(".men")
      .remove()

    svgChart.selectAll(whichToHide)
      .remove()

    var menDots = svgChart.selectAll(".men.dot")
      .data(whichData)
      .enter().append("path")
      .attr("class", "dot men")
      .style("stroke", "#515151")
      .style("fill", "white");

    menDots.transition()
      .duration(1000)
      .attr("transform", function(d) { return "translate(" + whichScaleX(d.Year) + "," + whichScaleY(d.Time) + ")"; })
      .attr("d", symbol);

    menDots.on("mouseover", tipMouseover).on("mouseout", tipMouseout);
  }

}

function updateChart(whichToHide) {
  d3.csv("MenOpen.csv", function(error1, menOpenData) {
    d3.csv("WomenOpen.csv", function(error2, womenOpenData) {
      menOpenData.forEach(function(d) {
        d.Time = convertToMinutes(d.Time)
        d.Year = d.Year
      })

      womenOpenData.forEach(function(d) {
        d.Time = convertToMinutes(d.Time)
        d.Year = d.Year
      })

      calculateMenEdges(menOpenData);
      calculateWomenEdges(womenOpenData);

      var womenXscale = d3.scaleLinear()
        .domain([minWomenYear, maxWomenYear])
        .range([0, width])

      var menXscale = d3.scaleLinear()
        .domain([minMenYear, maxMenYear])
        .range([0, width])

      var womenYscale = d3.scaleLinear()
        .domain([minWomenTime, maxWomenTime])
        .range([height, 0])

      var menYscale = d3.scaleLinear()
        .domain([minMenTime, maxMenTime])
        .range([height, 0])

      var womenXAxis = d3.axisBottom(womenXscale).ticks(6),
          womenYAxis = d3.axisLeft(womenYscale);

      var menXAxis = d3.axisBottom(menXscale).ticks(6),
          menYAxis = d3.axisLeft(menYscale);

      if (whichToHide === ".men") {
        createPlot(womenXAxis, womenYAxis, womenXscale, womenYscale, womenOpenData, whichToHide)
      }
      if (whichToHide === ".women") {
        createPlot(menXAxis, menYAxis, menXscale, menYscale, menOpenData, whichToHide)
      }

    });
  });
}

var buttonsArray = ["#menData", "#womenData", "#allData"];

d3.select("#allData")
	.on("click", function() {
		createGraphAll()
	});

d3.select("#menData")
	.on("click", function() {
		updateChart(".women")
	});

d3.select("#womenData")
	.on("click", function() {
		updateChart(".men")
  });
  
// Add legend
var legendRectSize = 8;
var legendSpacing = 2;
var color = d3.scaleOrdinal(d3.schemeCategory20b);
var legendLabels = [
  {label: 'Men', shape: 'square'},
  {label: 'Women', shape: 'dot'}
]

var labels = ['Men', 'Women']
var vert = 0;

var legend = svgChart.selectAll('.legend')
  .data(labels)
  .enter()
  .append('g')
  .attr('class', 'legend')
  .attr('transform', function(d, i) {
    vert += 20;
    return 'translate(' + 850 + ',' + vert + ')';
  });

  legend.append(function(d) {
    // Ugly but it's working 
    if(d === "Men"){ 
        return document.createElementNS("http://www.w3.org/2000/svg", "rect");
    } else { 
        return document.createElementNS("http://www.w3.org/2000/svg", "circle");
    }})
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style("stroke", "#515151")
    .style("fill", "white")
    .attr('cx', '10')
    .attr('cy', '10')
    .attr('r', '5')
    .attr('transform', function(d) {
      if (d === "Women") {
        return "translate(-6,-6)"
      }})
      .style("stroke-width", function(d) {
        if (d === "Women") {
          return "2px"
        }});

legend.append('text')
    .attr('x', 14)
    .attr('y', 9)
    .text(function(d) { return d; })
    .style("font-size", "13px")
    .style("font-weight', 'bold")