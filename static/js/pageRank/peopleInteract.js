$(document).ready(function() {
    $(".person").fancybox();

    $("#select").click(function() {
	var people = $("#people").children();
	var names = [];
	for (var i=0; i<people.length; i++) {
	    names.push(people[i].innerHTML);
	}
	name_ids = []
	for (var j=0; j<names.length; j++) {
	    var found = false;
	    var name = names[j].split(":")[0];
	    var name = name.split(/(?=[A-Z])/).join(" ");
	    console.log("name: ", name);
	    for(var k=0; k<parent.people_data.length; k++) {
		if (!found && name == parent.people_data[k].name) {
		    name_ids.push(parent.people_data[k].id);
		    found = true;
		}
	    }   
	}
	console.log("names: ", names);
	console.log("filterDict: ", parent.filterDict);
	parent.filterDict["author"] = name_ids;
	parent.filterMap();
	parent.updateNameBox();
	parent.closeIframe();
    });
});
