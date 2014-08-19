/*
Much of the code for the brushing taken from:
http://bl.ocks.org/mbostock/4565798

Also uses code from d3's force directed graph function:
http://bl.ocks.org/mbostock/4062045

And small amount from (to make the graph static):
https://gist.github.com/mbostock/1667139
*/

var width = 960,
    height = 600,
    shiftKey;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-100)
    .linkDistance(20)
    .size([width, height]);

var svg = d3.select("body")
    .attr("tabindex", 1)
    .on("keydown.brush", keyflip)
    .on("keyup.brush", keyflip)
    .each(function() { this.focus(); })
  .append("svg")
    .attr("width", width)
    .attr("height", height);

function lookup(item, list) {
    for(var i=0; i<list.length; i++) {
	if (item.source == list[i].source && item.target == list[i].target) {
	    return true;
	}
    }
    return false;
}

d3.json("try_me.json", function(error, graph) {
  console.log(error)
  var links = [];
  var multiple = {};
  for (var i=0; i<graph.links.length; i++) {
    var isIn = lookup(graph.links[i],links);
    if (isIn) {
	if (multiple[graph.links[i]] != undefined){
	    multiple[graph.links[i]]++;
	}
	else {
	    multiple[graph.links[i]] = 1;
	}
    }
    else {
	links.push(graph.links[i]);
    }
  }
  
    force
      .nodes(graph.nodes)
      .links(links)
      .start();

  var selected = {};

  var brush = svg.append("g")
      .datum(function() { return {selected: false, previouslySelected: false}; })
      .attr("class", "brush")
      .call(d3.svg.brush()
        .x(d3.scale.linear().domain([0, width]).range([0, width]))
        .y(d3.scale.linear().domain([0, height]).range([0, height]))
	.on("brushstart", function() { 
	    node.style("fill",color(undefined));
	    d3.select("#people").html("")
	    selected = {};
	})
        .on("brush", function() {
          var extent = d3.event.target.extent();
          node.classed("selected", function(d) {
            var fin = (extent[0][0] <= d.x && d.x < extent[1][0] && extent[0][1] <= d.y && d.y < extent[1][1]);
	    if (fin) {
		var node = d3.select("#node"+d.index.toString());
		node.style("fill","red");
		if(!selected[d.name]) {
		    d3.select("#people").append("a")
			.html(d.name)
			.attr("class","person")
			.attr("href","test.html")
			.attr("id","show"+d.index.toString())
			.attr("rel","group")
			.attr("data-fancybox-type","iframe");
		    selected[d.name] = true;
		}
	    }
	    return fin;
          });
        })
        .on("brushend", function() {
          d3.event.target.clear();
          d3.select(this).call(d3.event.target);
        }));
  
  var linkLayer = svg.append("g");

  var link = linkLayer.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var nodelayer = svg.append("g")
	.attr("class","node")
	.attr("height",height)
	.attr("width",width);
    
  var node = nodelayer.selectAll("circle")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("id", function(d) {return "node"+d.index.toString();})
      .attr("r", function(d) { return Math.sqrt(d.pageRank*10000) })
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag)
      .on("mousedown", function(d) {
	    var node = d3.select(this);
	    if(!selected[d.name]) {
	    	node.style("fill","red");
		d3.select("#people").append("a")
		    .html(d.name)
		    .attr("class","person")
		    .attr("href","test.html")
		    .attr("rel","group")
		    .attr("id","show"+d.index.toString())
		    .attr("data-fancybox-type","iframe");
		selected[d.name] = true;
	    }
	    else {	
		node.style("fill",color(undefined));
		selected[d.name]=false;
		d3.select("#show"+d.index.toString()).remove();
	    }
	});

  node.append("title")
      .text(function(d) { return d.name; });


  var n = 50;
  var r = 3;
  force.start();
  for (var i = n * n; i > 0; --i) force.tick();
  force.stop()
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x = Math.max(r, Math.min(width - r, d.x)); }) 
      .attr("cy", function(d) { return d.y = Math.max(r, Math.min(height - r, d.y)); });
});

function keyflip() {
  shiftKey = d3.event.shiftKey || d3.event.metaKey;
}
