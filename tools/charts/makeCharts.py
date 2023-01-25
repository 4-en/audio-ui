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
    #return [30 + random.randint(0, 30) for i in range(10)]
    times = []
    for d in data:
        times.append(float(d["totalDurationSeconds"]))
    return times

def getUsedFeatures(data: list) -> list:
    features = ["Type", "Categories", "Subcategories", "Search", "Sort"]
    #counts = [ random.randint(0, 10) for i in range(len(features)) ]
    totalTasks = 0
    counts = [0, 0, 0, 0, 0]
    for d in data:
        for t in d["tasks"]:
            totalTasks += 1
            usedType = False
            usedCategories = False
            usedSubcategories = False
            usedSearch = False
            usedSort = False
            for e in t["entries"]:
                if e["name"] == "typeButton":
                    usedType = True
                elif e["name"] == "categoryButton":
                    usedCategories = True
                elif e["name"] == "subcategoryButton":
                    usedSubcategories = True
                elif e["name"] == "searchFieldInput":
                    usedSearch = True
                elif e["name"] == "sortButton":
                    usedSort = True
            if usedType:
                counts[0] += 1
            if usedCategories:
                counts[1] += 1
            if usedSubcategories:
                counts[2] += 1
            if usedSearch:
                counts[3] += 1
            if usedSort:
                counts[4] += 1

    for i in range(len(counts)):
        counts[i] /= totalTasks
        counts[i] *= 100
    
    return features, counts

def getAvgTestTime(data: list) -> list:
    testNames = []
    times = []

    for i, t in enumerate(data[0]["tasks"]):
        testNames.append("Test " + str(i + 1))
        times.append(0)

    for d in data:
        for i, t in enumerate(d["tasks"]):
            times[i] += float(t["durationSeconds"])
    for i in range(len(times)):
        times[i] /= len(data)

    return testNames, times

def getOS(data: list) -> list:
    os = []
    for d in data:
        os.append(d["os"])
    return os

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
    plt.bar(["User " + str(i+1) for i in range(len(times))], times)
    plt.savefig("totalTime.png", dpi=300)

    # total time (histogram)
    plt.clf()
    plt.title("Total Time")
    plt.xlabel("Time (s)")
    plt.ylabel("Count")
    plt.hist(times, bins=10)
    plt.savefig("totalTimeHistogram.png", dpi=300)


    # used features in percent
    plt.clf()
    plt.title("Used Features")
    plt.xlabel("Feature")
    plt.ylabel("% of Tasks")
    features, counts = getUsedFeatures(data)
    # y axis is in percent
    plt.ylim(0, 100)

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

    # get os data
    os = getOS(data)
    osnames = []
    oscounts = []
    for o in os:
        if o not in osnames:
            osnames.append(o)
            oscounts.append(1)
        else:
            oscounts[osnames.index(o)] += 1
    plt.clf()
    plt.title("OS")
    plt.pie(oscounts, labels=osnames)
    plt.savefig("os.png", dpi=300)






if __name__ == "__main__":
    main()