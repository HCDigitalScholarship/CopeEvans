d3.json("/static/json/travel_map.json", function(error, travelers) {

var margin = {top: 0, right: 40, bottom: 50, left: 40},
    width = 960 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

var x = d3.time.scale()
    .domain([new Date(1819, 11, 1), new Date(1920, 1, 1) - 1])
    .range([0, width]);

var brush = d3.svg.brush()
    .x(x)
    .extent([new Date(2013, 7, 2), new Date(2013, 7, 3)])
    .on("brush", brushended)
    .on("brushstart",brushstarted);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("rect")
    .attr("class", "grid-background")
    .attr("width", width)
    .attr("height", height);

svg.append("g")
    .attr("class", "x grid")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(d3.time.years, 10)
        .tickSize(-height)
        .tickFormat(""))
  .selectAll(".tick")
    .classed("minor", function(d) { return d.getHours(); });

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .attr("stroke","white")
    .call(d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .ticks(d3.time.years,10)
      .tickPadding(0))
  .selectAll("text")
    .attr("x", 6)
    .style("text-anchor", null);

var gBrush = svg.append("g")
    .attr("class", "brush")
    .call(brush)
    .call(brush.event);

gBrush.selectAll("rect")
    .attr("height", height);

function brushended() {
  d3.selectAll("line").remove();
  d3.selectAll(".traveler").style("background-color", "white");
  
  if (!d3.event.sourceEvent) return; // only transition after input
  var extent0 = brush.extent(),
      extent1 = extent0.map(d3.time.year.round);

  // if empty when rounded, use floor & ceil instead
  if (extent1[0] >= extent1[1]) {
    extent1[0] = d3.time.year.floor(extent0[0]);
    extent1[1] = d3.time.year.ceil(extent0[1]);
  }
  
  var startYear = extent1[0].getFullYear();
  var endYear = extent1[1].getFullYear();
  var re = new RegExp("[0-9][0-9][0-9][0-9]")

  for (var i=0;i<travelers.length;i++) {
    for (var j=0; j<travelers[i].Trips.length; j++) {
	var year = re.exec(travelers[i].Trips[j].Date);
	if (year >= startYear && year <= endYear) {
	    var color = drawTrip(travelers[i].Trips[j].Place, travelers[i].id);
	    var person = d3.select("#person"+travelers[i].id);
	    person.style("background-color", color);
	}
    }
  }
    /*
  d3.select(this).transition()
      .call(brush.extent(extent1))
      .call(brush.event);
    */
}

function brushstarted() {
    var p = d3.select("#Travelers").selectAll(".traveler").style("background-color","white");
    d3.select("#usMap").selectAll("line").remove();
    d3.select("#europeMap").selectAll("line").remove();
}

});
