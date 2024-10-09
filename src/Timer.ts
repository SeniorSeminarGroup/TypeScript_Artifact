import { v4 as uuidV4 } from "uuid"
import { TimeInterval } from "./TimeInterval"
import { formatTime } from "./TimeInterval"

export class Timer {
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
        this.currentInterval = { ...workTime};
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
  
    setColor(workColor: string, breakColor: string) {
       //this is just so we can change the background color in different intervals
       const body = document.body;
       if (this.isWorkTime) {
           body.style.backgroundColor = workColor
       } else {
           body.style.backgroundColor = breakColor
       }
    }
  
    /* 
    Functionally this is a countDown timer.
    It needs a timer interval which is a TimeInterval type to countdown from.
    MUST INCLUDE an intervalID which points back to the setInterval that is calling it
    */
    clockCountDown() {
        this.clock!.innerHTML = formatTime(this.currentInterval)
        this.setColor('#42f57b','lightblue')
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