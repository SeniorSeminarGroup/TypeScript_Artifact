/* 
10/1/24
Roland Locke

Original Document created following the "How to build Your First TypeScript Project" guide.
by: Web Dev Simplified
Link: https://www.youtube.com/watch?v=jBmrduvKl5w 


*/

import { v4 as uuidV4 } from "uuid"
import { Task, loadTasks, saveTasks } from './tasks/taskStorage';
import { addListItem, renderTasks } from './tasks/taskUI';

/* TimeInterval type to specify a length of time */
type TimeInterval = {
  hours: number;
  minutes: number;
  seconds: number;
};

class Timer {
  intervalID: number = -1;
  workTime: TimeInterval = { hours: 0, minutes: 0, seconds: 0 };
  breakTime: TimeInterval = { hours: 0, minutes: 0, seconds: 0 };
  isWorkTime: boolean = true;
  paused: boolean = false;
  currentInterval: TimeInterval = { hours: 0, minutes: 0, seconds: 0 };
  clock: HTMLSpanElement | null = null;

  constructor(workTime: TimeInterval, breakTime: TimeInterval, clock: HTMLSpanElement) {
    this.workTime = workTime;
    this.breakTime = breakTime;
    this.currentInterval = { ...workTime };
    this.clock = clock;
  }

  start() {
    this.intervalID = setInterval(() => this.clockCountDown(), 1000);
    this.paused = true;
    this.clockCountDown();
  }

  stop() {
    clearInterval(this.intervalID);
    this.paused = false;
    this.intervalID = -1
  }

  switchInterval() {
    if (this.isWorkTime) {
      this.isWorkTime = false
      this.currentInterval = { ...this.breakTime }
    } else {
      this.isWorkTime = true
      this.currentInterval = { ...this.workTime }
    }

    this.start()
  }

  reset() {
    this.currentInterval = this.workTime
  }

  getTime(): TimeInterval {
    return this.currentInterval
  }

  /* 
  Functionally this is a countDown timer.
  It needs a timer interval which is a TimeInterval type to countdown from.
  MUST INCLUDE an intervalID which points back to the setInterval that is calling it
  */
  clockCountDown() {
    this.clock!.innerHTML = formatTime(this.currentInterval)
    if (this.currentInterval.seconds > 0) {
      this.currentInterval.seconds = this.currentInterval.seconds - 1
    } else if (this.currentInterval.minutes > 0) {
      this.currentInterval.minutes = this.currentInterval.minutes - 1
      this.currentInterval.seconds = 59
    } else if (this.currentInterval.hours > 0) {
      this.currentInterval.hours = this.currentInterval.hours - 1
      this.currentInterval.minutes = 59
      this.currentInterval.seconds = 59
    } else { // current time interval finished 
      // end the timer interval
      this.stop()
      // switch time interval type
      this.switchInterval()
    }
  }
}


//new timer (created on page refresh)
const clock = document.querySelector<HTMLSpanElement>('#clock-time')
const newWorkTime: TimeInterval = { hours: 0, minutes: 0, seconds: 10 };
const newBreakTime: TimeInterval = { hours: 0, minutes: 0, seconds: 5 };
const newTimer = new Timer(newWorkTime, newBreakTime, clock!)

/* timer button logic and event listener */
const startStop = document.querySelector<HTMLButtonElement>("#start-stop-button")
startStop?.addEventListener("click", f => {

  if (newTimer.paused) {
    newTimer.stop()
    startStop.innerHTML = "Start"
  } else {
    newTimer.start()
    startStop.innerHTML = "Pause"
  }

})

/* place to store the Interval timer if paused */
let globalIntervalId: number = -1
/* place to save the time if user pauses the timer */
let saveTime: TimeInterval = { hours: 0, minutes: 0, seconds: 0 }
/* track if user is currently in work or break mode */
let workTime: boolean = true

/**
 * Format a TimeInterval object into a string
 * @param time - The TimeInterval object to format
 * @returns A string representing the formatted time
 */
function formatTime(time: TimeInterval): string {
  const hourString: string = time.hours > 9 ? String(time.hours) : "0" + time.hours;
  const minutesString: string = time.minutes > 9 ? String(time.minutes) : "0" + time.minutes;
  const secondsString: string = time.seconds > 9 ? String(time.seconds) : "0" + time.seconds;

  return hourString + ":" + minutesString + ":" + secondsString;
}

/* task logic */
const unfinishedList = document.querySelector<HTMLUListElement>("#unfinished-tasks-list");
const finishedList = document.querySelector<HTMLUListElement>("#finished-tasks-list");
const form = document.querySelector<HTMLFormElement>("#new-task-form");
const input = document.querySelector<HTMLInputElement>("#new-task-title");
const tasks: Task[] = loadTasks();
renderTasks(tasks, unfinishedList, finishedList);

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input?.value == "" || input?.value == null) return;

  const newTask: Task = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date(),
  };
  tasks.push(newTask);

  addListItem(newTask, unfinishedList);
  saveTasks(tasks);
  input.value = "";
});
