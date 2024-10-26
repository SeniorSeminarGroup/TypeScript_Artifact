import { TimeInterval } from "./TimeInterval"
import { formatTime } from "./TimeInterval"
import { toSeconds } from "./TimeInterval"
import { fromSeconds } from "./TimeInterval"

export class Timer {
    intervalID: number | NodeJS.Timeout= -1;
    workTime: TimeInterval = { hours: 0, minutes: 0, seconds: 0 };
    breakTime: TimeInterval = { hours: 0, minutes: 0, seconds: 0 };
    workColor: string = '#fad02c';
    breakColor:  string = '#469a49';
    isWorkTime: boolean = true;
    paused: boolean = false;
    currentInterval: TimeInterval = { hours: 0, minutes: 0, seconds: 0 };
    clock: HTMLSpanElement | null = null;
    clockGraphic: HTMLCanvasElement | null = null;
    body: HTMLElement = document.body;
    colorChangeCallback: (newColor: string) => void;
  
    constructor(workTime: TimeInterval, breakTime: TimeInterval, clock: HTMLSpanElement, colorChangeCallback: (newColor: string) => void, clockGraphic?: HTMLCanvasElement, workColor?: string, breakColor?: string) {
        this.workTime = workTime;
        this.breakTime = breakTime;
        this.currentInterval = { ...workTime};
        this.clock = clock;
        this.workColor = workColor ? workColor : this.workColor;
        this.breakColor = breakColor ? breakColor : this.breakColor;
        this.clockGraphic = clockGraphic ? clockGraphic : this.clockGraphic;
        this.body.style.backgroundColor = this.workColor;
        this.colorChangeCallback = colorChangeCallback

        this.updateClockGraphic(this.getTime(), this.getCurrentInterval())
    }
  
    start() {
        // This there an error for you guys here?
        // Yes, but it still works
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
            this.colorChangeCallback(this.breakColor)
        } else {
            this.isWorkTime = true
            this.currentInterval = { ...this.workTime }
            this.colorChangeCallback(this.workColor)
        }

        this.start()
    }
  
    reset() {
      this.currentInterval = { ...this.workTime }
      this.isWorkTime = true
      this.clock!.innerHTML = formatTime(this.currentInterval)
      this.colorChangeCallback(this.workColor)

      this.updateClockGraphic(this.getTime(), this.getCurrentInterval())
    }
  
    getTime(): TimeInterval {
      return this.currentInterval
    }

    getCurrentInterval(): TimeInterval {
        if(this.isWorkTime) {
            return this.workTime;
        } else {
            return this.breakTime;
        }
      }
  
    setWorkInterval(theInterval: TimeInterval) {
        this.workTime = theInterval;
        this.currentInterval = { ...this.workTime};
    }

    setBreakInterval(theInterval: TimeInterval) {
        this.breakTime = theInterval;
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
        this.updateClockGraphic(this.getTime(), this.getCurrentInterval())
    }

    updateClockGraphic(currentTime: TimeInterval, startTime: TimeInterval) {
        const ctx = this.clockGraphic!.getContext('2d');

        const currentTimeSeconds = toSeconds(currentTime)
        const startTimeSeconds = toSeconds(startTime)
    
        const elapsedTime = currentTimeSeconds-startTimeSeconds;
        const percentage = elapsedTime / startTimeSeconds;

        if(ctx != null){ 
            ctx.clearRect(0, 0, this.clockGraphic!.width, this.clockGraphic!.height);
            ctx.beginPath();
            ctx.arc(250, 250, 250, 0, 2 * Math.PI);
            ctx.fillStyle = '#D3D3D3';
            ctx.fill();
            const endAngle = (percentage * 2 * Math.PI) - 0.5 * Math.PI;
            ctx.beginPath();
            ctx.moveTo(250, 250);
            ctx.arc(250, 250, 250, -0.5 * Math.PI, endAngle);
            ctx.fillStyle = '#007BFF';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(250, 250, 200, 0, 2 * Math.PI);
            ctx.fillStyle = '#FFB400'; 
            ctx.fill();

            const remainingTime = Math.max(0, 0 - currentTimeSeconds);
        }
    }
  }