var depth = parseInt($("#depth:hidden").text())

var width = 1200,
    height = 600;

if (depth > 3) { height = height + 60*depth; }

var cluster = d3.layout.cluster()
    .size([height, width - 160]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var root = $("#json:hidden").text();
root = JSON.parse(root);

var nodes = cluster.nodes(root),
    links = cluster.links(nodes);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(40,0)");

  var link = svg.selectAll(".link")
      .data(links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal)
      .attr("id", function(d) { return d.source["Partner"] + d.target["Partner"]; });

  var node = svg.selectAll(".node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

  node.append("circle")
      .attr("r", 4.5)
      .on("click", function(d) {
	    var text = "<div class=\"close-mine\">-</div>"
	    text = text + "<b>Name:</b><span onclick=\"tooltipClicked(this)\" id="+d.id+" class=tooltip-mine>"+d["Cope Member"]+"</span><br>";	
	    text = text + "<b>Partner:</b> " + d.Partner + "<br>";
	    text = text + "<b>Children:</b> <br>";
	    if (d.children != undefined) {
		for (var i=0; i<d.children.length; i++) {
		    text = text + "<div class=\"child\"><span onclick=\"tooltipClicked(this)\" id=\""+d.children[i]["id"]+"\"class=\"tooltip-mine\">"+ d.children[i]["Cope Member"] + "</span> and "+d.children[i]["Partner"]+"</div>";
		}
	    }
	    if ($(this)[0].getAttribute("class") != "selected") {
		highlightChildren(d);
		console.log($(this)[0].getAttribute("class"))
	    }
	    else {
		console.log("here");
		$(this)[0].removeClass("selected");
	    }
	    $("#info").html(text);
      });

  node.append("text")
      .attr("dx", function(d) { return d.Children ? -8 : 8; })
      .attr("dy", 10)
      .style("text-anchor", function(d) { return d.Children ? "end" : "start"; })
      .text(function(d) { return d["Cope Member"]; });

function highlightChildren(data) {
    var lines = $(".link");
    for (var i=0; i<lines.length; i++) {
	var id = lines[i].getAttribute("id");
	if (data.children != undefined) {
	    for (var j=0; j<data.children.length; j++) {
		var child = data.children[j].Partner;
		if (id.indexOf(data["Partner"]) > -1 && id.indexOf(child)) {
		    lines[i].style.stroke = "yellow";
		}
	    }
	}
    }
}

d3.select(self.frameElement).style("height", height + "px");

$(".close-mine").live("click", function() {
    $("#info").toggleClass("hidden-mine");
    if ($("#info").hasClass("hidden-mine")) {
	$(".close-mine").text("+");
    }
    else {
	$(".close-mine").text("-");
    }
});
