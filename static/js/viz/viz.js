$(document).ready(function() {
    $("a").click(function(e) {
	e.preventDefault();
	var link = $(this).attr("href");
	window.parent.location = link;
    });
});
