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
for person in data["nodes"]:
    name = person["name"].split(":")[0]
    name = re.findall('[A-Z][^A-Z]*', name)
    try:
	life_span = person["name"].split(":")[1]
    except:
	life_span = ""
    try:
	birth = life_span.split("-")[0]
    except:
	birth = "NOT FOUND"
	print "birth not found"
    try:
	death = life_span.split("-")[1]
    except:
	death = "NOT FOUND"
	# print "death not found"
   
    if len(name) == 0:
	print person
	final["nodes"].append({"pageRank":person["pageRank"],"name":person["name"], "id":"-1"})
    else:
	potential = Person.objects.filter(name__startswith=name[0])
	if len(potential) == 0:
	    new_name = " " + name[0]
	    potential = Person.objects.filter(name__startswith=new_name)
	    if len(potential) == 0:
		print "no matches: " + person["name"]
	found = False
	for p in potential:
	    try:
		temp_birth = re.search(r'\d{4}', p.birth).group(0)
	    except:
		temp_birth = "NO BIRTH"
	    try:
		temp_death = re.search(r'\d{4}', p.death).group(0)
	    except:
		temp_death = "NO DEATH"

	    # print temp_birth
	    # print "temp death: " + temp_death
	    if (temp_birth == birth or temp_death == death) and not found:
		# print "got here"
		found = True
		final["nodes"].append({"pageRank":person["pageRank"],"name":person["name"], "id":p.id})
	    elif len(potential) == 1:
		final["nodes"].append({"pageRank":person["pageRank"],"name":person["name"], "id":p.id})
		found = True
	if not found:
	    """
	    print "--------- Didn't Find a person with Potentials ----------"
	    print "person    : " + str(person)
	    print "name      : " + str(name)
	    print "potential : " + str(potential)
	    """
	    final["nodes"].append({"pageRank":person["pageRank"],"name":person["name"], "id":"-1"})

filename = "pageRank2.json"
with open(filename, 'wb') as outfile:
    json.dump(final, outfile, indent=2)
