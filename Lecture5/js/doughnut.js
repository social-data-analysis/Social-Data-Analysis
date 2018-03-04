var w = 500;
var h = 500;

var outerRadius = w / 2;
var innerRadius = w / 3;

var color = d3.scaleOrdinal(d3.schemeCategory10);

// Create static object with results from python.
var dataset = [{'borough': 'BRONX',
                'percentage': 0.22},
               {'borough': 'QUEENS',
                'percentage': 0.2},
               {'borough': 'MANHATTAN',
                'percentage': 0.24},
               {'borough': 'BROOKLYN',
                'percentage': 0.29},
               {'borough': 'STATEN ISLAND',
                'percentage': 0.05}]

var svg = d3.select("#doughnutChart")
            .append("svg")
            .data([dataset])
                .attr("width", w)
                .attr("height", h)
            .append("g")
                .attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")");

var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

                
var pie = d3.pie()
            .value(function(d) { return d.percentage; });

var arcs = svg.selectAll("g.arc")
                .data(pie)
                .enter()
                    .append("g")
                        .attr("class", "arc");                

arcs.append("path")
    .attr("fill", function(d, i) {
        return color(i);
    })
    .attr("d", arc);

arcs.append("svg:text")
    .attr("transform", function(d) {
        return "translate(" + arc.centroid(d) + ")";
    })
    .attr("text-anchor", "middle")
    .text(function(d, i) {
        return dataset[i].borough + " (" + Math.round(dataset[i].percentage * 100, 0) + "%)";
    });