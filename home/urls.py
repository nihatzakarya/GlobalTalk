from django.urls import path
from . import views


urlpatterns = [
    path('', views.home, name = 'home'),
    path('userprofile/', views.userprofile, name = 'userprofile'),
    path('edit_profile/', views.edit_profile, name = 'edit_profile'),
    path('textbook/', views.textbook, name = 'textbook'),
    path('dictionary/', views.dictionary, name = 'dictionary'),
    path('about_us/', views.about_us, name = 'about_us'),
    path('wordle/', views.wordle, name = 'wordle'),
    path('hangman/', views.hangman, name = 'hangman'),
    path('login/', views.login, name = 'login'),
    path('sign/', views.sign, name = 'sign'),
    path('logout/', views.logout, name = 'logout'),




    path('faqs/', views.faqs, name = 'faqs'),
    path('our_team/', views.our_team, name = 'our_team'),

]