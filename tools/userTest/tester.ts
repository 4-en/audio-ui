enum ActionType {
    CLICK = "click",
    KEY = "key"
}

class TestEntry {
    type: ActionType;
    action: string;
    time: number;

    constructor(type: ActionType, action: string, time: number) {
        this.type = type;
        this.action = action;
        this.time = time;
    }

}

class UserTest {

    task: string;
    username: string;
    start = Date.now();
    completed = false;
    entries: TestEntry[] = [];
    listener;




    constructor(username: string, task: string, listener: CallableFunction) {

        this.task = task;
        this.username = username;

        this.listener = listener;

    }

    getTime() {

        return Date.now() - this.start;

    }

    addAction(type: ActionType, action: string) {

        let entry = new TestEntry(type, action, this.getTime());

        this.entries.push(entry);

        return entry;

    }

    complete() {
        this.completed = true;

        var s = this.serialize();
        if (this.listener) {
            this.listener(s);
        }
    }

    serialize() {

        return JSON.stringify(this, (key, value) => { if (key == "listener") return undefined; else return value; });

    }

}

// if __main__ ...
if (typeof require !== 'undefined' && require.main === module) {
    
    var test = new UserTest("test", "test", (s:any) => { console.log(s); });
    test.addAction(ActionType.CLICK, "test");
    test.addAction(ActionType.KEY, "test");
    test.complete();

    // write to file
    var fs = require('fs');
    fs.writeFile("test.json", test.serialize(), function(err:any) {
        if(err) {
            return console.log(err);
        }
    
        console.log("The file was saved!");
    });

}