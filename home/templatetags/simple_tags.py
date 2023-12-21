from django.template import Library
from home.models import Game, Book

register = Library()

@register.simple_tag
def game():
    return Game.objects.all()

@register.simple_tag
def book():
    return Book.objects.all()