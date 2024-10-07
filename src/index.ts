/* 
10/1/24
Roland Locke

Original Document created following the "How to build Your First TypeScript Project" guide.
by: Web Dev Simplified
Link: https://www.youtube.com/watch?v=jBmrduvKl5w 


*/

import { v4 as uuidV4 } from "uuid"

type Task = {
  id: string,
  title: string,
  completed: boolean,
  createdAt: Date,
}

type TimeInterval = {
  hours: number,
  minutes: number,
  seconds: number
}

const list = document.querySelector<HTMLUListElement>("#list")
const form = document.querySelector("#new-task-form") as HTMLFormElement | null
const input = document.querySelector<HTMLInputElement>("#new-task-title")

const startStop = document.querySelector<HTMLButtonElement>("#start-stop-button")
startStop?.addEventListener("click", clockStartStop)

let globalIntervalId: number = -1
let saveTime: TimeInterval = {hours: 0, minutes: 0, seconds: 0}
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

function clockStartStop() {
  
  // this would be where we get the time interval via some function
  // ex:  workTime = <TimeInterval> 
  //      breakTime = <TimeInterval>

  if(globalIntervalId != -1){
    clearInterval(globalIntervalId);
    globalIntervalId = -1
  }
  else if (saveTime.seconds>0 || saveTime.minutes>0 ||saveTime.hours>0 || saveTime == null) {
    const intervalID = setInterval(() => clockCountDown(saveTime, intervalID), 1000);
    globalIntervalId = intervalID
    clockCountDown(saveTime, intervalID);
  }
  else{
  const workInterval: TimeInterval = {hours: 0, minutes: 0, seconds: 5}
  const breakInterval: TimeInterval = {hours: 0, minutes: 0, seconds: 10}

  let currentInterval;
  if(workTime){
    currentInterval = workInterval
  }else{
    currentInterval = breakInterval
  }

  const intervalID = setInterval(() => clockCountDown(currentInterval, intervalID), 1000);
  globalIntervalId = intervalID


  clockCountDown(currentInterval, intervalID);
  }
}

function clockCountDown(interval: TimeInterval, intervalID: number) {
  const clock = document.querySelector<HTMLSpanElement>('#clock-time')
  clock!.innerHTML = formatTime(interval)
  saveTime = interval
  
  if(interval.seconds > 0) {
    interval.seconds = interval.seconds - 1
  } else if (interval.minutes > 0) {
    interval.minutes = interval.minutes - 1
    interval.seconds = 59
  } else if (interval.hours > 0) {
    interval.hours = interval.hours - 1
    interval.minutes = 59
    interval.seconds = 59
  } else { // current time interval finished 
    
    // change current time to all 0s
    clock!.innerHTML = formatTime(interval)
    // end the timer interval
    clearInterval(intervalID);
    // set global to -1 to signify no current interval running
    globalIntervalId = -1
    // switch time
    if(workTime){
      workTime = false
    }else{
      workTime = true
    }
    // start next time interval
    clockStartStop()
  }
}


function formatTime(time: TimeInterval): string
{
  console.log(time)
  const hourString: string = (time.hours > 9)? String(time.hours): '0'+time.hours
  const minutesString: string = (time.minutes > 9)? String(time.minutes): '0'+time.minutes
  const secondsString: string = (time.seconds > 9)? String(time.seconds): '0'+time.seconds

  return hourString + ":" + minutesString + ":" + secondsString
}