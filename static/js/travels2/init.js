var text = "<h3>Family Travels Visualization</h3>";
text = text + "<p style='width:60%'>Welcome to the family travels visualization. In this visualization, you can see what trips each individual took, as well as who took trips over different time periods. All of the trips are based out of Philadelphia, since that is where the majority of the Cope and Evans families lived during that time period</p>";
text = text + "<p style='width:60%'>To see where an individual traveled over the course of their lifetime, click on their name in the panel on the right. Their name will then become color coded with the lines on the map that signify their travels."; 
$(document).ready(function() {
    $("#info").click(function() {
	$.fancybox.open(text);
    });
});
