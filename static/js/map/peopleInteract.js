$(document).ready(function() {
    $(".person").fancybox();

    $("#select").click(function() {
	var people = $("#people").children();
	var names = [];
	for (var i=0; i<people.length; i++) {
	    names.push(people[i].innerHTML);
	}
	console.log("names: ", names);
	console.log("filterDict: ", parent.filterDict);
	parent.filterDict["author"] = names;
	parent.filterMap();
	parent.updateNameBox(names);
	parent.closeIframe();
    });
});
