var map = L.mapbox.map('map', 'mzarafonetis.idm8dak7')
    .setView([40,-40.50],4)
    .addControl(L.mapbox.geocoderControl('mzarafonetis.idm8dak7'));

d3.csv("/static/CSVs/travel_coordinates.csv", function(error, data) {
    d3.json("/static/json/travel_map.json", function(error2, travels) {
	console.log("errors: ", error2)
	console.log("Travels: ", travels)
	for (var i=0; i<data.length; i++) {
	    var latlng = [parseFloat(data[i].latitude),parseFloat(data[i].longitude)]
	    var geojsonMarkerOptions = {
		radius:7,
		fillColor: "#fff",
		color: "#000",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.8,
		title: data[i].place
	    };
	    
	    var circle = L.circleMarker(latlng,geojsonMarkerOptions).bindPopup(
		"<h2>"+data[i].place+"</h2>");
	    
	    circle.addTo(map);
	}
	/*
	This is used to show all of the lines, which is not necessarily what
	is needed right now. Need to make the decision for later on

	for (var j=0; j<travels.length; j++) {
	    var trips = travels[j]["Trips"];
	    for (var k=0; k<trips.length; k++) {
		var start = [39.9500,-75.1667];
		var end = findLocation(trips[k]["Place"]);
		if (end) {
		    var latlngs = [start,end];
		    var line = L.polyline(latlngs, {color: 'green', weight:3}).addTo(map);
		}
	    }
	}
	*/
	function findLocation(place) {
	    place = place.split(/(?=[A-Z])/);
	    for (var i=0; i<data.length; i++) {
		if (data[i].place.indexOf(place[0]) > -1) {
		    return [parseFloat(data[i].latitude),parseFloat(data[i].longitude)];
		}
	    }
	    console.log("Didn't find a match")
	}

	//////////// Now adding in the people //////////////
	for (var i=0; i<travels.length; i++) {
	    $("#people").append("<div id=\"person_"+travels[i].id+"\" class=person>"+travels[i].Person+"</div>");
	}
	//////////// Adding in the Timeline ////////////////
	addTimeline();
	///////////// Filtering people ////////////////////

	var colorPeople = d3.scale.category20();

	$(document).ready(function() {
	    $(".person").click(function() {
		$(this).toggleClass("selected");
		var id = $(this).attr("id");
		id = id.split("_")[1];
		var color = colorPeople(id);
		if ($(this).hasClass("selected")) {
		    $(this).css("background-color",color);
		    showLines(id, color);
		}
		else {
		    $(this).css("background-color","white");
		    hideLines(id, color);
		}
	    });
	});

	function showLines(id, c) {
	    for (var i=0; i<travels.length; i++) {
		if (travels[i]["id"] == id) {
		    for (var j=0; j< travels[i]["Trips"].length; j++) {
			var start = [39.9500,-75.1667];
			var end = findLocation(travels[i]["Trips"][j]["Place"]);
			if (end) {
			    var latlngs = [start,end];
			    var line = L.polyline(latlngs, {color: c, weight:3}).addTo(map);
			}
		    }
		    return null;
		}    

	    }
	}

	function showTrip(id,trip,color) {
	    var start = [39.9500,-75.1667];
	    var end = findLocation(travels[id]["Trips"][trip]["Place"]);
	    if (end) {
	        var latlngs = [start,end];
	        var line = L.polyline(latlngs, {color: color, weight:3}).addTo(map);
	    }
	}

	function hideLines(id, color) {
	    var lines = $("#map  path");
	    for (var i=0; i<lines.length; i++) {
		var temp_stroke = lines[i].outerHTML.split("stroke=\"")[1];
		temp_stroke = temp_stroke.split("\"")[0];
		if (temp_stroke == color) {
		    lines[i].remove();
		}
	    }
	}

	function addTimeline() {
	    var margin = {top: 0, right: 40, bottom: 50, left: 40},
		width = 960 - margin.left - margin.right,
		height = 100 - margin.top - margin.bottom;

	    var x = d3.time.scale()
		.domain([new Date(1819, 11, 1), new Date(1920, 1, 1) - 1])
		.range([0, width]);

	    var brush = d3.svg.brush()
		.x(x)
		.extent([new Date(2013, 7, 2), new Date(2013, 7, 3)])
		.on("brush", brush)
		.on("brushstart",brushstarted);

	    var svg = d3.select("#timeline").append("svg")
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

	    function brush() {
		$("path[stroke-width|=3]").remove();
		$(".person").css("background-color","white");
	  
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

		for (var i=0;i<travels.length;i++) {
		    for (var j=0; j<travels[i].Trips.length; j++) {
			var year = re.exec(travels[i].Trips[j].Date);
			if (year >= startYear && year <= endYear) {
			    var color = colorPeople(travels[i].id);
			    showTrip(travels[i].id, j, color);
			    var person = $("#person_"+travels[i].id);
			    person.css("background-color", color);
			}
		    }
		}
	    }

	    function brushstarted() {
		$(".person").css("background-color","white");
		$("path[stroke-width|=3]").remove();
	    }
	}
    });
});
