from typing import Any
from django.shortcuts import render, redirect
from django.contrib.auth import login as djangoLogin, authenticate, logout as djangoLogout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from home.models import UserProfile
from home.forms import UserForm
# from django.http import HttpResponse

# Create your views here.

def home(request):
    return render(request, 'index.html')

@login_required(login_url='/login')
def userprofile(request):

    try:
        member = UserProfile.objects.get(user_id=request.user.id)
    except:
        member = request.user
        UserProfile.objects.create(user = member)

    if request.method == 'POST':
        image = request.POST.get('image')
        if image:
            request.user.profile.image = "profile/"+image
            x = UserProfile.objects.get(user_id=request.user.id)
            x.image = "profile"+image
            x.save()

    return render(request, 'userprofile.html')

def edit_profile(request):
    return render(request, 'edit_profile.html')

def textbook(request):
    return render(request, 'textbook.html')

def dictionary(request):
    return render(request, 'dictionary.html')

def about_us(request):
    return render(request, 'about_us.html')

def wordle(request):
    return render(request, 'wordle.html')

def hangman(request):
    return render(request, 'hangman.html')


def login(request):

    varNext = request.GET.get('next')
    if request.user.is_authenticated:
        return redirect('/')
        
    ad = request.POST.get('ad')
    if ad:
        if request.method == 'POST':
            kod = request.POST.get('kod')

            user = authenticate(username = ad, password = kod)

            if user:
                djangoLogin(request, user)
                if varNext:
                    return redirect(varNext)
                return redirect('/')
        

    form = UserForm()        
    if request.method == 'POST':
        # username = request.POST.get('username')
        # email = request.POST.get('email')
        # password = request.POST.get('password')

        # user = User.objects.create_user(username, email, password)

        # user.save()
        # return redirect('login')
        
        form = UserForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect(('login'))
        
    context = {
        'form':form
    }
    
    return render(request, 'login.html', context)



def sign(request):

    if request.user.is_authenticated:
        return redirect('/')
    

    if request.method == 'POST':
        ad = request.POST.get('ad')
        if ad:
            kod = request.POST.get('kod')

            user = authenticate(username = ad, password = kod)

            if user:
                djangoLogin(request, user)
                return redirect('/')

    form = UserForm()        
    if request.method == 'POST':
        # username = request.POST.get('username')
        # email = request.POST.get('email')
        # password = request.POST.get('password')

        # user = User.objects.create_user(username, email, password)

        # user.save()
        # return redirect('login')
        
        form = UserForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect(('login'))
        
    context = {
        'form':form
    }
    return render(request, 'sign.html', context)


def logout(request):
    djangoLogout(request)
    return redirect('/')







def faqs(request):
    return render(request, 'faqs.html')


def our_team(request):
    return render(request, 'our_team.html')