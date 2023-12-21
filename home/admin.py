from django.contrib import admin
from home.models import UserProfile, Game, Book

# Register your models here.

admin.site.register([UserProfile, Game, Book])