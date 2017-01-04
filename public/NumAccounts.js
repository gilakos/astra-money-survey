var margin = { top: 50, right: 300, bottom: 50, left: 50 },
    outerWidth = 1300,  //should check width and height for all screens, maybe use %?
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();

var xCat = "age",
    yCat = "numaccts";

var socket = io();
    socket.on('graph_data_0', function(data, error) {   //grabs live typeform data
  data.data.forEach(function(d) {  //data.data is used everywhere because 'data' is the object name, with many children nodes, 
    d.age = +d.age;                    //one of which is (inconveniently) called 'data', which is the object we need to work with
    gender = +d.gender;     //not sure why this one can't be d.gender, but it won't recognize later if it is
    d.numaccts = +d.numaccts;
  });

  var xMax = d3.max(data.data, function(d) { return d[xCat]; }) * 1.05,  //xCat is simply "age" in object, 1.05 may need to be removed
      xMin = d3.min(data.data, function(d) { return d[xCat]; }),
      xMin = xMin > 0 ? 0 : xMin,                                     //checking for negative values
      yMax = d3.max(data.data, function(d) { return d[yCat]; }) * 1.05,
      yMin = d3.min(data.data, function(d) { return d[yCat]; }),
      yMin = yMin > 0 ? 0 : yMin;

  x.domain([xMin, xMax]);  //this may not be necessary
  y.domain([yMin, yMax]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width);

  var color = d3.scale.category10();

  var tip = d3.tip()     //tip, when used, is for the hover that shows the values of each node
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat];
      });

  var zoomBeh = d3.behavior.zoom()    //for scaling the zoom correctly 
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on("zoom", zoom);

  var svg = d3.select("#NumAccounts")  //adding the svg (d3) body to the NumAccounts id on index.html
    .append("svg")                     //this allows the svg body to be dynamic when zooming, not creating a static svg body
      .attr("width", outerWidth)
      .attr("height", outerHeight)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")") 
      .call(zoomBeh);

  svg.call(tip); 

  svg.append("rect")
      .attr("width", width)
      .attr("height", height);

  svg.append("g")
      .classed("x axis", true)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .classed("label", true)
      .attr("x", width)
      .attr("y", margin.bottom - 10)
      .style("text-anchor", "end")
      .text("Age");

  svg.append("g")
      .classed("y axis", true)
      .call(yAxis)
    .append("text")
      .classed("label", true)
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Num Accounts");

  var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);

  objects.append("svg:line")
      .classed("axisLine hAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("transform", "translate(0," + height + ")");

  objects.append("svg:line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);

  objects.selectAll(".dot")
      .data(data.data)
    .enter().append("circle")
      .classed("dot", true)
      .attr("r", 6)
      .attr("transform", transform)
      .style("fill", function(d){       //setting the color for man vs woman
            if(d.gender == "Female") {  //if the gender var above is set as d.gender, this returns "NAN", not sure why
                return "hotpink"; 
        }
        else 
            return "blue";
    })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

  var legend = svg.selectAll(".legend")   //for a key on the right end, may not be necessary for us.
      .data(color.domain())
    .enter().append("g")
      .classed("legend", true)
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("circle")
      .attr("r", 6)
      .attr("cx", width + 20)
      .attr("fill", color);

  legend.append("text")
      .attr("x", width + 26)
      .attr("dy", ".35em")
      .text(function(d) { return d; });

  d3.select("input").on("click", change);

  function change() {   //allows the graph to be dynamic
    xCat = "age";
    xMax = d3.max(data.data, function(d) { return d[xCat]; });
    xMin = d3.min(data.data, function(d) { return d[xCat]; });

    zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

    var svg = d3.select("#NumAccounts").transition();

    svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCat);

    objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
  }

  function zoom() {  
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
        .attr("transform", transform);
  }

  function transform(d) {
    return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
  }
});