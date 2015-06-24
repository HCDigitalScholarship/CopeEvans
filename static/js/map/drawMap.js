// ######### Setting up all of the global variables for the map ##########
var map = L.mapbox.map('map', 'mzarafonetis.idm8dak7')
    .setView([40,-40.50],4)
    .addControl(L.mapbox.geocoderControl('mzarafonetis.idm8dak7'))
    .on("zoomend", zoom); // this should be called when trying to filter down the lines
var person_filter = parseInt($("#person:hidden").text());
var STATIC_URL = $("#url:hidden").text()
var filterDict = {"age":[],"gender":[],"family":[],"transcript":[],"subject":[], "author":[],"date":[]};
// Change the below to determine how thick each of the letter lines is
var line_thickness = 5;
// If there is a Person selected initially, set that person to be drawn
if (person_filter != "" && !(isNaN(person_filter))) { filterDict["author"] = [person_filter]; }
// var zoom_dict = {"Continent":{},"Country":{},"Subregion":{}, "State":{}};
console.log("filter dict: ", filterDict)
var info_list = [];
var brush;
var places_data;
var letters_data;
var people_data;
// ################### End Global variables #########################

// ######## Load in all of the data that is needed for the map ######
d3.json(STATIC_URL+"json/letters.json", function(error, letters) {
    d3.json(STATIC_URL+"json/places.json", function(error, places) {
	d3.json(STATIC_URL+"json/people.json", function(error, people) {
	    places_data = places;
	    letters_data = letters;
	    people_data = people;
	    console.log("places data: ", places_data)
	    console.log("letters data: ", letters_data)
	    console.log("people data: ", people_data)
	    // Functions to call once data has been loaded
	    makeTimeline();
	    zoom();
	    // End initial function calls
	});
    });
});
// ###################### End Data Load ##############################

// ####################### FUNCTIONS #################################

// ################## Start Zoom Functions ###########################
function zoom() {
    var myZoom = map.getZoom(); // returns the current zoom level
    var filtered = checkFilter();
    if (filtered) {
	updateZoom("All");
    } else if (myZoom <= 3) {
	updateZoom("continent");
    } else if (myZoom == 4) {
	updateZoom("country");
    } else if (myZoom == 6 || myZoom == 5) {
	updateZoom("state");
    } else if (myZoom >= 7) {
	updateZoom("All");
    }
}

function checkFilter() {
    var filterKeys = ["age","gender","family","transcript","subject","author","date"];
    for (var i=0; i<filterKeys.length; i++) {
	if (filterDict[filterKeys[i]].length > 0) {
	    return true;
	}
    }

    return false;
}

function updateZoom(area) {
    $("path").remove(); // Clear the map of previous lines
    var keys_used = getKeysUsed();
    if (area != "All" && keys_used.length == 0) {
	between_list = {};
	withIn_list = {};
	unkown = [];
	for (var i=0; i<letters_data.length; i++) {
	    var origin = places_data[letters_data[i]["origin_id"]];
	    try {
		var origin_place = origin[area]; 
		var origin_id = origin["id"];}
	    catch(err) { continue;}
	    var destination = places_data[letters_data[i]["destination_id"]];
	    try {var destination_place = destination[area]; 
		var destination_id = destination["id"];}
	    catch(err) { continue; }
	    if (origin_place == destination_place) {
		try{ withIn_list[origin_place].push(letters_data[i]); }
		catch(err) { withIn_list[origin_place] = [letters_data[i]]; }
	    }
	    else {
		var path = origin_place.toString() + "_" + destination_place.toString();
		try{ between_list[path].push(letters_data[i]); }
		catch(err) { between_list[path] = [letters_data[i]]; }
	    }
	    // else { unknown.push(letters_data[i]); }
	}
	drawZoom(between_list, withIn_list);
    }
    else { filterMap(); }
}

function drawZoom(between_list, withIn_list) {
    var paths = Object.keys(between_list);
    var nodes = Object.keys(withIn_list);
    var regions = [
    // State Level
    {"name":"Rhode Island","latitude":41.637513 ,"longitude":-71.477051 },
    {"name":"Maryland","latitude":39.290468 ,"longitude":-76.596680 },
    {"name":"Pennsylvania","latitude":40.069008 ,"longitude":-75.492554 },
    {"name":"Michigan","latitude":42.372242 ,"longitude":-84.375000 },
    {"name":"New York","latitude":42.905645 ,"longitude":-75.212402 },
    {"name":"Virginia","latitude":37.297544 ,"longitude":-78.508301 },
    {"name":"Leinster","latitude":53.271270 ,"longitude":-7.382813 },
    {"name":"?le-de-France","latitude":48.74418 ,"longitude":2.416992 },
    {"name":"Massachusetts","latitude":42.349156 ,"longitude":-72.125244 },
    {"name":"Tennessee","latitude":35.761558 ,"longitude":-85.605469 },
    {"name":"Iowa","latitude":41.766190 ,"longitude":-93.251953 },
    {"name":"Toscana","latitude":43.587106 ,"longitude":10.931396 },
    {"name":"New Jersey","latitude":39.991325 ,"longitude":-74.531250 },
    {"name":"District of Columbia","latitude":38.907465 ,"longitude":-77.052612 },
    {"name":"England","latitude":52.534185 ,"longitude":-1.428223 },
    {"name":"West Virginia","latitude":38.597017 ,"longitude":-80.529785 },
    {"name":"Provence-Alpes-C?te d'Azur","latitude":43.418515 ,"longitude":6.525879 },
    {"name":"Lazio","latitude":41.852557 ,"longitude":12.463989 },
    {"name":"Gen?ve","latitude":46.480901 ,"longitude":6.262207 },
    {"name":"Regi?o Aut?noma da Madeira","latitude":32.721877 ,"longitude":-16.924438 },
    {"name":"Delaware","latitude":38.812694 ,"longitude":-75.487061 },
    {"name":"Maine","latitude":44.804250 ,"longitude":-69.213867 },
    {"name":"Zuid-Holland","latitude":52.024402 ,"longitude":4.383545 },
    {"name":"South Carolina","latitude":33.777720 ,"longitude":-80.584717 },
    {"name":"Florida","latitude":28.359381 ,"longitude":-81.760254 },
    {"name":"Veneto","latitude":45.578484 ,"longitude":12.128906 },
    {"name":"New Hampshire","latitude":43.959955 ,"longitude":-71.477051 },
    {"name":"Scotland","latitude":56.884064 ,"longitude":-4.031982 },
    {"name":"Vermont","latitude":43.705112 ,"longitude":-72.817383 },
    {"name":"North Carolina","latitude":35.529432 ,"longitude":-78.442383 }, 
    {"name":"Ohio","latitude":40.075444 ,"longitude":-82.617188 },
    {"name":"Z?rich","latitude":47.240783 ,"longitude":8.338623 },
    {"name":"Louisiana","latitude":30.861563 ,"longitude":-92.219238 },
    {"name":"Georgia","latitude":32.154106 ,"longitude":-82.463379 },
    {"name":"Quebec","latitude":46.402829 ,"longitude":-74.399414 },
    {"name":"Indiana","latitude":39.870750 ,"longitude":-86.176758 },
    // Country Level
    {"name":"United States","latitude":39.735706 ,"longitude":-76.289063 },
    {"name":"Ireland","latitude":52.999496 ,"longitude":-7.800293 },
    {"name":"France","latitude":46.584350 ,"longitude":2.548828 },
    {"name":"United Kingdom","latitude":53.770631 ,"longitude":-1.582031 },
    {"name":"Italy","latitude":42.903131 ,"longitude":12.172852 },
    {"name":"Switzerland","latitude":46.722447 ,"longitude":8.041992 },
    {"name":"Portugal","latitude":39.056517 ,"longitude":-8.393555 },
    {"name":"Netherlands","latitude":51.994183 ,"longitude":5.625000 },
    {"name":"Canada","latitude":47.512563 ,"longitude":-78.750000 },
    // Continent Level
    {"name":"North America","latitude":39.735706 ,"longitude":-76.289063 },
    {"name":"Europe","latitude":53.770631 ,"longitude":-1.582031},
    {"name":"Africa","latitude":25.866638 ,"longitude":-12.568359},
    ];
    // Create all of the nodes for specific places
    for (var i=0; i<nodes.length; i++) {
	var name = nodes[i];
	var count = withIn_list[nodes[i]].length;
	var node = findNode(nodes[i],regions);
	var latlng = [node.latitude,node.longitude];
	var geojsonMarkerOptions = {
	    radius:Math.sqrt(count) + 10,
	    fillColor: "#fff",
	    color: "#000",
	    weight: 1,
	    opacity: 1,
	    fillOpacity: 0.8,
	    title: name
	};
	    
	var circle = L.circleMarker(latlng,geojsonMarkerOptions).bindPopup(
	    "<h2>"+nodes[i]+"</h2>Count: " + count.toString());
    
	circle.addTo(map);
    }
    // Create all of the paths for between place letters
    for (var j=0; j<paths.length; j++) {
	var origin = paths[j].split("_")[0];
	var destination = paths[j].split("_")[1];
	if (origin == "" || destination == "" ) {
	    continue;
	}
	var count = between_list[paths[j]].length;
	var or_node = findNode(origin, regions);
	var or_latlng = [or_node.latitude, or_node.longitude];
	var dest_node = findNode(destination, regions);
	var dest_latlng = [dest_node.latitude, dest_node.longitude];
	var circle = L.circleMarker(or_latlng,{fillColor:"white",stroke:"black",radius:3}).bindPopup(
	    "<h2>"+or_node.name+"</h2>");
	circle.addTo(map);
	var circle2 = L.circleMarker(dest_latlng,{fillColor:"white",stroke:"black",radius:3}).bindPopup(
	    "<h2>"+dest_node.name+"</h2>");
	circle2.addTo(map);
	var line;
	if (or_latlng[1] >-90 && dest_latlng[1] > -90) {
	    var start = { x:or_latlng[0], y:or_latlng[1]};
	    var end = { x:dest_latlng[0], y:dest_latlng[1]};
	    var generator = new arc.GreatCircle(start, end, { name: origin});
	    var line_arc = generator.Arc(100,{offset: 10, weight: count});
	    var line_json = line_arc.json();
	    line = L.polyline(line_json.geometry.coordinates, {color:'rgb(47, 53, 77)', weight:Math.sqrt(count)}).addTo(map);
	} else {
	    line = L.polyline([or_latlng,dest_latlng], {color:'rgb(47, 53, 77)', weight:Math.sqrt(count)}).addTo(map);
	}

	info_list[line._leaflet_id] = "<h2>" + or_node.name + " to " + dest_node.name + "</h2>Count: " + count.toString();
	
	line.on("click", function(e) {
	    openFancyBox(e.target._leaflet_id);
	});
    }
}

function findNode(place, regions) {
    for (var i=0; i<regions.length; i++) {
	if (place == regions[i].name) {
	    return regions[i];
	}
    }
    console.log("did'nt get: ", place);
    return regions[0];
}
// ######################### End Zoom Functions ##########################

// ###################### Start Filter Functions #########################
// Finds the information associated with the clicked line and shows it in a fancybox
$(document).ready(function() {
    $(".filter-button").click(function(d) {
	var name = d.currentTarget.id;
	$("#options").empty();
	showFilterOptions(name);
    });
});

function openFancyBox(id) {
    $.fancybox.open(info_list[id]);
}

// When a filter is selected, chooses how to display them
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
	current.append("<a href=\"/pageRank/info/\" data-fancybox-type=\"iframe\" class=\"people-select\"><div class=\"options-button-null\" id=\"AboutPR\">About the Network</div></a>");
	current.append("<a href=\"/PageRank/\" data-fancybox-type=\"iframe\" id=\"authorsFrame\" class=\"people-select\"><div class=\"options-button\" id=\"selectAuthor\">Select authors</div></a>");
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

function getYear(date_string) {
    date_list = date_string.split("-");
    return date_list[0];
}

function getKeysUsed() {
    var keys = ["age","gender","family","transcript","subject","author","date"];
    var keys_used = [];
    for (var i=0; i<keys.length; i++) {
	if(filterDict[keys[i]].length > 0) {
	    keys_used.push(keys[i]);
	}
    }

    return keys_used;
}

function filterMap() {
    $("path").remove(); // Clear the map of previous lines
    console.log(filterDict)
    var keys = ["age","gender","family","transcript","subject","author","date"];
    var placesToAdd = [];
    var keys_used = getKeysUsed(keys);
       $("path.leaflet-clickable[stroke-opacity=\"0.5\"]").remove();
       var filterNames = {"age":"age_of_author","gender":"gender_of_author","family":"Family","transcript":"transcript","subject":"Subject","author":"author_name", "date":"date"};
       for (var j=0; j<letters_data.length; j++) {
	var    shouldAdd = true;
	var    line_json = letters_data[j];
	var    family = findFamily(line_json["author_name"])
	line_json["Family"]    = family;
	for    (var k=0; k<keys_used.length;k++) {
	       var keyAllGood = false;
	       var myKey = keys_used[k];
	       if (myKey == "date") {
		var    myYear = getYear(line_json["date"]);
		if    (myYear > filterDict["date"][0] && filterDict["date"][1] > myYear) {
		       keyAllGood = true;
		}
	       }
	       // For every key besides transcript and date
	       else if (!(myKey == "transcript")) {
		for    (var m=0; m<filterDict[myKey].length; m++) {
		       var myValue, keyValue;
		       if (myKey == "author") {
			myValue    = line_json["author_id"];
			keyValue    = filterDict[myKey][m];
		       }
		       else {
			keyValue    = filterDict[myKey][m];
			myValue    = line_json[filterNames[myKey]];
		       }

		       if (myValue == keyValue) {
			keyAllGood    = true;
		       }
		}
	       }
	       else {
		if(line_json["transcript"].split("    ").length < 2 && filterDict[myKey].indexOf("No Transcript") > -1) {
		       keyAllGood = true;
		}
		else    if(line_json["transcript"].split(" ").length >= 2 && filterDict[myKey].indexOf("Has Transcript") > -1) {
		       keyAllGood = true;
		}
		else    {
		       keyAllGood = false;
		}
	       }
	       if (!keyAllGood) {
		shouldAdd    = false;
	       }
	}
	

	if(shouldAdd)    {
	       var origin = parseInt(line_json["origin_id"]);
       	    var destination = parseInt(line_json["destination_id"]);
	       if (!isNaN(origin) && !isNaN(destination) && origin != -1 && destination != -1) {
		addLine(origin,destination,line_json);
		if    (placesToAdd.indexOf(origin) < 0) { placesToAdd.push(origin); }
		if    (placesToAdd.indexOf(destination) < 0) { placesToAdd.push(destination); }
	       }
	}
       }

       drawPlaces(placesToAdd);
}

function drawPlaces(placesToAdd) {
    for (var i=0; i<placesToAdd.length; i++) {
	var node = places_data[placesToAdd[i]];
	var latlng = [node.latitude,node.longitude];
	var geojsonMarkerOptions = {
	    radius:5,
	    fillColor: "#fff",
	    color: "#000",
	    weight: 1,
	    opacity: 1,
	    fillOpacity: 0.8,
	    title: name
	};
	var circle = L.circleMarker(latlng,geojsonMarkerOptions).bindPopup(
	    "<h2>"+node["name"]+"</h2>");
	circle.addTo(map);
    }
}

function addLine(origin, destination, line_json) {
    var or_latlng = [places_data[origin].latitude, places_data[origin].longitude];
    var start = { x:or_latlng[0], y:or_latlng[1]};
    var dest_latlng = [places_data[destination].latitude, places_data[destination].longitude];
    var end = { x:dest_latlng[0], y:dest_latlng[1]};
    if (!(dest_latlng[0] == or_latlng[0]) && !(dest_latlng[1] == or_latlng[1])) {
	var line;
	if (or_latlng[1] > -90 && dest_latlng[1] > -90) {
	    var generator = new arc.GreatCircle(start, end, { name: origin});
	    var line_arc = generator.Arc(100,{offset: 10, weight: 3});
	    var line_geojson = line_arc.json();
	    var line = L.polyline(line_geojson.geometry.coordinates, {color:'rgb(47, 53, 77)', weight:line_thickness}).addTo(map);
	} else {
	    line = L.polyline([or_latlng,dest_latlng],{color:'rgb(47, 53, 77)', weight:line_thickness}).addTo(map);
	}
    	var info = "<head><link href=\""+STATIC_URL+"css/misc/custom.css\" rel=\"stylesheet\" type=\"text/css\">";
    	info = info + "<script src=\""+STATIC_URL+"js/misc/custom.js\" type=\"text/javascript\"></script></head>";
	info = info + "<body><h1>"+line_json["title"].split("COMMA").join(",")+"</h1>";
	info = info + "Author: <span class=\"tooltip-mine\" id=\""+line_json["author_id"]+"\">" + line_json["author_name"] + "</span><br>";
	info = info + "Recipient: <span class=\"tooltip-mine\" id=\""+line_json["recipient_id"]+"\">" + line_json["recipient_name"] + "</span><br>";
	info = info + "Link: <a href=\"" + line_json["url"] + "\">" + line_json["url"] + "</a><br>";
	info = info + "Date: " + line_json["date"] + "<br>";
	info = info + "Transcript:<br><p>"+line_json["transcript"].split("COMMA").join(",")+"</p>";
	info = info + "Notes: " + line_json["notes"].split("COMMA").join(",") + "<br></body>";
	info_list[line._leaflet_id] = info;

	line.on("click", function(e) {
	    openFancyBox(e.target._leaflet_id);
	});
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
// ########################### End Filter Functions ##################################

// ###################### CODE TO CREATE THE TIMELINE BELOW ###########################

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
	.on("brush", brush);
	// .on("brushstart",brushstarted);

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
}

// ######################## End Timeline Functions #####################

// ####################### Miscellaneous Functions #####################
function updateNameBox() {
    var names = filterDict["author"];
    var list = $("#peopleList");
    if (list.length == 0) {
	$("#options").append("<div class=\"col\" id=\"peopleList\" style=\"overflow-y:scroll;width:300px;height:120px;\">");
    }
    var myCol = $("#peopleList");

    for (var i=0; i<names.length; i++) {
	myCol.append(people_data[names[i]].name+"<br>");
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
    zoom();
}
