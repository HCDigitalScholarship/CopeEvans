d3.csv("/static/CSVs/year_letter.csv", function(error, data) {
    d3.csv("/static/CSVs/subject_year.csv", function(error, sub_data) {
    console.log("error message: ", error);
    console.log("Data: ", data)
    console.log("Sub Data: ", sub_data);
    
    var margin = {"top":10, "bottom":30,"right":0, "left":20};
    var width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

    var x = d3.time.scale()
        .domain([new Date(1800, 11, 1), new Date(1915,1,1) - 1 ])
	.range([0,width]);

    var y = d3.scale.linear()
	.domain([0, 120])
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
	    .attr("y", function(d) { return y(d.letters); })
	    .attr("height", function(d) { return height - y(d.letters)})
	    .attr("title", function(d) { return d.year; })
	    .on("mouseover", function(d) {
		var text = "Year: " + d.year + "<br>";
		text = text + "Letters: " + d.letters;
		d3.select("#year").html(text);
	    });
    }
    
    $(document).ready(function() {
	$("#selectMe").click(function() {
	    var subject = $("#selectMe").find(":selected").text();
	    changeGraph(subject);
	});
    });

    function changeGraph(subject) {
	if (subject == "All") {
	    renderGraph(data);
	}
	else {
	    var toRender = [];
	    for(var i=0; i<sub_data.length; i++) {
		var year = sub_data[i]["year"];
		var count = sub_data[i][subject];
		toRender.push({"year":year,"letters":count});
	    }
	    renderGraph(toRender);
	}
    }
    
    renderGraph(data);
});
});
