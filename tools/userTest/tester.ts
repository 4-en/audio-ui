enum ActionType {
    CLICK = "click",
    KEY = "key"
}



class Action {
    type: ActionType;
    action: string;
    time: number;

    constructor(type: ActionType, action: string, time: number) {
        this.type = type;
        this.action = action;
        this.time = time;
    }

}

class UserTask {
    name: string;
    task: string;
    start = Date.now();
    end = 0;
    durationSeconds = 0;
    entries: Action[] = [];
    completed = false;
    actionGoal: string;

    constructor(name: string, task: string, actionGoal: string) {
        this.name = name;
        this.task = task;
        this.actionGoal = actionGoal;
    }

    complete() {
        this.completed = true;
        this.end = Date.now();
        this.durationSeconds = (this.end - this.start) / 1000;
    }

    check(action: Action) {
        // add action to entries
        this.entries.push(action);

        if(!(this.actionGoal===action.action)) {
            return false;
        }
        this.complete();

        return true;
    }

    serialize() {
        return JSON.stringify(this);
    }

}

class Tester {
    userid: string;
    tasks: UserTask[] = [];
    currentTask: UserTask;
    formsUrl: string;

    constructor() {
        // generate a random userid
        this.userid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        this.formsUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdVMQ5gXZqCEEdCp3EwwfFmIYa19t1Kd4JXuki-udVeawdAtA/viewform?usp=sf_link";

        // create tasks
        this.tasks.push(new UserTask("Play LOTR1", "Find and play the title Lord of the Rings: The Fellowship of the Ring", "playButton_title"));

    }

    start() {
        this.currentTask = this.tasks[0];
    }

    end() {
        // send data to api

        // show link to google form
    }

    check(type: string, action: string) {
        let actionType = ActionType[type];
        let actionObj = new Action(actionType, action, Date.now());
        let res = this.currentTask.check(actionObj);
        if(res) {
            // 
    }
}

// if __main__ ...
if (typeof require !== 'undefined' && require.main === module) {
    

}