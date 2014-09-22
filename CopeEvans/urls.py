from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'CopeEvans.views.index', name='home'),
    url(r'^pageRank/','CopeEvans.views.pageRank', name='Page Rank'),
    url(r'^cope/page/(?P<page_id>\d+)/', 'CopeEvans.views.page', name='details'),
    url(r'^viz/(?P<person>\d+)/$', 'CopeEvans.views_viz.viz', name='viz'),
    url(r'^letterNetwork/(?P<person>\d+)/$', 'CopeEvans.views_viz.map', name='map'),
    url(r'^letterNetwork/$', 'CopeEvans.views_viz.map', name='map', kwargs={"person":'all'}),
    url(r'^dendro/(?P<person>\d+)/$', 'CopeEvans.views_viz.dendro', name='dendro'),
    url(r'^frequency/(?P<person>\d+)/$', 'CopeEvans.views_viz.frequency', name='frequency'),
    url(r'^mapFrequency/(?P<person>\d+)/$', 'CopeEvans.views_viz.letterFrequencyMap', name='mapFrequency'),
    url(r'^bubblePageRank/$', 'CopeEvans.views_viz.bubble', name='Bubble PageRank'),
    url(r'^PageRank/$', 'CopeEvans.views_viz.pageRank', name='PageRank'),
    url(r'^SubjectChart/$', 'CopeEvans.views_viz.subjectChart', name='subjectChart'),
    url(r'^FamilyTravels/$', 'CopeEvans.views_viz.travels', name='Family Travels'),
    url(r'^TravelInfo/$', 'CopeEvans.views_viz.travels', name='Travels Info'),
)
