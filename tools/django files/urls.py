"""audioui URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.http import HttpResponse
from django.http import HttpResponseBadRequest
from django.template import loader
import json
import os

def addScore(userid, score):
    # read score file
    scores = []
    # check if file exists
    if os.path.exists("scores.txt"):
        with open("scores.txt", "r") as f:
            for line in f.readlines():
                line = line.strip()
                if line == "":
                    continue
                id, s = line.split("=")
                scores.append((id, int(s)))
    
    # add score
    entry = (userid, score)
    scores.append(entry)

    # sort scores
    scores.sort(key=lambda x: x[1], reverse=True)

    # write scores
    with open("scores.txt", "w") as f:
        for id, s in scores:
            f.write(id + "=" + str(s) + "\n")
    
    # return rank
    return scores.index(entry) + 1

def webapp(request):
    template = loader.get_template('index.html')
    context = {}
    return HttpResponse(template.render(context, request))

def saveTest(request):

    # check if the request is a POST request
    if request.method != "POST":
        return HttpResponseBadRequest("Only POST requests are allowed")

    # check if request has a key data
    if "data" not in request.POST:
        return HttpResponseBadRequest("No data provided")

    # get the data from the request
    data = request.POST["data"]

    # parse data as JSON
    try:
        data = json.loads(data)
    except json.JSONDecodeError:
        return HttpResponseBadRequest("Invalid JSON")

    # check if the data has a key userid
    if "userid" not in data:
        return HttpResponseBadRequest("No userid provided")

    duration = data.get("totalDurationSeconds", -1)
    rank = -1
    if duration != -1:
        rank = addScore(data["userid"], duration)


    # save data in json file with name userid.json
    with open("tests/" + data["userid"] + ".json", "w") as f:
        json.dump(data, f)

    # return a response

    return HttpResponse("Data saved")

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", webapp, name='home'),
    path("saveTest", saveTest)
]
