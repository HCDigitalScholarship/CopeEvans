import os
import json
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "CopeEvans.settings")
# your imports, e.g. Django models
from CopeEvans.models import Letter
from CopeEvans.models import Place
from CopeEvans.models import Person

"""
final = [
{'person name':..., 'person id':..., 'trips':[
  {'place':..., 'date':...},
  { ... }
]},
{'person name': ...  },
...
]
"""

letters = Letter.objects.all()

final = []
person_lookup = {}
counter = 0
for letter in letters:
    person = letter.author_id
    if not person in person_lookup.keys():
	person_lookup[person] = counter
	person_object = Person.objects.filter(id=person)[0]
	final.append({"person name":person_object.name, "person id":person, "trips":[]})
	person = counter
	counter += 1
    else:
	person = person_lookup[person]

    place = letter.origin_id
    try:
	place = Place.objects.filter(id=place)[0]
	place_name = place.name
	lat = place.latitude
	lon = place.longitude
	date = letter.date
	final[person]["trips"].append({"place":place_name,"longitude":lon, "latitude":lat, "date":date})
    except:
	print "place: " + str(place)
	
f = open("test.json","w")
json.dump(final,f, indent=4)
f.close()
