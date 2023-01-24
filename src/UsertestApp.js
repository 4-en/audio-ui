import React from 'react';
import './reset.css';
import './usertest.css';

const ActionType = {
  CLICK: "CLICK",
  KEY: "KEY"
};



class Action {

  constructor(type, name, time) {
    this.type = type;
    this.name = name;
    this.time = time;
  }

}

class UserTask {

  constructor(name, task, completionChecker) {
    this.start = 0;
    this.name = name;
    this.task = task;
    this.completionChecker = completionChecker;
    this.failureChecker = null;

    this.end = 0;
    this.durationSeconds = 0;
    this.entries = [];
    this.completed = false;
    this.failed = false;

  }

  startTask() {
    this.start = Date.now();
  }

  complete() {
    this.completed = true;
    this.end = Date.now();
    this.durationSeconds = (this.end - this.start) / 1000;
  }

  check(action) {
    // add action to entries
    this.entries.push(action);

    if (!(this.completionChecker(action))) {
      return false;
    }

    if (this.failureChecker && this.failureChecker(action)) {
      this.failed = true;
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

  constructor(setText, setButton) {
    // generate a random userid
    this.userid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.tasks = [];
    this.currentTask = -1;
    this.started = false;
    this.running = false;
    this.finished = false;

    this.setText = setText;
    this.setButton = setButton;

    this.formsUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdVMQ5gXZqCEEdCp3EwwfFmIYa19t1Kd4JXuki-udVeawdAtA/viewform?usp=sf_link";

    // create tasks
    this.tasks.push(new UserTask("Play LOTR1", "Find and play the title Lord of the Rings: The Fellowship of the Ring", (action) => { 
      if (action.type === ActionType.CLICK && action.name === "playButton" && action.title === "The Fellowship of the Ring") {
        return true;
      }
      return false;
     }));
    this.tasks.push(new UserTask("Play any Podcast", "Find and play a podcast", (action) => { 
      if (action.type === ActionType.CLICK && action.name === "playButton" && action.entryType === "podcast") {
        return true;
      }
      return false;
     }));
    this.tasks.push(new UserTask("Play Horror and Sci-Fi", "Find and play a horror and sci-fi title", (action) => { 
      if (action.type === ActionType.CLICK && action.name === "playButton" && action.categories.includes("horror") && action.categories.includes("sci-fi")) {
        return true;
      }
      return false;
     }));


  }

  getCurrentTask() {
    return this.tasks[this.currentTask];
  }

  start() {
    if (this.started) {
      return;
    }
    this.started = true;
    this.running = true;
    this.currentTask = 0;
    this.tasks[this.currentTask].startTask();

    this.updateUI();
  }

  continue() {
    if(!this.started) {
      this.start();
      return;
    }
    if (this.finished || this.running) {
      return;
    }

    this.running = true;
    this.tasks[this.currentTask].startTask();

    this.updateUI();
  }

  end() {
    this.running = false;
    this.finished = true;
    // get data as json
    let data = this.serialize();
    console.log(data);

    // send data to api
    // fetch async
    fetch("http://audioui.eu.pythonanywhere.com/saveTest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: {
        data: data
      }
    }).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    });

    // show link to google form
    let formLink = this.formsUrl + "&entry.2005620554=" + this.userid

    // open form in new tab
    window.open(formLink, "_blank");
  }

  serialize() {
    let data = {
      userid: this.userid,
      tasks: []
    };

    for (let i = 0; i < this.tasks.length; i++) {
      data.tasks.push(this.tasks[i].serialize());
    }

    return data;
  }

  updateUI() {

    var buttonText = "Start";
    if (this.started) {
      buttonText = "Next";
    }

    var taskText = "Press start to begin the test";
    if (this.started) {
      if (this.running) {
        taskText = this.getCurrentTask().task;
      } else {
        taskText = "Continue to the next task";
      }
    }

    if (this.finished) {
      taskText = "Thank you for participating in the test";
    }

    this.setText(taskText);
    this.setButton(buttonText);


  }

  callback(payload) {
    // create action object from payload
    // check if type is defined
    if (payload.type === undefined) {
      return;
    }

    if (ActionType[payload.type] === undefined) {
      return;
    }

    // check if name is defined
    if (payload.name === undefined) {
      return;
    }

    // create action
    let action = new Action(payload.type, payload.name, Date.now());

    // add additional data from payload to action
    for (let key in payload) {
      if (key === "type" || key === "name") {
        continue;
      }
      action[key] = payload[key];
    }

    // pass action to check
    this.check(action);

    // update ui if needed
    this.updateUI();

  }

  check(action) {
    if (!this.started || !this.running || this.finished) {
      return;
    }

    let res = this.getCurrentTask().check(action);
    if (res) {
      // task is completed
      try {
        window.resetApp();
      } catch (e) {
        console.log("resetApp not defined");
      }
      // check if there are more tasks
      if (this.currentTask + 1 < this.tasks.length) {
        this.running = false;
        this.currentTask++;
      } else {
        // no more tasks
        this.end();
      }
    } else {
      // check if failed
      if (this.currentTask.failed) {
        // task failed
      }
    }
  }
}

function UsertestApp(props) {

  const [title, setTitle] = React.useState("testTitle");
  const [text, setText] = React.useState("Press start to begin the test");
  const [bText, setBText] = React.useState("Start");

  const [tester, setTester] = React.useState(new Tester(setText, setBText));

  props.listeners.push((payload) => { tester.callback(payload); });

  function handleClick() {
    tester.continue();
  }


  return (
    <div className='usertest'>
      <h1>Usertest</h1>
      <div className="usertest-main">
        <div className="usertest-task">{text}</div>
        {tester.running || tester.finished ? "" : <button className="usertest-button" onClick={handleClick}>{bText}</button>}
      </div>
    </div>
  );
}

export default UsertestApp;