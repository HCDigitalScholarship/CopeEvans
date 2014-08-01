var svg = d3.select("body").append("svg")
	.attr("width",470)
	.attr("height",599)
	.attr("id","usMap")
	.style("background","url('/static/images/other_images/easternUSMapClean.png')");

var svg2 = d3.select("body").append("svg")
	.attr("width",492)
	.attr("height",596)
	.attr("id","europeMap")
	.style("background","url('/static/images/other_images/blank_europe_map.gif')");

for (var i=0; i<data.length; i++) {
	if (data[i].map == "us") {
	svg.append("circle")
		.attr("cx",data[i].x)
		.attr("cy",data[i].y)
		.attr("r", 3)
		.style("fill","black")
		.attr("title",data[i].name);
	}
	else if (data[i].map == "europe") {
	svg2.append("circle")
		.attr("cx",data[i].x)
		.attr("cy",data[i].y)
		.attr("r", 3)
		.style("fill","black")
		.attr("title",data[i].name);
	}
}

var colorPeople = d3.scale.category20();
var peoplesColor = [];

d3.json("/static/json/travel_map.json", function(error, travelers) {
	console.log(travelers);
	var trav_box = d3.select("body").select("#Travelers").selectAll("div")
	.data(travelers)
	.enter()
	.append("div");
	
	var travelers_selected = [];

	for (var i=0; i<travelers.length;i++) {
	travelers_selected.push(false);
	}
	// This is to let me access the right people's colors from
	// Brush.js
	for (var i=0;i<travelers.length; i++) {
	     peoplesColor.push(colorPeople(travelers[i].id))
	}
	
	trav_box.text(function(d) { return d.Person })
	.attr("id", function(d) { return "person"+d.id})
	.attr("class", "traveler")
	.on("click", function(d) {
	    var me = d3.select(this)
	    var color = peoplesColor[parseInt(d.id)];
	    if (travelers_selected[d.id]){
		me.style("background-color", "white");
		travelers_selected[d.id] = false;
		var my_lines =d3.select("body").selectAll(".class_"+d.id).remove();
	    }
	    else {
		me.style("background-color", color);
		travelers_selected[d.id] = true;
		for(var j=0;j<d.Trips.length;j++) {
		    drawTrip(d.Trips[j].Place, d.id);   
		}
	    }

	});
});

function drawTrip(place, id) {
	var c = "class_"+id;
	var origin_object;
	var color = peoplesColor[parseInt(id)];
	var destination_object = lookup_place(place);
	if (destination_object != undefined) {
	    if (destination_object.map == "us") {
		origin_object = lookup_place("Philadelphia")
		d3.select("#usMap").append("line")
		.attr("x1", origin_object.x)
		.attr("y1", origin_object.y)
		.attr("x2", destination_object.x)
		.attr("y2", destination_object.y)
		.attr("stroke-width", 2)
		.attr("stroke", color)
		.attr("class", c);
	    }   
	    else {
	    origin_object = {"x":0,"y":300};
		d3.select("#europeMap").append("line")
		   .attr("x1", origin_object.x)
		.attr("y1", origin_object.y)
		.attr("x2", destination_object.x)
		.attr("y2", destination_object.y)
		.attr("stroke-width", 2)
		.attr("stroke", color)
		.attr("class", c);
	    }
	}
	return color;
}

function lookup_place(place) {
    for (var i=0;i<data.length;i++) {
	if (place == data[i].name) {
		return data[i];
	}
    }

    return undefined;
}

