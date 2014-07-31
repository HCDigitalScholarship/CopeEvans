from django.db import models

class Person(models.Model):
    name = models.CharField("Person's Name", max_length=100)
    birth = models.CharField("Birth Date", max_length=20)
    death = models.CharField("Death Date", max_length=20)
    family = models.CharField("Family", max_length=20)
    other_1 = models.CharField("Other_1", max_length=50)
    other_2 = models.CharField("Other_2", max_length=50)
    parent_1 = models.ForeignKey("self", related_name="parent 1", null=True)
    parent_2 = models.ForeignKey("self", related_name="parent 2", null=True)
    
    def __unicode__(self):
	return self.name + " " + str(self.id)

class Partner(models.Model):
    partner_1 = models.ForeignKey(Person, related_name="partner_1")
    partner_2 = models.ForeignKey(Person, related_name="partner_2")

class Children(models.Model):
    parent = models.ForeignKey(Person, related_name="parent")
    child = models.ForeignKey(Person, related_name="child")

    def __unicode__(self):
	return str(self.parent) + " " + str(self.child)

class Place(models.Model):
    name = models.CharField("Location Name", max_length=75)
    latitude = models.FloatField(null=True)
    longitude = models.FloatField(null=True)
    state = models.CharField("State", max_length=20)
    country = models.CharField("Country", max_length=20)
    continent = models.CharField("Continent", max_length=15)

    def __unicode__(self):
	return self.name

class Trip(models.Model):
    person = models.ForeignKey(Person, related_name="traveler")
    origin = models.ForeignKey(Place, related_name="from")
    destination = models.ForeignKey(Place, related_name="to")

    def __unicode__(self):
	return str(person) + " " + str(origin) + " " + str(destination)

class Letter(models.Model):
    author = models.ForeignKey(Person, related_name="author", null=True)
    recipient = models.ForeignKey(Person, related_name="recipient", null=True)
    origin = models.ForeignKey(Place, related_name="origin", null=True)
    destination = models.ForeignKey(Place, related_name="destination", null=True)
    date = models.CharField("year",max_length=15, null=True)
    url = models.CharField("Link", max_length=100)
    title = models.CharField("title", max_length=100, null=True)
    gender_of_author = models.CharField(max_length=5, null=True)
    age_of_author = models.CharField(max_length=20, null=True)
    notes = models.TextField(null=True)
    transcript = models.TextField(null=True)



    def __unicode__(self):
	return self.id
