var margin = {top: 20, right: 20, bottom: 150, left: 60},
    width = 400,
    height = 600;

var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
var y = d3.scale.linear()
    .domain([0, 40])
    .range([height, 0]);
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(8);
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
d3.csv("/static/CSVs/d3practice.csv", function(error, data) {
    data.forEach(function(d) {
        d.Symptom = d.Symptom;
        d.Number = d.Number;
    });
	
  x.domain(data.map(function(d) { return d.Symptom; }));
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .attr("stroke", "white")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" )
      .style("font-size", "20px")
      .style("fill", "white");

  svg.append("g")
      .attr("class", "y axis")
      .attr("stroke", "white")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("dx", "-10em")
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .text("Number of Symptoms")
      .style("font-size", "20px")
      .style("font-family", "arial")
      .style("fill", "white");

  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d) { return x(d.Symptom); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.Number); })
      .attr("height", function(d) { return height - y(d.Number); });
});