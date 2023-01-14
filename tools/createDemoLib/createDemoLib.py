# creates a library with random entries to test application
import random
import json
from faker import Faker

faker = Faker()

class Words:
    def __init__(self):
        # load words from file
        with open("nouns.json", "r") as f:
            self.nouns = json.load(f).get("nouns", [])
        with open("verbs.json", "r") as f:
            self.verbs = json.load(f).get("verbs", [])
        with open("adjectives.json", "r") as f:
            self.adjectives = json.load(f).get("adjectives", [])

        self.capitalize = True

    def noun(self):
        if self.capitalize:
            return random.choice(self.nouns).capitalize()
        return random.choice(self.nouns)

    def verb(self):
        if self.capitalize:
            return random.choice(self.verbs).get("present", "eat").capitalize()
        return random.choice(self.verbs).get("present", "eat")

    def adjective(self):
        if self.capitalize:
            return random.choice(self.adjectives).capitalize()
        return random.choice(self.adjectives)

words = Words()


fileName = input("Enter file name: ") + ".json"
size = 0
while size < 1:
    # try to get size from input
    try:
        size = int(input("Enter number of entries: "))
    except ValueError:
        print("Invalid input. Please enter a number.")
        size = 0

entries = []

# constants
MULT_ENTRIES_PER_AUTHOR_CHANCE = 0.4
MULT_ENTRIES_PER_AUTHOR_MAX = size // 10
MULT_ENTRIES_PER_AUTHOR_MIN = 2

MULT_ENTRIES_PER_SERIES_CHANCE = 0.33
MULT_ENTRIES_PER_SERIES_MAX = size // 5
MULT_ENTRIES_PER_SERIES_MIN = 1

MULT_CHAPTERS_CHANCE = 0.8
MULT_CHAPTERS_MAX = 25
MULT_CHAPTERS_MIN = 5

MIN_CHAPTER_DURATION = 5 * 60
MAX_CHAPTER_DURATION = 60 * 80

ENTRY_IS_PODCAST_CHANCE = 0.2

# release date is between 1.1.1980 and 1.1.2020 in epoch time
RELEASE_DATE_MIN = 315532800
RELEASE_DATE_MAX = 1577836800

# added date is between 1.1.2010 and 1.1.2020 in epoch time
ADDED_DATE_MIN = 1262304000
ADDED_DATE_MAX = 1577836800


types = ["audiobook", "podcast"]

categories = ["fantasy", "horror", "romance", "sci-fi", "thriller", "western"]
subcategories = ["action", "adventure", "comedy", "drama", "mystery", "romance", "satire", "tragedy", "tragicomedy"]

def createCover(*args):
    return "output.jpg"

titleGenerators = [
    lambda: words.noun() + " " + words.noun(),
    lambda: "The " + words.noun() + ": " + words.adjective() + " " + words.noun(),
    lambda: words.noun() + " " + words.verb() + " " + words.noun(),
    lambda: words.noun() + " of " + words.noun(),
    lambda: words.noun() + " and " + words.noun(),
    lambda: faker.name(),
    lambda: "The " + words.noun() + " of " + words.noun(),
    lambda: words.adjective() + " " + words.noun(),
    lambda: "The " +words.adjective() + " " + words.noun(),
    lambda: words.adjective() + " " + words.noun() + " and " + words.adjective() + " " + words.noun()
]
def generateTitle():
    return random.choice(titleGenerators)()
    

def oldGenerateTitle():
    return faker.sentence(nb_words=random.randint(2, 4)).replace(".", "")

# create entries
i = 0
while i < size:
    # generate new author
    author = faker.name()

    aCount = 1
    # check if author has multiple entries
    if random.random() < MULT_ENTRIES_PER_AUTHOR_CHANCE:
        aCount = random.randint(MULT_ENTRIES_PER_AUTHOR_MIN, MULT_ENTRIES_PER_AUTHOR_MAX)
    
    # create entries for author
    j = 0
    while j < aCount:
        # decide on type
        type = types[0]
        if random.random() < ENTRY_IS_PODCAST_CHANCE:
            type = types[1]

        # decide on category
        category = random.sample(categories, k=random.randint(1, 3))
        subcategory = random.sample(subcategories, k=random.randint(1, 3))

        # decide on series
        series = ""
        sCount = 1
        if random.random() < MULT_ENTRIES_PER_SERIES_CHANCE:
            series = generateTitle()
            sCount = random.randint(MULT_ENTRIES_PER_SERIES_MIN, MULT_ENTRIES_PER_SERIES_MAX)

        # create entries for series
        k = 0
        releaseDate = random.randint(RELEASE_DATE_MIN, RELEASE_DATE_MAX)
        addedDate = random.randint(ADDED_DATE_MIN, ADDED_DATE_MAX)

        while k < sCount:
            # create entry
            chapters = 1
            if random.random() < MULT_CHAPTERS_CHANCE:
                chapters = random.randint(MULT_CHAPTERS_MIN, MULT_CHAPTERS_MAX)
            
            clist = []
            for c in range(chapters):
                clist.append({
                    "title": "Chapter " + str(c + 1),
                    "duration": random.randint(MIN_CHAPTER_DURATION, MAX_CHAPTER_DURATION)
                })

            # make chapter longer if single chapter
            if chapters == 1:
                clist[0]["duration"] *= 10

            entry = {
                "title": generateTitle(),
                "author": author,
                "category": category,
                "subcategory": subcategory,
                "series": series,
                "type": type,
                "description": faker.paragraph(nb_sentences=3),
                "chapters": clist,
                "rating": random.random() * 4 + 1,
                "price": round( random.random() * 20 + 5.99, 2),
                "cover": "",
                "releaseDate": releaseDate,
                "addedDate": addedDate,
                "progress": 0,
                "seriesIndex": k+1
            }
            cover = [ entry["type"] + "cover"]
            #(s for s in entry["series"].split(" ")) + (t for t in entry["title"].split(" ")) + (c for c in entry["category"])]
            cover += entry["series"].split(" ") + entry["title"].split(" ") + entry["category"]
            entry["cover"] = createCover(cover)
            entries.append(entry)

            # create new dates after this entry based on nr of entries in series
            releaseDate = releaseDate + (RELEASE_DATE_MAX - releaseDate) * (0.6+random.random()*0.6) // (sCount-k)
            addedDate = addedDate + (ADDED_DATE_MAX - addedDate) * (0.6+random.random()*0.6) // (sCount-k)

            k += 1
            i += 1
            # check if max entries reached
            if i >= size:
                break

        j += 1

# write to file
with open(fileName, "w") as file:
    json.dump(entries, file)
l = len(entries)
print("Creating " + str(l) + " entries...")
print("Done.")
