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
	    .attr("stroke","white")
	    .call(xAxis)
	    .selectAll(".tick")
		.classed("minor", function(d) { return d.getHours(); });

	chart.append("g")
	    .attr("class","y axis")
	    .attr("transform", "translate(10,0)")
	    .attr("stroke","white")
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

$(document).ready(function() {
    $("#info").click(function() {
	var text = "<h2>About the Graph</h2><p>The bar graph initially shows how many letters were written in any given year between 1800 and 1911, within our collection. To see the exact year and number, hover your mouse over each bar and the year and number of letters will appear on the right hand side. However, to fully understand what each of these letters were about, you can choose to view their frequency by subject. The subjects of each letter was determined by their subject tagging within the original database. An algorithm than divided the letters in to larger subject categories, by looking for different keywords in the subject taggings. See the list below to view, what keywords designated a certain letter as belonging to that category.</p>";
	text = text + "<ul><li> travel keywords = travel, voyage, ocean, transportation, voyages, travels, railroad, railroads, business, steamboats, shipping, sailing</li>";
	text = text + "<li>education keywords = school, college, haverford, education, college, university</li>";
	text = text +"<li>love keywords = Love, love</li>";
	text = text +"<li>health keywords = health, disease, diseases, fever, dysentery</li>";
	text = text +"<li>family keywords = family, pets, death, vacation, deeds, suicide, housing, home, vacations</li>";
	text = text +"<li>religion keywords = faith, quaker, quakers, quakerism, spiritual, spirituality, religious, religion, god, friends</li>";
	text = text +"<li>political keywords = lincoln, event, government, pennsylvania, united, states, war, wars, politics, political</li>";
	text = text +"<li>lifestyle keywords = children, clothes, dress, life, ornithology, letter, finance, tax, music, dreams, land, nature, birthdays, birthday, weather, outdoor, literature, sympathy, entertaining, child, letters, gossip, trusts, legal, cards</li>";
	text = text +"</ul>";	
	$.fancybox.open(text);
    });
});
