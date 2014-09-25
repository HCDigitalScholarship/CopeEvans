$(document).ready(function() {
    $(".people-select").fancybox();
    $("#reset-button").click(function() {
	resetFilters()
    });
    
    var is_up = [true,true];
    var slideHeight = 150;
    var timelineHeight = 100;
    
    $("#timeline").css({"display":"none","height":timelineHeight});
    $("#filter").css({"display":"none","height":slideHeight});


    $("#timeline-button").click(function() {
	if (is_up[0]) {
	    if ($("#filter").css("display") == "block") {
		$("#filters-button").click();
	    }
	    $("#timeline").css("display","block");
	    $("#footer-wrapper").css("bottom", timelineHeight+15);
	    $("#footer").css("height",timelineHeight);
	    $("#footer-transparent").css("bottom", timelineHeight);
	    is_up[0] = false;
	}
	else {
	    $("#timeline").css("display","none");
	    $("#footer-wrapper").css("bottom",10);
	    $("#footer").css("height",60);
	    $("#footer-transparent").css("bottom", 0);
	    is_up[0] = true;
	}
    });

    $("#filters-button").click(function() {
	if (is_up[1]) {
	    if ($("#timeline").css("display") == "block") {
		$("#timeline-button").click();
	    }
	    $("#filter").css("display","block")
	    $("#footer").css("height",slideHeight);
	    $("#footer-wrapper").css("bottom",slideHeight+15);
	    $("#footer-transparent").css("bottom",slideHeight);
	    is_up[1] = false;
	}
	else {
	    $("#filter").css("display","none")
	    $("#footer").css("height",60);
	    $("#footer-wrapper").css("bottom",10);
	    $("#footer-transparent").css("bottom",0);
	    is_up[1] = true;
	}
    });
    
    $("#info").click(function() {
	var text = "<h2>About the Map</h2><p>The letter network that is plotted here, shows all of the letters for which we have an origin and destination. Of the 3000 letters that we do have, about 700 are shown here. To make identifying patterns and seeing trends within the letters, the map does not show all of the letters until you have zoomed into a small enough level so as not to be overwhelmed by the immense number of letters. To view one of the letters, simply click on the line that it is represented by and the letter will pop up.</p>";
	text = text + "<p>The zoom and click functionality for exploring the letters is only the basics for fully exploring these letters. To filter the letters based on when they were sent, click on the \"Time Line\" button on the bottom bar, click and drag your cursor along the timeline that pops up and the letters will automatically filter. You can then drag the darker box along the timeline to see how the letters sent over a period of time changes. Next, to gain further insight into what is happening during a time period, you can select the \"Categories\" button and then any one of the options within those submenus, to further filter down the letters you see. This process can work in the opposite direction as well, where you select the categories you want to see and then selecting the time period. All of these features are present to hopefully give you a well rounded and complete picture of the Cope and Evans family correspondences during the 19th century.";
	$.fancybox.open(text);
    });
});
