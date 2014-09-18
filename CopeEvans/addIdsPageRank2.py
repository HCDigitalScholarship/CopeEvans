import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "CopeEvans.settings")
import json
import re
from CopeEvans.models import Person

json_data = open('static/json/pageRank.json')
data = json.load(json_data)
final = {}
final["links"] = data["links"]
final["nodes"] = []
counter = 0
counter_error = 0
not_right = [
"AnnaBrownCopeStork:b.1862",
"HannahR.Haines",
"Samuelb.1820?Alsop",
"MaryFarnum('Mame')Brown"
]
for person in data["nodes"]:
    if person["name"] in not_right:
	if person["name"] == not_right[0]:
	    final["nodes"].append({"pageRank":person["pageRank"],"name":person["name"], "id":335})
	elif person["name"] == not_right[1]:
	    final["nodes"].append({"pageRank":person["pageRank"],"name":person["name"], "id":137})
	elif person["name"] == not_right[3]:
	    final["nodes"].append({"pageRank":person["pageRank"],"name":person["name"], "id":112})
	else:
	    final["nodes"].append({"pageRank":person["pageRank"],"name":person["name"], "id":198})

	counter_error += 1
    else:
	final["nodes"].append({"pageRank":person["pageRank"],"name":person["name"], "id":counter})
	counter += 1

print "Number of people not gotten: " + str(counter_error)
filename = "pageRank3.json"
with open(filename, 'wb') as outfile:
    json.dump(final, outfile, indent=2)
