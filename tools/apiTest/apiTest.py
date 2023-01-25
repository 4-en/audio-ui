import fastapi
import json
import os

app = fastapi.FastAPI()

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




@app.get("/")
def read_root(request, response):
    # return http
    return fastapi.responses.HTMLResponse(content="Hello World")

@app.post("/saveTest/")
def saveTest(request):
    # check for data in request
    if "data" not in request.POST:
        # return a bad request response
        raise fastapi.HTTPException(status_code=400, detail="No data provided")

    # get the data from the request
    data = request.POST["data"]

    # parse data as JSON
    try:
        data = json.loads(data)
    except json.JSONDecodeError:
        raise fastapi.HTTPException(status_code=400, detail="Invalid JSON")

    # check if the data has a key userid
    if "userid" not in data:
        raise fastapi.HTTPException(status_code=400, detail="No userid provided")

    # save data in json file with name userid.json
    with open("tests/" + data["userid"] + ".json", "w") as f:
        json.dump(data, f)

    rank = -1
    time = -1
    # sum up the time
    # ...
    try:
        rank = addScore(data["userid"], time)
    except:
        rank = -1

    # return success response
    return {"message": "Data saved",
            "rank": rank}

@app.get("/rank/")
def rank(request):
    # check for userid in request
    if "userid" not in request.GET:
        # return a bad request response
        raise fastapi.HTTPException(status_code=400, detail="No userid provided")

    # get the userid from the request
    userid = request.GET["userid"]

    

# run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)

