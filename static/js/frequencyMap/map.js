var map = L.mapbox.map('map', 'mzarafonetis.idm8dak7')
    .setView([40, -74.50], 7);
var places_data = $("#info:hidden").text() ;
places_data = JSON.parse(places_data);
// console.log(places_data)
for (var i=0; i<places_data.length; i++) {
    var latlng = [places_data[i].latitude,places_data[i].longitude]
    var geojsonMarkerOptions = {
        fillColor: "#fff",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        title: places_data[i].name
    };

    var circle = L.circle(latlng,places_data[i].count*500,geojsonMarkerOptions).bindPopup(
        "<h2>"+places_data[i].name+"</h2><h3>Count: "+places_data[i].count.toString()+"</h3>");

    circle.addTo(map);
}
$(".place").click(function(d) {
    var text = d.target.innerText.split("Count:")[0];
    text = text.substr(0,text.length-2)
    console.log("\"" + text + "\"")
    for (var i=0;i<places_data.length; i++) {
        if (places_data[i].name == text) {
    	var latlng =  [places_data[i].latitude,places_data[i].longitude];
    	map.setView(latlng, 10);
        }
    }
});
