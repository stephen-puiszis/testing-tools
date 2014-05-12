function barChart(chartData) {
  $("#bar-chart > svg").remove();
  $("#bar-chart > h2").css({"display":"block"});

  var data = chartData;

  var w = 500,
      h = 350,
      barWidth = 40;
      marginTop = 20,
      marginBottom = 20,
      marginRight = 20,
      marginLeft = 20,
      extraMargin = 50,
      labelMargin = 5;

  var min = Infinity,
      max = -Infinity;

  var x = d3.scale.linear().domain([0, data.length]).range([0, w]);
  var y = d3.scale.linear().domain([0, d3.max(data, function(datum) { return datum.conversionRate; })]).
    rangeRound([0, h]);

  //Create Bar Chart
  var barChart = d3.select("#bar-chart")
    .append("svg:svg")
    .attr("width", w)
    .attr("height", h);

  //Create Bars
  barChart.selectAll("rect")
    .data(data)
    .enter()
    .append("svg:rect")
    .attr("x", function(datum, index)  { return x(index); })
    .attr("y", function(datum)         { return h - y(datum.conversionRate) - marginBottom; })
    .attr("height", function(datum)    { return y(datum.conversionRate); })
    .attr("width", barWidth)
    .attr("fill", "#2d578b");

//Create X-Axis Line
  barChart.selectAll("line.y")
       .data(y.ticks(1))
       .enter().append("svg:line")
       .attr("class", "y")
       .attr("x1", 0)
       .attr("x2", w)
       .attr("y1", h - marginBottom)
       .attr("y2", h - marginBottom)
       .attr("stroke-width",1)
       .attr("stroke", "#eee");

  //Create Labels
  barChart.selectAll("text")
    .data(data)
      .enter()
      .append("svg:text")
      .attr("x", function(datum, index)  { return x(index) + barWidth; })
      .attr("y", function(datum)         { return h - y(datum.conversionRate); })
      .attr("dx", -barWidth/2)
      .attr("dy", "1.2em")
      .attr("text-anchor", "middle")
      .text(function(datum) { return datum.conversionRate;})
      .attr("fill", "white");

  //Y-Axis
  barChart.selectAll("text.yAxis")
    .data(data)
      .enter().append("svg:text")
      .attr("x", function(datum, index) { return x(index) + barWidth; })
      .attr("y", h - labelMargin)
      .attr("dx", -barWidth/2)
      .attr("text-anchor", "middle")
      .text(function(datum) { return datum.name;})
      .attr("transform", "translate(0, 5)")
      .attr("class", "yAxis");
}
