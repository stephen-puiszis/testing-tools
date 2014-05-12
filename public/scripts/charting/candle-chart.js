function candleChart(chartData) {
  $("#candle-chart > svg").remove();
  $("#candle-chart > h2").css({"display":"block"});
  data = chartData;

  var w = 500,
      h = 350,
      marginTop = 25,
      marginBottom = 25,
      marginRight = 25,
      marginLeft = 25,
      extraMargin = 50,
      labelMargin = 40;

  var chart = d3.select("#candle-chart")
                .append("svg:svg")
                  .attr("class", "chart")
                  .attr("width", w)
                  .attr("height", h);

  var y = d3.scale.linear()
            .domain([
              d3.min(data.map(function(d) {return d.lowInterval  * 0.75;})),
              d3.max(data.map(function(d) {return d.highInterval * 1.05 ;}))])
            .range([h, 0]);

  var x = d3.scale.linear()
            .domain([0, data.length]).range([0, w]);

  // Add Chart Lines
  chart.selectAll("line.y")
       .data(y.ticks(10))
       .enter().append("svg:line")
       .attr("class", "y")
       .attr("x1", 0)
       .attr("x2", w - extraMargin)
       .attr("y1", y)
       .attr("y2", y)
       .attr("stroke-width",1)
       .attr("stroke", "#eee");

  // Add Y-Axis Labels to Lines
  chart.selectAll("text.yrule")
      .data(y.ticks(10))
      .enter().append("svg:text")
      .attr("class", "yrule")
      .attr("x", w - labelMargin)
      .attr("y", y)
      .attr("dy", 5)
      .attr("dx", 15)
      .attr("text-anchor", "middle")
      .text(String);

  //Main Line
  chart.selectAll("line.stem")
      .data(data)
      .enter().append("svg:line")
      .attr("class", "stem")
      .attr("x1", function(d) { return x(data.indexOf(d) ) + 5;})
      .attr("x2", function(d) { return x(data.indexOf(d) ) + 5;})
      .attr("y1", function(d) { return y(d.lowInterval); })
      .attr("y2", function(d) { return y(d.highInterval);})
      .attr("stroke-width",10)
      .attr("stroke", "green");

  //Midpoint
  chart.selectAll("line.tick")
        .data(data)
        .enter().append("svg:line")
        .attr("class", "tickmark")
        .attr("x1", function(d) { return x(data.indexOf(d) * 1.05) + 5;})
        .attr("x2", function(d) { return x(data.indexOf(d) * 0.95) + 5;})
        .attr("y1", function(d) { return y(d.conversionRate);})
        .attr("y2", function(d) { return y(d.conversionRate);})
        .attr("stroke-width",3)
        .attr("stroke", "#555");

  //High Interval
  chart.selectAll("line.tick")
        .data(data)
        .enter().append("svg:line")
        .attr("class", "tickmark")
        .attr("x1", function(d) { return x(data.indexOf(d) * 1.05) + 5;})
        .attr("x2", function(d) { return x(data.indexOf(d) * 0.95) + 5;})
        .attr("y1", function(d) { return y(d.highInterval); })
        .attr("y2", function(d) { return y(d.highInterval);})
        .attr("stroke-width",3)
        .attr("stroke", "#888");
  //Low Interval
  chart.selectAll("line.tick")
        .data(data)
        .enter().append("svg:line")
        .attr("class", "tickmark")
        .attr("x1", function(d) { return x(data.indexOf(d) * 1.05) + 5;})
        .attr("x2", function(d) { return x(data.indexOf(d) * 0.95) + 5;})
        .attr("y1", function(d) { return y(d.lowInterval); })
        .attr("y2", function(d) { return y(d.lowInterval);})
        .attr("stroke-width",3)
        .attr("stroke", "#888");

  // NOT WORKING EITHER
  // chart.selectAll("text.xrule")
  //      .data(data.length)
  //      .enter().append("svg:text")
  //      .attr("class", "xrule")
  //      .attr("x", x)
  //      .attr("y", h - margin)
  //      .attr("dy", 20)
  //      .attr("text-anchor", "middle")
  //      .text(function(d){ return d.name; });

  // Add Category Labels - THIS IS NOT WORKING
  // chart.selectAll("text.xAxis")
  //     .data(data)
  //     .enter().append("svg:text")
  //     .attr("x", function(d) { return x(data.indexOf(d) ) + 5;})
  //     .attr("y", y)
  //     .attr("dx", 5)
  //     .attr("dx", "1.2em")
  //     .attr("text-anchor", "middle")
  //     .text(function(d) { return d.name;})
  //     .attr("transform", "translate(0, 5)")
  //     .attr("class", "yAxis");


}
