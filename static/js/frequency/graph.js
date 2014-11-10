var data = $("#info:hidden").text();
data = JSON.parse(data);
//#####################THIS IS A HACK, NEED TO FIX ENTRY IN DATABASE###########
//Not exactly sure how to record this letter at the moment, so did a quick hack to fix it
var person = $("#person-name:hidden").text();
console.log("person:",person)
if (person == "22"){
    data.splice(46,1);
}
//############## END HACK ###################################
console.log("data: ", data)
var max_count = 0;
for (var i=0; i<data.length; i++) {
    console.log(data[i].count)
    if (data[i].count > max_count) {
	max_count = data[i].count;
    }
}

console.log(max_count)

var margin = {"top":10, "bottom":30,"right":0, "left":20};
var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.time.scale()
    .domain([new Date(1780, 11, 1), new Date(1915,1,1) - 1 ])
    .range([0,width]);

var y = d3.scale.linear()
    .domain([0, max_count])
    .range([height,0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(d3.time.years, 10)
    .tickSize(5)
    .tickFormat(d3.time.format("%Y"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var barWidth =  width/data.length;

var chart = d3.select("#graph")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
	.attr("transform", "translate("+margin.left+","+margin.top+")")
	.attr("id", "actualGraph");


function renderGraph(data) {
    d3.select("#actualGraph").remove();

    var chart = d3.select("#graph")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	    .attr("transform", "translate("+margin.left+","+margin.top+")")
	    .attr("id", "actualGraph");

    chart.append("g")
	.attr("class","x axis")
	.attr("transform", "translate("+margin.left+","+height+")")
	.call(xAxis)
	.selectAll(".tick")
	    .classed("minor", function(d) { return d.getHours(); });

    chart.append("g")
	.attr("class","y axis")
	.attr("transform", "translate(10,0)")
	.call(yAxis)

    chart.selectAll(".bar")
	.data(data)
      .enter().append("rect")
	.attr("class", "bar")
	.attr("x", function(d) {
	    if (!(isNaN(x(new Date(d.year, 1, 1))))) {
		return x(new Date(d.year, 1, 1))+margin.left;
	    }   
	    else {
		return -100;
	    }
	})
	.attr("width", 4)
	.attr("y", function(d) { return y(d.count); })
	.attr("height", function(d) { return height - y(d.count)})
	.attr("title", function(d) { return d.year; })
	.on("mouseover", function(d) {
	    var text = "Year: " + d.year + "<br>";
	    text = text + "Letters: " + d.count;
	    d3.select("#year").html(text);
	});
}

renderGraph(data);
