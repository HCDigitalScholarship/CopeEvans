from django.http import HttpResponse, HttpResponseNotFound
from django.template import RequestContext, loader
from django.shortcuts import render
from django.contrib.auth.models import User
from json import dumps,dump
import ast
import sys
import re
from models import Person
from models import Children
from models import Letter
from models import Partner

def index(request):
    if request.user.is_authenticated():
	return render(request, 'index.html')
    else:
	return HttpResponse('<h1>I\'m sorry, you must be authenticated to view this page</h1><p>Please login and then try again</p>')

def page(request, page_id):
    if request.user.is_authenticated():
	print page_id
	if page_id == "1":
	    return render(request, 'Introduction.html')
	elif page_id == "2":
	    return render(request, 'Project.html')
	elif page_id == "3":
	    return render(request, 'Industrial.html')
	elif page_id == "4":
	    return render(request, 'IndustrialQuakers.html')
	elif page_id == "5":
	    return render(request, 'QuakerLifestyle.html')
	elif page_id == "6":
	    return render(request, 'Conclusion.html')
	else:
	    return HttpResponseNotFound('<h1>I\'m sorry. We could not loctae the page at this time. May the force be with you</h1>')
    else:
	return HttpResponse('<h1>I\'m sorry, you must be authenticated to view this page</h1><p>Please login and then try again</p>')

def pageRank(request):
    if request.user.is_authenticated():
	return render(request, 'bubble.html')
    else:
	return HttpResponse('<h1>I\'m sorry, you must be authenticated to view this page</h1><p>Please login and then try again</p>')
