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
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import os

def addScore(userid, score):
    # read score file
    scores = []
    # check if file exists
    if os.path.exists("/home/audioui/audioui/audioui/scores.txt"):
        with open("/home/audioui/audioui/audioui/scores.txt", "r") as f:
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
    with open("/home/audioui/audioui/audioui/scores.txt", "w") as f:
        for id, s in scores:
            f.write(id + "=" + str(s) + "\n")

    # return rank
    return scores.index(entry) + 1

def webapp(request):
    template = loader.get_template('index.html')
    context = {}
    return HttpResponse(template.render(context, request))


@csrf_exempt
def saveTest(request):
    print("save start")
    #return JsonResponse(request.POST)
    # check if the request is a POST request
    if request.method != "POST":
        return JsonResponse({"message":"not post"})


    data = json.loads(request.body)
    if "userid" not in data:
        return JsonResponse({"message":"userid not found"})

    userid = data["userid"]


    duration = data.get("totalDurationSeconds", -1)
    rank = -1
    if duration != -1:
        rank = addScore(data["userid"], duration)


    # save data in json file with name userid.json
    with open("/home/audioui/audioui/audioui/tests/" + data["userid"] + ".json", "w") as f:
        json.dump(data, f)
    print("Saving test")

    # return a response

    return JsonResponse({"message":"Test received!","rank":rank ,"duration": duration})

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", webapp, name='home'),
    path("saveTest", saveTest)
]
