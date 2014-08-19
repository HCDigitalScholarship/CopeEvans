// ######### Setting up all of the global variables for the map ##########
var map = L.mapbox.map('map', 'mzarafonetis.idm8dak7')
    .setView([40,-40.50],4)
    .addControl(L.mapbox.geocoderControl('mzarafonetis.idm8dak7'));
    .on("zoomend", zoom) // this should be called when trying to filter down the lines
var person_filter = $("#person:hidden").text()
var STATIC_URL = $("#url:hidden").text()
var filterDict = {"age":[],"gender":[],"family":[],"transcript":[],"subject":[], "author":[person_filter],"date":[]};
var zoom_dict = {"Continent":{},"Country":{},"Subregion":{}, "State":{}};
var brush;
var places_data;
var letters_data;
// ################### End Global variables #########################

// ######## Load in all of the data that is needed for the map ######
d3.json(STATIC_URL+"json/letters.json", function(error, letters) {
    d3.json(STATIC_URL+"json/places.json", function(error, places) {
	places_data = places;
	letters_data = letters;
	filter();
    });
});
// ###################### End Data Load ##############################

// ####################### Functions #################################
function zoom() {
    var myZoom = map.getZoom(); // returns the current zoom level
    var filtered = checkFilter();
    if (filtered) {
	updateZoom("All");
    } else if (myZoom <= 3) {
	updateZoom("Continent");
    } else if (myZoom == 4) {
	updateZoom("Country");
    } else if (myZoom == 5) {
	updateZoom("Subregion");
    } else if (myZoom == 6) {
	updateZoom("State");
    } else if (myZoom >= 7) {
	updateZoom("All");
    }
}

function checkFilter() {
    var filterKeys = ["age","gender","family","transcript","subject","author","date"];
    for (var i=0; i<filterKeys.length; i++) {
	if (filterDict[filterKeys[i]].length > 0) {
	    console.log("Why here2: ", filterDict[filterKeys[i]])
	    return true;
	}
    }

    return false;
}

function updateZoom(area) {
    $("path").remove();
    if (!(area == "All")) {
	info_list = []
	var viewable = zoom_dict[area]
	var keys = Object.keys(viewable);
	for (var i=0; i<keys.length; i++) {
	    var places = keys[i].split("_");
	    if ((places[0] == "" || places[0] == " ") && (places[1] == "" || places[1] == " ")) {
		continue;
	    }
	    else if (places[0] == "" || places[0] == " ") {
		if (places[1] != undefined) {
		    places = [places[1]];
		}
		else {
		    continue;
		}
	    }
	    else if (places[1] == "" || places[1] == " ") {
		places = [places[0]];
	    }
	    // else places = places, we have two actual places
	    // This is a within group letter count
	    if (places.length == 1) {
		var name = places[0];
		var count = viewable[keys[i]];
		var latlng = findPlace(name);
		var geojsonMarkerOptions = {
		    radius:Math.sqrt(count),
		    fillColor: "#fff",
		    color: "#000",
		    weight: 1,
		    opacity: 1,
		    fillOpacity: 0.8,
		    title: name
		};
	    
		var circle = L.circleMarker(latlng,geojsonMarkerOptions).bindPopup(
		    "<h2>"+keys[i]+"</h2>Count: " + count.toString());
	    
		circle.addTo(map);
	    }
	    else if (places.length == 2) {
		var origin = places[0];
		var destination = places[1];
		var count = viewable[keys[i]];
		var or_latlng = findPlace(origin);
		var start = { x:or_latlng[0], y:or_latlng[1]};
		var dest_latlng = findPlace(destination);
		var end = { x:dest_latlng[0], y:dest_latlng[1]};
		var generator = new arc.GreatCircle(start, end, { name: origin});
		var line_arc = generator.Arc(100,{offset: 10, weight: count});
		var line_json = line_arc.json();
		var line = L.polyline(line_json.geometry.coordinates, {color: 'red', weight:Math.sqrt(count)}).addTo(map);
		info_list[line._leaflet_id] = "<h2>" + origin + " to " + destination + "</h2>Count: " + count.toString();
		
		line.on("click", function(e) {
		    openFancyBox(e.target._leaflet_id);
		});
	    }
	}
    }
    else {
	if ($("paths").length < 300) { // Condition is in here just to avoid redrawing the lines everytime the zoom changes when it is greater than 7
	    for (var i=0; i<places_data.length; i++) {
		var latlng = [parseFloat(places_data[i].Latitude),parseFloat(places_data[i].Longitude)]
		var geojsonMarkerOptions = {
		    radius:7,
		    fillColor: "#fff",
		    color: "#000",
		    weight: 1,
		    opacity: 1,
		    fillOpacity: 0.8,
		    title: places_data[i].Name
		};
	    
		var circle = L.circleMarker(latlng,geojsonMarkerOptions).bindPopup(
		    "<h2>"+places_data[i].Name+"</h2>");
	    
		circle.addTo(map);
	    }
	
	    info_list = [];
	    var counter_error = 0;
	    for (var j=0;j<travel_data.length;j++) {
		var origin = [parseFloat(places_data[travel_data[j].Poo].Latitude),parseFloat(places_data[travel_data[j].Poo].Longitude)];
		var destination = [parseFloat(places_data[travel_data[j].Dest].Latitude),parseFloat(places_data[travel_data[j].Dest].Longitude)];
		var latlngs = [origin,destination];
		var info = travel_data[j].Letter;
		try {
		    info = JSON.parse(info); }
		catch(err) {
		    counter_error++;
		    console.log("Error: ", err)
		    info = {"Transcript":"Wrong", "Title":"Wrong","Creator":"Wrong","Recipient":"Wrong"};
		}
		var t_Has = info.Transcript.split(" ").length;
		if (t_Has > 2) {
		    var line = L.polyline(latlngs, {color: 'green', weight:3}).addTo(map);
		}
		else {
		    var line = L.polyline(latlngs, {color: 'red', weight:3}).addTo(map);
		}
		var info_string = "<h2>"+info.Title.split("COMMA").join(",")+"</h2>";
		info_string = info_string + "Creator: " + info.Creator + "<br>";
		info_string = info_string + "Recipient: " + info.Recipient;
		info_string = info_string + "<br>Transcript: <br>" + info.Transcript.split("COMMA").join(",");
		info_list[line._leaflet_id] = info_string;
		line_info_dict[line._leaflet_id] = j;
		line_info_list[j] = info;
	    
		line.on('click', function(e) {
		    openFancyBox(e.target._leaflet_id);
		});
	    }
	
	    console.log("total errors: ", counter_error)
	    var all_paths = $("path.leaflet-clickable[stroke-opacity=\"0.5\"]");
	    for (var k=0;k<all_paths.length; k++) {
		$(all_paths[k]).attr("id","letter"+k.toString());
	    }   
	}
    }
}

function findPlace(name) {
    for (var k=0;k<places_data.length; k++) {
	if (places_data[k]["Name"] == name) {
	    var lat = parseFloat(places_data[k]["Latitude"]);
	    var lng = parseFloat(places_data[k]["Longitude"]);
	    return [lat,lng];
	}
    }
    console.log("Did not get anything for: ", name)
}

function openFancyBox(id) {
    console.log("Info list: ", info_list)
    console.log("id: ", id)
    $.fancybox.open(info_list[id]);
}
/*
The above two can be used to filter down the lines to make it less crowded
-possibly color based on the density of the lines
*/
d3.csv(STATIC_URL+"CSVs/map/partialCorrectLocations.csv", function(error, data) {
    d3.csv(STATIC_URL+"CSVs/map/letterSubregions.csv", function(error, travel) {
	places_data = data;
	travel_data = travel;
	console.log("travel",travel)
	console.log("data",data)
	for (var i=0; i<travel.length; i++) {
	    // Find the continent counts
	    if (travel[i]["poo_continent"] == travel[i]["dest_continent"]) {
		if (zoom_dict["Continent"][travel[i]["poo_continent"]]) {
		    zoom_dict["Continent"][travel[i]["poo_continent"]]++;
		}
		else {
		    zoom_dict["Continent"][travel[i]["poo_continent"]] = 1;
		    console.log(zoom_dict["Continent"][travel[i]["poo_continent"]])
		}
	    }
	    else {
		if (zoom_dict["Continent"][travel[i]["poo_continent"]+"_"+travel[i]["dest_continent"]]) {
		    zoom_dict["Continent"][travel[i]["poo_continent"]+"_"+travel[i]["dest_continent"]]++;
		}
		else {
		    zoom_dict["Continent"][travel[i]["poo_continent"]+"_"+travel[i]["dest_continent"]] = 1;
		}
	    }
	    // Find the country counts
	    if (travel[i]["poo_country"] == travel[i]["dest_country"]) {
		if (zoom_dict["Country"][travel[i]["poo_country"]]) {
		    zoom_dict["Country"][travel[i]["poo_country"]]++;
		}
		else {
		    zoom_dict["Country"][travel[i]["poo_country"]] = 1;
		}
	    }
	    else {
		if (zoom_dict["Country"][travel[i]["poo_country"]+"_"+travel[i]["dest_country"]]) {
		    zoom_dict["Country"][travel[i]["poo_country"]+"_"+travel[i]["dest_country"]]++;
		}
		else {
		    zoom_dict["Country"][travel[i]["poo_country"]+"_"+travel[i]["dest_country"]] = 1;
		}
	    }
	    // Find the subregion counts
	    if (travel[i]["poo_subregion"] == travel[i]["dest_subregion"]) {
		if (zoom_dict["Subregion"][travel[i]["poo_subregion"]]) {
		    zoom_dict["Subregion"][travel[i]["poo_subregion"]]++;
		}
		else {
		    zoom_dict["Subregion"][travel[i]["poo_subregion"]] = 1;
		}
	    }
	    else {
		if (zoom_dict["Subregion"][travel[i]["poo_subregion"]+"_"+travel[i]["dest_subregion"]]) {
		    zoom_dict["Subregion"][travel[i]["poo_subregion"]+"_"+travel[i]["dest_subregion"]]++;
		}
		else {
		    zoom_dict["Subregion"][travel[i]["poo_subregion"]+"_"+travel[i]["dest_subregion"]] = 1;
		}
	    }
	    // Find the state counts
	    if (travel[i]["poo_state"] == travel[i]["dest_state"]) {
		if (zoom_dict["State"][travel[i]["poo_state"]]) {
		    zoom_dict["State"][travel[i]["poo_state"]]++;
		}
		else {
		    zoom_dict["State"][travel[i]["poo_state"]] = 1;
		}
	    }
	    else {
		if (zoom_dict["State"][travel[i]["poo_state"]+"_"+travel[i]["dest_state"]]) {
		    zoom_dict["State"][travel[i]["poo_state"]+"_"+travel[i]["dest_state"]]++;
		}
		else {
		    zoom_dict["State"][travel[i]["poo_state"]+"_"+travel[i]["dest_state"]] = 1;
		}
	    }
	}

	console.log("zoom dict: ", zoom_dict)

	/*
	var all_paths = $("path.leaflet-clickable[stroke-opacity=\"0.5\"]");
	console.log(all_paths.length)
	for (var k=0;k<all_paths.length; k++) {
	    $(all_paths[k]).attr("id","letter"+k.toString());
	}
	
	function openFancyBox(id) {
	    $.fancybox.open(info_list[id]);
	}

	$(".filter-button").click(function(d) {
	    var name = d.currentTarget.id;
	    $("#options").empty();
	    showFilterOptions(name);
	});
	*/

	
	function showFilterOptions(name){
	    var filterNames = {"age":"Age","gender":"Gender","family":"Creator","transcript":"Transcript","subject":"Subject","author":"Author"};
	    var optionsBox = $("#options");
	    var filterOptions = {"age":["0-10","10-20","20-30","30-40","40-50","50-60","60-70","70-80","80-90","90-100"],
				 "gender":["M","F"],
				 "family":["Cope","Evans","Drinker","Stokes","Tyson","Other"],
				 "transcript":["Has Transcript","No Transcript"],
				 "subject":["travel","education","love","health","family","politics","lifestyle"]
				}
	    var myName = filterNames[name];
	    var myFilterOptions = filterOptions[name];
	    var counter = 0;
	    optionsBox.append("<div class=\"col\"><h2>Options:</h2></div>");
	    if (name == "author") {
		optionsBox.append("<div class=\"col\" id=\"authorSelect\">");
		var current =$("#authorSelect");
		current.append("<a href=\"pageRank.html\" data-fancybox-type=\"iframe\" class=\"people-select\"><div class=\"options-button\" id=\"AboutPR\">About the Network</div></a>");
		current.append("<a href=\"index.html\" data-fancybox-type=\"iframe\" id=\"authorsFrame\" class=\"people-select\"><div class=\"options-button\" id=\"selectAuthor\">Select authors</div></a>");
		updateNameBox();
		optionsBox.append("</div>");
	    }
	    else {
		for (var i=0; i<myFilterOptions.length; i++) {
		    if (i%3 == 0) {
			optionsBox.append("<div class=\"col\" id=\"optionCol"+counter.toString()+"\">");
			currentBox = $("#optionCol"+counter.toString());
			counter++;
		    }
		    currentBox.append("<div class=\"options-button\" id=\""+myFilterOptions[i]+"\">"+myFilterOptions[i]+"</div>")
		    var newItem = $("#"+myFilterOptions[i]);
		    if (filterDict[name].indexOf(myFilterOptions[i]) > -1) {
			newItem.css("background-color","yellow");
		    }
		    if (i%3 == 2) {
			optionsBox.append("</div>");
		    }
		}
	    }
	    $(".options-button").click(function(d) {
		var option = d.currentTarget.id;
		if ($(this).css("background-color") == "rgb(70, 130, 180)") {
		    $(this).css("background-color","yellow");
		    updateDict(name,option);
		    filterMap();
		}
		else {
		    $(this).css("background-color","steelblue");
		    updateDict(name,option);
		    filterMap();
		}
	    });
	}
	
	$(".filter-button").click(function(d) {
	    var name = d.currentTarget.id;
	    $("#options").empty();
	    showFilterOptions(name);
	});


	function updateDict(name,option) {
	    if (filterDict[name].indexOf(option) > -1) {
		var exclude = filterDict[name].indexOf(option);
		var newList = [];
		for (var i=0; i<filterDict[name].length; i++) {
		    if (i == exclude) {
			continue;
		    }
		    else {
			newList.push(filterDict[name][i]);
		    }
		}
		filterDict[name] = newList;
	    }
	    else {
		filterDict[name].push(option);
	   }
	}
    

	/*################# CODE TO CREATE THE CATEGORICAL FILTERS ABOVE #####################
	Variables I need from above:
	    -line_info_list

	###################### CODE TO CREATE THE TIMELINE BELOW ###########################*/
	
	// The call to the makeTimeline function will be needed on load, just easier to separate
	// into its own function, in case it needs to me moved

	function makeTimeline() {
	    var margin = {top: 0, right: 40, bottom: 50, left: 40},
		width = 960 - margin.left - margin.right,
		height = 100 - margin.top - margin.bottom;

	    var x = d3.time.scale()
		.domain([new Date(1819, 11, 1), new Date(1920, 1, 1) - 1])
		.range([0, width]);

	    brush = d3.svg.brush()
		.x(x)
		.extent([new Date(2013, 7, 2), new Date(2013, 7, 3)])
		.on("brush", brush)
		.on("brushstart",brushstarted);

	    var svg = d3.select("body").select("#footer").select("#timeline-inside").append("svg")
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
		var lines = $("path.leaflet-clickable[stroke-opacity=\"0.5\"]");
		
		filterDict["date"] = [startYear, endYear];
		filterMap();
	    }
	    
	    function brushstarted() {
		console.log("here");
	    }
	}

	makeTimeline();
	filterMap();
    });
});

function getYear(date_string) {
    date_list = date_string.split("-");
    return date_list[0];
}

function filterMap() {
    var filterNames = {"age":"Age of Author","gender":"Gender of Author","family":"Family","transcript":"Transcript","subject":"Subject","author":"Creator", "date":"Date"};
    var keys = ["age","gender","family","transcript","subject","author","date"];
    var lines= $("path.leaflet-clickable[stroke-opacity=\"0.5\"]");
    var keys_used = [];
    for (var i=0; i<keys.length; i++) {
	if(filterDict[keys[i]].length > 0) {
	    keys_used.push(keys[i]);
	}
    } 
    for (var j=0; j<lines.length; j++) {
	var shouldAdd = true;
	var line_json =line_info_list[j];
	var family = findFamily(line_json["Creator"])
	line_json["Family"] = family;
	for (var k=0; k<keys_used.length;k++) {
	    var keyAllGood = false;
	    var myKey = keys_used[k];
	    if (myKey == "date") {
		var myYear = getYear(line_json["Date"]);
		if (myYear > filterDict["date"][0] && filterDict["date"][1] > myYear) {
		    keyAllGood = true;
		}
	    }
	    else if (!(myKey == "transcript")) {
		for (var m=0; m<filterDict[myKey].length; m++) {
		    var myValue, keyValue;
		    if (myKey == "author") {
			myValue = line_json[filterNames[myKey]].split(" ").join("");
			myValue = myValue.split(":")[0]
			keyValue = filterDict[myKey][m].split(" ").join("");
		    }
		    // console.log("line_json: ", myValue)
		    // console.log("key: ", keyValue)
		    if (myValue == keyValue) {
			keyAllGood = true;
		    }
		}
	    }
	    else {
		if(line_json["Transcript"].split(" ").length < 2 && filterDict[myKey].indexOf("No Transcript") > -1) {
		    keyAllGood = true;
		}
		else if(line_json["Transcript"].split(" ").length >= 2 && filterDict[myKey].indexOf("Has Transcript") > -1) {
		    keyAllGood = true;
		}
		else {
		    keyAllGood = false;
		}
	    }
	    if (!keyAllGood) {
		shouldAdd = false;
	    }
	}

	if(shouldAdd) {
	    $(lines[j]).css("visibility","visible");
	}
	else {
	    $(lines[j]).css("visibility","hidden");
	}
    }
}

function findFamily(name) {
    var split_name = name.split(/(?=[A-Z])/);
    for (var i=0;i<split_name.length;i++) {
	split_name[i] = split_name[i].replace(/[^a-zA-z]/g,"");
    }

    var family_names = ["Cope","Evans","Drinker","Stokes","Tyson"];
    for (var i=split_name.length-1; i>=0; i--) {
	if (family_names.indexOf(split_name[i]) > -1) {
	    return split_name[i];
	}
    }

    return "Other";
}

function updateNameBox() {
    var names = filterDict["author"];
    var list = $("#peopleList");
    console.log("list: ", list.length);
    if (list.length == 0) {
	$("#options").append("<div class=\"col\" id=\"peopleList\" style=\"overflow-y:scroll;width:300px;height:120px;\">");
    }
    var myCol = $("#peopleList");

    for (var i=0; i<names.length; i++) {
	myCol.append(names[i].split(/(?=[A-Z])/).join(" ")+"<br>");
    }
    $("#options").append("</div>");
}
function closeIframe() {
    $.fancybox.close();
}

function clearBrush() {
    $('.extent').attr("width","0");
}

function resetFilters() {
    filterDict = {"age":[],"gender":[],"family":[],"transcript":[],"subject":[], "author":[],"date":[]};
    var options = $(".options-button").css("background-color","steelblue");
    clearBrush();
    filterMap();
    zoom();
}
