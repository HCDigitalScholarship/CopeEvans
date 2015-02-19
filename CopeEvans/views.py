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

authenticate = False

def index(request):
    if request.user.is_authenticated() or not authenticate:
	return render(request, 'CopeEvansHOME.html')
    else:
	return HttpResponse('<h1>I\'m sorry, you must be authenticated to view this page</h1><p>Please login and then try again</p>')

def page(request, page_id):
    if request.user.is_authenticated() or not authenticate:
	print page_id
	if page_id == "home":
	    return render(request, 'CopeEvansHOME.html')
	elif page_id == "family":
	    return render(request, 'CopeEvansFAMILY.html')
	elif page_id == "philadelphia":
	    return render(request, 'CopeEvansPHILLY.html')
	elif page_id == "transformation":
	    return render(request, 'CopeEvansTRANSFORMATION.html')
	elif page_id == "life":
	    return render(request, 'CopeEvansDOMESTIC.html')
	elif page_id == "political":
	    return render(request, 'CopeEvansPOLITICAL.html')
	elif page_id == "bibliography":
	    return render(request, 'CopeEvansBIBLIO.htm')
	else:
	    return HttpResponseNotFound('<h1>I\'m sorry. We could not locate the page at this time</h1>')
    else:
	return HttpResponse('<h1>I\'m sorry, you must be authenticated to view this page</h1><p>Please login and then try again</p>')

def pageRank(request):
    if request.user.is_authenticated() or not authenticate:
	return render(request, 'bubble.html')
    else:
	return HttpResponse('<h1>I\'m sorry, you must be authenticated to view this page</h1><p>Please login and then try again</p>')
