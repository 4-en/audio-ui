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
