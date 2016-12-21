var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// d3.json("views/data.json", function(error, data) {
var socket = io();
    socket.on('graph_data_0', function(data, error) {
    console.log('in numaccounts');
    // console.log(data.data[1].gender);

    if (error) throw error;

    data.data.forEach(function(d) {
        d.age = +d.age;
        gender = +d.gender;     //not sure why this one can't be d.gender, but it won't recognize later if it is
        d.numaccts = +d.numaccts;
    });

    x.domain(d3.extent(data.data, function(d) { return d.age; })).nice();
    y.domain(d3.extent(data.data, function(d) { return d.numaccts; })).nice();

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Age");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Num Accounts")

    svg.selectAll(".dot")
        .data(data.data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.age); })
        .attr("cy", function(d) { return y(d.numaccts); })
        .style("fill", function(d){
            if(d.gender == "Female") {  //if the gender var above is set as d.gender, this returns "NAN", not sure why
                return "hotpink"; 
            }
            else 
                return "blue";
        })
        // .style("fill", "blue")

    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
});