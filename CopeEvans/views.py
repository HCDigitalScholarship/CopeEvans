from django.http import HttpResponse, HttpResponseNotFound
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

def index(request):
    return render(request, 'index.html')

def page(request, page_id):
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

def pageRank(request):
    return render(request, 'bubble.html')
