from django.http import HttpResponse
from django.template import RequestContext, loader
from django.shortcuts import render
from json import dumps,dump
import ast
import sys
import re
from models import Person
from models import Children
from models import Letter
from models import Partner
from models import Place

def index(request):
    people = Person.objects.all()

    return render(request, 'index.html', {"people":people})

def viz(request, person):
    p = "all"
    if not person == "all":
	all_people = Person.objects.all()
	p = Person.objects.filter(id=person)[0]
	letters_sent = Letter.objects.filter(author=person)
	letters_received = Letter.objects.filter(recipient=person)

    return render(request, "viz.html", {"person":p, "letters_sent":letters_sent, "letters_received":letters_received})

def map(request, person):
    if not person == 'all':
	# If there is a person selected, we need all of that person's information
	person = Person.objects.filter(id=person)[0]
	return render(request, "letterMap.html", {"person":person})
    else:
	# if not just pass an empty string so that the javascript will know to show the full map
	return render(request, "letterMap.html", {"person":""})

def bubble(request):
    return render(request, "bubble.html")

def pageRank(request):
    return render(request, "pageRank.html")

def subjectChart(request):
    return render(request, "subjectBarChart.html")

def travels(request):
    return render(request, "familyTravels.html")

def letterFrequencyMap(request, person):
    # if a person is selected then we need to get all of their letters and the places within those letters
    # then look up all of those places latitudes and longitudes
    # this information is all passed on to the template as a json file
    if not person == 'all':
	person = Person.objects.filter(id=person)[0]
	letters_sent = Letter.objects.filter(author=person)
	letters_received = Letter.objects.filter(recipient=person)
	places = []
	places_w_letters = {}
	for letter in letters_sent:
	    if not letter.origin == None:   
		try:
		    places_w_letters[letter.origin.name] += 1
		except:
		    if not letter.origin.latitude == None:
			places_w_letters[letter.origin.name] = 1
			places.append({"name":letter.origin.name,"latitude":float(letter.origin.latitude),"longitude":float(letter.origin.longitude), "way":"sent"})
	    if not letter.destination == None:   
		try:
		    places_w_letters[letter.destination.name] += 1
		except:
		    if not letter.destination.latitude == None:
			places_w_letters[letter.destination.name] = 1
			places.append({"name":letter.destination.name,"latitude":float(letter.destination.latitude),"longitude":float(letter.destination.longitude),"way":"sent"})

	for letter in letters_received:
	    if not letter.origin == None:   
		try:
		    places_w_letters[letter.origin.name] += 1
		except:
		    if not letter.origin.latitude == None:
			places_w_letters[letter.origin.name] = 1
			places.append({"name":letter.origin.name,"latitude":float(letter.origin.latitude),"longitude":float(letter.origin.longitude), "way":"recieved"})
	    if not letter.destination == None:   
		try:
		    places_w_letters[letter.destination.name] += 1
		except:
		    if not letter.destination.latitude == None:
			places_w_letters[letter.destination.name] = 1
			places.append({"name":letter.destination.name,"latitude":float(letter.destination.latitude),"longitude":float(letter.destination.longitude), "way":"received"})
	
	for place in places:
	    place["count"] = places_w_letters[place["name"]]

	place_json = dumps(places,indent=2)
	return render(request, "letterFrequencyMap.html", {"mapFile":place_json,"place_list":places})

def dendro(request, person):
    if not person == 'all':
	person = Person.objects.filter(id=person)[0]
	final = findChildren(person)
	# If the person has a known partner, the try will work
	try:
	    partner = Partner.objects.filter(partner_1=person)[0]
	    starter = {"Cope Member":person.name, "Partner":partner.partner_2.name, "children":final, "id":person.id}
	# Otherwise partner will be filled in as unknown
	except:
	    starter = {"Cope Member":person.name, "Partner":"Unkown", "children":final, "id":person.id}
	# Need the depth to know how tall to make the svg, otherwise some trees are too spread out and others are too close together	
	depth = findDepth(starter,0)
	
	final_json = dumps(starter, indent=2)
	return render(request, "dendro.html", {"treeFile": final_json,"depth":depth})
    else:
	return render(request, "dendro.html")

################ HELPER FUNCTIONS FOR DENDROGRAM ########################
# recursive function to find the depth of the family tree that is a dendrogram
def findDepth(root,current_depth):
    max_depth = current_depth
    if not root["children"] == []:
	for child in root["children"]:
	    temp_depth = findDepth(child,current_depth+1)
	    if temp_depth > max_depth:
		max_depth = temp_depth
    return max_depth

# recursive function to locate all of the children underneath the given parent node
def findChildren(root):
    children_list = Children.objects.filter(parent=root.pk)
    temp_list = []
    for child in children_list:
	children = findChildren(child.child)
	try:
	    partner = Partner.objects.filter(partner_1=child.child)[0]
	    child_object = {"Cope Member":child.child.name, "Partner":partner.partner_2.name, "children":children, "id":child.child.id}
	except:
	    child_object = {"Cope Member":child.child.name, "Partner":"Unknown", "children":children, "id":child.child.id}
	    
	temp_list.append(child_object)

    return temp_list

############ END DENDROGRAM HELPER FUNCTIONS ############################
def frequency(request, person):
    # First grabs all of the letters written by the given person
    # Then stores them in a dictionary based on what year they are written
    # The program finally sends a json with this information to the appropriate template
    final = {}
    max_date = "1700"
    min_date = "2000"
    max_count = "0"
    if not person == "all":
	person = Person.objects.filter(id=person)[0]
	letters = Letter.objects.filter(author=person.pk)
	for letter in letters:
	    year = re.compile(r'[0-9][0-9][0-9][0-9]')
	    letter_year = re.search(year, letter.date)
	    if not letter_year == None:
		letter_year = letter_year.group(0)
		try:
		    final[letter_year] += 1
		except:
		    final[letter_year] = 1
	    
		if letter_year > max_date:
		    max_date = letter_year
	    
		if letter_year < min_date:
		    min_date = letter_year
	
	final_list = []
	for item in final.keys():
	    temp = {}
	    temp["year"] = item
	    temp["count"] = final[item]
	    final_list.append(temp)

	    if final[item] > max_count:
		max_count = final[item]

	final["max_date"] = max_date
	final["min_date"] = min_date
	final["max_count"] = max_count

	data = dumps(final_list, indent=2)
	
	return render(request, "frequency.html",{"graph_info":data})

    return False

    
