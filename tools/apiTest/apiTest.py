import fastapi
import json

app = fastapi.FastAPI()

# ok response

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

    # return success response
    return {"message": "Data saved"}

# run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)

