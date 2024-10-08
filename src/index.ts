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

/* task logic */
const list = document.querySelector<HTMLUListElement>("#list")
const form = document.querySelector("#new-task-form") as HTMLFormElement | null
const input = document.querySelector<HTMLInputElement>("#new-task-title")

/* timer button tags */
const clock = document.querySelector<HTMLSpanElement>('#clock-time')
const startStop = document.querySelector<HTMLButtonElement>("#start-stop-button")
startStop?.addEventListener("click", clockStartStop)

/* place to store the Interval timer if paused */
let globalIntervalId: number = -1
/* place to save the time if user pauses the timer */
let saveTime: TimeInterval = {hours: 0, minutes: 0, seconds: 0}
/* track if user is currently in work or break mode */
let workTime:boolean = true

let workTimeLength: TimeInterval = {hours: 0, minutes: 25, seconds: 0}
let breakTimeLength: TimeInterval = {hours: 0, minutes: 5, seconds: 0}

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

const timeSet = document.querySelector<HTMLButtonElement>("#set-break")
timeSet?.addEventListener("click", setTimeLength)

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
Starts and stops the timer. 

If globalIntervalId is populated:
  then a timers is currently running
  -clear the currently counting timer
If saveTime Interval is populated with a time greater than 00:00:00:
  then a timer is in the pause state,
  -create a new setInterval with the given saveTime
  -save the interval ID to globalIntervalID
Else No timer was previously running:
  -set the current interval based on the workTime variable
  -create a new setInterval that counts down every second calling clockCountDown each second
*/
function clockStartStop() {
  // this would be where we get the time interval via some function
  // ex:  workTime = <TimeInterval> 
  //      breakTime = <TimeInterval>

  if(globalIntervalId != -1){ // pause the timer
    clearInterval(globalIntervalId);
    globalIntervalId = -1

    startStop!.innerHTML = "Start"
  }
  else if (saveTime.seconds>0 || saveTime.minutes>0 || saveTime.hours>0 || saveTime == null) { //un-pause the timer
    const intervalID = setInterval(() => clockCountDown(saveTime, intervalID), 1000); // 
    globalIntervalId = intervalID // save the current interval ID
    clockCountDown(saveTime, intervalID); //

    startStop!.innerHTML = "Pause"
  }
  else{ // if nothing has been saved in global variables, then this creates a brand new timer and variables

    //placeholder intervals, in the future, the workInterval and breakInterval will be passed into the clockStartStop function.
    //in this case, we can just move this else case out of the clockStartStop function and overload the function with a workInterval and breakInterval functions.
    const workInterval: TimeInterval = workTimeLength
    const breakInterval: TimeInterval = breakTimeLength

    //set 
    let currentInterval; 
    if(workTime){
      currentInterval = workInterval
    }else{
      currentInterval = breakInterval
    }

    //creates an interval that called clockCountDown every second.
    const intervalID = setInterval(() => clockCountDown(currentInterval, intervalID), 1000);
    globalIntervalId = intervalID

    // this call seems useless, but without it the timer wont immediatly update. Keeping it in to help the user better understand that the timer has began
    clockCountDown(currentInterval, intervalID);

    startStop!.innerHTML = "Pause"
  }
}

/* 
Functionally this is a countDown timer.
It needs a timer interval which is a TimeInterval type to countdown from.
MUST INCLUDE an intervalID which points back to the setInterval that is calling it
*/
function clockCountDown(interval: TimeInterval, intervalID: number) {
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
    // switch time interval type
    if(workTime){
      workTime = false
    }else{
      workTime = true
    }
    // start next time interval
    clockStartStop()
  }
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

/**
 * 
 */
function setTimeLength() {
  const work_time_minutes = Number(document.querySelector<HTMLInputElement>("#work-length")?.value)
  const break_time_minutes = Number(document.querySelector<HTMLInputElement>("#break-length")?.value)

  if (work_time_minutes==null || work_time_minutes==0){
    const work_hours: number = 0
    const work_minutes: number = 15
    const work_seconds: number = 0
  }
  if (break_time_minutes==null || break_time_minutes==0){
    const break_hours: number = 0
    const break_minutes: number = 7
    const break_seconds: number = 0
  }

  const work_hours: number = Math.floor(work_time_minutes / 60)
  const work_minutes: number = Math.floor(work_time_minutes % 60)
  const work_seconds: number = Math.floor((work_time_minutes*60) % 60)

  const break_hours: number = Math.floor(work_time_minutes / 60)
  const break_minutes: number = Math.floor(work_time_minutes % 60)
  const break_seconds: number = Math.floor((work_time_minutes*60) % 60)
  
  workTimeLength = {hours: work_hours, minutes: work_minutes, seconds: work_seconds}
  breakTimeLength = {hours: break_hours, minutes: work_minutes, seconds: work_seconds}

  clock!.innerHTML = formatTime(workTimeLength)
}