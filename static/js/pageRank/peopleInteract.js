$(document).ready(function() {
    $(".person").fancybox();

    $("#select").click(function() {
	console.log("parent:",parent)
	if(!(window.top != window.self)) {
	    alert("This function is only used when interacting with the letter map visualization")
	}
	else {
	var people = $("#people").children();
	var names = [];
	for (var i=0; i<people.length; i++) {
	    var temp = people[i].href;
	    temp = temp.split("z/")[1];
	    temp = temp.split("/")[0];
	    console.log("temp:",temp);
	    temp = parseInt(temp,10);
	    names.push(temp);
	}

	parent.filterDict["author"] = (names);
	console.log("filterDict: ", parent.filterDict["author"]);
	parent.filterMap();
	parent.updateNameBox();
	parent.closeIframe();
	}
    });
    
    $("#info").click(function() {
	$.get('/static/json/pageRank.html', function(data) {
	    $.fancybox.open(data);
	});
    });
});
