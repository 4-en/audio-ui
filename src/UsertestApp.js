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
    let obj = {
      name: this.name,
      task: this.task,
      start: this.start,
      end: this.end,
      durationSeconds: this.durationSeconds,
      entries: this.entries
    };

    return obj;
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

    this.totalDurationSeconds = 0;

    this.device = "desktop";
    // get device type
    if (navigator.userAgent.indexOf("Mobile") !== -1) {
      this.device = "mobile";
    }
    // get os
    if (navigator.userAgent.indexOf("Windows") !== -1) {
      this.os = "windows";
    } else if (navigator.userAgent.indexOf("Mac") !== -1) {
      this.os = "mac";
    } else if (navigator.userAgent.indexOf("Linux") !== -1) {
      this.os = "linux";
    } else {
      this.os = "unknown";
    }

    // adnroid or ios
    if (navigator.userAgent.indexOf("Android") !== -1) {
      this.os = "android";
    } else if (navigator.userAgent.indexOf("iPhone") !== -1) {
      this.os = "ios";
    }

    // get browser
    if (navigator.userAgent.indexOf("Chrome") !== -1) {
      this.browser = "chrome";
    } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
      this.browser = "firefox";
    } else if (navigator.userAgent.indexOf("Safari") !== -1) {
      this.browser = "safari";
    } else if (navigator.userAgent.indexOf("Edge") !== -1) {
      this.browser = "edge";
    } else if (navigator.userAgent.indexOf("Opera") !== -1) {
      this.browser = "opera";
    } else {
      this.browser = "unknown";
    }


    this.setText = setText;
    this.setButton = setButton;

    this.formsUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdVMQ5gXZqCEEdCp3EwwfFmIYa19t1Kd4JXuki-udVeawdAtA/viewform?usp=pp_url";

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
     this.tasks.push(new UserTask("Play Series Precise Flora and Zany Adaptation", "Find and play a title of the series \"Precise Flora and Zany Adaptation\"", (action) => { 
      if (action.type === ActionType.CLICK && action.name === "playButton" && action.series === "Precise Flora and Zany Adaptation") {
        return true;
      }
      return false;
     }));
     this.tasks.push(new UserTask("Play oldest western", "Find and play the oldest western title", (action) => { 
      if (action.type === ActionType.CLICK && action.name === "playButton" && action.title === "Joshua Harris") {
        return true;
      }
      return false;
     }));
     this.tasks.push(new UserTask("Play best podcast", "Find and play the highest rated podcast", (action) => { 
      if (action.type === ActionType.CLICK && action.name === "playButton" && action.title === "Giant Boasting") {
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
    // calc total time
    let totalTime = 0;
    for (let i = 0; i < this.tasks.length; i++) {
      totalTime += this.tasks[i].durationSeconds;
    }
    this.totalDurationSeconds = totalTime;
    // get data as json
    let data = this.serialize();
    data = JSON.stringify(data);

    // send data to api
    // fetch async
    fetch("https://audioui.eu.pythonanywhere.com/saveTest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      },
      body: data
    }).then((response) => {
      console.log(response);
      let reply = response.json();

    }).catch((error) => {
      console.log(error);
    });

    // show link to google form
    let formLink = this.formsUrl + "&entry.1277430276=" + this.userid

    // open form in new tab
    window.open(formLink, "_blank");
  }

  serialize() {
    let data = {
      userid: this.userid,
      tasks: [],
      device: this.device,
      os: this.os,
      browser: this.browser,
      totalDurationSeconds: this.totalDurationSeconds
    };

    for (let i = 0; i < this.tasks.length; i++) {
      data.tasks.push(this.tasks[i].serialize());
    }

    console.log(data);

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
      // scroll to top
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
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