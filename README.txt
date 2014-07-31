Welcome to the Cope Evan's Project files

The backend of this site uses the Django framework (documentation can be found at https://www.djangoproject.com/).
The fontend of this site uses a bootstrap template. The documentation for bootstrap can be found at http://getbootstrap.com/, and the template that we used in making the frontend is at https://wrapbootstrap.com/theme/twilli-air-minimalist-one-page-theme-WB0196957. 

To create our own custom css stylings on top of the theme we have a file custom.css in the /static/css/misc/ directory. This file is loaded last, so it should overwrite any of the standard elements. We have placed a similar file in /static/js/misc/ named custom.js, which controls all of the custom javascript used to control the informational pages for the site.

The visualizations on this site were made using the following libraries:
-JQuery (http://jquery.com/)
-D3 (http://d3js.org/)
-FancyBox (http://fancyapps.com/fancybox/)
-Mapbox (https://www.mapbox.com/)
-Arc.js (https://www.mapbox.com/mapbox.js/example/v1.0.0/arcjs/)

All of the python functions needed to create each of the visualizations are in the views_viz.py, while the functions needed to show the generalpages are in the views.py file.

This project uses the following python libraries:
-django
-json

One of the most complex visualizations in this project is the letter map. The visualization uses two javascript files, drawMap.js and filter.js, which are in the /static/js/map/ directory. However, the majority of the code to create the map and filters is in the drawMap.js file and some smaller UI controls are in the filter.js file.
