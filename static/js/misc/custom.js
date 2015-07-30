$(document).mouseup(function (e)
{
    var container = $(".ttip");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        container.remove();
    }
});

$(document).ready(function() {
	
    /*
    $('div, svg').not('#info, .ttip').on('click',function() {
	console.log(this);
	console.log("HERE")
	$(".ttip").remove();
    });
    */
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
	if ($(this).children().length == 0) {
	    $(".ttip").remove();
	    var id = $(this).attr("id");
	    console.log("id: ", id);
	    var child="<div class=\"ttip\" style=\"left:"+$(this).position()+";right:"+$(this).position()+";\"><ul>";
	    child = child + "<li><a href=\"/letterNetwork/"+id+"/\">Letter Network</a></li>";
	    child = child + "<li><a href=\"/mapFrequency/"+id+"/\">Letter Frequency Map</a></li>";
	    child = child + "<li><a href=\"/frequency/"+id+"/\">Letter Frequency Chart</a></li>";
	    child = child + "<li><a href=\"/dendro/"+id+"/\">Family Tree</a></li>";
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
	$(".ttip").remove();
	var id = $(me).attr("id");
	var child="<div class=\"ttip\" style=\"left:"+$(me).position()['left']+";\"><ul>";
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
