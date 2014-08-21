$(document).ready(function() {
    try {
	var myBook = $("#myBook").imBookFlip({
	    page_class: 'imBookPage'
	});
	myBook.create(); 
    }
    catch(err) {
	console.log("didn't make a book")
    }

    $(".tooltip-mine").click(function() {
	console.log("here")
	if ($(this).children().length == 0) {
	    var id = $(this).attr("id");
	    console.log("id: ", id);
	    var child="<div class=\"ttip\" style=\"left:"+$(this).position()+";right:"+$(this).position()+";\"><ul>";
	    child = child + "<li><a href=\"/cope/letterNetwork/"+id+"/\">Letter Network</a></li>";
	    child = child + "<li><a href=\"/cope/mapFrequency/"+id+"/\">Letter Frequency Map</a></li>";
	    child = child + "<li><a href=\"/cope/frequency/"+id+"/\">Letter Frequency Chart</a></li>";
	    child = child + "<li><a href=\"/cope/dendro/"+id+"/\">Family Tree</a></li>";
	    child = child + "</ul></div>";
	    $(this).append(child);
	}
	else {
	    $(".ttip").remove();
	}
    });
});


// Does the same as above, but this works for dynamically created names... hopefully
function tooltipClicked(me) {
    if ($(me).children().length == 0) {
	var id = $(me).attr("id");
	console.log("id: ", id);
	var child="<div class=\"ttip\" style=\"left:"+$(me).position()+";right:"+$(me).position()+";\"><ul>";
	child = child + "<li><a href=\"/letterNetwork/"+id+"/\">Letter Network</a></li>";
	child = child + "<li><a href=\"/mapFrequency/"+id+"/\">Letter Frequency Map</a></li>";
	child = child + "<li><a href=\"/frequency/"+id+"/\">Letter Frequency Chart</a></li>";
	child = child + "<li><a href=\"/dendro/"+id+"/\">Family Tree</a></li>";
	child = child + "</ul></div>";
	$(me).append(child);
    }
    else {
	$(".ttip").remove();
    }
}
