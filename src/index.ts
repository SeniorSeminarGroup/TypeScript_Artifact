/* 
10/1/24
Roland Locke

Original Document created following the "How to build Your First TypeScript Project" guide.
by: Web Dev Simplified
Link: https://www.youtube.com/watch?v=jBmrduvKl5w 


*/

import { v4 as uuidV4 } from "uuid"

/* Task type to specify a task */
type Task = {
  id: string,
  title: string,
  completed: boolean,
  createdAt: Date,
}

/* Timeinterval type to specify a length of time */
type TimeInterval = {
  hours: number,
  minutes: number,
  seconds: number
}

class Timer {
  intervalID: number = -1;
  workTime: TimeInterval = { hours: 0, minutes: 0, seconds: 0 };
  breakTime: TimeInterval = { hours: 0, minutes: 0, seconds: 0 };
  isWorkTime: boolean = true;
  currentInterval: TimeInterval = { hours: 0, minutes: 0, seconds: 0 };
  clock = document.querySelector<HTMLSpanElement>('#clock-time')

  constructor(workTime: TimeInterval, breakTime: TimeInterval) {
      this.workTime = workTime;
      this.breakTime = breakTime;
      this.currentInterval = { ...workTime};
  }

  start() {
    this.intervalID = setInterval(() => this.clockCountDown(), 1000);
    this.clockCountDown();
  }

  stop() {
      clearInterval(this.intervalID);
      this.intervalID = -1
  }

  reset() {

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

/* task logic */
const list = document.querySelector<HTMLUListElement>("#list")
const form = document.querySelector("#new-task-form") as HTMLFormElement | null
const input = document.querySelector<HTMLInputElement>("#new-task-title")

//new timer (created on page refresh)
const newWorkTime: TimeInterval = { hours: 0, minutes: 0, seconds: 10 };
const newBreakTime: TimeInterval = { hours: 0, minutes: 0, seconds: 5 };
const newTimer = new Timer(newWorkTime, newBreakTime)

/* timer button logic and event listener */
const startStop = document.querySelector<HTMLButtonElement>("#start-stop-button")
startStop?.addEventListener("click", f => newTimer.start())

/* place to store the Interval timer if paused */
let globalIntervalId: number = -1
/* place to save the time if user pauses the timer */
let saveTime: TimeInterval = {hours: 0, minutes: 0, seconds: 0}
/* track if user is currently in work or break mode */
let workTime:boolean = true

const tasks: Task[] = loadTasks()
tasks.forEach(addListItem)

form?.addEventListener("submit", e => {
  e.preventDefault()

  if (input?.value == "" || input?.value == null) return

  const newTask: Task = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date()
  }
  tasks.push(newTask)

  addListItem(newTask)
  input.value = ""
})

function addListItem(task: Task): boolean {
  const item = document.createElement("li")
  const label = document.createElement("label")
  const checkbox = document.createElement("input")
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked
    saveTasks()
  })
  checkbox.type = "checkbox"
  checkbox.checked = task.completed
  label.append(checkbox, task.title)
  item.append(label)
  list?.append(item)

  return true
}

function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks))
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS")
  if(taskJSON == null) return []

  return JSON.parse(taskJSON)
}

/* 
Formats time into a string, accepts the TimeInterval type. 
Please use this when you want to display the time
*/
function formatTime(time: TimeInterval): string
{
  const hourString: string = (time.hours > 9)? String(time.hours): '0'+time.hours
  const minutesString: string = (time.minutes > 9)? String(time.minutes): '0'+time.minutes
  const secondsString: string = (time.seconds > 9)? String(time.seconds): '0'+time.seconds

  return hourString + ":" + minutesString + ":" + secondsString
}