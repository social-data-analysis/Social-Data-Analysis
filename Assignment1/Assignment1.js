var w = 1000;
var h = 500;
var barPadding = 50;
var padding = 40;

var firstRead = true;

var tickValues = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var xScale;
var yScale;
var xAxis;
var yAxis;
var rectangles;

var svg = d3.select("#part3title")
				.append("svg")
				.attr("width", w)
				.attr("height", h);
		
readFromCSV("0");

function readFromCSV(type) {
	d3.csv("Assignment1_freshness.csv", function(data) {
		var dataset = [];
		data.forEach(function(element) {
			if (element.index === type) {
				dataset.push(element);
			}
		});
		createBarPlot(dataset);
	});
}	

function createBarPlot(data) {
	var maxHRange = 0;
	data.forEach(function(d){
		if (parseInt(d.count) > maxHRange) {
			maxHRange = parseInt(d.count);
		}
	});
	
	xScale = d3.scaleBand()
				.domain(tickValues)
				.rangeRound([padding, w - padding])
				.paddingInner(0.2);
				
	xAxis = d3.axisBottom()
				.scale(xScale);
		
	yScale = d3.scaleLinear()
				.domain([0, maxHRange])
				.range([h - padding, padding]);
				
	yAxis = d3.axisLeft()
				.scale(yScale)
				.ticks(5);
				
	if (firstRead) {
		createRectangles(data);
		firstRead = false;
	}
	else {
		updateRectangles(data);
	}
}

function createRectangles(data) {
	svg.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("x", function(d) {
			return xScale(d.month);
		})
		.attr("y", function(d) {
			return yScale(d.count);
		})
		.attr("width", xScale.bandwidth())
		.attr("height", function(d) {
			return h - padding - yScale(d.count);
		})
		.attr('fill', '#5da7a9');
		
	svg.append("g")
		.attr("class", "axisX")
		.attr("transform", "translate(0," + (h - padding) + ")")
		.call(xAxis);
		
	svg.append("g")
		.attr("class", "axisY")
		.attr("transform", "translate(" + padding + ",0)")
		.call(yAxis);
		
	svg.append("text")             
		.attr("transform", "translate(" + (w / 2) + "," + (h) + ")")
		.style("text-anchor", "middle")
		.style("font-size", "15px")
		.text("Month");
		
	svg.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0)
		.attr("x" ,0 - (h / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-size", "15px")
		.text("Count"); 
}

function updateRectangles(data) {
	svg.selectAll("rect")
		.data(data)
		.transition()
		.duration(1000)
		.attr("y", function(d) {
			return yScale(d.count);
		})
		.attr("height", function(d) {
			return h - padding - yScale(d.count);
		});
		
	svg.select(".axisX")
		.transition()
		.duration(1000)
		.call(xAxis);

	svg.select(".axisY")
		.transition()
		.duration(1000)
		.call(yAxis);
}

d3.select("#freshFruit")
	.on("click", function() {
		readFromCSV("0")
	});

d3.select("#freshVegetable")
	.on("click", function() {
		readFromCSV("1")
	});
	
d3.select("#storageFruit")
	.on("click", function() {
		readFromCSV("2")
	});
	
d3.select("#storageVegetable")
	.on("click", function() {
		readFromCSV("3")
	});