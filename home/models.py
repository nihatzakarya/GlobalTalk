from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, related_name='profile', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='profile/', default='profile/default.png')
    
    def __str__(self):
        return str(self.user)


class Info(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return str(self.name)
    
class Game(models.Model):
    name = models.CharField(max_length=30)
    html = models.CharField(max_length=50)

    def __str__(self):
        return str(self.name)
    
class Book(models.Model):
    name = models.CharField(max_length=50)
    image = models.ImageField(upload_to='book/')

    def __str__(self):
        return str(self.name)