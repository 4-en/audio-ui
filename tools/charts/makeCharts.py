import matplotlib.pyplot as plt
import os
import json
import random

def loadTest(folder: str) -> list:
    # check if folder exists
    if not os.path.exists(folder):
        raise Exception("Folder does not exist")

    # get list of *.json files
    files = os.listdir(folder)
    files = [f for f in files if f.endswith(".json")]

    # load each file into a list
    data = []
    for f in files:
        with open(os.path.join(folder, f)) as file:
            data.append(json.load(file))
    
    return data

def getTotalTimes(data: list) -> list:
    return [30 + random.randint(0, 30) for i in range(10)]
    return [d["totalTime"] for d in data]

def getUsedFeatures(data: list) -> list:
    features = ["Type", "Categories", "Subcategories", "Search", "Sort"]
    counts = [ random.randint(0, 10) for i in range(len(features)) ]
    return features, counts

def getAvgTestTime(data: list) -> list:
    testNames = ["Test 1", "Test 2", "Test 3", "Test 4", "Test 5", "Test 6", "Test 7", "Test 8", "Test 9", "Test 10"]
    times = [ random.randint(0, 10) for i in range(len(testNames)) ]
    return testNames, times

def main():
    # get folder with test data from user
    folder = input("Enter test dir: ")
    data = []
    try:
        data = loadTest(folder)
    except Exception as e:
        print(e)
        return

    # make various charts and save them to disk

    # total time
    plt.clf()
    plt.title("Total Time")
    plt.xlabel("Test")
    plt.ylabel("Time (s)")
    times = getTotalTimes(data)
    plt.bar(range(len(times)), times)
    plt.savefig("totalTime.png", dpi=300)

    # total time (histogram)
    plt.clf()
    plt.title("Total Time")
    plt.xlabel("Time (s)")
    plt.ylabel("Count")
    plt.hist(times, bins=10)
    plt.savefig("totalTimeHistogram.png", dpi=300)


    # used features
    plt.clf()
    plt.title("Used Features")
    plt.xlabel("Feature")
    plt.ylabel("Count")
    features, counts = getUsedFeatures(data)
    plt.bar(features, counts)
    plt.savefig("usedFeatures.png", dpi=300)

    # used features (pie)
    plt.clf()
    plt.title("Used Features")
    plt.pie(counts, labels=features)
    plt.savefig("usedFeaturesPie.png", dpi=300)

    # avg test time
    plt.clf()
    plt.title("Average Test Time")
    plt.xlabel("Test")
    plt.ylabel("Time (s)")
    testNames, times = getAvgTestTime(data)
    plt.bar(testNames, times)
    plt.savefig("avgTestTime.png", dpi=300)





if __name__ == "__main__":
    main()